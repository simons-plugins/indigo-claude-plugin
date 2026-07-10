# Plugin Preferences — field notes

Undocumented Indigo preference behaviour learned in the field — **not** covered by the canonical
reference. For `PluginConfig.xml`, reading/writing `pluginPrefs`, validation, and the change
callbacks, use the canonical docs (routed from `/indigo:dev`):
`reference/canonical/plugin-dev/reference/xml/pluginconfig.md`.

## Hidden Preferences

Store values not shown in the config UI by convention-prefixing the key with `_`:

```python
def startup(self):
    # Read hidden prefs
    self.last_sync = self.pluginPrefs.get("_lastSync", None)

def _after_sync(self):
    # Store hidden prefs
    self.pluginPrefs["_lastSync"] = str(datetime.now())
    self.pluginPrefs["_syncCount"] = self.pluginPrefs.get("_syncCount", 0) + 1
```

> **⚠️ The `_` prefix convention applies to `self.pluginPrefs` only — NOT to
> device-level `dev.pluginProps`.**
>
> Plugin-level prefs (`self.pluginPrefs[...] = ...`) accept underscore-prefixed
> keys because they're written via direct dict mutation. Device-level
> `dev.pluginProps` written via `replacePluginPropsOnServer()` go through
> Indigo's XML serialiser which rejects keys starting with `_`:
>
> ```python
> # Fine — direct dict, no XML validation
> self.pluginPrefs["_lastSync"] = "..."
>
> # FAILS with LowLevelBadParameterError -- illegal XML tag name character
> new_props = dict(dev.pluginProps)
> new_props["_dynamicKeys"] = "..."
> dev.replacePluginPropsOnServer(new_props)
>
> # Right — same intent, valid name
> new_props["dynamicKeys"] = "..."
> dev.replacePluginPropsOnServer(new_props)
> ```

See [devices.md](devices.md) for the device-level `pluginProps`/state-ID validation rules.

## See Also

- PluginConfig.xml, reading/writing prefs, validation: `reference/canonical/plugin-dev/reference/xml/pluginconfig.md`
- Device field notes: [devices.md](devices.md)
