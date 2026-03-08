# Device Development

**Official Documentation**: https://wiki.indigodomo.com/doku.php?id=indigo_2025.1_documentation:plugin_guide#devices

## Device Types

Plugins can create devices of various types defined in `Devices.xml`:

### Native Device Types

These inherit states and actions from Indigo:

| Type | Actions | Use Case | Example |
|------|---------|----------|---------|
| `relay` | ON/OFF/TOGGLE/STATUS | Binary switches, outlets | Smart plugs |
| `dimmer` | ON/OFF/DIM/BRIGHTEN/SET BRIGHTNESS | Dimmable lights | LED bulbs |
| `speedcontrol` | ON/OFF/SET SPEED LEVEL/INCREASE/DECREASE | Fan control | Ceiling fans |
| `sensor` | ON/OFF/STATUS (read-only) | Sensors, monitors | Motion sensors |
| `thermostat` | Full HVAC control | Climate control | Smart thermostats |
| `sprinkler` | Zone control | Irrigation | Sprinkler systems |

### Custom Device Type

Complete control over states and actions:

```xml
<Device type="custom" id="myCustomDevice">
    <Name>My Custom Device</Name>
    <ConfigUI>
        <!-- Configuration fields -->
    </ConfigUI>
    <States>
        <!-- Custom states -->
    </States>
</Device>
```

## Device Definition (Devices.xml)

### Basic Structure

```xml
<?xml version="1.0"?>
<Devices>
    <Device type="custom" id="deviceTypeId">
        <Name>Display Name</Name>
        <ConfigUI>
            <!-- User configuration fields -->
        </ConfigUI>
        <States>
            <!-- Device states -->
        </States>
        <UiDisplayStateId>primaryStateId</UiDisplayStateId>
    </Device>
</Devices>
```

### State Definitions

States store device data and can trigger events:

```xml
<States>
    <State id="temperature">
        <ValueType>Number</ValueType>
        <TriggerLabel>Temperature</TriggerLabel>
        <ControlPageLabel>Temp</ControlPageLabel>
    </State>
    <State id="isOnline">
        <ValueType>Boolean</ValueType>
        <TriggerLabel>Device Online Status</TriggerLabel>
        <ControlPageLabel>Online</ControlPageLabel>
    </State>
    <State id="status">
        <ValueType>String</ValueType>
        <TriggerLabel>Status Message</TriggerLabel>
        <ControlPageLabel>Status</ControlPageLabel>
    </State>
</States>
```

**Value Types**: `Integer`, `Number`, `String`, `Boolean`, `Separator`

### Configuration UI (ConfigUI)

```xml
<ConfigUI>
    <Field id="address" type="textfield">
        <Label>Device Address:</Label>
    </Field>
    <Field id="pollingInterval" type="textfield" defaultValue="60">
        <Label>Polling Interval (seconds):</Label>
    </Field>
    <Field id="enableLogging" type="checkbox" defaultValue="false">
        <Label>Enable Detailed Logging:</Label>
    </Field>
    <Field id="deviceType" type="menu" defaultValue="sensor">
        <Label>Device Type:</Label>
        <List>
            <Option value="sensor">Sensor</Option>
            <Option value="switch">Switch</Option>
        </List>
    </Field>
</ConfigUI>
```

**Field Types**: `textfield`, `textarea`, `checkbox`, `menu`, `list`, `button`, `label`, `separator`

## Device Factory Pattern

A Device Factory creates and manages a group of child devices from a single dialog. Use this when a hub or controller discovers multiple sub-devices (e.g., a bridge with relays, dimmers, and sensors).

### Devices.xml Structure

Instead of (or in addition to) individual `<Device>` elements, define a `<DeviceFactory>`:

```xml
<Devices>
    <DeviceFactory>
        <Name>Define Device Group...</Name>
        <ButtonTitle>Close</ButtonTitle>
        <ConfigUI>
            <!-- List showing current devices in the group -->
            <Field type="list" id="deviceGroupList">
                <Label>Device group:</Label>
                <List class="self" method="_get_device_group_list" dynamicReload="true" />
            </Field>
            <Field type="separator" id="sep1" />
            <!-- Buttons to add/remove devices -->
            <Field type="button" id="addRelay">
                <Title>Add Relay</Title>
                <CallbackMethod>_add_relay</CallbackMethod>
            </Field>
            <Field type="button" id="removeAll">
                <Title>Remove All Devices</Title>
                <CallbackMethod>_remove_all_devices</CallbackMethod>
            </Field>
        </ConfigUI>
    </DeviceFactory>

    <!-- Child device types that the factory creates -->
    <Device type="relay" id="myRelayType">
        <Name>Relay</Name>
        <!-- ... -->
    </Device>
    <Device type="dimmer" id="myDimmerType">
        <Name>Dimmer</Name>
        <!-- ... -->
    </Device>
</Devices>
```

### Plugin Callbacks

All factory methods receive `dev_id_list` — the list of device IDs currently in the group:

```python
def getDeviceFactoryUiValues(self, dev_id_list):
    """Prime initial values for the factory dialog."""
    values_dict = indigo.Dict()
    error_msg_dict = indigo.Dict()
    return (values_dict, error_msg_dict)

def validateDeviceFactoryUi(self, values_dict, dev_id_list):
    """Validate factory dialog before closing."""
    errors_dict = indigo.Dict()
    return (True, values_dict, errors_dict)

def closedDeviceFactoryUi(self, values_dict, user_cancelled, dev_id_list):
    """Called after factory dialog closes."""
    pass
```

### Adding and Removing Devices

Button callbacks create/delete devices using `indigo.device.create()` and `indigo.device.delete()`:

```python
def _add_relay(self, values_dict, dev_id_list):
    newdev = indigo.device.create(indigo.kProtocol.Plugin, deviceTypeId="myRelayType")
    newdev.model = "My Hub"        # Display in UI
    newdev.subType = "Relay"       # Tab label in UI
    newdev.replaceOnServer()
    return values_dict

def _remove_all_devices(self, values_dict, dev_id_list):
    for dev_id in dev_id_list:
        try:
            indigo.device.delete(dev_id)
        except:
            pass  # Root element cannot be deleted
    return values_dict
```

### Populating the Device Group List

```python
def _get_device_group_list(self, filter, values_dict, dev_id_list):
    """Return list of (id, name) tuples for the group list UI."""
    menu_items = []
    for dev_id in dev_id_list:
        if dev_id in indigo.devices:
            menu_items.append((dev_id, indigo.devices[dev_id].name))
        else:
            menu_items.append((dev_id, "- device not found -"))
    return menu_items
```

### Important Notes

- Device groups should only contain devices defined by the plugin (not X10/INSTEON/Z-Wave)
- Set `dev.model` and `dev.subType` after creation, then call `dev.replaceOnServer()`
- The `dev_id_list` auto-updates after `indigo.device.create()` / `indigo.device.delete()`
- See the **Example Device - Factory** SDK example for a complete working implementation

## Device Lifecycle

Device lifecycle callbacks are documented in [Plugin Lifecycle → Device Callbacks](plugin-lifecycle.md#device-lifecycle-callbacks).

Key callbacks:
- `deviceStartComm(dev)` - Initialize device communication
- `deviceStopComm(dev)` - Clean up device resources
- `deviceUpdated(origDev, newDev)` - Handle configuration changes

## Configuration Validation

```python
def validateDeviceConfigUi(self, values_dict, type_id, dev_id):
    """
    Validate device configuration before saving

    :return: (is_valid, values_dict, errors_dict)
    """
    errors_dict = indigo.Dict()

    # Validate address
    address = values_dict.get('address', '').strip()
    if not address:
        errors_dict['address'] = "Address is required"

    # Validate polling interval
    try:
        interval = int(values_dict.get('pollingInterval', 60))
        if interval < 10:
            errors_dict['pollingInterval'] = "Minimum interval is 10 seconds"
    except ValueError:
        errors_dict['pollingInterval'] = "Must be a number"

    if len(errors_dict) > 0:
        return (False, values_dict, errors_dict)

    return (True, values_dict)
```

## Dynamic Lists

Populate configuration fields dynamically:

```python
def get_device_list(self, filter="", values_dict=None, type_id="", target_id=0):
    """Return list of available devices for dropdown"""
    device_list = []
    for dev in indigo.devices:
        if dev.id != target_id:  # Don't include self
            device_list.append((dev.id, dev.name))
    return device_list
```

```xml
<Field id="linkedDevice" type="menu">
    <Label>Linked Device:</Label>
    <List class="self" method="get_device_list" dynamicReload="true"/>
</Field>
```

## Device Properties

For complete device class reference including all properties and methods, see [API → IOM → Devices](../api/iom/devices.md).

Common access patterns:

```python
# Plugin-defined properties (from ConfigUI)
address = dev.pluginProps.get('address', '')

# Device states
temp = dev.states['temperature']

# Built-in properties
dev.id              # Unique device ID
dev.name            # Device name
dev.deviceTypeId    # Type ID from Devices.xml
dev.enabled         # Is device enabled?
```

## Best Practices

### State Design
- Use descriptive state IDs: `temperatureSensor1` not `temp1`
- Choose appropriate value types for your data
- Set `UiDisplayStateId` to most important state

### Device Communication
- Initialize connections in `deviceStartComm()`
- Clean up in `deviceStopComm()`
- Handle device offline gracefully

### Configuration
- Provide sensible defaults
- Validate all user input
- Use dynamic lists for device/variable selection

### Performance
- Batch state updates with `updateStatesOnServer()`
- Update states only when values change
- Use `indigo.devices.iter("self")` to iterate only your plugin's devices

## See Also

- [Device Classes Reference](../api/iom/devices.md) - Device properties and methods
- [Plugin Lifecycle](plugin-lifecycle.md) - Lifecycle callbacks
- [Constants Reference](../api/iom/constants.md) - State icons
