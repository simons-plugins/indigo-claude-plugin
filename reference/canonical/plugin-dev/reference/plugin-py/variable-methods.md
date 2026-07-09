<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/reference/plugin-py/variable-methods/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Variable Specific Methods { .ref-head-no-code }

## variableCreated() { .ref-head data-toc-label="variableCreated" }

This method will get called whenever a new variable is created. You can call the `indigo.variables.subscribeToChanges()` method to have the IndigoServer send all variable creation/update/deletion notifications. As with other change subscriptions, this should be used very sparingly since it's a lot of overhead both for your plugin and, more importantly, for the IndigoServer.

<span class="ca">**Method**</span>  

| Method                                                  | Required |
|---------------------------------------------------------|----------|
| <span class="nw cb">`variableCreated(self, var)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter                        | Description                                                            |
|----------------------------------|------------------------------------------------------------------------|
| <span class="nw cb">`var`</span> | an `indigo.Variable` object representing the variable that was created |

<span class="ca">**Return Value:**</span>

| Type | Description                          |
|------|--------------------------------------|
| None | This method does not return a value. |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span>

```python
def variableCreated(self, var):
    pass  # respond to the newly-created variable as needed
```

## variableDeleted() { .ref-head data-toc-label="variableDeleted" }

Complementary to the `variableCreated()` method described above, but signals variable deletes.

<span class="ca">**Method**</span>  

| Method Name                                             | Required |
|---------------------------------------------------------|----------|
| <span class="nw cb">`variableDeleted(self, var)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter                        | Description                                                            |
|----------------------------------|------------------------------------------------------------------------|
| <span class="nw cb">`var`</span> | an `indigo.Variable` object representing the variable that was deleted |

<span class="ca">**Return Value:**</span>

| Type | Description                          |
|------|--------------------------------------|
| None | This method does not return a value. |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span>

```python
def variableDeleted(self, var):
    pass  # respond to the deleted variable as needed
```

## variableUpdated() { .ref-head data-toc-label="variableUpdated" }

Complementary to the `variableCreated()` method described above, but signals variable updates. You'll get a copy of the old variable object as well as the new variable object.

<span class="ca">**Method**</span>  

| Method Name                                                         | Required |
|---------------------------------------------------------------------|----------|
| <span class="nw cb">`variableUpdated(self, origVar, newVar)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter                            | Description                                                             |
|--------------------------------------|-------------------------------------------------------------------------|
| <span class="nw cb">`origVar`</span> | an `indigo.Variable` object representing the variable before the change |
| <span class="nw cb">`newVar`</span>  | an `indigo.Variable` object representing the variable after the change  |

<span class="ca">**Return Value:**</span>

| Type | Description                          |
|------|--------------------------------------|
| None | This method does not return a value. |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span>

```python
def variableUpdated(self, origVar, newVar):
    pass  # respond to the updated variable as needed
```

That’s all the methods that will be called automatically by the host process. You may, of course, define many more methods. Some that you will probably want to define: methods to be called when a button is clicked in a `<ConfigUI>` dialog and methods called by `<MenuItems>` and `<Actions>`.

You can also define your own classes, either in `plugin.py` or more likely in separate files. We believe the plugin host process offers you a great deal of flexibility in how you construct your Python code.
