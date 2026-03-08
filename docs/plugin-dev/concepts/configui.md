# ConfigUI Reference

**Official Documentation**: https://wiki.indigodomo.com/doku.php?id=indigo_2025.1_documentation:plugin_guide#configui_xml_reference

ConfigUI elements define the user interface for plugin configuration, device settings, action parameters, event settings, and menu item dialogs. They appear in `PluginConfig.xml`, `Devices.xml`, `Actions.xml`, `Events.xml`, and `MenuItems.xml`.

## Field Types

### textfield

Single-line text input.

```xml
<Field id="ipAddress" type="textfield" defaultValue="192.168.1.100">
    <Label>IP Address:</Label>
</Field>

<!-- Secure field (masked input, stored encrypted) -->
<Field id="apiKey" type="textfield" defaultValue="" secure="true">
    <Label>API Key:</Label>
</Field>

<!-- Read-only field -->
<Field id="status" type="textfield" readonly="yes">
    <Label>Status:</Label>
</Field>
```

### textarea

Multi-line text input.

```xml
<Field id="notes" type="textarea" defaultValue="">
    <Label>Notes:</Label>
</Field>
```

### checkbox

Boolean toggle with optional description text below.

```xml
<Field id="enableLogging" type="checkbox" defaultValue="false">
    <Label>Enable Detailed Logging:</Label>
    <Description>Logs all API requests and responses to the Indigo event log.</Description>
</Field>
```

### menu

Dropdown/popup menu — static options or dynamic from plugin method.

```xml
<!-- Static options -->
<Field id="protocol" type="menu" defaultValue="https">
    <Label>Protocol:</Label>
    <List>
        <Option value="http">HTTP</Option>
        <Option value="https">HTTPS</Option>
    </List>
</Field>

<!-- Dynamic options from plugin method -->
<Field id="targetDevice" type="menu">
    <Label>Device:</Label>
    <List class="self" method="get_device_list" dynamicReload="true"/>
</Field>
```

### list

Multi-select list control. Use `rows` attribute to set visible rows (minimum 4).

```xml
<Field id="memberDeviceList" type="list">
    <Label>Devices in group:</Label>
    <List class="self" method="member_devices" dynamicReload="true"/>
</Field>
```

### button

Clickable button that triggers a plugin callback method.

```xml
<Field id="testConnection" type="button">
    <Label/>
    <Title>Test Connection</Title>
    <CallbackMethod>test_connection</CallbackMethod>
</Field>
```

### label

Static text for display. Supports font styling.

```xml
<!-- Standard label -->
<Field id="helpText" type="label">
    <Label>Configure the connection settings below.</Label>
</Field>

<!-- Styled label -->
<Field id="warningText" type="label" fontColor="red" fontSize="small">
    <Label>Warning: Changing these settings will disconnect the device.</Label>
</Field>
```

**Label attributes**:

| Attribute | Values | Description |
|-----------|--------|-------------|
| `fontColor` | `black`, `darkgray`, `red`, `orange`, `green`, `blue` | Text color |
| `fontSize` | `regular`, `small`, `mini` | Text size |
| `alignText` | `left`, `center`, `right` | Text alignment |
| `alignWithControl` | `true` / `false` | Align with control column (default aligns with labels) |

### separator

Visual separator line. Self-terminating.

```xml
<Field type="separator" id="sep1" />
```

### serialport

Auto-expanding serial port selector. Generates fields for local ports, network sockets, and RFC-2217 connections.

```xml
<Field id="serialPort" type="serialport">
    <Label>Serial Port:</Label>
</Field>
```

Validate with the built-in helper:

```python
def validateDeviceConfigUi(self, values_dict, type_id, dev_id):
    errors_dict = indigo.Dict()
    self.validateSerialPortUi(values_dict, errors_dict, "serialPort")
    if len(errors_dict) > 0:
        return (False, values_dict, errors_dict)
    return (True, values_dict)
```

### colorPicker

Color selector that returns a space-delimited RGB string (e.g., `"255 128 0"`).

```xml
<Field id="ledColor" type="colorPicker" defaultValue="255 255 255">
    <Label>LED Color:</Label>
</Field>
```

## Field Attributes

### Common Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | String | Unique field identifier (required) |
| `type` | String | Field type (required) |
| `defaultValue` | String | Default value |
| `hidden` | `"true"` / `"yes"` | Hide field from UI (value still accessible in `valuesDict`) |
| `tooltip` | String | Hover tooltip text |
| `secure` | `"true"` | Mask input and store encrypted (for passwords, API keys) |
| `readonly` | `"yes"` | Prevent user editing |

### Conditional Visibility

Control whether a field is visible based on another field's value:

```xml
<!-- Master checkbox -->
<Field id="useCustomSettings" type="checkbox" defaultValue="false">
    <Label>Use Custom Settings:</Label>
</Field>

<!-- Only visible when useCustomSettings is true -->
<Field id="customPort" type="textfield" defaultValue="8080"
       visibleBindingId="useCustomSettings" visibleBindingValue="true"
       alwaysUseInDialogHeightCalc="true">
    <Label>Custom Port:</Label>
</Field>
```

| Attribute | Description |
|-----------|-------------|
| `visibleBindingId` | Field ID that controls this field's visibility |
| `visibleBindingValue` | Value of the binding field that makes this field visible |
| `alwaysUseInDialogHeightCalc` | `"true"` — prevents dialog resizing when field toggles visibility |

### Conditional Enabled State

Control whether a field is enabled/disabled based on a checkbox:

```xml
<Field id="enableWhite" type="checkbox" defaultValue="false">
    <Label>Supports White Channel:</Label>
</Field>

<!-- Only enabled when enableWhite is checked -->
<Field id="whiteTemperature" type="textfield" defaultValue="3000"
       enabledBindingId="enableWhite">
    <Label>White Temperature (K):</Label>
</Field>
```

| Attribute | Description |
|-----------|-------------|
| `enabledBindingId` | Checkbox field ID that controls this field's enabled state |
| `enabledBindingNegate` | `"true"` — negate the binding (enabled when checkbox is unchecked) |

### Combined Bindings

Attributes can be combined for complex conditional logic:

```xml
<Field id="whiteTemperature" type="checkbox" defaultValue="false"
       enabledBindingId="supportsWhite"
       visibleBindingId="supportsTwoWhiteLevels" visibleBindingValue="false"
       alwaysUseInDialogHeightCalc="true">
    <Label>Supports White Temperature:</Label>
</Field>
```

This field is:
- Only **visible** when `supportsTwoWhiteLevels` is `"false"`
- Only **enabled** when `supportsWhite` is checked
- Always counted in dialog height calculation

## Dynamic Lists

### Built-in List Classes

Use the `class` attribute on `<List>` to populate from Indigo's database:

| Class | Description |
|-------|-------------|
| `indigo.devices` | All devices |
| `indigo.variables` | All variables |
| `indigo.triggers` | All triggers |
| `indigo.schedules` | All schedules |
| `indigo.actionGroups` | All action groups |
| `indigo.controlPages` | All control pages |
| `indigo.serialPorts` | Available serial ports |
| `self` | This plugin's devices only |
| `self.devTypeId` | This plugin's devices of a specific type |
| `com.somePlugin` | Another plugin's devices |
| `com.somePlugin.devTypeId` | Another plugin's devices of a specific type |

### Device Filters

Combine with the `filter` attribute to narrow device selection:

| Filter | Description |
|--------|-------------|
| `indigo.relay` | Relay devices |
| `indigo.dimmer` | Dimmer devices |
| `indigo.sensor` | Sensor devices |
| `indigo.thermostat` | Thermostat devices |
| `indigo.sprinkler` | Sprinkler devices |
| `indigo.speedcontrol` | Speed control devices |
| `indigo.iodevice` | Multi I/O devices |
| `indigo.insteon` | INSTEON protocol devices |
| `indigo.zwave` | Z-Wave protocol devices |
| `indigo.x10` | X10 protocol devices |
| `indigo.responder` | Responder devices |
| `indigo.controller` | Controller devices |

```xml
<Field id="dimmerDevice" type="menu">
    <Label>Select Dimmer:</Label>
    <List class="indigo.devices" filter="indigo.dimmer"/>
</Field>
```

### Trigger Filters

| Filter | Description |
|--------|-------------|
| `indigo.devStateChange` | Device state change triggers |
| `indigo.varValueChange` | Variable value change triggers |
| `indigo.insteonCmdRcvd` | INSTEON command received triggers |
| `indigo.x10CmdRcvd` | X10 command received triggers |
| `indigo.serverStartup` | Server startup triggers |
| `indigo.powerFailure` | Power failure triggers |
| `indigo.interfaceFail` | Interface failure triggers |
| `indigo.interfaceInit` | Interface initialized triggers |
| `indigo.emailRcvd` | Email received triggers |

### Variable Filters

| Filter | Description |
|--------|-------------|
| `indigo.readWrite` | Read/write variables only (excludes read-only) |

### Custom Dynamic Lists

Plugin method populating a menu or list:

```xml
<Field id="device" type="menu">
    <Label>Device:</Label>
    <List class="self" method="get_device_list" dynamicReload="true"/>
</Field>
```

```python
def get_device_list(self, filter="", values_dict=None, type_id="", target_id=0):
    """Return list of (value, label) tuples for menu/list population."""
    device_list = []
    for dev in indigo.devices.iter("self"):
        device_list.append((str(dev.id), dev.name))
    return device_list
```

**Parameters**:
- `filter` — filter string from `<List>` element (optional)
- `values_dict` — current dialog values
- `type_id` — device/action/event type ID
- `target_id` — device/action/event ID (0 for new)

**Return**: List of `(value_string, display_string)` tuples.

## Validation

### Validation Callbacks

| Context | Method |
|---------|--------|
| Plugin config | `validatePrefsConfigUi(self, values_dict)` |
| Device config | `validateDeviceConfigUi(self, values_dict, type_id, dev_id)` |
| Action config | `validateActionConfigUi(self, values_dict, type_id, device_id)` |
| Event config | `validateEventConfigUi(self, values_dict, type_id, event_id)` |
| Device factory | `validateDeviceFactoryUi(self, values_dict, dev_id_list)` |

### Return Values

```python
# Success (3 patterns, all accepted)
return True
return (True, values_dict)
return (True, values_dict, indigo.Dict())

# Failure — show errors on specific fields
errors = indigo.Dict()
errors["fieldId"] = "This field is required"
return (False, values_dict, errors)

# Failure — show alert dialog
errors = indigo.Dict()
errors["showAlertText"] = "Unable to connect. Check IP address and try again."
return (False, values_dict, errors)
```

The special key `"showAlertText"` in the errors dict displays a modal alert dialog instead of highlighting a field.

### Dialog Close Callbacks

Called after validation succeeds or user cancels:

| Context | Method |
|---------|--------|
| Plugin config | `closedPrefsConfigUi(self, values_dict, user_cancelled)` |
| Device config | `closedDeviceConfigUi(self, values_dict, user_cancelled, type_id, dev_id)` |
| Action config | `closedActionConfigUi(self, values_dict, user_cancelled, type_id, action_id)` |
| Event config | `closedEventConfigUi(self, values_dict, user_cancelled, type_id, event_id)` |
| Device factory | `closedDeviceFactoryUi(self, values_dict, user_cancelled, dev_id_list)` |

## SupportURL

Add a help button to any ConfigUI dialog:

```xml
<ConfigUI>
    <SupportURL>https://my-plugin-docs.example.com/setup</SupportURL>
    <!-- fields... -->
</ConfigUI>
```

Can also be set at the top level of `Actions.xml`:

```xml
<Actions>
    <SupportURL>https://my-plugin-docs.example.com/actions</SupportURL>
    <Action ...>
```

Falls back to the `SupportURL` in `Info.plist` if not specified.

## See Also

- [Device Development](devices.md) — Device-specific ConfigUI in Devices.xml
- [Actions](actions.md) — Action-specific ConfigUI in Actions.xml
- [Menu Items](menu-items.md) — Menu-specific ConfigUI in MenuItems.xml
- [Plugin Preferences](plugin-preferences.md) — PluginConfig.xml
- [Constants Reference](../api/iom/constants.md) — Enum values
