# Device Commands

Complete reference for all device commands available via WebSocket and HTTP APIs.

> **Note on Command Availability:** The commands documented here are primarily tested with the WebSocket API and are generally available in both transports. However, some commands may be transport-specific. If a command doesn't work in your chosen transport, try the alternative or consult the official Indigo documentation.

## Command Message Structure

All commands use this JSON format:

```json
{
  "message": "command.namespace.action",   // Required
  "objectId": 123456789,                   // Required
  "parameters": {                          // Optional
    "key": "value"
  },
  "id": "tracking-id"                      // Optional
}
```

## Quick Command Reference

| Device Type | Commands | Common Use Cases |
|-------------|----------|------------------|
| **All Devices** | statusRequest, toggle, turnOn, turnOff, enable | Basic control |
| **Dimmer** | setBrightness, brighten, dim | Light intensity |
| **Dimmer (Color)** | setColorLevels | RGB, white level, color temperature |
| **Speed Control** | setSpeedIndex, setSpeedLevel, increaseSpeed, decreaseSpeed | Fan speed |
| **Sensor** | setOnState | Manual sensor state |
| **I/O Device** | setBinaryOutput | Digital output control |
| **Sprinkler** | nextZone, previousZone, pause, resume | Zone management |
| **Lock** | lock, unlock | Security devices |
| **Variable** | updateValue | Variable management |
| **Action Group** | execute | Run actions |

## Generic Device Commands (`indigo.device`)

Available for: RelayDevice, DimmerDevice, SpeedControl, some SensorDevice types

### statusRequest

Request device to update its status from hardware.

```json
{
  "message": "indigo.device.statusRequest",
  "objectId": 123456789
}
```

**Parameters**: None

**Use Case**: Force device to poll current state from hardware

### toggle

Toggle device between on and off states.

```json
{
  "message": "indigo.device.toggle",
  "objectId": 123456789,
  "parameters": {
    "delay": 5,      // Optional: delay in seconds before executing
    "duration": 10   // Optional: auto turn off after N seconds
  }
}
```

**Parameters**:
- `delay` (int, optional): Seconds to wait before toggling
- `duration` (int, optional): Seconds after which to automatically reverse state

**Example - Toggle after 5 seconds**:
```json
{
  "message": "indigo.device.toggle",
  "objectId": 123456789,
  "parameters": {"delay": 5}
}
```

### turnOn

Turn device on.

```json
{
  "message": "indigo.device.turnOn",
  "objectId": 123456789,
  "parameters": {
    "delay": 0,      // Optional
    "duration": 0    // Optional
  }
}
```

**Parameters**: Same as toggle

**Example - Turn on for 60 seconds then auto-off**:
```json
{
  "message": "indigo.device.turnOn",
  "objectId": 123456789,
  "parameters": {"duration": 60}
}
```

### turnOff

Turn device off.

```json
{
  "message": "indigo.device.turnOff",
  "objectId": 123456789,
  "parameters": {
    "delay": 0       // Optional
  }
}
```

**Parameters**:
- `delay` (int, optional): Seconds to wait before turning off

### lock / unlock

Lock or unlock security devices.

```json
{
  "message": "indigo.device.lock",
  "objectId": 123456789,
  "parameters": {
    "delay": 0       // Optional
  }
}
```

```json
{
  "message": "indigo.device.unlock",
  "objectId": 123456789,
  "parameters": {
    "delay": 0       // Optional
  }
}
```

**Parameters**:
- `delay` (int, optional): Seconds to wait before executing

### enable

Enable or disable device.

```json
{
  "message": "indigo.device.enable",
  "objectId": 123456789,
  "parameters": {
    "value": true    // true = enable, false = disable
  }
}
```

**Parameters**:
- `value` (boolean, required): `true` to enable, `false` to disable

**Use Case**: Temporarily disable device without deleting it

## Dimmer Commands (`indigo.dimmer`)

Available for: DimmerDevice

### setBrightness

Set dimmer to specific brightness level.

```json
{
  "message": "indigo.dimmer.setBrightness",
  "objectId": 123456789,
  "parameters": {
    "value": 50,     // Required: 0-100
    "delay": 0       // Optional: delay in seconds
  }
}
```

**Parameters**:
- `value` (int, required): Brightness level 0-100 (0 = off, 100 = full brightness)
- `delay` (int, optional): Seconds to wait before executing

**Example - Dim to 25% brightness**:
```json
{
  "message": "indigo.dimmer.setBrightness",
  "objectId": 123456789,
  "parameters": {"value": 25}
}
```

### brighten

Increase brightness by specified amount.

```json
{
  "message": "indigo.dimmer.brighten",
  "objectId": 123456789,
  "parameters": {
    "by": 10,        // Optional: amount to increase (default: 10)
    "delay": 0       // Optional: delay in seconds
  }
}
```

**Parameters**:
- `by` (int, optional): Amount to increase brightness (default: 10)
- `delay` (int, optional): Seconds to wait before executing

**Example - Brighten by 20%**:
```json
{
  "message": "indigo.dimmer.brighten",
  "objectId": 123456789,
  "parameters": {"by": 20}
}
```

### dim

Decrease brightness by specified amount.

```json
{
  "message": "indigo.dimmer.dim",
  "objectId": 123456789,
  "parameters": {
    "by": 10,        // Optional: amount to decrease (default: 10)
    "delay": 0       // Optional: delay in seconds
  }
}
```

**Parameters**:
- `by` (int, optional): Amount to decrease brightness (default: 10)
- `delay` (int, optional): Seconds to wait before executing

## Color Commands (`indigo.dimmer`)

Available for: DimmerDevice with color capabilities (`supportsRGB`, `supportsWhiteTemperature`, `supportsWhite`)

### setColorLevels

Set RGB color, white level, and/or color temperature in a single command. All color channel parameters are optional — include only the channels you want to change.

```json
{
  "message": "indigo.dimmer.setColorLevels",
  "objectId": 123456789,
  "parameters": {
    "redLevel": 100,
    "greenLevel": 50,
    "blueLevel": 0,
    "whiteLevel": 0,
    "whiteLevel2": 0,
    "whiteTemperature": 3500
  }
}
```

**Parameters** (all optional — include only channels being set):
- `redLevel` (int): Red channel 0-100
- `greenLevel` (int): Green channel 0-100
- `blueLevel` (int): Blue channel 0-100
- `whiteLevel` (int): White channel 0-100 (warm white on RGBW devices)
- `whiteLevel2` (int): Second white channel 0-100 (cool white on dual-white devices)
- `whiteTemperature` (int): Color temperature in Kelvin (typically 2000-6500)
- `delay` (int, optional): Seconds to wait before executing

**Important**: This is a single combined command — there are no separate `setRedLevel`, `setGreenLevel`, etc. commands. Always use `setColorLevels` with the appropriate parameter keys.

#### Example — Set RGB Color (Orange)

```json
{
  "message": "indigo.dimmer.setColorLevels",
  "objectId": 123456789,
  "parameters": {
    "redLevel": 100,
    "greenLevel": 50,
    "blueLevel": 0
  }
}
```

#### Example — Set Color Temperature (Warm White)

```json
{
  "message": "indigo.dimmer.setColorLevels",
  "objectId": 123456789,
  "parameters": {
    "whiteTemperature": 2700
  }
}
```

#### Example — Set White Level Only

```json
{
  "message": "indigo.dimmer.setColorLevels",
  "objectId": 123456789,
  "parameters": {
    "whiteLevel": 80
  }
}
```

### Color Device Properties

Devices with color support expose these properties:

| Property | Type | Range | Description |
|----------|------|-------|-------------|
| `supportsRGB` | bool | — | Device can set red/green/blue channels |
| `supportsWhiteTemperature` | bool | — | Device can set color temperature |
| `supportsWhite` | bool | — | Device has white channel(s) |
| `redLevel` | int | 0-100 | Current red channel level |
| `greenLevel` | int | 0-100 | Current green channel level |
| `blueLevel` | int | 0-100 | Current blue channel level |
| `whiteLevel` | int | 0-100 | Current white channel level |
| `whiteLevel2` | int | 0-100 | Second white channel (cool white) |
| `whiteTemperature` | int | Kelvin | Current color temperature |

### Color Mode

Devices may report a `colorMode` state (via `states["colorMode"]`) indicating whether they are currently in `"rgb"` or `"colorTemp"` mode. When sending RGB parameters the device switches to RGB mode; when sending `whiteTemperature` it switches to color temperature mode.

## Speed Control Commands (`indigo.speedcontrol`)

Available for: SpeedControl devices (fans, etc.)

### setSpeedIndex

Set fan to specific speed index (0, 1, 2, 3, etc.).

```json
{
  "message": "indigo.speedcontrol.setSpeedIndex",
  "objectId": 123456789,
  "parameters": {
    "value": 2       // Speed index (0 = off, 1-3 = speeds)
  }
}
```

**Parameters**:
- `value` (int, required): Speed index (0 = off, device-specific max)

### setSpeedLevel

Set fan to specific speed percentage (0-100).

```json
{
  "message": "indigo.speedcontrol.setSpeedLevel",
  "objectId": 123456789,
  "parameters": {
    "value": 66      // Speed percentage 0-100
  }
}
```

**Parameters**:
- `value` (int, required): Speed level 0-100

### increaseSpeedIndex

Increase speed by number of index levels.

```json
{
  "message": "indigo.speedcontrol.increaseSpeedIndex",
  "objectId": 123456789,
  "parameters": {
    "by": 1          // Optional: number of levels (default: 1)
  }
}
```

**Parameters**:
- `by` (int, optional): Number of speed levels to increase (default: 1)

### decreaseSpeedIndex

Decrease speed by number of index levels.

```json
{
  "message": "indigo.speedcontrol.decreaseSpeedIndex",
  "objectId": 123456789,
  "parameters": {
    "by": 1          // Optional: number of levels (default: 1)
  }
}
```

**Parameters**:
- `by` (int, optional): Number of speed levels to decrease (default: 1)

## Sensor Commands (`indigo.sensor`)

Available for: SensorDevice (limited set)

### setOnState

Manually set sensor on/off state.

```json
{
  "message": "indigo.sensor.setOnState",
  "objectId": 123456789,
  "parameters": {
    "value": true    // true = on, false = off
  }
}
```

**Parameters**:
- `value` (boolean, required): `true` for on, `false` for off

**Use Case**: Virtual sensors or manual override

## I/O Device Commands (`indigo.iodevice`)

Available for: IODevice (digital outputs)

### setBinaryOutput

Set specific binary output on I/O device.

```json
{
  "message": "indigo.iodevice.setBinaryOutput",
  "objectId": 123456789,
  "parameters": {
    "index": 0,      // Output index
    "value": true    // true = on, false = off
  }
}
```

**Parameters**:
- `index` (int, required): Output index number
- `value` (boolean, required): `true` for on, `false` for off

## Sprinkler Commands (`indigo.sprinkler`)

Available for: SprinklerDevice

### nextZone

Advance to next sprinkler zone.

```json
{
  "message": "indigo.sprinkler.nextZone",
  "objectId": 123456789
}
```

**Parameters**: None

### previousZone

Go back to previous sprinkler zone.

```json
{
  "message": "indigo.sprinkler.previousZone",
  "objectId": 123456789
}
```

**Parameters**: None

### pause

Pause sprinkler schedule.

```json
{
  "message": "indigo.sprinkler.pause",
  "objectId": 123456789
}
```

**Parameters**: None

### resume

Resume sprinkler schedule.

```json
{
  "message": "indigo.sprinkler.resume",
  "objectId": 123456789
}
```

**Parameters**: None

## Variable Commands (`indigo.variable`)

### updateValue

Update variable value.

```json
{
  "message": "indigo.variable.updateValue",
  "objectId": 345633244,
  "parameters": {
    "value": "new value"    // Must be string
  }
}
```

**Parameters**:
- `value` (string, required): New variable value (must be string, use `""` to clear)

**Important**: Variable values are **always strings**. Numbers, booleans, etc. must be converted to strings.

**Examples**:
```json
// Set to text
{"message": "indigo.variable.updateValue", "objectId": 123, "parameters": {"value": "home"}}

// Set to number (as string)
{"message": "indigo.variable.updateValue", "objectId": 123, "parameters": {"value": "42"}}

// Clear value
{"message": "indigo.variable.updateValue", "objectId": 123, "parameters": {"value": ""}}
```

## Action Group Commands (`indigo.actionGroup`)

### execute

Execute action group.

```json
{
  "message": "indigo.actionGroup.execute",
  "objectId": 94914463
}
```

**Parameters**: None

**Use Case**: Trigger scenes, run automation sequences

## Data Type Reference

### Python ↔ JSON Conversion

| Python Type | JSON Type | Example |
|-------------|-----------|---------|
| `True` | `true` | `"value": true` |
| `False` | `false` | `"value": false` |
| `None` | `null` | `"value": null` |
| `int` | Number | `"value": 50` |
| `float` | Number | `"value": 3.14` |
| `str` | String | `"value": "text"` |
| `dict` | Object | `"parameters": {"key": "value"}` |
| `list` | Array | `"list": [1, 2, 3]` |

**Important**: Python `True`/`False` must be lowercase `true`/`false` in JSON.

## Common Patterns

### Turn Light On at 50% Brightness

```json
{
  "message": "indigo.dimmer.setBrightness",
  "objectId": 123456789,
  "parameters": {"value": 50}
}
```

### Toggle Light After 30 Second Delay

```json
{
  "message": "indigo.device.toggle",
  "objectId": 123456789,
  "parameters": {"delay": 30}
}
```

### Turn Light On for 60 Seconds Then Auto-Off

```json
{
  "message": "indigo.device.turnOn",
  "objectId": 123456789,
  "parameters": {"duration": 60}
}
```

### Set Light to Warm White (2700K)

```json
{
  "message": "indigo.dimmer.setColorLevels",
  "objectId": 123456789,
  "parameters": {"whiteTemperature": 2700}
}
```

### Set Light to Blue

```json
{
  "message": "indigo.dimmer.setColorLevels",
  "objectId": 123456789,
  "parameters": {"redLevel": 0, "greenLevel": 0, "blueLevel": 100}
}
```

### Set Fan to Medium Speed (66%)

```json
{
  "message": "indigo.speedcontrol.setSpeedLevel",
  "objectId": 123456789,
  "parameters": {"value": 66}
}
```

### Update Variable with Sensor Reading

```json
{
  "message": "indigo.variable.updateValue",
  "objectId": 345633244,
  "parameters": {"value": "72.5"}
}
```

## Error Handling

### Invalid Command

```json
{
  "error": "Unknown command: indigo.device.invalid",
  "errorId": "unknown_command"
}
```

### Invalid Object ID

```json
{
  "error": "Device not found",
  "errorId": "device_not_found"
}
```

### Missing Required Parameter

```json
{
  "error": "Missing required parameter: value",
  "errorId": "missing_parameter"
}
```

### Invalid Parameter Value

```json
{
  "error": "Brightness value must be 0-100",
  "errorId": "invalid_parameter_value"
}
```

## Best Practices

1. **Check Device Type**: Not all commands work on all devices
2. **Validate Parameters**: Ensure brightness/speed values are in valid range
3. **Use Delays Wisely**: Delays block other commands to same device
4. **Track Requests**: Use optional `id` field to match responses
5. **Handle Errors**: Always check for `error` field in response
6. **String Variables**: Remember variable values are always strings

## Related Documentation

- **[WebSocket API](websocket-api.md)** - Using commands via WebSocket
- **[HTTP API](http-api.md)** - Using commands via HTTP POST
- **[Indigo Object Model](../indigo-object-model.md)** - Device properties and structure
