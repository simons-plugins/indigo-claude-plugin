<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/reference/folders/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Folders

The folder class represents a folder in the various Indigo user interfaces (Mac client, Indigo Touch, web, etc.).

<span class="ca">**Class Properties**</span>

| Property                                   | Type    | Description                                                                                                  |
|--------------------------------------------|---------|--------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`id`</span>            | integer | the unique id of the folder, assigned on creation by IndigoServer                                            |
| <span class="nw cb">`name`</span>          | string  | the name of the folder - no two folders in the same namespace (i.e. `indigo.devices`) can have the same name |
| <span class="nw cb">`remoteDisplay`</span> | boolean | should this folder be displayed in remote clients (IWS, Indigo Touch, etc)                                   |

## Commands (indigo.*.folder.*) { .ref-head-no-code }

The commands to manipulate folders are within the object lists defined in the IOM Overview page (`indigo.devices.folder.*`, `indigo.variables.folder.*`, etc.)

### Create { .ref-head-no-code }

Create a folder. This method returns a **copy** of the newly created folder.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.variables.folder.create("Folder Name Here")`</span>

<span class="ca">**Parameters**</span>

| Parameter                         | Required | Type   | Description            |
|-----------------------------------|----------|--------|------------------------|
| <span class="nw cb">`name`</span> | Yes      | string | the name of the folder |

### Delete { .ref-head-no-code }

Delete the specified folder.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.devices.folder.delete(123, deleteAllChildren=True)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                      | Required | Type    | Description                                                                                                      |
|------------------------------------------------|----------|---------|------------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>       | Yes      | integer | id or instance of the folder to delete                                                                           |
| <span class="nw cb">`deleteAllChildren`</span> | No       | boolean | a boolean to specify whether all objects contained in the folder should be deleted as well - defaults to `False` |

### Duplicate { .ref-head-no-code }

Duplicate the specified folder. This method returns a copy of the new folder.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.controlPages.folder.duplicate(123, duplicateName="New Name")`</span>

<span class="ca">**Parameters**</span>

| Parameter                                  | Required | Type    | Description                               |
|--------------------------------------------|----------|---------|-------------------------------------------|
| <span class="nw">direct parameter</span>   | Yes      | integer | id or instance of the folder to duplicate |
| <span class="nw cb">`duplicateName`</span> | No       | string  | name for the newly duplicated folder      |

### Get ID { .ref-head-no-code }

Returns the ID of the named folder under the specified object type (device, trigger, etc.)

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.device.folders.getId("Some Folder Name")`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type   | Description                                       |
|------------------------------------------|----------|--------|---------------------------------------------------|
| <span class="nw">direct parameter</span> | Yes      | string | name of any folder for the specified object type. |

### Set Remote Display { .ref-head-no-code }

Use this command to set the remote display flag for the folder.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.devices.folder.displayInRemoteUI(123, value=True)`<br>
`indigo.schedules.folder.displayInRemoteUI(123, value=False)
`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                              |
|------------------------------------------|----------|---------|--------------------------------------------------------------------------|
| <span class="nw">direct parameter</span> | Yes      | integer | id or instance of the folder                                             |
| <span class="nw cb">`value`</span>       | Yes      | boolean | True to display the folder on remote user interfaces or False to hide it |

## Examples

```python
# create a new variable folder
newFolder = indigo.variables.folder.create("My New Variable Folder")

# test to see if a folder exists by Name
if "My New Variable Folder" in indigo.variables.folders:
    # should execute this because we just created it
    indigo.server.log("folder named 'My New Variable Folder' exists")

# test to see if a folder exists by ID
if newFolder.id in indigo.variables.folders:
    # should execute this because we just created it
    indigo.server.log("folder id " + newFolder.id + " exists")

# set the remote display flag on the folder immediately
indigo.variables.folder.displayInRemoteUI(newFolder, value=False)

# a ValueError exception with the text "NameNotUniqueError" is thrown if you try to
# create a folder with a name that already exists
try:
    indigo.variables.folder.create("My New Variable Folder")
except ValueError as e:
    if str(e) == "NameNotUniqueError":
        # should execute this because it's a dup name
        indigo.server.log("folder named 'My New Variable Folder' already exists")
    else:
        indigo.server.log("Some other error")

# NOTE - at this point, newFolder.remoteDisplay is still true (default for new folders)
# because we're still working with a copy. Refresh it to get it updated:
newFolder.refreshFromServer()

# change the name of a folder
newFolder.name="My Variable Folder"
newFolder.replaceOnServer()

# duplicate the folder
indigo.variables.folder.duplicate(newFolder, duplicateName="My Duplicate Folder")

# delete a folder
indigo.variables.folder.delete(newFolder)

#test to see if a folder doesn't exist using name
if "My New Variable Folder" not in indigo.variables.folders:
    # should execute this because we just deleted it
    indigo.server.log("folder named 'My New Variable Folder' does not exist on the server")

# test to see if a folder doesn't exist using ID (was deleted perhaps)
if newFolder.id not in indigo.variables.folders:
    # should execute this because we just deleted it
    indigo.server.log("folder id " + newFolder.id + " does not exist on the server")
```
