# Device Development — field notes

Undocumented Indigo device behaviour learned in the field — **not** covered by the canonical
reference. For device types, `Devices.xml`, states, ConfigUI, the device factory, and the runtime
device API, use the canonical docs (routed from `/indigo:dev`):
`reference/canonical/plugin-dev/reference/xml/devices.md` and
`reference/canonical/scripting/reference/devices/base-class.md`.

## State ID naming rules (undocumented but strict)

Indigo's Plugin host validates custom state IDs more strictly than XML or
Python identifiers permit. Violating any of these rules raises
`LowLevelBadParameterError -- illegal XML tag name character` from
`stateListOrDisplayStateIdChanged()` or `replacePluginPropsOnServer()`,
and the error message does **not** identify which key is bad.

| Rule | OK | Not OK |
|---|---|---|
| Must start with an ASCII letter | `colorTemp`, `linkQuality` | `_internal`, `2state` |
| Body is ASCII letters and digits ONLY | `colorTempStartup`, `motionSensitivity` | `color_temp_startup`, `temp-c`, `state.foo` |
| Underscores are **forbidden** despite XML allowing them | `lastSeen` | `last_seen` |
| Non-ASCII letters are forbidden despite `str.isalnum()` accepting them | `notifie` | `notifié` |

Convert MQTT/JSON-style snake_case to camelCase before declaring states:

```python
def _sanitise_state_key(key):
    """color_temp_startup -> colorTempStartup"""
    parts = []
    cur = []
    for c in key:
        if c.isascii() and c.isalnum():
            cur.append(c)
        else:
            if cur: parts.append("".join(cur)); cur = []
    if cur: parts.append("".join(cur))
    if not parts: return ""
    sk = parts[0][0].lower() + parts[0][1:] + "".join(p[:1].upper() + p[1:] for p in parts[1:])
    if not sk[0].isalpha():
        sk = "z" + sk[:1].upper() + sk[1:]   # force ASCII-letter start
    return sk
```

Strict validator (use before every `updateStateOnServer`):

```python
def _is_valid_state_id(key):
    if not key or not key[0].isascii() or not key[0].isalpha():
        return False
    return all(c.isascii() and c.isalnum() for c in key)
```

## Reserved state names — don't shadow native device properties

Indigo has reserved property names on device objects (e.g. `device.batteryLevel`).
If a Plugin declares a custom state with the same name, Indigo silently routes
`updateStateOnServer()` writes to the **native property** instead of Custom States.
The state never appears in the Custom States panel and no error is raised.

Known reserved names to avoid as custom state IDs:

- `batteryLevel` — use `battery` (with `Integer` type) instead

The reservation hides bugs that look like "my Plugin isn't writing the state"
when actually the write succeeded into the wrong slot. Use `Integer` rather
than `Number` for whole-number percentages so the Custom States panel renders
the value correctly.

## Dynamic state declaration — three subtle rules

When overriding `getDeviceStateList(dev)` to advertise states beyond what's in
Devices.xml (typical pattern: capture-all sensor Plugins, MQTT/HA bridges):

### 1. The parent's list is a LIVE reference, not a copy

`indigo.PluginBase.getDeviceStateList(self, dev)` returns the parser's
**internal cache** for that device type — not a fresh list. Appending to it
permanently corrupts subsequent reads: every call accumulates more duplicates,
and eventually Indigo's XML serialiser blows up. The error looks like a
random "illegal XML tag name character" failure that gets worse over time.

Always work on a shallow copy:

```python
def getDeviceStateList(self, dev):
    state_list = list(indigo.PluginBase.getDeviceStateList(self, dev) or [])
    # ...append dynamic state dicts to state_list, not to the parent return value
    return state_list
```

### 2. `dev.pluginProps` keys cannot start with underscore

Indigo's XML serialiser rejects `dev.replacePluginPropsOnServer({"_seenKeys": ...})`
with `LowLevelBadParameterError`. This is **distinct** from `self.pluginPrefs`
(Plugin-level prefs written via direct dict assignment) — those accept
underscore-prefixed keys fine. Only **device-level** pluginProps written via
`replacePluginPropsOnServer` are strict.

```python
# Bad — replacePluginPropsOnServer fails
new_props["_dynamicKeys"] = ",".join(seen)
dev.replacePluginPropsOnServer(new_props)

# Good
new_props["dynamicKeys"] = ",".join(seen)
dev.replacePluginPropsOnServer(new_props)
```

### 3. Roll back pluginProps on stateListOrDisplay failure

When you persist a new state name in pluginProps and then call
`stateListOrDisplayStateIdChanged()`, the latter can fail (e.g. the new name
hits an undocumented validation rule). The pluginProps write has already
committed though — so on failure you should restore the prior value, otherwise
every subsequent message fails the same way:

```python
seen_csv_before = dev.pluginProps.get("dynamicKeys", "")
try:
    new_props = dict(dev.pluginProps)
    new_props["dynamicKeys"] = ",".join(sorted(seen_after))
    dev.replacePluginPropsOnServer(new_props)
    indigo.devices[dev.id].stateListOrDisplayStateIdChanged()
except Exception:
    rollback = dict(dev.pluginProps)
    rollback["dynamicKeys"] = seen_csv_before
    dev.replacePluginPropsOnServer(rollback)
    raise
```

## `deviceUpdated` self-loop guard

If your Plugin calls `indigo.devices.subscribeToChanges()` AND also writes
states on its own devices, every state write fires `deviceUpdated()` again —
infinite loop unless guarded.

The guard MUST be at the very top of `deviceUpdated()` and check `pluginId`,
not `id`. A per-device id check is not sufficient if the Plugin manages more
than one device — it doesn't prevent A→B→A→B cross-device loops.

```python
def deviceUpdated(self, origDev, newDev):
    super().deviceUpdated(origDev, newDev)
    if newDev.pluginId == self.pluginId:
        return  # ignore our own device updates
    # ...rest of the handler
```

## Quick rules

- State IDs: camelCase ASCII only — no underscores, no non-ASCII letters.
- Don't reuse reserved names like `batteryLevel` (use `battery`, `Integer` type).
- Don't append to the live list from `getDeviceStateList()` — copy it first.
- Device `pluginProps` keys via `replacePluginPropsOnServer` cannot start with `_` (Plugin `pluginPrefs` can).
- If you `subscribeToChanges()`, add the `pluginId` self-loop guard at the top of `deviceUpdated()`.

## See Also

- Device types, states, ConfigUI: `reference/canonical/plugin-dev/reference/xml/devices.md`
- Runtime device API: `reference/canonical/scripting/reference/devices/base-class.md`
- Lifecycle callbacks & `super()` rules: [plugin-lifecycle.md](plugin-lifecycle.md)
