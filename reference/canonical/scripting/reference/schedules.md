<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/reference/schedules/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Schedules

In the IOM, all schedules are derived from a common Schedule base class. This base contains all the shared components of schedules.

## Schedule Base Class { .ref-head-no-code }

All schedules will inherit properties from the Schedule base class.

Like other high-level objects in Indigo, there are rules for modifying schedules. For Scripters and Plugin Developers:

1. To duplicate, delete, and send commands to a schedule, use the command namespace as described below
1. To modify an object's definition, get a copy of the schedule, make the necessary changes, then call `mySchedule.replaceSharedPropsOnServer(newPropsDict)` (see below).

### Class Properties { .ref-head-no-code }

Under construction

| Property                                      | Type                                                  | Writable | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|-----------------------------------------------|-------------------------------------------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`absoluteDate`</span>     | <span class="nw cb">`datetime.datetime`</span> / None | Yes      | The absolute date of the next schedule execution with 00:00:00 as the base time.                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| <span class="nw cb">`absoluteDateTime`</span> | <span class="nw cb">`datetime.datetime`</span> / None | Yes      | The absolute date and time of the next schedule execution.                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| <span class="nw cb">`absoluteTime`</span>     | <span class="nw cb">`datetime.datetime`</span> / None | Yes      | The absolute time of the next schedule execution with 2000-01-01 as the base date.                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| <span class="nw cb">`autoDelete`</span>       | boolean                                               | Yes      | true if Indigo should automatically delete this schedule after the next execution, otherwise false.                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| <span class="nw cb">`configured`</span>       | boolean                                               | Yes      | true if the schedule has been fully configured, otherwise false.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| <span class="nw cb">`dateType`</span>         | <span class="nw cb">`indigo.kDateType`</span> / None  |          | Describes the "type" of date/time options for the schedule. [Absolute / EveryDay / DaysOfWeek / DaysOfMonth]                                                                                                                                                                                                                                                                                                                                                                                                                           |
| <span class="nw cb">`description`</span>      | string                                                | Yes      | description of the schedule.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| <span class="nw cb">`enabled`</span>          | boolean                                               | Yes      | true if the schedule is enabled, otherwise false (Indigo will not execute the schedule if false).                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| <span class="nw cb">`folderId`</span>         | integer                                               | No       | unique ID of the folder this schedule is in.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| <span class="nw cb">`globalProps`</span>      | dictionary                                            | No       | an `indigo.Dict()` that will contain the props for the schedule. It's generally easier to use the shortcut `sharedProps` below.                                                                                                                                                                                                                                                                                                                                                                                                        |
| <span class="nw cb">`id`</span>               | integer                                               | No       | a unique id of the schedule, assigned on creation by IndigoServer.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| <span class="nw cb">`name`</span>             | string                                                | Yes      | the unique name of the schedule - no two schedules can have the same name.                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| <span class="nw cb">`nextExecution`</span>    | <span class="nw cb">`datetime.datetime`</span> / None | No       | The date and time of the schedule's next execution.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| <span class="nw cb">`pluginProps`</span>      | dictionary                                            | No       | pluginProps will return an empty dict because plugins cannot currently create custom schedules.                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| <span class="nw cb">`randomizeBy`</span>      | integer                                               | Yes      | the number of minutes (plus or minus) Indigo should use to randomize the execution of the schedule.                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| <span class="nw cb">`remoteDisplay`</span>    | boolean                                               | Yes      | true if remote clients should display the schedule, otherwise false (does not affect the Indigo client UI).                                                                                                                                                                                                                                                                                                                                                                                                                            |
| <span class="nw cb">`sharedProps`</span>      | dictionary                                            | No       | an `indigo.Dict()` containing the name/value pairs that are shared by all plugins. This is the property dictionary that you can edit via the Global Properties plugin, and your plugin may manage properties in this dictionary as well to add metadata to devices that your plugin can use for other purposes. Use `sched.replaceSharedPropsOnServer()` to update them (as with pluginProps, you should get copy first, update the copy, then set them back to that copy so you don't accidentally remove some other plugin's props). |
| <span class="nw cb">`sunDelta`</span>         | integer                                               | Yes      | The number of seconds before (negative) or after (positive) sunrise or sunset when the schedule should be executed (zero if no offset).                                                                                                                                                                                                                                                                                                                                                                                                |
| <span class="nw cb">`suppressLogging`</span>  | boolean                                               | Yes      | true if Indigo should skip logging the schedule's execution in the event log, otherwise false.                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| <span class="nw cb">`timeType`</span>         | <span class="nw cb">`indigo.kTimeType`</span>         | Yes      | Absolute / Sunrise / Sunset / Countdown depending on the date and time options selected.                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| <span class="nw cb">`upload`</span>           | boolean                                               | Yes      | true if IndigoServer should attempt to upload this schedule to the interface.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

### Commands (indigo.schedule.*) { .ref-head-no-code }

#### Delete { .ref-head-no-code }

Delete the specified schedule.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.schedule.delete(123)`</span>

<span class="ca">**Parameters**</span>

| Parameter        | Required | Type    | Description                              |
|------------------|----------|---------|------------------------------------------|
| direct parameter | Yes      | integer | id or instance of the schedule to delete |

#### Duplicate { .ref-head-no-code }

Duplicate the specified schedule regardless of the type. This method returns a copy of the new schedule.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.schedule.duplicate(123, duplicateName="my duplicate name")`</span>

<span class="ca">**Parameters**</span>

| Parameter                                  | Required | Type    | Description                                 |
|--------------------------------------------|----------|---------|---------------------------------------------|
| direct parameter                           | Yes      | integer | id or instance of the schedule to duplicate |
| <span class="nw cb">`duplicateName`</span> | No       | string  | name for the newly duplicated schedule      |

#### Enable { .ref-head-no-code }

Enables or disables the specified schedule.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.schedule.enable(123, value=True, delay=0, duration=0)`</span>

<span class="ca">**Parameters**</span>

| Parameter                             | Required | Type    | Description                                                         |
|---------------------------------------|----------|---------|---------------------------------------------------------------------|
| direct parameter                      | Yes      | integer | id or instance of the schedule to enable/disable                    |
| <span class="nw cb">`value`</span>    | Yes      | boolean | set to True to enable the schedule, False to disable the control    |
| <span class="nw cb">`delay`</span>    | No       | integer | the number of seconds to wait before executing the command          |
| <span class="nw cb">`duration`</span> | No       | integer | the number of seconds to wait before reverting the executed command |

#### Execute { .ref-head-no-code }

Execute the specified schedule.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.schedule.execute(123, ignoreConditions=False, schedule_data=None)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                     | Required | Type    | Description                                                                                                |
|-----------------------------------------------|----------|---------|------------------------------------------------------------------------------------------------------------|
| direct parameter                              | Yes      | integer | id or instance of the schedule to execute                                                                  |
| <span class="nw cb">`ignoreConditions`</span> | No       | boolean | True will execute the schedule regardless of the conditions set within the schedule, False (the default) will honor them |
| <span class="nw cb">`schedule_data`</span>    | No       | object  | an `indigo.Dict` to be passed to the schedule before it is executed                                        |

A note on `schedule_data` - Indigo will automatically add a `source` key to your dictionary to represent where the action execution came from:

- "server" if it's something generated from the server itself (schedule execution, built-in trigger, etc.)
- "python" if it's something that comes through IPH that doesn't already have a source attached (scripts, plugins)
- "api-http" if it came from the HTTP API and there wasn't already an included "source"
- "api-websocket" if it came from the websocket API and there wasn't already an included "source"

However, if you include a `source` key in your `schedule_data`, we will not overwrite it, we'll just pass through whatever your value is.

For example, if you

```python
my_dict = indigo.Dict()
my_dict["foo"] = "bar"
indigo.schedule.execute(324976872, schedule_data=my_dict)
```

The schedule you executed will receive something like this:
```json
{"event-indigo-id": 324976872, "event-type": "Schedule", "foo": "bar", "source": "python", "timestamp": "1970-01-01T09:09:40"}
```

#### Get Dependencies { .ref-head-no-code }

Get the dependencies of the specified schedule. Returns an `indigo.Dict` object that contains the schedule's dependencies. Will return an empty `indigo.Dict` object if the schedule has no dependencies.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.schedule.getDependencies(123)`</span>

<span class="ca">**Parameters**</span>

| Parameter        | Required | Type    | Description                    |
|------------------|----------|---------|--------------------------------|
| direct parameter | Yes      | integer | id or instance of the schedule |

#### Move to Folder { .ref-head-no-code }

Move the specified schedule to the designated folder.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.schedule.moveToFolder(123, value=987)`</span>

<span class="ca">**Parameters**</span>

| Parameter                          | Required | Type    | Description                                          |
|------------------------------------|----------|---------|------------------------------------------------------|
| direct parameter                   | Yes      | integer | id or instance of the schedule                       |
| <span class="nw cb">`value`</span> | Yes      | integer | id or instance of the folder to move the schedule to |

#### Remove Delayed Actions { .ref-head-no-code }

Remove any outstanding delayed actions from the specified schedule.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.schedule.removeDelayedActions(123)`</span>

<span class="ca">**Parameters**</span>

| Parameter        | Required | Type    | Description                    |
|------------------|----------|---------|--------------------------------|
| direct parameter | Yes      | integer | id or instance of the schedule |
