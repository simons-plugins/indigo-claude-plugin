<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/tutorials/building/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Building a Plugin

!!! abstract "In this guide"
    Code-level reference for building and extending Indigo server plugins: reading and writing preferences, handling device configuration callbacks, implementing concurrent threads, and using the Indigo SDK example plugins as starting points. Complements the Plugin Developer's Guide with runnable, copy-pasteable examples.

Note most of the code examples below are calling methods on the object *`self`*. In this context, *`self`* is meant to be the Plugin instance as defined inside the *`plugin.py`* file. To execute the sample code outside of Plugin instance methods, use the *`indigo.activePlugin`* object instead.

*Important:* For simplicity, some of the samples below specify objects based on name (*`indigo.devices["office desk lamp"]`*). However, the preferred lookup mechanism is to use the object's numeric ID (*`indigo.devices[12345678]`*), which can be retrieved by control-clicking on the object name in Indigo's Main Window. By using the numeric ID you ensure the object will be found even if its name is changed.

## Indigo Plugin SDK Source Code Examples
The Indigo Plugin SDK ([available here](https://github.com/IndigoDomotics/IndigoSDK/releases)) includes short, example plugins with full XML and python source. They are a great place to start when developing new plugins.

Included in the SDK are examples that create plugin based relay, dimmer, thermostat, sensor, speed control, sprinkler, energy meter and custom devices. Also included is an example showing basic Indigo database traversal, how to catch low-level X10/Insteon messages, and how to create an Indigo telnet server using the python twisted framework. The following table lists the Indigo Plugin SDK examples that were available at the time Indigo {{ version }} shipped.

| SDK Plugin task | Plugin that illustrates an approach |
| --- | --- |
| Broadcast Plugin Information to Listeners | Example Custom Broadcaster |
| Subscribe to Plugin Information Broadcast | Example Custom Subscriber |
| Walk Through the Indigo Database | Example Database Traverse |
| Non-native Device Type | Example Device - Custom |
| Energy Meter Device Type | Example Device - Energy Meter |
| Device Factory Device Type | Example Device - Factory |
| Switch / Relay / Dimmer Device Type | Example Device - Relay and Dimmer |
| Sensor Device Type (Water, Motion, Light, Humidity) | Example Device - Sensor |
| Speed Control Device Type (Fan) | Example Device - Speed Control |
| Sprinkler Device Type | Example Device - Sprinkler |
| Thermostat Device Type | Example Device - Thermostat |
| Interact with the Indigo Server Using HTTP Client / Server | Example HTTP Responder |
| Listen for Insteon and/or X-10 Traffic | Example Insteon:X10 Listener |
| Listen for Indigo Variable Change Notifications | Example Variable Change Subscriber |
| Listen for Z-Wave Traffic | Example Z-Wave Listener |


We'll be adding additional example plugins in the future.

## Other Useful Plugin Source Code Examples
Additionally, below is a table of common plugin tasks that are used in either built-in or freely available plugins that implement those tasks in some form or another (from simplest to most complex):

| Plugin task | Plugin that illustrates an approach |  |
| --- | --- | --- |
| Parsing JSON, XML from an IP source | NOAA Weather, [WeatherSnoop](https://www.indigodomo.com/pluginstore/10/) |
| Integrating with native Mac Apps | Airfoil |  |
| Sending RS232 (serial port & network serial port) Commands | EasyDAQ |  |
| Reading RS232 (serial & network serial port) Input | EasyDAQ |  |
| Interacting with an IMAP mail server | Email+ |  |
| Interacting with an HTTP Web server | Example HTTP Responder |  |
| Creating custom devices with states | Simple: NOAA Weather, [WeatherSnoop](https://www.indigodomo.com/pluginstore/10/) - Complex: EasyDAQ |
| Creating custom actions | [GhostXML](https://www.indigodomo.com/pluginstore/38/) |
| Creating custom events | Airfoil |  |


Each of these plugins is installed by default with Indigo - in the `/Library/Application Support/Perceptive Automation/Indigo [VERSION]/Plugins (Disabled)/` folder, or available as an Open Source plugin from the [Indigo Plugin Store](https://www.indigodomo.com/pluginstore/). To see the various XML and python source files, just right-click on it in the `Finder` and select `Show Package Contents`.

The [SDK example](https://github.com/IndigoDomotics/IndigoSDK/releases) plugins, the plugins included with Indigo and Open Source plugins above are great places to see working examples of plugins and their source code.

## How to Read and Write Plugin Preferences

- The per plugin preferences (pref) file is automatically managed (created, loaded, updated).
- Pref values can be numbers, boolean, strings, indigo.Dict() or indigo.List().
- Key values defined in `PluginConfig.xml` are automatically mapped into the plugin's prefs space which is available via:

`self.pluginPrefs["somePrefKey"]`

- Or, if you're not sure the key exists:

`self.pluginPrefs.get("somePrefKey", "default value if key doesn't exist")`

- The latter will return the second parameter if they key doesn't exist in the dictionary - it's your responsibility to add it to the prefs dict if you want it to be stored permanently.
- A plugin can also insert other values into its pluginPrefs space (not just values shown in the plugin's config UI). This is a great way to maintain values that are not directly visible or available to the end user.
- To read a preference value access its key:

```python
someVal = self.pluginPrefs["somePrefKey"]
indigo.server.log("value is " + str(someVal))
```

- To create a new or update an existing preference value assign it a new value:

`self.pluginPrefs["somePrefKey"] = 1234`

- The Indigo server will save the plugin prefs automatically, but you can also cause them to be saved to the server immediately using:

```python
indigo.server.savePluginPrefs
```

## How to Add Plugin Metadata to Devices, Trigger & Scheduled Events, Variables, etc.
FIXME (useful, but very rough notes below)

- Most Indigo database objects support the addition of plugin specific metadata.
- Every plugin has its own name space accessed via the object instance *`.pluginProps`*.
- The pluginProps dictionary supports numbers, boolean, strings, indigo.Dict() or indigo.List().

### Add new plugin metadata to the Device "den fixture"
```python
dev = indigo.devices["den fixture"]  # device ID preferred
newProps = dev.pluginProps
newProps["onCycles"] = 5
newProps["moreData1"] = "abc"
newProps["moreData2"] = True
newProps["moreData3"] = 123.45
dev.replacePluginPropsOnServer(newProps)
```

#### Read plugin specific property `onCycles` from the Device "den fixture"
```python
dev = indigo.devices["den fixture"]  # device ID preferred
onCycles = dev.pluginProps["onCycles"]
indigo.server.log("onCycles is " + str(onCycles))
```

#### Increment the plugin specific property onCycles by 1 for the Device "den fixture"
```python
dev = indigo.devices["den fixture"]  # device ID preferred
newProps = dev.pluginProps
newProps["onCycles"] += 1
dev.replacePluginPropsOnServer(newProps)

dev = indigo.devices["den fixture"]  # device ID preferred
onCycles = dev.pluginProps["onCycles"]
indigo.server.log("onCycles is now " + str(onCycles))
```

- Plugins have read-only access to other plugin metadata via *`.globalProps`*.
- Plugins have read/write access to their own metadata space.

## How to Create a Custom Plugin Device
FIXME (useful, but very rough notes below)

- Plugin Device state and properties are defined in Devices.xml.
- Properties define the user configurable options for a device instance, and are specified in the *`<ConfigUI>`* XML node. Every field *`id`* is automatically mapped into the device instance *`.pluginProps`* metadata dictionary (described above) as a unique key.
- States are specified in the Devices.xml *`<States>`* XML node, and are used to define the transient state information for a device (ex: on/off setting, brightness, temperature, etc.).
- States defined in Devices.xml are automatically shown in the Trigger Event `*Device State Changed*` options when that plugin device type is selected, and are automatically shown in the Control Page editor when a control is created inspecting that plugin device.
- States are read-only for everyone except the plugin that defines the device's states.
- Plugins should update a device state after it has sent commands to hardware, or somehow received new state information from hardware. Example that increments the plugin defined state `*heatSetPoint*` by 1:

```python
dev = indigo.devices["Custom Plugin Thermostat"]  # device ID preferred
dev.updateStateOnServer("heatSetPoint", dev.states["heatSetPoint"] + 1)
```

- Plugins should subclass `*deviceStartComm*` and `*deviceStopComm*` to start/stop any hardware communication (normally via a new per-device thread):

```python
def deviceStartComm(self, dev):
    self.easydaq.startCommThread(dev)

def deviceStopComm(self, dev):
    self.easydaq.stopCommThread(dev)
```

- Calls to `*deviceStartComm*` and `*deviceStopComm*` are automatically managed by the Indigo Server and Indigo Plugin Host. When a plugin first connects all enabled device instances owned by the plugin will receive `*deviceStartComm*` calls. Likewise, `*deviceStartComm*` is called when a new plugin device is created or duplicated. `*deviceStopComm*` is called whenever a plugin is disabled, deleted, or when the plugin is shutting down. Therefore, these two functions should be the primary bottlenecks for starting/stopping device hardware or network connections.

## How to Create a Custom Plugin Trigger Event
The XML in this file describes all events that your plugin will generate for use in Indigo. Your users will use these in the Trigger Events dialog just like any of the built-in Indigo events (like Power Failure, Email Received, etc.) Your plugin can offer other types of events, including update notifications, battery low notifications, button press notifications, and so on.

Here’s a very small `Events.xml` file that defines a plugin update event, with a small sample configuration dialog:

```xml
  <?xml version="1.0"?>
  <Events>
      <SupportURL>http://www.yourdomain.com/plugin/pluginEvents.html</SupportURL>
      <Event id="updateAvailable">
          <Name>Plugin Update Available</Name>
          <ConfigUI>
              <SupportURL>https://www.yourdomain.com/plugin/someOtherEvent.html</SupportURL>
              <Field id="someLabel" type="label">
                  <Label>This label contains some useful configuration instructions.</Label>
              </Field>
            </ConfigUI>
      </Event>
  </Events>
```

As you can see, your `<Event>` elements can define a `<SupportURL>` element as well -- and separate support elements for the event's configuration dialog (the trigger events dialog now has a help button on it and if one of your events is selected clicking on the help button will take your user to the specified URL). You can specify an Event to be a separator in your event list so that when they're displayed in the UI there is a visual separation. Simply insert an Event defined like this between two other Event elements:

```xml
<Event id="sep1"/>
```

There are several Event-related and Trigger-related methods that you can add to your `plugin.py` file--some of which are required in order to have the Event do something.  These methods include:

| Element | Description |
| --- | --- |
| self.closedEventConfigUi(self, values_dict, user_cancelled, type_id, event_id) | Called after user clicks the Save button within the event configuration dialog (after 'validateEventConfigUi()' method has finished successfully). Used to finalize any Event configuration steps. |
| self.getEventConfigUiValues(self, plugin_props, type_id, event_id) | Called when an Event configuration window is first opened. |
| self.getEventConfigUiXml(self, type_id, event_id) | Called when an Event configuration window is first opened. The method is used to provide a valid XML payload in place of the `Events.xml` file. |
| validateEventConfigUi(self, values_dict, type_id, event_id) | Called when a user clicks the Save button within the event configuration dialog. Used to provide configuration input validation to ensure the settings are within your parameters. |


The power of Events

## How to Monitor Changes to Various Indigo Objects
In some instances, a plugin may need to know about changes to an Indigo object that it doesn't directly control. For example, you might have a [plugin that groups together a number of fans](https://www.indigodomo.com/pluginstore/89/) and treats the multiple fans as one single fan. To do this successfully, it would be necessary to monitor changes to a single fan (say a local call to turn the fans on) and propagate that call to the other fan objects.

Indigo provides a method to do this by allowing the plugin to "subscribe" to changes for all objects in a particular class.

### Subscribe to Indigo Object Changes
To monitor changes to different classes of Indigo objects, you can include a call to the appropriate `subscribeToChanges` method. Calling any of these methods tells Indigo to send a notification to the plugin of any changes to all objects of that type -- not only plugin's own objects -- so use these methods sparingly.

| Element |
| --- |
| indigo.devices.subscribeToChanges() |
| indigo.variables.subscribeToChanges() |
| indigo.triggers.subscribeToChanges() |
| indigo.schedules.subscribeToChanges() |
| indigo.actionGroups.subscribeToChanges() |
| indigo.controlPages.subscribeToChanges() |


```python
def __init__(self, plugin_id, plugin_display_name, plugin_version, plugin_prefs):
    super().__init__(plugin_id, plugin_display_name, plugin_version, plugin_prefs)

    indigo.devices.subscribeToChanges()
    indigo.variables.subscribeToChanges()
    indigo.triggers.subscribeToChanges()
    indigo.actionGroups.subscribeToChanges()
```

These methods only invoke the notification process, they don't do anything with the notifications they subscribe to. In order to react to any notifications, you'll need to use the methods below.

#### Monitor Device State Changes from a Plugin
| Element |
| --- |
| self.deviceCreated(self, dev) |
| self.deviceDeleted(self, dev) |
| self.deviceUpdated(self, orig_dev, new_dev) |


```python
def deviceCreated(self, dev):
    # Receives a copy of the device instance
    self.logger.debug(f"{dev.name} created."
```
```python
def deviceDeleted(self, dev):
    # Receives a copy of the device instance
    self.logger.info(f"{dev.name} deleted."
```
```python
def deviceUpdated(self, orig_dev, new_dev):
    self.logger.debug("===== deviceUpdated =====")

    # Call the parent implementation of deviceUpdated() base class
    indigo.PluginBase.deviceUpdated(self, orig_dev, new_dev)

    # Convert the payload objects from indigo.Dict() objects to Python dict() objects.
    orig_dict = {}
    for (k, v) in orig_dev:
        orig_dict[k] = v

    new_dict = {}
    for (k, v) in new_dev:
        new_dict[k] = v

    # Create a dictionary that contains only those properties and attributes that have changed.
    diff = {k: new_dict[k] for k in orig_dict if k in new_dict and orig_dict[k] != new_dict[k]}

    self.logger.debug(f"Attributes changed: {diff}")
```

#### Monitor Changes to Variables
| Element |
| --- |
| self.variableCreated(self, var) |
| self.variableDeleted(self, var) |
| self.variableUpdated(self, orig_var, new_var) |


The variable change monitoring methods operate like the methods for devices above. Note, unlike Indigo devices, you'll need to monkey patch the `var` object in order to iterate over it.
