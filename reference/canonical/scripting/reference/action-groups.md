<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/reference/action-groups/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Action Groups

The following properties and commands are available with the Action Group object class.

## Class Properties { .ref-head-no-code }

| Property                                   | Type       | Writable | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|--------------------------------------------|------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`description`</span>   | string     | Yes      | description of the action group                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| <span class="nw cb">`folderId`</span>      | integer    | No       | unique ID of the folder this action group is in                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| <span class="nw cb">`id`</span>            | integer    | No       | a unique id of the action group, assigned on creation by IndigoServer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| <span class="nw cb">`name`</span>          | string     | Yes      | the unique name of the action group - no two action groups can have the same name                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| <span class="nw cb">`remoteDisplay`</span> | boolean    | No       | `True` if this action group is shown in remote clients, `False` otherwise                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| <span class="nw cb">`sharedProps`</span>   | dictionary | No       | **[API v2.3](https://www.indigodomo.com/indigo/api_release_notes/2.3/)**  : an `indigo.Dict()` representing the name/value pairs that are shared by all plugins. This is the property dictionary that you can edit via the Global Properties plugin, and your plugin may manage properties in this dictionary as well to add metadata to devices that your plugin can use for other purposes. Use `ag.replaceSharedPropsOnServer()` to update them (as with pluginProps, you should get copy first, update the copy, then set them back to that copy so you don't accidentally remove some other plugin's props). |

## Commands (indigo.actionGroup.*) { .ref-head-no-code }

The commands in this section are common to all action groups regardless of type.

### Delete { .ref-head-no-code }

Delete the specified action group.

<span class="ca">**Command Syntax Examples**</span>

```python
indigo.actionGroup.delete(123)
```

<span class="ca">**Parameters**</span>

| Parameter        | Required | Type    | Description                                  |
|------------------|----------|---------|----------------------------------------------|
| direct parameter | Yes      | integer | id or instance of the action group to delete |

### Display In Remote UI { .ref-head-no-code }

This command will show or hide the action group in remote clients.

<span class="ca">**Command Syntax Examples**</span>

```python
indigo.actionGroup.displayInRemoteUI(123, value=True)
indigo.actionGroup.displayInRemoteUI(123, value=False)
```

<span class="ca">**Parameters**</span>

| Parameter                          | Required | Type    | Description                                           |
|------------------------------------|----------|---------|-------------------------------------------------------|
| direct parameter                   | No       | integer | id or instance of the action group                    |
| <span class="nw cb">`value`</span> | Yes      | boolean | `True` to show the action group or `False` to hide it |

### Duplicate { .ref-head-no-code }

Duplicate the specified action group. This method returns a copy of the new action group.

<span class="ca">**Command Syntax Examples**</span>

```python
indigo.actionGroup.duplicate(123, duplicateName="New Name")
```

<span class="ca">**Parameters**</span>

| Parameter                                  | Required | Type    | Description                                     |
|--------------------------------------------|----------|---------|-------------------------------------------------|
| direct parameter                           | Yes      | integer | id or instance of the action group to duplicate |
| <span class="nw cb">`duplicateName`</span> | No       | string  | name for the new action group trigger           |

### Execute { .ref-head-no-code }

Execute the specified action group.

<span class="ca">**Command Syntax Examples**</span>

```python
indigo.actionGroup.execute(123, event_data=some_dict)
```

<span class="ca">**Parameters**</span>

| Parameter        | Required | Type    | Description                                                                                  |
|------------------|----------|---------|----------------------------------------------------------------------------------------------|
| direct parameter | Yes      | integer | id or instance of the action group to execute                                                |
| event_data       | No       | dict    | a dictionary instance that will get passed to all actions in the action group for processing |

A note on `event_data` - Indigo will automatically add a `source` key to your dictionary to represent where the action execution came from:

- "server" if it's something generated from the server itself (schedule execution, built-in trigger, etc.)
- "python" if it's something that comes through IPH that doesn't already have a source attached (scripts, plugins)
- "api-http" if it came from the HTTP API and there wasn't already an included "source"
- "api-websocket" if it came from the websocket API and there wasn't already an included "source"

However, if you include a `source` key in your `event_data`, we will not overwrite it, we'll just pass through whatever your value is.

### Get Dependencies { .ref-head-no-code }

Use this command to retrieve all the Indigo objects dependent on the action group. The command will return an `indigo.Dict` containing all the dependencies.

<span class="ca">**Command Syntax Examples**</span>

```python
indigo.actionGroup.getDependencies(123)
```

<span class="ca">**Parameters**</span>

| Parameter        | Required | Type    | Description                        |
|------------------|----------|---------|------------------------------------|
| direct parameter | Yes      | integer | id or instance of the action group |

### Move To Folder { .ref-head-no-code }

Use this command to move the action group to a different folder. You can get a list of folder id’s by using indigo.actionGroups.folders, which will return a dictionary. The key to the dictionary is the ID, the value is the folder name.

<span class="ca">**Command Syntax Examples**</span>

```python
indigo.actionGroup.moveToFolder(123, value=987)
```

<span class="ca">**Parameters**</span>

| Parameter                          | Required | Type    | Description                                              |
|------------------------------------|----------|---------|----------------------------------------------------------|
| direct parameter                   | Yes      | integer | id or instance of the action group                       |
| <span class="nw cb">`value`</span> | Yes      | integer | id or instance of the folder to move the action group to |
