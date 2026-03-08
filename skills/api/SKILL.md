---
name: api
description: >-
  This skill should be used when the user asks to "connect to Indigo API",
  "control Indigo devices remotely", "use Indigo WebSocket", "use Indigo HTTP API",
  "send commands to Indigo server", "authenticate with Indigo", "get device status",
  "build an Indigo client app", "subscribe to device changes", "monitor Indigo devices",
  "build a dashboard for Indigo", "integrate with Indigo REST API", or is working on
  WebSocket/HTTP client code that communicates with an Indigo home automation server.
  Provides API integration guidance for both WebSocket and HTTP protocols.
match:
  - "**/WebSocketService*"
  - "**/IndigoAPI*"
  - "**/IndigoWebSocket*"
  - "**/indigo_api*"
  - "**/indigo_ws*"
  - "**/indigo*client*"
  - "**/indigo*connection*"
---

# Indigo API Integration

Indigo exposes two transport APIs for remote control. Choose based on use case:

## Transport Selection

| Use Case | Transport | Why |
|----------|-----------|-----|
| iOS/mobile apps | WebSocket | Real-time device updates, bidirectional |
| Web dashboards | WebSocket | Live state without polling |
| Scripts/automation | HTTP | Simple, stateless, one-shot commands |
| Third-party integration | HTTP | Standard REST, easy to integrate |
| Hybrid apps | Both | HTTP for initial load, WebSocket for live updates |

## Authentication

Two methods available:

- **API Keys** (recommended) — Works over network, configured in Indigo preferences
  - Header: `Authorization: Bearer <api-key>`
- **Local Secrets** — Local network only, auto-generated per-reflector
  - Only for same-machine or trusted LAN access

## WebSocket Quick Reference

```
ws[s]://<host>:<port>/v2/api/ws
```

- **Subscribe**: Send `{"name": "device", "id": <deviceId>}` to receive state changes
- **Commands**: Send actions via WebSocket messages
- **Reconnection**: Implement exponential backoff with jitter

## HTTP Quick Reference

```
GET  /v2/api/indigo.devices         # List all devices
GET  /v2/api/indigo.devices/<id>    # Get specific device
PUT  /v2/api/indigo.devices/<id>    # Update device
POST /v2/api/command                # Execute command
```

All responses are JSON. Use `?detail=true` for full state information.

## Common Device Commands

```json
// Turn on
{"name": "device.turnOn", "parameters": {"id": 123456}}

// Set brightness
{"name": "device.setBrightness", "parameters": {"id": 123456, "value": 75}}

// Set thermostat
{"name": "thermostat.setHeatSetpoint", "parameters": {"id": 123456, "value": 72}}
```

## Reference Documentation

For detailed guidance, read these files relative to `${CLAUDE_PLUGIN_ROOT}`:

| Topic | File |
|-------|------|
| WebSocket vs HTTP overview | `docs/api/overview.md` |
| Authentication setup | `docs/api/authentication.md` |
| WebSocket API (full) | `docs/api/websocket-api.md` |
| HTTP REST API (full) | `docs/api/http-api.md` |
| Device command reference | `docs/api/device-commands.md` |
| API navigation guide | `docs/api/README.md` |

## Full Documentation

For comprehensive guidance with workflow examples, use `/indigo:api`.
