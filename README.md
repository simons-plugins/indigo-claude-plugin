# Indigo Claude Code Plugin

Claude Code plugin for [Indigo](https://www.indigodomo.com) home automation development. Provides commands (explicit invocation) and skills (auto-activation) for plugin development, API integration, page building, and server maintenance.

## Commands

| Command | Description |
|---------|-------------|
| `/indigo:dev` | Plugin development — SDK docs, examples, lifecycle, IOM reference |
| `/indigo:api` | API integration — WebSocket and HTTP APIs for client apps |
| `/indigo:control-pages` | Control page builder — guided XML generation with wireframes |
| `/indigo:html-pages` | HTML dashboard builder — self-contained pages with live device controls |
| `/indigo:update-plugins` | Bulk plugin updater — diff installed plugins against GitHub releases and the Indigo store, then apply upgrades with confirmation |

## Skills (Auto-Activation)

Skills activate automatically when working on relevant files:

- **plugin-dev** — Activates for `.indigoPlugin/` directories, `plugin.py`, `Devices.xml`, `Actions.xml`
- **api-integration** — Activates for WebSocket/HTTP integration code targeting Indigo
- **control-pages** — Activates for control page XML and `.textClipping` files

## Installation

  # 1. Add the marketplace                                                                                                                                                                         
  /plugin marketplace add simons-plugins/indigo-claude-plugin                           
                                                                                                                                                                                                   
  # 2. Install the plugin                                                               
  /plugin install indigo@simons-plugins/indigo-claude-plugin                                                                                                                                       
                                                                                        
  # 3. Reload to activate    
  /reload-plugins    

## Documentation

- `docs/plugin-dev/` — Plugin development guides, concepts, API reference
- `docs/api/` — WebSocket and HTTP API integration docs
- `docs/control-pages/` — Control page schema, images, layouts, export
- `reference/` — SDK reference documents and migration guide
- `sdk-examples/` — 16 complete SDK example plugins
- `snippets/` — Plugin templates
- `examples/` — Control page .textClipping examples
- `tools/` — Utility scripts (e.g., create_clipping.py)

## Related

- [Indigo](https://www.indigodomo.com) — Home automation platform for macOS
- [Plugin Developer's Guide](https://wiki.indigodomo.com/doku.php?id=indigo_2025.1_documentation:plugin_guide)
- [Developer Forum](https://forums.indigodomo.com/viewforum.php?f=18)

## License

MIT
