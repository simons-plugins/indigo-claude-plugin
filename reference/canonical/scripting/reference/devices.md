<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/reference/devices/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Devices

In the IOM, all devices are derived from a common `Device` base class. This base class provides for all the common properties of a device (including devices defined by Server plugins) and each subclass also inherits all the commands in the device command namespace (`indigo.device.`) - there are a few exceptions that will be noted below. Check out the examples for each section to see how you use each device type.

Like other high-level objects in Indigo, there are rules for modifying devices. For Scripters and Plugin Developers:

- To create, duplicate, delete, and send commands to a device, use the appropriate command namespace as defined below
- To modify a device's definition get a copy of the device, make the necessary changes, then call `myDevice.replaceOnServer()`

For Plugin Developers:

- To update a plugin's props on a device on the server, call `myDevice.replacePluginPropsOnServer(newPropsDict)` rather than try to update them on the local device
- To change a device's state on the server, use `myDevice.updateStateOnServer(key='keyName', value='Value')`
- To change multiple device states on the server at one time, use `myDevice.updateStatesOnServer(update_list)` passing a dictionary that looks like this:

<span class="ca">**example**</span>

```python
dev = indigo.devices[12345678]
key_value_list = [
    {'key':'someKey1', 'value':True},
    {'key':'someKey2', 'value':456},
    {'key':'someKey3', 'value':789.123, 'uiValue':"789.12 lbs", 'decimalPlaces':2}
]
dev.updateStatesOnServer(key_value_list)
```

!!! note
    All API descriptions apply to all API versions unless otherwise specified.

## In This Section

- **[Device Base Class](base-class.md)** — properties, plugin properties, custom states, and the `indigo.device.*` commands shared by every device.
- **[Device Dictionary Representation](dictionary.md)** — the dict form of a device.
- **[Device Subclasses](../device-subclasses/index.md)** — type-specific properties, states, and commands (dimmer, relay, sensor, speed control, sprinkler, thermostat, multi-IO).
