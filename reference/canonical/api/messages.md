<!-- GENERATED from https://docs.indigodomo.com/2025.2/api/messages/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# API Messages
As mentioned earlier, both the WebSocket and HTTP APIs use JSON as the message format. We have exposed JSON versions of main Indigo objects: devices, variables, action groups, and control pages. We are also exposing command messages, which parallel the IOM command namespaces (where appropriate) for each of these object types (i.e. [indigo.device](../scripting/reference/devices/base-class.md#commands-indigodevice), [indigo.variable](../scripting/reference/variables.md#commands-indigovariable), etc.), which will allow you to command devices, set variable values, execute action groups, etc.

There are also two other message types: event log messages, which represent each message that flow into the Event Log window, and error messages, which is a standardized way to communicate error conditions with each API.

In this section, we will give examples of each message type and describe their use.

If you are new to JSON, you might want to use the [JSON Validator website](https://jsonlint.com) to validate that your JSON messages are valid JSON.

## Device Messaging
This section describes the messages that you'll use when implementing either the WebSocket or HTTP APIs. They fall into two categories: device objects and device commands.

### Device Objects
You’ll receive full device JSON objects which represent an Indigo device instance. Each device will be slightly different based on the device class and the definition (if a custom device). See the [Indigo Object Model](../scripting/iom-concepts.md) docs for device details.

#### Example device object
This is an example of an Indigo device as a JSON object. Of course, to accommodate the wide variety of supported device types, each one will be somewhat different. This one represents an Insteon Dimmer.

```json
{
  "class": "indigo.DimmerDevice",
  "address": "3B.04.7A",
  "batteryLevel": null,
  "blueLevel": null,
  "brightness": 0,
  "buttonConfiguredCount": 0,
  "buttonGroupCount": 1,
  "configured": true,
  "defaultBrightness": 100,
  "description": "- sample device -",
  "deviceTypeId": "",
  "displayStateId": "brightnessLevel",
  "displayStateImageSel": "indigo.kStateImageSel.DimmerOff",
  "displayStateValRaw": 0,
  "displayStateValUi": "0",
  "enabled": true,
  "energyAccumBaseTime": null,
  "energyAccumTimeDelta": null,
  "energyAccumTotal": null,
  "energyCurLevel": null,
  "errorState": "",
  "folderId": 1552926800,
  "folder": {
    "class": "indigo.Folder",
    "id": 1552926800,
    "name": "Insteon",
    "remoteDisplay": true
  },
  "globalProps": {},
  "greenLevel": null,
  "id": 1508839119,
  "lastChanged": "2023-02-01T11:39:58",
  "lastSuccessfulComm": "2023-02-01T11:39:58",
  "ledStates": [],
  "model": "LampLinc (dual-band)",
  "name": "Insteon Dimmer",
  "onBrightensToDefaultToggle": true,
  "onBrightensToLast": false,
  "onState": false,
  "ownerProps": {},
  "pluginId": "",
  "pluginProps": {},
  "protocol": "indigo.kProtocol.Insteon",
  "redLevel": null,
  "remoteDisplay": false,
  "sharedProps": {},
  "states": {
    "brightnessLevel": 0,
    "onOffState": false
  },
  "subModel": "Plug-In",
  "subType": "Plug-In",
  "supportsAllLightsOnOff": true,
  "supportsAllOff": true,
  "supportsColor": false,
  "supportsOnState": true,
  "supportsRGB": false,
  "supportsRGBandWhiteSimultaneously": false,
  "supportsStatusRequest": true,
  "supportsTwoWhiteLevels": false,
  "supportsTwoWhiteLevelsSimultaneously": false,
  "supportsWhite": false,
  "supportsWhiteTemperature": false,
  "version": 67,
  "whiteLevel": null,
  "whiteLevel2": null,
  "whiteTemperature": null
}
```

Message that contain device objects generate those objects by first converting the device to a python dictionary and then converting the python dictionary to JSON. See the [Generating a Dictionary for a device](../scripting/reference/devices/dictionary.md#generating-a-dictionary-for-a-device) section of the IOM Reference for details.

!!! note
    The `folder` element is only available in the HTTP API. Folders are handled differently in the WebSocket API.

#### Device Command Messages
One thing you will notice as you are looking through these examples, is that they closely mirror the Python-based [IOM commands for controlling devices](../scripting/iom-concepts.md). This was intentional to make learning one API a stepping stone to another. The HTTP API messages and the WebSocket API messages are identical, and are very clearly a JSON-rendered version of the associated IOM command.

 The `id` key is optional, but may contain a user generated ID that will be logged and returned to help match up with message requests. Custom `id` values should be strings.

#### indigo.device
[indigo.device](../scripting/reference/devices/base-class.md#commands-indigodevice) command messages can be used for several Indigo device types - [indigo.RelayDevice](../scripting/reference/device-subclasses/relay.md#relaydevice), [indigo.DimmerDevice](../scripting/reference/device-subclasses/dimmer.md#dimmerdevice), [indigo.SpeedControl](../scripting/reference/device-subclasses/speedcontrol.md#speedcontroldevice) (fans), and some [indigo.SensorDevice](../scripting/reference/device-subclasses/sensor.md#sensordevice) instances.

**status request** `[indigo.device.statusRequest(123456789)](../scripting/reference/devices/base-class.md#status-request)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.device.statusRequest",
  "objectId": 123456789
}
```

**Note:** This message will work on any Indigo device type, though the device that it targets may not respond to status request messages in which case it will do nothing.

This won't necessarily cause a device update message - if the device didn't have any changes after the status request, there will be no updates to the device in the server, so no update message will be sent out the websocket.

**toggle** `[indigo.device.toggle(123456789, delay=5, duration=10)](../scripting/reference/devices/base-class.md#toggle)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.device.toggle",
  "objectId": 123456789,
  "parameters": {
    "delay": 5,
    "duration": 10
  }
}
```

`objectId` is the id of the device. The `parameters` dictionary is optional.

**turn off** `[indigo.device.turnOff(123456789, delay=5, duration=10)](../scripting/reference/devices/base-class.md#turn-off)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.device.turnOff",
  "objectId": 123456789,
  "parameters": {
    "delay": 5,
    "duration": 10
  }
}
```

`objectId` is the id of the device. The `parameters` dictionary is optional.

**turn on** `[indigo.device.turnOn(123456789, delay=5, duration=10)](../scripting/reference/devices/base-class.md#turn-on)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.device.turnOn",
  "objectId": 123456789,
  "parameters": {
    "delay": 5,
    "duration": 10
    }
}
```

`objectId` is the id of the device. The `parameters` dictionary is optional.

**lock** `[indigo.device.lock(123456789, delay=5, duration=10)](../scripting/reference/devices/base-class.md#lock)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.device.lock",
  "objectId": 123456789,
  "parameters": {
    "delay": 5,
    "duration": 10
  }
}
```

`objectId` is the id of the device. The `parameters` dictionary is optional.

**unlock** `[indigo.device.unlock(123456789, delay=5, duration=10)](../scripting/reference/devices/base-class.md#unlock)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.device.unlock",
  "objectId": 123456789,
  "parameters": {
    "delay": 5,
    "duration": 10
  }
}
```

`objectId` is the id of the device. The `parameters` dictionary is optional.

**enable/disable** `[indigo.device.enable(123456789, value=True)](../scripting/reference/devices/base-class.md#enable-disable)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.device.enable",
  "objectId": 123456789,
  "parameters": {
    "value": True,
  }
}
```

`objectId` is the id of the device. The `value` parameter is optional (`True` to enable, `False` to disable).

#### indigo.dimmer
[indigo.dimmer](../scripting/reference/devices/base-class.md#commands-indigodevice) command messages can be used for [indigo.DimmerDevice](../scripting/reference/device-subclasses/dimmer.md#dimmerdevice) instances.

**brighten** `[indigo.dimmer.brighten(123456789, delay=5, duration=10)](../scripting/reference/device-subclasses/dimmer.md#brighten)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.dimmer.brighten",
  "objectId": 123456789,
  "parameters": {
    "by": 5,
    "delay": 10
  }
}
```

`objectId` is the id of the device. The `parameters` dictionary is optional.

**dim** `[indigo.dimmer.dim(123456789, delay=5, duration=10)](../scripting/reference/device-subclasses/dimmer.md#dim)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.dimmer.dim",
  "objectId": 123456789,
  "parameters": {
    "by": 5,
    "delay": 10
  }
}
```

`objectId` is the id of the device. The `parameters` dictionary is optional.

**set brightness** `[indigo.dimmer.setBrightness(123456789, value=50, delay=5)](../scripting/reference/device-subclasses/dimmer.md#set-brightness)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.dimmer.setBrightness",
  "objectId": 123456789,
  "parameters": {
    "value": 50,
    "delay": 10
  }
}
```

`objectId` is the id of the device. The `value` parameter is required and the `delay` parameter is optional.

#### indigo.iodevice
[indigo.iodevice](../scripting/reference/devices/base-class.md#commands-indigodevice) command messages can be used for [indigo.MultiIODevice](../scripting/reference/device-subclasses/dimmer.md#dimmerdevice) instances.

**set binary output** `[indigo.iodevice.setBinaryOutput(123456789, index=2, value=True)](../scripting/reference/device-subclasses/multiio.md#set-binary-output)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.iodevice.setBinaryOutput",
  "objectId": 123456789,
  "parameters": {
    "index": 5,
    "value": true
  }
}
```

`objectId` is the id of the device. The `index` and `value` parameters are required.

#### indigo.sensor
[indigo.sensor](../scripting/reference/device-subclasses/sensor.md#commands-indigosensor) command messages can be used for [indigo.sensorDevice](../scripting/reference/device-subclasses/sensor.md#sensordevice) instances.

**set on state** `[indigo.sensor.setOnState(123456789, value=True)](../scripting/reference/device-subclasses/sensor.md#set-on-state)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.sensor.setOnState",
  "objectId": 123456789,
  "parameters": {
    "value": true
  }
}
```

`objectId` is the id of the device. The `value` parameter is required.

#### indigo.speedcontrol
[indigo.speedcontrol](../scripting/reference/device-subclasses/speedcontrol.md#commands-indigospeedcontrol) command messages can be used for [indigo.speedcontrol](../scripting/reference/device-subclasses/speedcontrol.md#speedcontroldevice) instances.

**decrease speed index** `[indigo.speedcontrol.decreaseSpeedIndex(123456789, by=2, delay=5)](../scripting/reference/device-subclasses/speedcontrol.md#decrease-speed-index)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.speedcontrol.decreaseSpeedIndex",
  "objectId": 123456789,
  "parameters": {
    "by": 2,
    "delay": 5
  }
}
```

`objectId` is the id of the device. The `by` and `delay` parameters are optional.

**increase speed index** `[indigo.speedcontrol.increaseSpeedIndex(123456789, by=2, delay=5)](../scripting/reference/device-subclasses/speedcontrol.md#increase-speed-index)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.speedcontrol.increaseSpeedIndex",
  "objectId": 123456789,
  "parameters": {
    "by": 2,
    "delay": 5
  }
}
```

`objectId` is the id of the device. The `by` and `delay` parameters are optional.

**set speed index** `[indigo.speedcontrol.setSpeedIndex(123456789, value=2, delay=5)](../scripting/reference/device-subclasses/speedcontrol.md#set-speed-index)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.speedcontrol.setSpeedIndex",
  "objectId": 123456789,
  "parameters": {
    "value": 2,
    "delay": 5
  }
}
```

`objectId` is the id of the device. The `value` parameter is required and the `delay` parameter is optional.

**set speed level** `[indigo.speedcontrol.setSpeedLevel(123456789, value=50, delay=5)](../scripting/reference/device-subclasses/speedcontrol.md#set-speed-level)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.speedcontrol.setSpeedLevel",
  "objectId": 123456789,
  "parameters": {
    "value": 50,
    "delay": 5
  }
}
```

`objectId` is the id of the device. The `value` parameter is required and the `delay` parameter is optional.

#### indigo.sprinkler
[indigo.sprinkler](../scripting/reference/device-subclasses/sprinkler.md#commands-indigosprinkler) command messages can be used for [indigo.sprinkler](../scripting/reference/device-subclasses/sprinkler.md#sprinklerdevice) instances.

**next zone**  `[indigo.sprinkler.nextZone(123456789)](../scripting/reference/device-subclasses/sprinkler.md#next-zone)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.sprinkler.nextZone",
  "objectId": 123456789
}
```

`objectId` is the id of the device. The `next zone` command does not have any additional parameters.

**pause schedule**  `[indigo.sprinkler.pause(123456789)](../scripting/reference/device-subclasses/sprinkler.md#pause-schedule)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.sprinkler.pause",
  "objectId": 123456789
}
```

`objectId` is the id of the device. The `next zone` command does not have any additional parameters.

**previous zone**  `[indigo.sprinkler.previousZone(123456789)](../scripting/reference/device-subclasses/sprinkler.md#previous-zone)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.sprinkler.previousZone",
  "objectId": 123456789
}
```

`objectId` is the id of the device. The `previous zone` command does not have any additional parameters.

**resume schedule**  `[indigo.sprinkler.resume(123456789)](../scripting/reference/device-subclasses/sprinkler.md#resume-schedule)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.sprinkler.resume",
  "objectId": 123456789
}
```

`objectId` is the id of the device. The `resume schedule` command does not have any additional parameters.

**run schedule**  `[indigo.sprinkler.run(123456789, schedule=[10, 15, 8, 0, 0, 0, 0, 0])](../scripting/reference/device-subclasses/sprinkler.md#run-schedule)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.sprinkler.run",
  "objectId": 123456789,
  "parameters": {
    "schedule": [10, 15, 8, 0, 0, 0, 0, 0]
  }
}
```

`objectId` is the id of the device. The `schedule` parameter is required.

**stop schedule**  `[indigo.sprinkler.stop(123456789)](../scripting/reference/device-subclasses/sprinkler.md#stop-schedule)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.sprinkler.stop",
  "objectId": 123456789
}
```

`objectId` is the id of the device. The `resume schedule` command does not have any additional parameters.

**set active zone**  `[indigo.sprinkler.setActiveZone(123456789, index=2)](../scripting/reference/device-subclasses/sprinkler.md#set-active-zone)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.sprinkler.setActiveZone",
  "objectId": 123456789,
  "parameters": {
    "index": 2
  }
}
```

`objectId` is the id of the device. The `index` parameter is required.

#### indigo.thermostat
[indigo.thermostatdevice](../scripting/reference/device-subclasses/thermostat.md#commands-indigothermostat) command messages can be used for [indigo.thermostat](../scripting/reference/device-subclasses/thermostat.md#thermostatdevice) instances.

**decrease cool setpoint**  `[indigo.thermostat.decreaseCoolSetpoint(123456789, delta=2)](../scripting/reference/device-subclasses/thermostat.md#decrease-cool-setpoint)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.thermostat.decreaseCoolSetpoint",
  "objectId": 123456789,
  "parameters": {
    "delta": 2
  }
}
```

`objectId` is the id of the device. The `value` parameter is optional.

**decrease heat setpoint**  `[indigo.thermostat.decreaseHeatSetpoint(123456789, delta=2)](../scripting/reference/device-subclasses/thermostat.md#decrease-heat-setpoint)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.thermostat.decreaseHeatSetpoint",
  "objectId": 123456789,
  "parameters": {
    "delta": 2
  }
}
```

`objectId` is the id of the device. The `value` parameter is optional.

**increase cool setpoint**  `[indigo.thermostat.increaseCoolSetpoint(123456789, delta=2)](../scripting/reference/device-subclasses/thermostat.md#increase-cool-setpoint)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.thermostat.increaseCoolSetpoint",
  "objectId": 123456789,
  "parameters": {
    "delta": 2
  }
}
```

`objectId` is the id of the device. The `value` parameter is optional.

**increase heat setpoint**  `[indigo.thermostat.increaseHeatSetpoint(123456789, delta=2)](../scripting/reference/device-subclasses/thermostat.md#increase-heat-setpoint)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.thermostat.increaseHeatSetpoint",
  "objectId": 123456789,
  "parameters": {
    "delta": 2
  }
}
```

`objectId` is the id of the device. The `value` parameter is optional.

**set cool setpoint**  `[indigo.thermostat.setCoolSetpoint(123456789, value=76)](../scripting/reference/device-subclasses/thermostat.md#set-cool-setpoint)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.thermostat.setCoolSetpoint",
  "objectId": 123456789,
  "parameters": {
    "value": 76
  }
}
```

`objectId` is the id of the device. The `value` parameters is required.

**set fan mode**  `[indigo.thermostat.setFanMode(123456789, value=indigo.kFanMode.AlwaysOn)](../scripting/reference/device-subclasses/thermostat.md#set-fan-mode)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.thermostat.setFanMode",
  "objectId": 123456789,
  "parameters": {
    "value": "indigo.kFanMode.AlwaysOn"
  }
}
```

`objectId` is the id of the device. The `value` parameter is required.

**set heat setpoint**  `[indigo.thermostat.setHeatSetpoint(123456789, value=76)](../scripting/reference/device-subclasses/thermostat.md#set-heat-setpoint)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.thermostat.setHeatSetpoint",
  "objectId": 123456789,
  "parameters": {
    "value": 76
  }
}
```

`objectId` is the id of the device. The `value` parameter is required.

**set hvac mode**  `[indigo.thermostat.setHvacMode(123456789, value=indigo.kHvacMode.HeatCool)](../scripting/reference/device-subclasses/thermostat.md#set-hvac-mode)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.thermostat.setHvacMode",
  "objectId": 123456789,
  "parameters": {
    "value": "indigo.kHvacMode.HeatCool"
  }
}
```

`objectId` is the id of the device. The `value` parameter is required.

### Variable Messaging
This section describes the messages that you'll use when implementing either the WebSocket or HTTP APIs when dealing with Indigo devices. They fall into two categories: device objects and device command messages.

#### Variable Objects
You’ll receive full variable JSON objects which represent an Indigo variable instance. See the [Indigo Object Model](../scripting/iom-concepts.md) docs for device details.

##### Example variable object
```json
{
  "class": "indigo.Variable",
  "description": "",
  "folderId": 0,
  "folder": {},
  "globalProps": {
    "com.indigodomo.indigoserver": {}
  },
  "id": 345633244,
  "name": "house_status",
  "pluginProps": {},
  "readOnly": false,
  "remoteDisplay": true,
  "sharedProps": {},
  "value": "home"
}
```

Messages that contain variable objects generate those objects by first converting the variable to a python dictionary and then converting the python dictionary to JSON. See the [Generating a Dictionary for a variable](../scripting/reference/variables.md) section of the IOM Reference for details.

!!! note
    The `folder` element is only available in the HTTP API. Folders are handled differently in the WebSocket API.

#### Variable Command Messages
The only action that can currently be performed on a variable is to update the value. The `id` key is optional, but may contain a user generated ID that will be logged and returned to help match up with message requests. Custom `id` values should be strings.

**updateValue**  `[indigo.variable.updateValue(123456789, value="Some string value")](../scripting/reference/variables.md#update-value)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.variable.updateValue",
  "objectId": 123456789,
  "parameters": {
    "value": "Some string value"
  }
}
```

`objectId` is the id of the variable. The `value` parameter is required and must be a string. Pass an empty string ("") to clear the variable value.

### Action Group Messaging
#### Action Group Objects
You’ll receive full variable JSON objects which represent an Indigo action group instance. See the [Indigo Object Model](../scripting/iom-concepts.md) docs for action group details.

##### Example action group object
```json
{
  "class": "indigo.ActionGroup",
  "description": "",
  "folderId": 532526508,
  "folder": {
    "class": "indigo.Folder",
    "id": 532526508,
    "name": "Mood Scenes",
    "remoteDisplay": true
  },
  "globalProps": {
    "com.indigodomo.indigoserver": {
      "speakDelayTime": "5",
      "speakTextVariable": "speech_string"
    }
  },
  "id": 94914463,
  "name": "Movie Night",
  "pluginProps": {},
  "remoteDisplay": true,
  "sharedProps": {
    "speakDelayTime": "5",
    "speakTextVariable": "speech_string"
  }
}
```

!!! note
    The `folder` element is only available in the HTTP API. Folders are handled differently in the WebSocket API.

#### Action Group Command Messages
There is only a single action group command, and that's to execute it. The `id` key is optional, but may contain a user generated ID that will be logged and returned to help match up with message requests. Custom `id` values should be strings.

** execute **  `[indigo.actionGroup.execute(123456789)](../scripting/reference/action-groups.md#execute)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.actionGroup.execute",
  "objectId": 123456789
}
```

`objectId` is the id of the action group.

### Schedule Messaging
#### Schedule Objects
You’ll receive full variable JSON objects which represent an Indigo schedule instance. See the [Indigo Object Model](../scripting/iom-concepts.md) docs for schedule details.

```json
{
  "class": "indigo.Schedule",
  "absoluteDate": null,
  "absoluteDateTime": null,
  "absoluteTime": null,
  "autoDelete": false,
  "configured": true,
  "dateType": 0,
  "description": "",
  "enabled": false,
  "folderId": 0,
  "globalProps": {},
  "id": 12345678,
  "name": "My Schedule Name",
  "nextExecution": null,
  "pluginProps": {},
  "randomizeBy": 0,
  "remoteDisplay": true,
  "sharedProps": {},
  "sunDelta": 0,
  "suppressLogging": false,
  "timeType": 3
}
```

#### Schedule Command Messages
These are the available schedule commands. The `id` key is optional, but may contain a user generated ID that will be logged and returned to help match up with message requests. Custom `id` values should be strings.

** execute **  `[indigo.schedule.execute(123456789)](../scripting/reference/schedules.md#execute)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.schedule.execute",
  "objectId": 12345678,
}
```

`objectId` is the id of the schedule.

** enable ** `[indigo.schedule.enable(123456789)](../scripting/reference/schedules.md#enable)`
```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.schedule.enable",
  "objectId": 12345678,
  "parameters": {"value": false}
}
```

### Trigger Messaging
#### Trigger Objects
You’ll receive full variable JSON objects which represent an Indigo trigger instance. See the [Indigo Object Model](../scripting/iom-concepts.md) docs for trigger details.

```json
{
  "class": "indigo.Trigger",
  "configured": true,
  "description": "A trigger description.",
  "enabled": true,
  "folderId": 12345678,
  "globalProps": {
    "com.indigodomo.indigoserver": {},
    "com.indigodomo.webserver": {
      "httpMethod": "GET",
      "postProcessing": "JSON",
      "webhookId": "8aa4b5140c5c473ea170465239143839"
    },
    "emptyDict": {}
  },
  "id": 12345678,
  "name": "My Trigger Name",
  "pluginProps": {},
  "remoteDisplay": true,
  "sharedProps": {},
  "suppressLogging": false
}
```

#### Trigger Command Messages
These are the available trigger commands. The `id` key is optional, but may contain a user generated ID that will be logged and returned to help match up with message requests. Custom `id` values should be strings.

** execute **  `[indigo.trigger.execute(123456789)](../scripting/reference/triggers.md#execute)`

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.trigger.execute",
  "objectId": 12345678,
}
```

`objectId` is the id of the trigger.

** enable **   `[indigo.trigger.enable(123456789)](../scripting/reference/triggers.md#enable)`
```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.trigger.enable",
  "objectId": 12345678,
  "parameters": {"value": false}
}
```

### Log Messages
We convert the event Indigo dictionary into a python dictionary in the `event_log_line_received` plugin method.

#### Example Log Message
```json
{
  "message": "Stopping plugin \"Web Server 2025.1.0\" (pid 1020)",
  "timeStamp": "2022-12-01T12:03:27.759000",
  "typeStr": "Application",
  "typeVal": 0
  "objectType": "indigo.LogEvent"
}
```

Note that `typeVal` will be one of the following values:

```python
EVENT_TYPES = {
  Application = 0,
  Error = 1,
  Error_Client = 2,
  Warning = 3,
  Warning_Client = 4,
  Debug_Server = 5,
  Debug_Client = 6,
  Debug_Plugin = 7,
  Custom = 8,
}
```

You can use the values above to help determine any kind of decoration you want to use when displaying or otherwise interpreting the log event.

#### Log Command Message
In some situations, you might want to send a log message to the server and have that message appear in the Indigo Event Log. This is done using the *`indigo.server.log`* command namespace and the *`command`* API endpoint.  Here is full python example with a log message payload:

```python
import requests

REFLECTOR = "MY_REFLECTOR_NAME"
API_KEY = "MY_API_KEY"
url = f"https://{REFLECTOR}.indigodomo.net/v2/api/command"
headers = {'Authorization': f'Bearer {API_KEY}'}

message = {
"id": "optional-user-generated-id",
"messageText": "Some important log message goes here.",
"message": "indigo.server.log",
}

response = requests.post(url, headers=headers, json=message)

if response.status_code == 200:
    device_list = response.json()
    print(device_list)
else:
    print(f"Failed to fetch data. Status code: {response.status_code} - {response.text}")
```

## Plugin Messaging
There are two plugin-based command messages in the HTTP API: `*plugin.restart*` and `*plugin.executeAction*`.

### Plugin Command Messages
**restart plugin **

When the `*plugin.restart*` command message is sent to the HTTP API, Indigo will restart the target plugin **only if it is installed and enabled.**
```python
{
    "id": "some-optional-message-text",
    "message": "plugin.restart",
    "pluginId": "com.some.indigo.plugin"   # the plugin's bundle identifier
}
```

** Execute Plugin Action **

When the `*plugin.executeAction*` command message is sent to the HTTP API, Indigo will attempt to fire the plugin action **as long as the plugin is installed and enabled.** Many plugin actions require additional properties to complete (such as plugin Action configuration settings) and those are included as `*props*`. The `*props*` payload must be valid JSON.
```python
{
    "id": "some-optional-message-text",
    "message": "plugin.executeAction",
    "pluginId": "com.some.indigo.plugin",   # the plugin's bundle identifier
    "actionId": "some_plugin_action",  # the ID of the plugin action found in the plugin's Actions.xml file [string]
    "deviceId": 12345678,  # the device ID targeted by the plugin action (not all actions will require a device ID). [int]
    "props": {"prop1": "foo", "prop2": "bar"},  # required if the plugin action requires props to fire the action [valid JSON]
    "waitUntilDone": True  # optional [True/False]
}
```

## Error Messaging
Error messages will be returned to API clients in the event that something didn’t go as planned. The structure of messages returned will depend on what went wrong and how the message was sent. **Note that folder messages are added to the feed by the server; there are no folder endpoints to manage folders from a client at this time.**

A generic example message is provided in JSON format:

### Generic Error Message
```json
{
  "error": "Some error description",
  "id": "the id sent from the client in the message, or null if there wasn't one",
  "validationErrors": {
    "field1": "some error that occurred in the message with the key field1"
  }
}
```

where the value of the JSON name (or key) `validationErrors` is a dictionary with a field name and a description of the error in that field that came from the client. For instance, if you pass a float `value` to the `indigo.variable.updateValue` message:

#### Example API Call
```json
{
  "id": "a-random-id-for-this-message",
  "message": "indigo.variable.updateValue",
  "objectId": 123456789,
  "parameters": {
    "value": 1234.56
  }
}
```

You will receive the following error response:

##### Resulting Error Message
```json
{
  "validationErrors": {
    "value": "variable values must be strings"
  },
  "error": "invalid command payload received, id: my-set-var-command",
  "id": "a-random-id-for-this-message"
}
```

The `error` key is the indicator that the response is some kind of error. `validationErrors` is a dict which contains all the validation errors for the message, in this case the `value` that was passed in was not a string (it was the float `1234.56`). The possible keys in the error message reply `validationErrors` could be:

1. `message`,
1. `objectId`,
1. `parameters`, and
1. `value`

based on the `indigo.variable.updateValue` message format (we do **no validation** on the `id` value passed in, we pass it through, and if your message doesn’t contain one then the value will be `null`). Only the keys from your message that have errors will be returned. So in the example error above, only the `value` key had a validation error (because we passed in a float) so that was the only key returned.

`id` is the ID you (may have) passed in when you sent the command message.

#### Invalid JSON
One other type of error that you may receive would be if you POST a string (or something else, like XML, etc.) that’s not JSON. This will result in the following message return:

##### Example Invalid JSON Message
```json
{
  "request_body": "this is not valid JSON",
  "error": "invalid JSON"
}
```

We will return the entire request body since it isn’t valid JSON, and we don’t know what else to do with it.

#### Web Server Warnings
Occasionally, you might see a warning from the Web Server written to the Indigo Event Log that might look something like this:

*`Web Server Warning     HTTP 400 error for request /v2/api/command/ from 123.45.678.90`*

The codes are standard HTTP response codes and may help you to determine what happened. The most common codes you might encounter are:

| Code | Condition             | Description                                                                                                                                                                                                                     |
|------|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 200  | OK or Success         | Indicates that the request has succeeded.                                                                                                                                                                                       |
| 400  | Bad Request           | Indicates that the server cannot or will not process the request due to something that is perceived to be a client error (for example, malformed request syntax, invalid request message framing, or deceptive request routing) |
| 401  | Unauthorized          | Indicates that the client request has not been completed because it lacks valid authentication credentials for the requested resource.                                                                                          |
| 404  | Not Found             | Indicates that the server cannot find the requested resource.                                                                                                                                                                   |
| 500  | Internal Server Error | Indicates that the server encountered an unexpected condition that prevented it from fulfilling the request.                                                                                                                    |


You might see another code from time to time, and a complete list of codes and their meanings can be found on the [Mozilla web docs](https://developer.mozilla.org/en-US/docs/Web/HTTP) site under "HTTP response status codes".

#### Other Errors and Warnings
From time to time, you might see other errors and warnings as you use the APIs. These messages can appear in the Indigo Events Log, the Web Server plugin log, and in your client's console. Sometimes, these messages can be somewhat generic (it's not possible to catch every conceivable error) so it can be helpful to know where to look for answers.

A likely place where errors can creep into your API scripting involves the payloads that are sent to and from the Indigo Web Server. For example, JSON payloads may be converted to XML behind the scenes, so bear in mind the XML conventions found in the [Plugin Developer's Guide](../plugin-dev/guide.md#indigo-plugin-xml-conventions).
