# STRUCTURE.md — Directory Structure

## Top-Level Layout

```
indigo-claude-plugin/
├── .claude-plugin/                  # Plugin manifest (Claude Code)
│   ├── plugin.json                  # Installed plugin identity
│   └── marketplace.json             # Marketplace listing
├── .planning/                       # Planning docs (not shipped as plugin content)
│   └── codebase/                    # This directory
├── commands/                        # Slash command definitions
│   ├── dev.md
│   ├── api.md
│   ├── control-pages.md
│   └── html-pages.md
├── skills/                          # Auto-triggering skill definitions
│   ├── dev/
│   │   └── SKILL.md
│   ├── api/
│   │   └── SKILL.md
│   ├── control-pages/
│   │   └── SKILL.md
│   └── html-pages/
│       ├── SKILL.md
│       ├── references/
│       │   ├── indigo-api-js.md     # Full IndigoAPI JS class + API reference
│       │   └── design-guidelines.md # CSS themes, responsive layout, SF Symbols
│       └── examples/
│           └── active-devices.html  # Complete working dashboard page
├── hooks/                           # Session lifecycle hooks
│   ├── hooks.json                   # Hook registration
│   └── check-update.js              # Update check (Node.js, no deps)
├── docs/                            # Documentation loaded by commands/skills
│   ├── api/                         # Indigo WebSocket + HTTP API docs
│   │   ├── README.md
│   │   ├── overview.md
│   │   ├── authentication.md
│   │   ├── websocket-api.md
│   │   ├── http-api.md
│   │   └── device-commands.md
│   ├── control-pages/               # Control page builder docs
│   │   ├── workflow.md              # 5-phase guided workflow
│   │   ├── schema/
│   │   │   ├── control-page.md
│   │   │   ├── page-elements.md
│   │   │   ├── actions.md
│   │   │   └── enums.md
│   │   ├── images/
│   │   │   ├── device-images.md
│   │   │   ├── static-images.md
│   │   │   ├── variable-images.md
│   │   │   └── external-images.md
│   │   ├── layouts/
│   │   │   ├── templates.md
│   │   │   └── sizing.md
│   │   └── export/
│   │       └── clipping-export.md
│   └── plugin-dev/                  # Plugin development docs (largest tree)
│       ├── quick-start.md           # Getting started guide (9KB)
│       ├── concepts/                # Core plugin concepts
│       │   ├── README.md
│       │   ├── plugin-lifecycle.md  # 12KB
│       │   ├── devices.md           # 7KB — Devices.xml, ConfigUI
│       │   ├── plugin-preferences.md # 4KB
│       │   ├── events.md            # 5KB — Events.xml
│       │   ├── actions.md           # Actions.xml, actionControl callbacks
│       │   ├── configui.md          # ConfigUI reference
│       │   ├── http-responder.md    # IWS web endpoints
│       │   ├── menu-items.md        # MenuItems.xml
│       │   └── scripting-shell.md   # Scripting shell / CLI
│       ├── api/                     # Indigo Object Model reference
│       │   ├── README.md
│       │   ├── indigo-object-model.md  # Overview (3KB)
│       │   └── iom/                 # Modular reference (~40KB across 9 files)
│       │       ├── architecture.md
│       │       ├── command-namespaces.md
│       │       ├── devices.md
│       │       ├── triggers.md
│       │       ├── filters.md
│       │       ├── subscriptions.md
│       │       ├── constants.md
│       │       ├── containers.md
│       │       └── utilities.md
│       ├── patterns/
│       │   ├── README.md
│       │   ├── api-patterns.md      # State updates, replaceOnServer (5KB)
│       │   └── open-source-contributing.md  # IndigoDomotics contributing (3KB)
│       ├── examples/
│       │   ├── README.md
│       │   └── sdk-examples-guide.md  # Catalog of 16 examples (8KB)
│       └── troubleshooting/
│           ├── README.md
│           └── common-issues.md     # Debugging guide (11KB)
├── sdk-examples/                    # 16 official Indigo SDK example plugins (1.3MB)
│   ├── Example Action API.indigoPlugin
│   ├── Example Custom Broadcaster.indigoPlugin
│   ├── Example Custom Subscriber.indigoPlugin
│   ├── Example Database Traverse.indigoPlugin
│   ├── Example Device - Custom.indigoPlugin
│   ├── Example Device - Energy Meter.indigoPlugin
│   ├── Example Device - Factory.indigoPlugin
│   ├── Example Device - Relay and Dimmer.indigoPlugin
│   ├── Example Device - Sensor.indigoPlugin
│   ├── Example Device - Speed Control.indigoPlugin
│   ├── Example Device - Sprinkler.indigoPlugin
│   ├── Example Device - Thermostat.indigoPlugin
│   ├── Example HTTP Responder.indigoPlugin
│   ├── Example INSTEON:X10 Listener.indigoPlugin
│   ├── Example Variable Change Subscriber.indigoPlugin
│   ├── Example ZWave Listener.indigoPlugin
│   └── README.md
├── reference/                       # SDK-level reference documents
│   ├── README.md
│   ├── SDK-CLAUDE.md                # SDK project guidance for Claude
│   ├── SDK-README.md                # SDK readme
│   └── Python3-Migration-Guide.md   # Python 2 → 3 migration
├── snippets/
│   └── plugin-base-template.py      # Clean Python 3 plugin starting template
├── examples/                        # Control page example files
│   ├── <ControlPageList type="vecto 2.textClipping
│   ├── <ControlPageList type="vecto 3.textClipping
│   ├── <ControlPageList type="vecto 4.textClipping
│   ├── <ControlPageList type="vecto 5.textClipping
│   └── bedroom example.textClipping
├── tools/
│   └── create_clipping.py           # Python 3 .textClipping generator
├── control-pages.local.md           # Per-user control page preferences (user-managed)
├── CLAUDE.md                        # Project guidance for Claude Code
├── README.md
├── LICENSE                          # MIT
└── PRIVACY.md
```

## SDK Examples — 16 Plugins

| Example | Category | Use For |
|---------|----------|---------|
| Example Device - Custom | Device | Custom states, ConfigUI |
| Example Device - Relay and Dimmer | Device | On/off switches, lights |
| Example Device - Thermostat | Device | HVAC, setpoints, fan modes |
| Example Device - Sensor | Device | Read-only sensors |
| Example Device - Speed Control | Device | Variable speed devices |
| Example Device - Sprinkler | Device | Irrigation zones |
| Example Device - Energy Meter | Device | Power monitoring |
| Example Device - Factory | Device | Hub → child device pattern |
| Example HTTP Responder | Integration | Web endpoints, REST API, IWS |
| Example Action API | Integration | Triggering actions |
| Example Custom Broadcaster | Integration | Custom pub/sub |
| Example Custom Subscriber | Integration | Custom pub/sub |
| Example Database Traverse | Integration | Iterating Indigo objects |
| Example Variable Change Subscriber | Integration | Monitoring variables |
| Example INSTEON:X10 Listener | Integration | Protocol listener |
| Example ZWave Listener | Integration | Protocol listener |

## Notable Sizing

| Path | Approximate Size |
|------|-----------------|
| `sdk-examples/` | ~1.3MB (16 complete plugins) |
| `docs/plugin-dev/` | ~80KB across all files |
| `docs/api/` | ~52KB across 6 files |
| `docs/control-pages/` | ~30KB across all files |
| `skills/html-pages/references/` | ~25KB (indigo-api-js.md + design-guidelines.md) |
| `docs/plugin-dev/api/iom/` | ~40KB across 9 files |
| Individual IOM files | ~3–6KB each |
