---
name: api-integration
description: Indigo WebSocket and HTTP API integration guidance
match:
  - "**/WebSocketService*"
  - "**/IndigoAPI*"
  - "**/IndigoWebSocket*"
  - "**/indigo_api*"
  - "**/indigo_ws*"
---

# Indigo API Integration

You're working on code that integrates with Indigo's APIs. Key resources available:

## Quick Reference

- **WebSocket vs HTTP decision**: Read `docs/api/overview.md`
- **Authentication (API keys, local secrets)**: Read `docs/api/authentication.md`
- **WebSocket API (real-time, bidirectional)**: Read `docs/api/websocket-api.md`
- **HTTP API (REST, stateless)**: Read `docs/api/http-api.md`
- **Device commands**: Read `docs/api/device-commands.md`

## Key Patterns

- **Real-time apps** (iOS, dashboards): Use WebSocket for live device updates
- **Scripts/automation**: Use HTTP API with curl/requests
- **Hybrid**: HTTP for initial load, WebSocket for live updates
- **Auth**: API Keys (recommended) or Local Secrets (local network only)

## Full Documentation

For comprehensive guidance, use `/indigo:api`.
