<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/reference/plugin-py/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Plugin Method Reference

!!! abstract "In this guide"
    This page is a complete reference for `plugin.py` — the main Python class that every Indigo plugin must implement —
    covering lifecycle methods, device and action callbacks, logging, and HTTP request handling.

## plugin.py
Once you have your UI all described, it’s time to write some code. Your `plugin.py` file is just like any other Python file - it will start with any `import` statements to include various libraries, and it can define global variables. The most important part of the `plugin.py` file is the definition of your plugin’s main class:

`class Plugin(indigo.PluginBase):`

This is the class that will define all the entry points into your plugin from the host process and the object bridge between your Python objects and the host process’s C++ objects. Your class must inherit from the `indigo.PluginBase` class. A quick note here - all bridge objects and communication with the IndigoServer will be done through the `indigo` module. Because it’s so important, we automatically import it for you so you don’t need an import statement.

There are a few methods that the host process will call at various times during your plugins lifecycle, some required and others are optional.

!!! note "Subscribing to Object Changes"
    Some of these methods may require you to [subscribe to object changes](../../../scripting/iom-concepts.md#subscribing-to-object-change-events) - specifically, if they're objects that your plugin didn't directly create (devices of other types) or other object types (triggers, schedules, variables). Often, those subscriptions should be made in the `startup()` method.

## In This Section

The `Plugin` class (subclass of `indigo.PluginBase`) implements your plugin through a set of callbacks:

- **[General Plugin Methods](general-methods.md)** — lifecycle: startup, shutdown, concurrent thread, prefs.
- **[Device Methods](device-methods.md)** · **[Trigger Methods](trigger-methods.md)** · **[Variable Methods](variable-methods.md)** — per-object-type callbacks.
- **[Helper Methods](helper-methods.md)** · **[Properties](properties.md)**.
- **[Logging](logging.md)** · **[Processing HTTP Requests](http-requests.md)** · **[Event and Message Flow](message-flow.md)**.
- **[Additional Topics](additional-topics.md)** — preferences file, 3rd-party libraries, dev environment.
