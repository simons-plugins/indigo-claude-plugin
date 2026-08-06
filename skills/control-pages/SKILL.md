---
name: control-pages
description: >-
  This skill should be used when the user asks to "build a control page",
  "create an Indigo dashboard", "design a control page layout", "export a control page",
  "create a .textClipping file", "add device controls to a page", "build a room view",
  "create a lighting control page", "design a thermostat page", "make a home dashboard",
  or is working on Indigo control page XML files or .textClipping files.
  Provides control page XML generation guidance with layout, actions, and export.
match:
  - "**/*.textClipping"
  - "**/ControlPage*"
  - "**/control-page*"
  - "**/control_page*"
---

# Indigo Control Pages

Control pages are XML-defined touch interfaces for Indigo, displayed on iOS/macOS clients. They contain device controls, status displays, and navigation elements.

## Core Concepts

- **Pages** contain positioned **Elements** (icons, text, images)
- **Elements** reference **Devices** and trigger **Actions** on tap
- Pages are sized for specific screens (iPhone, iPad, etc.)
- Export as `.textClipping` files for drag-and-drop import into Indigo

## Element Types

| Element | Use For | Key Property |
|---------|---------|--------------|
| Device icon | Controllable devices | `DeviceId` + `ClientActionType` |
| Variable text | Display variable values | `VariableId` |
| Static text | Labels, headings | `DisplayText` |
| Image | Backgrounds, icons | `ImageName` |
| Navigation | Page links | `LinkedPageName` |

## Action Types (ClientActionType)

| Value | Action | Use For |
|-------|--------|---------|
| 0 | None | Display-only elements |
| 1001 | Toggle on/off | Relays, switches |
| 1014 | Popup control | Dimmers, thermostats (slider/setpoint) |
| 1020 | Execute action group | Scenes, macros |

## Essential Rules

- Use 2x (retina) images for all new pages, but check the file exists first —
  older images such as `lightbulb_large` have no 2x variant, and a missing
  image renders as a bare caption. Pick from `docs/control-pages/images/`, or
  confirm against `Web Assets/images/controls/devices/`
- `ClientActionType` 1014 for dimmers/thermostats (popup control)
- Empty `ActionGroup` element for display-only sensors
- Dark theme background: `19 19 19`
- Generate unique element IDs using random integers
- Position elements using `Left`/`Top` coordinates (points, not pixels)

## User Preferences

Read `${CLAUDE_PLUGIN_ROOT}/control-pages.local.md` for user-configured defaults:
- Screen size presets and default screen
- Theme colors and typography
- Icon sizes and layout preferences

## Export Tool

```bash
cat input.xml | python3 "${CLAUDE_PLUGIN_ROOT}/tools/create_clipping.py" output.textClipping
```

The script takes the output path as its only positional argument and reads the
XML from stdin, or from `--xml` as a string. See
`docs/control-pages/export/clipping-export.md` for the full argument list.

## Reference Documentation

For detailed guidance, read these files relative to `${CLAUDE_PLUGIN_ROOT}`:

| Topic | File |
|-------|------|
| 5-phase workflow | `docs/control-pages/workflow.md` |
| XML schema | `docs/control-pages/schema/control-page.md` |
| Page elements | `docs/control-pages/schema/page-elements.md` |
| Actions reference | `docs/control-pages/schema/actions.md` |
| Enum values | `docs/control-pages/schema/enums.md` |
| Device images | `docs/control-pages/images/device-images.md` |
| Screen sizing | `docs/control-pages/layouts/sizing.md` |
| Layout templates | `docs/control-pages/layouts/templates.md` |
| Clipping export | `docs/control-pages/export/clipping-export.md` |
| Control pages — the user-facing concept | `reference/canonical/user/concepts/control-pages.md` |

## Full Documentation

For the guided 5-phase builder workflow, use `/indigo:control-pages`.
