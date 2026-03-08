# Menu Items

**Official Documentation**: https://wiki.indigodomo.com/doku.php?id=indigo_2025.1_documentation:plugin_guide#menuitems

Define plugin menu items in `MenuItems.xml`. These appear in the Indigo menu under `Plugins > [Your Plugin Name]`.

## Basic Structure

```xml
<?xml version="1.0"?>
<MenuItems>
    <MenuItem id="toggleDebug">
        <Name>Toggle Debug Logging</Name>
        <CallbackMethod>toggle_debug</CallbackMethod>
    </MenuItem>
</MenuItems>
```

## Menu Item Types

### Callback Menu Item

Triggers a plugin method when clicked:

```xml
<MenuItem id="reloadConfig">
    <Name>Reload Configuration</Name>
    <CallbackMethod>reload_config</CallbackMethod>
</MenuItem>
```

```python
def reload_config(self):
    self.logger.info("Reloading configuration...")
    # Reload logic here
```

### URL Menu Item

Opens a URL in the user's browser:

```xml
<MenuItem id="openWebUI">
    <Name>Advanced Configuration Page...</Name>
    <URL>/message/com.my.plugin/config</URL>
</MenuItem>
```

The URL can be:
- A relative path served by the plugin's HTTP responder
- A full `https://` URL to external documentation

### Menu Item with ConfigUI Dialog

Opens a dialog window before executing the callback:

```xml
<MenuItem id="sendCommand">
    <Name>Send Custom Command...</Name>
    <CallbackMethod>send_custom_command</CallbackMethod>
    <ConfigUI>
        <SupportURL>https://my-plugin-docs.example.com/commands</SupportURL>
        <Field id="command" type="textfield">
            <Label>Command:</Label>
        </Field>
        <Field id="targetDevice" type="menu">
            <Label>Device:</Label>
            <List class="self" dynamicReload="true"/>
        </Field>
    </ConfigUI>
</MenuItem>
```

```python
def send_custom_command(self, values_dict, menu_item_id):
    command = values_dict.get("command", "")
    device_id = values_dict.get("targetDevice", "")
    self.logger.info(f"Sending command: {command}")
```

## Common Patterns

### Debug Toggle

```xml
<MenuItem id="toggleDebug">
    <Name>Toggle Debug Logging</Name>
    <CallbackMethod>toggle_debug</CallbackMethod>
</MenuItem>
```

```python
def toggle_debug(self):
    if self.debug:
        self.debug = False
        self.logger.info("Debug logging disabled")
    else:
        self.debug = True
        self.logger.info("Debug logging enabled")
```

### Print Connection Info

```xml
<MenuItem id="printInfo">
    <Name>Print Connection Information</Name>
    <CallbackMethod>print_connection_info</CallbackMethod>
</MenuItem>
```

### Separator

Not supported in MenuItems.xml — all items appear in a flat list.

## See Also

- [ConfigUI Reference](configui.md) — Field types and attributes for menu dialogs
- [Plugin Lifecycle](plugin-lifecycle.md) — Plugin startup and initialization
