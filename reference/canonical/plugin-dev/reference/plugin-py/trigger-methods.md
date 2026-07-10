<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/reference/plugin-py/trigger-methods/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Trigger Specific Methods

## didTriggerProcessingPropertyChange() { .ref-head data-toc-label="didTriggerProcessingPropertyChange" }

Much like it's device counterpart above (`didDeviceCommPropertyChange()`), this method gets called by the default implementation of `triggerUpdated()` to determine if any of the properties needed for recognizing an event have changed. The default implementation checks for any changes to any properties.

<span class="ca">**Method**</span>  

| Method Name                                                                                    | Required |
|------------------------------------------------------------------------------------------------|----------|
| <span class="nw cb">`didTriggerProcessingPropertyChange(self, origTrigger, newTrigger)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter                                | Description                                                           |
|------------------------------------------|-----------------------------------------------------------------------|
| <span class="nw cb">`origTrigger`</span> | an `indigo.Trigger` object representing the trigger before the change |
| <span class="nw cb">`newTrigger`</span>  | an `indigo.Trigger` object representing the trigger after the change  |

<span class="ca">**Return Value:**</span>

| Type | Description                                                              |
|------|--------------------------------------------------------------------------|
| bool | True if processing-relevant trigger properties changed; False otherwise. |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span>

```python
def didTriggerProcessingPropertyChange(self, origTrigger, newTrigger):
    some_property_changed = (origTrigger['some_prop'] == newTrigger['some_prop'])
    if some_property_changed:
        # Implement any actions required if your target property changed.
        return True
    else:
        return False
```

## triggerCreated() { .ref-head data-toc-label="triggerCreated" }

This method will get called whenever a new trigger defined by your plugin is created. In many circumstances, you won't need to implement this method since the default behavior (which is to call the `triggerStartProcessing()` method if it's your trigger, and it's enabled) is what you want anyway (see the `triggerStartProcessing()` method above for details). However, if for some reason you need to know when a trigger is created, but before your plugin is asked to start watching for the appropriate conditions, this method can provide that hook. If you implement this method, you'll need to either call `triggerStartProcessing()` or duplicate the functionality here.

You can also have this method called for triggers that don't belong to your plugin. If, for instance, you want to know when all triggers are created (and updated/deleted), you can call the `indigo.triggers.subscribeToChanges()` method to have the IndigoServer send all trigger creation/update/deletion notifications. As with other change subscriptions, this should be used very sparingly since it's a lot of overhead both for your plugin and, more importantly, for the IndigoServer.

<span class="ca">**Method**</span>  

| Method Name                                                | Required |
|------------------------------------------------------------|----------|
| <span class="nw cb">`triggerCreated(self, trigger)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter                            | Description                                                          |
|--------------------------------------|----------------------------------------------------------------------|
| <span class="nw cb">`trigger`</span> | an `indigo.Trigger` object representing the trigger that was created |

<span class="ca">**Return Value:**</span>

| Type | Description                          |
|------|--------------------------------------|
| None | This method does not return a value. |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span>

```python
def triggerCreated(self, trigger):
    self.triggerStartProcessing(trigger)
```

## triggerDeleted() { .ref-head data-toc-label="triggerDeleted" }

Complementary to the `triggerCreated()` method described above, but signals trigger deletes. The default implementation just checks to see if the trigger belongs to your plugin and if so calls the `triggerStopProcessing()` method. If you implement this method you'll need to call `triggerStopProcessing()` yourself or duplicate the functionality here.

<span class="ca">**Method**</span>  

| Method Name                                                | Required |
|------------------------------------------------------------|----------|
| <span class="nw cb">`triggerDeleted(self, trigger)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter                            | Description                                                          |
|--------------------------------------|----------------------------------------------------------------------|
| <span class="nw cb">`trigger`</span> | an `indigo.Trigger` object representing the trigger that was deleted |

<span class="ca">**Return Value:**</span>

| Type | Description                          |
|------|--------------------------------------|
| None | This method does not return a value. |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span>

```python
def triggerDeleted(self, trigger):
    self.triggerStopProcessing(trigger)
```

## triggerStartProcessing() { .ref-head data-toc-label="triggerStartProcessing" }

If your plugin defines events, this is likely the place where you'll want to do the work to start watching for those events to occur. For instance, let's say that you have an event for a plugin update, then you'll want to periodically check your site to see if there's a new version available. This is where you'd start that process. When conditions are met in your plugin for a trigger to be executed, you would call indigo.trigger.execute(triggerReference) to tell the Server to execute the trigger (and it's conditions).

<span class="ca">**Method**</span>  

| Method Name                                                        | Required |
|--------------------------------------------------------------------|----------|
| <span class="nw cb">`triggerStartProcessing(self, trigger)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter                            | Description                                         |
|--------------------------------------|-----------------------------------------------------|
| <span class="nw cb">`trigger`</span> | an `indigo.Trigger` object representing the trigger |

<span class="ca">**Return Value:**</span>

| Type | Description                          |
|------|--------------------------------------|
| None | This method does not return a value. |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span>

```python
def triggerStartProcessing(self, trigger):
    self.active_triggers[trigger.id] = trigger
```

## triggerStopProcessing() { .ref-head data-toc-label="triggerStopProcessing" }

This is the complementary method to `triggerStartProcessing()` - it gets called when the event should no longer be active/enabled. For instance, when the user disables or deletes a trigger, this method gets called.

<span class="ca">**Method**</span>  

| Method Name                                                       | Required |
|-------------------------------------------------------------------|----------|
| <span class="nw cb">`triggerStopProcessing(self, trigger)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter                            | Description                                         |
|--------------------------------------|-----------------------------------------------------|
| <span class="nw cb">`trigger`</span> | an `indigo.Trigger` object representing the trigger |

<span class="ca">**Return Value:**</span>

| Type | Description                          |
|------|--------------------------------------|
| None | This method does not return a value. |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span>

```python
def triggerStopProcessing(self, trigger):
    if trigger.id in self.active_triggers:
        del self.active_triggers[trigger.id]
```

## triggerUpdated() { .ref-head data-toc-label="triggerUpdated" }

Complementary to the `triggerCreated()` method described above, but signals trigger updates. You'll get a copy of the old trigger object as well as the new trigger object. The default implementation of this method will do a few things for you: if either the old or new trigger are triggers defined by you, and if the trigger type changed OR the communication-related properties have changed (as defined by the `didTriggerProcessingPropertyChange()` method - see above for details) then `triggerStopProcessing()` and `triggerStartProcessing()` methods will be called as necessary.

<span class="ca">**Method**</span>  

| Method Name                                                                | Required |
|----------------------------------------------------------------------------|----------|
| <span class="nw cb">`triggerUpdated(self, origTrigger, newTrigger)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter                                | Description                                                           |
|------------------------------------------|-----------------------------------------------------------------------|
| <span class="nw cb">`origTrigger`</span> | an `indigo.Trigger` object representing the trigger before the change |
| <span class="nw cb">`newTrigger`</span>  | an `indigo.Trigger` object representing the trigger after the change  |

<span class="ca">**Return Value:**</span>

| Type | Description                          |
|------|--------------------------------------|
| None | This method does not return a value. |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span>

```python
def triggerUpdated(self, origTrigger, newTrigger):
    indigo.PluginBase.triggerUpdated(self, origTrigger, newTrigger)
```
