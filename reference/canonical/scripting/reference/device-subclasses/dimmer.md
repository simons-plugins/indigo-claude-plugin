<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/reference/device-subclasses/dimmer/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# DimmerDevice { .ref-head-no-code }

Dimmer devices are dimmable light modules. They can be turned on and off and their brightness may be set. Your script may manipulate any dimmer device. You may specify that devices defined by your plugin are of this type. The standard dimmer UI in the various clients will be presented to users attempting to control your device.

## Class Properties { .ref-head-no-code }

| Property                                | Type    | Writable | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|-----------------------------------------|---------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`brightness`</span> | integer | No       | an integer from 0-100 indicating the brightness of the device - plugin developers may decide if their device may be on but have a brightness of 0 (non-standard) - set using commands below                                                                                                                                                                                                                                                                                                                                    |
| <span class="nw cb">`ledStates`</span>  | list    | No       | this is a list of booleans that represent the state of LEDs on the device. So, to check to see if LED 3 is on you'd check dev.ledStates[2] (Python arrays are 0-based so the first element is element 0). Currently, only KeypadLinc devices use this array - however, future devices may use it as well so you should probably check the length first to make sure that the LED you're looking for is actually there. Use the len(dev.ledStates) method to see how many entries there are before you access a specific index. |
| <span class="nw cb">`onState`</span>    | boolean | No       | indicates whether the device is on - shortcut for `dev.states['onOffState']`                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

## Device States { .ref-head-no-code }

These are the states provided by this device type and accessible through the `dev.states` dictionary. They are read-only, but if you're a plugin developer you can use the `updateStateOnServer()` class method to update the value for devices owned by your plugin.

| State ID                                     | Type    | Property Name | Notes                                                                                             |
|----------------------------------------------|---------|---------------|---------------------------------------------------------------------------------------------------|
| <span class="nw cb">`brightnessLevel`</span> | integer | `brightness`  | brightness of the device - value is in the range of 0 to 100. Can be accessed by `dev.brightness` |
| <span class="nw cb">`onOffState`</span>      | boolean | `onState`     | indicates whether the device is on - can be accessed by `dev.onState`.                            |

## Commands (indigo.dimmer.*) { .ref-head-no-code }

### All Lights Off { .ref-head-no-code }

Turns off all lights for all protocols unless a direct parameter is specified. The direct parameter, if specified, will determine which lights will be turned off. Lights are defined as all dimmable devices. This command doesn’t work for plugin defined devices regardless of type.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.dimmer.allLightsOff()`<br>
`indigo.dimmer.allLightsOff(indigo.kAllDeviceSel.HouseCodeA)`<br>
`indigo.dimmer.allLightsOff(indigo.kAllDeviceSel.Insteon)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type                                              | Description                                                                                                                                                                          |
|------------------------------------------|----------|---------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span> | No       | [kAllDeviceSel](../devices/base-class.md#all-device-selector-enumeration) | enumerated value to indicate which devices to turn off, all if no parameter is passed - see the [kAllDeviceSel](../devices/base-class.md#all-device-selector-enumeration) enumeration for a full description |

### All Lights On { .ref-head-no-code }

Turns on all lights for all protocols unless a direct parameter is specified. The direct parameter, if specified, will determine which lights will be turned on. Lights are defined as all dimmable devices. This command doesn’t work for plugin defined devices regardless of type.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.dimmer.allLightsOn()`<br>
`indigo.dimmer.allLightsOn(indigo.kAllDeviceSel.HouseCodeA)`<br>
`indigo.dimmer.allLightsOn(indigo.kAllDeviceSel.Insteon)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type                                              | Description                                                                                                                                                                        |
|------------------------------------------|----------|---------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span> | No       | [kAllDeviceSel](../devices/base-class.md#all-device-selector-enumeration) | enumerated value to indicate which lights to turn on, all if no parameter is passed - see the [kAllDeviceSel](../devices/base-class.md#all-device-selector-enumeration) enumeration for a full description |

### Brighten { .ref-head-no-code }

Changes the brightness of the specified light relative to the current brightness.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.dimmer.brighten(123)`<br>
`indigo.dimmer.brighten('Office Lamp', by=50, delay=4)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                      |
|------------------------------------------|----------|---------|------------------------------------------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer | id or instance of the device                                     |
| <span class="nw cb">`by`</span>          | No       | integer | relative amount to brighten by where brightness is 0-100         |
| <span class="nw cb">`delay`</span>       | No       | integer | number of seconds to delay before executing the brighten command |

### Dim { .ref-head-no-code }

Dim the brightness of the specified light by some amount relative to the current brightness.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.dimmer.dim(123)`<br>
`indigo.dimmer.dim('Office Lamp', by=50, delay=4)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                 |
|------------------------------------------|----------|---------|-------------------------------------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer | id or instance of the device                                |
| <span class="nw cb">`by`</span>          | No       | integer | relative amount to dim by where dimness is 0-100            |
| <span class="nw cb">`delay`</span>       | No       | integer | number of seconds to delay before executing the dim command |

### Set Brightness { .ref-head-no-code }

Changes the brightness of the specified light to a specific value.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.dimmer.setBrightness(123, value=75)`<br>
`indigo.dimmer.setBrightness(123, value=75, delay=360)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                 |
|------------------------------------------|----------|---------|-------------------------------------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer | id or instance of the device                                |
| <span class="nw cb">`value`</span>       | Yes      | integer | absolute value to set the brightness to on a scale of 0-100 |
| <span class="nw cb">`delay`</span>       | No       | integer | number of seconds to delay before executing the dim command |

### Set LED State { .ref-head-no-code }

Turns on/off the specified LED. Useful for KeypadLinc (and similar) devices. 

!!! note
    You can't use this method to control the LED of the button(s) that control the direct load - use Turn ON/Turn OFF for those.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.dimmer.setLedState(123, index=0, value=True)`<br>
`indigo.dimmer.setLedState(123, index=0, value=True, suppressLogging=True)`<br>
`indigo.dimmer.setLedState(123, index=0, value=True, updateStatesOnly=True)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                     | Required | Type    | Description                                                                                                                                            |
|-----------------------------------------------|----------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>      | Yes      | integer | id or instance of the device                                                                                                                           |
| <span class="nw cb">`index`</span>            | Yes      | integer | the index of the button. Recall that Python-based arrays are 0-based, so the index is also 0-based. That is, the first object in an array is object 0. |
| <span class="nw cb">`value`</span>            | Yes      | boolean | True to turn on the LED, False to turn it off                                                                                                          |
| <span class="nw cb">`suppressLogging`</span>  | No       | boolean | True to suppress logging (defaults to False)                                                                                                           |
| <span class="nw cb">`updateStatesOnly`</span> | No       | boolean | True to only update Indigo's internal state - no command will be sent to the KPL (defaults to False)                                                   |

### Set Color Levels { .ref-head-no-code }

Sets the color levels for the dimmer device. The levels are the same as brightness, so 0 to 100, except for **whiteTemperature** which ranges from 1200-15000. Real number precision is allowed and the actions UI will display precision up to the hundredths digit, allowing for relatively good precision if a plugin needs to convert between RGB and HSB.

Some RGBW devices (Aeotec bulb) support 2 different white channels with unique white temperatures: warm and cool. In those cases both **whiteLevel** and **whiteLevel2** can be used. Other white color devices allow for a specific temperature value to be specified (in Kelvin). For those devices you would use both the **whiteLevel** parameter in combination with the **whiteTemperature** parameter. Note for specifying white color temperature devices should support either the 2 white level technique, or the single white level + white temperature technique. That is, if the **whiteLevel2** parameter is used then whiteTemperature will be ignored.

<span class="ca">**Command Syntax Examples**</span>

```python
indigo.dimmer.setColorLevels(device, redLevel, greenLevel, blueLevel, whiteLevel,
                             whiteLevel2, whiteTemperature, delay, suppressLogging,
                             updateStatesOnly
)
```

<span class="ca">**Parameters**</span>

| Parameter                                     | Required | Type    | Description                                                                                                                                                                                                                                                                                                                                      |
|-----------------------------------------------|----------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>      | Yes      | integer | id or instance of the device                                                                                                                                                                                                                                                                                                                     |
| <span class="nw cb">`redLevel`</span>         | No       | integer | 0 - 100                                                                                                                                                                                                                                                                                                                                          |
| <span class="nw cb">`greenLevel`</span>       | No       | integer | 0 - 100                                                                                                                                                                                                                                                                                                                                          |
| <span class="nw cb">`blueLevel`</span>        | No       | integer | 0 - 100                                                                                                                                                                                                                                                                                                                                          |
| <span class="nw cb">`whiteLevel`</span>       | No       | integer | 0 - 100                                                                                                                                                                                                                                                                                                                                          |
| <span class="nw cb">`whiteLevel2`</span>      | No       | integer | 0 - 100                                                                                                                                                                                                                                                                                                                                          |
| <span class="nw cb">`whiteTemperature`</span> | No       | integer | 1200 - 15000                                                                                                                                                                                                                                                                                                                                     |
| <span class="nw cb">`delay`</span>            | No       | integer | Defaults to 0.                                                                                                                                                                                                                                                                                                                                   |
| <span class="nw cb">`suppressLogging`</span>  | No       | boolean | Defaults to `False`                                                                                                                                                                                                                                                                                                                              |
| <span class="nw cb">`updateStatesOnly`</span> | No       | boolean | is an argument that exists on several device instance APIs that has Indigo update its device state/UI but does not have the corresponding action sent out to physical module. The use cases for this are pretty few, but sometimes you just want the internal state to update and can skip the actual command to the module. Defaults to `False` |

A note about setting color levels: RGB values are expressed as values from 0 to 255, however, Indigo stores those values from 0 to 100. This requires the RGB values to be converted which is very easy.

```python
# RGB value / 255 * 100
redLevel = 128
newRedLevel = redLevel / 255 * 100
```

### Set On State { .ref-head-no-code }

Use the Turn On, Turn Off, and Toggle methods to turn on/off a dimmer device.

<span class="ca">**Examples**</span>

Here are examples of device properties:

```python
# Getting a device
myDevice = indigo.devices[123]
```

```python
# Set a device’s brightness to 75 if it’s currently
# less than that, but only if it’s turned on
myDevice = indigo.devices[123]
if ((myDevice.brightness < 75) and
    (myDevice.onState)):
	indigo.dimmer.setBrightness(myDevice, 75)
```

```python
# Brighten a light by 25% after 10 minutes
indigo.dimmer.brighten(123, by=25, delay=600)
```

```python
# Logging a message if it’s showing in Indigo Touch
myDevice = indigo.devices[123]
if (myDevice.remoteDisplay):
	indigo.server.log("device is showing in Indigo Touch")
```

```python
# Getting the folder ID that the device is in
myDevice = indigo.devices[123]
myDevice.folderId

# OR

indigo.devices[123].folderId # see comments below
```

You might look at the second example above, and wonder why we didn’t do something like this:

```python
# Set a device’s brightness to 75 if it’s currently
# less than that, but only if it’s turned on
myDevice = indigo.devices[123]
if ((indigo.devices[123].brightness < 75) and
    (indigo.devices[123].onState)):
	indigo.dimmer.setBrightness(indigo.devices[123], 75)
```

That code works correctly, but is very inefficient. The Python to C++ bridge will cause a copy of the object to be made every time `indigo.devices[123]` is used since the devices list is a C++ object, but the object returned from it using the id subscript is bridged to a Python object, and all bridged objects are copies. So, the code directly above will create 3 copies of the device object - very inefficient. The code in the example above gets a single copy of the object and uses that in all the rest of the code. A good rule of thumb is to get an explicit copy of an object if you need to use it more than once.
