# Plugin Install Workflow

The mechanical sequence for applying a single plugin upgrade. This is the most safety-critical part of the skill — it writes to the running Indigo install.

## Prerequisites

Before calling into this workflow for any plugin, the following must be true:
- `mcp__indigo__list_plugins` has already returned an entry for the target bundle ID (we only update plugins that are already installed)
- Phase 2 resolved an upstream source (GitHub or store) and captured a `download_url`
- Phase 4 confirmed the installed version is strictly less than the advertised upstream version
- Phase 5 — the user explicitly confirmed this specific plugin or "all"

If any of those aren't true, this workflow must not run.

## Why copying works for updates but not first installs

Indigo installs a plugin the first time via a double-click in the Finder, which triggers the Indigo app to register the bundle with the server. Once registered, subsequent updates to that same bundle can be applied by overwriting the bundle contents in the `Plugins/` directory — no re-registration is needed. This is an explicit rule in the workspace CLAUDE.md and has been confirmed empirically with netro, reflector-logs, and others.

**Consequence for this skill**: never create a new `<Name>.indigoPlugin/` directory that didn't exist before. If we're about to rsync into a path that doesn't already hold a registered plugin, stop and tell the user to install it manually via Indigo.

## Step-by-step sequence

### 1. Prepare temp dirs

```bash
TMPDIR=$(mktemp -d)
DOWNLOAD_DIR="$TMPDIR/download"
STAGE_DIR="$TMPDIR/stage"
mkdir -p "$DOWNLOAD_DIR" "$STAGE_DIR"
```

Track `$TMPDIR` for cleanup in step 8 — always clean up, even on failure.

### 2. Download the bundle

**GitHub source:**

```bash
gh release download <tag> \
    --repo <user>/<repo> \
    --pattern '*.indigoPlugin.zip' \
    --dir "$DOWNLOAD_DIR"
```

If `<tag>` is omitted, `gh` downloads the latest release. For this skill, pass the tag explicitly to guard against the release being updated mid-run.

**Store source:**

```bash
curl -L -f -o "$DOWNLOAD_DIR/bundle.zip" <download_url>
```

Use `-f` so `curl` exits non-zero on HTTP errors (401/403/404/5xx). `-L` follows redirects — GitHub release asset URLs redirect through a CDN.

Both paths must end with exactly one `.zip` file in `$DOWNLOAD_DIR`. Assert that and fail this plugin's upgrade otherwise.

### 3. Unzip into staging

```bash
unzip -q -o "$DOWNLOAD_DIR"/*.zip -d "$STAGE_DIR"
```

Expect a single `<PluginName>.indigoPlugin/` directory at the top level of `$STAGE_DIR`. Find it:

```bash
STAGED_BUNDLE=$(find "$STAGE_DIR" -maxdepth 2 -name '*.indigoPlugin' -type d | head -1)
```

If nothing is found, or more than one bundle is present, fail this plugin's upgrade.

### 4. Verify bundle identifier (critical safety check)

```bash
STAGED_BUNDLE_ID=$(/usr/libexec/PlistBuddy -c "Print :CFBundleIdentifier" "$STAGED_BUNDLE/Contents/Info.plist")
```

Assert `STAGED_BUNDLE_ID == <expected bundle ID from MCP>`. If it doesn't match:

- Log the mismatch at error level with both IDs
- Do **not** proceed to rsync
- Mark this plugin's upgrade as failed
- Continue to the next plugin in the batch

This check protects against wrong-bundle substitution — a scenario where a download URL points at a different plugin than expected (store misconfiguration, typo in the cache, malicious upstream, etc.). Without this check, rsync would happily replace a totally unrelated plugin's files.

### 5. Verify version (soft check)

```bash
STAGED_VERSION=$(/usr/libexec/PlistBuddy -c "Print :PluginVersion" "$STAGED_BUNDLE/Contents/Info.plist")
```

Assert `STAGED_VERSION` matches what the upstream source advertised. If it doesn't:

- Log a warning (the upstream may have published a new release between check and apply, which is fine)
- Do not fail — continue to rsync

The user will see the actual installed version in Phase 7.

### 6. Deploy via rsync

The destination is the `path` field from `mcp__indigo__list_plugins` / `mcp__indigo__get_plugin_by_id`. **Do not hardcode** a destination path — always use what MCP reports. This is what makes the skill portable across different Indigo installs.

```bash
rsync -av --delete "$STAGED_BUNDLE/Contents/" "<installed_path>/Contents/"
```

Notes:
- Trailing slashes matter: `.../Contents/` → `.../Contents/` copies contents rather than nesting
- `--delete` removes files present in the old bundle but not the new one — important for clean upgrades where a file was removed upstream
- If rsync fails (permission denied, disk full, target not found), fail this plugin and continue

**Do not try to sudo.** If rsync fails on permissions, the Indigo server isn't running under a user that owns the Plugins folder, and the user needs to resolve that themselves — don't escalate silently.

### 7. Restart the plugin

```
mcp__indigo__restart_plugin(plugin_id=<bundle_id>)
```

### 8. Verify startup

Two concurrent checks, both must pass within ~15 seconds:

**Version check:**

```
mcp__indigo__get_plugin_by_id(plugin_id=<bundle_id>)
```

Keep polling until the returned version string matches the new upstream version (or a short timeout). Be lenient on exact match — Indigo's `version` field sometimes returns `CFBundleVersion` (e.g. `2.0.0`) rather than `PluginVersion`. If the field format is ambiguous, fall back to reading `<path>/Contents/Info.plist` directly and compare `PluginVersion`.

**Log check:**

```
mcp__indigo__query_event_log(line_count=50)
```

Scan the entries for:
- A recent `"Started plugin \"<displayName> <version>\""` line — success marker
- Any `TypeStr` equal to the plugin's display name with `TypeVal` indicating error (1, 2, or 3) in the window since the restart — failure marker

If the success marker is present and no errors are seen, mark this plugin's upgrade as successful.

If errors appear, the upgrade rsync'd cleanly but the new code is misbehaving. Report the failure but **do not try to roll back** — rollback is out of scope for v1, and the user needs to decide whether to revert manually or fix the issue.

### 9. Cleanup

```bash
rm -rf "$TMPDIR"
```

Always run this, even on failure, to avoid leaving stale temp dirs around.

## What can go wrong

| Failure mode | Where | Recovery |
|--------------|-------|----------|
| 404 downloading asset | Step 2 | Upstream release was deleted or URL changed; refresh store cache or recheck GitHub releases |
| Zip has no `.indigoPlugin` directory | Step 3 | Treat as corrupted or wrong-artifact download; fail this plugin |
| Bundle identifier mismatch | Step 4 | Cached metadata is wrong; don't rsync, fail this plugin, suggest manual inspection |
| rsync permission denied | Step 6 | Indigo filesystem perms problem — user must resolve manually; continue with other plugins |
| Plugin restart hangs | Step 7 | MCP `restart_plugin` has its own timeout; if it never returns, fall back to reporting "restart uncertain" and let the user check Indigo's UI |
| Log shows errors after restart | Step 8 | Upgrade is applied but the new code doesn't work on this setup; mark failed, suggest the user check the plugin's release notes for config migration steps |

## What must NOT happen

- **No hardcoded paths.** Every destination comes from MCP. If the MCP call fails, the whole Phase 6 fails for that plugin — do not fall back to guessing.
- **No downgrades.** If the user asks for a specific version that's older than installed, refuse and explain.
- **No first installs.** If the target bundle doesn't already exist at `<installed_path>`, stop and tell the user to install via Indigo UI.
- **No batched rsync.** Each plugin is handled and verified independently before moving to the next. This keeps failures isolated.
- **No skipping the bundle-ID safety check.** It exists to prevent catastrophic wrong-bundle replacement.
