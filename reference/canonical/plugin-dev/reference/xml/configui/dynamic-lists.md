<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/reference/xml/configui/dynamic-lists/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Dynamic Lists and Filters { .ref-head-no-code #config-dynamic-list }

You may create dynamic menus and lists that are created at runtime. Indigo will supply some specific ones for you or your plugin may be called each time the UI is presented that will allow you to return anything you like.

To specify a dynamic list, you add some attributes to the List element and skip adding Option elements. To request any of the built-in lists, you specify a class attribute and (optionally) a filter attribute. For example, this field:

```xml
<Field id="insteonDimmers" type="menu">
	<Label>Insteon Dimmers:</Label>
	<List class="indigo.devices" filter="indigo.dimmer,indigo.insteon"/>
</Field>
```

would request a list of all Insteon dimmer devices. The list would be constructed with the device name as the menu or list item viewable by the user, and the value would be the device ID.

<span class="ca">**Attributes**</span>

| Attributes                          |          |                                                                                                                                                                                                     |
|-------------------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Attribute                           | Required | Notes                                                                                                                                                                                               |
| <span class="nw cb">`class`</span>  | Yes      | A reference to a class value as described below.  The class attribute must be set to one or more of the built-in classes (listed below), or `self`.                                                 |
| <span class="nw cb">`filter`</span> | No       | A filter attribute is not required, but if one is included, it must be set to a valid filter (see below) or empty `filter=""`.                                                                      |
| <span class="nw cb">`method`</span> | No       | A reference to a `plugin.py` method that returns the list elements as described below. If not included, `class` must refer to one of the built-in methods (`class="self"` by itself will not work). |

<span class="ca">**Device Filters**</span>  

The `indigo.devices` class specifies that the list will contain Indigo devices. If you don’t specify a filter, all devices defined by the user in Indigo will be returned. You can supply up to two filters if and only if one is an interface filter (see the first three in the list below). The filters are ANDed together, so one interface filter and one device type filter are the only combinations that will result in a non-empty list.

| Class: `indigo.devices`                               |                                                                                                                        |
|-------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| Optional Filters                                      | Description                                                                                                            |
| <span class="nw cb">`indigo.zwave`</span>             | include Z-Wave devices - this is an interface filter that can be used with other filters                               |
| <span class="nw cb">`indigo.insteon`</span>           | include Insteon devices - this is an interface filter that can be used with other filters                              |
| <span class="nw cb">`indigo.x10`</span>               | include X10 devices - this is an interface filter that can be used with other filters                                  |
| <span class="nw cb">`indigo.responder`</span>         | include devices whose state can be changed                                                                             |
| <span class="nw cb">`indigo.controller`</span>        | include devices that can send commands                                                                                 |
| <span class="nw cb">`indigo.relay`</span>             | relay devices                                                                                                          |
| <span class="nw cb">`indigo.dimmer`</span>            | dimmer devices                                                                                                         |
| <span class="nw cb">`indigo.sprinkler`</span>         | sprinklers                                                                                                             |
| <span class="nw cb">`indigo.thermostat`</span>        | thermostats                                                                                                            |
| <span class="nw cb">`indigo.iodevice`</span>          | input/output devices                                                                                                   |
| <span class="nw cb">`indigo.sensor`</span>            | all sensor type devices: motion sensors, TriggerLinc, SynchroLinc (sensor devices that have a virtual state in Indigo) |
| <span class="nw cb">`self`</span>                     | all device types defined by the calling plugin                                                                         |
| <span class="nw cb">`self.devTypeId`</span>           | all devices of type deviceTypeId, where deviceTypeId is one of the device types specified by the calling plugin        |
| <span class="nw cb">`com.somePlugin`</span>           | all device types defined by some other plugin                                                                          |
| <span class="nw cb">`com.somePlugin.devTypeId`</span> | all devices of type deviceTypeId, where deviceTypeId is one of the device types specified in some other plugin         |

The `indigo.triggers` class specifies that the list will contain Indigo triggers. Only a single filter from the list below will return a useful list.

<span class="ca">**Trigger Filters**</span>  

| Class: `indigo.triggers`                           |                                                                                  |
|----------------------------------------------------|----------------------------------------------------------------------------------|
| Optional Filters                                   | Description                                                                      |
| <span class="nw cb">`indigo.insteonCmdRcvd`</span> | Insteon command received triggers                                                |
| <span class="nw cb">`indigo.x10CmdRcvd`</span>     | x10 command received triggers                                                    |
| <span class="nw cb">`indigo.devStateChange`</span> | device state changed triggers                                                    |
| <span class="nw cb">`indigo.varValueChange`</span> | variable changed triggers                                                        |
| <span class="nw cb">`indigo.serverStartup`</span>  | startup triggers                                                                 |
| <span class="nw cb">`indigo.powerFailure`</span>   | power failure triggers                                                           |
| <span class="nw cb">`indigo.interfaceFail`</span>  | interface failure triggers - can be used with or without a specified protocol    |
| <span class="nw cb">`indigo.interfaceInit`</span>  | interface connection triggers - can be used with or without a specified protocol |
| <span class="nw cb">`indigo.emailRcvd`</span>      | email received triggers                                                          |

Using the `indigo.schedules` class will result in a list of all schedules, as will `indigo.actionGroups` and `indigo.controlPages` for their respective object types. None of these classes support any kind of filter. Lastly, `indigo.variables` will get you a list of variables. If you include `filter="indigo.readWrite"`, you’ll get only variables for which you can change the value. Currently, there’s only one read-only variable (isDaylight) defined by the system, but it may be possible to create them in future versions of the API.

Another special built-in list is serial ports - use `indigo.serialPorts` to get a list of available serial ports, and what's returned to your plugin is the full path to the plugin (e.g. "/dev/tty*"). This is suitable for using with PySerial, which we include with Indigo. See the "serialport" field type below for an even better way of collecting serial communication information.

You may also include custom dynamic lists that are constructed on-the-fly by your plugin. If you defined your list like this:

```xml
<Field id="insteonDimmers" type="menu">
	<Label>Insteon Dimmers:</Label>
	<List class="self" filter="stuff" method="myListGenerator"/>
</Field>
```

Then your plugin will have the method specified called with the filter. For the above example, you must define a method like this:

```python
def myListGenerator(self, filter="", valuesDict=None, typeId="", targetId=0):
	# From the example above, filter = "stuff"
	# You can pass anything you want in the filter for any purpose
	# Create a list where each entry is a list - the first item is
	# the value attribute and last is the display string that will
	# show up in the control. All parameters are read-only.
	myArray = [("option1", "First Option"),("option2","Second Option")]
	return myArray
```

!!! note
    Both return tuple values should be strings. Specifically, items with `None` as the value (first item) will be skipped. Additionally, the first tuple value (option1 and option2 in the above example) must be a string that does not contain comma or semicolon characters.

The `valuesDict` parameter will contain the valuesDict for the object being edited - if it's a device config UI then it'll be the valuesDict from that device (just like what's passed in to [validation methods](validation.md#validation-methods)), etc. **Note**: if it's a new object that hasn't been saved yet, valuesDict may be None or empty so test accordingly.

The `typeId` parameter will contain the type - for instance, if it's an event, it will be the event type id. The `targetId` is the ID of the object being edited. It will be 0 if it's a new object that hasn't been saved yet.

The field would then be created as if you had specified it statically like this:

```xml
<Field id="customList" type="menu">
	<Label>Select an Option:</Label>
	<List>
		<Option value="option1">First Option</Option>
		<Option value="option2">Second Option</Option>
	</List>
</Field>
```

This mechanism allows you to create any number of lists: devices dynamically discovered through some discovery protocol, calendars available, email addresses, iTunes playlists, etc.

One further option to dynamic lists is the ability to have them reload whenever the config dialog returns from a button or menu callback. So, for instance, if you have a button that somehow changes the contents of the dynamic list, you can specify the list as a one that's dynamically reloaded:

```xml
<Field id="insteonDimmers" type="menu">
	<Label>Insteon Dimmers:</Label>
	<List class="self" filter="stuff" method="myListGenerator" dynamicReload="true"/>
</Field>
```

!!! note
    This will cause an extra round-trip (client->Indigo server->plugin->Indigo server->client) so you should only use this when the list can change while the dialog is actually running.

[Back to Configuration Dialogs](index.md)
