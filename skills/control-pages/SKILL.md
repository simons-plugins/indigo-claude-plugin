---
name: control-pages
description: Indigo control page building guidance
match:
  - "**/*.textClipping"
  - "**/ControlPage*"
  - "**/control-page*"
  - "**/control_page*"
---

# Indigo Control Pages

You're working on Indigo control pages. Key resources available:

## Quick Reference

- **Workflow (5 phases)**: Read `docs/control-pages/workflow.md`
- **XML structure**: Read `docs/control-pages/schema/control-page.md`
- **Page elements**: Read `docs/control-pages/schema/page-elements.md`
- **Actions**: Read `docs/control-pages/schema/actions.md`
- **Enums**: Read `docs/control-pages/schema/enums.md`
- **Device images**: Read `docs/control-pages/images/device-images.md`
- **Screen sizes**: Read `docs/control-pages/layouts/sizing.md`
- **Templates**: Read `docs/control-pages/layouts/templates.md`
- **Export**: Read `docs/control-pages/export/clipping-export.md`

## Essential Rules

- Use 2x (retina) images for new pages
- `ClientActionType` 1014 for dimmers/thermostats (popup control)
- Empty ActionGroup for display-only elements (sensors)
- Dark theme background: `19 19 19`
- Generate unique IDs using random integers

## Export Tool

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/tools/create_clipping.py" input.xml output.textClipping
```

## Full Documentation

For the guided builder workflow, use `/indigo:control-pages`.
