<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/reference/actions/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Actions

In the IOM, all actions are derived from a common Action base class. This base contains all the shared components of actions. Unlike the other major classes, however, there isn't a command namespace for Actions. Why is that, you say? Because Actions don't exist outside the object that contains them (Triggers, Schedules, Action Groups, etc.). So, when manipulating actions, you always work directly on the object, then assign that object to one of the container objects. Don't worry, we'll walk you through it.

## Action Base Class {.ref-head-no-code }

The Action class is a base class that provides the common functionality to its subclasses (to follow). You may specify a new `Action` class in your list of actions for a trigger, schedule, or action group, but the action type will be `None` - that is, it will delay and speak any text set in the object, but other than that it will do nothing. Most of the time you'll be using one of the subclasses so that you get the specific functionality you're looking for.

<span class="ca">**Class Properties**</span>

| Property | Type | Description |
| --- | --- | --- |
| <span class="nw cb">`delayAmount`</span> | integer | number of seconds to delay before executing the actions (0 for none) |
| <span class="nw cb">`replaceExisting`</span> | boolean | if true then any existing delayed action is replaced by this one |
| <span class="nw cb">`textToSpeak`</span> | string | this is the text to speak when the action is executed |

### Complementary Delays { #complementary-delays .ref-head-no-code }

For some action types, the user (and you) may specify that the complementary action be taken after some number of seconds. The table below specifies what complementary actions are available with the various action types:

| Complementary Actions |  |
| --- | --- |
| Action | Complement |
| <span class="nw cb">`DeviceAction`<br>`kDeviceAction.TurnOff`<br>`kDeviceAction.TurnOn`<br>`kDeviceAction.Toggle`<br>`kDeviceAction.Lock`<br>`kDeviceAction.Unlock`</span> | <span class="nw cb">`DeviceAction`<br>`kDeviceAction.TurnOn`<br>`kDeviceAction.TurnOff`<br>`kDeviceAction.Toggle`<br>`kDeviceAction.Unlock`<br>`kDeviceAction.Lock`</span> |
| <span class="nw cb">`DisableScheduleAction`</span> | <span class="nw cb">`EnableScheduleAction`</span> |
| <span class="nw cb">`DisableTriggerAction`</span> | <span class="nw cb">`EnableTriggerAction`</span> |
| <span class="nw cb">`EnableScheduleAction`</span> | <span class="nw cb">`DisableScheduleAction`</span> |
| <span class="nw cb">`EnableTriggerAction`</span> | <span class="nw cb">`DisableTriggerAction`</span> |

## DeviceAction (API v2.0+ only) {.ref-head-no-code }

<span class="dw-color-blue">API v2.0+ only:</span> This class represents an action to control dimmers (lights), relay (appliances), and locks. Previously this class was named DimmerRelayAction -- it was renamed in API v2.0.

<span class="ca">**Class Properties**</span>

| Property | Type | Description |
| --- | --- | --- |
| <span class="nw cb">`complementDelay`</span> | integer | the number of seconds to delay before issuing the complementary action (0 for no action) - see [Complementary Delays](#complementary-delays) for details |
| <span class="nw cb">`deviceId`</span> | integer | the id of the device |
| <span class="nw cb">`deviceAction`</span> | [kDeviceAction](#device-action-enumeration) | this is the command to send to the device |
| <span class="nw cb">`actionValue`</span> | integer or dict | if `deviceAction` is in [Brighten, Dim, SetBrightness] then this is an integer value |

### Device Action Enumeration { #device-action-enumeration .ref-head-no-code }

| indigo.kDeviceAction |  |
| --- | --- |
| Value | Description |
| <span class="nw cb">`AllLightsOff`</span> | turn off all dimmer (light) devices |
| <span class="nw cb">`AllLightsOn`</span> | turn on all dimmer (light) devices |
| <span class="nw cb">`AllOff`</span> | turn off all dimmer (light) and relay (appliance) devices |
| <span class="nw cb">`BrightenBy`</span> | brighten a dimmer (light) device by the amount specified in the `actionValue` integer property |
| <span class="nw cb">`DimBy`</span> | dim a dimmer (light) device by the amount specified in the `actionValue` integer property |
| <span class="nw cb">`SetBrightness`</span> | set a dimmer (light) device to the brightness specified in the `actionValue` integer property |
| <span class="nw cb">`SetColorLevels`</span> | set the color (RGB) and white levels to the values specified in the `actionValue` dict property |
| <span class="nw cb">`Toggle`</span> | toggle the on/off state of a dimmer (light) or relay (appliance) device |
| <span class="nw cb">`TurnOff`</span> | turn off a dimmer (light) or relay (appliance) device |
| <span class="nw cb">`TurnOn`</span> | turn on a dimmer (light) or relay (appliance) device |
| <span class="nw cb">`Lock`</span> | lock a deadbolt or door device |
| <span class="nw cb">`Unlock`</span> | unlock a deadbolt or door device |

## DisableScheduleAction {.ref-head-no-code }

This class represents an action to disable a schedule.

<span class="ca">**Class Properties**</span>

| Property | Type | Description |
| --- | --- | --- |
| <span class="nw cb">`complementDelay`</span> | integer | the number of seconds to delay before issuing the complementary action (0 for no action), in this case an EnableScheduleAction - see [Complementary Delays](#complementary-delays) for details |
| <span class="nw cb">`scheduleId`</span> | integer | the id of the schedule to disable |

## DisableTriggerAction {.ref-head-no-code }

This class represents an action to disable a trigger.

<span class="ca">**Class Properties**</span>

| Property | Type | Description |
| --- | --- | --- |
| <span class="nw cb">`complementDelay`</span> | integer | the number of seconds to delay before issuing the complementary action (0 for no action), in this case an EnableTriggerAction - see [Complementary Delays](#complementary-delays) for details |
| <span class="nw cb">`triggerId`</span> | integer | the id of the trigger to disable |

## EmailAction {.ref-head-no-code }

This class represents an action to send an email.

<span class="ca">**Class Properties**</span>

| Property | Type | Description |
| --- | --- | --- |
| <span class="nw cb">`emailBody`</span> | string | the body of the email to send |
| <span class="nw cb">`emailSubject`</span> | string | the subject of the email to send |
| <span class="nw cb">`emailTo`</span> | string | the (semicolon separated) list of email addresses |

## EnableScheduleAction {.ref-head-no-code }

This class represents an action to enable a schedule.

<span class="ca">**Class Properties**</span>

| Property | Type | Description |
| --- | --- | --- |
| <span class="nw cb">`complementDelay`</span> | integer | the number of seconds to delay before issuing the complementary action (0 for no action), in this case an `DisableScheduleAction` - see [Complementary Delays](#complementary-delays) for details |
| <span class="nw cb">`scheduleId`</span> | integer | the id of the schedule to enable |

## EnableTriggerEventAction {.ref-head-no-code }

This class represents an action to enable a trigger event.

<span class="ca">**Class Properties**</span>

| Property | Type | Description |
| --- | --- | --- |
| <span class="nw cb">`complementDelay`</span> | integer | the number of seconds to delay before issuing the complementary action (0 for no action), in this case an DisableTriggerAction - see [Complementary Delays](#complementary-delays) for details |
| <span class="nw cb">`eventId`</span> | integer | the id of the event to enable |

## ExecuteGroupAction {.ref-head-no-code }

This class represents an action to execute an action group.

<span class="ca">**Class Properties**</span>

| Property | Type | Description |
| --- | --- | --- |
| <span class="nw cb">`groupId`</span> | integer | the id of the action group to execute |

## ExecuteScriptAction {.ref-head-no-code }

This class represents an action to execute a script.

<span class="ca">**Class Properties**</span>

| Property | Type | Description |
| --- | --- | --- |
| <span class="nw cb">`scriptCode`</span> | string | this is the source code of the script to execute |

## Get Dependencies {.ref-head-no-code }

Return an indigo.Dict with all the dependencies on this action group.

<span class="ca">**Command Syntax Examples**</span>

```python
indigo.actionGroup.getDependencies(123)
```

<span class="ca">**Parameters**</span>

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| direct parameter | Yes | integer | id or instance of the action group to get the dependencies for. |

The dictionary will look something like this:

```python
>>> print(indigo.actionGroup.getDependencies(91776575))
Data : (dict)
     actionGroups : (list)
     controlPages : (list)
     devices : (list)
     schedules : (list)
          Data : (dict)
               ID : 552463741 (integer)
               Name : Between condition test (string)
          Data : (dict)
               ID : 296710860 (integer)
               Name : Greater than condition test (string)
     triggers : (list)
     variables : (list)
```

So, the dictionary will have 6 top-level keys: "actionGroups", "controlPages", "devices", "schedules", "triggers", and "variables". Each one of those keys will return a list object. Inside that list object will be multiple dicts, one for each dependency (or an empty list if there are none). Each dependency dictionary has two keys: "ID" which is the unique id and "Name" which is the name of the object.

## InputOutputAction {.ref-head-no-code }

This class represents an action to control an input/output module.

<span class="ca">**Class Properties**</span>

| Property                              | Type                                          | Description                                                                                 |
|---------------------------------------|-----------------------------------------------|---------------------------------------------------------------------------------------------|
| <span class="nw cb">`deviceId`</span> | integer                                       | this is the ID of the I/O device                                                            |
| <span class="nw cb">`action`</span>   | [kIOAction](#input-output-action-enumeration) | this I/O action to execute                                                                  |
| <span class="nw cb">`index`</span>    | integer                                       | if `action` is `TurnOffOutput`, `TurnOnOutput`, the index of the input or output to control |

### Input/Output Action Enumeration { #input-output-action-enumeration .ref-head-no-code }

| indigo.kIOAction                                        |                                                 |
|---------------------------------------------------------|-------------------------------------------------|
| Value                                                   | Description                                     |
| <span class="nw cb">`TurnOffOutput`</span>              | turn off the output specified by index          |
| <span class="nw cb">`TurnOffAllOutputs`</span>          | turn off all outputs                            |
| <span class="nw cb">`TurnOnOutput`</span>               | turn on the output specified by index           |
| <span class="nw cb">`RequestStatusAll`</span>           | request status of all hardware input/outputs    |
| <span class="nw cb">`RequestAnalogInputValues`</span>   | request all analog input values from the device |
| <span class="nw cb">`RequestBinaryInputsStatus`</span>  | request all binary input statuses               |
| <span class="nw cb">`RequestBinaryOutputsStatus`</span> | request all binary output statuses              |
| <span class="nw cb">`RequestSensorInputValues`</span>   | request all sensor input values                 |

## ModifyVariableAction {.ref-head-no-code }

This class represents an action to modify an Indigo variable.

<span class="ca">**Class Properties**</span>

| Property                                    | Type                                            | Description                            |
|---------------------------------------------|-------------------------------------------------|----------------------------------------|
| <span class="nw cb">`variableId`</span>     | integer                                         | the id of the variable                 |
| <span class="nw cb">`variableAction`</span> | [kVariableAction](#variable-action-enumeration) | the type of variable action to execute |
| <span class="nw cb">`variableValue`</span>  | string                                          | the new variable value                 |

### Variable Action Enumeration { #variable-action-enumeration .ref-head-no-code }

| indigo.kVariableAction                      |                                                  |
|---------------------------------------------|--------------------------------------------------|
| Value                                       | Description                                      |
| <span class="nw cb">`DecrementValue`</span> | decrement the variable value by 1                |
| <span class="nw cb">`IncrementValue`</span> | increment the variable value by 1                |
| <span class="nw cb">`SetValue`</span>       | set the variable to the `variableValue` property |

## PluginAction {.ref-head-no-code }

A plugin action is defined by a plugin, and is similar in definition to a CustomPluginDevice.

<span class="ca">**Class Properties**</span>

| Property                                  | Type       | Description                                                                                     |
|-------------------------------------------|------------|-------------------------------------------------------------------------------------------------|
| <span class="nw cb">`deviceId`</span>     | integer    | the id of the device                                                                            |
| <span class="nw cb">`pluginId`</span>     | string     | the unique ID of the plugin, specified in the Info.plist for the plugin (or it’s documentation) |
| <span class="nw cb">`pluginTypeId`</span> | string     | the id specified in the Actions.xml (or it’s documentation)                                     |
| <span class="nw cb">`props`</span>        | dictionary | an indigo.Dict() defining this action's parameters                                              |

## SendInsteonGroupCommandAction {.ref-head-no-code }

This class represents an action to send an Insteon group command.

<span class="ca">**Class Properties**</span>

| Property                             | Type                                                          | Description                                   |
|--------------------------------------|---------------------------------------------------------------|-----------------------------------------------|
| <span class="nw cb">`command`</span> | [kInstnGroupCommand](#insteon-send-group-command-enumeration) | this is the group command to send             |
| <span class="nw cb">`group`</span>   | integer                                                       | this is the group number to send `command` to |

### Insteon Send Group Command Enumeration { #insteon-send-group-command-enumeration .ref-head-no-code }

| indigo.kIOAction                        |                                                                 |
|-----------------------------------------|-----------------------------------------------------------------|
| Value                                   | Description                                                     |
| <span class="nw cb">`InstantOff`</span> | send the instant (fast) off command to group ignoring ramp rate |
| <span class="nw cb">`InstantOn`</span>  | send the instant (fast) on command to group ignoring ramp rate  |
| <span class="nw cb">`Off`</span>        | send the off command to group                                   |
| <span class="nw cb">`On`</span>         | send the on command to group                                    |

## SprinklerAction {.ref-head-no-code }

This class represents an action to control a sprinkler module.

<span class="ca">**Class Properties**</span>

| Property                                     | Type                                              | Description                                                                                                                           |
|----------------------------------------------|---------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`deviceId`</span>        | integer                                           | the id of the sprinkler device                                                                                                        |
| <span class="nw cb">`multiplierVarId`</span> | integer                                           | <span class="dw-color-blue">API v1.20+ only:</span> optional elem ID for the variable multiplier (None if no multiplier is specified) |
| <span class="nw cb">`sprinklerAction`</span> | [kSprinklerAction](#sprinkler-action-enumeration) | this sprinkler action to execute                                                                                                      |
| <span class="nw cb">`zoneDurations`</span>   | list of float                                     | list of floats that represent the durations in minutes for each zone to schedule - used when `sprinklerAction` is `RunNewSchedule`    |
| <span class="nw cb">`zoneIndex`</span>       | integer                                           | the zone to turn on as a 1-based index -- used when `sprinklerAction` is `ZoneOn`                                                     |

### Sprinkler Action Enumeration { #sprinkler-action-enumeration .ref-head-no-code }

| indigo.kSprinklerAction                          |                                          |
|--------------------------------------------------|------------------------------------------|
| Value                                            | Description                              |
| <span class="nw cb">`RunNewSchedule`</span>      | run a new sprinkler schedule             |
| <span class="nw cb">`RunPreviousSchedule`</span> | run the last executed sprinkler schedule |
| <span class="nw cb">`PauseSchedule`</span>       | pause the current sprinkler schedule     |
| <span class="nw cb">`ResumeSchedule`</span>      | resume the current sprinkler schedule    |
| <span class="nw cb">`StopSchedule`</span>        | stop the current sprinkler schedule      |
| <span class="nw cb">`PreviousZone`</span>        | set sprinkler to the previous zone       |
| <span class="nw cb">`NextZone`</span>            | set sprinkler to the next zone           |
| <span class="nw cb">`ZoneOn`</span>              | turn on a single zone                    |
| <span class="nw cb">`AllZonesOff`</span>         | turn off all zones                       |
| <span class="nw cb">`RequestStatusAll`</span>    | request status of all valves             |

## ResetInterfacesAction {.ref-head-no-code }

This class represents an action to reset the built-in interfaces. There are no extra properties necessary for this action.

## ThermostatAction {.ref-head-no-code }

This class represents an action to control a thermostat.

<span class="ca">**Class Properties**</span>

| Property                                      | Type                                                                                               | Description                                                                                                                                        |
|-----------------------------------------------|----------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`deviceId`</span>         | integer                                                                                            | this is the ID of the thermostat                                                                                                                   |
| <span class="nw cb">`thermostatAction`</span> | [kThermostatAction](#thermostat-action-enumeration)                                                | this thermostat action to execute                                                                                                                  |
| <span class="nw cb">`actionMode`</span>       | [kFanMode](device-subclasses/thermostat.md#fan-mode-enumeration)<br>OR<br>[kHvacMode](device-subclasses/thermostat.md#hvac-mode-enumeration) | if action is SetFanMode, then a kFanMode enumeration<br>if action is SetHvacMode, then a kHvacMode enumeration                                     |
| <span class="nw cb">`actionValue`</span>      | float                                                                                              | if action is `Decrease` or `Increase`, the amount to increase/decrease the setpoints<br>if action is `Set`, the temperature to set the setpoint to |

### Thermostat Action Enumeration { #thermostat-action-enumeration .ref-head-no-code }

| indigo.kThermostatAction                           |                                                                        |
|----------------------------------------------------|------------------------------------------------------------------------|
| Value                                              | Description                                                            |
| <span class="nw cb">`DecreaseCoolSetpoint`</span>  | decrease setpoint by value                                             |
| <span class="nw cb">`DecreaseHeatSetpoint`</span>  | decrease setpoint by value                                             |
| <span class="nw cb">`IncreaseCoolSetpoint`</span>  | increase setpoint by value                                             |
| <span class="nw cb">`IncreaseHeatSetpoint`</span>  | increase setpoint by value                                             |
| <span class="nw cb">`SetCoolSetpoint`</span>       | set the setpoint to value                                              |
| <span class="nw cb">`SetFanMode`</span>            | set the fan mode to mode                                               |
| <span class="nw cb">`SetHeatSetpoint`</span>       | set the setpoint to value                                              |
| <span class="nw cb">`SetHvacMode`</span>           | set the hvac mode to mode                                              |
| <span class="nw cb">`RequestStatusAll`</span>      | request all current values from the thermostat                         |
| <span class="nw cb">`RequestMode`</span>           | request the current mode of the thermostat                             |
| <span class="nw cb">`RequestEquipmentState`</span> | request the current operational state of the compressor, furnace, etc. |
| <span class="nw cb">`RequestTemperatures`</span>   | request all current temperatures from the thermostat                   |
| <span class="nw cb">`RequestHumidities`</span>     | request all current humidities from the thermostat                     |
| <span class="nw cb">`RequestDeadbands`</span>      | request the current deadband ranges from the thermostat                |
| <span class="nw cb">`RequestSetpoints`</span>      | request all current setpoints from the thermostat                      |

## UniversalAction (API v2.0+ only) {.ref-head-no-code }

<span class="dw-color-blue">API v2.0+ only:</span> This class represents a universal action that can be used with devices of different classes. Previously this class was named GeneralDeviceAction -- it was renamed in API v2.0.

<span class="ca">**Class Properties**</span>

| Property                                  | Type                                                   | Description                               |
|-------------------------------------------|--------------------------------------------------------|-------------------------------------------|
| <span class="nw cb">`deviceId`</span>     | integer                                                | the id of the device                      |
| <span class="nw cb">`deviceAction`</span> | [kUniversalAction](#general-device-action-enumeration) | this is the command to send to the device |

### General Device Action Enumeration { #general-device-action-enumeration .ref-head-no-code }

| indigo.kUniversalAction                    |                                                                        |
|--------------------------------------------|------------------------------------------------------------------------|
| Value                                      | Description                                                            |
| <span class="nw cb">`Beep`</span>          | request that the device perform an audible beep or buzz                |
| <span class="nw cb">`EnergyUpdate`</span>  | request that the energy meter send its most recent meter data          |
| <span class="nw cb">`EnergyReset`</span>   | request that the energy meter reset its accumulative energy usage data |
| <span class="nw cb">`RequestStatus`</span> | send a device a status request for a complete update                   |
