# Constants Reference

## State Image Icons

Used with `dev.updateStateImageOnServer()`:

```python
dev.updateStateImageOnServer(indigo.kStateImageSel.SensorOn)
```

| Constant | Use Case |
|----------|----------|
| `indigo.kStateImageSel.Auto` | Automatic selection |
| `indigo.kStateImageSel.NoImage` | No icon |
| `indigo.kStateImageSel.Error` | Error state |
| `indigo.kStateImageSel.Custom` | Custom icon |

### Dimmer/Relay Icons

| Constant |
|----------|
| `indigo.kStateImageSel.DimmerOff` |
| `indigo.kStateImageSel.DimmerOn` |
| `indigo.kStateImageSel.PowerOff` |
| `indigo.kStateImageSel.PowerOn` |

### Sensor Icons

| Constant |
|----------|
| `indigo.kStateImageSel.SensorOff` |
| `indigo.kStateImageSel.SensorOn` |
| `indigo.kStateImageSel.SensorTripped` |
| `indigo.kStateImageSel.MotionSensor` |
| `indigo.kStateImageSel.MotionSensorTripped` |
| `indigo.kStateImageSel.DoorSensorClosed` |
| `indigo.kStateImageSel.DoorSensorOpened` |
| `indigo.kStateImageSel.WindowSensorClosed` |
| `indigo.kStateImageSel.WindowSensorOpened` |
| `indigo.kStateImageSel.LightSensor` |
| `indigo.kStateImageSel.LightSensorOn` |
| `indigo.kStateImageSel.TemperatureSensor` |
| `indigo.kStateImageSel.TemperatureSensorOn` |
| `indigo.kStateImageSel.HumiditySensor` |
| `indigo.kStateImageSel.HumiditySensorOn` |
| `indigo.kStateImageSel.WindSpeedSensor` |
| `indigo.kStateImageSel.WindDirectionSensor` |

### HVAC Icons

| Constant |
|----------|
| `indigo.kStateImageSel.HvacOff` |
| `indigo.kStateImageSel.HvacHeatMode` |
| `indigo.kStateImageSel.HvacCoolMode` |
| `indigo.kStateImageSel.HvacAutoMode` |
| `indigo.kStateImageSel.HvacFanMode` |
| `indigo.kStateImageSel.HvacHeating` |
| `indigo.kStateImageSel.HvacCooling` |

### Fan Icons

| Constant |
|----------|
| `indigo.kStateImageSel.FanOff` |
| `indigo.kStateImageSel.FanLow` |
| `indigo.kStateImageSel.FanMedium` |
| `indigo.kStateImageSel.FanHigh` |

### Media Icons

| Constant |
|----------|
| `indigo.kStateImageSel.AvPaused` |
| `indigo.kStateImageSel.AvPlaying` |
| `indigo.kStateImageSel.AvStopped` |

### Lock Icons

| Constant |
|----------|
| `indigo.kStateImageSel.Locked` |
| `indigo.kStateImageSel.Unlocked` |

### Sprinkler Icons

| Constant |
|----------|
| `indigo.kStateImageSel.SprinklerOff` |
| `indigo.kStateImageSel.SprinklerOn` |

### Timer Icons

| Constant |
|----------|
| `indigo.kStateImageSel.TimerOff` |
| `indigo.kStateImageSel.TimerOn` |

### Energy Icons

| Constant |
|----------|
| `indigo.kStateImageSel.EnergyMeterOff` |
| `indigo.kStateImageSel.EnergyMeterOn` |

### Battery Icons

| Constant |
|----------|
| `indigo.kStateImageSel.BatteryCharger` |
| `indigo.kStateImageSel.BatteryChargerOn` |
| `indigo.kStateImageSel.BatteryLevelLow` |
| `indigo.kStateImageSel.BatteryLevel25` |
| `indigo.kStateImageSel.BatteryLevel50` |
| `indigo.kStateImageSel.BatteryLevel75` |
| `indigo.kStateImageSel.BatteryLevelHigh` |

## Device Action Constants

### Relay/Dimmer Actions (`indigo.kDeviceAction`)

```python
indigo.kDeviceAction.TurnOn
indigo.kDeviceAction.TurnOff
indigo.kDeviceAction.Toggle
indigo.kDeviceAction.SetBrightness    # action.actionValue = 0-100
indigo.kDeviceAction.BrightenBy       # action.actionValue = relative amount
indigo.kDeviceAction.DimBy            # action.actionValue = relative amount
indigo.kDeviceAction.SetColorLevels   # action.actionValue = dict with RGB/white keys
indigo.kDeviceAction.Lock             # Lock sub-type devices
indigo.kDeviceAction.Unlock           # Lock sub-type devices
indigo.kDeviceAction.AllLightsOff
indigo.kDeviceAction.AllLightsOn
indigo.kDeviceAction.AllOff
indigo.kDeviceAction.RequestStatus
```

### Thermostat Actions (`indigo.kThermostatAction`)

```python
# Setpoint control
indigo.kThermostatAction.SetHeatSetpoint       # action.actionValue = temperature
indigo.kThermostatAction.SetCoolSetpoint       # action.actionValue = temperature
indigo.kThermostatAction.IncreaseHeatSetpoint  # action.actionValue = delta
indigo.kThermostatAction.DecreaseHeatSetpoint  # action.actionValue = delta
indigo.kThermostatAction.IncreaseCoolSetpoint  # action.actionValue = delta
indigo.kThermostatAction.DecreaseCoolSetpoint  # action.actionValue = delta

# Mode control
indigo.kThermostatAction.SetHvacMode           # action.actionMode = kHvacMode value
indigo.kThermostatAction.SetFanMode            # action.actionMode = kFanMode value

# Status requests
indigo.kThermostatAction.RequestStatusAll
indigo.kThermostatAction.RequestMode
indigo.kThermostatAction.RequestEquipmentState
indigo.kThermostatAction.RequestTemperatures
indigo.kThermostatAction.RequestHumidities
indigo.kThermostatAction.RequestDeadbands
indigo.kThermostatAction.RequestSetpoints
```

### Sensor Actions (`indigo.kSensorAction`)

```python
indigo.kSensorAction.TurnOn
indigo.kSensorAction.TurnOff
indigo.kSensorAction.Toggle
indigo.kSensorAction.RequestStatus
```

### Sprinkler Actions (`indigo.kSprinklerAction`)

```python
indigo.kSprinklerAction.ZoneOn               # action.zoneIndex = 1-based zone
indigo.kSprinklerAction.AllZonesOff
indigo.kSprinklerAction.RunNewSchedule       # action.zoneDurations = list
indigo.kSprinklerAction.RunPreviousSchedule
indigo.kSprinklerAction.PauseSchedule
indigo.kSprinklerAction.ResumeSchedule
indigo.kSprinklerAction.StopSchedule
indigo.kSprinklerAction.PreviousZone
indigo.kSprinklerAction.NextZone
```

### Speed Control Actions (`indigo.kSpeedControlAction`)

```python
indigo.kSpeedControlAction.TurnOn
indigo.kSpeedControlAction.TurnOff
indigo.kSpeedControlAction.Toggle
indigo.kSpeedControlAction.SetSpeedLevel       # action.actionValue = 0-100
indigo.kSpeedControlAction.SetSpeedIndex       # action.actionValue = 0-N index
indigo.kSpeedControlAction.IncreaseSpeedIndex  # action.actionValue = delta
indigo.kSpeedControlAction.DecreaseSpeedIndex  # action.actionValue = delta
indigo.kSpeedControlAction.RequestStatus
```

### Universal Actions (`indigo.kUniversalAction`)

Handled by `actionControlUniversal()` for all device types:

```python
indigo.kUniversalAction.Beep
indigo.kUniversalAction.EnergyUpdate
indigo.kUniversalAction.EnergyReset
indigo.kUniversalAction.RequestStatus
```

### I/O Device Actions (`indigo.kIOAction`)

```python
indigo.kIOAction.TurnOn
indigo.kIOAction.TurnOff
indigo.kIOAction.Toggle
indigo.kIOAction.SetBinaryOutput    # action.index, action.actionValue
indigo.kIOAction.RequestStatus
indigo.kIOAction.AllOff
indigo.kIOAction.EnergyUpdate
indigo.kIOAction.EnergyReset
```

### Variable Actions (`indigo.kVariableAction`)

```python
indigo.kVariableAction.SetValue
indigo.kVariableAction.IncrementValue
indigo.kVariableAction.DecrementValue
```

## Device Sub-Types

Sub-types affect how devices appear in Indigo's UI (icons and categorization). Set in `Devices.xml` or via `pluginProps`.

### Setting Sub-Types in Devices.xml

```xml
<Device type="sensor" subType="kSensorDeviceSubType.Temperature" id="myTempSensor">
    <Name>Temperature Sensor</Name>
</Device>

<!-- With custom UI display name -->
<Device type="sensor" subType="kSensorDeviceSubType.DoorWindow,ui=Magnetic Reed Sensor" id="myDoorSensor">
    <Name>Door Sensor</Name>
</Device>
```

### General Device Sub-Types (`kDeviceSubType`)

For `type="custom"` devices:

| Value | Description |
|-------|-------------|
| `Amplifier` | Audio amplifier |
| `Automobile` | Vehicle |
| `Camera` | Security/IP camera |
| `Keypad` | Keypad controller |
| `Mobile` | Mobile device |
| `Remote` | Remote control |
| `Robot` | Robot/automation |
| `Security` | Security device |
| `Speaker` | Speaker/audio output |
| `Streaming` | Streaming device |
| `Television` | TV/display |
| `Weather` | Weather station |
| `Other` | Other device type |

### Dimmer Sub-Types (`kDimmerDeviceSubType`)

| Value | Description |
|-------|-------------|
| `Blind` | Window blind/shade |
| `Bulb` | Light bulb |
| `ColorBulb` | Color light bulb |
| `ColorDimmer` | Color-capable dimmer |
| `Dimmer` | Standard dimmer |
| `Fan` | Dimmable fan |
| `InLine` | In-line dimmer module |
| `Outlet` | Dimmable outlet |
| `Plugin` | Plugin-defined dimmer |
| `Value` | Value-based dimmer |

### Relay Sub-Types (`kRelayDeviceSubType`)

| Value | Description |
|-------|-------------|
| `DoorBell` | Doorbell |
| `DoorController` | Door controller |
| `GarageController` | Garage door controller |
| `InLine` | In-line relay module |
| `Lock` | Lock device |
| `Outlet` | Switched outlet |
| `Plugin` | Plugin-defined relay |
| `Siren` | Siren/alarm |
| `Switch` | Wall switch |

### Sensor Sub-Types (`kSensorDeviceSubType`)

| Value | Description |
|-------|-------------|
| `Analog` | Analog sensor |
| `Binary` | Binary/digital sensor |
| `CO` | Carbon monoxide |
| `DoorWindow` | Door/window sensor |
| `GasLeak` | Gas leak detector |
| `GlassBreak` | Glass break sensor |
| `Humidity` | Humidity sensor |
| `Illuminance` | Light level sensor |
| `Motion` | Motion sensor |
| `Presence` | Presence/occupancy |
| `Pressure` | Pressure sensor |
| `Smoke` | Smoke detector |
| `Tamper` | Tamper sensor |
| `Temperature` | Temperature sensor |
| `UV` | UV index sensor |
| `Vibration` | Vibration sensor |
| `Voltage` | Voltage sensor |
| `WaterLeak` | Water leak sensor |
| `Zone` | Security zone |

### Setting Sub-Types via pluginProps

Some sub-type behaviors are set programmatically in `deviceStartComm()`:

```python
def deviceStartComm(self, dev):
    props = dev.pluginProps

    # Enable lock UI for relay devices
    props["IsLockSubType"] = True

    # Enable color controls for dimmer devices
    props["SupportsColor"] = True
    props["SupportsRGB"] = True
    props["SupportsWhite"] = True
    props["SupportsTwoWhiteLevels"] = False
    props["SupportsWhiteTemperature"] = True
    props["WhiteTemperatureMin"] = 2000   # Kelvin
    props["WhiteTemperatureMax"] = 6500

    dev.replacePluginPropsOnServer(props)
```

## Protocol Constants

```python
indigo.kProtocol.Plugin     # Plugin-defined device
indigo.kProtocol.Insteon    # INSTEON protocol
indigo.kProtocol.X10        # X10 protocol
indigo.kProtocol.ZWave      # Z-Wave protocol
```

## HVAC Mode Constants

```python
indigo.kHvacMode.Off
indigo.kHvacMode.Heat
indigo.kHvacMode.Cool
indigo.kHvacMode.HeatCool       # Auto mode
indigo.kHvacMode.ProgramHeat
indigo.kHvacMode.ProgramCool
indigo.kHvacMode.ProgramHeatCool
```

## Fan Mode Constants

```python
indigo.kFanMode.Auto
indigo.kFanMode.AlwaysOn
```

## State Value Types

Used in `Devices.xml` state definitions:

| Type | Description |
|------|-------------|
| `Integer` | Whole numbers |
| `Number` | Floating point |
| `String` | Text values |
| `Boolean` | True/False (sub-types: `TrueFalse`, `OnOff`, `YesNo`, `OneZero`) |
| `Separator` | UI separator (no value) |

Boolean sub-types control display labels:

```xml
<State id="isOnline">
    <ValueType boolType="TrueFalse">Boolean</ValueType>
    <TriggerLabel>Online Status</TriggerLabel>
</State>
```

## UI Value Types (ConfigUI)

| Type | Description |
|------|-------------|
| `textfield` | Single-line text input |
| `textarea` | Multi-line text input |
| `checkbox` | Boolean checkbox |
| `menu` | Dropdown menu |
| `list` | Multi-select list |
| `button` | Action button |
| `label` | Static text |
| `separator` | Visual separator |
| `serialport` | Serial port selector (auto-expanding) |
| `colorPicker` | Color picker (returns RGB string) |

See [ConfigUI Reference](../../concepts/configui.md) for full field attribute documentation.

## License Status Constants

```python
indigo.kLicenseStatus.ActiveTrial
indigo.kLicenseStatus.ActiveSubscription
indigo.kLicenseStatus.ExpiredSubscription
indigo.kLicenseStatus.Unknown
```
