<!-- GENERATED from https://docs.indigodomo.com/2025.2/api/rest-migration/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# REST API Conversion Examples

!!! abstract "In this guide"
    This page provides side-by-side examples for converting legacy REST API calls to the newer HTTP API format.
    Familiarity with [HTTP API authentication](http.md#authentication) and [JSON message formats](messages.md) is
    recommended before working through the examples.

If you're using the old REST API (which has been deprecated), here are some examples of how you might convert your REST usages to the HTTP API.

The first thing you'll want to understand is how to use [authentication with the HTTP API](http.md#authentication). The examples below use both headers and query args for authentication. You can use whichever works for you. You should replace `YOUR-API-KEY` with [your actual API Key](https://www.indigodomo.com/account/authorizations).

Second, all replies to the API will be [JSON messages](messages.md).

In the following examples, we'll be using a mix of authentication headers and the API Key as a query arg. You can use either. We mark the examples **REST** (old REST API) and **HTTP** (newer HTTP API).

## Device Access { .ref-head-no-code }

### Getting Devices { .ref-head-no-code }

#### get device list { .ca }

**REST**
```bash
http://username:password@127.0.0.1:8176/devices.json
```

**HTTP**
```bash
http://127.0.0.1:8176/v2/api/indigo.devices?api-key=YOUR-API-KEY
```

This will return a JSON list of [Device Objects](messages.md#device-objects).

#### get single device { .ca }

**REST**
```bash
http://username:password@127.0.0.1:8176/devices/office-lamp.json
```

**HTTP**
```bash
http://127.0.0.1:8176/v2/api/indigo.devices/123456789?api-key=YOUR-API-KEY
```

Insert the ID of the `office-lamp` device rather than the name. Note you can quickly copy the device ID to the clipboard by right-clicking on the device in Indigo app's main window and choosing the `Copy ID` context menu.  This will return a single [Device Object](messages.md#device-objects).

### Device Commands { .ref-head-no-code }

Sending commands to devices requires that you POST a JSON message to the `/v2/api/command` URL.

#### set brightness { .ca }

**REST**
```bash
curl -X PUT -u user:password --digest -d brightness=27 http://127.0.0.1:8176/devices/office-lamp
```

**HTTP**
```bash
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message":"indigo.device.setBrightness","objectId":123456789,"parameters":{"value":27}}' http://127.0.0.1:8176/v2/api/command
```

Insert the ID of the `office-lamp` device as the objectId.

#### turn on/turn off { .ca }

**REST**
```bash
curl -X PUT -u user:password --digest -d isOn=1 http://127.0.0.1:8176/devices/office-lamp
curl -X PUT -u user:password --digest -d isOn=0 http://127.0.0.1:8176/devices/office-lamp
```

**HTTP**
```bash
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message":"indigo.device.turnOn","objectId":123456789}' http://127.0.0.1:8176/v2/api/command
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message":"indigo.device.turnOff","objectId":123456789}' http://127.0.0.1:8176/v2/api/command
```

Insert the ID of the `office-lamp` device as the objectId.

#### toggle { .ca }

**REST**
```bash
curl -X PUT -u user:password --digest -d toggle=1 http://127.0.0.1:8176/devices/office-lamp
```

**HTTP**
```bash
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message":"indigo.device.toggle","objectId":123456789}' http://127.0.0.1:8176/v2/api/command
```

Insert the ID of the `office-lamp` device as the objectId.

#### change speed index (fan) { .ca }

These examples will set device `office-ceiling-fan` to 0 (off), then set to 3 (high), then decrease back to 0 (off).

**REST**
```bash
curl -X PUT -u user:password --digest -d speedIndex=0 http://127.0.0.1:8176/devices/office-ceiling-fan
curl -X PUT -u user:password --digest -d speedIndex=3 http://127.0.0.1:8176/devices/office-ceiling-fan
curl -X PUT -u user:password --digest -d speedIndex=dn http://127.0.0.1:8176/devices/office-ceiling-fan
curl -X PUT -u user:password --digest -d speedIndex=dn http://127.0.0.1:8176/devices/office-ceiling-fan
curl -X PUT -u user:password --digest -d speedIndex=dn http://127.0.0.1:8176/devices/office-ceiling-fan
```

**HTTP**
```bash
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message":"indigo.speedcontrol.setSpeedIndex","objectId":123456789,"parameters":{"value":0}}' http://127.0.0.1:8176/v2/api/command
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message":"indigo.speedcontrol.setSpeedIndex","objectId":123456789,"parameters":{"value":3}}' http://127.0.0.1:8176/v2/api/command
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message":"indigo.speedcontrol.decreaseSpeedIndex","objectId":123456789}' http://127.0.0.1:8176/v2/api/command
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message":"indigo.speedcontrol.decreaseSpeedIndex","objectId":123456789}' http://127.0.0.1:8176/v2/api/command
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message":"indigo.speedcontrol.decreaseSpeedIndex","objectId":123456789}' http://127.0.0.1:8176/v2/api/command
```

Insert the ID of the `office-ceiling-fan` device as the objectId.

#### change sprinkler zones { .ca }

These examples will change device `irrmaster-pro` active sprinkler zone to 3 and all off.

**REST**
```bash
curl -X PUT -u user:password --digest -d activeZone=3 http://127.0.0.1:8176/devices/irrmaster-pro
curl -X PUT -u user:password --digest -d activeZone=0 http://127.0.0.1:8176/devices/irrmaster-pro
```

**HTTP**
```bash
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message":"indigo.sprinkler.setActiveZone","objectId":123456789,"parameters":{"index":3}}' http://127.0.0.1:8176/v2/api/command
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message":"indigo.sprinkler.setActiveZone","objectId":123456789,"parameters":{"index":0}}' http://127.0.0.1:8176/v2/api/command
```

Insert the ID of the `irrmaster-pro` device as the objectId.

#### set thermostat setpoints { .ca }

These examples will set device `thermostat`'s heat and cool setpoints

**REST**
```bash
curl -X PUT -u user:password --digest -d setpointCool=76 http://127.0.0.1:8176/devices/thermostat
curl -X PUT -u user:password --digest -d setpointHeat=70 http://127.0.0.1:8176/devices/thermostat
```

<span class="ca">**Increase Heat Setpoint**</span>

```bash
curl -X PUT -u user:password --digest -d setpointHeat=up http://127.0.0.1:8176/devices/thermostat
```

**HTTP**
```bash
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message":"indigo.thermostat.setCoolSetpoint","objectId":123456789,"parameters":{"value":76}}' http://127.0.0.1:8176/v2/api/command
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message":"indigo.thermostat.setHeatSetpoint","objectId":123456789,"parameters":{"value":70}}' http://127.0.0.1:8176/v2/api/command
```

<span class="ca">**Increase Heat Setpoint**</span>

```bash
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message":"indigo.thermostat.increaseHeatSetpoint","objectId":123456789}' http://127.0.0.1:8176/v2/api/command
```

Insert the ID of the `thermostat` device as the objectId.

#### set thermostat mode { .ca }

These examples will set device `thermostat`'s mode to "cool on" and "auto on"

**REST**
```bash
curl -X PUT -u user:password --digest -d hvacCurrentMode="cool on" http://127.0.0.1:8176/devices/thermostat
curl -X PUT -u user:password --digest -d hvacCurrentMode="auto on" http://127.0.0.1:8176/devices/thermostat
```

**HTTP**
```bash
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message":"indigo.thermostat.setHvacMode","objectId":123456789,"parameters":{"value":"indigo.kHvacMode.Cool"}}' http://127.0.0.1:8176/v2/api/command
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message":"indigo.thermostat.setHvacMode","objectId":123456789,"parameters":{"value":"indigo.kHvacMode.HeatCool"}}' http://127.0.0.1:8176/v2/api/command
```

Insert the ID of the `thermostat` device as the objectId.

#### set thermostat fan mode { .ca }

These examples will set device `thermostat`'s fan mode to "always on" and "auto on"

**REST**
```bash
curl -X PUT -u user:password --digest -d hvacFanMode="always on" http://127.0.0.1:8176/devices/thermostat
curl -X PUT -u user:password --digest -d hvacFanMode="auto on" http://127.0.0.1:8176/devices/thermostat
```

**HTTP**
```bash
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message":"indigo.thermostat.setFanMode","objectId":123456789,"parameters":{"value":"indigo.kFanMode.AlwaysOn"}}' http://127.0.0.1:8176/v2/api/command
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message":"indigo.thermostat.setFanMode","objectId":123456789,"parameters":{"value":"indigo.kFanMode.Auto"}}' http://127.0.0.1:8176/v2/api/command
```

Insert the ID of the `thermostat` device as the objectId.

## Variable Access { .ref-head-no-code }

### Getting Variables { .ref-head-no-code }

#### get variable list { .ca }

**REST**
```bash
http://username:password@127.0.0.1:8176/variables.json
```

**HTTP**
```bash
http://127.0.0.1:8176/v2/api/indigo.variables?api-key=YOUR-API-KEY
```

This will return a JSON list of [Variable Objects](messages.md#variable-objects).

#### get single variable { .ca }

**REST**
```bash
http://username:password@127.0.0.1:8176/variables/sprinklerDurationMultiplier.json
```

**HTTP**
```bash
http://127.0.0.1:8176/v2/api/indigo.variables/123456789?api-key=YOUR-API-KEY
```

Insert the ID of the `sprinklerDurationMultiplier` variable rather than the name. This will return a single [Variable Object](messages.md#variable-objects).

### Variable Commands { .ref-head-no-code }

Sending commands to the server requires that you POST a JSON message to the `/v2/api/command` URL.

#### update variable value { .ca }

**REST**
```bash
curl -X PUT -u user:password --digest -d value=1.23 http://127.0.0.1:8176/variables/sprinklerDurationMultiplier
```

**HTTP**
```bash
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message":"indigo.variable.updateValue","objectId":123456789,"parameters":{"value":"1.23"}}' http://127.0.0.1:8176/v2/api/command
```

Insert the ID of the `sprinklerDurationMultiplier` variable as the objectId. **Note**: variable values are always strings to make sure to enclose the value in quotes.

## Action Group Access { .ref-head-no-code }

### Getting Action Groups { .ref-head-no-code }

#### get action group list { .ca }

**REST**
```bash
http://username:password@127.0.0.1:8176/actions.json
```

**HTTP**
```bash
http://127.0.0.1:8176/v2/api/indigo.actionGroups?api-key=YOUR-API-KEY
```

This will return a JSON list of [Action Group Objects](messages.md#action-group-objects).

#### get single action group { .ca }

**REST**
```bash
http://username:password@127.0.0.1:8176/actions/party%20scene.json
```

**HTTP**
```bash
http://127.0.0.1:8176/v2/api/indigo.actionGroups/123456789?api-key=YOUR-API-KEY
```

Insert the ID of the `party scene` action group rather than the name. This will return a single [Action Group Object](messages.md#action-group-objects).

### Action Group Commands { .ref-head-no-code }

Sending commands to the server requires that you POST a JSON message to the `/v2/api/command` URL.

#### execute action group { .ca }

**REST**
```bash
curl -X EXECUTE -u user:password --digest -d value=1.23 http://127.0.0.1:8176/actions/party%20scene
```

**HTTP**
```bash
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message":"indigo.actionGroup.execute","objectId":123456789}' http://127.0.0.1:8176/v2/api/command
```

Insert the ID of the `party scene` action group as the objectId.
