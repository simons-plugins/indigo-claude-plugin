<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/reference/xml/configui/validation/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Validation Methods { .ref-head-no-code #validation-methods }

When the user clicks on the save button, a validation method is automatically called with all the field/value pairs from your dialog. This table shows which method names are called based on the calling dialog type:

---

## <span class="ref-head ca">validateDeviceConfigUi()</span> { #validation-device-config-ui }

Validate the configuration settings of a device.

<span class="ca">**Method**</span> 

<span class="nw cb">`validateDeviceConfigUi(self, valuesDict, typeId, devId)`</span>
<span class="nw cb">`validate_device_config_ui(self, valuesDict, typeId, devId)`</span>

<span class="ca">**Parameters**</span>

| Parameter                           | Type                                  | Signature                                                                    |
|-------------------------------------|---------------------------------------|------------------------------------------------------------------------------|
| <span class="nw">`valuesDict`<span> | <span class="nw">`indigo.Dict`</span> | the dictionary of values currently specified in the dialog                   |
| <span class="nw">`typeId`</span>    | <span class="nw">`str`</span>         | device type specified in the `type` attribute                                |
| <span class="nw">`deviceId`</span>  | <span class="nw">`int`</span>         | the unique device ID for the device being edited (or 0 of it's a new device) |

<span class="ca">**Return**</span>

Returns one or more `indigo.Dict` objects (`valuesDict`, `errorMsgDict`)

--- 

## <span class="ref-head ca">validateEventConfigUi()</span> { #validation-event-config-ui }

Validate the configuration of an event.

<span class="ca">**Method**</span>

<span class="nw cb">`validateEventConfigUi(self, valuesDict, typeId, eventId)`</span>
<span class="nw cb">`validate_event_config_ui(self, valuesDict, typeId, eventId)`</span>

<span class="ca">**Parameters**</span>

| Parameter                            | Type                                  | Signature                                                                 |
|--------------------------------------|---------------------------------------|---------------------------------------------------------------------------|
| <span class="nw">`valuesDict`</span> | <span class="nw">`indigo.Dict`</span> | the dictionary of values currently specified in the dialog                |
| <span class="nw">`typeId`</span>     | <span class="nw">`str`</span>         | event type specified in the `type` attribute                              |
| <span class="nw">`eventId`</span>    | <span class="nw">`int`</span>         | the unique event ID for the event being edited (or 0 if it's a new event) |

<span class="ca">**Return**</span>

Returns one or more `indigo.Dict` objects (`valuesDict`, `errorMsgDict`)

---

## <span class="ref-head ca">validateActionConfigUi()</span> { #validation-action-config-ui }

Validate the configuration of an action.

<span class="ca">**Method**</span>

<span class="nw cb">`validateActionConfigUi(self, valuesDict, typeId, deviceId)`</span>
<span class="nw cb">`validate_action_config_ui(self, valuesDict, typeId, deviceId)`</span>

<span class="ca">**Parameters**</span>

| Parameter                            | Type                                  | Signature                                                                                                          |
|--------------------------------------|---------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| <span class="nw">`valuesDict`</span> | <span class="nw">`indigo.Dict`</span> | the dictionary of values currently specified in the dialog                                                         |
| <span class="nw">`typeId`</span>     | <span class="nw">`str`</span>         | action type specified in the `type` attribute                                                                      |
| <span class="nw">`deviceId`</span>   | <span class="nw">`int`</span>         | the unique device ID for the device the user selected for the action if you specify a `deviceFilter`               |

<span class="ca">**Return**</span>

Returns one or more `indigo.Dict` objects (`valuesDict`, `errorMsgDict`)

---

## <span class="ref-head ca">validatePrefsConfigUi()</span> { #validation-prefs-config-ui }

Validate a plugin's configuration settings.

<span class="ca">**Method**</span>

<span class="nw cb">`validatePrefsConfigUi(self, valuesDict)`</span>  
<span class="nw cb">`validate_prefs_config_ui(self, valuesDict)`</span>

<span class="ca">**Parameters**</span>

| Parameter                            | Type                                  | Signature                                                                      |
|--------------------------------------|---------------------------------------|--------------------------------------------------------------------------------|
| <span class="nw">`valuesDict`</span> | <span class="nw">`indigo.Dict`</span> | the dictionary of values currently specified in the dialog                     |

<span class="ca">**Return**</span>

Returns one or more `indigo.Dict` objects (`valuesDict`, `errorMsgDict`)

---

Before the dialog is dismissed, this method will be called with a dictionary containing all the fields in the dialog. In your validation method, you’d do whatever validation is necessary. If everything validates correctly, then just return `True`:

```python
def validateEventConfigUi(self, valuesDict, typeId, eventId):
    # Do your validation logic here
    return True
```

If you need to adjust the values, return the valuesDict with changes:

```python
def validateEventConfigUi(self, valuesDict, typeId, eventId):
    # Do your validation logic here
    valuesDict["someKey"] = someNewValue
    return (True, valuesDict)
```

If you have errors that the user must correct, then you’ll return 3 things:

1. `False`, to indicate that validation failed
1. The values dictionary (with or without any changes)
1. An error dictionary. The keys will be the fieldId and the value will be the error string. When the dialog receives this return, it will turn each field with an error red and add a tooltip to the label part of the field so the user can mouse over the label to see what’s wrong. <span class="dw-color-green">API v1.4+</span>: You can also add a special dictionary entry to your error message dictionary that will cause a sheet to drop down with the specified text. This will help the user identify what went wrong in the validation method. Just add a string with the key "showAlertText" to your error dictionary before return from your dialog.

```python
def validateEventConfigUi(self, valuesDict, typeId, eventId):
    # Do your validation logic here
    errorDict = indigo.Dict()
    errorDict["someKey"] = "The value of this field must be from 1 to 10"
    errorDict["showAlertText"] = "Some very descriptive message to your user that will help them solve the validation problem."
    valuesDict["someOtherKey"] = someNewValue
    return (False, valuesDict, errorDict)
```

If you don't define these methods, then the default behavior is to have the validation calls always return `True`.

## Using ValidationError { .ref-head-no-code #using-validationerror }

Building the error dictionary by hand works well for a field or two, but it gets tedious when you
have several fields to check. The [`indigo.utils.ValidationError`](../../../../scripting/reference/utils.md#validationerror)
exception is purpose-built for this: accumulate field errors as you validate, then convert its
`error_dict` into the dictionary the validation method returns. Because a `ValidationError` is
iterable, `dict()` turns it directly into the field/message pairs the dialog expects, and `str()`
produces a readable summary suitable for the `showAlertText` sheet.

```python
def validateDeviceConfigUi(self, valuesDict, typeId, devId):
    errors = indigo.utils.ValidationError("Device configuration is invalid")

    if not valuesDict.get("address"):
        errors.add_error("address", "You must enter an address.")
    if not indigo.utils.is_int(valuesDict.get("pollInterval", "")):
        errors.add_error("pollInterval", "Poll interval must be a whole number.")

    if errors.error_dict:
        # Turn the accumulated errors into the (False, valuesDict, errorsDict) the dialog expects.
        errorsDict = indigo.Dict(dict(errors))
        errorsDict["showAlertText"] = str(errors)
        return (False, valuesDict, errorsDict)

    return (True, valuesDict)
```

`ValidationError` can also be raised from deeper validation helpers (for example a function that
validates a JSON payload) and caught here, so the same validation logic can be shared between your
Config UI methods and your [HTTP request handlers](../../plugin-py/http-requests.md). See the
[ValidationError reference](../../../../scripting/reference/utils.md#validationerror) for its full
constructor, attributes, and methods.

## Validating Serial Port Fields { .ref-head-no-code #validation-serialport-config }

Because serialport fields are a bit special (they generate multiple visible fields), we've provided a helper method that you can use to make sure the user used the control correctly:

```python
def validateDeviceConfigUi(self, valuesDict, typeId, devId):
    errorsDict = indigo.Dict()
    self.validateSerialPortUi(valuesDict, errorsDict, u"devicePortFieldId")

    # Put other config UI validation here -- add errors to errorDict.

    if len(errorsDict) > 0:
        # Some UI fields are not valid, return corrected fields and error messages (client
        # will not let the dialog window close).
        return (False, valuesDict, errorsDict)

    # User choices look good, so return True (client will then close the dialog window).
    return (True, valuesDict)
```

Notice that at the top of the validation method after we define the errorsDict, we call `self.validateSerialPortUi()`. This method will look for the fields that make up the specified field ("devicePortFieldId" in this case). It will make sure that a valid serial port is selected if it's a physical connection or that the address field is formatted properly if it's one of the network connections. If not, it will automatically add the appropriate errors to the errorsDict and will attempt to correct any URL prefix errors ("socket:%%*%%" or "rfc2217:%%*%%"). You can then continue to validate the rest of the fields in your dialog and use the length check on errorsDict to see if there were any errors discovered. If so, return False along with both dicts. If it's empty, just return true with the valuesDict.

[Back to Configuration Dialogs](index.md)
