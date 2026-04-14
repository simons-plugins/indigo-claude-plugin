# INTEGRATIONS.md — External Integrations

## Claude Code Plugin Marketplace

This plugin is distributed via the Claude Code plugin marketplace.

- **Install command**: `/plugin install simons-plugins/indigo-claude-plugin`
- **Update command**: `/plugin update indigo`
- **Marketplace format**: `marketplace.json` in `.claude-plugin/` (standard Claude Code format)
- The `check-update.js` hook fetches `.claude-plugin/plugin.json` from the `main` branch of GitHub to compare versions on every session start

## GitHub

**Repo**: https://github.com/simons-plugins/indigo-claude-plugin

Used for:
- Source of truth for installs (Claude Code fetches from GitHub)
- PR-based release workflow with CI version-sync check
- Update checks: `hooks/check-update.js` fetches `https://raw.githubusercontent.com/simons-plugins/indigo-claude-plugin/main/.claude-plugin/plugin.json`

## Indigo MCP Server

The plugin's commands and skills instruct Claude to use Indigo MCP tools when available. These tools are provided by the `indigomcp` project (separate repo: https://github.com/mlamoure/indigo-mcp-server).

MCP tools referenced in commands/skills:

| Tool | Used By | Purpose |
|------|---------|---------|
| `mcp__indigo__list_devices` | `html-pages`, `control-pages` | Discover devices for page building |
| `mcp__indigo__get_devices_by_type` | `html-pages`, `control-pages` | Filter devices by type |
| `mcp__indigo__list_action_groups` | `html-pages`, `control-pages` | Find scenes |
| `mcp__indigo__list_variables` | `html-pages`, `control-pages` | List Indigo variables |
| `mcp__indigo__search_entities` | `control-pages` | Fuzzy device lookup |
| `mcp__indigo__restart_plugin` | `html-pages` (deploy phase) | Reload plugin after page deploy |

When MCP is unavailable, skills fall back to manual device ID entry by the user.

## Indigo Device Catalog

The `/indigo:api` command optionally reads from the `indigo-device-catalog` sibling project (https://github.com/simons-plugins/indigo-device-catalog) when installed in the workspace.

Paths used:
- `../indigo-device-catalog/catalog/by-class/<class>.json` — device capability profiles by class
- `../indigo-device-catalog/catalog/by-plugin/_index.json` — index of device types per plugin
- `../indigo-device-catalog/catalog/_index.json` — full catalog index

This enables the API command to answer "what states does device X have?" without guessing.

## Indigo Server (Runtime Target)

Generated code, HTML pages, and control pages are deployed to an Indigo 2025.1 server. The standard development server is at `jarvis.local`.

Key paths on the server:
- Plugin bundles: `/Volumes/Macintosh HD-1/Library/Application Support/Perceptive Automation/Indigo 2025.1/Plugins/`
- Web Assets (user pages): Indigo Web Assets folder — outside any plugin bundle, survives plugin updates
- Plugin static files: `{Plugin.indigoPlugin}/Contents/Resources/static/` (plugin-authored content only)

## Indigo WebSocket + HTTP API

The `/indigo:api` command and `api` skill document and support Indigo's built-in APIs:

- **WebSocket API**: `ws[s]://<host>:<port>/v2/api/ws`
- **HTTP API**: `GET/PUT /v2/api/indigo.devices`, `POST /v2/api/command`
- **Auth**: Bearer token (`Authorization: Bearer <api-key>`) or local secrets

Command format: `POST /v2/api/command` with JSON body `{"name": "device.turnOn", "parameters": {"id": 123456}}`.

## Official Indigo Documentation (Referenced, Not Bundled)

Commands reference official docs at runtime (linked, not fetched):

| Resource | URL |
|----------|-----|
| Plugin Developer's Guide | https://wiki.indigodomo.com/doku.php?id=indigo_2025.1_documentation:plugin_guide |
| Object Model Reference | https://wiki.indigodomo.com/doku.php?id=indigo_2025.1_documentation:object_model_reference |
| API Documentation | https://wiki.indigodomo.com/doku.php?id=indigo_2025.1_documentation:api |
| Developer Forum | https://forums.indigodomo.com/viewforum.php?f=18 |
| Indigo Account Portal | https://www.indigodomo.com/account/ |

## context7 MCP

`mcp__plugin_context7_context7__*` tools are available in the environment but are not explicitly used by this plugin's commands or skills. They could be used by Claude when fetching third-party library docs during plugin development sessions.

## Sibling Workspace Projects

This plugin is consumed by every Indigo plugin project in the workspace:

| Project | How It Uses This Plugin |
|---------|------------------------|
| `UK-Trains/` | `/indigo:dev` for plugin development |
| `netro/` | `/indigo:dev` for plugin development |
| `heatmiser/` | `/indigo:dev` for plugin development |
| `indigo-domio-push/` | `/indigo:dev` for plugin development |
| `domio code/` | `/indigo:api` for WebSocket integration |
| All projects | `skills/dev` auto-activates on `.indigoPlugin` file patterns |
