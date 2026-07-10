<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/reference/xml/menuitems/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# MenuItems.xml { .ref-head-no-code #menuitems-xml }

Your plugin may also define menu items, which will be shown at the bottom of your plugin’s sub-menu on the `Plugins` menu - they will be the last thing in the menu unless you also include scripts in the `Menu Items` folder of your plugin’s bundle. If there are scripts there, they will be last, and a separator will be placed between the menu items defined in this XML file and any script files.

Here’s a sample MenuItems.xml file:

```xml
<?xml version="1.0"?>
<MenuItems>
    <MenuItem id="menu1">
        <Name>Reset Interface</Name>
        <CallbackMethod>resetInterface</CallbackMethod>
    </MenuItem>
    <MenuItem id="menu2">
        <Name>Check for Updates</Name>
        <CallbackMethod>checkForUpdates</CallbackMethod>
    </MenuItem>
    <MenuItem id="menu3">
        <Name>Turn Off Light...</Name>
        <CallbackMethod>turnOffLight</CallbackMethod>
        <ButtonTitle>Turn Off</ButtonTitle>
        <ConfigUI>
		<Field id="targetDevice" type="menu">
			<Label>Light:</Label>
			<List class="self" filter="self.myLightType" method="getDynamicList" />
		</Field>
        </ConfigUI>
    </MenuItem>
    <!-- Added in v1.2 -->
    <MenuItem id="menu4">
        <Name>Execute Some Action</Name>
        <ConfigUI actionId="someAction"/>
    </MenuItem>
</MenuItems>
```

It’s pretty straight-forward. 

<span class="ca">**Attributes**</span>

The `MenuItems` element will contain multiple `<MenuItem>` elements. Here’s how to construct a `<MenuItem>`:

| Attribute                                   | Type      | Required | API Version | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |  |
|---------------------------------------------|-----------|----------|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--|
| <span class="nw cb">`id`</span>             | Attribute | Yes      | 1.0         | This is a unique id for the menu item in this file.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |  |
| <span class="nw cb">`Name`</span>           | Element   | Yes      | 1.0         | This is the text that’s shown in your plugin’s sub-menu.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |  |
| <span class="nw cb">`CallbackMethod`</span> | Element   | No       | 1.0 (1.1)   | This is the name of the method defined in your plugin that will be called when your user selects this menu item.<br><br><span class="dw-color-green">API v1.1</span>: If you specify a <ConfigUI> for the menu, then this property is optional. If it's present, then the the method will be called with arguments much like a validation (see example below). If it's not present (in which case a ConfigUI must be present), then the dialog will contain only a single "Close" button. In that case the functionality in the dialog will be completely left up to buttons contained within the dialog. |  |
| <span class="nw cb">`ConfigUI`</span>       | Element   | No       | 1.1 (1.2)   | If you want a menu to open an associated dialog, you can include a standard ConfigUI element (see [Configuration Dialogs](configui/index.md#plugin-config) above for details).<br><br><span class="dw-color-green">API v1.2</span>: You may also specify an actionId attribute on this element with the id of one of your actions and that action UI will be executed rather than having to specify the UI itself. If it requires a device ID that will be added at the top of the dialog. Ex: `<ConfigUI actionId="actionIdHere"/>`                                                                               |
| <span class="nw cb">`ButtonTitle`</span>    | Element   | No       | 1.1         | If you have a ConfigUI element and a CallbackMethod, you can add this element to specify the title used on the button that executes the dialog. By default it's "Execute".                                                                                                                                                                                                                                                                                                                                                                                                                                |  |

Here's an example of a menu item method definition in your plugin.py file for the "Check for Updates" menu item above:

```python
def checkForUpdates(self):
    indigo.server.log(u"checkForUpdates called")
    # Do the actual work here to see if there are any updates
```

As of <span class="dw-color-green">API v1.1</span> you can have your menu item open a dialog which will allow you to gather input from a user before executing the action. Just add a `<ConfigUI>` element to your MenuItem definition and define that dialog just like any other. There are a couple of differences between this dialog and other dialogs. First, the `CallbackMethod` for menu items will be used rather than a validation method. It will, however, operate in much the same way. If you specify a `CallbackMethod` then it will get called with the valuesDict and the menu item's ID. You can return `True`, which will cause the dialog to close, or return false with an error dictionary which will mark the invalid fields just like the validation method would. You also have the option of adding a `ButtonTitle` element - which will allow you to change the name of the button (it defaults to `Execute`).

If you don't specify a `CallbackMethod` then the dialog will not have `Execute` and `Cancel` buttons but rather a single `Close` button. Why? We wanted to allow you the flexibility of making a dialog perform multiple actions if you like using button field types within the dialog itself. When doing that it would be awkward to have an `Execute` button that didn't really do anything.

Whenever a user executes a menu item that contains a configuration dialog, it’s running as if it’s the first time the menu item is run (default values will always be used if present). Any values the user enters will be discarded after the menu item action is run. In other words, the next time the dialog is opened, default values will be used even if a user changed that value the last time the menu item was run. If a field doesn't specify a default value, the field will be empty each time the dialog is opened.

Here's an example of a menu item method definition in your plugin.py file for the "Turn Off Light" menu item above:

```python
def turnOffLight(self, valuesDict, typeId):
    indigo.server.log(f"Turning off light: {valuesDict["targetDevice"]}")
    # perform the action here. If there are errors in any of the fields then
    # you can return (False, valuesDict, errorsDict) just like a validation
    # method and the dialog won't close and will show the errors. If you
    # return True then the dialog will close when the method completes.
    errorsDict = indigo.Dict()
    return (True, valuesDict, errorsDict)
```

<span class="ca">**Get Menu Action Config UI Values**</span>

As noted above, a menu item config dialog will open as if it's being opened for the first time. However, if you would like values entered into the dialog to be persistent, you can load those values using the built-in `get_menu_action_config_ui_values` callback. Your plugin is responsible for storing and retrieving the values for the dialog yourself. How you store those values is up to you (you could save them to a file or store them in a hidden plugin configuration field, for example). Then, you can load them into the config dialog using `get_menu_action_config_ui_values` which will be called automatically if it exists:

<span class="nw cb">`get_menu_action_config_ui_values()`</span>

```python
def get_menu_action_config_ui_values(self, menu_id):
        menu_items = indigo.Dict()
        if menu_id == "my_menu_id":
            menu_items['foobar'] = "my stored value"
        return menu_items
```

This method will be called whenever a menu item with a config dialog is called, so be sure to apply values using the proper menu id.

<span class="ca">**Custom HTML Menu Item Dialogs**</span>

You can also implement your own custom menu item form in HTML if you prefer. Rather than adding `<CallbackMethod>` and  `<ConfigUI>` definitions, you simply specify a `<URL>` element. The URL specified can either be a fully specified URL (`protocol://host/path`) or it may be a relative URL (`/some/relative/path`). If it's the latter, then Indigo will attempt to guess the [best base URL](../../../scripting/reference/server-commands.md#get-web-server-url). You would then handle those form requests using [the built-in request handling mechanism discussed below](../plugin-py/http-requests.md#processing-http-requests-in-your-plugin). See the **Example HTTP Responder** plugin in the [SDK](https://github.com/IndigoDomotics/IndigoSDK/releases/tag/v2025.1) for an example.
