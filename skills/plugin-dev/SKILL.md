---
name: plugin-dev
description: Indigo plugin development guidance
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

You're working on an Indigo plugin. Key resources available:

## Quick Reference

- **Plugin lifecycle**: Read `docs/plugin-dev/concepts/plugin-lifecycle.md`
- **Device design (Devices.xml, ConfigUI)**: Read `docs/plugin-dev/concepts/devices.md`
- **Custom events (Events.xml)**: Read `docs/plugin-dev/concepts/events.md`
- **Plugin preferences**: Read `docs/plugin-dev/concepts/plugin-preferences.md`
- **API patterns (state updates, replaceOnServer)**: Read `docs/plugin-dev/patterns/api-patterns.md`
- **Troubleshooting**: Read `docs/plugin-dev/troubleshooting/common-issues.md`
- **SDK examples**: Read `docs/plugin-dev/examples/sdk-examples-guide.md`, then load specific example from `sdk-examples/`

## Essential Rules

- Always call `super().__init__()` in `__init__` (but NOT super() in startup/shutdown)
- Use `self.sleep()` not `time.sleep()` in concurrent threads
- Handle `self.StopThread` in `runConcurrentThread`
- Log with `self.logger.debug/info/error/exception()`
- Python 3.10+ (Indigo 2023+)

## Full Documentation

For comprehensive guidance, use `/indigo:plugin`.
