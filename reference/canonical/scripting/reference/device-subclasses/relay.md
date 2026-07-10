<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/reference/device-subclasses/relay/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# RelayDevice { .ref-head-no-code }

Relay devices are very simple devices, often times called appliance modules. They can be turned on and off only. Your script may manipulate any relay device. Your plugin may specify devices that are of this type and the standard relay UI in the various clients will be presented to users when controlling it.

## Class Properties { .ref-head-no-code }

| Property                               | Type    | Writable | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|----------------------------------------|---------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`ledStates`</span> | list    | No       | this is a list of booleans that represent the state of LEDs on the device. So, to check to see if LED 3 is on you'd check dev.ledStates[2] (Python arrays are 0-based so the first element is element 0). Currently, only KeypadLinc devices use this array - however, future devices may use it as well so you should probably check the length first to make sure that the LED you're looking for is actually there. Use the len(dev.ledStates) method to see how many entries there are before you access a specific index. |
| <span class="nw cb">`onState`</span>   | boolean | No       | indicates whether the device is on - shortcut to `dev.states['onOffState']`                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

## Device States { .ref-head-no-code }

These are the states provided by this device type and accessible through the `dev.states` dictionary. They are read-only, but if you're a plugin developer you can use the `updateStateOnServer()` class method to update the value for devices owned by your plugin.

| State ID                                | Type    | Property Name | Notes                                                                         |
|-----------------------------------------|---------|---------------|-------------------------------------------------------------------------------|
| <span class="nw cb">`onOffState`</span> | boolean | `onState`     | indicates whether the device is on - use `dev.onState` property as a shortcut |

## Commands (indigo.relay.*) { .ref-head-no-code }

Use the [Turn On](../devices/base-class.md#turn-on), [Turn Off](../devices/base-class.md#turn-off), and [Toggle](../devices/base-class.md#toggle) methods in the indigo.device.* namespace to turn on/off a relay device.

### Set LED State { .ref-head-no-code }

Turns on/off the specified LED. Useful for KeypadLinc (and similar) devices. 

!!! note
    You can't use this method to control the LED of the button(s) that control the direct load - use Turn ON/Turn OFF for those.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.relay.setLedState(123, index=0, value=True)`<br>
`indigo.relay.setLedState(123, index=0, value=True, suppressLogging=True)`<br>
`indigo.relay.setLedState(123, index=0, value=True, updateStatesOnly=True)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                     | Required | Type    | Description                                                                                                                                            |
|-----------------------------------------------|----------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>      | Yes      | integer | id or instance of the device                                                                                                                           |
| <span class="nw cb">`index`</span>            | Yes      | integer | the index of the button. Recall that Python-based arrays are 0-based, so the index is also 0-based. That is, the first object in an array is object 0. |
| <span class="nw cb">`value`</span>            | Yes      | boolean | True to turn on the LED, False to turn it off                                                                                                          |
| <span class="nw cb">`suppressLogging`</span>  | No       | boolean | True to suppress logging (defaults to False)                                                                                                           |
| <span class="nw cb">`updateStatesOnly`</span> | No       | boolean | True to only update Indigo's internal state - no command will be sent to the KPL (defaults to False)                                                   |

<span class="ca">**Examples**</span>

```python

# Toggle the device

indigo.device.toggle(123)
```
