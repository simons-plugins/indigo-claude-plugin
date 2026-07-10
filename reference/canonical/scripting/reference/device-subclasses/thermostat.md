<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/reference/device-subclasses/thermostat/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# ThermostatDevice { .ref-head-no-code }

Thermostats have a wide variety of capabilities that we’ve tried to boil down to some specifics. They can have multiple temperature and humidity sensors and--depending on the device capabilities and region--may have a fan mode, an HVAC mode (heating, cooling, etc.) and associated setpoints. **Note:** some thermostats don’t support getting the equipment state values: `coolIsOn`, `fanIsOn`, `heatIsOn`, `dehumidifierIsOn`, and `humidifierIsOn`. For those thermostats those properties will always be False.

## Class Properties { .ref-head-no-code }

| Property                                            | Type                                | Writable | [Min API](https://www.indigodomo.com/indigo/api_version_chart.html) | Description                                                                                                                                                                                                                       |
|-----------------------------------------------------|-------------------------------------|----------|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`coolIsOn`</span>               | boolean                             | No       | 1.0                                   | is the cooling system (compressor) currently running - shortcut for `dev.states['hvacCoolerIsOn']`. This property is always present and will be `False` if the corresponding state `dev.states['hvacCoolerIsOn']` is not present. |
| <span class="nw cb">`coolSetpoint`</span>           | float                               | No       | 1.0                                   | current cool setpoint value - shortcut for `dev.states['setpointCool']`                                                                                                                                                           |
| <span class="nw cb">`dehumidifierIsOn`</span>       | boolean                             | No       | 1.7                                   | is the dehumidifier currently turned ON - shortcut for `dev.states['hvacDehumidifierIsOn']`                                                                                                                                       |
| <span class="nw cb">`fanMode`</span>                | [kFanMode](#fan-mode-enumeration)   | No       | 1.0                                   | the operating mode for the fan attached to the thermostat - shortcut for `dev.states['hvacFanMode']`                                                                                                                              |
| <span class="nw cb">`fanIsOn`</span>                | boolean                             | No       | 1.0                                   | is the fan currently running - shortcut for `dev.states['hvacFanIsOn']`                                                                                                                                                           |
| <span class="nw cb">`heatIsOn`</span>               | boolean                             | No       | 1.0                                   | is the heater currently running - shortcut for `dev.states['hvacHeaterIsOn']`.  This property is always present and will be `False` if the corresponding state `dev.states['hvacHeaterIsOn']` is not present.                     |
| <span class="nw cb">`heatSetpoint`</span>           | float                               | No       | 1.0                                   | current heat setpoint value - shortcut for `dev.states['setpointHeat']`                                                                                                                                                           |
| <span class="nw cb">`humidities`</span>             | list of float                       | No       | 1.0                                   | a list of floating point values representing the current values of all humidity sensors connected to the thermostat                                                                                                               |
| <span class="nw cb">`humiditySensorCount`</span>    | integer                             | No       | 1.0                                   | number of humidity sensors this thermostat supports                                                                                                                                                                               |
| <span class="nw cb">`humidifierIsOn`</span>         | boolean                             | No       | 1.7                                   | is the humidifier currently turned ON - shortcut for `dev.states['hvacHumidifierIsOn']`                                                                                                                                           |
| <span class="nw cb">`hvacMode`</span>               | [kHvacMode](#hvac-mode-enumeration) | No       | 1.0                                   | the operating mode for the HVAC system attached to the thermostat - shortcut for `dev.states['hvacOperationMode']`                                                                                                                |
| <span class="nw cb">`temperatureSensorCount`</span> | integer                             | No       | 1.0                                   | number of temperature sensors this thermostat supports                                                                                                                                                                            |
| <span class="nw cb">`temperatures`</span>           | list of float                       | No       | 1.0                                   | a list of floating point values representing the current values of all temperature sensors connected to the thermostat                                                                                                            |

To check whether the thermostat device actually supports the `coolIsOn` and `heatIsOn` properties, one can check: `support_heat_and_cool = dev.pluginProps.get("ShowCoolHeatEquipmentStateUI", False)`

### Plugin Capabilities { .ref-head-no-code }

These pluginProps can be updated by a plugin to describe the capabilities for a particular thermostat instance. Some of these are useful to provide a higher-level abstraction for accessing/changing thermostat properties or states.

| Property                                                  | Type    | Writeable | Description                  |
|-----------------------------------------------------------|---------|-----------|------------------------------|
| <span class="nw cb">`NumTemperatureInputs`</span>         | Integer | Yes       | should range between 1 and 3 |
| <span class="nw cb">`NumHumidityInputs`</span>            | Integer | Yes       | should range between 0 and 3 |
| <span class="nw cb">`SupportsHeatSetpoint`</span>         | Boolean | Yes       | True or False                |
| <span class="nw cb">`SupportsCoolSetpoint`</span>         | Boolean | Yes       | True or False                |
| <span class="nw cb">`SupportsHvacOperationMode`</span>    | Boolean | Yes       | True or False                |
| <span class="nw cb">`SupportsHvacFanMode`</span>          | Boolean | Yes       | True or False                |
| <span class="nw cb">`ShowCoolHeatEquipmentStateUI`</span> | Boolean | Yes       | True or False                |

Some of these are reflected as attributes in the device instance as well:

| Attribute                                                  | Read-Only |
|------------------------------------------------------------|-----------|
| <span class="nw cb">`dev.hvacMode`</span>                  | Yes       |
| <span class="nw cb">`dev.fanMode`</span>                   | Yes       |
| <span class="nw cb">`dev.coolSetpoint`</span>              | Yes       |
| <span class="nw cb">`dev.heatSetpoint`</span>              | Yes       |
| <span class="nw cb">`dev.temperatureSensorCount`</span>    | Yes       |
| <span class="nw cb">`dev.temperatures`</span>              | Yes       |
| <span class="nw cb">`dev.humiditySensorCount`</span>       | Yes       |
| <span class="nw cb">`dev.humidities`</span>                | Yes       |
| <span class="nw cb">`dev.coolIsOn`</span>                  | Yes       |
| <span class="nw cb">`dev.heatIsOn`</span>                  | Yes       |
| <span class="nw cb">`dev.fanIsOn`</span>                   | Yes       |
| <span class="nw cb">`dev.dehumidifierIsOn`</span>          | Yes       |
| <span class="nw cb">`dev.humidifierIsOn`</span>            | Yes       |
| <span class="nw cb">`dev.supportsHvacFanMode`</span>       | Yes       |
| <span class="nw cb">`dev.supportsHvacOperationMode`</span> | Yes       |
| <span class="nw cb">`dev.supportsCoolSetpoint`</span>      | Yes       |
| <span class="nw cb">`dev.supportsHeatSetpoint`</span>      | Yes       |

More information on how to use these Thermostat properties and attributes can be found in the `Example Device - Thermostat.indigoPlugin` in the [Indigo Plugin SDK](https://github.com/IndigoDomotics/IndigoSDK).

#### Fan Mode Enumeration { #fan-mode-enumeration .ref-head-no-code }

| <span class="nw cb">`indigo.kFanMode`</span> |                                                                                    |
|----------------------------------------------|------------------------------------------------------------------------------------|
| Value                                        | Description                                                                        |
| <span class="nw cb">`AlwaysOn`</span>        | signal the fan that it should be running continuously                              |
| <span class="nw cb">`Auto`</span>            | signal the fan that it should only run when the HVAC system needs it to be running |

#### HVAC Mode Enumeration { #hvac-mode-enumeration .ref-head-no-code }

| <span class="nw cb">`indigo.kHvacMode`</span> |                                                                                                                      |
|-----------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| Value                                         | Description                                                                                                          |
| <span class="nw cb">`Cool`</span>             | the hvac system is only reacting to cool setpoints                                                                   |
| <span class="nw cb">`HeatCool`</span>         | the hvac system is reacting to both cool and heat setpoints                                                          |
| <span class="nw cb">`Heat`</span>             | the hvac system is only reacting to and heat setpoints                                                               |
| <span class="nw cb">`Off`</span>              | the hvac system is turned off                                                                                        |
| <span class="nw cb">`ProgramHeatCool`</span>  | the hvac system is executing it’s built-in automatic program, which usually responds to both heat and cool setpoints |
| <span class="nw cb">`ProgramCool`</span>      | the hvac system is executing it’s built-in cooling program                                                           |
| <span class="nw cb">`ProgramHeat`</span>      | the hvac system is executing it’s built-in heating program                                                           |

## Device States { .ref-head-no-code }

These are the states provided by this device type and accessible through the `dev.states` dictionary. They are read-only, but if you're a plugin developer you can use the `updateStateOnServer()` class method to update most of these states for devices owned by your plugin (exceptions are noted below).

| State ID                                                    | Type                                | Property Name                                 | Notes                                                                                                                                                                                                      |
|-------------------------------------------------------------|-------------------------------------|-----------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`humidityInput#`</span>                 | float                               | N/A                                           | replace the # with the humidity sensor # (up to `humiditySensorCount`) to directly access the humidity value for that input                                                                                |
| <span class="nw cb">`humidityInputsAll`</span>              | string                              | N/A                                           | a comma separated list of all humidity values                                                                                                                                                              |
| <span class="nw cb">`hvacCoolerIsOn`</span>                 | boolean                             | <span class="nw cb">`coolIsOn`                | `True` if the cooling system currently running                                                                                                                                                             |
| <span class="nw cb">`hvacDehumidifierIsOn`</span>           | boolean                             | <span class="nw cb">`dehumidifierIsOn`</span> | `True` if the dehumidifier is currently running                                                                                                                                                            |
| <span class="nw cb">`hvacFanIsOn`</span>                    | boolean                             | <span class="nw cb">`fanIsOn`</span>          | `True` if the fan currently running                                                                                                                                                                        |
| <span class="nw cb">`hvacFanMode`</span>                    | [kFanMode](#fan-mode-enumeration)   | <span class="nw cb">`fanMode`</span>          | operating mode for the fan attached to the thermostat                                                                                                                                                      |
| <span class="nw cb">`hvacFanIsAlwaysOn`</span>              | boolean                             | N/A                                           | `True` if the fan mode is set to `AlwaysOn`. <span class="dw-color-red">Note</span>: this state can't be directly updated but rather will be updated automatically when you update `hvacFanMode`.          |
| <span class="nw cb">`hvacFanIsAuto`</span>                  | boolean                             | N/A                                           | `True` if the fan mode is set to `Auto`. <span class="dw-color-red">Note</span>: this state can't be directly updated but rather will be updated automatically when you update `hvacFanMode`.              |
| <span class="nw cb">`hvacHeaterIsOn`</span>                 | boolean                             | <span class="nw cb">`heatIsOn`</span>         | `True` if the heating system currently running                                                                                                                                                             |
| <span class="nw cb">`hvacHumidifierIsOn`</span>             | boolean                             | <span class="nw cb">`humidifierIsOn`</span>   | `True` if the humidifier is currently running                                                                                                                                                              |
| <span class="nw cb">`hvacOperationMode`</span>              | [kHvacMode](#hvac-mode-enumeration) | <span class="nw cb">`hvacMode`</span>         | operating mode for the HVAC system attached to the thermostat                                                                                                                                              |
| <span class="nw cb">`hvacOperationModeIsAuto`</span>        | boolean                             | N/A                                           | `True` if the HVAC is set to `HeatCool`. <span class="dw-color-red">Note</span>: this state can't be directly updated but rather will be updated automatically when you update `hvacOperationMode`.        |
| <span class="nw cb">`hvacOperationModeIsCool`</span>        | boolean                             | N/A                                           | `True` if the HVAC is set to `Cool`. <span class="dw-color-red">Note</span>: this state can't be directly updated but rather will be updated automatically when you update `hvacOperationMode`.            |
| <span class="nw cb">`hvacOperationModeIsHeat`</span>        | boolean                             | N/A                                           | `True` if the HVAC is set to `Heat`. <span class="dw-color-red">Note</span>: this state can't be directly updated but rather will be updated automatically when you update `hvacOperationMode`.            |
| <span class="nw cb">`hvacOperationModeIsOff`</span>         | boolean                             | N/A                                           | `True` if the HVAC is set to `Off`. <span class="dw-color-red">Note</span>: this state can't be directly updated but rather will be updated automatically when you update `hvacOperationMode`.             |
| <span class="nw cb">`hvacOperationModeIsProgramAuto`</span> | boolean                             | N/A                                           | `True` if the HVAC is set to `ProgramHeatCool`. <span class="dw-color-red">Note</span>: this state can't be directly updated but rather will be updated automatically when you update `hvacOperationMode`. |
| <span class="nw cb">`hvacOperationModeIsProgramCool`</span> | boolean                             | N/A                                           | `True` if the HVAC is set to `ProgramCool`. <span class="dw-color-red">Note</span>: this state can't be directly updated but rather will be updated automatically when you update `hvacOperationMode`.     |
| <span class="nw cb">`hvacOperationModeIsProgramHeat`</span> | boolean                             | N/A                                           | `True` if the HVAC is set to `ProgramHeat`. <span class="dw-color-red">Note</span>: this state can't be directly updated but rather will be updated automatically when you update `hvacOperationMode`.     |
| <span class="nw cb">`setpointCool`</span>                   | float                               | <span class="nw cb">`coolSetpoint`</span>     | the cool setpoint                                                                                                                                                                                          |
| <span class="nw cb">`setpointHeat`</span>                   | float                               | <span class="nw cb">`heatSetpoint`</span>     | the heat setpoint                                                                                                                                                                                          |
| <span class="nw cb">`temperatureInput#`</span>              | float                               | N/A                                           | replace the # with the temperature sensor # (up to `temperatureSensorCount`) to directly access the humidity value for that input                                                                          |
| <span class="nw cb">`temperatureInputsAll`</span>           | string                              | N/A                                           | a comma separated list of all temperature values                                                                                                                                                           |

## Commands (indigo.thermostat.*) { .ref-head-no-code }

### Decrease Cool Setpoint { .ref-head-no-code }

Decrease the cool setpoint by a delta value.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.thermostat.decreaseCoolSetpoint(123)`<br>
`indigo.thermostat.decreaseCoolSetpoint(123, delta=5)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                                                              |
|------------------------------------------|----------|---------|----------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer | id or instance of the device                                                                             |
| <span class="nw cb">`delta`</span>       | No       | float   | Number of degrees to decrease the cool setpoint. If unspecified, the change will be equal to one degree. |

### Decrease Heat Setpoint { .ref-head-no-code }

Decrease the heat setpoint by a delta value.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.thermostat.decreaseHeatSetpoint(123)`<br>
`indigo.thermostat.decreaseHeatSetpoint(123, delta=5)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                                                               |
|------------------------------------------|----------|---------|-----------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer | id or instance of the device                                                                              |
| <span class="nw cb">`delta`</span>       | No       | float   | Number of degrees to decrease the heat setpoint.  If unspecified, the change will be equal to one degree. |

### Increase Cool Setpoint { .ref-head-no-code }

Increase the cool setpoint by a delta value.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.thermostat.increaseCoolSetpoint(123)`<br>
`indigo.thermostat.increaseCoolSetpoint(123, delta=5)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                                                               |
|------------------------------------------|----------|---------|-----------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer | id or instance of the device                                                                              |
| <span class="nw cb">`delta`</span>       | No       | float   | Number of degrees to increase the cool setpoint.  If unspecified, the change will be equal to one degree. |

### Increase Heat Setpoint { .ref-head-no-code }

Increase the heat setpoint by a delta value.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.thermostat.increaseHeatSetpoint(123)`<br>
`indigo.thermostat.increaseHeatSetpoint(123, delta=5)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                                                              |
|------------------------------------------|----------|---------|----------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer | id or instance of the device                                                                             |
| <span class="nw cb">`delta`</span>       | No       | float   | Number of degrees to increase the heat setpoint. If unspecified, the change will be equal to one degree. |

### Set Cool Setpoint { .ref-head-no-code }

Set the cool setpoint to an absolute temperature.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.thermostat.setCoolSetpoint(123, value=78)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                              |
|------------------------------------------|----------|---------|------------------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer | id or instance of the device             |
| <span class="nw cb">`value`</span>       | Yes      | integer | the absolute temperature of the setpoint |

### Set Fan Mode { .ref-head-no-code }

Adjust the fan mode.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.thermostat.setFanMode(123, value=indigo.kFanMode.AlwaysOn)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type                              | Description                    |
|------------------------------------------|----------|-----------------------------------|--------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer                           | id or instance of the device   |
| <span class="nw cb">`value`</span>       | Yes      | [kFanMode](#fan-mode-enumeration) | the operating mode for the fan |

### Set Heat Setpoint { .ref-head-no-code }

Set the heat setpoint to an absolute temperature.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.thermostat.setHeatSetpoint(123, value=78)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                              |
|------------------------------------------|----------|---------|------------------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer | id or instance of the device             |
| <span class="nw cb">`value`</span>       | Yes      | integer | the absolute temperature of the setpoint |

### Set HVAC Mode { .ref-head-no-code }

Adjust the HVAC mode.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.thermostat.setHvacMode(123, value=indigo.kHvacMode.HeatCool)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type                                | Description                  |
|------------------------------------------|----------|-------------------------------------|------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer                             | id or instance of the device |
| <span class="nw cb">`value`</span>       | Yes      | [kHvacMode](#hvac-mode-enumeration) | HVAC mode identifier         |

<span class="ca">**Examples**</span>

```python
# increase the cool setpoint by 5 degrees
indigo.thermostat.decreaseCoolSetpoint(123, delta=5)

# set the thermostat mode to auto
indigo.thermostat.setHvacMode(123,
    value=indigo.kHvacMode.HeatCool)

# set the heat setpoint to 78
indigo.thermostat.setHeatSetpoint(123, value=78)
```
