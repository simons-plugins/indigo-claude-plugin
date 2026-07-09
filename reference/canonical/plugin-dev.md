<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Plugin Development

Plugins integrate new devices, triggers, actions, and services natively into Indigo — distributed as a single `.indigoPlugin` bundle users can double-click to install. Plugins are written in Python against the same [Indigo Object Model](../scripting/iom-concepts.md) used for scripting, plus a declarative XML layer for configuration UI.

## Where to start

Read the [Plugin Developer's Guide](guide.md) first — bundle structure, `Info.plist`, and how the Indigo Plugin Host runs your code. Then grab the [Indigo SDK](https://github.com/IndigoDomotics/IndigoSDK/releases) and explore the [example plugins](sdk-examples.md); modifying an example that's close to your goal is the fastest path to a working plugin. The [Building a Plugin tutorial](tutorials/building.md) walks through adding device types, actions, and event handlers.

If you haven't scripted Indigo before, skim the [Scripting Tutorial](../scripting/tutorial.md) first — plugin callbacks are ordinary IOM Python.

## Reference

- [plugin.py Method Reference](reference/plugin-py/index.md) — `PluginBase` lifecycle methods and every callback hook.
- [Plugin XML Reference](reference/xml/index.md) — `PluginConfig.xml`, `Devices.xml`, `Events.xml`, `Actions.xml`, `MenuItems.xml`, and ConfigUI fields.
- [IOM Reference](../scripting/index.md#iom-reference) — the object model shared with scripting.
- [Python Packages](../scripting/guides/python-packages.md) — what's bundled and how to vendor dependencies.

## Distributing your plugin

Submit finished plugins to the [Indigo Plugin Store](https://www.indigodomo.com/pluginstore/) from [your Indigo account](https://www.indigodomo.com/account/plugins).
