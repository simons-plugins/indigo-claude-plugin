# Integration APIs Overview

Indigo 2025.1 provides two complementary APIs for external integration: **WebSocket API** for real-time monitoring and **HTTP API** for request/response interactions.

## Quick Comparison

| Feature | WebSocket API | HTTP API |
|---------|--------------|----------|
| **Connection** | Persistent, bidirectional | Stateless, request/response |
| **Updates** | Real-time push notifications | Must poll for changes |
| **Latency** | Instant (push) | Polling delay |
| **Overhead** | Single connection | Per-request connection |
| **Complexity** | Moderate (connection management) | Simple (HTTP requests) |
| **Best for** | Mobile apps, dashboards, continuous monitoring | Scripts, periodic checks, webhooks |
| **Libraries** | websockets, socket.io | requests, curl, fetch() |
| **Authentication** | Initial handshake | Per-request |
| **Bandwidth** | Efficient (only sends changes) | Higher (full responses) |

## When to Use Each API

### Use WebSocket API When...

✅ Building mobile apps (iOS/Android) that need live updates
✅ Creating web dashboards with real-time device status
✅ Monitoring continuous changes (temperature sensors, motion detectors)
✅ Need instant notifications when devices change state
✅ Building chat/voice assistant integrations
✅ Developing custom control interfaces

**Example Use Cases**:
- iOS app showing live device status with instant updates
- Web dashboard displaying real-time energy monitoring
- Custom notification system for security sensors
- Voice assistant integration (Alexa, Google Home custom skills)

### Use HTTP API When...

✅ Writing simple automation scripts
✅ Periodic polling (every few minutes/hours)
✅ One-off device control commands
✅ Integration with services that only support HTTP webhooks
✅ Quick prototyping and testing
✅ Non-real-time data collection

**Example Use Cases**:
- Cron job that checks device states hourly
- Webhook receiver that triggers Indigo actions
- Simple Python script to toggle lights
- Data export to external analytics platform

## Architecture Overview

### WebSocket API Architecture

```
┌─────────────┐                    ┌──────────────┐
│   Client    │◄───WebSocket───────│    Indigo    │
│   App       │                    │   Server     │
└─────────────┘                    └──────────────┘
      ▲                                    │
      │   1. Connect                       │
      │   2. Subscribe to feeds            │
      │   3. Receive push updates     ◄────┘
      │   4. Send commands            ─────►
      │   5. Connection stays open         │
```

**5 Specialized Feeds:**
- Device feed - Monitor/control devices
- Variable feed - Track variable changes
- Action group feed - Execute action groups
- Control page feed - Page management
- Log feed - Real-time logging

### HTTP API Architecture

```
┌─────────────┐                    ┌──────────────┐
│   Client    │────GET Request────►│    Indigo    │
│   Script    │◄───Response────────│   Server     │
└─────────────┘                    └──────────────┘
      │                                    ▲
      │   1. Send GET/POST                 │
      │   2. Receive response              │
      │   3. Connection closes             │
      └───────(repeat for next request)────┘
```

**Endpoints:**
- `/v2/api/indigo.devices` - Get/control devices
- `/v2/api/indigo.variables` - Get/update variables
- `/v2/api/indigo.actionGroups` - Execute action groups
- `/v2/api/command` - Generic command execution

## Getting Started Checklist

### Prerequisites (Both APIs)
- [ ] Indigo 2025.1 or later installed
- [ ] "Start Local Server" enabled in Indigo preferences
- [ ] API authentication enabled (OAuth/API Keys)
- [ ] API key created in Indigo Account portal
- [ ] Network access to Indigo server (local or via Reflector)

### For WebSocket Development
- [ ] WebSocket library installed (`pip install websockets` or `npm install websocket`)
- [ ] Understanding of async/event-driven programming
- [ ] Connection management strategy (reconnection on disconnect)
- [ ] Message parsing logic for add/patch/delete messages

### For HTTP Development
- [ ] HTTP library available (requests, curl, fetch, etc.)
- [ ] Basic understanding of REST APIs
- [ ] JSON parsing capability
- [ ] (Optional) Polling interval if monitoring changes

## Authentication

Both APIs support the same authentication methods:

**API Key Authentication (Recommended)**:
- Created in Indigo Account portal
- Include in `Authorization: Bearer {API_KEY}` header
- Can be revoked instantly if compromised
- Granular permission control

**Local Secrets (Local Network Only)**:
- Pre-shared secret in Indigo preferences
- Only for trusted local network clients
- No per-user tracking

→ See [authentication.md](authentication.md) for complete setup guide

## Connection Security

### Local Network
- `ws://` or `http://` - Unencrypted (use cautiously)
- Direct connection to Indigo server IP
- Fast, low latency
- Only use on trusted networks

### Remote Access (Indigo Reflector)
- `wss://` or `https://` - TLS encrypted (recommended)
- Connection via `{REFLECTOR}.indigodomo.net`
- Secure over internet
- Slightly higher latency

→ See [authentication.md](authentication.md) for security best practices

## Next Steps

1. **Choose your API** based on use case above
2. **Set up authentication**: [authentication.md](authentication.md)
3. **Start developing**:
   - WebSocket: [websocket-api.md](websocket-api.md)
   - HTTP: [http-api.md](http-api.md)
4. **Command reference**: [device-commands.md](device-commands.md)

## API Feature Parity

While both APIs provide access to core Indigo functionality (devices, variables, action groups), there are some differences:

### Known Differences:
- **Folders**: HTTP API includes folder objects; WebSocket handles folders differently
- **Command Availability**: Some commands may be specific to one transport
- **Data Structure**: Response formats are generally consistent but may vary in edge cases

**Recommendation:** For critical functionality, test with your target transport to verify command availability. The official Indigo wiki may not fully document all differences.

## Can I Use Both?

**Yes!** Many applications combine both APIs:

**Example: Web Dashboard**
- HTTP GET on page load to get initial device list
- WebSocket connection for real-time updates
- HTTP POST for commands (or use WebSocket)

**Example: Monitoring with Alerts**
- WebSocket for real-time monitoring
- HTTP webhook to trigger external alerts

**Best Practice**: Use WebSocket for monitoring, HTTP for occasional commands or as fallback.

## Related Documentation

- **[WebSocket API Reference](websocket-api.md)** - Complete WebSocket documentation
- **[HTTP API Reference](http-api.md)** - Complete HTTP documentation
- **[Authentication Guide](authentication.md)** - Setup and security
- **[Device Commands](device-commands.md)** - All available commands
- **[Indigo Object Model](../indigo-object-model.md)** - Understanding device objects
