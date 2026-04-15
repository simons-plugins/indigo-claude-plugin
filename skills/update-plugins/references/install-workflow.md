# Plugin Install Workflow

The mechanical sequence for applying a single plugin upgrade. Safety-critical — writes to the running Indigo install.

First installs go through Indigo's UI (double-click registers the bundle). This workflow only handles updates to already-registered bundles: stop the plugin, rsync over the existing `Contents/`, start it again, verify. The Indigo server picks up the new code on restart.

## Prerequisites

Before calling this workflow:
- `mcp__indigo__list_plugins` returned an entry for the target bundle ID
- Phase 2 resolved an upstream source (GitHub release, zipball fallback, or store download)
- Phase 3 confirmed installed version is strictly less than upstream
- Phase 4 — user explicitly confirmed this plugin or `all`

If any aren't true, do not run.

## Hard limitations (must check before applying)

### Do not self-upgrade the MCP server

If the bundle ID being upgraded is `com.vtmikel.mcp_server` (the Indigo MCP Server plugin), **do not call `mcp__indigo__restart_plugin`** as part of the workflow. Restarting the MCP Server kills the connection this skill uses to talk to Indigo, and subsequent MCP calls fail mid-batch.

Two options:
1. **Skip entirely** — report "MCP Server upgrade requires manual deploy — this skill uses the MCP connection and can't restart itself. Disable the plugin in Indigo's UI, rsync the new bundle, re-enable."
2. **Deploy then defer** — do steps 1–6 (download → stage → verify → rsync), skip step 7 (restart), and tell the user the exact `mcp__indigo__restart_plugin(plugin_id="com.vtmikel.mcp_server")` call they need to run from a fresh session after this one exits.

Option 1 is safer. Option 2 requires warning the user clearly that the MCP state on disk is new but the running process is still old until they restart.

### Deploy path portability

The destination for rsync comes from the `path` field returned by `mcp__indigo__list_plugins` / `mcp__indigo__get_plugin_by_id`. **Do not hardcode** `/Library/Application Support/...`.

**Cross-machine mount handling**: if the user is running this skill on a different Mac than the Indigo server (e.g. Indigo on `jarvis.local` mounted as `/Volumes/<VolumeName>/`), the MCP-reported absolute path won't exist directly. Detect this:

```bash
if [ ! -d "$MCP_REPORTED_PATH/Contents" ]; then
    # Try common mount points
    for prefix in "/Volumes/Macintosh HD-1" "/Volumes/Macintosh HD"; do
        if [ -d "${prefix}${MCP_REPORTED_PATH}/Contents" ]; then
            DEPLOY_PATH="${prefix}${MCP_REPORTED_PATH}"
            break
        fi
    done
fi
```

If no candidate resolves, fail with a clear message: "Indigo server path `<path>` not directly accessible. Is the Indigo server Mac's filesystem mounted?" Ask the user to surface the prefix as a one-off setting.

## Step-by-step sequence

### 1. Prepare temp dirs

```bash
TMPDIR=$(mktemp -d)
DOWNLOAD_DIR="$TMPDIR/download"
STAGE_DIR="$TMPDIR/stage"
mkdir -p "$DOWNLOAD_DIR" "$STAGE_DIR"
```

Track `$TMPDIR` for cleanup in step 10.

### 2. Download the bundle

**GitHub release asset (preferred path):**

```bash
gh release download "$TAG" \
    --repo "$USER/$REPO" \
    --pattern '*.indigoPlugin.zip' \
    --dir "$DOWNLOAD_DIR"
```

Pass the tag explicitly so the release can't be retagged mid-run.

**GitHub zipball fallback** — when the release has no `.indigoPlugin.zip` asset (some authors publish source-only releases with the plugin bundle embedded in the repo tree):

```bash
curl -L -f -o "$DOWNLOAD_DIR/bundle.zip" \
    "https://api.github.com/repos/$USER/$REPO/zipball/$TAG"
```

The resulting zip unzips to a wrapper directory like `<user>-<repo>-<sha>/` with the `.indigoPlugin/` inside it. Step 3 handles both layouts.

**Store download fallback** — when the GitHub release is unusable (no asset, no zipball, 404, etc.) but the registry entry has a `store_download` field:

```bash
curl -L -f -o "$DOWNLOAD_DIR/bundle.zip" "$STORE_DOWNLOAD"
```

`-f` exits non-zero on HTTP errors. `-L` follows redirects.

**Unresolvable** — if none of the three download paths work, fail the upgrade for this plugin with: "no downloadable plugin asset found via GitHub release, zipball, or store download — contact the plugin author." Do not proceed to rsync.

Assert exactly one `.zip` landed in `$DOWNLOAD_DIR`:

```bash
ZIP_COUNT=$(find "$DOWNLOAD_DIR" -maxdepth 1 -name '*.zip' | wc -l | tr -d ' ')
[ "$ZIP_COUNT" = "1" ] || { echo "expected 1 zip, got $ZIP_COUNT"; exit 1; }
ZIP_PATH=$(find "$DOWNLOAD_DIR" -maxdepth 1 -name '*.zip' | head -1)
```

### 3. Unzip into staging

```bash
unzip -q -o "$ZIP_PATH" -d "$STAGE_DIR"
# Handle both flat bundles and zipball-wrapped bundles
STAGED_BUNDLE=$(find "$STAGE_DIR" -maxdepth 3 -name '*.indigoPlugin' -type d | head -1)
[ -n "$STAGED_BUNDLE" ] || { echo "no .indigoPlugin bundle in zip"; exit 1; }
```

**Note on `-maxdepth 3`**: release-asset zips have the bundle at the top level (`.indigoPlugin/` directly). Zipballs wrap it one level deep (`<user>-<repo>-<sha>/.indigoPlugin/`). Some weird zips go deeper. Three levels catches all observed layouts without walking the whole tree.

If no bundle is found, fail this plugin — treat as corrupted or wrong-artifact download.

### 4. Verify bundle identifier (critical safety check)

```bash
STAGED_BUNDLE_ID=$(/usr/libexec/PlistBuddy -c "Print :CFBundleIdentifier" "$STAGED_BUNDLE/Contents/Info.plist")
```

Assert `STAGED_BUNDLE_ID == $EXPECTED_BUNDLE_ID` (from `mcp__indigo__list_plugins`). On mismatch:

- Log the mismatch with both IDs
- Do **not** rsync
- Mark this plugin's upgrade as failed
- Continue to the next plugin

This check prevents wrong-bundle substitution — a download URL pointing at a different plugin than expected (cache typo, store misconfiguration, upstream compromise). Without it, rsync would silently replace an unrelated plugin.

### 5. Verify version (soft check)

```bash
STAGED_VERSION=$(/usr/libexec/PlistBuddy -c "Print :PluginVersion" "$STAGED_BUNDLE/Contents/Info.plist")
```

Compare to the advertised upstream version. Mismatch → log a warning and continue. Final installed version shows up in Phase 6.

### 6. Stop the plugin before rsync

**Critical ordering**: stop the plugin first, then rsync, then start it again. The old order (rsync → restart) fails for plugins with bundled native extensions (e.g. `Packages/pyarrow`) where running-plugin file locks block `rsync --delete`, leaving `Contents/` in a mixed state: new `Info.plist` but old `Packages/`.

```text
mcp__indigo__restart_plugin(plugin_id=$BUNDLE_ID)
```

Wait: there's no `stop_plugin` MCP tool. The workaround is to issue `restart_plugin` *before* rsync — Indigo stops the process, starts a new one from disk, which at that moment still has the old files, then we immediately rsync the new files over the (now-not-locked) `Packages/` directory. On the next restart in step 7, Indigo picks up the new version.

The cleaner fix would be an MCP `stop_plugin` tool — worth filing upstream against `mlamoure/indigo-mcp-server`. Until then, two restarts (before + after) is the correct sequence.

### 7. Deploy via rsync

```bash
rsync -a --delete "$STAGED_BUNDLE/Contents/" "$DEPLOY_PATH/Contents/"
```

Trailing slashes matter: `.../Contents/` → `.../Contents/` copies contents rather than nesting. `--delete` removes files present in the old bundle but not the new one.

If rsync fails (permission denied, disk full, target not found), fail this plugin and continue. Do **not** sudo.

**If `--delete` still fails** with "Directory not empty" despite the pre-stop in step 6 (very bundled native extensions may re-grab locks mid-rsync), retry once without `--delete` as a soft fallback — the new files land on top, leftovers from the old version linger in unused directories, log a warning.

### 8. Restart the plugin

```text
mcp__indigo__restart_plugin(plugin_id=$BUNDLE_ID)
```

**Except** when `$BUNDLE_ID == com.vtmikel.mcp_server` — see the hard limitation section above. Defer this call and tell the user to run it from a fresh session.

### 9. Verify startup

Two checks. The **version check is the primary success signal**; the log check is a secondary sanity pass because the exact `TypeVal` severity mapping isn't well-documented and shouldn't be the sole oracle.

**Version check (primary):**

Poll `mcp__indigo__get_plugin_by_id` but note it may return `CFBundleVersion` (e.g. `2.0.0`) rather than `PluginVersion` (e.g. `2026.4.1`). If in doubt, read the live `$DEPLOY_PATH/Contents/Info.plist` `PluginVersion` field via `/usr/libexec/PlistBuddy`:

```bash
/usr/libexec/PlistBuddy -c "Print :PluginVersion" "$DEPLOY_PATH/Contents/Info.plist"
```

Compare to the expected new version. Mismatch after 15s → treat as failed.

**Log check (secondary):**

```text
mcp__indigo__query_event_log(line_count=50)
```

Each entry has `Message`, `TypeVal`, `TypeStr`, `TimeStamp`. Scan for:

- Success marker: a recent `Application`-type entry (`TypeStr == "Application"`) with `Message` starting `"Started plugin \"<name> <version>\""` referencing this bundle's display name and the new version
- Potential failure: any entry whose `TypeStr` matches the plugin's display name and whose message contains `error`, `exception`, or `traceback`

Treat missing success marker as inconclusive, not failed, if the version check already passed. Treat a version-check failure as failed regardless.

**No rollback.** If the upgrade rsync'd cleanly but the new code throws errors after restart, report the failure and let the user decide whether to revert manually.

### 10. Cleanup

```bash
rm -rf "$TMPDIR"
```

Always run this, even on failure.

## What can go wrong

| Failure mode | Where | Recovery |
|--------------|-------|----------|
| 404 downloading asset | Step 2 | Try zipball fallback, then store_download fallback, then fail |
| Zipball has no `.indigoPlugin` at any depth | Step 3 | Corrupted or source-only repo; fail this plugin |
| Bundle identifier mismatch | Step 4 | Cached metadata wrong; don't rsync, fail |
| `rsync --delete` "Directory not empty" | Step 7 | Stop was ineffective for this plugin — retry without `--delete` as a soft fallback, leave cleanup to the user |
| rsync permission denied | Step 7 | Indigo filesystem perms — user resolves manually; continue with other plugins |
| Plugin restart hangs | Step 8 | MCP `restart_plugin` has its own timeout; if it never returns, report "restart uncertain" |
| Bundle ID is `com.vtmikel.mcp_server` | Step 8 | Do not call restart; tell user to restart from a fresh session |
| Log shows errors after restart | Step 9 | Upgrade applied but new code misbehaves; mark failed, suggest release notes |
| Deploy path not accessible | Prereq | Cross-mount detection failed; ask user for the mount prefix |
