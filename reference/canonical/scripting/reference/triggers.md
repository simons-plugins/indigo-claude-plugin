<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/reference/triggers/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Triggers

In the IOM, all triggers are derived from a common Trigger base class. This base contains all the shared components of triggers.

## Trigger Base Class { #trigger .ref-head-no-code }

All triggers will inherit properties from the Trigger base class - including plugin defined events. Note: plugin defined events will always return False for the upload property.

Like other high-level objects in Indigo, there are rules for modifying triggers. For Scripters and Plugin Developers:

1. To create, duplicate, delete, and send commands to a trigger, use the command namespace as described below
1. To modify an object's definition get a copy of the trigger, make the necessary changes, then call `myTrigger.replaceOnServer(newPropsDict)`

For Plugin Developers:

1. To update a plugin's props on a trigger, call `myTrigger.replacePluginPropsOnServer(newPropsDict)` rather than try to update them on the local trigger

Unlike [Devices](devices/index.md), you can't call `create()` in the trigger base class command namespace (`indigo.trigger.*`). Rather, each subclass has its own `create()` method that takes the appropriate arguments for that trigger type.

### Firing Plugin Defined Triggers { .ref-head-no-code }

If you are a plugin developer and your plugin defines events, The process for executing your plugin's events is this:

1. User creates a trigger of type plugin and selects one of your plugin events - configures it (if necessary) and saves.
1. Indigo Server sends the new trigger object to your plugin via the various Trigger Specific Methods in `plugin.py`. The easiest one (parallel to the various device events) is `triggerStartProcessing(self, trigger)`. This method is also called when the server first starts up your plugin - it will pass all triggers defined to your plugin, one at a time, through this method.
1. Your trigger catches the trigger passed in that method and stores it so that it can watch for the conditions that define the event.
1. When the conditions are met that would cause that trigger to fire (plugin implementation specific), you tell the server to [execute the trigger](#execute) using the `indigo.trigger.execute(triggerRef)` method. Note that the execute method will allow you to optionally bypass any conditions - you should NOT do this unless you're providing some kind of override/bypass. Users will clearly want conditions to be taken into account under normal circumstances (that's the default behavior).

You will also need to implement `triggerStopProcessing(self,trigger)` so that you can remove disabled/deleted triggers from your watch list. So, the Server isn't really involved at all with the trigger firing (except to execute the trigger when you tell it to) - it only notifies your plugin of events it's supposed to be watching for and your plugin does the rest.

### Class Properties { #properties .ref-head-no-code }

| Property                                     | Type       | Writable | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
|----------------------------------------------|------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`description`</span>     | string     | Yes      | description of the trigger                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| <span class="nw cb">`enabled`</span>         | boolean    | Yes      | true if this trigger is enabled                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| <span class="nw cb">`folderId`</span>        | integer    | No       | unique ID of the folder this trigger is in                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| <span class="nw cb">`globalProps`</span>     | dictionary | No       | an `indigo.Dict()` representing all name/value pairs associated with this trigger - each plugin will have its own dictionary (`globalProps[pluginId]`) - see [About Plugin Properties](#about-plugin-properties) below for details                                                                                                                                                                                                                                                                                                                                                      |
| <span class="nw cb">`id`</span>              | integer    | No       | a unique id of the trigger, assigned on creation by IndigoServer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| <span class="nw cb">`name`</span>            | string     | Yes      | the unique name of the trigger - no two triggers can have the same name                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| <span class="nw cb">`pluginProps`</span>     | dictionary | No       | an `indigo.Dict()` representing the name/value pairs defined by your plugin for the trigger - plugin developers should publish this information if you want other plugins/scripts to create triggers of this type - see [About Plugin Properties](#about-plugin-properties) below for details                                                                                                                                                                                                                                                                                           |
| <span class="nw cb">`sharedProps`</span>     | dictionary | No       | **[API v2.3](https://www.indigodomo.com/indigo/api_release_notes/2.3/)**  : an `indigo.Dict()` representing the name/value pairs that are shared by all plugins. This is the property dictionary that you can edit via the Global Properties plugin, and your plugin may manage properties in this dictionary as well to add metadata to devices that your plugin can use for other purposes. Use `trigger.replaceSharedPropsOnServer()` to update them (as with pluginProps, you should get copy first, update the copy, then set them back to that copy to avoid accidentally removing some other plugin's props). |
| <span class="nw cb">`suppressLogging`</span> | boolean    | Yes      | true if execution of this trigger will not be logged into the event log                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| <span class="nw cb">`upload`</span>          | boolean    | Yes      | true if IndigoServer should attempt to upload this trigger to the interface - will always be false for plugin triggers                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

### About Plugin Properties { .ref-head-no-code }

Triggers have properties - some are class properties, defined by the class itself. One of the biggest requests we've gotten in the past is some way to add arbitrary properties to an object - so that you could store your own data with the object in the database. And with plugin defined triggers, we needed a place to store the properties that you need to operate the trigger. That's what the `pluginProps` and `globalProps` represent - the additional properties that are not defined by the class. `globalProps` is a dictionary of every additional property defined for the trigger - each plugin has its own dictionary of props in here which are readable by anyone. `pluginProps` is a shortcut to get to your plugin's props and are only writable by your plugin.

We mentioned before that triggers were read-only, and that's true, and that you'd need to use commands in a different command name space. That's ***mostly*** true. Here's another exception to that rule: to change a trigger's pluginProps (it must be "owned" by your plugin - that is, the pluginId must be set to your id), you use a method that's in the trigger's class: replacePluginPropsOnServer(). Here's an example:

```python
trigger=indigo.triggers[123]
localPropsCopy = trigger.pluginProps
localPropsCopy["pollInterval"] = 10
trigger.replacePluginPropsOnServer(localPropsCopy)
```

You would use this technique if you wanted to just change some of the properties that are already defined. Because this method replaces **all** the properties for your plugin in the trigger, you can just set them all in one call:

```python
trigger=indigo.triggers[123]
trigger.replacePluginPropsOnServer({"prop1":10,"prop2":True})
```

Note, though, that if you have a `<ConfigUI>` defined for the event, those properties are also stored here - so in order to make sure your trigger works correctly you must include those properties as well. If you need to update several properties in your props dict, you can use the `update()` method:

```python
trigger=indigo.triggers[123]
localPropsCopy = trigger.pluginProps
localPropsCopy.update({"prop1":10,"prop2":True})
trigger.replacePluginPropsOnServer(localPropsCopy)
```

The `update()` method will change the properties specified, and add the property if it doesn't exist. Now, you might be wondering - why do the extra `localPropsCopy = trigger.pluginProps` rather than just modify the props in place:

```python
trigger=indigo.triggers[123]
trigger.pluginProps.update({"prop1":10,"prop2":True})
trigger.replacePluginPropsOnServer(trigger.pluginProps)
```

Because the trigger object is read-only - when you reference `trigger.pluginProps`, it returns a copy rather than returning a reference to the read-only object. So, in effect, you'd be modifying a copy. But, because you aren't saving a reference to that copy, it goes away since the next time you reference `trigger.pluginProps` another copy is made.

If you need to just dump all the properties for a trigger, you can just:

```python
trigger=indigo.triggers[123]
trigger.replacePluginPropsOnServer(None)
```

That will completely remove your properties from the trigger.

### Commands (indigo.trigger.*) { .ref-head-no-code }

The commands in this section are common to all triggers regardless of type.

#### Delete { .ref-head-no-code }

Delete the specified trigger regardless of its type.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.trigger.delete(123)`</span>

<span class="ca">**Parameters**</span>

| Parameter        | Required | Type    | Description                             |
|------------------|----------|---------|-----------------------------------------|
| direct parameter | Yes      | integer | id or instance of the trigger to delete |

#### Duplicate { .ref-head-no-code }

Duplicate the specified trigger regardless of the type. This method returns a copy of the new trigger.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.trigger.duplicate(123, duplicateName="New Name")`</span>

<span class="ca">**Parameters**</span>

| Parameter                                  | Required | Type    | Description                                |
|--------------------------------------------|----------|---------|--------------------------------------------|
| direct parameter                           | Yes      | integer | id or instance of the trigger to duplicate |
| <span class="nw cb">`duplicateName`</span> | No       | string  | name for the newly duplicated trigger      |

#### Enable/Disable Trigger { #enable .ref-head-no-code }

Disables or enables the trigger, optionally delaying for some period of time and optionally toggling back after the given period.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.trigger.enable(123,value=False)`<br>
`indigo.trigger.enable(123,value=True)`<br>
`indigo.trigger.enable(123, value=True, duration=360, delay=60)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                             | Required | Type    | Description                                                                 |
|---------------------------------------|----------|---------|-----------------------------------------------------------------------------|
| direct parameter                      | Yes      | integer | id or instance of the trigger                                               |
| <span class="nw cb">`value`</span>    | Yes      | boolean | True to enable, False to disable                                            |
| <span class="nw cb">`delay`</span>    | No       | integer | number of seconds to delay before disabling or enabling the trigger         |
| <span class="nw cb">`duration`</span> | No       | integer | number of seconds before the trigger is switched back to its original state |

#### Execute Trigger { #execute .ref-head-no-code }

Tell the IndigoServer to execute the actions associated with the trigger. If your plugin implements events, this is the method you'd call when the conditions for your specific event are met. If you're calling it this way, make sure you include the `ignoreConditions=False` parameter (or don't include the parameter since False is the default) so that any conditions associated with the trigger (by the user in the UI) are evaluated.

This method can also be called by scripters to immediately execute the actions associated with the trigger.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.trigger.execute(123, ignoreConditions=False)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                     | Required | Type    | Description                                                                                                        |
|-----------------------------------------------|----------|---------|--------------------------------------------------------------------------------------------------------------------|
| direct parameter                              | Yes      | integer | id or instance of the trigger                                                                                      |
| <span class="nw cb">`ignoreConditions`</span> | No       | boolean | will ignore any conditions associated with the trigger if True and will evaluate conditions if False (the default) |
| <span class="nw cb">`trigger_data`</span>     | No       | object  | an `indigo.Dict` to be passed to the trigger before it is executed                                                 |

A note on `trigger_data` - Indigo will automatically add a `source` key to your dictionary to represent where the action execution came from:

- "server" if it's something generated from the server itself (schedule execution, built-in trigger, etc.)
- "python" if it's something that comes through IPH that doesn't already have a source attached (scripts, plugins)
- "api-http" if it came from the HTTP API and there wasn't already an included "source"
- "api-websocket" if it came from the websocket API and there wasn't already an included "source"

However, if you include a `source` key in your `trigger_data`, we will not overwrite it, we'll just pass through whatever your value is.

For example, if you

```python
my_dict = indigo.Dict()
my_dict["foo"] = "bar"
indigo.trigger.execute(8974982742, trigger_data=my_dict)
```

The schedule you executed will receive something like this:
```json
{"event-indigo-id": 8974982742, "event-type": "Trigger", "foo": "bar", "source": "python", "timestamp": "1970-01-01T09:09:40"}
```

#### Get Dependencies { .ref-head-no-code }

Return an indigo.Dict with all the dependencies on this trigger.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.trigger.getDependencies(123)`</span>

<span class="ca">**Parameters**</span>

| Parameter        | Required | Type    | Description                                                |
|------------------|----------|---------|------------------------------------------------------------|
| direct parameter | Yes      | integer | id or instance of the trigger to get the dependencies for. |

The dictionary will look something like this:

```python
>>> print(indigo.trigger.getDependencies(91776575))
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

#### Move To Folder { .ref-head-no-code }

Use this command to move the trigger to a different folder. You can get a list of folder id’s by using indigo.triggers.folders, which will return a dictionary. The key to the dictionary is the ID, the value is the folder name.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.trigger.moveToFolder(123, value=987)`</span>

<span class="ca">**Parameters**</span>

| Parameter                          | Required | Type    | Description                                         |
|------------------------------------|----------|---------|-----------------------------------------------------|
| direct parameter                   | Yes      | integer | id or instance of the trigger                       |
| <span class="nw cb">`value`</span> | Yes      | integer | id or instance of the folder to move the trigger to |

#### Remove Delayed Actions { .ref-head-no-code }

This command will remove delayed actions for the specified trigger.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.trigger.removeDelayedActions(123)`</span>

<span class="ca">**Parameters**</span>

| Parameter        | Required | Type    | Description                   |
|------------------|----------|---------|-------------------------------|
| direct parameter | No       | integer | id or instance of the trigger |

### Examples { .ref-head-no-code }

While several of a trigger's properties are read-only (the trigger ID for example), other properties can be changed programmatically. These are noted as "writeable" above. For example,

```python
# Change a trigger's name:
trigger = indigo.triggers[123]
trigger.name = "My new name."
trigger.replaceOnServer()

# Change a trigger's description:
trigger = indigo.triggers[123]
trigger.description = "My new description."
trigger.replaceOnServer()
```

## DeviceStateChangeTrigger { .ref-head-no-code }

The DeviceStateChangeTrigger class represents an event that is described by various changes to a device’s state. Built-in device types have fixed states, but plugins may define custom devices that define their own device states. Note: Controller device types can’t be used in device state change events since they have no state.

### Class Properties { .ref-head-no-code }

| Property                                        | Type                                           | Writable | Description                                                                                                                               |
|-------------------------------------------------|------------------------------------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`deviceId`</span>           | integer                                        | Yes      | the unique device id                                                                                                                      |
| <span class="nw cb">`stateChangeType`</span>    | [kStateChange](#state-change-type-enumeration) | Yes      | the type of state change                                                                                                                  |
| <span class="nw cb">`stateSelector`</span>      | [kStateSelector](#state-selector-enumeration)  | Yes      | can use either a string or one of the enumerations listed in the state selector enumeration                                               |
| <span class="nw cb">`stateSelectorIndex`</span> | integer                                        | Yes      | a 0-based integer value to specify which of multiple options to monitor - see the About State Selector section below for more information |
| <span class="nw cb">`stateValue`</span>         | string                                         | Yes      | the value the current state should be compared against - will be converted to the right type by the server                                |

These events are rather complex for a variety of reasons, but the primary is that device states can be of multiple types which require a different set of controls. Indigo solves the problem by showing the right control options given the type. If your plugin is defining its own states, you’ll have to specify each state and it’s associated type so that Indigo will know what kind of controls to display to the user.

For instance, a temperature reported from a thermostat may be a floating point number. Possible events that you could trigger off of would be greater than, less than, equal, not equal, or has any change. However, becomes true or becomes false doesn’t make any sense. Conversely, an I/O device with binary inputs would really only need becomes true, becomes false, and has any change. The other options don’t make sense. To help you define the appropriate state changes, we’ve created the State Change Enumeration that lists all possible state changes.

However, that’s only one side of the issue. The other important concept is the state selector. In the example above, I mentioned a thermostat temperature and a binary input. I implied a single value for each, but in reality thermostats may in fact have multiple temperature sensors and I/O devices usually have multiple inputs and outputs. So, how do we specify which one?

#### State Change Type Enumeration { #state-change-type-enumeration .ref-head-no-code }

| indigo.kStateChange                             |                                                   |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|-------------------------------------------------|---------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Value                                           | Description                                       | Valid for kStateSelector’s                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| <span class="nw cb">`BecomesEqual`</span>       | `stateSelector` becomes equal to `stateValue`     | `ActiveZone`<br>`AnalogInput`<br>`BrightnessLevel`<br>`HumidityInput`<br>`SensorInput`<br>`SetpointCool`<br>`SetpointHeat`<br>`TemperatureInput`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| <span class="nw cb">`BecomesFalse`</span>       | `stateSelector` becomes `False`                   | `BinaryInput`<br>`BinaryOutput`<br>`HvacCoolerIsOn`<br>`HvacFanIsOn`<br>`HvacFanModeIsAlwaysOn`<br>`HvacFanModeIsAuto`<br>`HvacHeaterIsOn`<br>`HvacOperationModeIsAuto`<br>`HvacOperationModeIsCool`<br>`HvacOperationModeIsHeat`<br>`HvacOperationModeIsOff`<br>`HvacOperationModeIsProgramAuto`<br>`HvacOperationModeIsProgramCool`<br>`HvacOperationModeIsProgramHeat`<br>`OnOffState`<br>`Zone`                                                                                                                                                                                                                                                                                                            |
| <span class="nw cb">`BecomesGreaterThan`</span> | `stateSelector` becomes greater than `stateValue` | `AnalogInput`<br>`BrightnessLevel`<br>`HumidityInput`<br>`SensorInput`<br>`SetpointCool`<br>`SetpointHeat`<br>`TemperatureInput`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| <span class="nw cb">`BecomesLessThan`</span>    | `stateSelector` becomes less than `stateValue`    | `AnalogInput`<br>`BrightnessLevel`<br>`HumidityInput`<br>`SensorInput`<br>`SetpointCool`<br>`SetpointHeat`<br>`TemperatureInput`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| <span class="nw cb">`BecomesNotEqual`</span>    | `stateSelector` becomes not equal to `stateValue` | `ActiveZone`<br>`AnalogInput`<br>`BrightnessLevel`<br>`HumidityInput`<br>`SensorInput`<br>`SetpointCool`<br>`SetpointHeat`<br>`TemperatureInput`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| <span class="nw cb">`BecomesTrue`</span>        | `stateSelector` becomes True                      | `BinaryInput`<br>`BinaryOutput`<br>`HvacCoolerIsOn`<br>`HvacFanIsOn`<br>`HvacFanModeIsAlwaysOn`<br>`HvacFanModeIsAuto`<br>`HvacHeaterIsOn`<br>`HvacOperationModeIsAuto`<br>`HvacOperationModeIsCool`<br>`HvacOperationModeIsHeat`<br>`HvacOperationModeIsOff`<br>`HvacOperationModeIsProgramAuto`<br>`HvacOperationModeIsProgramCool`<br>`HvacOperationModeIsProgramHeat`<br>`OnOffState`<br>`Zone`                                                                                                                                                                                                                                                                                                            |
| <span class="nw cb">`Changes`</span>            | `stateSelector` has any change                    | `ActiveZone`<br>`AnalogInput`<br>`AnalogInputsAll`<br>`BinaryInput`<br>`BinaryInputsAll`<br>`BinaryOutput`<br>`BinaryOutputsAll`<br>`BrightnessLevel`<br>`HumidityInput`<br>`HumidityInputsAll`<br>`HvacCoolerIsOn`<br>`HvacFanIsOn`<br>`HvacFanMode`<br>`HvacFanModeIsAlwaysOn`<br>`HvacFanModeIsAuto`<br>`HvacHeaterIsOn`<br>`HvacOperationModeIsAuto`<br>`HvacOperationModeIsCool`<br>`HvacOperationModeIsHeat`<br>`HvacOperationModeIsOff`<br>`HvacOperationModeIsProgramAuto`<br>`HvacOperationModeIsProgramCool`<br>`HvacOperationModeIsProgramHeat`<br>`OnOffState`<br>`SensorInput`<br>`SensorInputsAll`<br>`SetpointCool`<br>`SetpointHeat`<br>`TemperatureInput`<br>`TemperatureInputsAll`<br>`Zone` |

#### State Selector Enumeration { #state-selector-enumeration .ref-head-no-code }

| indigo.kStateSelector                                       |                                                                                                                                                                            |
|-------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Value                                                       | Description                                                                                                                                                                |
| <span class="nw cb">`ActiveZone`</span>                     | monitor the sprinkler’s activeZone to become =, !=, or any change                                                                                                          |
| <span class="nw cb">`AnalogInput`</span>                    | monitor (one of) the analog input(s) available on the device for =, !=, <, >, or any change - stateSelectorIndex is required to be in the range of available inputs        |
| <span class="nw cb">`AnalogInputsAll`</span>                | monitors all of the analog inputs available on the device for any change                                                                                                   |
| <span class="nw cb">`BinaryInput`</span>                    | monitor (one of) the binary input(s) to become true, false, or any change - stateSelectorIndex is required to be in the range of available inputs                          |
| <span class="nw cb">`BinaryInputsAll`</span>                | monitors all of the binary inputs available on the device for any change                                                                                                   |
| <span class="nw cb">`BinaryOutput`</span>                   | monitor (one of) the binary output(s) to become true, false, or any change - stateSelectorIndex is required to be in the range of available outputs                        |
| <span class="nw cb">`BinaryOutputsAll`</span>               |
| <span class="nw cb">`BrightnessLevel`</span>                | monitor the brightness level of a device for =, !=, <, >, and any change                                                                                                   |
| <span class="nw cb">`HumidityInput`</span>                  | monitor (one of) the humidity sensor(s) available on the device for =, !=, <, >, and any change  - stateSelectorIndex is required to be in the range of available inputs   |
| <span class="nw cb">`HumidityInputsAll`</span>              | monitors all of the humidity sensors available on the device for any change                                                                                                |
| <span class="nw cb">`HvacCoolerIsOn`</span>                 | monitor the thermostat for any time the air conditioning turns on, off, or has any change (coolIsOn is the current compressor state)                                       |
| <span class="nw cb">`HvacFanIsOn`</span>                    | monitor the thermostat for any time the fan turns on, off, or has any change (fanIsOn is the current fan state)                                                            |
| <span class="nw cb">`HvacFanMode`</span>                    | monitor the fanMode of the thermostat for any change                                                                                                                       |
| <span class="nw cb">`HvacFanModeIsAlwaysOn`</span>          | monitor the fanMode of the thermostat for a change to/from  kFanMode.AlwaysOn                                                                                              |
| <span class="nw cb">`HvacFanModeIsAuto`</span>              | monitor the fanMode of the thermostat for a change to/from  kFanMode.AutoOn                                                                                                |
| <span class="nw cb">`HvacHeaterIsOn`</span>                 | monitor the thermostat for any time the heater turns on, off, or has any change (heatIsOn is the current heater state)                                                     |
| <span class="nw cb">`HvacOperationMode`</span>              | monitor the hvacMode of the thermostat for any change                                                                                                                      |
| <span class="nw cb">`HvacOperationModeIsAuto`</span>        | monitor the hvacMode of the thermostat for a change to/from kHvacMode.HeatCoolOn                                                                                           |
| <span class="nw cb">`HvacOperationModeIsCool`</span>        | monitor the hvacMode of the thermostat for a change to/from kHvacMode.CoolOn                                                                                               |
| <span class="nw cb">`HvacOperationModeIsHeat`</span>        | monitor the hvacMode of the thermostat for a change to/from kHvacMode.HeatOn                                                                                               |
| <span class="nw cb">`HvacOperationModeIsOff`</span>         | monitor the hvacMode of the thermostat for a change to/from kHvacMode.Off                                                                                                  |
| <span class="nw cb">`HvacOperationModeIsProgramAuto`</span> | monitor the hvacMode of the thermostat for a change to/from kHvacMode.ProgramAuto                                                                                          |
| <span class="nw cb">`HvacOperationModeIsProgramCool`</span> | monitor the hvacMode of the thermostat for a change to/from kHvacMode.ProgramCool                                                                                          |
| <span class="nw cb">`HvacOperationModeIsProgramHeat`</span> | monitor the hvacMode of the thermostat for a change to/from kHvacMode.ProgramHeat                                                                                          |
| <span class="nw cb">`KeypadButtonLed`</span>                | <!-- FIXME -->                                                                                                                                                             |
| <span class="nw cb">`OnOffState`</span>                     | monitor the device for a change to/from on/off                                                                                                                             |
| <span class="nw cb">`SensorInput`</span>                    | monitor (one of) the sensor input(s) available on the device for =, !=, <, >, or any change  - stateSelectorIndex is required to be in the range of available inputs       |
| <span class="nw cb">`SensorInputsAll`</span>                | monitors all of the sensor inputs available on the device for any change                                                                                                   |
| <span class="nw cb">`SetpointCool`</span>                   | monitor the cool setpoint of the thermostat for =, !=, <, >, or any change                                                                                                 |
| <span class="nw cb">`SetpointHeat`</span>                   | monitor the heat setpoint of the thermostat for =, !=, <, >, or any change                                                                                                 |
| <span class="nw cb">`TemperatureInput`</span>               | monitor (one of) the temperature sensor(s) available on the device for =, !=, <, >, and any change - stateSelectorIndex is required to be in the range of available inputs |
| <span class="nw cb">`TemperatureInputsAll`</span>           | monitors all of the temperature sensors available on the device for any change                                                                                             |
| <span class="nw cb">`Zone`</span>                           | monitor (one of) the binary output(s) to become true, false, or any change - stateSelectorIndex is required to be in the range of available outputs                        |

### Commands (indigo.devStateChange.*) { .ref-head-no-code }

#### Create { .ref-head-no-code }

Create a DeviceStateChange trigger. This method returns a **copy** of the newly created trigger.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.devStateChange.create(name="Trigger Name Here", description="Description Here", folder=1234)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                            |
|------------------------------------------|----------|---------|------------------------------------------------------------------------|
| <span class="nw cb">`description`</span> | No       | string  | the description of the trigger                                         |
| <span class="nw cb">`name`</span>        | Yes      | string  | the name of the trigger                                                |
| <span class="nw cb">`folder`</span>      | No       | integer | id or instance of the folder in which to put the newly created trigger |

### Examples { #devicestatechangetrigger-examples .ref-head-no-code }

So, let’s look at a concrete example - a thermostat. A thermostat has several states which can be monitored, a couple of which may be lists. Specifically, a thermostat may have multiple temperature sensors and multiple humidity sensors.

Here is an example of creating a device state changed trigger that will execute when the first temperature of thermostat id 738 (named "Main Thermostat") goes over 80 degrees in Python:

<!-- FIXME add additional constructor args when they're done -->

```python
theTrigger=indigo.devStateChange.create(name="Temp exceeds 80 degrees")
theTrigger.deviceId = 738
theTrigger.stateChangeType = indigo.kStateChange.BecomesGreaterThan
theTrigger.stateSelector = indigo.kStateSelector.TemperatureInput
theTrigger.stateSelectorIndex = 1
theTrigger.stateValue = 80
theTrigger.replaceOnServer()
```

## EmailReceivedTrigger { .ref-head-no-code }

The EmailReceivedTrigger object represents the email scanning feature in Indigo. You can match on any email received or based on the match fields - subject and/or from email address.

### Class Properties { #emailreceivedtrigger-class-properties .ref-head-no-code }

| Property                                  | Writable                                  | Type | Description                                                                             |
|-------------------------------------------|-------------------------------------------|------|-----------------------------------------------------------------------------------------|
| <span class="nw cb">`emailFilter`</span>  | [kEmailFilter](#email-filter-enumeration) | Yes  | the type of email filter based on the `kEmailFilter` enumeration below                  |
| <span class="nw cb">`emailFrom`</span>    | string                                    | Yes  | if `emailFilter` is `MatchEmailFields`, the value to match against the sender’s address |
| <span class="nw cb">`emailSubject`</span> | string                                    | Yes  | if `emailFilter` is `MatchEmailFields`, the value to match against the subject line     |

#### Email Filter Enumeration { #email-filter-enumeration .ref-head-no-code }

| indigo.kEmailFilter                           |                                      |
|-----------------------------------------------|--------------------------------------|
| Value                                         | Description                          |
| <span class="nw cb">`AnyEmail`</span>         | when any email is received           |
| <span class="nw cb">`MatchEmailFields`</span> | when email subject/from fields match |

### Commands (indigo.emailRcvd.*) { .ref-head-no-code }

#### Create { #commands-indigoemailrcvd-create .ref-head-no-code }

Create a EmailReceivedTrigger. This method returns a **copy** of the newly created trigger.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.emailRcvd.create(name="Trigger Name Here", description="Description Here", folder=1234)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                            |
|------------------------------------------|----------|---------|------------------------------------------------------------------------|
| <span class="nw cb">`description`</span> | No       | string  | the description of the trigger                                         |
| <span class="nw cb">`name`</span>        | Yes      | string  | the name of the trigger                                                |
| <span class="nw cb">`folder`</span>      | No       | integer | id or instance of the folder in which to put the newly created trigger |

<span class="ca">**Examples**</span>

<!-- FIXME add additional constructor args when they're done -->

```python
theTrigger=indigo.emailRcvd.create(name="Emails from some@body.com")

theTrigger.emailFilter = indigo.kEmailFilter.MatchEmailFields
theTrigger.emailFrom = "some@body.com"
theTrigger.replaceOnServer()
```

## InsteonCommandReceivedTrigger { .ref-head-no-code }

The InsteonCommandReceivedTrigger object will match incoming Insteon command events.

### Class Properties { #insteoncommandreceivedtrigger-class-properties .ref-head-no-code }

| Property                                       | Type                                                         | Writable | Description                                                                                                                                                             |
|------------------------------------------------|--------------------------------------------------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`deviceId`</span>          | integer                                                      | Yes      | the unique device id - only used if `commandSourceType` is `DeviceId`                                                                                                   |
| <span class="nw cb">`command`</span>           | [kInsteonCmd](#insteon-command-enumeration)                  | Yes      | the command to watch for                                                                                                                                                |
| <span class="nw cb">`commandSourceType`</span> | [kDeviceSourceType](#trigger-device-source-type-enumeration) | Yes      | the source type - for Insteon only `DeviceId` and `AnyDevice` apply - and `deviceId` above will only be used if set to `DeviceId`                                       |
| <span class="nw cb">`buttonOrGroup`</span>     | integer                                                      | Yes      | the button or group number from which the command is received - see [About Button or Group Numbers](#about-button-or-group-numbers-in-insteon-events) below for details |

#### About Button or Group Numbers in Insteon Events { #about-button-or-group-numbers-in-insteon-events .ref-head-no-code }
Various Insteon devices support features that are implemented via extra group identifiers. For instance, a KeypadLinc will broadcast each of the commands below from each button on it, and each KeypadLinc may have either 6 or 8 buttons depending on configuration. Other devices, like the Motion Sensor and the TriggerLinc will broadcast out group numbers based on other events (battery low, motion detected, dusk/dawn sensor, etc.).

#### Insteon Command Enumeration { #insteon-command-enumeration .ref-head-no-code }

| indigo.kInsteonCmd                         |                                                                    |
|--------------------------------------------|--------------------------------------------------------------------|
| Value                                      | Description                                                        |
| <span class="nw cb">`AllBrighten`</span>   | when an all brighten command begins                                |
| <span class="nw cb">`AllDim`</span>        | when an all dim command begins                                     |
| <span class="nw cb">`AllInstantOff`</span> | when an all instant (fast) off is received                         |
| <span class="nw cb">`AllInstantOn`</span>  | when an all instant (fast) on is received                          |
| <span class="nw cb">`AllOff`</span>        | when an all off is received                                        |
| <span class="nw cb">`AllOn`</span>         | when an all on is received                                         |
| <span class="nw cb">`AnyCommand`</span>    | when any command is received                                       |
| <span class="nw cb">`Brighten`</span>      | when a brighten command begins                                     |
| <span class="nw cb">`Dim`</span>           | when a dim command begins                                          |
| <span class="nw cb">`InstantOff`</span>    | when an Instant (Fast) off is received in response to a double-tap |
| <span class="nw cb">`InstantOn`</span>     | when an Instant (Fast) on is received in response to a double-tap  |
| <span class="nw cb">`Off`</span>           | when an off command is received                                    |
| <span class="nw cb">`On`</span>            | when an on command is received                                     |
| <span class="nw cb">`StatusChanged`</span> | when a status change broadcast is received                         |

#### Trigger Device Source Type Enumeration { #trigger-device-source-type-enumeration .ref-head-no-code }

| indigo.kDeviceSourceType                |                                                                              |
|-----------------------------------------|------------------------------------------------------------------------------|
| Value                                   | Description                                                                  |
| <span class="nw cb">`NoDevice`</span>   | when the source uses no device or address (only used for X10 RF A/V remotes) |
| <span class="nw cb">`Device`</span>     | when the source is an existing device, the ID is specified                   |
| <span class="nw cb">`Address`</span>    | when the source is a raw X10 address                                         |
| <span class="nw cb">`AnyAddress`</span> | when the source is any X10 address or Insteon device                         |

### Commands (indigo.insteonCmdRcvd.*) { .ref-head-no-code }

#### Create { #commands-indigoinsteoncmdrcvd-create .ref-head-no-code }

Create a InsteonCommandReceivedTrigger. This method returns a **copy** of the newly created trigger.

<span class="ca">**Command Syntax Examples**</span>

```python
indigo.insteonCmdRcvd.create(name="Trigger Name Here",
    description="Description Here",
    folder=1234)
```

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                            |
|------------------------------------------|----------|---------|------------------------------------------------------------------------|
| <span class="nw cb">`description`</span> | No       | string  | the description of the trigger                                         |
| <span class="nw cb">`name`</span>        | Yes      | string  | the name of the trigger                                                |
| <span class="nw cb">`folder`</span>      | No       | integer | id or instance of the folder in which to put the newly created trigger |

<span class="ca">**Examples**</span>

<!-- FIXME add additional constructor args when they're done -->

```python
theTrigger= indigo.insteonCmdRcvd.create(name="KeypadLinc button 1 Any Change")
theTrigger.command = indigo.kInsteonCmd.AnyCommand
theTrigger.commandSourceType = indigo.kDeviceSourceType.Device
theTrigger.deviceId = 43829874
theTrigger.buttonOrGroup = 1
theTrigger.replaceOnServer()
```

## InterfaceFailureTrigger { .ref-head-no-code }

The InterfaceFailureTrigger object represents the trigger that’s executed when an interface fails for some reason.

### Class Properties { #interfacefailuretrigger-class-properties .ref-head-no-code }

The InterfaceFailed trigger has no additional properties.

### Commands (indigo.interfaceFail.*) { .ref-head-no-code }

#### Create { #commands-indigointerfacefail-create .ref-head-no-code }

Create a InterfaceFailureTrigger. This method returns a **copy** of the newly created trigger.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.interfaceFail.create(name="Trigger Name Here", description="Description Here", folder=1234)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                            |
|------------------------------------------|----------|---------|------------------------------------------------------------------------|
| <span class="nw cb">`description`</span> | No       | string  | the description of the trigger                                         |
| <span class="nw cb">`name`</span>        | Yes      | string  | the name of the trigger                                                |
| <span class="nw cb">`folder`</span>      | No       | integer | id or instance of the folder in which to put the newly created trigger |

<span class="ca">**Examples**</span>

```python
theTrigger= indigo.interfaceFail.create(name="Any Interface Failed")
```

## InterfaceInitializedTrigger { .ref-head-no-code }

The InterfaceInitializedTrigger object represents the trigger that’s executed when an interface initializes successfully.

### Class Properties { #interfaceinitializedtrigger-class-properties .ref-head-no-code }

InterfaceInitializedTrigger has no additional properties.

### Commands (indigo.interfaceInit.*) { .ref-head-no-code }

#### Create { #commands-indigointerfaceinit-create .ref-head-no-code }

Create a InterfaceInitializedTrigger. This method returns a **copy** of the newly created trigger.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.interfaceInit.create(name="Trigger Name Here", description="Description Here", folder=1234)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                            |
|------------------------------------------|----------|---------|------------------------------------------------------------------------|
| <span class="nw cb">`description`</span> | No       | string  | the description of the trigger                                         |
| <span class="nw cb">`name`</span>        | Yes      | string  | the name of the trigger                                                |
| <span class="nw cb">`folder`</span>      | No       | integer | id or instance of the folder in which to put the newly created trigger |

<span class="ca">**Examples**</span>

```python
theTrigger= indigo.interfaceInit.create(name="Any Interface Initialized")
```

## PluginEventTrigger { .ref-head-no-code }

A plugin event is defined by a plugin.

### Class Properties { #plugineventtrigger-class-properties .ref-head-no-code }

| Property                                  | Type   | Description                                                                                     |
|-------------------------------------------|--------|-------------------------------------------------------------------------------------------------|
| <span class="nw cb">`pluginId`</span>     | string | the unique ID of the plugin, specified in the Info.plist for the plugin (or it’s documentation) |
| <span class="nw cb">`pluginTypeId`</span> | string | the id specified in the Events.xml (or it’s documentation)                                      |

### Commands (indigo.pluginEvent.*) { .ref-head-no-code }

#### Create { #commands-indigopluginevent-create .ref-head-no-code }

Create a trigger. You can create triggers using this method of any type except for events that are defined by your plugin (that class, PluginEventTrigger, has its own create() method). This method returns a **copy** of the newly created trigger. Once a trigger of this type is created, the properties can change (via the [pluginProps in the Trigger base class](#properties)), but nothing else can be changed.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.pluginEvent.create(name="Trigger Name Here", description="Description Here", folder=1234), pluginId="com.mycompany.myplugin", pluginTypeId="myEvent", props={"propA":"value","propB":"value"}`</span>

<span class="ca">**Parameters**</span>

| Parameter                                 | Required | Type       | Description                                                                                                                                                                                                                        |
|-------------------------------------------|----------|------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`description`</span>  | No       | string     | the description of the trigger                                                                                                                                                                                                     |
| <span class="nw cb">`name`</span>         | Yes      | string     | the name of the trigger                                                                                                                                                                                                            |
| <span class="nw cb">`folder`</span>       | No       | integer    | id or instance of the folder in which to put the newly created trigger                                                                                                                                                             |
| <span class="nw cb">`pluginId`</span>     | No       | string     | the plugin id of the plugin that owns the device you're creating - if it's not present, it defaults to your plugin's id                                                                                                            |
| <span class="nw cb">`pluginTypeId`</span> | Yes      | string     | this is the id of the <Event> as specified in the Events.xml or in the documentation for the plugin                                                                                                                                |
| <span class="nw cb">`props`</span>        | No       | dictionary | this is the properties for the trigger - they will be inserted in to the pluginId's property space as supplied above. If you are creating a trigger of a type defined in a different plugin, it's that plugin's id and properties. |

<span class="ca">**Examples**</span>

See the Command Syntax above for an example. See [Firing Plugin Defined Triggers](#firing-plugin-defined-triggers) above for details on how your plugin should watch and fire triggers based on events defined in your Events.xml.

## PowerFailureTrigger { .ref-head-no-code }

The PowerFailureTrigger object represents a trigger that’s executed when an interface loses power (if applicable). Note - not all interfaces can detect a power failure - usually only those interfaces that are plugged directly into an electrical outlet.

### Class Properties { #powerfailuretrigger-class-properties .ref-head-no-code }

PowerFailureTrigger has no additional properties.

### Commands (indigo.powerFailure.*) { .ref-head-no-code }

#### Create { #commands-indigopowerfailure-create .ref-head-no-code }

Create a `PowerFailureTrigger`. This method returns a **copy** of the newly created trigger.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.powerFailure.create(name="Trigger Name Here", description="Description Here", folder=1234)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                            |
|------------------------------------------|----------|---------|------------------------------------------------------------------------|
| <span class="nw cb">`description`</span> | No       | string  | the description of the trigger                                         |
| <span class="nw cb">`name`</span>        | Yes      | string  | the name of the trigger                                                |
| <span class="nw cb">`folder`</span>      | No       | integer | id or instance of the folder in which to put the newly created trigger |

<span class="ca">**Examples**</span>

```python
theTrigger= indigo.powerFailure.create(name="Any Interface Detected Power Failure")
```

## ServerStartupTrigger { .ref-head-no-code }

The ServerStartupTrigger class represents a trigger that’s executed when the IndigoServer process starts up. This is a special event in that it adds no additional parameters beyond what it inherits from [Trigger](#trigger).

### Commands (indigo.serverStartup.*) { .ref-head-no-code }

#### Create { #commands-indigoserverstartup-create .ref-head-no-code }

Create a ServerStartupTrigger trigger. This method returns a **copy** of the newly created trigger.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.serverStartup.create(name="Trigger Name Here", description="Description Here", folder=1234)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                            |
|------------------------------------------|----------|---------|------------------------------------------------------------------------|
| <span class="nw cb">`description`</span> | No       | string  | the description of the trigger                                         |
| <span class="nw cb">`name`</span>        | Yes      | string  | the name of the trigger                                                |
| <span class="nw cb">`folder`</span>      | No       | integer | id or instance of the folder in which to put the newly created trigger |

<span class="ca">**Examples**</span>

```python
theTrigger= indigo.serverStartup.create(name="Startup")
```

## X10CommandReceivedTrigger { .ref-head-no-code }

The X10CommandReceivedTrigger object will match incoming X10 command events.

### Class Properties { #x10commandreceivedtrigger-class-properties .ref-head-no-code }

| Property                                       | Type                                                         | Description                                                                                                                |
|------------------------------------------------|--------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------| 
| <span class="nw cb">`address`</span>           | string                                                       | if commandSourceType = Address, the full X10 address to listen for or just the house code if command is All* or AnyCommand |
| <span class="nw cb">`avButton`</span>          | [kX10AvButton](#x10-a-v-button-enumeration)                  | if command = AvButtonPressed, the A/V button to monitor                                                                    |
| <span class="nw cb">`deviceId`</span>          | integer                                                      | if commandSourceType = Device, the unique device id                                                                        |
| <span class="nw cb">`command`</span>           | [kX10Cmd](#x10-command-enumeration)                          | the X10 command to watch for                                                                                               |
| <span class="nw cb">`commandSourceType`</span> | [kDeviceSourceType](#trigger-device-source-type-enumeration) | the type of source specified for this trigger                                                                              |

#### X10 Command Enumeration { #x10-command-enumeration .ref-head-no-code }

| indigo.kX10Cmd                                 |                                               |
|------------------------------------------------|-----------------------------------------------|
| Value                                          | Description                                   |
| <span class="nw cb">`AllOff`</span>            | when an all off is received                   |
| <span class="nw cb">`AllLightsOff`</span>      | when an all lights off is received            |
| <span class="nw cb">`AllLightsOn`</span>       | when an all lights on is received             |
| <span class="nw cb">`AvButtonPressed`</span>   | when an A/V button press is received          |
| <span class="nw cb">`AnyCommand`</span>        | when any command is received                  |
| <span class="nw cb">`Brighten`</span>          | when a brighten command begins                |
| <span class="nw cb">`Dim`</span>               | when a dim command begins                     |
| <span class="nw cb">`ExtendedData`</span>      | when an extended data X10 command is received |
| <span class="nw cb">`Off`</span>               | when an off command is received               |
| <span class="nw cb">`On`</span>                | when an on command is received                |
| <span class="nw cb">`PresetDim`</span>         | when a preset dim command is received         |
| <span class="nw cb">`StatusOffResponse`</span> | when a status off response is received        |
| <span class="nw cb">`StatusOnResponse`</span>  | when a status on response is received         |

#### X10 A/V Button Enumeration { #x10-a-v-button-enumeration .ref-head-no-code }

| indigo.kX10AvButton                      |              |
|------------------------------------------|--------------|
| Value                                    | Value        |
| <span class="nw cb">`0`</span>           | `Left`       |
| <span class="nw cb">`1`</span>           | `Menu`       |
| <span class="nw cb">`2`</span>           | `Mute`       |
| <span class="nw cb">`3`</span>           | `Pause`      |
| <span class="nw cb">`4`</span>           | `PC`         |
| <span class="nw cb">`5`</span>           | `Play`       |
| <span class="nw cb">`6`</span>           | `Power`      |
| <span class="nw cb">`7`</span>           | `Recall`     |
| <span class="nw cb">`8`</span>           | `Record`     |
| <span class="nw cb">`9`</span>           | `Return`     |
| <span class="nw cb">`AB`</span>          | `Rewind`     |
| <span class="nw cb">`ChannelDown`</span> | `Right`      |
| <span class="nw cb">`ChannelUp`</span>   | `Stop`       |
| <span class="nw cb">`Display`</span>     | `Title`      |
| <span class="nw cb">`Down`</span>        | `Up`         |
| <span class="nw cb">`Enter`</span>       | `VolumeDown` |
| <span class="nw cb">`Exit`</span>        | `VolumeUp`   |
| <span class="nw cb">`Forward`</span>     |

### Commands (indigo.x10CmdRcvd.*) { .ref-head-no-code }

#### Create { #commands-indigox10cmdrcvd-create .ref-head-no-code }

Create an X10CommandReceivedTrigger. This method returns a **copy** of the newly created trigger.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.x10CmdRcvd.create(name="Trigger Name Here", description="Description Here", folder=1234)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                            |
|------------------------------------------|----------|---------|------------------------------------------------------------------------|
| <span class="nw cb">`description`</span> | No       | string  | the description of the trigger                                         |
| <span class="nw cb">`name`</span>        | Yes      | string  | the name of the trigger                                                |
| <span class="nw cb">`folder`</span>      | No       | integer | id or instance of the folder in which to put the newly created trigger |

<span class="ca">**Examples**</span>

```python
myTrigger=indigo.x10CmdRcvd.create(name="Received any command from F7")
myTrigger.command = indigo.kX10Cmd.AnyCommand
myTrigger.commandSourceType = indigo.kDeviceSourceType.Address
myTrigger.address = "F7"
myTrigger.replaceOnServer()
```

## VariableValueChangeTrigger { .ref-head-no-code }

The VariableValueChangeTrigger object will match variable changes.

### Class Properties { #variablevaluechangetrigger-class-properties .ref-head-no-code }

| Property                                        | Type                                            | Description                                                                              |
|-------------------------------------------------|-------------------------------------------------|------------------------------------------------------------------------------------------|
| <span class="nw cb">`variableChangeType`</span> | [kVarChange](#variable-change-type-enumeration) | the type of variable change to monitor                                                   |
| <span class="nw cb">`variableId`</span>         | integer                                         | the unique variable id                                                                   |
| <span class="nw cb">`variableValue`</span>      | string                                          | the value to compare against the variable’s value if `variableChangeType` is =, !=, >, < |

#### Variable Change Type Enumeration { #variable-change-type-enumeration .ref-head-no-code }

| indigo.kVarChange                               |                                     |
|-------------------------------------------------|-------------------------------------|
| Value                                           | Description                         |
| <span class="nw cb">`BecomesEqual`</span>       | variable value becomes equal to     |
| <span class="nw cb">`BecomesFalse`</span>       | variable value becomes false        |
| <span class="nw cb">`BecomesGreaterThan`</span> | variable value becomes greater than |
| <span class="nw cb">`BecomesLessThan`</span>    | variable value becomes less than    |
| <span class="nw cb">`BecomesNotEqual`</span>    | variable value becomes not equal to |
| <span class="nw cb">`BecomesTrue`</span>        | variable value becomes true         |
| <span class="nw cb">`Changes`</span>            | variable value has any change       |

### Commands (indigo.varValueChange.*) { .ref-head-no-code }

#### Create { #commands-indigovarvaluechange-create .ref-head-no-code }

Create an VariableChangeEvent. This method returns a **copy** of the newly created trigger.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.varValueChange.create(name="Trigger Name Here", description="Description Here", folder=1234)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                            |
|------------------------------------------|----------|---------|------------------------------------------------------------------------|
| <span class="nw cb">`description`</span> | No       | string  | the description of the trigger                                         |
| <span class="nw cb">`name`</span>        | Yes      | string  | the name of the trigger                                                |
| <span class="nw cb">`folder`</span>      | No       | integer | id or instance of the folder in which to put the newly created trigger |

<span class="ca">**Examples**</span>

<!-- FIXME add additional constructor args when they're done -->
Commands (indigo.devStateChange.*)
```python
theTrigger=indigo.varValueChange.create(name="Var Changed to True")

theTrigger.variableChangeType = indigo.kVarChange.BecomesEqual
theTrigger.variableId = 9283749872
theTrigger.variableValue = "True"
theTrigger.replaceOnServer()
```
