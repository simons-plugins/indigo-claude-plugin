<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/reference/device-subclasses/speedcontrol/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# SpeedControlDevice { .ref-head-no-code }

Speed control devices are generally controllers for motors of some type. The first implementation was for the Insteon FanLinc, which is a ceiling fan motor controller. This device type provides two different methods of setting the speed of the motor: by level, which ranges from 0 (off) to 100 (full on), and by index. With a device like a FanLinc, for instance, you can't set an arbitrary speed - you can only set it to some number of fixed speeds and this is what index is for. The FanLinc will in fact respond to setting the level, but we normalize the level to the appropriate speed. Other speed control devices may not choose to do so.

## Class Properties { .ref-head-no-code }

| Property                                     | Type    | Writable | Description                                                                                                                |
|----------------------------------------------|---------|----------|----------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`onState`</span>         | boolean | No       | indicates whether the device is on - shortcut to `dev.states['onOffState']`                                                |
| <span class="nw cb">`speedIndex`</span>      | integer | No       | indicates the current speed index for devices that support some fixed # of speeds - shortcut to `dev.states['speedIndex']` |
| <span class="nw cb">`speedIndexCount`</span> | integer | No       | indicates the number of indexes available for this device (defaults to 4)                                                  |
| <span class="nw cb">`speedLevel`</span>      | integer | No       | indicates the level the device is set to (0-100) - shortcut to `dev.states['speedLevel']`                                  |

## Device States { .ref-head-no-code }

These are the states provided by this device type and accessible through the `dev.states` dictionary. They are read-only, but if you're a plugin developer you can use the `updateStateOnServer()` class method to update the value for devices owned by your plugin.

| State ID                                   | Type    | Property Name | Notes                                                                                                                           |
|--------------------------------------------|---------|---------------|---------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`onOffState`</span>    | boolean | `onState`     | indicates whether the device is on - use `dev.onState` property as a shortcut                                                   |
| <span class="nw cb">`speedIndex`</span>    | boolean | `speedIndex`  | indicates the current speed index for devices that support some fixed # of speeds - use `dev.speedIndex` property as a shortcut |
| <span class="nw cb">`speedIndex.ui`</span> | string  | n/a           | a more user friendly name for the current index (e.g. high, medium, low, off)                                                   |
| <span class="nw cb">`speedLevel`</span>    | integer | `speedLevel`  | indicates the level the device is set to (0-100) - use `dev.speedLevel` property as a shortcut                                  |

## Commands (indigo.speedcontrol.*) { .ref-head-no-code }

### Decrease Speed Index { .ref-head-no-code }

Decreases the speed index.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.speedcontrol.decreaseSpeedIndex(123)`<br>
`indigo.speedcontrol.decreaseSpeedIndex(123, by=2)`<br>
`indigo.speedcontrol.decreaseSpeedIndex(123, delay=10)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                                                   |
|------------------------------------------|----------|---------|-----------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer | id or instance of the device                                                                  |
| <span class="nw cb">`by`</span>          | No       | integer | the number of index positions to decrease by. Defaults to 1 if not specified.                 |
| <span class="nw cb">`delay`</span>       | No       | integer | delays the command by the specified number of seconds. Defaults to no delay if not specified. |

### Increase Speed Index { .ref-head-no-code }

Increases the speed index.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.speedcontrol.increaseSpeedIndex(123)`<br>
`indigo.speedcontrol.increaseSpeedIndex(123, by=2)`<br>
`indigo.speedcontrol.increaseSpeedIndex(123, delay=10)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                                                   |
|------------------------------------------|----------|---------|-----------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer | id or instance of the device                                                                  |
| <span class="nw cb">`by`</span>          | No       | integer | the number of index positions to increase by. Defaults to 1 if not specified.                 |
| <span class="nw cb">`delay`</span>       | No       | integer | delays the command by the specified number of seconds. Defaults to no delay if not specified. |

### Set Speed Index { .ref-head-no-code }

Sets the speed index to the specified value.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.speedcontrol.setSpeedIndex(123, value=2)`<br>
`indigo.speedcontrol.increaseSpeedIndex(123, value=2, delay=10)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                                                   |
|------------------------------------------|----------|---------|-----------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer | id or instance of the device                                                                  |
| <span class="nw cb">`value`</span>       | Yes      | integer | index position to set the index to.                                                           |
| <span class="nw cb">`delay`</span>       | No       | integer | delays the command by the specified number of seconds. Defaults to no delay if not specified. |

### Set Speed Level { .ref-head-no-code }

Sets the speed index to the specified value.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.speedcontrol.setSpeedLevel(123, value=50)`<br>
`indigo.speedcontrol.setSpeedLevel(123, value=75, delay=10)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                                                   |
|------------------------------------------|----------|---------|-----------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer | id or instance of the device                                                                  |
| <span class="nw cb">`value`</span>       | Yes      | integer | level of the motor control, from 0-100.                                                       |
| <span class="nw cb">`delay`</span>       | No       | integer | delays the command by the specified number of seconds. Defaults to no delay if not specified. |
