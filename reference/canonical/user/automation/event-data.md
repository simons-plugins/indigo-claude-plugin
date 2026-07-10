<!-- GENERATED from https://docs.indigodomo.com/2025.2/user/automation/event-data/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Events Data Passing

!!! abstract "In this guide"
    How Indigo passes structured data from the event that fired — trigger details, device state changes, plugin metadata — to Python scripts and action groups. Covers the default `event_data` dictionary keys, plugin-specific additions, accessing data in embedded scripts, and chaining data through action group calls.

Many users ask, "How do I know what caused an action to fire?" Our server architecture never passed through any source data before. But, now we do! All built-in triggers and schedules now pass through data that's specific to the event. Here are the basics.

Events now pass an *`indigo.Dict`* that contains data about the firing event, be it a trigger, schedule, or plugin provided event that your plugin may provide. By default, every event dictionary will contain the following:

```json
{
    "event-indigo-id": 1214985350,  # the ID of the trigger, schedule, action group, etc
    "event-type": "Trigger",  # the event type - trigger, schedule, action group, etc.
    "source": "server",  # the source of the event (see description below)
    "timestamp": "2025-08-07T14:32:21",  # ISO formatted datetime string
}
```

The ID is the *`event-indigo-id`* for the instance passing the data - it could be a Trigger, a Schedule, an Action Group (more on this later). The *`event-type`* is just the IOM class name. The *`timestamp`* is an ISO formatted datetime that the event fired, so you can use *`datetime.fromisoformat()`* to convert it into a native *`datetime`* instance.

The *`source`* item is a little more tricky. Here are the possible values:

1. *`server`* - this is what will show if the server performed the event on its own during the normal course of operations. A device state change trigger, a schedule fires, etc.
1. *`python`* - this is what the source would be if the operation was started via an IOM command. So if you did a *`indigo.actionGroup.execute(12345)`* this is what the source would be.
1. *`api-http`* - similar to *`python`* above, but if the command came in through the HTTP API.
1. *`api-websocket`* - similar to *`api-http`*, but the command would have come through a websocket.

Plugin supplied events (for instance, the Z-Wave Command Received event, email received event, or any event that your plugin may provide) will **add** the following plugin specific information:

```json
{
    "event-plugin-event-id": "zwaveCommand",  # ID of the plugin supplied event
    "event-plugin-id": "com.perceptiveautomation.indigoplugin.zwave",  # plugin id
    "event-plugin-name": "Z-Wave",  # plugin name
    "event-type": "PluginEventTrigger", # will always be this class name
}
```

Plugin events have more data that's specific to the plugin: the event id (from your Events.xml file), your plugin ID, the name. The *`event-type`* for a plugin event will always be *`PluginEventTrigger`*.

## How do you pass data through?
If your plugin supplies events, then you are aware that in your event handling code you eventually will call the *`execute()`* method on the event that the user configures, something like this:

```python
indigo.trigger.execute(trigger_instance)
```

To pass through any extra triggering data that you might want to add, just add it:

```python
message = {"somekey": "some value"}
indigo.trigger.execute(trigger_instance, trigger_data=message)
```

`message` can be either an `indigo.Dict` or a normal python *`dict`* instance, the server will convert it to an *`indigo.Dict`* before passing it along. It's just that simple.

Some notes on standards for your data:

- You won't want to duplicate any of the above built-in names as it would get overwritten.
- You probably want to name your keys with something that's easily identified with your plugin. For instance, the Z-Wave plugin uses the prefix `zwavecmd-` for it's keys that describe the event data that it passes through.
- We tried to use dashes `-` as separators rather than underscores - we think that's a better option for string keys.
- Keys should follow the restrictions on `indigo.Dict` keys (alphanumeric, dash, underscore, starting with a letter).

FYI, you can pass arbitrary data around using the IOM and the various `.execute()` actions on Triggers, Schedules, and Action Groups. Just pass through *`trigger_data`*, *`schedule_data`*, *`event_data`* respectively to those function calls when performing them through the IOM.

## How will users use the data?
The data is passed first to any **conditional scripts**. The data can be accessed like this:

```python
# event_data is prepopulated with the indigo.Dict from the originating event
if event_data["source"] == "api-http":
    # the triggering event came from the HTTP API, so you may want to look at something
    # here.
    pass
```

Regardless of where the data came from (trigger, schedule, etc.) the variable name will be *`event_data`*.

Then, once the conditions have been evaluated, the *`event_data`* will become available to actions. We've updated the built-in actions where appropriate to use the data.

We've added a new **Insert Event Data into Variable** action which will allow the user to insert all or part of the event data into the specified variable. If they specify a path (see the **box** library description above) and the result of the path is a simple type (string, bool, int, float) then that value will be inserted into the variable. If the result of the path is a collection (dict or list) or the user doesn't specify the path, then the collection will be converted to JSON and the JSON string will be inserted into the variable.

There is also a new substitution, *`%%e:"path"%%`* that can be used anywhere a substitution is valid. If the user wants the whole thing, they would just use the empty string *`%%e:""%%`* and the entire string will be inserted. Again, simple types will be inserted directly, complex types will be inserted as JSON.

Embedded script actions will also receive the data in the same way that conditional scripts do. **Note**: external (linked) scripts will not get the data in this release. We will gauge demand moving forward to determine if and when to add it there.

## How will you get the data in your actions?
You can get the data directly in your actions as well. Event data will be passed to the action method handler  if you modify your method signature:

```python
def run_shortcut(self: indigo.PluginBase,
                 action: any,
                 dev: any,
                 caller_waiting_for_result: bool,
                 event_data: Optional[indigo.Dict]) -> Optional[indigo.Dict]:
```

This is a complete action handler with type hints. While we don't envision a scenario where *`event_data`* is passed `None`, it's possible that it may happen or could be optional at some point in the future. Your code should make sure that the data is present before assuming anything.

## Examples of How Events Data Can Be Used
There are likely a lot of different scenarios where *`event_data`* is useful, but it may be helpful to see a complete working example all in one place. Here is a simple example just to show how straightforward the mechanism can be.

Create an Action:

- Create an Action Group called "Log Event Data"
- Select **Server Actions** > **Script and File Actions** > **Execute Script**
- Select Embedded Python and enter the following short script into the code block. Notice that we didn't do anything special to access the *`event_data`* payload. It's automatically supplied by the host process when the script is called **due to an event**.
```python
indigo.server.log(f"{event_data}")
```

- Select OK

Create a Trigger to fire the action:

- Create a Trigger called "Log Event Data"
- You can link it to an event, but for this example the event type doesn't matter
- You can also set a Condition, but for this example the condition doesn't matter either
- On the Actions tab, select **Server Actions** > **Execute Actions Group**
- Select the "Log Event Data" Action you created above
- Select OK

Now, from the Actions list in Indigo, highlight the "Log Event Data" Trigger and select **Execute Actions Only**. When your Trigger fires the script, something similar to the following should appear in the Events log:

```text
Trigger                         Event Data Trigger
   Action Group                    Event Data Example
   Script                          EventDataDict : (dict)
     event-indigo-id : 553162605 (integer)
     event-type : DeviceStateChangeTrigger (string)
     source : server (string)
     timestamp : 2025-10-31T10:18:37 (string)
```
It's that simple.

## Get Creative
The new *`event_data`* mechanism opens up a lot of possibilities for plugin developers. One thing that comes to mind almost immediately would be for plugins that provide virtual devices/wrappers/shims to allow the user to specify a path in the data then map that into either a custom state or a property (onState, etc.) Combine this functionality with [Webhook functionality](../../api/webhooks.md) and it would be possible to have a webhook directly update a virtual device. This would reduce a lot of glue code necessary now in handling those types of things.
