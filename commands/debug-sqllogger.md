---
name: debug-sqllogger
description: Debug + fix SQL Logger device history errors — surfaces the hidden per-device exception, identifies the failing device, and walks through the three fix options
---

# SQL Logger Debug & Fix

**Plugin**: https://github.com/simons-plugins/indigo-claude-plugin
**Slash command**: `/indigo:debug-sqllogger`

## Description

Indigo's SQL Logger plugin swallows per-device exceptions behind
`logger.debug(..., exc_info=True)`. With `sqlDebugLogging` disabled
(default), the event log only shows a generic:

```
SQL Logger Error: One or more failures updating device history; see the debug log for details
```

repeating every ~60s — no device ID, no traceback.

This command temporarily patches SQL Logger's two swallowed
`logger.debug` call sites to `error` level (tagged `[DEBUG-PATCH]`),
surfaces the real exception, names the failing device via MCP, and
then asks which of three fixes to apply:

- (a) exclude the device entirely from SQL logging
- (b) exclude specific states only
- (c) drop + rebuild the `device_history_<id>` table

Every patch is reverted on the way out. Grep confirms cleanup.

**Interactive only.** Each phase waits for explicit user input.

## On Command Load

1. Read `skills/debug-sqllogger/SKILL.md` — complete workflow
2. Begin at Phase 1 (CONFIRM + DISCOVER)

## Workflow Summary

See `skills/debug-sqllogger/SKILL.md` for the authoritative sequence.
At-a-glance phases:

1. **CONFIRM + DISCOVER** — verify errors are actively repeating
   (`query_event_log`), locate SQL Logger plugin + log via
   `mcp__indigo__list_plugins`
2. **PATCH** — promote the two `logger.debug(..., exc_info=True)`
   calls in `_update_device_history` and `_create_table_for_dev` to
   `logger.error` tagged `[DEBUG-PATCH]`, restart plugin
3. **EXTRACT** — read plugin log, pull `device_history_<id>` and
   exception class, resolve device via `get_device_by_id`
4. **REPORT + ASK** — present findings + three fix options, wait for
   user choice
5. **APPLY** — execute chosen fix only
6. **REVERT** — restore `logger.debug` calls, remove any
   `startup()` patch, confirm `grep [DEBUG-PATCH]` returns zero
7. **VERIFY** — watch event log for ~2 minutes; report outcome

## Safety

All safety rules live in `skills/debug-sqllogger/SKILL.md`.
Highlights: every edit tagged `[DEBUG-PATCH]`, grep-verified revert,
never hardcode plugin paths, never DROP a table not just identified,
interactive only, one device per pass.

## Related Commands

- `/indigo:dev` — SDK reference if SQL Logger internals have drifted
- `/indigo:update-plugins` — source of the mount-prefix / `PlistBuddy`
  patterns reused here
