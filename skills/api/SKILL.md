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
| Third-party integration | HTTP | Standard request/response, easy to integrate |
| Hybrid apps | Both | HTTP for initial load, WebSocket for live updates |

## Authentication

Both APIs authenticate with **HTTP Digest, API Keys, or local secrets** (canonical `api/http.md`, `api/websocket.md`).

- **API Keys** (recommended) — managed in your Indigo Account → **Authorizations** (not "API Keys"), per-app and revocable. Send as `Authorization: Bearer <api-key>`, or as an `?api-key=<key>` query arg when headers aren't available. Keys can control devices but **cannot modify the database** (add/delete devices) — that stays with the username/password.
- **Local secrets** — a *special kind of API key* that does not route through the Indigo reflector; used identically as a Bearer token. Also managed under Authorizations.
- **HTTP Basic** and the **old REST API** are **deprecated** — do not use.

## HTTP Quick Reference

**GET** retrieves object instances; **POST to `/v2/api/command`** sends every command. There is **no `PUT`** and no per-object write endpoint.

```
GET  /v2/api/indigo.devices          # List all devices
GET  /v2/api/indigo.devices/<id>     # Get one device (full object; there is no ?detail flag)
GET  /v2/api/indigo.variables[/<id>] # Variables
GET  /v2/api/indigo.actionGroups[/<id>]
POST /v2/api/command                 # ALL commands (device control, variable update, action execute)
```

## Command Message Shape (both transports)

Commands use `message` + `objectId` (+ optional `parameters`) — **not** `name`/`parameters.id`. Command names are namespaced (`indigo.device.*`, `indigo.dimmer.*`, `indigo.thermostat.*`). See `api/messages.md`.

```json
{"message": "indigo.device.turnOn",  "objectId": 123456789}
{"message": "indigo.device.toggle",  "objectId": 123456789, "parameters": {"delay": 5, "duration": 10}}
{"message": "indigo.dimmer.setBrightness", "objectId": 123456789, "parameters": {"value": 75}}
{"message": "indigo.thermostat.setHeatSetpoint", "objectId": 123456789, "parameters": {"value": 72}}
```

## WebSocket Quick Reference

Connect to a **specific feed**, not a bare `/v2/api/ws`. Seven feeds:
`device-feed`, `variable-feed`, `action-feed`, `schedule-feed`, `trigger-feed`, `page-feed`, `log-feed`.

```
ws[s]://<host>:<port>/v2/api/ws/device-feed?api-key=<key>
```

- **Get current state**: send a `refresh` message (there is no "subscribe"):
  ```json
  {"id": "req-1", "message": "refresh", "objectType": "indigo.Device", "objectId": 123456789}
  ```
  Omit `objectId` to receive the whole list.
- **Incoming**: read `add` / `patch` / `delete` / `refresh` messages and apply them.
- **Commands**: send the same `message`/`objectId` envelope as HTTP.
- **Reconnection**: exponential backoff with jitter.

## Reference Documentation (canonical — load only what's needed)

Vendored verbatim from Indigo's published docs. Read relative to `${CLAUDE_PLUGIN_ROOT}`:

| Topic | File |
|-------|------|
| Integration APIs overview / transport choice | `reference/canonical/api.md` |
| HTTP API (endpoints, auth, curl/Python) | `reference/canonical/api/http.md` |
| Message format (commands, events, errors) | `reference/canonical/api/messages.md` |
| WebSocket API (feeds, refresh, patches) | `reference/canonical/api/websocket.md` |
| Webhooks (receiving external events) | `reference/canonical/api/webhooks.md` |
| Migrating from the old REST API | `reference/canonical/api/rest-migration.md` |
| Full canonical index (all pages) | `reference/canonical/INDEX.md` |

## Full Documentation

For comprehensive guidance with workflow examples, use `/indigo:api`.
