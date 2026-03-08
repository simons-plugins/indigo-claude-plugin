# Actions & Action Handling

**Official Documentation**: https://wiki.indigodomo.com/doku.php?id=indigo_2025.1_documentation:plugin_guide#actions

## Actions.xml

Define custom plugin actions in `Actions.xml`. Users configure and trigger these from Indigo's action groups, triggers, and schedules.

### Basic Structure

```xml
<?xml version="1.0"?>
<Actions>
    <!-- Optional: global help URL for all actions -->
    <SupportURL>https://my-plugin-docs.example.com/actions</SupportURL>

    <Action id="resetHardware" deviceFilter="self">
        <Name>Reset Hardware</Name>
        <CallbackMethod>reset_hardware</CallbackMethod>
    </Action>
</Actions>
```

### Action with ConfigUI

```xml
<Action id="setBacklightBrightness" deviceFilter="self">
    <Name>Set Backlight Brightness</Name>
    <CallbackMethod>set_backlight_brightness</CallbackMethod>
    <ConfigUI>
        <Field id="brightness" type="textfield" defaultValue="100">
            <Label>Brightness (0-100):</Label>
        </Field>
    </ConfigUI>
</Action>
```

### Action Targeting All Devices

```xml
<Action id="getDeviceInfo" deviceFilter="indigo.devices">
    <Name>Get Device Info</Name>
    <CallbackMethod>get_device_info</CallbackMethod>
    <ConfigUI>
        <Field id="format" type="menu" defaultValue="json">
            <Label>Output Format:</Label>
            <List>
                <Option value="json">JSON</Option>
                <Option value="yaml">YAML</Option>
            </List>
        </Field>
    </ConfigUI>
</Action>
```

### Action Attributes

| Attribute | Description |
|-----------|-------------|
| `id` | Unique action identifier (required) |
| `deviceFilter` | Which devices appear in the device picker |

**deviceFilter values**:
- `"self"` — only this plugin's devices
- `"indigo.devices"` — all Indigo devices
- Omit for actions not tied to a device

### Custom Plugin Action Callback

```python
def set_backlight_brightness(self, plugin_action, dev):
    """Handle custom plugin action."""
    try:
        brightness = int(plugin_action.props.get("brightness", 100))
    except ValueError:
        self.logger.error(f"Invalid brightness value for \"{dev.name}\"")
        return

    # Command hardware here
    send_success = True

    if send_success:
        self.logger.info(f"sent \"{dev.name}\" set backlight to {brightness}")
        dev.updateStateOnServer("backlightBrightness", brightness)
    else:
        self.logger.error(f"send \"{dev.name}\" set backlight to {brightness} failed")
```

Note: The parameter is `plugin_action` (a `PluginAction` object), not `action`. Access user-configured values via `plugin_action.props`.

### Returning Results to Scripting Callers

Actions called via `indigo.server.getPlugin(pluginId).executeAction()` can return values:

```python
def get_device_info(self, action, dev=None, caller_waiting_for_result=None):
    props = dict(action.props)
    reply = indigo.Dict()
    reply["name"] = dev.name
    reply["status"] = "online"
    return reply  # Returned to the calling script
```

Return types: `None`, `bool`, `int`, `float`, `str`, `indigo.Dict`, `indigo.List`.

## Standard Action Handling Callbacks

When a plugin defines device types (relay, dimmer, thermostat, etc.), it **must** implement the corresponding `actionControl*()` callback to handle standard Indigo actions.

### Callback Summary

| Device Type | Callback | Action Property | Enum |
|-------------|----------|-----------------|------|
| relay | `actionControlDevice(self, action, dev)` | `action.deviceAction` | `indigo.kDeviceAction` |
| dimmer | `actionControlDevice(self, action, dev)` | `action.deviceAction` | `indigo.kDeviceAction` |
| sensor | `actionControlSensor(self, action, dev)` | `action.sensorAction` | `indigo.kSensorAction` |
| thermostat | `actionControlThermostat(self, action, dev)` | `action.thermostatAction` | `indigo.kThermostatAction` |
| sprinkler | `actionControlSprinkler(self, action, dev)` | `action.sprinklerAction` | `indigo.kSprinklerAction` |
| speedcontrol | `actionControlSpeedControl(self, action, dev)` | `action.speedControlAction` | `indigo.kSpeedControlAction` |
| all types | `actionControlUniversal(self, action, dev)` | `action.deviceAction` | `indigo.kUniversalAction` |

### Relay / Dimmer Actions

```python
def actionControlDevice(self, action, dev):
    if action.deviceAction == indigo.kDeviceAction.TurnOn:
        # Command hardware to turn on
        send_success = True
        if send_success:
            self.logger.info(f"sent \"{dev.name}\" on")
            dev.updateStateOnServer("onOffState", True)
        else:
            self.logger.error(f"send \"{dev.name}\" on failed")

    elif action.deviceAction == indigo.kDeviceAction.TurnOff:
        send_success = True
        if send_success:
            self.logger.info(f"sent \"{dev.name}\" off")
            dev.updateStateOnServer("onOffState", False)

    elif action.deviceAction == indigo.kDeviceAction.Toggle:
        new_on_state = not dev.onState
        send_success = True
        if send_success:
            self.logger.info(f"sent \"{dev.name}\" toggle")
            dev.updateStateOnServer("onOffState", new_on_state)

    elif action.deviceAction == indigo.kDeviceAction.SetBrightness:
        new_brightness = action.actionValue  # 0-100
        send_success = True
        if send_success:
            self.logger.info(f"sent \"{dev.name}\" set brightness to {new_brightness}")
            dev.updateStateOnServer("brightnessLevel", new_brightness)

    elif action.deviceAction == indigo.kDeviceAction.BrightenBy:
        new_brightness = min(dev.brightness + action.actionValue, 100)
        send_success = True
        if send_success:
            dev.updateStateOnServer("brightnessLevel", new_brightness)

    elif action.deviceAction == indigo.kDeviceAction.DimBy:
        new_brightness = max(dev.brightness - action.actionValue, 0)
        send_success = True
        if send_success:
            dev.updateStateOnServer("brightnessLevel", new_brightness)

    elif action.deviceAction == indigo.kDeviceAction.SetColorLevels:
        # action.actionValue is a dict with keys:
        # redLevel, greenLevel, blueLevel, whiteLevel, whiteLevel2, whiteTemperature
        color_dict = action.actionValue
        # Command hardware with color values

    elif action.deviceAction == indigo.kDeviceAction.Lock:
        # For lock sub-type devices
        send_success = True
        if send_success:
            dev.updateStateOnServer("onOffState", True)

    elif action.deviceAction == indigo.kDeviceAction.Unlock:
        send_success = True
        if send_success:
            dev.updateStateOnServer("onOffState", False)
```

### Thermostat Actions

```python
def actionControlThermostat(self, action, dev):
    if action.thermostatAction == indigo.kThermostatAction.SetHvacMode:
        hvac_mode = action.actionMode
        # Command hardware, then update state:
        dev.updateStateOnServer("hvacOperationMode", hvac_mode)

    elif action.thermostatAction == indigo.kThermostatAction.SetFanMode:
        fan_mode = action.actionMode
        dev.updateStateOnServer("hvacFanMode", fan_mode)

    elif action.thermostatAction == indigo.kThermostatAction.SetHeatSetpoint:
        new_setpoint = action.actionValue
        dev.updateStateOnServer("setpointHeat", new_setpoint,
                                uiValue=f"{new_setpoint:.1f} °F")

    elif action.thermostatAction == indigo.kThermostatAction.SetCoolSetpoint:
        new_setpoint = action.actionValue
        dev.updateStateOnServer("setpointCool", new_setpoint,
                                uiValue=f"{new_setpoint:.1f} °F")

    elif action.thermostatAction == indigo.kThermostatAction.IncreaseHeatSetpoint:
        new_setpoint = dev.heatSetpoint + action.actionValue
        dev.updateStateOnServer("setpointHeat", new_setpoint,
                                uiValue=f"{new_setpoint:.1f} °F")

    elif action.thermostatAction == indigo.kThermostatAction.DecreaseHeatSetpoint:
        new_setpoint = dev.heatSetpoint - action.actionValue
        dev.updateStateOnServer("setpointHeat", new_setpoint,
                                uiValue=f"{new_setpoint:.1f} °F")

    elif action.thermostatAction == indigo.kThermostatAction.IncreaseCoolSetpoint:
        new_setpoint = dev.coolSetpoint + action.actionValue
        dev.updateStateOnServer("setpointCool", new_setpoint,
                                uiValue=f"{new_setpoint:.1f} °F")

    elif action.thermostatAction == indigo.kThermostatAction.DecreaseCoolSetpoint:
        new_setpoint = dev.coolSetpoint - action.actionValue
        dev.updateStateOnServer("setpointCool", new_setpoint,
                                uiValue=f"{new_setpoint:.1f} °F")

    elif action.thermostatAction in (
        indigo.kThermostatAction.RequestStatusAll,
        indigo.kThermostatAction.RequestMode,
        indigo.kThermostatAction.RequestEquipmentState,
        indigo.kThermostatAction.RequestTemperatures,
        indigo.kThermostatAction.RequestHumidities,
        indigo.kThermostatAction.RequestDeadbands,
        indigo.kThermostatAction.RequestSetpoints,
    ):
        # Query hardware for current status
        self.logger.info(f"sent \"{dev.name}\" status request")
```

### Sensor Actions

Sensors are typically read-only — reject write actions:

```python
def actionControlSensor(self, action, dev):
    self.logger.info(f"ignored \"{dev.name}\" {action.sensorAction} request (sensor is read-only)")
```

### Sprinkler Actions

```python
def actionControlSprinkler(self, action, dev):
    if action.sprinklerAction == indigo.kSprinklerAction.ZoneOn:
        zone = action.zoneIndex  # 1-based zone index
        # Turn on zone

    elif action.sprinklerAction == indigo.kSprinklerAction.AllZonesOff:
        # Turn off all zones

    elif action.sprinklerAction == indigo.kSprinklerAction.RunNewSchedule:
        durations = action.zoneDurations  # List of durations per zone
        # Start schedule run

    elif action.sprinklerAction == indigo.kSprinklerAction.RunPreviousSchedule:
        # Re-run previous schedule

    elif action.sprinklerAction == indigo.kSprinklerAction.PauseSchedule:
        # Pause current schedule

    elif action.sprinklerAction == indigo.kSprinklerAction.ResumeSchedule:
        # Resume paused schedule

    elif action.sprinklerAction == indigo.kSprinklerAction.StopSchedule:
        # Stop schedule

    elif action.sprinklerAction == indigo.kSprinklerAction.PreviousZone:
        # Move to previous zone

    elif action.sprinklerAction == indigo.kSprinklerAction.NextZone:
        # Move to next zone
```

### Speed Control Actions

```python
def actionControlSpeedControl(self, action, dev):
    if action.speedControlAction == indigo.kSpeedControlAction.TurnOn:
        dev.updateStateOnServer("onOffState", True)

    elif action.speedControlAction == indigo.kSpeedControlAction.TurnOff:
        dev.updateStateOnServer("onOffState", False)

    elif action.speedControlAction == indigo.kSpeedControlAction.Toggle:
        dev.updateStateOnServer("onOffState", not dev.onState)

    elif action.speedControlAction == indigo.kSpeedControlAction.SetSpeedIndex:
        # 0=off, 1=low, 2=medium, 3=high
        index = action.actionValue
        dev.updateStateOnServer("speedIndex", index)

    elif action.speedControlAction == indigo.kSpeedControlAction.SetSpeedLevel:
        # 0-100 absolute level
        level = action.actionValue
        dev.updateStateOnServer("speedLevel", level)

    elif action.speedControlAction == indigo.kSpeedControlAction.IncreaseSpeedIndex:
        new_index = min(dev.speedIndex + action.actionValue, dev.speedIndexCount - 1)
        dev.updateStateOnServer("speedIndex", new_index)

    elif action.speedControlAction == indigo.kSpeedControlAction.DecreaseSpeedIndex:
        new_index = max(dev.speedIndex - action.actionValue, 0)
        dev.updateStateOnServer("speedIndex", new_index)
```

### Universal Actions (all device types)

```python
def actionControlUniversal(self, action, dev):
    if action.deviceAction == indigo.kUniversalAction.Beep:
        self.logger.info(f"sent \"{dev.name}\" beep request")

    elif action.deviceAction == indigo.kUniversalAction.EnergyUpdate:
        self.logger.info(f"sent \"{dev.name}\" energy update request")

    elif action.deviceAction == indigo.kUniversalAction.EnergyReset:
        self.logger.info(f"sent \"{dev.name}\" energy reset request")

    elif action.deviceAction == indigo.kUniversalAction.RequestStatus:
        self.logger.info(f"sent \"{dev.name}\" status request")
```

## Action Validation

```python
def validateActionConfigUi(self, values_dict, type_id, device_id):
    errors = indigo.Dict()

    brightness = values_dict.get("brightness", "")
    try:
        val = int(brightness)
        if val < 0 or val > 100:
            errors["brightness"] = "Brightness must be between 0 and 100"
    except ValueError:
        errors["brightness"] = "Must be a number"

    if len(errors) > 0:
        return (False, values_dict, errors)
    return (True, values_dict)
```

## See Also

- [ConfigUI Reference](configui.md) — Field types, attributes, dynamic lists
- [Constants Reference](../api/iom/constants.md) — Action enum values
- [Device Development](devices.md) — Device types and state management
- [SDK Examples Guide](../examples/sdk-examples-guide.md) — Working action implementations
