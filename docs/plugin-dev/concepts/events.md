# Custom Plugin Events — field notes

Undocumented Indigo event behaviour learned in the field — **not** covered by the canonical
reference. For `Events.xml`, the event ConfigUI, the `triggerStartProcessing` /
`triggerStopProcessing` lifecycle, and event data, use the canonical docs (routed from
`/indigo:dev`): `reference/canonical/plugin-dev/reference/xml/events.md` and
`reference/canonical/plugin-dev/reference/plugin-py/trigger-methods.md`.

## Common mistake — methods that don't exist

Two patterns look like they should fire custom events but **do not** —
both raise `AttributeError`:

```python
# ❌ WRONG — does not exist on indigo.server / ServerInfo
indigo.server.fireEvent("myEvent")

# ❌ WRONG — NOT a built-in on PluginBase
# (ZwaveLockManager defines its own custom method with this name,
# which misleads anyone who copy-pastes from there)
self.triggerEvent("myEvent")
```

The correct pattern is the `triggerStartProcessing` / `triggerStopProcessing`
lifecycle plus `indigo.trigger.execute(trigger_object)`:

```python
def __init__(self, ...):
    self.event_triggers = {}   # trigger.id -> trigger object

def triggerStartProcessing(self, trigger):
    self.event_triggers[trigger.id] = trigger

def triggerStopProcessing(self, trigger):
    self.event_triggers.pop(trigger.id, None)

def fire_event(self, event_id):
    """Iterate registered triggers and execute the matching ones."""
    for trigger in self.event_triggers.values():
        if trigger.pluginTypeId == event_id:
            indigo.trigger.execute(trigger)
```

The `AttributeError` is easy to miss because it's typically caught by a broad
`except Exception` in the calling code and swallowed at debug level. A custom
event silently never fires until someone notices the trigger was never
configured. Always log trigger-execute failures at ERROR.

## See Also

- Events.xml + event ConfigUI: `reference/canonical/plugin-dev/reference/xml/events.md`
- Trigger callbacks (`triggerStartProcessing`/`triggerStopProcessing`): `reference/canonical/plugin-dev/reference/plugin-py/trigger-methods.md`
