# HTTP API

Complete reference for Indigo's HTTP/REST API - stateless request/response model for device control, data retrieval, and command execution.

## Quick Reference

| Endpoint | Method | Purpose | Example |
|----------|--------|---------|---------|
| `/v2/api/indigo.devices` | GET | Get all devices | List all devices |
| `/v2/api/indigo.devices/{id}` | GET | Get single device | Get device details |
| `/v2/api/indigo.variables` | GET | Get all variables | List all variables |
| `/v2/api/indigo.variables/{id}` | GET | Get single variable | Get variable value |
| `/v2/api/indigo.actionGroups` | GET | Get all action groups | List action groups |
| `/v2/api/indigo.actionGroups/{id}` | GET | Get single action group | Get action group details |
| `/v2/api/command` | POST | Execute command | Control devices, update variables |

**Base URLs**:
- Local: `http://192.168.1.100:8176`
- Remote (Reflector): `https://{REFLECTOR}.indigodomo.net`

## Authentication

All requests require authentication via `Authorization` header:

```http
Authorization: Bearer YOUR_API_KEY
```

See [authentication.md](authentication.md) for complete setup guide.

## Device Endpoints

### Get All Devices

**Request**:
```http
GET /v2/api/indigo.devices
Authorization: Bearer API_KEY
```

**Python Example**:
```python
import requests

url = "https://REFLECTOR.indigodomo.net/v2/api/indigo.devices"
headers = {'Authorization': f'Bearer {API_KEY}'}

response = requests.get(url, headers=headers)
devices = response.json()

for device in devices:
    print(f"{device['name']}: {device['onState']}")
```

**Response**:
```json
[
  {
    "id": 123456789,
    "name": "Living Room Light",
    "class": "indigo.DimmerDevice",
    "onState": true,
    "brightness": 75,
    "remoteDisplay": true,
    ...
  },
  ...
]
```

### Get Single Device

**Request**:
```http
GET /v2/api/indigo.devices/123456789
Authorization: Bearer API_KEY
```

**curl Example**:
```bash
curl -H "Authorization: Bearer API_KEY" \
  https://REFLECTOR.indigodomo.net/v2/api/indigo.devices/123456789
```

**Response**:
```json
{
  "id": 123456789,
  "name": "Living Room Light",
  "class": "indigo.DimmerDevice",
  "onState": true,
  "brightness": 75,
  "deviceTypeId": "dimmer",
  "folderId": 0,
  "remoteDisplay": true,
  ...
}
```

### Control Device via Command Endpoint

**Request**:
```http
POST /v2/api/command
Authorization: Bearer API_KEY
Content-Type: application/json

{
  "message": "indigo.device.toggle",
  "objectId": 123456789
}
```

**Python Example**:
```python
import requests
import json

url = "https://REFLECTOR.indigodomo.net/v2/api/command"
headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}
data = {
    "message": "indigo.device.toggle",
    "objectId": 123456789,
    "id": "my-tracking-id"  # Optional
}

response = requests.post(url, headers=headers, data=json.dumps(data))
print(response.json())
```

**JavaScript/Fetch Example**:
```javascript
const url = 'https://REFLECTOR.indigodomo.net/v2/api/command';
const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
};
const body = JSON.stringify({
  message: 'indigo.dimmer.setBrightness',
  objectId: 123456789,
  parameters: {
    value: 50,
    delay: 0
  }
});

fetch(url, { method: 'POST', headers, body })
  .then(response => response.json())
  .then(data => console.log(data));
```

**curl Example**:
```bash
curl -X POST \
  -H "Authorization: Bearer API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "indigo.device.turnOn", "objectId": 123456789}' \
  https://REFLECTOR.indigodomo.net/v2/api/command
```

## Variable Endpoints

### Get All Variables

**Request**:
```http
GET /v2/api/indigo.variables
Authorization: Bearer API_KEY
```

**Response**:
```json
[
  {
    "id": 345633244,
    "name": "house_status",
    "value": "home",
    "readOnly": false,
    "class": "indigo.Variable",
    ...
  },
  ...
]
```

### Get Single Variable

**Request**:
```http
GET /v2/api/indigo.variables/345633244
Authorization: Bearer API_KEY
```

### Update Variable Value

**Request**:
```http
POST /v2/api/command
Authorization: Bearer API_KEY
Content-Type: application/json

{
  "message": "indigo.variable.updateValue",
  "objectId": 345633244,
  "parameters": {
    "value": "away"
  }
}
```

**Important**: Variable values must be **strings**. Use empty string `""` to clear value.

**Python Example**:
```python
import requests
import json

url = "https://REFLECTOR.indigodomo.net/v2/api/command"
headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}
data = {
    "message": "indigo.variable.updateValue",
    "objectId": 345633244,
    "parameters": {"value": "away"}
}

response = requests.post(url, headers=headers, data=json.dumps(data))
```

## Action Group Endpoints

### Get All Action Groups

**Request**:
```http
GET /v2/api/indigo.actionGroups
Authorization: Bearer API_KEY
```

**Response**:
```json
[
  {
    "id": 94914463,
    "name": "Movie Night",
    "class": "indigo.ActionGroup",
    "remoteDisplay": true,
    ...
  },
  ...
]
```

### Get Single Action Group

**Request**:
```http
GET /v2/api/indigo.actionGroups/94914463
Authorization: Bearer API_KEY
```

### Execute Action Group

**Request**:
```http
POST /v2/api/command
Authorization: Bearer API_KEY
Content-Type: application/json

{
  "message": "indigo.actionGroup.execute",
  "objectId": 94914463
}
```

**curl Example**:
```bash
curl -X POST \
  -H "Authorization: Bearer API_KEY" \
  -H "Content-Type": application/json" \
  -d '{"message": "indigo.actionGroup.execute", "objectId": 94914463}' \
  https://REFLECTOR.indigodomo.net/v2/api/command
```

## Command Endpoint Details

### Request Format

```json
{
  "message": "command.name",      // Required: command to execute
  "objectId": 123456789,          // Required: target object ID
  "parameters": {                 // Optional: command parameters
    "key": "value"
  },
  "id": "tracking-id"             // Optional: for request tracking
}
```

### Response Format

**Success**:
```json
{
  "success": true,
  "id": "tracking-id"  // if you provided one
}
```

**Error**:
```json
{
  "error": "Error description",
  "errorId": "error-code",
  "id": "tracking-id"
}
```

### Available Commands

See [device-commands.md](device-commands.md) for complete command reference.

**Common Commands**:
- `indigo.device.toggle` - Toggle device on/off
- `indigo.device.turnOn` - Turn device on
- `indigo.device.turnOff` - Turn device off
- `indigo.dimmer.setBrightness` - Set dimmer level
- `indigo.variable.updateValue` - Update variable value
- `indigo.actionGroup.execute` - Run action group

## Data Types

### JSON ↔ Python Conversion

| Python | JSON | Example |
|--------|------|---------|
| `True` | `true` | `"onState": true` |
| `False` | `false` | `"onState": false` |
| `None` | `null` | `"value": null` |
| `dict` | Object | `{"key": "value"}` |
| `list` | Array | `[1, 2, 3]` |
| `str` | String | `"text"` |
| `int/float` | Number | `42` or `3.14` |

## Error Handling

### Common HTTP Status Codes

| Code | Meaning | Cause |
|------|---------|-------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid JSON or missing required fields |
| 401 | Unauthorized | Invalid or missing API key |
| 404 | Not Found | Object ID doesn't exist |
| 500 | Server Error | Internal Indigo error |

### Error Response Example

```json
{
  "error": "Device not found",
  "errorId": "device_not_found",
  "id": "your-tracking-id"
}
```

### Python Error Handling

```python
try:
    response = requests.post(url, headers=headers, data=json.dumps(command))
    response.raise_for_status()  # Raises HTTPError for bad status
    result = response.json()

    if "error" in result:
        print(f"Command failed: {result['error']}")
    else:
        print("Command successful")

except requests.exceptions.HTTPError as e:
    print(f"HTTP error: {e}")
except requests.exceptions.ConnectionError as e:
    print(f"Connection error: {e}")
except json.JSONDecodeError as e:
    print(f"Invalid JSON response: {e}")
```

## Performance Considerations

### Polling vs WebSocket

**HTTP Polling**:
- Simple to implement
- Higher overhead (new connection per request)
- Polling delay for updates
- Good for: Periodic checks (every few minutes)

**WebSocket**:
- Real-time updates
- Single persistent connection
- Lower overhead for frequent updates
- Good for: Continuous monitoring

**Recommendation**: Use HTTP for occasional commands, WebSocket for monitoring.

### Rate Limiting

**Best Practices**:
- Don't poll faster than once per second
- Batch multiple commands when possible
- Use WebSocket for real-time monitoring
- Cache responses when appropriate

### Request Optimization

```python
# Good: Reuse session
import requests

session = requests.Session()
session.headers.update({'Authorization': f'Bearer {API_KEY}'})

# Make multiple requests
devices = session.get(f'{BASE_URL}/indigo.devices').json()
variables = session.get(f'{BASE_URL}/indigo.variables').json()

# Bad: Create new session each time
# requests.get(...) creates new connection every time
```

## Complete Examples

### Python Script

```python
import requests
import json

API_KEY = "your_api_key"
REFLECTOR = "your_reflector"
BASE_URL = f"https://{REFLECTOR}.indigodomo.net/v2/api"

# Setup session with auth
session = requests.Session()
session.headers.update({
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
})

# Get all devices
devices = session.get(f'{BASE_URL}/indigo.devices').json()
print(f"Found {len(devices)} devices")

# Find specific device
light = next(d for d in devices if 'Light' in d['name'])
print(f"Device: {light['name']}, State: {light['onState']}")

# Control device
command = {
    "message": "indigo.dimmer.setBrightness",
    "objectId": light['id'],
    "parameters": {"value": 50}
}
response = session.post(f'{BASE_URL}/command', data=json.dumps(command))
print(f"Command result: {response.json()}")
```

### Shell Script (curl)

```bash
#!/bin/bash

API_KEY="your_api_key"
REFLECTOR="your_reflector"
BASE_URL="https://$REFLECTOR.indigodomo.net/v2/api"

# Get all devices
curl -H "Authorization: Bearer $API_KEY" \
  "$BASE_URL/indigo.devices" | jq '.'

# Toggle device
curl -X POST \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "indigo.device.toggle", "objectId": 123456789}' \
  "$BASE_URL/command"
```

## Related Documentation

- **[Device Commands](device-commands.md)** - Complete command reference
- **[WebSocket API](websocket-api.md)** - Real-time alternative
- **[Authentication](authentication.md)** - Setup and security
- **[Overview](overview.md)** - Choosing the right API
