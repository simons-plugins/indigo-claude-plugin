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
- Python 3.10+ (Indigo 2023+)
- Bundle dependencies in `Contents/Packages/` (not system pip)
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

## Reference Documentation

For detailed guidance on specific topics, read these files relative to `${CLAUDE_PLUGIN_ROOT}`:

| Topic | File |
|-------|------|
| Plugin lifecycle (full) | `docs/plugin-dev/concepts/plugin-lifecycle.md` |
| Device design & Devices.xml | `docs/plugin-dev/concepts/devices.md` |
| ConfigUI reference (fields, attributes, bindings) | `docs/plugin-dev/concepts/configui.md` |
| Actions.xml & actionControl callbacks | `docs/plugin-dev/concepts/actions.md` |
| Menu items (MenuItems.xml) | `docs/plugin-dev/concepts/menu-items.md` |
| Custom events | `docs/plugin-dev/concepts/events.md` |
| HTTP Responder (web endpoints, IWS) | `docs/plugin-dev/concepts/http-responder.md` |
| Scripting shell & CLI | `docs/plugin-dev/concepts/scripting-shell.md` |
| Plugin preferences & PluginConfig.xml | `docs/plugin-dev/concepts/plugin-preferences.md` |
| API patterns (state updates, replaceOnServer) | `docs/plugin-dev/patterns/api-patterns.md` |
| Troubleshooting | `docs/plugin-dev/troubleshooting/common-issues.md` |
| SDK examples guide | `docs/plugin-dev/examples/sdk-examples-guide.md` |
| Indigo Object Model overview | `docs/plugin-dev/api/indigo-object-model.md` |

### IOM Reference (modular)

For specific Indigo Object Model topics, read from `docs/plugin-dev/api/iom/`:

- `architecture.md` — Object hierarchy and base classes
- `devices.md` — Device properties, methods, base types
- `command-namespaces.md` — `indigo.device`, `indigo.variable`, etc.
- `triggers.md` — Trigger types and configuration
- `subscriptions.md` — Change subscriptions
- `constants.md` — Enums and constant values
- `containers.md` — Lists, dictionaries, database access
- `utilities.md` — Logging, scheduling, server info

### SDK Examples

16 working example plugins in `sdk-examples/`. Read the guide first, then load specific examples as needed. Key examples:

- **Example Device - Custom** — Custom device states, ConfigUI
- **Example Device - Relay and Dimmer** — Switch/dimmer with on/off/brightness
- **Example Device - Thermostat** — HVAC, setpoints, fan modes
- **Example Device - Factory** — Device factory pattern (hub → child devices)
- **Example HTTP Responder** — Serving web content, REST endpoints

## Full Documentation

For comprehensive guidance with query routing, use `/indigo:dev`.
