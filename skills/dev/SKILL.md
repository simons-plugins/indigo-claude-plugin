---
name: dev
description: >-
  This skill should be used when the user asks to "create an Indigo plugin",
  "build a plugin for Indigo", "add a device type", "configure Devices.xml",
  "implement plugin lifecycle", "debug an Indigo plugin", "use runConcurrentThread",
  "add plugin preferences", "create custom events", "update device states",
  "use replaceOnServer", "create a device factory", "bundle Python packages",
  "add menu items", "create actions", or is working within .indigoPlugin directory
  structures. Provides Indigo home automation plugin development guidance including
  SDK patterns, device design, and troubleshooting.
match:
  - "**/*.indigoPlugin/**"
  - "**/plugin.py"
  - "**/Devices.xml"
  - "**/Actions.xml"
  - "**/Events.xml"
  - "**/MenuItems.xml"
  - "**/PluginConfig.xml"
  - "**/Info.plist"
---

# Indigo Plugin Development

## Plugin Structure

Every Indigo plugin follows this bundle layout:

```
PluginName.indigoPlugin/
└── Contents/
    ├── Info.plist              # Unique CFBundleIdentifier required
    ├── Server Plugin/
    │   ├── plugin.py           # Main Plugin(indigo.PluginBase) class
    │   ├── Devices.xml         # Device type definitions
    │   ├── Actions.xml         # Action definitions
    │   ├── Events.xml          # Custom event definitions
    │   ├── MenuItems.xml       # Plugin menu items
    │   └── PluginConfig.xml    # Plugin preferences UI
    ├── Resources/              # Web content (auto-served)
    └── Packages/               # Bundled pip libraries
```

## Plugin Lifecycle

```python
class Plugin(indigo.PluginBase):
    def __init__(self, plugin_id, display_name, version, prefs, **kwargs):
        super().__init__(plugin_id, display_name, version, prefs, **kwargs)
        # Instance variables only — NO Indigo API calls here

    def startup(self):
        # Subscribe to changes, open connections
        # Do NOT call super().startup()

    def runConcurrentThread(self):  # Optional — polling loop
        try:
            while True:
                # Periodic work
                self.sleep(60)
        except self.StopThread:
            pass  # Clean exit

    def shutdown(self):
        # Release resources — Do NOT call super().shutdown()
```

## Essential Rules

- Always call `super().__init__()` in `__init__` (but NOT super() in startup/shutdown)
- Use `self.sleep()` not `time.sleep()` in concurrent threads
- Handle `self.StopThread` in `runConcurrentThread`
- Log with `self.logger.debug/info/warning/error/exception()`
- Python 3.10–3.13 (see version table in `docs/plugin-dev/quick-start.md`)
- Use `requirements.txt` in `Contents/Server Plugin/` — Indigo auto-installs into `Contents/Packages/`. Never `pip install` into system Python.
- `CFBundleIdentifier` in Info.plist must be globally unique

## Device Types (Devices.xml)

Indigo provides base device types to extend:

| Base Type | Use For | Key States |
|-----------|---------|------------|
| `indigo.relay` | On/off switches | `onOffState` |
| `indigo.dimmer` | Dimmable lights | `onOffState`, `brightnessLevel` |
| `indigo.thermostat` | Climate control | `hvacMode`, setpoints, temperatures |
| `indigo.sensor` | Read-only sensors | `onOffState` or `sensorValue` |
| `custom` | Anything else | Define custom states |

**Device Factory** pattern: A single "factory" device type that creates/manages child devices of different types — useful when a hub discovers multiple sub-devices.

## State Updates

```python
# Single state
dev.updateStateOnServer("stateId", value)

# Multiple states (preferred — single server round-trip)
states = [
    {"key": "temperature", "value": 72.5, "uiValue": "72.5 °F"},
    {"key": "humidity", "value": 45, "uiValue": "45%"},
]
dev.updateStatesOnServer(states)

# Full device replace (when many properties change)
dev.replaceOnServer()
```

## Lifecycle callbacks & `super()` (common footgun)

- `__init__` — **do** call `super().__init__(...)`. `startup`/`shutdown`/`runConcurrentThread` — do **not** call super.
- `deviceStartComm`/`deviceStopComm` — these are override hooks; the base versions are effectively no-ops, so calling super is optional (not "required").
- `deviceUpdated`/`triggerUpdated` and `deviceCreated`/`deviceDeleted`/`triggerCreated`/`triggerDeleted` — the base implementations do real work (they drive the stop/start-comm machinery). Overriding these **requires** calling the base (`indigo.PluginBase.deviceUpdated(self, orig, new)`) or re-implementing start/stop. See `reference/canonical/plugin-dev/reference/plugin-py/device-methods.md`.
- `secure="true"` on a text field only **masks the value in the UI — it is NOT stored securely.** Never rely on it for secrets.

## Reference Documentation

Reference facts come from `reference/canonical/**` (relative to `${CLAUDE_PLUGIN_ROOT}`) — vendored
verbatim from Indigo 2025.2 docs via `tools/refresh_canonical.py`. Load only the page needed;
`reference/canonical/INDEX.md` lists all. A few docs under `docs/plugin-dev/` are workspace
on-ramps/patterns kept alongside canonical. All paths below are relative to `${CLAUDE_PLUGIN_ROOT}`.

> **Field notes — undocumented gotchas canonical does NOT cover.** Consult these before writing
> custom states, dynamic state lists, cross-plugin actions, `uiPath` menus, or custom events:
> `docs/plugin-dev/concepts/{devices,actions,events,plugin-preferences}.md`. They cover strict
> state-ID naming (`LowLevelBadParameterError`), reserved names (`batteryLevel` shadowing), the
> live-`getDeviceStateList` cache trap, `deviceUpdated` self-loop guard, `uiPath` PascalCase (crashes
> the client), cross-plugin `executeAction` prop-matching, and the `pluginPrefs` vs `pluginProps`
> `_`-prefix rule.

| Topic | File |
|-------|------|
| **Field notes — undocumented device/state/action/event gotchas** | `docs/plugin-dev/concepts/{devices,actions,events,plugin-preferences}.md` |
| Plugin lifecycle (workspace on-ramp) | `docs/plugin-dev/concepts/plugin-lifecycle.md` |
| plugin.py lifecycle methods (reference) | `reference/canonical/plugin-dev/reference/plugin-py/general-methods.md` |
| Device start/stop/config/action callbacks | `reference/canonical/plugin-dev/reference/plugin-py/device-methods.md` |
| Devices.xml (device types, states, subType) | `reference/canonical/plugin-dev/reference/xml/devices.md` |
| ConfigUI fields & bindings | `reference/canonical/plugin-dev/reference/xml/configui.md` (+ `configui/` subpages) |
| ConfigUI validation methods (+ `ValidationError`) | `reference/canonical/plugin-dev/reference/xml/configui/validation.md` |
| Actions.xml | `reference/canonical/plugin-dev/reference/xml/actions.md` |
| MenuItems.xml (+ callback contract) | `reference/canonical/plugin-dev/reference/xml/menuitems.md` |
| Events.xml / custom triggers | `reference/canonical/plugin-dev/reference/xml/events.md` |
| PluginConfig.xml & preferences | `reference/canonical/plugin-dev/reference/xml/pluginconfig.md` |
| HTTP request handling (IWS) | `reference/canonical/plugin-dev/reference/plugin-py/http-requests.md` |
| Logging | `reference/canonical/plugin-dev/reference/plugin-py/logging.md` |
| Dev environment (symlink workflow, debuggers) | `reference/canonical/plugin-dev/reference/dev-environment.md` |
| API patterns (state updates, replaceOnServer) | `docs/plugin-dev/patterns/api-patterns.md` |
| Testing patterns (pytest mocks, TestingBase) | `docs/plugin-dev/patterns/testing.md` |
| Troubleshooting | `docs/plugin-dev/troubleshooting/common-issues.md` |
| SDK examples guide | `docs/plugin-dev/examples/sdk-examples-guide.md` |

### Indigo Object Model (scripting reference — canonical)

For the `indigo.*` object model, read from `reference/canonical/scripting/`:

- `iom-concepts.md` — object hierarchy, base classes, copy semantics
- `reference/devices/base-class.md` — device base class properties & methods
- `reference/device-subclasses/` — dimmer, relay, sensor, thermostat, sprinkler, speedcontrol, multiio
- `reference/triggers.md` / `reference/schedules.md` / `reference/action-groups.md` / `reference/variables.md`
- `reference/server-commands.md` — server properties & commands
- `reference/folders.md`, `reference/insteon-commands.md`, `reference/x10-commands.md`, `reference/utils.md`

### SDK Examples

16 working example plugins in `sdk-examples/`. Read the guide first, then load specific examples as needed. Key examples:

- **Example Device - Custom** — Custom device states, ConfigUI
- **Example Device - Relay and Dimmer** — Switch/dimmer with on/off/brightness
- **Example Device - Thermostat** — HVAC, setpoints, fan modes
- **Example Device - Factory** — Device factory pattern (hub → child devices)
- **Example HTTP Responder** — Serving web content, REST endpoints

## Full Documentation

For comprehensive guidance with query routing, use `/indigo:dev`.
