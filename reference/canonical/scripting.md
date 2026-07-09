<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Scripting Indigo

Everything in Indigo you can do from the user interface — and a good deal you can't — can be done from Python. Scripts run in the **Script Editor** (Plugins → Open Scripting Shell), embedded inside triggers, schedules, and action groups, or as external script files. No plugin development required.

## Where to start

If you're new to scripting Indigo, work through the [Scripting Tutorial](tutorial.md) — it builds up from one-line device commands to scripting third-party plugins. Then read [IOM Concepts](iom-concepts.md) to understand how the Indigo Object Model represents your devices, triggers, schedules, action groups, and variables in Python.

## Guides

- [Python Packages](guides/python-packages.md) — what ships with Indigo's bundled Python and how to install additional packages.
- [Python Version Conflicts](../user/troubleshooting/python-conflicts.md) — if scripts behave differently inside and outside Indigo.

## IOM Reference

The complete reference for every IOM class and command namespace: [Actions](reference/actions.md), [Action Groups](reference/action-groups.md), [Devices](reference/devices/index.md), [Device Subclasses](reference/device-subclasses/index.md), [Folders](reference/folders.md), [Schedules](reference/schedules.md), [Triggers](reference/triggers.md), [Variables](reference/variables.md), plus [Server Properties & Commands](reference/server-commands.md), [Insteon Commands](reference/insteon-commands.md), [X10 Commands](reference/x10-commands.md), and [Event Data Path Specifiers](reference/event-data-paths.md).

These pages document the *scripting* (Python) view of Indigo's objects. For what these objects mean and how to use them from the UI, see the [Concept Overview](../user/concepts/index.md) in the User Guide.

## Related

Building a full plugin instead? The [Plugin Development](../plugin-dev/index.md) section builds on everything here. Integrating an external system over HTTP or WebSockets? See [Integration APIs](../api/index.md).
