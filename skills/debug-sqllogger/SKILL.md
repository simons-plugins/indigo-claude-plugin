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

Capture `id` (bundle ID, commonly
`com.perceptiveautomation.indigoplugin.sql-logger`) and `path`. Apply
a mount prefix if the reported path isn't directly accessible (same
pattern `/indigo:update-plugins` uses).

Derive the two working paths:

- **Source:** `<path>/Contents/Server Plugin/plugin.py`
- **Plugin log:** `<indigo-root>/Logs/indigoplugin.sql-logger/plugin.log`
  (same `<indigo-root>` as `<path>`, just replace
  `Plugins/SQL Logger.indigoPlugin` with `Logs/indigoplugin.sql-logger`)

### Phase 2 — PATCH

Locate the two call sites in `plugin.py` with `Grep`:

- `_update_device_history` — look for `logger.debug` near
  `"Failed to update table"` (historically ~line 529)
- `_create_table_for_dev` — look for `logger.debug` near
  `"Failed to create table"` (historically ~line 476)

Line numbers drift across SQL Logger versions — always locate by
content, not by number.

Promote each to `logger.error` and prefix the message with
`[DEBUG-PATCH] `. Use `Edit`, not `Write` — do not rewrite the file.

Before:

```python
self.logger.debug(
    f"Failed to update table {dev_table_name} for device {dev.id}: {err}",
    exc_info=True,
)
```

After:

```python
self.logger.error(
    f"[DEBUG-PATCH] Failed to update table {dev_table_name} for device {dev.id}: {err}",
    exc_info=True,
)
```

Every patched line MUST contain the literal string `[DEBUG-PATCH]` —
the revert step relies on grep returning zero hits.

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
"none", jump to Phase 6 (revert only, no fix applied).

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

Add a one-shot DROP block at the very end of `startup()` in
`plugin.py` — after `_connect_db()`. Substitute the real device ID:

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
  for a reason. Re-run from Phase 2 — the next iteration will surface
  a different `device_history_<id>` in the log.
- Fix didn't land? Check the sharedProp in Indigo UI directly, or
  grep the plugin log for the post-fix behaviour.
- Drop rebuild failed? Look for `_create_table_for_dev` exceptions in
  the log (the patched version of that call site will surface them).

Report the outcome to the user plainly: what changed, what's still
happening, what to do next.

## Safety Rules

- **Every temporary edit is tagged `[DEBUG-PATCH]`.** Phase 6 relies
  on `grep [DEBUG-PATCH]` returning zero.
- **Never leave a patch in the file.** A leftover `startup()` DROP
  will re-destroy the rebuilt table on every restart.
- **Never hardcode `Plugins/...` paths.** Discover via
  `mcp__indigo__list_plugins` and apply the workspace mount prefix.
- **Never DROP a table the skill hasn't just identified.** The SQL
  string must embed the specific `<id>` extracted in Phase 3.
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
