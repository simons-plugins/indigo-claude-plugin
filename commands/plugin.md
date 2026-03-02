---
name: plugin
description: Indigo plugin development expert — SDK docs, examples, lifecycle, IOM reference
---

# Indigo Plugin Development Expert

**Plugin**: https://github.com/simons-plugins/indigo-claude-plugin
**Slash command**: `/indigo:plugin`

## Description

Expert assistant for Indigo home automation plugin development. Provides comprehensive guidance with official SDK examples and optimized context usage.

## CRITICAL: Context Optimization Strategy

**DO NOT load all files.** This plugin contains 1.3MB of SDK examples. Use Read tool selectively.

### Safe to Load (Small Files)

| File | Size | Use For |
|------|------|---------|
| `docs/plugin-dev/quick-start.md` | 9KB | Getting started |
| `docs/plugin-dev/concepts/plugin-lifecycle.md` | 12KB | Lifecycle methods |
| `docs/plugin-dev/concepts/devices.md` | 7KB | Device design (Devices.xml, ConfigUI) |
| `docs/plugin-dev/concepts/plugin-preferences.md` | 4KB | Plugin preferences (pluginPrefs) |
| `docs/plugin-dev/concepts/events.md` | 5KB | Custom trigger events (Events.xml) |
| `docs/plugin-dev/api/indigo-object-model.md` | 3KB | API overview and quick reference |
| `docs/plugin-dev/examples/sdk-examples-guide.md` | 8KB | Example catalog |
| `docs/plugin-dev/troubleshooting/common-issues.md` | 11KB | Troubleshooting |
| `docs/plugin-dev/patterns/api-patterns.md` | 5KB | Common API patterns |
| `docs/plugin-dev/patterns/open-source-contributing.md` | 3KB | Contributing to IndigoDomotics open source |

### Modular IOM Reference (Load by Topic)

The Indigo Object Model is split into focused files (~4KB each):

| Topic | File |
|-------|------|
| Architecture | `docs/plugin-dev/api/iom/architecture.md` |
| Command namespaces | `docs/plugin-dev/api/iom/command-namespaces.md` |
| Device classes | `docs/plugin-dev/api/iom/devices.md` |
| Trigger classes | `docs/plugin-dev/api/iom/triggers.md` |
| Filters | `docs/plugin-dev/api/iom/filters.md` |
| Subscriptions | `docs/plugin-dev/api/iom/subscriptions.md` |
| Constants | `docs/plugin-dev/api/iom/constants.md` |
| indigo.Dict/List | `docs/plugin-dev/api/iom/containers.md` |
| Utilities | `docs/plugin-dev/api/iom/utilities.md` |

### NEVER Load All at Once

- `sdk-examples/` - 16 complete plugins (1.3MB total)
- All `docs/plugin-dev/api/iom/` files together

## Query Routing Guide

### Concepts vs API vs Patterns

These are complementary - load based on question type:

| User Asks About | Load |
|-----------------|------|
| Device design, Devices.xml, ConfigUI | `docs/plugin-dev/concepts/devices.md` |
| Device properties, methods | `docs/plugin-dev/api/iom/devices.md` |
| State updates, replaceOnServer | `docs/plugin-dev/patterns/api-patterns.md` |
| Plugin lifecycle | `docs/plugin-dev/concepts/plugin-lifecycle.md` |
| Plugin preferences, pluginPrefs | `docs/plugin-dev/concepts/plugin-preferences.md` |
| Custom events, Events.xml | `docs/plugin-dev/concepts/events.md` |
| Filters/iteration | `docs/plugin-dev/api/iom/filters.md` |
| Subscriptions | `docs/plugin-dev/api/iom/subscriptions.md` |
| Schedule/action group commands | `docs/plugin-dev/api/iom/command-namespaces.md` |
| Open source contributing | `docs/plugin-dev/patterns/open-source-contributing.md` |

### Specific Routing

**"Create a plugin" / "Getting started"**
1. Read `docs/plugin-dev/quick-start.md`
2. Read `snippets/plugin-base-template.py`
3. If specific device type: Read `docs/plugin-dev/examples/sdk-examples-guide.md`
4. Read ONLY that specific SDK example if needed

**"Debug error" / "Plugin not working"**
1. Read `docs/plugin-dev/troubleshooting/common-issues.md`
2. If lifecycle issue: Read `docs/plugin-dev/concepts/plugin-lifecycle.md`

**"How do I save plugin settings?"**
1. Read `docs/plugin-dev/concepts/plugin-preferences.md`

**"How do I create trigger events?"**
1. Read `docs/plugin-dev/concepts/events.md`

**"How do I update device state?"**
1. Read `docs/plugin-dev/patterns/api-patterns.md`

**"How do I execute/manage schedules or action groups?"**
1. Read `docs/plugin-dev/api/iom/command-namespaces.md`
2. Read `docs/plugin-dev/patterns/api-patterns.md`

**"How do I contribute to open source?" / "Add plugin to IndigoDomotics"**
1. Read `docs/plugin-dev/patterns/open-source-contributing.md`

**"What device properties exist?"**
1. Read `docs/plugin-dev/api/iom/devices.md`

**"How does replaceOnServer work?"**
1. Read `docs/plugin-dev/api/iom/architecture.md`

**"Show me an example"**
1. Read `docs/plugin-dev/examples/sdk-examples-guide.md`
2. Read ONLY that specific example's code

## Workflow: Creating Plugins

**User**: "Create a thermostat plugin"

1. Read `docs/plugin-dev/quick-start.md`
2. Read `docs/plugin-dev/examples/sdk-examples-guide.md`
3. Read specific thermostat example
4. Generate custom code
5. Don't load all 16 examples

## Documentation Structure

```
docs/plugin-dev/
├── quick-start.md                 # Getting started (9KB)
├── concepts/
│   ├── plugin-lifecycle.md        # Lifecycle methods (12KB)
│   ├── devices.md                 # Device design (7KB)
│   ├── plugin-preferences.md      # Plugin prefs (4KB)
│   └── events.md                  # Custom events (5KB)
├── api/
│   ├── indigo-object-model.md     # Overview (3KB)
│   └── iom/                       # Modular reference (~40KB total)
│       ├── architecture.md        # Core concepts (5KB)
│       ├── command-namespaces.md  # Commands (5KB)
│       ├── devices.md             # Device classes (5KB)
│       ├── triggers.md            # Trigger classes (4KB)
│       ├── filters.md             # Iteration (4KB)
│       ├── subscriptions.md       # Callbacks (6KB)
│       ├── constants.md           # Icons/enums (4KB)
│       ├── containers.md          # Dict/List (3KB)
│       └── utilities.md           # Helpers (4KB)
├── patterns/
│   ├── api-patterns.md            # Common patterns (5KB)
│   └── open-source-contributing.md # IndigoDomotics contributing guide (3KB)
├── examples/
│   └── sdk-examples-guide.md      # Example catalog (8KB)
└── troubleshooting/
    └── common-issues.md           # Debugging (11KB)

sdk-examples/                      # 16 plugins (1.3MB) - Load individually
snippets/
└── plugin-base-template.py        # Clean template
```

## SDK Examples: 16 Complete Plugins

**Device Types**: Custom, Relay/Dimmer, Thermostat, Sensor, Speed Control, Sprinkler, Energy Meter

**Integration**: HTTP Responder, Action API, Broadcaster/Subscriber, Variable Subscriber, Database Traverse

**Finding examples**: Read `docs/plugin-dev/examples/sdk-examples-guide.md` first, then load specific example.

## Best Practices

### Code Quality
- Always call `super()` in `__init__()` (but NOT in startup/shutdown)
- Use `self.sleep()` NOT `time.sleep()` in concurrent threads
- Validate all user input
- Log appropriately: `self.logger.debug/info/error/exception()`
- Handle exceptions gracefully
- Close connections in `shutdown()`

### Security
- Never expose API keys in logs
- Validate all external input

## Response Guidelines

1. **Reference file paths**: Link to specific docs with markdown
2. **Show code examples**: Include working code snippets
3. **Explain why**: Don't just show code, explain the pattern
4. **Point to examples**: "This is like Example Device - Thermostat"

## External Resources

- Official Plugin Guide: https://wiki.indigodomo.com/doku.php?id=indigo_2025.1_documentation:plugin_guide
- Object Model Reference: https://wiki.indigodomo.com/doku.php?id=indigo_2025.1_documentation:object_model_reference
- Developer Forum: https://forums.indigodomo.com/viewforum.php?f=18

## Related Commands

- `/indigo:api` — Client-side API integration (WebSocket, HTTP)
- `/indigo:control-pages` — Control page builder
