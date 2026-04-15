# Plugin Install Workflow

The mechanical sequence for applying a single plugin upgrade. Safety-critical — writes to the running Indigo install.

First installs must go through Indigo's UI (double-click registers the bundle with the server). This workflow only handles updates to already-registered bundles: rsync over the existing `Contents/` and the Indigo server picks up the new code on restart.

## Prerequisites

Before calling this workflow:
- `mcp__indigo__list_plugins` has returned an entry for the target bundle ID (updates only)
- Phase 2 resolved an upstream source (GitHub or store) with a `download_url`
- Phase 4 confirmed installed version is strictly less than upstream
- Phase 5 — user explicitly confirmed this plugin or `all`

If any of those aren't true, do not run.

## Step-by-step sequence

### 1. Prepare temp dirs

```bash
TMPDIR=$(mktemp -d)
DOWNLOAD_DIR="$TMPDIR/download"
STAGE_DIR="$TMPDIR/stage"
mkdir -p "$DOWNLOAD_DIR" "$STAGE_DIR"
```

Track `$TMPDIR` for cleanup in step 9.

### 2. Download the bundle

**GitHub source:**

```bash
gh release download "$TAG" \
    --repo "$USER/$REPO" \
    --pattern '*.indigoPlugin.zip' \
    --dir "$DOWNLOAD_DIR"
```

Pass the tag explicitly (don't omit it) so the release can't be updated mid-run under our feet. Note: if the repo has no published releases, `gh api` in Phase 2 returns 404; the plugin should already have been classified as unresolved before we got here.

**Store source:**

```bash
curl -L -f -o "$DOWNLOAD_DIR/bundle.zip" "$DOWNLOAD_URL"
```

`-f` → exit non-zero on HTTP errors (401/403/404/5xx). `-L` → follow redirects (GitHub release assets redirect through a CDN).

Assert exactly one `.zip` landed in `$DOWNLOAD_DIR`:

```bash
ZIP_COUNT=$(find "$DOWNLOAD_DIR" -maxdepth 1 -name '*.zip' | wc -l | tr -d ' ')
[ "$ZIP_COUNT" = "1" ] || { echo "expected 1 zip, got $ZIP_COUNT"; exit 1; }
ZIP_PATH=$(find "$DOWNLOAD_DIR" -maxdepth 1 -name '*.zip' | head -1)
```

### 3. Unzip into staging

```bash
unzip -q -o "$ZIP_PATH" -d "$STAGE_DIR"
STAGED_BUNDLE=$(find "$STAGE_DIR" -maxdepth 1 -name '*.indigoPlugin' -type d | head -1)
[ -n "$STAGED_BUNDLE" ] || { echo "no .indigoPlugin bundle in zip"; exit 1; }
```

If no bundle is found at the top level of `$STAGE_DIR`, fail this plugin — treat as a corrupted or wrong-artifact download.

### 4. Verify bundle identifier (critical safety check)

```bash
STAGED_BUNDLE_ID=$(/usr/libexec/PlistBuddy -c "Print :CFBundleIdentifier" "$STAGED_BUNDLE/Contents/Info.plist")
```

Assert `STAGED_BUNDLE_ID == $EXPECTED_BUNDLE_ID` (from `mcp__indigo__list_plugins`). If it doesn't match:

- Log the mismatch with both IDs
- Do **not** rsync
- Mark this plugin's upgrade as failed
- Continue to the next plugin

This check guards against wrong-bundle substitution — a download URL pointing at a different plugin than expected (cache typo, store misconfiguration, upstream compromise). Without it, rsync would silently replace a totally unrelated plugin.

### 5. Verify version (soft check)

```bash
STAGED_VERSION=$(/usr/libexec/PlistBuddy -c "Print :PluginVersion" "$STAGED_BUNDLE/Contents/Info.plist")
```

Compare `STAGED_VERSION` to what the upstream source advertised. Mismatch → log a warning and continue (upstream may have published a new release between check and apply — not a hard fail). The final installed version shows up in Phase 7.

### 6. Deploy via rsync

Destination is the `path` field from `mcp__indigo__list_plugins` or `mcp__indigo__get_plugin_by_id`. **Do not hardcode** — always read from MCP. This is what makes the skill portable across different Indigo installs.

```bash
rsync -av --delete "$STAGED_BUNDLE/Contents/" "$INSTALLED_PATH/Contents/"
```

Trailing slashes matter: `.../Contents/` → `.../Contents/` copies contents rather than nesting. `--delete` removes files present in the old bundle but not the new one, so removed-upstream files don't linger.

If rsync fails (permission denied, disk full, target not found), fail this plugin and continue. **Do not sudo.** If the user running this skill doesn't own the Plugins folder, the Indigo server is running as a different user and the permissions need to be resolved manually.

### 7. Restart the plugin

```text
mcp__indigo__restart_plugin(plugin_id=$BUNDLE_ID)
```

### 8. Verify startup

Two checks. The **version check is the primary success signal**; the log check is a secondary sanity pass because the exact `TypeVal` severity mapping isn't well-documented and shouldn't be the sole oracle.

**Version check (primary):**

```text
mcp__indigo__get_plugin_by_id(plugin_id=$BUNDLE_ID)
```

Poll until the returned `version` field matches the new upstream version (with a ~15s timeout). Be lenient: `get_plugin_by_id` can return `CFBundleVersion` (e.g. `2.0.0`) rather than `PluginVersion` depending on the plugin. If there's ambiguity, read `$INSTALLED_PATH/Contents/Info.plist` directly via `/usr/libexec/PlistBuddy -c "Print :PluginVersion"` and compare.

If the polled version never matches within the timeout → treat as a failed upgrade.

**Log check (secondary):**

```text
mcp__indigo__query_event_log(line_count=50)
```

Each entry has `Message`, `TypeVal`, `TypeStr`, `TimeStamp`. Scan for:

- Success marker: a recent `Application`-type entry (`TypeStr="Application"`) with `Message` starting `"Started plugin \"<name> <version>\""` that references this bundle's display name
- Potential failure: any entry whose `TypeStr` starts with `"Web Server Warning"` or contains the word `"Error"`, or any entry whose `TypeStr` matches the plugin's display name and whose message contains `error`/`exception`/`traceback`

Treat missing success marker as inconclusive, not failed, if the version check already passed. Treat a version-check failure as a failed upgrade regardless of what the log says.

If the upgrade rsync'd cleanly but the new code throws errors after restart, report the failure. **Do not roll back** — rollback is out of scope for v1; let the user decide whether to revert.

### 9. Cleanup

```bash
rm -rf "$TMPDIR"
```

Always run this, even on failure.

## What can go wrong

| Failure mode | Where | Recovery |
|--------------|-------|----------|
| 404 downloading asset | Step 2 | Upstream release deleted or URL changed; refresh store cache or recheck GitHub releases |
| Zip has no `.indigoPlugin` directory | Step 3 | Corrupted or wrong-artifact download; fail this plugin |
| Bundle identifier mismatch | Step 4 | Cached metadata wrong; don't rsync, fail this plugin |
| rsync permission denied | Step 6 | Indigo filesystem perms problem — user must resolve manually; continue with other plugins |
| Plugin restart hangs | Step 7 | MCP `restart_plugin` has its own timeout; if it never returns, report "restart uncertain" and let the user check Indigo's UI |
| Log shows errors after restart | Step 8 | Upgrade is applied but new code misbehaves; mark failed, suggest checking release notes for config migration steps |
