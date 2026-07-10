# Actions & Action Handling — field notes

Undocumented Indigo action behaviour learned in the field — **not** covered by the canonical
reference. For `Actions.xml`, action ConfigUI, the standard device-action callbacks
(relay/dimmer/thermostat/sensor/sprinkler/speed/universal), and validation, use the canonical docs
(routed from `/indigo:dev`): `reference/canonical/plugin-dev/reference/xml/actions.md` and
`reference/canonical/plugin-dev/reference/plugin-py/device-methods.md`.

## `uiPath` attribute — PascalCase, no spaces

When you group Plugin actions under a sub-menu in Indigo's UI via
`uiPath="..."` on `<Action>` or `<MenuItem>`, the value MUST be PascalCase
with no spaces and no punctuation. Spaces cause an
`NSInternalInconsistencyException` crash in the Indigo client (confirmed
2026-04-30 during SigenEnergyManager development).

```xml
<!-- Correct -->
<Action id="setHeatSetpoint" uiPath="DeviceActions">
<Action id="readMeter"        uiPath="EnergyActions">

<!-- Wrong — crashes the Indigo client -->
<Action id="setHeatSetpoint" uiPath="Device Actions">
<Action id="readMeter"        uiPath="Energy Actions">

<!-- Special — Indigo's reserved literal for "no menu shown" -->
<Action id="internalAction" uiPath="hidden">
```

`uiPath="hidden"` is the documented reserved value that hides the action
from the user-visible Action picker (e.g. for actions only invoked from
Plugin code via `executeAction`).

## Calling another Plugin's actions

`indigo.server.getPlugin(plugin_id).executeAction(action_id, props=...)`
lets you invoke actions exposed by other installed Plugins. Two things
must match exactly what the target Plugin declares in its `Actions.xml`:

1. **The action ID** — the `id` attribute on the `<Action>` element, not
   the user-facing menu name.
2. **The prop names** — the `id` of every `<Field>` inside the action's
   `<ConfigUI>`. A typo or guessed name is silently dropped during
   cross-Plugin serialization; the action runs with missing data and no
   error is raised.

Always read the target Plugin's `Actions.xml` to confirm both. Don't
infer the action ID from the menu label, and don't guess prop names
from what feels natural ("title", "message" etc.) — they are whatever
that Plugin's author chose.

If Indigo exposes a direct server API for the same operation (e.g.
`indigo.server.sendEmailTo(...)`), prefer it over routing through
`getPlugin(...).executeAction(...)` — fewer moving parts and no prop-
serialization layer to misbehave.

## See Also

- Actions.xml + action ConfigUI: `reference/canonical/plugin-dev/reference/xml/actions.md`
- `actionControlDevice` and device-action callbacks: `reference/canonical/plugin-dev/reference/plugin-py/device-methods.md`
- Device field notes: [devices.md](devices.md)
