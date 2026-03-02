---
name: api
description: Indigo API integration expert — WebSocket and HTTP APIs for client apps
---

# Indigo Integration APIs Expert

**Plugin**: https://github.com/simons-plugins/indigo-claude-plugin
**Slash command**: `/indigo:api`

## Description

Expert assistant for building applications that integrate with Indigo home automation via WebSocket and HTTP APIs. Perfect for iOS/Android apps, web dashboards, and third-party service integrations.

**Note**: This command is for **client-side development** (apps that connect TO Indigo). For **server-side plugin development** (building Indigo plugins), use `/indigo:plugin` instead.

## CRITICAL: Context Optimization Strategy

This command provides focused API documentation (~50KB). Load selectively based on query type.

### All Files (Load by Topic)

| File | Size | Use For |
|------|------|---------|
| `docs/api/README.md` | 5KB | Navigation and quick lookup |
| `docs/api/overview.md` | 7KB | WebSocket vs HTTP decision |
| `docs/api/authentication.md` | 7KB | API key setup and security |
| `docs/api/websocket-api.md` | 10KB | WebSocket API reference |
| `docs/api/http-api.md` | 11KB | HTTP/REST API reference |
| `docs/api/device-commands.md` | 12KB | Complete command reference |

**Total**: ~52KB across 6 files - load selectively.

## Query Routing Guide

### General Integration Questions

**"Build iOS/web app" / "Get started with Indigo API"**
1. Read `docs/api/overview.md` (WebSocket vs HTTP decision)
2. Read `docs/api/authentication.md` (API key setup)

**"Should I use WebSocket or HTTP?"**
1. Read `docs/api/overview.md`

### WebSocket API Questions

**"Monitor devices in real-time" / "WebSocket API" / "Live updates"**
1. Read `docs/api/websocket-api.md`
2. If auth needed: Read `docs/api/authentication.md`

### HTTP API Questions

**"Control via REST API" / "HTTP endpoints" / "curl examples"**
1. Read `docs/api/http-api.md`
2. If auth needed: Read `docs/api/authentication.md`

### Command Reference Questions

**"What commands can I send?" / "Device commands" / "Control devices"**
1. Read `docs/api/device-commands.md`

### Authentication Questions

**"Setup API keys" / "Authentication" / "Security"**
1. Read `docs/api/authentication.md`

### Device Capability Catalog

**"What can device X do?" / "How do I control a [plugin] thermostat?" / "What states does a Shelly device have?"**

If the user has the `indigo-device-catalog` installed (check for `../indigo-device-catalog/catalog/` relative to the workspace):
1. Read the relevant class file (e.g., `../indigo-device-catalog/catalog/by-class/thermostat.json`)
2. Find the profile matching the `pluginId` and `deviceTypeId`
3. Use `capabilities` to determine which controls are available
4. Use `states` to know what data the device exposes

**"What device types does plugin X support?"**
1. Read `../indigo-device-catalog/catalog/by-plugin/_index.json`

**"What base classes are available?" / "Show all device types"**
1. Read `../indigo-device-catalog/catalog/_index.json`

**Catalog repo**: https://github.com/simons-plugins/indigo-device-catalog

## Workflow Examples

### Building an iOS App

**User**: "I want to build an iOS app that shows my Indigo devices in real-time"

1. Read `docs/api/overview.md` - Explain WebSocket is best for real-time
2. Read `docs/api/authentication.md` - Show API key setup
3. Read `docs/api/websocket-api.md` - Provide connection example
4. Read `docs/api/device-commands.md` - Show control commands

### Building a Web Dashboard

**User**: "Create a web dashboard to control my lights"

1. Read `docs/api/overview.md` - Suggest HTTP for initial load, WebSocket for updates
2. Read `docs/api/authentication.md` - API key setup
3. Read `docs/api/http-api.md` - Show GET /devices endpoint
4. Read `docs/api/websocket-api.md` - Real-time updates
5. Read `docs/api/device-commands.md` - Control commands

### Simple Automation Script

**User**: "I want to turn off all lights via curl script"

1. Read `docs/api/http-api.md` - Show curl examples
2. Read `docs/api/authentication.md` - Header authentication
3. Read `docs/api/device-commands.md` - turnOff command

## Key Concepts

### Two APIs Available

1. **WebSocket API** - Real-time, bidirectional, persistent connection
   - Best for: Mobile apps, live dashboards, continuous monitoring
   - Use when: Need instant updates when devices change

2. **HTTP API** - Stateless, request/response, standard REST
   - Best for: Scripts, webhooks, periodic checks
   - Use when: Occasional commands or polling is acceptable

### Command Messages Across Transports

The APIs share most command messages (documented in `device-commands.md`), though some commands may be specific to one transport:
- WebSocket sends commands via persistent connection
- HTTP sends commands via POST to `/v2/api/command`

### Authentication

Both APIs use **API Keys** or **Local Secrets**:
- API Keys: Created in Indigo Account portal, per-app, revocable
- Local Secrets: Shared secret in Indigo preferences, local network only

## Common Use Cases

### iOS/Android App
- WebSocket API for real-time device status
- Send commands via WebSocket
- Files: `websocket-api.md`, `authentication.md`, `device-commands.md`

### Web Dashboard
- HTTP for initial page load
- WebSocket for live updates
- Files: `http-api.md`, `websocket-api.md`, `device-commands.md`

### Automation Script
- HTTP API with curl/requests
- Simple polling or command execution
- Files: `http-api.md`, `device-commands.md`

### Third-Party Integration
- Webhooks receive HTTP POST
- WebSocket for monitoring Indigo events
- Files: `http-api.md`, `websocket-api.md`

## External Resources

- [Official API Documentation](https://wiki.indigodomo.com/doku.php?id=indigo_2025.1_documentation:api)
- [Indigo Forum](https://forums.indigodomo.com/)
- [Indigo Account Portal](https://www.indigodomo.com/account/) - Create API keys

## Related Commands

- `/indigo:plugin` — Server-side plugin development
- `/indigo:control-pages` — Control page builder
