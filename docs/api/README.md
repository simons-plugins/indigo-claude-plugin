# Integration APIs

External integration with Indigo via WebSocket and HTTP APIs for building custom applications, iOS/Android apps, web dashboards, and third-party service integrations.

## Files in This Section

| File | Purpose | Size | When to Load |
|------|---------|------|--------------|
| [overview.md](overview.md) | API comparison and decision guide | ~3KB | When choosing WebSocket vs HTTP |
| [authentication.md](authentication.md) | API keys, OAuth, security setup | ~4KB | When setting up authentication |
| [websocket-api.md](websocket-api.md) | WebSocket API complete reference | ~6KB | For real-time monitoring questions |
| [http-api.md](http-api.md) | HTTP/REST API complete reference | ~5KB | For REST API questions |
| [device-commands.md](device-commands.md) | All device command messages | ~6KB | For command reference |

## Quick Task Lookup

| I want to... | Read this file |
|--------------|----------------|
| Build an iOS/web app for Indigo | [overview.md](overview.md) |
| Decide between WebSocket and HTTP | [overview.md](overview.md) |
| Set up API authentication | [authentication.md](authentication.md) |
| Secure my API connection | [authentication.md](authentication.md) |
| Monitor devices in real-time | [websocket-api.md](websocket-api.md) |
| Subscribe to device changes | [websocket-api.md](websocket-api.md) |
| Control a device from REST API | [http-api.md](http-api.md) |
| Get all devices via HTTP | [http-api.md](http-api.md) |
| Turn on a light via API | [device-commands.md](device-commands.md) |
| Set dimmer brightness | [device-commands.md](device-commands.md) |
| Send any device command | [device-commands.md](device-commands.md) |

## Overview

Indigo provides two primary integration APIs:

### WebSocket API
**Best for:** Real-time monitoring, mobile apps, live dashboards

- Persistent bidirectional connection
- Real-time device/variable/action group updates
- 5 specialized feeds (devices, variables, action groups, control pages, logs)
- Automatic push notifications when state changes
- Efficient for continuous monitoring

→ See [websocket-api.md](websocket-api.md)

### HTTP API
**Best for:** Simple automation scripts, periodic polling, RESTful integrations

- Stateless request/response model
- Standard GET/POST endpoints
- Easy to use with curl, Python requests, etc.
- Perfect for one-off commands or periodic checks
- Lower overhead for occasional access

→ See [http-api.md](http-api.md)

## Getting Started

1. **Choose your API**: Read [overview.md](overview.md) to decide WebSocket vs HTTP
2. **Set up authentication**: Follow [authentication.md](authentication.md) to get API keys
3. **Connect and test**: Use examples in [websocket-api.md](websocket-api.md) or [http-api.md](http-api.md)
4. **Send commands**: Reference [device-commands.md](device-commands.md) for all available commands

## Common Use Cases

### iOS/Android App
- Use WebSocket API for real-time device monitoring
- Subscribe to device feed for instant updates
- Send commands via WebSocket for immediate control
→ [websocket-api.md](websocket-api.md) + [device-commands.md](device-commands.md)

### Web Dashboard
- WebSocket for live status updates
- HTTP for initial page load
- Display real-time device states
→ [websocket-api.md](websocket-api.md) + [http-api.md](http-api.md)

### Automation Script
- HTTP API for simple periodic checks
- curl or Python requests library
- Turn devices on/off based on conditions
→ [http-api.md](http-api.md) + [device-commands.md](device-commands.md)

### Third-Party Integration
- HTTP webhooks for triggering Indigo actions
- WebSocket for monitoring Indigo events
- Bidirectional integration with external services
→ Both APIs

## Related Documentation

- **[Indigo Object Model](../indigo-object-model.md)** - Understanding device/variable objects
- **[Plugin Development](../../concepts/)** - Building Indigo plugins (server-side)
- **[Examples](../../examples/)** - SDK examples for plugin development

## For Claude (Context Optimization)

**Total size**: ~26KB across 6 files - never load all files at once.

**Routing rules**:
- General integration questions → Load [overview.md](overview.md) first
- WebSocket questions → Load [websocket-api.md](websocket-api.md)
- HTTP/REST questions → Load [http-api.md](http-api.md)
- Authentication/security → Load [authentication.md](authentication.md)
- Command reference → Load [device-commands.md](device-commands.md)
- "Should I use..." questions → Load [overview.md](overview.md)

**Safe to always load**: This README (~2KB)

**Cross-references**: Integration docs use same device/variable object structure as Indigo Object Model docs. If user asks about object properties, also load `../plugin-dev/api/iom/devices.md` or relevant IOM file.
