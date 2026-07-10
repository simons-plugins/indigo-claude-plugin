<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/reference/xml/configui/button/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Button { .ref-head-no-code #config-button }

Button fields allow your user to communicate with your plugin during configuration. The following table describes the attributes that are available and the XML elements that are required for button fields.

![Configuration UI Button Image](../../../../images/configui_button.png)

<span class="ca">**Attributes**</span>

| Attribute                                                | Required | API Version | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|----------------------------------------------------------|----------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`alwaysUseInDialogHeightCalc`</span> | No       | 1.0         | For dialogs that contain hidden controls (see `visibleBindingId` and `visibleBindingValue` below), setting this attribute to `true` will force Indigo to take hidden controls into account when initially sizing the dialog box. This is useful when hidden controls become visible based on user input.                                                                                                                                                                                                                                                                                                                                                           |
| <span class="nw cb">`enabledBindingId`</span>            | No       | 1.0 (1.9)   | If you want to conditionally enable/disable this field based on the value of a checkbox, set this value to the id of that field.<br><br><span class="dw-color-green">API v1.9</span>: You can also bind to a list field and this field will only be enabled if something is selected in the list.                                                                                                                                                                                                                                                                                                                                                                  |
| <span class="nw cb">`enabledBindingNegate`</span>        | No       | 1.9         | Set this to "true" to negate the binding. So if the target binding field's value is true then the binding will be false.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| <span class="nw cb">`id`</span>                          | Yes      | 1.0         | This is a unique identifier for this Field within the context of this `ConfigUI` element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| <span class="nw cb">`type`</span>                        | Yes      | 1.0         | This must be `button`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| <span class="nw cb">`visibleBindingId`</span>            | No       | 1.0         | If you want to conditionally show/hide this field based on the value of another field, set this value to the `id` of another field. If you set this, you must also include a `visibleBindingValue`                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| <span class="nw cb">`visibleBindingValue`</span>         | No       | 1.0         | If you specify a `visibleBindingId`, you must specify the value(s) here. For instance, if you are binding to a checkbox, setting this to `false` will mean the menu field is visible only when the checkbox is unchecked, and a `true` means the opposite. To make the field dependent on another list or menu, set this value to a comma separated list of option values (`item1, item2`). You can even bind it to the value in a text field, but that’s probably of limited use. **Note**: the string comparison is a contains - so if any option contains the specified string it will match. This offers some extra flexibility in defining dependency groups. |
| Element                                                  |          |             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| <span class="nw cb">`CallbackMethod`</span>              | Yes      | 1.0         | The `CallbackMethod` is the plugin method that you want to execute when the button is pressed. Several elements will be passed to the method when it's called: the dialog's configuration values (`valuesDict`), the type of device (`typeId`), and the device ID (`devId`). The 'CallbackMethod` field type is read-only, which means that you can't have an error message attached to it from a validation method or a button method (see below for details).                                                                                                                                                                                                    |
| <span class="nw cb">`title`</span>                       | Yes      | 1.0         | The `title` is the text that will appear on the button itself.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

```xml
<Field id="exampleButton"
       type="button"
       tooltip="Click this button to do something cool"
       visibleBindingId="checkboxSample"
       visibleBindingValue="1">
    <Label>Visible button's label:</Label>
    <Title>Visible Button Title</Title>
    <CallbackMethod>ConfigButtonPressed</CallbackMethod>
</Field>
```

As an example, if your plugin needs to start listening for a specific network broadcast packet that a device sends when it’s in a special discover mode, then you probably only want to listen for that packet when the user actually makes the device start to broadcast. So, as in the example device dialog above, you instruct the user to press a button on the device, then have them click the button. This would give your plugin an opportunity to do something while the configuration dialog was up and return the results to the dialog.

The process flow is:

1. The user clicks the button.
1. A dictionary containing all the values of the fields in the dialog are sent to the method that you identify in the `<CallbackMethod>` element.
1. Your plugin can then do whatever it needs to, and it returns a dictionary back to the dialog containing any field changes.
1. The dialog will update the values (and enable/visible bindings appropriately) for any changed fields.

Each button's method signature will match the parameters that are used in the [validation methods](validation.md#validation-methods) described below. For instance, if you specify a method called "beginPairing" in a button field of the `<ConfigUI>` XML for a device like this:

```xml
<Device type="custom" id="mediaserver">
    <Name>Music Server</Name>
    <ConfigUI>
        <Field id="pair" type="button">
            <Label>Click to begin pairing:</Label>
            <Title>Begin Pairing</Title>
            <CallbackMethod>beginPairing</CallbackMethod>
        </Field>
<!-- SNIP -->
    </ConfigUI>
</Device>
```

The method for that event in your `plugin.py` file would look something like this:

```python
def beginPairing(self, valuesDict, typeId, devId):
    # do whatever you need to here
    #   typeId is the device type specified in the Devices.xml
    #   devId is the device ID - 0 if it's a new device
    return valuesDict
```

Note that the parameters match those specified below for the `validateDeviceConfigUi` method.

[Back to Configuration Dialogs](index.md)
