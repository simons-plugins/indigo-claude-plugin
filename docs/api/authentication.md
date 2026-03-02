# Authentication

Complete guide to authenticating with Indigo's WebSocket and HTTP APIs using API keys and local secrets.

## Quick Reference

| Method | Security | Use Case | Revocable | Setup Location |
|--------|----------|----------|-----------|----------------|
| **API Key** | High | Production, remote access | Yes | Indigo Account portal |
| **Local Secret** | Medium | Trusted local network only | No | Indigo preferences |
| **HTTP Basic** | Low | DEPRECATED - do not use | No | - |

**Recommendation**: Use API Keys for all integrations.

## Prerequisites

1. **Enable Local Server**: Indigo → Preferences → "Start Local Server"
2. **Enable API Authentication**: Check "OAuth and API Key authentication" in server dialog
3. **Get Reflector ID** (for remote access): Note your `{REFLECTOR}.indigodomo.net` address

## API Key Authentication (Recommended)

### Creating an API Key

1. Visit [Indigo Account Portal](https://www.indigodomo.com/account/)
2. Log in with your Indigo account
3. Navigate to "API Keys" section
4. Click "Create New API Key"
5. Name your key (e.g., "iOS App", "Home Dashboard")
6. Set permissions (device control, variable access, etc.)
7. **Save the key immediately** - it won't be shown again

### Using API Keys

**Header Authentication (Best Practice)**:

```python
# Python
import requests

headers = {
    'Authorization': f'Bearer {API_KEY}'
}
response = requests.get('https://REFLECTOR.indigodomo.net/v2/api/indigo.devices', headers=headers)
```

```javascript
// JavaScript
const headers = {
  'Authorization': `Bearer ${API_KEY}`
};

fetch('https://REFLECTOR.indigodomo.net/v2/api/indigo.devices', { headers })
  .then(response => response.json())
  .then(data => console.log(data));
```

```bash
# curl
curl -H "Authorization: Bearer API_KEY" \
  https://REFLECTOR.indigodomo.net/v2/api/indigo.devices
```

**Query Parameter (Alternative)**:

```
https://REFLECTOR.indigodomo.net/v2/api/indigo.devices?api-key=YOUR_API_KEY
```

⚠️ **Warning**: Query parameters may appear in logs. Use header authentication when possible.

### WebSocket with API Key

```python
import websockets
import json

async def connect():
    uri = f"wss://REFLECTOR.indigodomo.net/v2/api/ws/device-feed"
    headers = {
        'Authorization': f'Bearer {API_KEY}'
    }

    async with websockets.connect(uri, extra_headers=headers) as websocket:
        # Connected - start using WebSocket
        await websocket.send(json.dumps({
            "message": "refresh",
            "objectType": "indigo.Device"
        }))
```

```javascript
// JavaScript (browser or Node.js with ws library)
const WebSocket = require('ws');

const ws = new WebSocket('wss://REFLECTOR.indigodomo.net/v2/api/ws/device-feed', {
  headers: {
    'Authorization': `Bearer ${API_KEY}`
  }
});

ws.on('open', function() {
  // Connected
  ws.send(JSON.stringify({
    message: 'refresh',
    objectType: 'indigo.Device'
  }));
});
```

### API Key Best Practices

✅ **DO**:
- Use separate keys for different applications
- Name keys descriptively ("Production iOS App", "Dev Dashboard")
- Revoke compromised keys immediately
- Store keys securely (environment variables, keychain)
- Use header authentication over query parameters
- Rotate keys periodically for sensitive applications

❌ **DON'T**:
- Share keys publicly (forums, GitHub, etc.)
- Hardcode keys in source code
- Use same key for dev and production
- Include keys in client-side JavaScript (use backend proxy)

### Revoking API Keys

1. Return to Indigo Account Portal
2. Find the compromised key
3. Click "Revoke"
4. Key is immediately invalidated across all connections

## Local Secrets

**Use only for trusted local network devices**.

### Setup

1. Indigo → Preferences → "Start Local Server"
2. Enter a shared secret in "Local Secret" field
3. Click "Save"

### Using Local Secrets

Same as API key authentication - use the local secret as the Bearer token:

```python
headers = {
    'Authorization': f'Bearer {LOCAL_SECRET}'
}
```

### Local Secret Limitations

- Cannot be revoked without changing for all clients
- No per-application tracking
- Less secure than individual API keys
- Only recommended for fully trusted local devices

## Connection Security

### Local Network Access

**Unencrypted (ws:// or http://)**:
```
ws://192.168.1.100:8176/v2/api/ws/device-feed
http://192.168.1.100:8176/v2/api/indigo.devices
```

✅ Pros: Fast, low latency
❌ Cons: **No encryption** - credentials and data visible on network

**When to use**: Only on fully trusted networks (home network with WPA2/WPA3 encryption)

### Remote Access (Indigo Reflector)

**Encrypted (wss:// or https://)**:
```
wss://REFLECTOR.indigodomo.net/v2/api/ws/device-feed
https://REFLECTOR.indigodomo.net/v2/api/indigo.devices
```

✅ Pros: **TLS encryption**, secure over internet
❌ Cons: Slightly higher latency

**When to use**: All remote access, mobile apps, public internet

### Security Recommendations

1. **Use HTTPS/WSS** for all remote connections
2. **Use API Keys** instead of local secrets
3. **Enable OAuth** in server preferences
4. **Firewall rules**: Only expose Indigo server if using Reflector
5. **Monitor access**: Check Indigo logs for unauthorized attempts
6. **Revoke unused keys**: Remove old API keys for retired applications

## Troubleshooting

### "Authentication Failed" Error

**Causes**:
1. API key not enabled in server preferences
2. Invalid or revoked API key
3. Missing `Authorization` header
4. Typo in API key

**Solutions**:
- Verify "OAuth and API Key authentication" is checked
- Regenerate API key in portal
- Check header format: `Authorization: Bearer {KEY}` (note the space)
- Test with curl to isolate issue

### "Connection Refused" Error

**Causes**:
1. Local server not started
2. Firewall blocking port 8176
3. Incorrect IP address or Reflector ID

**Solutions**:
- Verify "Start Local Server" is enabled in preferences
- Check firewall allows port 8176 (local) or 443 (Reflector)
- Confirm Reflector ID at https://www.indigodomo.com/account/

### WebSocket Connection Drops Immediately

**Causes**:
1. Authentication failure
2. Server preference disables WebSocket
3. Network issue

**Solutions**:
- Check WebSocket error message for authentication failure
- Verify API key has correct permissions
- Test HTTP endpoint first to isolate WebSocket-specific issues

## Example: Secure Production Setup

```python
# .env file (never commit to git)
INDIGO_API_KEY=your_production_api_key_here
INDIGO_REFLECTOR=your_reflector_id

# Python app
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('INDIGO_API_KEY')
REFLECTOR = os.getenv('INDIGO_REFLECTOR')

# Always use HTTPS for production
BASE_URL = f'https://{REFLECTOR}.indigodomo.net/v2/api'
HEADERS = {'Authorization': f'Bearer {API_KEY}'}

# Make requests
response = requests.get(f'{BASE_URL}/indigo.devices', headers=HEADERS)
```

## Related Documentation

- **[WebSocket API](websocket-api.md)** - Using authentication with WebSocket
- **[HTTP API](http-api.md)** - Using authentication with HTTP
- **[Overview](overview.md)** - Choosing the right API
