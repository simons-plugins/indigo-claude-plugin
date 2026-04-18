---
name: debug-sqllogger
description: >-
  This skill should be used when the user asks to "debug SQL Logger",
  "find which devices are causing SQL Logger errors", "fix SQL Logger
  errors", "SQL Logger integer out of range", "device history errors",
  "SQL Logger failures updating device history", or is looking at
  repeated "SQL Logger Error: One or more failures updating device
  history" messages in the Indigo event log. Surfaces the hidden
  per-device exception, identifies the failing device and column,
  presents three fix options, and reverts all temporary patches on
  the way out.
---

# SQL Logger Debug & Fix

Indigo's SQL Logger plugin swallows per-device exceptions behind
`self.logger.debug(..., exc_info=True)`. With `sqlDebugLogging`
disabled (the default), the only surface is a generic message
repeating every ~60s:

```
SQL Logger Error: One or more failures updating device history; see the debug log for details
```

No device ID, no traceback, nothing actionable. This skill uses a
temporary `[DEBUG-PATCH]` edit to promote those swallowed debug calls
to `error` level, extracts the failing `device_history_<id>` and root
exception, names the culprit device via MCP, asks the user which of
three fixes to apply, and then reverts every patch on the way out.

**Interactive only.** Every patch, DB operation, and revert is
confirmed with the user. Never leave `[DEBUG-PATCH]` in the file.

## Prerequisites

- `mcp__indigo__*` MCP tools available and connected to the Indigo
  server
- Write access to the Indigo `Plugins/` directory — usually via a
  mounted network volume if this skill runs on a different Mac than
  the Indigo server (see `/indigo:update-plugins` references for the
  mount-prefix pattern)

## Workflow

### Phase 1 — CONFIRM + DISCOVER

Confirm the error is actively repeating:

```
mcp__indigo__query_event_log(filter="SQL Logger Error", limit=20)
```

If there are no recent hits, stop — nothing to debug. If there are
hits, note the cadence (typically ~60s).

Locate the SQL Logger plugin:

```
mcp__indigo__list_plugins → entry where name == "SQL Logger"
```

Capture `id` (bundle ID: `com.perceptiveautomation.indigoplugin.sql-logger`)
and `path`. If the reported path isn't directly accessible (Indigo
runs on a different Mac than this skill — common in this workspace),
apply the workspace mount-prefix probe:

```bash
MCP_REPORTED_PATH="..."  # from mcp__indigo__list_plugins
DEPLOY_PATH="$MCP_REPORTED_PATH"
if [ ! -d "$DEPLOY_PATH/Contents" ]; then
    for prefix in "/Volumes/Macintosh HD-1" "/Volumes/Macintosh HD"; do
        if [ -d "${prefix}${MCP_REPORTED_PATH}/Contents" ]; then
            DEPLOY_PATH="${prefix}${MCP_REPORTED_PATH}"
            break
        fi
    done
fi
```

If neither prefix resolves, stop and ask the user for the mount
prefix. See `skills/update-plugins/references/install-workflow.md`
§ "Deploy path portability" for the canonical version of this logic.

Derive the two working paths:

- **Source:** `<path>/Contents/Server Plugin/plugin.py`
- **Plugin log:** `<indigo-root>/Logs/indigoplugin.sql-logger/plugin.log`
  (same `<indigo-root>` as `<path>`, just replace
  `Plugins/SQL Logger.indigoPlugin` with `Logs/indigoplugin.sql-logger`)

### Phase 2 — PATCH

Locate the two call sites in `plugin.py` with `Grep`. Line numbers
drift across SQL Logger versions — always locate by the message
fragment, not by number:

- Update path — grep `Failed to update table`. At time of writing
  (bundle `com.perceptiveautomation.indigoplugin.sql-logger` 2025.x)
  it's at ~line 529 and already carries `exc_info=True`.
- Create path — grep `Failed to create table .* for device history`.
  Currently at ~line 476 and does **not** carry `exc_info=True`.

Promote each to `logger.error`, prefix the message with
`[DEBUG-PATCH] `, and ensure `exc_info=True` is present on both (add
it to the create call if missing — without it the traceback never
reaches the log, which defeats the point of the patch). Use `Edit`,
not `Write`.

Update path before/after:

```python
# before (~line 529, with exc_info=True already)
self.logger.debug(f"Failed to update table {dev_table_name} with device changes: {err}", exc_info=True)

# after
self.logger.error(f"[DEBUG-PATCH] Failed to update table {dev_table_name} with device changes: {err}", exc_info=True)
```

Create path before/after (note: source has no `exc_info=True` — add
it when promoting):

```python
# before (~line 476, no exc_info)
self.logger.debug(f"Failed to create table {table_name} for device history: {err}")

# after
self.logger.error(f"[DEBUG-PATCH] Failed to create table {table_name} for device history: {err}", exc_info=True)
```

If a `grep` finds the fragment but the surrounding arguments differ
from the above (SQL Logger is maintained; call signatures drift),
adapt — the invariant is *promote to error, add the DEBUG-PATCH tag,
ensure exc_info=True*. Every patched line MUST contain the literal
string `[DEBUG-PATCH]` — the revert step relies on grep returning
zero hits.

Restart the plugin:

```
mcp__indigo__restart_plugin(plugin_id=<bundle-id>)
```

### Phase 3 — EXTRACT

Ask the user to wait one error cycle (~60s) and signal when ready.
Do not sleep blindly — the cadence varies with server load.

Read the last 200 lines of the plugin log and search for
`[DEBUG-PATCH]`. The first matching line names the failing table:

```
[DEBUG-PATCH] Failed to update table device_history_1234567 for device 1234567: integer out of range
```

Extract:

- `deviceId` from `device_history_<deviceId>`
- Exception class + message from the traceback below (commonly
  `indigologger.postgresql.exceptions.NumericRangeError: integer out of range`
  with `CODE: 22003` — classic INT4 overflow)
- If `NumericRangeError`: the `insert_row` traceback names the row
  data; cross-reference with the device state list to guess the
  offending column

Look up the device:

```
mcp__indigo__get_device_by_id(device_id=<deviceId>)
```

Capture name, type, and state list. Columns that hold large
cumulative counters (byte totals, uptime seconds, packet counts on
UniFi-style devices) are the usual INT4 overflow culprits.

### Phase 4 — REPORT + ASK

Present the findings and the three fix options. Do not pre-select.

```
Device:           <name> (id: <id>, type: <type>)
Failing table:    device_history_<id>
Exception:        <class>: <message>
Likely cause:     <INT4 overflow on column X | type mismatch | ...>

Three fix options:

  (a) EXCLUDE DEVICE entirely from SQL logging
      - sharedProps["sqlLoggerIgnoreStates"] = "*"
      - No further history recorded for this device
      - Fully reversible

  (b) EXCLUDE SPECIFIC STATES only
      - sharedProps["sqlLoggerIgnoreStates"] = "state1,state2"
      - History kept for other states on the device
      - Fully reversible

  (c) DROP + REBUILD the table
      - DROP TABLE device_history_<id>
      - SQL Logger recreates it on next insert with column types
        inferred from *current* values (BIGINT where INT4 overflowed)
      - Past history for this device is lost; future history preserved
      - Requires a second patch cycle (one-shot DROP in startup())

Which fix? (a / b / c / none)
```

If the user answers (b), ask which states before proceeding. If
"none" — or at any abort path — jump directly to Phase 6 (revert
only, no fix applied). See Safety Rules: patches must never outlive
the skill's own exit, regardless of cause.

### Phase 5 — APPLY (chosen option only)

**Option (a) — exclude device:**

Setting `sharedProps` cannot be done cleanly through the current MCP
surface. Prefer the Indigo UI path:

> Indigo → Device → Edit → Edit Device Settings → SQL Logger →
> enable "Ignore all states"

Tell the user exactly that and wait for them to confirm. Do not try
to write `sharedProps` via another patched function — higher risk
than the problem warrants.

**Option (b) — exclude specific states:**

Same UI path as (a), but they enter a comma-separated list of state
names. Pass them the list derived from the traceback + state list in
Phase 3.

**Option (c) — drop + rebuild:**

Before emitting any SQL, assert `<id>` is purely decimal digits
(`^[0-9]+$`). Indigo device IDs are always integers, so a non-match
means the extraction in Phase 3 went wrong — stop and re-run
extraction rather than continuing with a malformed DROP.

Add a one-shot DROP block at the very end of `startup()` in
`plugin.py` — after `_connect_db()`. Substitute the validated device
ID:

```python
# [DEBUG-PATCH] one-shot drop of broken device_history_<id>
try:
    self.indigo_db.execute_non_query(
        "DROP TABLE IF EXISTS device_history_<id>"
    )
    self.logger.error(
        "[DEBUG-PATCH] dropped device_history_<id> — will be recreated on next insert"
    )
except Exception as err:
    self.logger.error(f"[DEBUG-PATCH] drop failed: {err}", exc_info=True)
```

Restart the plugin and watch the log for the
`[DEBUG-PATCH] dropped` confirmation line. If the drop fails, stop
and surface the error — do not retry silently.

**Never run DROP against any table other than the exact
`device_history_<id>` extracted in Phase 3.** Hardcode the specific
ID into the SQL string; never accept it from anywhere except this
skill's own extraction output.

### Phase 6 — REVERT

Undo every patch. Up to three regions may need reverting:

1. `_update_device_history` logger call — restore to
   `self.logger.debug(...)`, remove `[DEBUG-PATCH]` prefix
2. `_create_table_for_dev` logger call — same
3. `startup()` one-shot DROP block (option c only) — delete the whole
   try/except block

Verify cleanup with Grep:

```
Grep pattern="DEBUG-PATCH" path="<plugin.py absolute path>" output_mode="count"
```

Must return 0. If any hit remains, fix it before continuing — a
leftover DROP in `startup()` will re-drop the rebuilt table on every
plugin restart.

Restart the plugin one final time.

### Phase 7 — VERIFY

Watch for recurrence over ~2 minutes:

```
mcp__indigo__query_event_log(filter="SQL Logger Error", limit=10)
```

Expected outcomes:

- **Option (a)/(b):** the device is no longer inserted, so the error
  stops on the next cycle
- **Option (c):** SQL Logger recreates the table with BIGINT columns
  on the next state change; errors stop once one successful insert
  lands

If errors continue after two cycles:

- Different device? The original "one **or more** failures" is plural
  for a reason. Re-run the **full Phase 2 → 7 cycle** — Phase 6 has
  already reverted the previous patch, so the log no longer carries
  `[DEBUG-PATCH]` lines. Re-patching is required to surface the next
  device.
- Fix didn't land? Check the sharedProp in Indigo UI directly, or
  grep the plugin log for the post-fix behaviour.
- Drop rebuild failed? Re-apply the Phase 2 patch and look for
  `_create_table_for_dev` exceptions in the log — with `exc_info=True`
  now present on both sites, the traceback will show why the rebuild
  insert failed.

Report the outcome to the user plainly: what changed, what's still
happening, what to do next.

## Safety Rules

- **Every temporary edit is tagged `[DEBUG-PATCH]`.** Phase 6 relies
  on `grep [DEBUG-PATCH]` returning zero.
- **Patches never outlive the skill's exit.** If the skill aborts at
  any point after Phase 2 — user cancels, log-read finds nothing,
  extraction fails, any error, interrupt, or user "none" in Phase 4 —
  the first action before exiting is a full Phase 6 revert
  (restore both `logger.debug` call sites, remove any `startup()`
  DROP block, grep-verify zero `[DEBUG-PATCH]` hits, restart plugin).
  A patched `logger.error` left behind will spam the event log every
  ~60s at error level until noticed.
- **Never hardcode `Plugins/...` paths.** Discover via
  `mcp__indigo__list_plugins` and apply the workspace mount prefix.
- **Never DROP a table the skill hasn't just identified.** The SQL
  string must embed the specific `<id>` extracted in Phase 3, and
  `<id>` must be confirmed decimal-only (`^[0-9]+$`) before emission.
- **Interactive only.** Every phase waits for the user — no
  background runs, no cron.
- **One device per pass.** If multiple devices are failing, finish
  one end-to-end (Phase 2 → 7) before patching again for the next.

## Related Skills

- **`/indigo:dev`** — Indigo SDK reference. Useful if SQL Logger's
  internal function names or signatures have drifted from what this
  skill describes.
- **`/indigo:update-plugins`** — source of the mount-prefix and
  `PlistBuddy` patterns this skill reuses.
