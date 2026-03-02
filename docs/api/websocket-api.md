# WebSocket API

Complete reference for Indigo's WebSocket API - real-time bidirectional communication for monitoring devices, variables, action groups, and logs.

## Quick Reference

| Feed | Endpoint | Purpose | Read | Write |
|------|----------|---------|------|-------|
| Device | `/v2/api/ws/device-feed` | Monitor/control devices | ✓ | ✓ |
| Variable | `/v2/api/ws/variable-feed` | Track variables | ✓ | ✓ |
| Action Group | `/v2/api/ws/action-feed` | Execute action groups | ✓ | ✓ |
| Control Page | `/v2/api/ws/page-feed` | Page management | ✓ | ✗ |
| Log | `/v2/api/ws/log-feed` | Real-time logging | ✓ | ✓ |

## Connection Lifecycle

### Phase 1: Connect

**Local Network**:
```python
import websockets
import json

uri = "ws://192.168.1.100:8176/v2/api/ws/device-feed"
headers = {'Authorization': f'Bearer {API_KEY}'}

async with websockets.connect(uri, extra_headers=headers) as ws:
    # Connected
```

**Remote (Reflector)**:
```python
uri = f"wss://{REFLECTOR}.indigodomo.net/v2/api/ws/device-feed"
```

### Phase 2: Request Initial Data

Send refresh message to get existing objects:

```python
await ws.send(json.dumps({
    "message": "refresh",
    "objectType": "indigo.Device"
}))

# Receive response with all devices
response = json.loads(await ws.recv())
# response["list"] contains array of all device objects
```

### Phase 3: Process Updates

Listen for add/patch/delete messages:

```python
async for message in ws:
    data = json.loads(message)

    if data["message"] == "add":
        # New device or device enabled for remote display
        device = data["objectDict"]

    elif data["message"] == "patch":
        # Device property changed
        device_id = data["objectId"]
        patch = data["patch"]  # dictdiffer format

    elif data["message"] == "delete":
        # Device removed or remote display disabled
        device_id = data["objectId"]
```

### Phase 4: Send Commands

```python
# Toggle device
await ws.send(json.dumps({
    "message": "indigo.device.toggle",
    "objectId": 123456789,
    "id": "optional-tracking-id"
}))
```

### Phase 5: Disconnect

```python
await ws.close()
```

## Message Types (Server → Client)

### Add Message

Sent when:
- New object created in Indigo
- Existing object's `remoteDisplay` set to `true`

```json
{
  "message": "add",
  "objectType": "indigo.Device",
  "objectDict": {
    "id": 123456789,
    "name": "Living Room Light",
    "class": "indigo.DimmerDevice",
    "brightness": 75,
    "onState": true,
    ...
  }
}
```

### Patch Message

Sent when object properties change. Uses [dictdiffer](https://github.com/inveniosoftware/dictdiffer) format:

```json
{
  "message": "patch",
  "objectType": "indigo.Device",
  "objectId": 123456789,
  "patch": [
    ["change", "brightness", [50, 75]],
    ["change", "onState", [false, true]]
  ]
}
```

**Patch Format**: `[operation, path, values]`
- `"change"` - Property modified: `[oldValue, newValue]`
- `"add"` - Property added: `[(key, value)]`
- `"remove"` - Property removed: `[(key, value)]`

### Delete Message

Sent when:
- Object deleted from Indigo
- Object's `remoteDisplay` set to `false`

```json
{
  "message": "delete",
  "objectType": "indigo.Device",
  "objectId": 123456789
}
```

### Refresh Response

Server reply to refresh requests:

```json
{
  "message": "refresh",
  "objectType": "indigo.Device",
  "list": [
    { "id": 123, "name": "Device 1", ... },
    { "id": 456, "name": "Device 2", ... }
  ],
  "id": "your-tracking-id"  // if you sent one
}
```

**Single object refresh**:
```json
{
  "message": "refresh",
  "objectType": "indigo.Device",
  "objectDict": { "id": 123456789, ... }
}
```

## Device Feed

### Refresh All Devices

```json
{
  "message": "refresh",
  "objectType": "indigo.Device"
}
```

### Refresh Single Device

```json
{
  "message": "refresh",
  "objectType": "indigo.Device",
  "objectId": 123456789
}
```

### Send Device Commands

See [device-commands.md](device-commands.md) for complete command reference.

```json
{
  "message": "indigo.device.toggle",
  "objectId": 123456789
}
```

```json
{
  "message": "indigo.dimmer.setBrightness",
  "objectId": 123456789,
  "parameters": {
    "value": 50,
    "delay": 0
  }
}
```

## Variable Feed

### Variable Object Structure

```json
{
  "class": "indigo.Variable",
  "id": 345633244,
  "name": "house_status",
  "value": "home",
  "readOnly": false,
  "description": "",
  "folderId": 0,
  "remoteDisplay": true,
  "globalProps": {},
  "pluginProps": {},
  "sharedProps": {}
}
```

### Update Variable Value

```json
{
  "message": "indigo.variable.updateValue",
  "objectId": 345633244,
  "parameters": {
    "value": "away"
  }
}
```

**Important**: Parameter values must be **strings**. Empty string `""` clears the value.

### Refresh Variables

```json
{
  "message": "refresh",
  "objectType": "indigo.Variable"
}
```

## Action Group Feed

### Action Group Object

```json
{
  "class": "indigo.ActionGroup",
  "id": 94914463,
  "name": "Movie Night",
  "description": "",
  "folderId": 532526508,
  "remoteDisplay": true,
  "globalProps": {},
  "pluginProps": {},
  "sharedProps": {}
}
```

### Execute Action Group

```json
{
  "message": "indigo.actionGroup.execute",
  "objectId": 94914463
}
```

### Refresh Action Groups

```json
{
  "message": "refresh",
  "objectType": "indigo.ActionGroup"
}
```

## Control Page Feed

**Read-only feed** - used for managing a list of available control pages. No command messages can be sent; its purpose is to use incoming messages to manage a list of available control pages which the user can select to open.

**Connection URLs**:
```
ws://192.168.1.100:8176/v2/api/ws/page-feed
wss://{REFLECTOR}.indigodomo.net/v2/api/ws/page-feed
```

### Rendering Control Pages in a Browser/WebView

To display a control page's rendered content, load the following URL in a browser or WKWebView:

```
http://192.168.1.100:8176/web/controlpage.html?id={pageID}
https://{REFLECTOR}.indigodomo.net/web/controlpage.html?id={pageID}
```

For example, a page with ID `963336187` would be:
```
https://{REFLECTOR}.indigodomo.net/web/controlpage.html?id=963336187
```

Authentication is required via `Authorization: Bearer {API_KEY}` header. In a WKWebView, inject the header using a `URLRequest`:

```swift
var request = URLRequest(url: url)
request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
webView.load(request)
```

### Control Page Object Structure

```json
{
  "class": "indigo.ControlPage",
  "backgroundImage": "",
  "description": "",
  "folderId": 0,
  "globalProps": {},
  "hideTabBar": true,
  "id": 963336187,
  "name": "Weather Images",
  "pluginProps": {},
  "remoteDisplay": true,
  "sharedProps": {}
}
```

### Refresh Control Pages

```json
{
  "message": "refresh",
  "objectType": "indigo.ControlPage"
}
```

### Add Control Page Message

Received when a new control page is added to the Indigo Server after the connection is opened, or when a control page's `remoteDisplay` property is changed from `false` to `true`.

```json
{
  "message": "add",
  "objectType": "indigo.ControlPage",
  "objectDict": { ... }
}
```

### Update Control Page Message (Patch)

Received when a control page has been updated on the Indigo server. Does not allow users to update control pages via the WebSocket API.

```json
{
  "message": "patch",
  "objectType": "indigo.ControlPage",
  "objectId": 963336187,
  "patch": [["change", "name", ["Old Name", "New Name"]]]
}
```

Patch objects use `dictdiffer` format. See the Object Patches section above for details on applying patches.

### Delete Control Page Message

Received when a control page is deleted from the Indigo server, or when a control page's `remoteDisplay` property is set from `true` to `false`.

```json
{
  "message": "delete",
  "objectType": "indigo.ControlPage",
  "objectId": 123456789
}
```

## Log Feed

**Special behavior**:
- Upon connection, receives last **25 chronological messages**
- Then receives real-time log updates
- Only accepts `"add"` messages (read-only for logs)

### Log Entry Message (received)

Each log entry arrives as an `"add"` message with the log data in `objectDict`:

```json
{
  "message": "add",
  "objectDict": {
    "message": "sent \"Living Room Pendant\" set brightness to 30",
    "timeStamp": "2026-02-23T20:47:10.617000",
    "typeStr": "Z-Wave",
    "typeVal": 8
  }
}
```

**objectDict fields** (all camelCase):

| Field | Type | Description |
|-------|------|-------------|
| `message` | String | The log message text |
| `timeStamp` | String | Timestamp in `yyyy-MM-dd'T'HH:mm:ss.SSSSSS` format (local server time, no timezone indicator). **Note the capital S** — this is camelCase `timeStamp`, not `timestamp`. |
| `typeStr` | String | Source/plugin name (e.g. `"Z-Wave"`, `"Web Server Warning"`, `"Heatmiser-Neo Error"`) |
| `typeVal` | Int | Log level numeric value (1 = error, 3 = warning, 8 = info) |

> **Important**: The WebSocket log feed uses **camelCase** keys (`timeStamp`, `typeStr`, `typeVal`), which differ from both the Python API's PascalCase (`TimeStamp`, `TypeStr`, `TypeVal`) and all-lowercase conventions. The `typeStr` suffix indicates severity: names ending in `"Error"` are errors, `"Warning"` are warnings, `"Debug"` are debug messages.

### Send Log Message

```json
{
  "message": "indigo.server.log",
  "messageText": "Custom log entry from external app"
}
```

## Object Folders

### Refresh Folder List

```json
{
  "message": "refresh",
  "objectType": "indigo.Device.Folder"
}
```

Response:
```json
{
  "message": "refresh",
  "objectType": "indigo.Device.Folder",
  "list": [
    {"id": 123, "name": "Living Room", "remoteDisplay": true},
    {"id": 456, "name": "Bedroom", "remoteDisplay": true}
  ]
}
```

**Other folder types**:
- `"indigo.Variable.Folder"`
- `"indigo.ActionGroup.Folder"`

## Error Handling

### Generic Error Response

```json
{
  "error": "Error description",
  "errorId": "error-code"
}
```

### Connection Failures

**Causes**:
- Authentication failure
- Server not reachable
- Network timeout

**Best Practice**: Implement reconnection logic with exponential backoff

```python
import asyncio

async def connect_with_retry(uri, headers, max_retries=5):
    retry_delay = 1
    for attempt in range(max_retries):
        try:
            ws = await websockets.connect(uri, extra_headers=headers)
            return ws
        except Exception as e:
            if attempt < max_retries - 1:
                await asyncio.sleep(retry_delay)
                retry_delay *= 2  # Exponential backoff
            else:
                raise
```

## Complete Example (Python)

```python
import asyncio
import websockets
import json

API_KEY = "your_api_key"
REFLECTOR = "your_reflector"

async def monitor_devices():
    uri = f"wss://{REFLECTOR}.indigodomo.net/v2/api/ws/device-feed"
    headers = {'Authorization': f'Bearer {API_KEY}'}

    async with websockets.connect(uri, extra_headers=headers) as ws:
        # Request all devices
        await ws.send(json.dumps({
            "message": "refresh",
            "objectType": "indigo.Device"
        }))

        # Process messages
        async for message in ws:
            data = json.loads(message)

            if data["message"] == "refresh":
                devices = data.get("list", [])
                print(f"Received {len(devices)} devices")

            elif data["message"] == "add":
                device = data["objectDict"]
                print(f"Device added: {device['name']}")

            elif data["message"] == "patch":
                print(f"Device {data['objectId']} updated")
                for change in data["patch"]:
                    op, prop, values = change
                    if op == "change":
                        print(f"  {prop}: {values[0]} → {values[1]}")

            elif data["message"] == "delete":
                print(f"Device {data['objectId']} removed")

asyncio.run(monitor_devices())
```

## Complete Example (JavaScript/Node.js)

```javascript
const WebSocket = require('ws');

const API_KEY = 'your_api_key';
const REFLECTOR = 'your_reflector';

const ws = new WebSocket(`wss://${REFLECTOR}.indigodomo.net/v2/api/ws/device-feed`, {
  headers: { 'Authorization': `Bearer ${API_KEY}` }
});

ws.on('open', function() {
  // Request all devices
  ws.send(JSON.stringify({
    message: 'refresh',
    objectType: 'indigo.Device'
  }));
});

ws.on('message', function(data) {
  const msg = JSON.parse(data);

  if (msg.message === 'refresh') {
    console.log(`Received ${msg.list.length} devices`);
  } else if (msg.message === 'add') {
    console.log(`Device added: ${msg.objectDict.name}`);
  } else if (msg.message === 'patch') {
    console.log(`Device ${msg.objectId} updated`);
  } else if (msg.message === 'delete') {
    console.log(`Device ${msg.objectId} removed`);
  }
});

ws.on('error', function(error) {
  console.error('WebSocket error:', error);
});
```

## Best Practices

1. **Connection Management**: Implement automatic reconnection with exponential backoff
2. **Message Tracking**: Use optional `id` field to track request/response pairs
3. **Patch Handling**: Use dictdiffer library to apply patches efficiently
4. **Error Logging**: Log all errors with context for debugging
5. **Resource Cleanup**: Always close WebSocket connections properly
6. **Rate Limiting**: Don't send commands faster than devices can process
7. **Object Caching**: Maintain local copy of objects, apply patches incrementally

## Related Documentation

- **[Device Commands](device-commands.md)** - All available device commands
- **[HTTP API](http-api.md)** - Alternative REST API
- **[Authentication](authentication.md)** - Setup and security
- **[Overview](overview.md)** - When to use WebSocket vs HTTP
