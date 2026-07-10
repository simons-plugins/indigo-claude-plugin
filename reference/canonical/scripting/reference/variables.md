<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/reference/variables/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Variables

The variable class represents an Indigo variable.

## Class Properties { .ref-head-no-code }

| Property                                   | Type       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|--------------------------------------------|------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`id`</span>            | integer    | the unique id of the variable, assigned on creation by IndigoServer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| <span class="nw cb">`folderId`</span>      | integer    | the unique id of the folder this variable is in (0 if it's not in a folder) - use `moveToFolder()` method to change                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| <span class="nw cb">`name`</span>          | string     | the name of the variable - no two variables can have the same name and the name cannot contain whitespace                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| <span class="nw cb">`readOnly`</span>      | string     | is the variable read only - currently only the `isDaylight` variable is read only                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| <span class="nw cb">`remoteDisplay`</span> | boolean    | should this variable be displayed in remote clients (IWS, Indigo Touch, etc)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| <span class="nw cb">`sharedProps`</span>   | dictionary | **[API v2.3](https://www.indigodomo.com/indigo/api_release_notes/2.3/)**  : an `indigo.Dict()` representing the name/value pairs that are shared by all plugins. This is the property dictionary that you can edit via the Global Properties plugin, and your plugin may manage properties in this dictionary as well to add metadata to devices that your plugin can use for other purposes. Use `var.replaceSharedPropsOnServer()` to update them (as with pluginProps, you should get copy first, update the copy, then set them back to that copy so you don't accidentally remove some other plugin's props). |
| <span class="nw cb">`value`</span>         | string     | the Unicode string value of the variable                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

## Class Method { .ref-head-no-code }

The Variable class has a special method, `getValue(TYPE, default=VALUE)`, that you can call which will retrieve the variable value as the specified Python class. There are a couple of advantages to using this method. First, it won't throw an exception but will always return a value. Second, the Indigo server will do the conversion in the exact same way that it does type conversions when using variables in triggers and conditions. You can also optionally specify a default value if the value can't be successfully converted into the specified type. Here's a list of the valid types you can specify and what the default is if not specified:

| Type Literal | Type Returned | Default                                                                                                                                                                                                                                                                                 |
|--------------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| bool         | boolean       | `True` will be returned if the value is one of these: "true", "on", "yes", and "1". `False` will be returned if the value is one of these: "false", "off", "no", and "0". If no default value is specified and the value can't be successfully converted, the method will return False. |
| int          | integer       | An integer object will be returned if the value is an integer number or a float/decimal. In the latter case, the number will be rounded to the nearest integer. If no default value is specified and the value can't be converted, the method will return 0                             |
| float        | float         | A float object will be returned if the value is a float/decimal or an integer. If no default value is specified and the value can't be converted, the method will return 0.0                                                                                                            |

Remember that accessing the `value` property of a variable object (`var.value`) will return a Unicode string object so you don't need a conversion for that.

<span class="ca">**Class Method Examples**</span>

```python
# Get a variable
var = indigo.variables[123456]

# Getting the Unicode string value (no conversion call necessary, just access the property)
unicodeValue = var.value

# Getting the boolean value
intValue = var.getValue(bool)   # False if it can't be converted
intValue = var.getValue(int, default=True) # True if it can't be converted

# Getting the integer value
intValue = var.getValue(int)   # 0 if it can't be converted
intValue = var.getValue(int, default=10) # 10 if it can't be converted

# Getting the float value
intValue = var.getValue(float)   # 0 if it can't be converted
intValue = var.getValue(float, default=98.6) # 98.6 if it can't be converted

# Getting the name of the variable
varName = var.name

# Getting the id of the variable
varId = var.id
```

## Commands (indigo.variable.*) { .ref-head-no-code }

### Create { .ref-head-no-code }

Create a variable. This method returns a **copy** of the newly created variable.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.variable.create("VariableName", value="Var Value", folder=843920)`</span>

<span class="ca">**Parameters**</span>

| Parameter                           | Required | Type    | Description                                                                                       |
|-------------------------------------|----------|---------|---------------------------------------------------------------------------------------------------|
| direct parameter                    | Yes      | string  | the name of the variable                                                                          |
| <span class="nw cb">`value`</span>  | No       | string  | the value of the variable                                                                         |
| <span class="nw cb">`folder`</span> | No       | integer | id or instance of the folder in which to put the newly created device - defaults to 0 (no folder) |

### Delete { .ref-head-no-code }

Delete the specified variable.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.variable.delete(123)`</span>

<span class="ca">**Parameters**</span>

| Parameter        | Required | Type    | Description                              |
|------------------|----------|---------|------------------------------------------|
| direct parameter | Yes      | integer | id or instance of the variable to delete |

### Duplicate { .ref-head-no-code }

Duplicate the specified variable. This method returns a copy of the new variable.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.variable.duplicate(123, duplicateName="NewName")`</span>

<span class="ca">**Parameters**</span>

| Parameter                                  | Required | Type    | Description                                 |
|--------------------------------------------|----------|---------|---------------------------------------------|
| direct parameter                           | Yes      | integer | id or instance of the variable to duplicate |
| <span class="nw cb">`duplicateName`</span> | No       | string  | name for the newly duplicated variable      |

### Get Dependencies { .ref-head-no-code }

Return an indigo.Dict with all the dependencies on this variable.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.variable.getDependencies(123)`</span>

<span class="ca">**Parameters**</span>

| Parameter        | Required | Type    | Description                                                 |
|------------------|----------|---------|-------------------------------------------------------------|
| direct parameter | Yes      | integer | id or instance of the variable to get the dependencies for. |

The dictionary will look something like this:

```python
>>> print(indigo.variable.getDependencies(91776575))
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

### Move To Folder { .ref-head-no-code }

Use this command to move the variable to a different folder.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.variable.moveToFolder(123, value=987)`</span>

<span class="ca">**Parameters**</span>

| Parameter                          | Required | Type    | Description                                          |
|------------------------------------|----------|---------|------------------------------------------------------|
| direct parameter                   | Yes      | integer | id or instance of the variable                       |
| <span class="nw cb">`value`</span> | Yes      | integer | id or instance of the folder to move the variable to |

### Set Remote Display { .ref-head-no-code }

Use this command to set the remote display flag for the folder.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.variable.displayInRemoteUI(123, value=True)`</span>

<span class="ca">**Parameters**</span>

| Parameter                          | Required | Type    | Description                                                                |
|------------------------------------|----------|---------|----------------------------------------------------------------------------|
| direct parameter                   | Yes      | integer | id or instance of the variable                                             |
| <span class="nw cb">`value`</span> | Yes      | boolean | True to display the variable on remote user interfaces or False to hide it |

### Update Value { .ref-head-no-code }

Use this command to set the value of a variable without having to get a local copy first.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.variable.updateValue(123, value="New Value")`</span>

<span class="ca">**Parameters**</span>

| Parameter                          | Required | Type    | Description                    |
|------------------------------------|----------|---------|--------------------------------|
| direct parameter                   | Yes      | integer | id or instance of the variable |
| <span class="nw cb">`value`</span> | Yes      | string  | the new value for the variable |

<span class="ca">**Examples**</span>

```python
# Create a new variable
newVar = indigo.variable.create("fooName", "fooMonster")

# Updating value via command space function:
indigo.variable.updateValue(newVar, "asleep789")
newVar.refreshFromServer()  # refresh needed to update local's .value

# changing name property
newVar.name = "goodName"
newVar.replaceOnServer()

newVar.name = "bad name"  # should throw because of space character

# changing name and values properties:
newVar.name = "goodName2"
newVar.value = "searchingForWaldo"
newVar.replaceOnServer()

indigo.variable.delete(newVar)

# Getting a variable using its ID
someVar = indigo.variables[123]

# Getting a variable using its name
someVar = indigo.variables["MyVarName"]
```
