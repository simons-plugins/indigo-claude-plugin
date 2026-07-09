<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/reference/device-subclasses/sprinkler/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# SprinklerDevice { .ref-head-no-code }

Sprinkler devices generally have some number of sprinkler zones.

## Class Properties { .ref-head-no-code }

| Property                                                         | Type            | Writable | [Min API](https://www.indigodomo.com/indigo/api_version_chart.html) | Description                                                                                                                                                                                                                         |
|------------------------------------------------------------------|-----------------|----------|---------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`activeZone`</span>                          | integer         | No       | 1.0                                   | the 1-based index of the active zone (None=all zones off, 1=zone 1, 2=zone 2, ...). Note this property has undergone changes in name (previously called activeZoneIndex) as well as semantics (previously the index being 0-based). |
| <span class="nw cb">`zoneCount`</span>                           | integer         | No       | 1.0                                   | the number of zones available for this sprinkler                                                                                                                                                                                    |
| <span class="nw cb">`zoneEnableList`</span>                      | list of boolean | No       | 1.13                                  | list of booleans, starting at zone 1 through zone [`zoneCount`], that specify if a given zone is enabled (has a maximum zone duration > 0).                                                                                         |
| <span class="nw cb">`zoneNames`</span>                           | list of string  | No       | 1.0                                   | list of zone names, starting at zone 1 through zone [`zoneCount`]. You must include `zoneCount` strings in the list.                                                                                                                |
| <span class="nw cb">`zoneMaxDurations`</span>                    | list of floats  | No       | 1.0                                   | list of zone durations in minutes, starting at zone 1 through zone [`zoneCount`]. You must include `zoneCount` integers in the list.                                                                                                |
| <span class="nw cb">`zoneScheduledDurations`</span>              | list of floats  | No       | 1.0                                   | list of currently active zone durations in minutes if a schedule is running (empty list if no schedule is running), starts at zone 1 through zone [`zoneCount`]                                                                     |
| <span class="nw cb">`pausedScheduleZone`</span>                  | integer         | No       | 1.16                                  | the 1-based index of the paused sprinkler zone index (None=schedule not paused, 1=zone 1 paused, 2=zone 2 paused, ...).                                                                                                             |
| <span class="nw cb">`pausedScheduleRemainingZoneDuration`</span> | float           | No       | 1.16                                  | the paused sprinkler zone duration in minutes (None if schedule not paused)                                                                                                                                                         |

## Device States { .ref-head-no-code }

These are the states provided by this device type and accessible through the `dev.states` dictionary. They are read-only.

| State ID                                   | Type    | Property Name | Notes                                                                                                   |
|--------------------------------------------|---------|---------------|---------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`activeZone`</span>    | integer | `activeZone`  | the number of the active zone, 0 if off (1=zone 1, 2=zone 2, etc)                                       |
| <span class="nw cb">`activeZone.ui`</span> | string  | N/A           | the active zone as a human readable string                                                              |
| <span class="nw cb">`zone#`</span>         | boolean | N/A           | replace the # with the zone number (up to `dev.zoneCount`) to return whether the zone is running or not |

## Commands (indigo.sprinkler.*) { .ref-head-no-code }

### Next Zone { .ref-head-no-code }

Set the sprinkler to the next zone, and turn off if it’s the last defined zone.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.sprinkler.nextZone(123)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                  |
|------------------------------------------|----------|---------|------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer | id or instance of the device |

### Pause Schedule { .ref-head-no-code }

Pause the current sprinkler schedule but keep it active so it can be resumed.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.sprinkler.pause(123)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                  |
|------------------------------------------|----------|---------|------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer | id or instance of the device |

### Previous Zone { .ref-head-no-code }

Set the sprinkler to the previous zone, and turn off if it’s the first defined zone.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.sprinkler.previousZone(123)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                  |
|------------------------------------------|----------|---------|------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer | id or instance of the device |

### Resume Schedule { .ref-head-no-code }

Resume the current sprinkler schedule.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.sprinkler.resume(123)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                  |
|------------------------------------------|----------|---------|------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer | id or instance of the device |

### Run Schedule { .ref-head-no-code }

Run a sprinkler schedule.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.sprinkler.run(123, schedule=[10,15,8, 0, 0, 0, 0, 0])`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type          | Description                                                                                                                                               |
|------------------------------------------|----------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer       | id or instance of the device                                                                                                                              |
| <span class="nw cb">`schedule`</span>    | Yes      | list of reals | list of reals representing the number of minutes to run for each zone - the list must have [`zoneCount`] elements, with 0 for any zone that shouldn’t run |

### Stop Schedule { .ref-head-no-code }

Stop the current sprinkler schedule and clear it.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.sprinkler.stop(123)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                  |
|------------------------------------------|----------|---------|------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer | id or instance of the device |

### Set Active Zone { .ref-head-no-code }

<span class="dw-color-blue">API v1.12+ only:</span> Turn on a specific zone.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.sprinkler.setActiveZone(123, index=2)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                          |
|------------------------------------------|----------|---------|--------------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer | id or instance of the device         |
| <span class="nw cb">`index`</span>       | Yes      | integer | 1-based index of the zone to turn on |

<span class="ca">**Examples**</span>

```python

# run schedule

indigo.sprinkler.run(123,
    schedule=[10,15,8, 0, 0, 0, 0, 0])
```
