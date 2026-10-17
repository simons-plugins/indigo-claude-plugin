# ConfigUI dialogs: layout and live updates (field notes)

These are undocumented Indigo ConfigUI behaviours learned in the field. The canonical reference
does **not** cover them. For the field types, their attributes and validation, use the canonical
docs (routed from `/indigo:dev`): `reference/canonical/plugin-dev/reference/xml/configui.md` and
its `configui/` subpages.

## The label column is as wide as the longest Label

Every field's `<Label>` sits in a left-hand column, and **the longest Label in the dialog sets
that column's width**. A single sentence-long Label pushes every control in the dialog into a
narrow strip on the right: menus, text fields, and list fields. The usual offender is a
checkbox, because its Label is often written as the whole sentence.

Verified live on Indigo 2025.2 (2026-10-17, indigo-matter's "Replace a Matter node…" dialog).
With checkbox Labels like "Also remove the old node from Indigo's Matter fabric (harmless if
it no longer answers).", the preview list was pinned to the right and cut every row at about 28
characters. Shortening the Labels moved every control left and widened them.

The fix is to keep Labels short and put the explanation in `<Description>`, which Indigo shows
beside or under the control:

```xml
<!-- Wrong: the whole sentence as the Label -->
<Field id="confirm" type="checkbox" defaultValue="false">
    <Label>I understand the duplicate devices on the new node will be deleted.</Label>
</Field>

<!-- Right: a short Label, with the sentence in Description -->
<Field id="confirm" type="checkbox" defaultValue="false">
    <Label>Confirm:</Label>
    <Description>The duplicate devices on the new node will be deleted.</Description>
</Field>
```

Grey step headings (`type="label"` with `fontColor="darkgray"`, e.g. "1 · Pick a device") also
group a long dialog without widening the label column.

## A list field has no width or alignment setting

`type="list"` has `rows` (minimum and default 4) and nothing else that controls its size or
position. An empty `<Label></Label>` does **not** widen it; it stays in the control column.
If list rows are truncated, either shorten the longest Label (see above) or shorten the row
text.

## Updating a dialog while it is open

A `type="label"` field's text cannot change while the dialog is open. Two mechanisms do work:

1. **A dynamic list reloads.** `<List class="self" method="…" dynamicReload="true"/>` is
   called again when another field's `CallbackMethod` fires. A read-only list can therefore
   act as a live preview.
2. **A `CallbackMethod` can return a modified `valuesDict`.** That sets other fields' values,
   hidden ones included. Combine it with `visibleBindingId` / `visibleBindingValue` (a
   *contains* string match) to show or hide fields based on something the plugin computed:

```xml
<Field id="shapeDiffers" type="textfield" hidden="true" defaultValue="false"/>
<Field id="matchingOnly" type="checkbox" defaultValue="false"
       visibleBindingId="shapeDiffers" visibleBindingValue="true"
       alwaysUseInDialogHeightCalc="true">
    <Label>Matching only:</Label>
    <Description>Shown only when the two choices differ.</Description>
</Field>
```

```python
def pickerChanged(self, valuesDict, typeId="", devId=0):
    valuesDict["shapeDiffers"] = "true" if self._differs(valuesDict) else "false"
    return valuesDict
```

Treat the hidden field as cosmetic. The final validation or callback must recompute the
answer rather than trust it, because the value can be stale.

`alwaysUseInDialogHeightCalc="true"` sizes the dialog for the field even while it is hidden,
so the dialog doesn't clip it when it appears.

## See also

- ConfigUI fields: `reference/canonical/plugin-dev/reference/xml/configui.md` (+ `configui/`)
- Validation: `reference/canonical/plugin-dev/reference/xml/configui/validation.md`
- Menu items: `reference/canonical/plugin-dev/reference/xml/menuitems.md`
