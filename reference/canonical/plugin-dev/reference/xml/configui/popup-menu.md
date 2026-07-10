<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/reference/xml/configui/popup-menu/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Popup Menu { .ref-head-no-code #config-pop-up-menu }

Popup menu fields are used to select a single fixed value from a list with no inherent hierarchy. The following table describes the attributes that are available for menu fields.

![Configuration UI Menu Image](../../../../images/configui_menu.png)

<span class="ca">**Attributes**</span>  

| Attribute                                                | Required | API Version | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|----------------------------------------------------------|----------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`alwaysUseInDialogHeightCalc`</span> | No       | 1.0         | For dialogs that contain hidden controls (see `visibleBindingId` and `visibleBindingValue` below), setting this attribute to `true` will force Indigo to take hidden controls into account when initially sizing the dialog box. This is useful when hidden controls become visible based on user input.                                                                                                                                                                                                                                                                                                                                                           |
| <span class="nw cb">`defaultValue`</span>                | No       | 1.0 (1.9)   | You can enter a default value here. The value must be one of the values from the List element described below.<br><br><span class="dw-color-green">API v1.9</span>: If you specify a default value of "" (empty string) and there is no matching option, then the first menu item will be selected when the dialog is first run. This way you can avoid the user seeing "- no selection -" at the bottom of the menu.                                                                                                                                                                                                                                              |
| <span class="nw cb">`enabledBindingId`</span>            | No       | 1.0 (1.9)   | If you want to conditionally enable/disable this field based on the value of a checkbox, set this value to the id of that field.<br><br><span class="dw-color-green">API v1.9</span>: You can also bind to a list field and this field will only be enabled if something is selected in the list.                                                                                                                                                                                                                                                                                                                                                                  |
| <span class="nw cb">`enabledBindingNegate`</span>        | No       | 1.9         | Set this to "true" to negate the binding. So if the target binding field’s value is true then the binding will be false.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| <span class="nw cb">`hidden`</span>                      | No       | 1.0         | If this attribute is set to "true" then the field will never be displayed regardless of what other options you have set for it. It’s useful if you need to contain some kind of state variables for the dialog that are controlled by button presses rather than controlled directly by the user.                                                                                                                                                                                                                                                                                                                                                                  |
| <span class="nw cb">`id`</span>                          | Yes      | 1.0         | This is a unique identifier for this Field within the context of this ConfigUI element. It must be alphanumeric (and may contain underscores) and must begin with an alphabetic character.                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| <span class="nw cb">`readonly`</span>                    | No       | 1.0         | This attribute will make the field readonly - useful to show the user data that changes in some other way rather than being manipulated directly by the user.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| <span class="nw cb">`tooltip`</span>                     | No       | 1.0         | Unfortunately, enabled menus won’t show tooltips (Cocoa limitation), so your tooltip should probably tell the user why it’s disabled (since that’s the only time it’ll show) if the field is ever disabled.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| <span class="nw cb">`type`</span>                        | Yes      | 1.0         | This must be "menu".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| <span class="nw cb">`visibleBindingId`</span>            | No       | 1.0         | If you want to conditionally show/hide this field based on the value of another field, set this value to the id of another field. If you set this, you must also include a visibleBindingValue                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| <span class="nw cb">`visibleBindingValue`</span>         | No       | 1.0         | If you specify a visibleBindingId, you must specify the value(s) here. For instance, if you are binding to a checkbox, setting this to `false` will mean the menu field is visible only when the checkbox is unchecked, and a `true` means the opposite. To make the field dependent on a list or another menu, set this value to a comma separated list of option values ("item1, item2"). You can even bind it to the value in a text field, but that’s probably of limited use. **Note**: the string comparison is a contains - so if any option contains the specified string it will match. This offers some extra flexibility in defining dependency groups. |

```xml
<Field type="menu" id="simplePopUpButton" defaultValue="item2">
	<Label>Popup Menu:</Label>
	<List>
		<Option value="item1">Item 1</Option>
		<Option value="item2">Item 2</Option>
		<Option value="item3">Item 3</Option>
	</List>
</Field>
```

Static popup menu fields contain two elements. The first is the same `Label` element that every field has (except `Separator` which we’ll talk about later). The other is a `List` element which defines the menu items in your popup menu field. The `List` element contains multiple `Option` elements, each of which have a required `value` attribute. The `value` attribute will be passed back to your plugin when the dialog is validated; it may not contain comma characters. The text inside the `Option` element is what is displayed for each menu item in the user interface.

Like [button fields](button.md), you can specify a `CallbackMethod` element in your field definition:

```xml
<Field type="menu" id="simplePopUpButton" defaultValue="item2">
	<Label>Popup Menu:</Label>
	<List>
		<Option value="item1">Item 1</Option>
		<Option value="item2">Item 2</Option>
		<Option value="item3">Item 3</Option>
	</List>
	<CallbackMethod>menuChanged</CallbackMethod>
</Field>
```

This method will be called every time the user changes the menu. The method in your plugin.py file should look something like this:

```python
def menuChanged(self, valuesDict, typeId, devId):
    # do whatever you need to here
    #   typeId is the device type specified in the Devices.xml
    #   devId is the device ID - 0 if it's a new device
    return valuesDict
```

Depending on which object type (plugin config, device, trigger, action, etc.) the dialog is being called for. This will allow you to adjust other fields in the valuesDict based on what's selected in the menu field. For instance, if you've selected a device type, you may decide to alter some hidden fields so that other fields are shown/and hidden. Used in combination with [Dynamic Lists](dynamic-lists.md), you may also repopulate other lists with more appropriate values.

You may also specify a menu dynamically at runtime - that is, when the UI is shown, the client will call into your plugin to get the menu items. This will allow you to dynamically adjust the menu items every time the UI comes up. You can also specify some built-in dynamic items that the IndigoServer will provide automatically for you. See the [Dynamic Lists](dynamic-lists.md) section below for details.

[Back to Configuration Dialogs](index.md)
