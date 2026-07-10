<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/reference/xml/actions/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Actions.xml { .ref-head-no-code #actions-xml }

Your plugin will also very likely define some actions that a user can take. This is where you define those. Here’s a simple example:

```xml
<?xml version="1.0"?>
<Actions>
    <SupportURL>http://www.yourdomain.com/plugin/pluginActions.html</SupportURL>
    <Action id="resetInterface">
        <Name>Reset Interface</Name>
        <CallbackMethod>resetInterface</CallbackMethod>
    </Action>
</Actions>
```

As with `<Event>`, your `<Action>` elements can define a `<SupportURL>` element as well - the actions dialog now has a help button on it and if one of your actions is selected clicking on the help button will take your user to the specified URL. If you don’t specify one then the default help page for all actions will show.

You can specify an Action item field to be a label within a `ConfigUI` in your action list when you want to include some text -- for example, to explain what users should enter into a text field. Label tags require a unique `id` and the type should be set to `label`. Labels do not require any other elements.

```xml
<Field id="my_label" type="label">
    <Label>Some explanatory text goes here.</Label>
</Field>
```

You can specify an Action item to be a separator in your action list so that when they're displayed in the UI there is a visual separation. Simply insert an Action defined like this between two other Action elements: While you don't have to include any elements, the id still must be unique.

`<Action id="sep1"/>`

For a full description of all the different XML conventions that Indigo uses, [see this page](../../guide.md#indigo-plugin-xml-conventions).

<span class="ca">**Attributes**</span>

When defining a full plugin action, a few elements are required. Here’s how you construct your `<Action>` elements in `Actions.xml`:

| Attribute                                   | Type      | Required | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |  |  |
|---------------------------------------------|-----------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--|--|
| <span class="nw cb">`id`</span>             | Attribute | Yes      | This is a unique id for the event in this `Actions.xml` file.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |  |  |
| <span class="nw cb">`deviceFilter`</span>   | Attribute | No       | If present, a popup list of devices that match the specified [device filter](configui/dynamic-lists.md#config-dynamic-list) will be shown in the UI. Many actions may not need any configuration beyond a device selection so we've enabled you to specify that a device must be selected and passed to the action's `CallbackMethod`. This will avoid the necessity to create a `ConfigUI` element with just a device popup.                                                                                                                                                                                                                                                                                                                                                                                                                               |  |
| <span class="nw cb">`uiPath`</span>         | Attribute | No       | [Added in API v1.4](https://www.indigodomo.com/indigo/api_release_notes/1.4/). You can specify where in the menu hierarchy your action will be placed. By default, Indigo will create a submenu at the bottom of the Actions list and put your actions there. If you specify "DeviceActions", Indigo will create a submenu on the Device Actions menu and put your actions there. If you specify "NotificationActions", Indigo will insert your action n the Notification Actions menu without a submenu (be sure to name your action appropriately so that it's clear what it does). [Added in API v2.0](https://forums.indigodomo.com/viewtopic.php?p=126067#p126067): use "hidden" to hide the action in the UI. Useful for actions that are only intended to be used from scripts/plugins (an API of sorts). |
| <span class="nw cb">`Name`</span>           | Element   | Yes*     | This is the text that’s shown in the actions dialog that represents this action. `Name` is not required for labels and separators.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |  |  |
| <span class="nw cb">`CallbackMethod`</span> | Element   | Yes*     | This is the name of the method that implements the action in your code. `CallbackMethod` is not required for labels and separators.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |  |  |
| <span class="nw cb">`ConfigUI`</span>       | Element   | No       | If your action requires any configuration (as most will), you can specify a `<ConfigUI>` element that’s defined exactly as above.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |  |  |

When the Action is fired in Indigo, the callback method will be called and an Indigo dictionary will be passed with information about how to handle the call. In the example below, the `action` payload will contain the necessary things to implement the call. Notice the call to `action.props.get()` in the Python callback below, which will pull the appropriate value from the specified key (`message`, `type`, etc.) using the standard Python dictionary `get()` method.

Here is a sample action dict sent to a plugin:
```text
configured : True
delayAmount : 900  <-- Read only; currently not used
description : redraw one chart  <-- Taken from the Actions.xml <NAME> element.
props : com.foo.indigoplugin.my_plugin : (dict)
     config_prop_1 : 123 (integer)
     config_prop_2 : true (bool)
     config_prop_3 : "baz" (string)
replaceExisting : True  <-- Read only; currently not used
textToSpeak :
```

Here is the code that implements the Write to Log action defined in the Action Collection plugin:

```python
def writeToLog(self, action):
    # call for variable substitution on the message field they entered
    theMessage = self.substitute(action.props.get("message", ""))
    # set the type for the message if they configured one
    theType = action.props.get("type")
    # debugging - show the message if debugging is enabled
    self.debugLog(u"Write to log: " + theMessage)
    # if they entered a type, log the message with it, otherwise log the message without a type
    if theType:
        indigo.server.log(theMessage,type=theType)
    else:
        indigo.server.log(theMessage)
```

Notice the call to `self.substitute()` - this method is defined in the [plugin base class](../plugin-py/index.md). If your user inserts `%%v:12345%%` into their string where `12345` is the ID of a variable, the call will return a string with all variable occurrences substituted. If your user inserts `%%d:12345:someStateId%%` into their string where `12345` is the ID of a device and `someStateId` is a valid state identifier, the call will return a string with all device state occurrences substituted. See the [substitutions docs](../../../user/automation/substitutions.md) for more information.

Your plugin actions can return any Python "primitive" value to users when they call your action
with the `executeAction` method (a return value is not required). The return value can
be any one of the following object types:

- None `None`,
- booleans `bool`,
- integers `int()`,
- floats `float()`,
- strings `str()`,
- Indigo Dicts `indigo.Dict()`,
- Indigo Lists `indigo.List()`.

Your plugin action may also receive an optional `callerWaitingForResult` parameter which is a request for your plugin to block until it can complete its tasks (and also return a response).

```python
def actionSomeXmlDefineActionCallback(self, action, dev, callerWaitingForResult, event_data=None):
    # do your typical action stuff here
    # note: event_data contains a dictionary of information about what caused the event to fire
    return some_value
```

The action can block until it has the result of the action (which it can then just return directly), but note that all callbacks must be executed in the same plugin host thread. This means that other callbacks would become blocked, including those to get configuration UI XML and values. This turns into a potential usability problem in the Indigo client, as the plugin configuration, actions, trigger, etc., UI will become unresponsive and start to timeout.

Instead, if the plugin cannot immediately return a result for the action (because it has to communicate with hardware, for example), then it can acquire a completion handler callback function that can be executed later (asynchronously) in another thread.

The pattern would then be something like:

```python
def actionSomeXmlDefineActionCallback(self, action, dev, callerWaitingForResult):
   completeHandler = None
   if callerWaitingForResult:   # only acquire the completion handler if caller is wanting a result
      completeHandler = indigo.acquireCallbackCompleteHandler()

   self.pluginsActionQueue.put((action, dev, completeHandler))
   # Note self.pluginsActionQueue is not implemented by the base plugin and is just an example
   # of how one might pass the action and completeHandler to another thread using a queue.

def anotherThreadQueueHandlerFunc(self)
   try:
      (action, dev, completeHandler) = self.pluginsActionQueue.get(True, 60)

      # Process the requested action here. This can block and take a long
      # time without impacting UI usability because this method would be
      # called from another thread.

      # Upon completion, you can return the result to the original action caller
      # via:
      if completeHandler is not None:
         completeHandler.returnResult("success performing action")
   except Exception as exc:
      # If there was an exception performing the action (hardware not available, etc.)
      # then the exception can be returned to the original action caller via:
      if completeHandler is not None:
         completeHandler.returnException(exc)
```

So, rather than return a value from the actual callback, you request a callback completion handler from the server. You then can queue up data, including the handler object, so that some other async thread can perform whatever communication, calculation, etc., is needed and use the completion handler to return the result. As shown in the example above, you can also return an exception which will be thrown in the requesting process if necessary.

<span class="dw-color-red">Note</span>: To increase the value of your plugin, you should ensure that you test and document the necessary
information so that Python scripters can [script your plugin's actions](../../../scripting/tutorial.md#scripting-indigo-plugins). You should include information on the parameters your action will expect to receive and what your action will return (if anything) when the action is called. Here is an example that shows how a scripter can tell [the Timers plugin to restart a timer](../../../plugins/timersandpesters.md#restart-timer). You can provide that information in a relatively straight-forward way in your plugin's documentation as we've done with our plugins (check the [Airfoil Pro](../../../plugins/airfoilpro.md) and [Timers and Pesters](../../../plugins/timersandpesters.md#scripting-support) docs for examples). You shouldn't really have to do much - but you should test each action. Sometimes you can make assumptions about the data that you get from your action's ConfigUI that you may want to change - for instance you may expect data when it would be advantageous to not include it (optional data) from a scripters perspective.
