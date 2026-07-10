<!-- GENERATED from https://docs.indigodomo.com/2025.2/user/automation/substitutions/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Substitutions

!!! abstract "In this guide"
    How to use Indigo's substitution syntax to embed dynamic values — device states, variable contents, timestamps, and trigger event data — directly into action parameters, URLs, and plugin fields. Covers the substitution string format for each object type with examples, and notes where substitutions are and are not supported.

One of Indigo's powerful features is substitutions. Substitutions are special codes that are used to reference other Indigo objects -- like devices, variables, and events -- to get values related to them. For example, you might use a variable substitution to get the current value of the variable you're referencing. All substitution expressions have a similar format:

| Object | Substitution String | Example | Target |
| --- | --- | --- | --- |
| Devices | %%d:DEVICEID:STATEID%% | %%d:12345678:onOffState%% | the current onOffState of device 12345678 |
| Variables | %%v:VARIABLEID%% | %%v:234566789%% | the current value of variable 234566789 |
| Timestamps | %%t:"FORMATSTRING"%% | %%t:"%Y-%M-%D %H:%M"%% | the current time based on the provided *`datetime`* format specifier *`"%Y-%M-%D %H:%M"`* |
| Events | %%e:"PATH"%% | %%e:"a-list.[2].dict-in-list"%% | replaces the specified path string *`"a-list.[2].dict-in-list"`*with the corresponding value from the related *`event_data`* |

Substitutions are used extensively throughout Indigo and Indigo Plugins. For example, you can use a device or variable substitution as a part of a Control Page Refreshing URL input like this: *`http:*www.example.com/images/%%v:2345678%%.jpg`* which will substitute the current value of variable 2345678 as the image filename. 

!!! note
    While available in a wide array of instances, substitutions are not universally supported. You should confirm that substitutions are supported in each instance before attempting to use them.

## Device Substitutions
Device substitutions allow you to reference a particular state's current value of the target device. Device states can have different value types -- like strings, numbers, booleans, etc. -- so it's important to ensure that the substitution will return a value type appropriate to your use case.

| Substitution String | Example | Target |
| --- | --- | --- |
| %%d:DEVICEID:STATEID%% | %%d:12345678:onOffState%% | the current onOffState of device 12345678 |
| Example | Result |  |
| %%d:12345678:brightnessLevel%% | 100 (integer) |  |
| %%d:12345678:onOffState%% | on (on/off boolean) |  |
| %%d:12345678:hvacFanModeIsAuto%% | true (boolean) |  |


## Event Substitutions
Event substitutions allow you to reference a particular data element of an event-data payload. Event substitutions are somewhat of a special case and have a [separate page dedicated to them](../../scripting/reference/event-data-paths.md).

| Substitution String | Example | Target |
| --- | --- | --- |
| %%e:"PATH"%% | %%e:"a-list[2].dict-in-list"%% | replaces the specified path string *`"a-list[2].dict-in-list"`*with the corresponding value from the related *`event_data`* |


## Plugin Substitutions
Many Indigo plugins support substitutions-- plugin developers are encouraged to make it clear where substitutions are permitted and to explain how they're used in the plugin's documentation.


## Timestamp Substitutions
Timestamp substitutions allow you to reference the current date/time based on the provided format specifier. There is a considerable number of online resources that explain the various datetime format specifiers. Do a search for "python datetime format specifiers" (there are some differences between programming languages), so be sure to search for ***python*** specifiers.

| Substitution String | Example | Target |
| --- | --- | --- |
| %%t:"FORMATSTRING"%% | %%t:"%Y-%M-%D %H:%M"%% | the current time based on the provided *`datetime`* format specifier *`"%Y-%M-%D %H:%M"`* |
| Example | Result |  |
| %%t:"%Y-%m-%d %H:%M"%% | "2025-10-22 13:03" |  |
| %%t:"%Y-%m-%d"%% | "2025-10-22" |  |
| %%t:"%H:%M:%S"%% | "13:03:49" |  |


## Variable Substitutions
Variable substitutions allow you to reference the current value of the target variable. Since variables values are always strings, a variable substitution will always return a string.

| Substitution String | Example | Target |
| --- | --- | --- |
| %%v:VARIABLEID%% | %%v:234566789%% | the current value of variable 234566789 |
| Example | Result |  |
| %%v:12345678%% | "My variable value" |  |
| %%v:2345678%% | "Another value" |  |
