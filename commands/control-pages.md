---
name: control-pages
description: Indigo control page builder — guided XML generation with wireframes and export
---

# Indigo Control Page Builder

**Plugin**: https://github.com/simons-plugins/indigo-claude-plugin
**Slash command**: `/indigo:control-pages`

## Description

Guided builder for Indigo home automation Control Pages. Designs layouts
with ASCII wireframes, generates valid Indigo XML, and exports ready-to-import
.textClipping files.

## User Preferences

On command load, read `control-pages.local.md` (in this plugin's root directory). If it doesn't exist, create it with the default content shown in `docs/control-pages/workflow.md` (User Preferences section). This file contains YAML frontmatter with user defaults for screen size, style, theme, and layout. Use these defaults in Phase 2 instead of asking questions — tell the user which defaults are being applied and offer to override.

## CRITICAL: Context Optimization Strategy

**DO NOT load all files.** Load docs selectively based on current workflow phase.

### Phase-Based Loading

| Current Phase | Load These Files |
|---------------|-----------------|
| Starting (any request) | `docs/control-pages/workflow.md`, `control-pages.local.md` (if exists) |
| DISCOVER (finding devices) | `docs/control-pages/workflow.md` (Phase 1 section) |
| PLAN (asking questions) | `docs/control-pages/workflow.md` (Phase 2 section), `docs/control-pages/layouts/sizing.md` |
| WIREFRAME (designing layout) | `docs/control-pages/layouts/templates.md`, `docs/control-pages/layouts/sizing.md` |
| BUILD (generating XML) | `docs/control-pages/schema/control-page.md`, `docs/control-pages/schema/page-elements.md`, `docs/control-pages/schema/actions.md`, `docs/control-pages/schema/enums.md` |
| BUILD (choosing images) | `docs/control-pages/images/device-images.md` |
| BUILD (external/camera images) | `docs/control-pages/images/external-images.md` |
| EXPORT (creating file) | `docs/control-pages/export/clipping-export.md` |

### Query Routing

| User Says | Load |
|-----------|------|
| "Create a control page" | `docs/control-pages/workflow.md` → start Phase 1 |
| "What images are available?" | `docs/control-pages/images/device-images.md` |
| "Show me templates" | `docs/control-pages/layouts/templates.md` |
| "What screen sizes?" | `docs/control-pages/layouts/sizing.md` |
| "How do I import?" | `docs/control-pages/export/clipping-export.md` |
| "What XML properties?" | `docs/control-pages/schema/page-elements.md` |
| "What actions can I use?" | `docs/control-pages/schema/actions.md` |
| "What are the enum values?" | `docs/control-pages/schema/enums.md` |
| "Show me static images" | `docs/control-pages/images/static-images.md` |
| "Variable images?" | `docs/control-pages/images/variable-images.md` |
| "External images?" / "Camera feed" / "Auto-refresh image" | `docs/control-pages/images/external-images.md` |
| "Plugin actions?" / "Sonos controls" | `docs/control-pages/schema/actions.md` (Class 999) |
| "What are my preferences?" | `control-pages.local.md` |

## Workflow Overview

5 phases: DISCOVER → PLAN → WIREFRAME → BUILD → EXPORT

1. Query devices via MCP (`search_entities`, `get_devices_by_type`) or database fallback
2. Ask user about room, devices, screen size, style
3. Generate ASCII wireframe, iterate with user
4. Convert to Indigo XML with real device IDs
5. Create .textClipping file for drag-and-drop import

## Quick Mode

Experienced users can say "Create a control page for the living room with
the ceiling light, floor lamp, and thermostat on iPhone" — skip straight
to wireframing with sensible defaults.

## Documentation Structure

```
docs/control-pages/
├── workflow.md                    # 5-phase guided process
├── schema/
│   ├── control-page.md            # ControlPage XML structure
│   ├── page-elements.md           # PageElem types & properties
│   ├── actions.md                 # ActionGroup/Action classes
│   └── enums.md                   # All enumeration values
├── images/
│   ├── device-images.md           # Device state images catalog
│   ├── static-images.md           # Buttons, tiles, arrows
│   ├── variable-images.md         # Variable indicators
│   └── external-images.md         # External file:/// images with auto-refresh
├── layouts/
│   ├── templates.md               # Pre-built room templates
│   └── sizing.md                  # Screen sizes, spacing, grid
└── export/
    └── clipping-export.md         # Export process + script docs

tools/
└── create_clipping.py             # .textClipping generator

examples/
└── *.textClipping                 # Example control pages
```

## Export: Creating .textClipping Files

Use the `create_clipping.py` tool to generate importable .textClipping files:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/tools/create_clipping.py" input.xml output.textClipping
```

Or read `docs/control-pages/export/clipping-export.md` for the manual export process.

## Best Practices

- Always use 2x (retina) images for new pages
- Use `ClientActionType` 1014 for dimmers and thermostats (popup control)
- Use empty ActionGroup for display-only elements (sensors)
- Generate unique IDs for pages and elements using random integers
- Dark theme (`19 19 19` background) is the standard Indigo look
- Test with a simple page first before building complex layouts

## Related Commands

- `/indigo:dev` — Server-side plugin development
- `/indigo:api` — Client-side API integration (WebSocket, HTTP)
