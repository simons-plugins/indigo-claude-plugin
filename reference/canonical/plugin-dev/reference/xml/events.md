<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/reference/xml/events/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Events.xml { .ref-head-no-code #events-xml }

The XML in this file describes all events that your plugin will generate for use in Indigo. Your users will use these in the Trigger Events dialog just like any of the built-in Indigo events (like Power Failure, Email Received, etc.) Device State Changed events are handled by the `<States>` defined in the `<Device>` elements described above, but your plugin can offer other types of events, including update notifications, battery low notifications, button press notifications, etc.

Here’s a very small `Events.xml` file that just defines a plugin update event:

```xml
<?xml version="1.0"?>
<Events>
    <SupportURL>http://www.yourdomain.com/plugin/pluginEvents.html</SupportURL>
    <Event id="updateAvailable">
        <Name>Plugin Update Available</Name>
    </Event>
</Events>
```

As you can see, your `<Event>` elements can define a `<SupportURL>` element as well - the trigger events dialog now has a help button on it and if one of your events is selected clicking on the help button will take your user to the specified URL. If you don’t specify one then the default help page for all trigger events will show. You can specify an Event to be a separator in your event list so that when they're displayed in the UI there is a visual separation. Simply insert an Event defined like this between two other Event elements:

`<Event id="sep1"/>`

<span class="ca">**Attributes**</span>

While you don't have to include any elements, the id still must be unique. Here’s how to construct your `<Event>` elements:

| Attribute                             | Type      | Required | Notes                                                                                                             |
|---------------------------------------|-----------|----------|-------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`id`</span>       | Attribute | Yes      | This is a unique id for the event in this `Events.xml` file.                                                      |
| <span class="nw cb">`Name`</span>     | Element   | Yes      | This is the text that’s shown in the trigger event dialog that represents this event.                             |
| <span class="nw cb">`ConfigUI`</span> | Element   | No       | If your event requires any configuration, you can specify a `<ConfigUI>` element that’s defined exactly as above. |
