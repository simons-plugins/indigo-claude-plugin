<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/reference/device-subclasses/sensor/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# SensorDevice { .ref-head-no-code }

Some sensor devices, like motion sensors, are treated differently in Indigo. They don’t generally maintain state - so there’s no concept of a sensor being on/off: in the case of a motion sensor, detecting motion and not detecting motion.

They generally send a command of some type when they detect some condition and send another command when they stop detecting it. However, dealing with them in Indigo as if they maintain state is much more useful in many cases. So, Indigo will attempt to maintain a virtual state for each motion sensor if configured that way. Currently, the following devices fall under this category:

- X10 Motion Sensors
- the Wireless Insteon Motion / Occupancy Sensor (2420M) from SmartLabs
- the TriggerLinc from SmartLabs
- the SynchroLinc from SmartLabs

## Class Properties { .ref-head-no-code }

| Property                                            | Type             | Writable | [Min API](https://www.indigodomo.com/indigo/api_version_chart.html) | Description                                                                                               |
|-----------------------------------------------------|------------------|----------|---------------------------------------|-----------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`allowOnStateChange`</span>     | boolean          | No       | 1.6                                   | True if UI controls should be shown or enabled to change the onState                                      |
| <span class="nw cb">`allowSensorValueChange`</span> | boolean          | No       | 1.6                                   | True if UI controls should be shown or enabled to change the sensorValue                                  |
| <span class="nw cb">`onState`</span>                | boolean          | No       | 1.0                                   | indicates that the device is currently in a triggered or ON state (None if sensor doesn't support ON/OFF) |
| <span class="nw cb">`sensorValue`</span>            | integer or float | No       | 1.6                                   | the numerical value of a sensor, such as temperature  (None if sensor doesn't support sensor values)      |

## Commands (indigo.sensor.*) { .ref-head-no-code }

### Set On State { .ref-head-no-code }

Set the sensor onState property. Normally this is unnecessary since Indigo will maintain it for you so this method is provided mainly for testing and error recovery.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.sensor.setOnState(123, value=True)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                              |
|------------------------------------------|----------|---------|----------------------------------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer | id or instance of the device                             |
| value                                    | Yes      | boolean | True to set Indigo’s state to on, False to set it to off |

<span class="ca">**Examples**</span><br>
None
