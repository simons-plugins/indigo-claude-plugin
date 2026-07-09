<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/reference/devices/base-class/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Device Base Class { .ref-head-no-code }

The `Device` class is generally used as a base class - your script will use objects that are instances of one of its subclasses - we'll discuss each of the subclasses later in this section. First, a quick refresher on a fundamental aspect of devices: some devices can only be controlled (i.e. old-style ApplianceLincs, most X10 devices, etc.), called responders in Indigo terminology, other devices are only controllers (i.e. RemoteLincs, PalmPads, etc.), and some devices are both responders and controllers (i.e. KeypadLincs).

This terminology was really invented for Insteon devices, but we think it applies to other technologies as well but perhaps in a slightly different way. In any event, controller devices can support a number of buttons and/or a number of groups from which commands are sent, all of which Indigo can use to trigger actions. From a technical and practical standpoint, they are in fact the same thing so a single number, indexed based on how the device supports them, is how this property should be used.

The base class supports getting the number of buttons or groups as a single property (buttonGroupCount) for the device. Use that count as a guide to what you can pass in the various trigger classes. For any device that doesn’t support local physical buttons or sending group commands and/or status commands, the number returned should be 0.

If you’re writing a plugin that defines devices, they will automatically inherit all the following properties.

<span class="ca">**Class Properties**</span>

| Property                                            | Type                                             | Writable | [Min API](https://www.indigodomo.com/indigo/api_version_chart.html)     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|-----------------------------------------------------|--------------------------------------------------|----------|-------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`address`</span>                | string                                           | No*      | 1.0                                       | the address for the device. *Plugin developers can change this value for their plugin's devices.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| <span class="nw cb">`batteryLevel`</span>           | integer                                          | No       | 1.0                                       | battery level for the device - `None` if the device doesn't support battery operation - shortcut for `dev.states['batteryLevel']`                                                                                                                                                                                                                                                                                                                                                                                                                                |
| <span class="nw cb">`buttonGroupCount`</span>       | integer                                          | No       | 1.0                                       | the number of groups (or buttons in the case of the RemoteLinc and ControLinc) that the controller supports - currently used only for Insteon devices - 0 for other devices                                                                                                                                                                                                                                                                                                                                                                                      |
| <span class="nw cb">`configured`</span>             | boolean                                          | No       | 1.0                                       | true if the device has been fully configured - if it's a plugin device, use this to make sure that the device's config dialog has been run at least once.                                                                                                                                                                                                                                                                                                                                                                                                        |
| <span class="nw cb">`description`</span>            | string                                           | Yes      | 1.0                                       | a description of the device as specified by the user                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| <span class="nw cb">`deviceTypeId`</span>           | string                                           | No       | 1.0                                       | the typeId specified in the Devices.xml (or it’s documentation) - only used for plugin defined devices                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| <span class="nw cb">`displayStateId`</span>         | string                                           | No       | 1.15                                      | main display stateId key which can be used as a key into states[] property below                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| <span class="nw cb">`displayStateValRaw`</span>     | boolean integer string or none                   | No       | 1.15                                      | raw value of main display state (ex: 72.0)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| <span class="nw cb">`displayStateValUi`</span>      | string                                           | No       | 1.15                                      | UI value (string) of main display state (ex: '72.0°F' )                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| <span class="nw cb">`displayStateImageSel`</span>   | *[kStateImageSel](#state-image-sel-enumeration)* | No       | 1.18                                      | an enumeration specifying which state image icon is shown in Indigo Touch and Indigo client UI - see state image sel enumeration below for possible values                                                                                                                                                                                                                                                                                                                                                                                                       |
| <span class="nw cb">`enabled`</span>                | boolean                                          | No       | 1.0                                       | is the device enabled - set using the `indigo.device.enable()` method                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| <span class="nw cb">`energyCurLevel`</span>         | float                                            | No       | 1.11                                      | current Wattage energy being used by the device (None if not supported)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| <span class="nw cb">`energyAccumTotal`</span>       | float                                            | No       | 1.11                                      | current accumulated energy used since last base time specified in `energyAccumBaseTime` (None if not supported)                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| <span class="nw cb">`energyAccumBaseTime`</span>    | datetime                                         | No       | 1.11                                      | the base time from which to calculate the energy total (`energyAccumTotal`) (None if not supported)                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| <span class="nw cb">`energyAccumTimeDelta`</span>   | integer                                          | No       | 1.11                                      | the time delta in seconds since the last base time (None if not supported)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| <span class="nw cb">`errorState`</span>             | string                                           | No       | 1.0                                       | the string that represents the current error for the device, empty string if there is no error                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| <span class="nw cb">`folderId`</span>               | integer                                          | No       | 1.0                                       | the unique ID of the folder this device is in (0 if it's not in a folder) - use `moveToFolder()` method to change                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| <span class="nw cb">`globalProps`</span>            | dictionary                                       | No       | 1.0                                       | an `indigo.Dict()` representing all name/value pairs associated with this device - each plugin will have its own dictionary (`globalProps[pluginId]`) - see [About Plugin Properties](base-class.md#about-plugin-properties) below for details                                                                                                                                                                                                                                                                                                                   |
| <span class="nw cb">`id`</span>                     | integer                                          | No       | 1.0                                       | id or instance of the device, assigned on creation by IndigoServer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| <span class="nw cb">`lastChanged`</span>            | datetime                                         | No       | 1.0                                       | the last date/time that the device was changed - populated by IndigoServer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| <span class="nw cb">`model`</span>                  | string                                           | No       | 1.0                                       | the model name of the device - defined either by Indigo based on type or by the plugin's device definition                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| <span class="nw cb">`name`</span>                   | string                                           | Yes      | 1.0                                       | the unique name of the device - no two devices can have the same name                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| <span class="nw cb">`ownerProps`</span>             | dictionary                                       | No       | 1.20                                      | an `indigo.Dict()` representing the name/value pairs defined by the plugin that created the device - this is a shortcut into the owner plugin's globalProps data                                                                                                                                                                                                                                                                                                                                                                                                 |
| <span class="nw cb">`pluginId`</span>               | string                                           | No       | 1.0                                       | if protocol is `Plugin`, the string ID for the plugin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| <span class="nw cb">`pluginProps`</span>            | dictionary                                       | No       | 1.0                                       | an `indigo.Dict()` representing the name/value pairs defined by your plugin for the device - plugin developers should publish this information if you want other plugins/scripts to create devices of this type - see [About Plugin Properties](base-class.md#about-plugin-properties) below for details - use `replacePluginPropsOnServer()` method to change                                                                                                                                                                                                   |
| <span class="nw cb">`protocol`</span>               | *[kProtocol](#protocol-enumeration)*             | No       | All                                       | an enumeration specifying the kProtocol of the device - see protocol enumeration below for possible values                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| <span class="nw cb">`remoteDisplay`</span>          | boolean                                          | Yes      | 1.0                                       | should this device be displayed in remote clients (IWS, Indigo Touch, etc) - may also be set with `indigo.device.displayInRemoteUI()`                                                                                                                                                                                                                                                                                                                                                                                                                            |
| <span class="nw cb">`sharedProps`</span>            | dictionary                                       | No       | **[2.3](https://www.indigodomo.com/indigo/api_release_notes/2.3/)** | an `indigo.Dict()` representing the name/value pairs that are shared by all plugins. This is the property dictionary that you can edit via the Global Properties plugin, and your plugin may manage properties in this dictionary as well to add metadata to devices that your plugin can use for other purposes. Use `dev.replaceSharedPropsOnServer()` to update them (as with pluginProps, you should get copy first, update the copy, then set them back to that copy so you don't accidentally remove some other plugin's props).                           |
| <span class="nw cb">`states`</span>                 | dictionary                                       | No       | 1.0                                       | returns an indigo.Dict() of device states - the key is the state id and the value is the value. Note that enumerated states will have not only the state, but also each option for the state. So, for instance, if I had a state called *status* and it had 3 options (*online*, *offline*, *error*), then you'd not only have *status* as a key, but also *status.online*, *status.offline*, and *status.error* as keys in the dictionary. This is so that you can test each state enumeration independently in trigger actions (e.g. *status.online* is true). |
| <span class="nw cb">`supportsAllLightsOnOff`</span> | boolean                                          | No       | All                                       | indicates that this device should react to  all lights On and all lights Off commands - always False for plugin defined devices                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| <span class="nw cb">`supportsAllOff`</span>         | boolean                                          | No       | 1.0                                       | indicates that this device should react to  all Off commands - always False for plugin defined devices                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| <span class="nw cb">`supportsOnState`</span>        | boolean                                          | No       | **[2.2](https://www.indigodomo.com/indigo/api_release_notes/2.2/)** | indicates that the device has an on state                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| <span class="nw cb">`supportsStatusRequest`</span>  | boolean                                          | No       | 1.0                                       | indicates if the device supports querying the status - always False for plugin defined devices                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| <span class="nw cb">`version`</span>                | boolean                                          | No*      | 1.0                                       | indicates the device's version as appropriate. *Plugin developers can change this value for their plugin's devices.                                                                                                                                                                                                                                                                                                                                                                                                                                              |

## Protocol Enumeration { #protocol-enumeration .ref-head-no-code }

| indigo.kProtocol                     |                                                      |
|--------------------------------------|------------------------------------------------------|
| Value                                | Description                                          |
| <span class="nw cb">`Insteon`</span> | identifies the device as an Insteon device           |
| <span class="nw cb">`X10`</span>     | identifies the device as an X10 device               |
| <span class="nw cb">`ZWave`</span>   | identifies the device as an Z-Wave device            |
| <span class="nw cb">`Plugin`</span>  | identifies the device as a being defined by a plugin |

## State Image Sel Enumeration { #state-image-sel-enumeration .ref-head-no-code }
!!! note
    API v1.18+ only

| indigo.kStateImageSel                            |                                                                                                                                         |
|--------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| Value                                            | Description                                                                                                                             |
| <span class="nw cb">`Auto`</span>                | specifies Indigo Server to pick a device image icon that best represents this device class and/or state value (default for all devices) |
| <span class="nw cb">`AvPaused`</span>            | overrides to show a A/V paused icon                                                                                                     |
| <span class="nw cb">`AvPlaying`</span>           | overrides to show a A/V playing icon                                                                                                    |
| <span class="nw cb">`AvStopped`</span>           | overrides to show a A/V stopped icon                                                                                                    |
| <span class="nw cb">`Closed`</span>              | overrides to show a generic sensor off icon (grey circle)                                                                               |
| <span class="nw cb">`DehumidifierOff`</span>     | overrides to show a dehumidifier turned off icon                                                                                        |
| <span class="nw cb">`DehumidifierOn`</span>      | overrides to show a dehumidifier turned on icon                                                                                         |
| <span class="nw cb">`DimmerOff`</span>           | overrides to show a dimmer or bulb off icon                                                                                             |
| <span class="nw cb">`DimmerOn`</span>            | overrides to show a dimmer or bulb on icon                                                                                              |
| <span class="nw cb">`DoorSensorClosed`</span>    | overrides to show a door sensor closed icon (grey circle)                                                                               |
| <span class="nw cb">`DoorSensorOpened`</span>    | overrides to show a door sensor opened icon (green circle)                                                                              |
| <span class="nw cb">`EnergyMeterOff`</span>      | overrides to show an energy meter off icon                                                                                              |
| <span class="nw cb">`EnergyMeterOn`</span>       | overrides to show an energy meter on icon                                                                                               |
| <span class="nw cb">`FanHigh`</span>             | overrides to show a fan on (high) icon                                                                                                  |
| <span class="nw cb">`FanLow`</span>              | overrides to show a fan on (low) icon                                                                                                   |
| <span class="nw cb">`FanMedium`</span>           | overrides to show a fan on (medium) icon                                                                                                |
| <span class="nw cb">`FanOff`</span>              | overrides to show a fan off icon                                                                                                        |
| <span class="nw cb">`HumidifierOff`</span>       | overrides to show a humidifier turned off icon                                                                                          |
| <span class="nw cb">`HumidifierOn`</span>        | overrides to show a humidifier turned on icon                                                                                           |
| <span class="nw cb">`HumiditySensor`</span>      | overrides to show a humidity sensor icon                                                                                                |
| <span class="nw cb">`HumiditySensorOn`</span>    | overrides to show a humidity sensor on icon                                                                                             |
| <span class="nw cb">`HvacAutoMode`</span>        | overrides to show a thermostat in auto mode icon                                                                                        |
| <span class="nw cb">`HvacCooling`</span>         | overrides to show a thermostat that is cooling icon                                                                                     |
| <span class="nw cb">`HvacCoolMode`</span>        | overrides to show a thermostat in cool mode icon                                                                                        |
| <span class="nw cb">`HvacFanOn`</span>           | overrides to show a thermostat with fan blower on only icon                                                                             |
| <span class="nw cb">`HvacHeating`</span>         | overrides to show a thermostat that is heating icon                                                                                     |
| <span class="nw cb">`HvacHeatMode`</span>        | overrides to show a thermostat in heat mode icon                                                                                        |
| <span class="nw cb">`HvacOff`</span>             | overrides to show a thermostat off icon                                                                                                 |
| <span class="nw cb">`LightSensor`</span>         | overrides to show a light meter off icon                                                                                                |
| <span class="nw cb">`LightSensorOn`</span>       | overrides to show a light meter on icon                                                                                                 |
| <span class="nw cb">`Locked`</span>              | overrides to show a green lock icon                                                                                                     |
| <span class="nw cb">`MotionSensor`</span>        | overrides to show a motion sensor icon                                                                                                  |
| <span class="nw cb">`MotionSensorTripped`</span> | overrides to show a motion sensor tripped/activated icon                                                                                |
| <span class="nw cb">`NoImage`</span>             | overrides to show no device image icon (was `None` in previous API versions)                                                            |
| <span class="nw cb">`Opened`</span>              | overrides to show a generic sensor off icon (green circle)                                                                              |
| <span class="nw cb">`PowerOff`</span>            | overrides to show a power off icon                                                                                                      |
| <span class="nw cb">`PowerOn`</span>             | overrides to show a power on icon                                                                                                       |
| <span class="nw cb">`SensorOff`</span>           | overrides to show a generic sensor off icon (gray circle)                                                                               |
| <span class="nw cb">`SensorOn`</span>            | overrides to show a generic sensor on icon (green circle)                                                                               |
| <span class="nw cb">`SensorTripped`</span>       | overrides to show a generic sensor tripped icon (red circle)                                                                            |
| <span class="nw cb">`SprinklerOff`</span>        | overrides to show a sprinkler off icon                                                                                                  |
| <span class="nw cb">`SprinklerOn`</span>         | overrides to show a sprinkler off icon                                                                                                  |
| <span class="nw cb">`TemperatureSensor`</span>   | overrides to show a temperature sensor icon                                                                                             |
| <span class="nw cb">`TemperatureSensorOn`</span> | overrides to show a temperature sensor on icon                                                                                          |
| <span class="nw cb">`TimerOff`</span>            | overrides to show a timer off icon                                                                                                      |
| <span class="nw cb">`TimerOn`</span>             | overrides to show a timer on icon                                                                                                       |
| <span class="nw cb">`Unlocked`</span>            | overrides to show a red lock icon                                                                                                       |
| <span class="nw cb">`WindowSensorClosed`</span>  | overrides to show a window sensor closed icon (grey circle)                                                                             |
| <span class="nw cb">`WindowSensorOpened`</span>  | overrides to show a window sensor opened icon (green circle)                                                                            |

!!! note
    The following image selectors are available but do not yet have function-specific icons in Indigo Touch and Indigo client UI. Developers are encouraged to use them for automatic future compatibility when the icons are added.

| indigo.kStateImageSel                                     |                                                                                             |
|-----------------------------------------------------------|---------------------------------------------------------------------------------------------|
| Value                                                     | Description                                                                                 |
| <span class="nw cb">`BatteryCharger`</span>               | overrides to show a battery charger icon                                                    |
| <span class="nw cb">`BatteryChargerOn`</span>             | overrides to show a battery charger on icon                                                 |
| <span class="nw cb">`BatteryLevel`</span>                 | overrides to show a battery level icon                                                      |
| <span class="nw cb">`BatteryLevel25`</span>               | overrides to show a battery level (25%) icon                                                |
| <span class="nw cb">`BatteryLevel50`</span>               | overrides to show a battery level (50%) icon                                                |
| <span class="nw cb">`BatteryLevel75`</span>               | overrides to show a battery level (75%) icon                                                |
| <span class="nw cb">`BatteryLevelHigh`</span>             | overrides to show a battery level (full) icon                                               |
| <span class="nw cb">`BatteryLevelLow`</span>              | overrides to show a battery level (low) icon                                                |
| <span class="nw cb">`Custom`</span>                       | overrides to show a plugin defined custom image icon (not yet implemented; shows `NoImage`) |
| <span class="nw cb">`Error`</span>                        | overrides to show an error device image icon                                                |
| <span class="nw cb">`WindDirectionSensor`</span>          | overrides to show a wind direction sensor icon                                              |
| <span class="nw cb">`WindDirectionSensorEast`</span>      | overrides to show a wind direction sensor (E) icon                                          |
| <span class="nw cb">`WindDirectionSensorNorth`</span>     | overrides to show a wind direction sensor (N) icon                                          |
| <span class="nw cb">`WindDirectionSensorNorthEast`</span> | overrides to show a wind direction sensor (NE) icon                                         |
| <span class="nw cb">`WindDirectionSensorNorthWest`</span> | overrides to show a wind direction sensor (NW) icon                                         |
| <span class="nw cb">`WindDirectionSensorSouth`</span>     | overrides to show a wind direction sensor (S) icon                                          |
| <span class="nw cb">`WindDirectionSensorSouthEast`</span> | overrides to show a wind direction sensor (SE) icon                                         |
| <span class="nw cb">`WindDirectionSensorSouthWest`</span> | overrides to show a wind direction sensor (SW) icon                                         |
| <span class="nw cb">`WindDirectionSensorWest`</span>      | overrides to show a wind direction sensor (W) icon                                          |
| <span class="nw cb">`WindSpeedSensor`</span>              | overrides to show a wind speed sensor icon                                                  |
| <span class="nw cb">`WindSpeedSensorHigh`</span>          | overrides to show a wind speed sensor (high) icon                                           |
| <span class="nw cb">`WindSpeedSensorLow`</span>           | overrides to show a wind speed sensor (low) icon                                            |
| <span class="nw cb">`WindSpeedSensorMedium`</span>        | overrides to show a wind speed sensor (medium) icon                                         |

## Device Base Class Instance Methods { .ref-head-no-code }

The following instance methods can be called on device objects. Most are restricted and can only be called from a plugin on a device that the plugin owns. See the Restricted column below for those that are restricted in this way.

| Method                                                                        | Restricted | [Min API](https://www.indigodomo.com/indigo/api_version_chart.html) | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
|-------------------------------------------------------------------------------|------------|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`replaceOnServer()`</span>                                | No         | 1.0                                   | Because you can't directly modify a device's properties on the server, you have to get a local instance of the device and modify the writable properties as necessary. You then call this method and the device will be updated on the server and changes will be sent out to all connected clients.  A few examples appear below this table.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| <span class="nw cb">`replacePluginPropsOnServer(newPropsdict)`</span>         | Yes        | 1.0                                   | If you need to make a change to your plugin's property dictionary that's stored as part of the device (see [About Plugin Properties](base-class.md#about-plugin-properties) below) you just use this method to replace the entire dict with a new one. A typical usage will be to get the property dictionary from the device, make changes to the dict, then use this method to store the new dict.  A few examples appear below this table.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| <span class="nw cb">`stateListOrDisplayStateIdChanged()`</span>               | Yes        | 1.0                                   | Plugins can subclass the method `getDeviceStateList()` to provide dynamic state list definition information. The default implementation provides a static solution by retrieving the device state list definition from the Devices.xml file. Likewise, the method `getDeviceDisplayStateId()` can be used to dynamically determine which device state should be displayed in the State column of the main device table UI. The problem is that the Indigo Server only calls `getDeviceStateList()` and `getDeviceDisplayStateId()` at very specific times, like when a plugin device dialog is dismissed. So, call `stateListOrDisplayStateIdChanged()` on the device instance you need refreshed at any time and Indigo will then automatically call your plugin's `getDeviceStateList()` and `getDeviceDisplayStateId()` methods (or use the base implementation of looking up the list from Devices.xml) and update the Indigo Server (and all clients). This is particularly useful for plugin updates that need to add new device states to existing device instances created by older versions. In this case, the plugin will need to update the device instances by calling `stateListOrDisplayStateIdChanged()`. A likely place to do this type of instance level upgrading is inside your plugin's `deviceStartComm()` method. |
| <span class="nw cb">`setErrorStateOnServer('error string')`</span>            | Yes        | 1.0                                   | The supplied string will show in the state column and turn it red. Passing `None` will clear it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| <span class="nw cb">`updateStateOnServer(key, value, clearErrorState)`</span> | Yes        | 1.0                                   | Use this method to update the value of one of your device's states on the server. The server will propagate the change out to any connected clients and fire any triggers that are defined on that state. Pass "true" (default) or "false" on the clearErrorState parameter (not required) to have the error state of the device (set with `setErrorStateOnServer` above) cleared.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| <span class="nw cb">`updateStateImageOnServer(stateImageSel)`</span>          | Yes        | 1.18                                  | Use this method to override which [device state image icon](#state-image-sel-enumeration) is shown for this device on Indigo Touch and the Indigo client UI. The default behavior is for Indigo Server to automatically determine which icon should be shown based on the device class and state value. Only call this method if overriding the default behavior is needed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

<span class="ca">**Command Syntax Examples**</span>

Certain device properties are writeable for all Indigo devices, including a device's name, description, enabled/disabled state and remote display. You can't do this directly because device instances are read only. You must first get a copy of the device, make changes to the copy, and then send the copy back to the server. For example,

```python
# Updating a device's description (the Indigo UI Notes field value.)
dev = indigo.devices[123456789]
dev.description = "My new description."
dev.replaceOnServer()

dev = indigo.devices[987654321]
dev.name = "My New Name"
dev.replaceOnServer()
```

Properties like `Comm Enabled` and `Remote Display` can also be updated using a different approach.
```python
# Set Enabled/Disabled state
indigo.device.enable(12345678, True)
# Set Remote Display Flag
indigo.device.displayInRemoteUI(987654321, False)
```

<span class="ca">**Command Syntax Examples**</span>

Some device base class properties need to be updated differently than the examples above because they can only be updated by the plugin that owns them. Properties like `address` and `version` can be updated by their own plugins. For example,

```python
# Updating a plugin device's properties
dev = indigo.devices[641471711]
new_props = dev.pluginProps
new_props['address'] = "abc"
new_props['version'] = "123"  # Indigo UI Firmware field
dev.replacePluginPropsOnServer(new_props)
```

Note that you can't update these in the same way as `name` and `description`. Instead, you change them as `pluginProps` and Indigo migrates these values to the base class props for you.

## About Plugin Properties { .ref-head-no-code }

Devices have properties - some are class properties, defined by the class itself. One of the biggest requests we've gotten in the past is some way to add arbitrary properties to a device - so that you could store your own data with the device in the database. And with plugin defined devices, we needed a place to store the properties that you need to operate the device. That's what the `pluginProps` and `globalProps` represent - the additional properties that are not defined by the class. `globalProps` is a dictionary of every additional property defined for the device - each plugin has its own dictionary of props in here which are readable by anyone. `pluginProps` is a shortcut to get to your plugin's props and are only writable by your plugin once the plugin has been created - a script can create a device supplied by your plugin along with the necessary properties, which are passed in on the `create()` method. You should publish the properties necessary to make your device work so that scripters can create your devices.

We mentioned before that devices were read-only, and that's true, and that you'd need to use commands in a different command name space. That's ***mostly*** true. Here's one exception to that rule: to change a device's pluginProps (it must be "owned" by your plugin - that is, the pluginId must be set to your id), you use a method that's in the device's class: replacePluginPropsOnServer(). Here's an example:

```python
dev=indigo.devices[123]
localPropsCopy = dev.pluginProps
localPropsCopy['pollInterval'] = 10
dev.replacePluginPropsOnServer(localPropsCopy)
```

You would use this technique if you wanted to just change some of the properties that are already defined. Because this method replaces ALL the properties for your plugin in the device, you can just set them all in one call:

```python
dev=indigo.devices[123]
dev.replacePluginPropsOnServer({'pollInterval':10,'checkForUpdates':True})
```

Note, though, that if you have a `<ConfigUI>` defined for the device, those properties are also stored here - so in order to make sure your device works correctly you must include those properties as well. If you need to update several properties in your props dict, you can use the `update()` method:

```python
dev=indigo.devices[123]
localPropsCopy = dev.pluginProps
localPropsCopy.update({'pollInterval':10, 'checkForUpdates':True})
dev.replacePluginPropsOnServer(localPropsCopy)
```

The `update()` method will change the properties specified, and add the property if it doesn't exist. Now, you might be wondering - why do the extra `localPropsCopy = dev.pluginProps` rather than just modify the props in place:

```python
dev=indigo.devices[123]
dev.pluginProps.update({'pollInterval':10, 'checkForUpdates':True})
dev.replacePluginPropsOnServer(dev.pluginProps)
```

Because the dev object is read-only - when you reference `dev.pluginProps`, it returns a copy rather than returning a reference to the read-only object. So, in effect, you'd be modifying a copy. But, because you aren't saving a reference to that copy, it goes away since the next time you reference `dev.pluginProps` another copy is made.

If you need to just dump all the properties for a device, you can just:

```python
dev=indigo.devices[123]
dev.replacePluginPropsOnServer(None)
```

That will completely remove your properties from the device.

## About Custom Device States { .ref-head-no-code }

If your plugin defines custom devices, they will also need to define a collection of custom states. For instance, let's look at the states defined in a custom device's Devices.xml:

```xml
<States>
    <State id="playStatus">
        <ValueType>
            <List>
                <Option value="playing">Playing</Option>
                <Option value="paused">Paused</Option>
                <Option value="stopped">Stopped</Option>
                <Option value="unavailable">Unavailable</Option>
            </List>
        </ValueType>
        <TriggerLabel>Player Status Changed</TriggerLabel>
        <TriggerLabelPrefix>Player Status is</TriggerLabelPrefix>
        <ControlPageLabel>Current Player Status</ControlPageLabel>
        <ControlPageLabelPrefix>Player Status is</ControlPageLabelPrefix>
    </State>
    <State id="sep1">
        <ValueType>Separator</ValueType>
    </State>
    <State id="playlist">
        <ValueType>String</ValueType>
        <TriggerLabel>Current Playlist Name</TriggerLabel>
        <ControlPageLabel>Current Playlist Name</ControlPageLabel>
    </State>
    <State id="album">
        <ValueType>String</ValueType>
        <TriggerLabel>Current Album</TriggerLabel>
        <ControlPageLabel>Current Album</ControlPageLabel>
    </State>
    <State id="artist">
        <ValueType>String</ValueType>
        <TriggerLabel>Current Artist</TriggerLabel>
        <ControlPageLabel>Current Artist</ControlPageLabel>
    </State>
    <State id="track">
        <ValueType>String</ValueType>
        <TriggerLabel>Current Track</TriggerLabel>
        <ControlPageLabel>Current Track</ControlPageLabel>
    </State>
    <State id="volume">
        <ValueType>Integer</ValueType>
        <TriggerLabel>Current Volume</TriggerLabel>
        <ControlPageLabel>Current Volume</ControlPageLabel>
    </State>
    <State id="shuffle">
        <ValueType boolType="YesNo">Boolean</ValueType>
        <TriggerLabel>Shuffling</TriggerLabel>
        <ControlPageLabel>Shuffling</ControlPageLabel>
    </State>
</States>
<UiDisplayStateId>playStatus</UiDisplayStateId>
```

You'll recall from the [Custom Device Type](../../../plugin-dev/reference/xml/devices.md#devices-xml-custom-device) section of the developers guide, these define the states that are used in various places in the UI and by other objects (triggers, control pages, etc.) So, the question is now that the server understands the structure of your devices' states, how do you change them?

It's actually pretty simple. When your plugin detects a change in one of the states, you just call the `updateStateOnServer('id', value='value')` method. Here are some examples for setting the state based on the above state definitions:

```python
# assume that someMusicServer represents a device with the above states
# to update the volume state
someMusicServer.updateStateOnServer('volume', value=50)
# to update the track name
someMusicServer.updateStateOnServer('track', value='Cluster One')
# to update the album name
someMusicServer.updateStateOnServer('album', value='The Division Bell')
# to update the artist name
someMusicServer.updateStateOnServer('artist', value='Pink Floyd')
# to update the playStatus
someMusicServer.updateStateOnServer('playStatus', value='playing')
# to update the playStatus
someMusicServer.updateStateOnServer('shuffle', value=True)
```

!!! note
    For states that have a `<ValueType>` of `Number`, you pass an integer or float; for states that are `Boolean`, you pass Python `True` or `False`; all others pass a string.


It's just that simple. This will cause any triggers on the server that are set on your device's states to be fired. It will update any visible control pages. It will show the state that's defined in the `<UiDisplayStateId>` element in the Mac device table's `State` column.

The `updateStateOnServer` method has 3 optional parameters: `decimalPlaces` (integer), `triggerEvents` (boolean), and `uiValue` (string, <span class="dw-color-red">API v1.6+ only</span>).

When updating floating point state values use the `decimalPlaces` parameter to specify the number of fractional digits to store and display. For example:

`someThermmostateDevice.updateStateOnServer('mainTemp', value=76.1234, decimalPlaces=2)`

instructs the Indigo Server to store and display the value as 76.12.

The `triggerEvents` parameter can be set to False (defaults to True) to have the Indigo Server update the state but ignore any Device State Changed triggers that should be processed as a result of the state change.

And the optional `uiValue` parameter is used to set UI only display string of the value which is not used in triggers or conditional logic. This is useful for adding units, percent signs, etc.:

`dev.updateStateOnServer('sensorValue', 72.3, uiValue=u'72.3 °F')`

## Commands (indigo.device.*) { .ref-head-no-code }

### All Off { .ref-head-no-code }

Turns off all devices for all protocols unless a direct parameter is specified. The direct parameter, if specified, will determine which devices will be turned off. In the context of this command, devices are defined as all dimmable (light) and relay (appliance) devices and does not include other device types that may have an on/off state. This command doesn’t work for plugin defined devices regardless of type.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.device.allOff()`<br>
`indigo.device.allOff(indigo.kAllDeviceSel.HouseCodeA)`<br>
`indigo.device.allOff(indigo.kAllDeviceSel.Insteon)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                   | Required | Type                                                | Description                                                                                                                                        |
|---------------------------------------------|----------|-----------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">direct parameter</span> | Yes      | *[kAllDeviceSel](#all-device-selector-enumeration)* | enumerated value to indicate which devices to turn off, all if no parameter is passed - see the `kAllDeviceSel` enumeration for a full description |

#### All Device Selector Enumeration { #all-device-selector-enumeration .ref-head-no-code }

| <span class="nw cb">`indigo.kAllDeviceSel`</span> |                                                 |
|---------------------------------------------------|-------------------------------------------------|
| Enumerated Type                                   | Description                                     |
| <span class="nw cb">`Insteon`</span>              | specify all Insteon devices that support ON/OFF |
| <span class="nw cb">`X10`</span>                  | specify all X10 devices that support ON/OFF     |
| <span class="nw cb">`ZWave`</span>                | specify all Z-Wave devices that support ON/OFF  |
| <span class="nw cb">`HouseCodeA`</span>           | specify all X10 devices in house code A         |
| <span class="nw cb">`HouseCodeB`</span>           | specify all X10 devices in house code B         |
| <span class="nw cb">`HouseCodeC`</span>           | specify all X10 devices in house code C         |
| <span class="nw cb">`HouseCodeD`</span>           | specify all X10 devices in house code D         |
| <span class="nw cb">`HouseCodeE`</span>           | specify all X10 devices in house code E         |
| <span class="nw cb">`HouseCodeF`</span>           | specify all X10 devices in house code F         |
| <span class="nw cb">`HouseCodeG`</span>           | specify all X10 devices in house code G         |
| <span class="nw cb">`HouseCodeH`</span>           | specify all X10 devices in house code H         |
| <span class="nw cb">`HouseCodeI`</span>           | specify all X10 devices in house code I         |
| <span class="nw cb">`HouseCodeJ`</span>           | specify all X10 devices in house code J         |
| <span class="nw cb">`HouseCodeK`</span>           | specify all X10 devices in house code K         |
| <span class="nw cb">`HouseCodeL`</span>           | specify all X10 devices in house code L         |
| <span class="nw cb">`HouseCodeM`</span>           | specify all X10 devices in house code M         |
| <span class="nw cb">`HouseCodeN`</span>           | specify all X10 devices in house code N         |
| <span class="nw cb">`HouseCodeO`</span>           | specify all X10 devices in house code O         |
| <span class="nw cb">`HouseCodeP`</span>           | specify all X10 devices in house code P         |

### Beep { .ref-head-no-code }

!!! note
    API v1.11+ only

Requests that the device make an audible beep or buzz. Only supported by some hardware.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.device.beep(123)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                   | Required | Type    | Description                  |
|---------------------------------------------|----------|---------|------------------------------|
| <span class="nw cb">direct parameter</span> | Yes      | integer | id or instance of the device |

### Create { .ref-head-no-code }

Create a device. You can create devices that are defined by your plugin, in other plugins, and X10 devices. You can't currently create devices that use the Insteon or Z-Wave protocol because of the complex synchronization needed during definition. Use this method to create ALL device types - it will return a device of the correct class to you based on the arguments. It can be considered the "device" factory method.

This method returns a **copy** of the newly created device.

<span class="ca">**Command Syntax Examples**</span>

```python
indigo.device.create(protocol=indigo.kProtocol.Plugin,
    address='F8',
    name='Device Name Here',
    description='Description Here',
    pluginId='com.mycompany.pluginId',
    deviceTypeId='myDeviceTypeId',
    props={'propA':'value', 'propB':'value'},
    folder=1234)
```

<span class="ca">**Parameters**</span>

| Parameter                                 | Required | Type                                 | Description                                                                                                                                                                                                                      |
|-------------------------------------------|----------|--------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`address`</span>      | No       | string                               | the address of the X10 device - plugins must set an `address` property in their property dictionary                                                                                                                              |
| <span class="nw cb">`description`</span>  | No       | string                               | the description of the device                                                                                                                                                                                                    |
| <span class="nw cb">`deviceTypeId`</span> | Yes      | string                               | the id of the device type – defined by the plugin or one of the defined X10 devices.                                                                                                                     |
| <span class="nw cb">`folder`</span>       | No       | integer                              | id or instance of the folder in which to put the newly created device                                                                                                                                                            |
| <span class="nw cb">`name`</span>         | Yes      | string                               | the name of the device                                                                                                                                                                                                           |
| <span class="nw cb">`pluginId`</span>     | No       | string                               | the plugin ID - defaults to your plugin's id if in a [Server Plugin](../../../plugin-dev/guide.md#indigo-server-plugins)                                                                                                         |
| <span class="nw cb">`props`</span>        | No       | dictionary                           | this is the properties for the device - they will be inserted in to the pluginId's property space as supplied above. If you are creating a device of a type defined in a different plugin, it's that plugin's id and properties. |
| <span class="nw cb">`protocol`</span>     | Yes      | *[kProtocol](#protocol-enumeration)* | the protocol for the device (`indigo.kProtocol.Plugin` or `indigo.kProtocol.X10`)                                                                                                                                                |

### Delete { .ref-head-no-code }

Delete the specified device regardless of its type.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.device.delete(123)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                   | Required | Type    | Description                            |
|---------------------------------------------|----------|---------|----------------------------------------|
| <span class="nw cb">direct parameter</span> | Yes      | integer | id or instance of the device to delete |

### Duplicate { .ref-head-no-code }

Duplicate the specified device regardless of the type. This method returns a copy of the new device.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.device.duplicate(123, duplicateName='New Name')`</span>

<span class="ca">**Parameters**</span>

| Parameter                                   | Required | Type    | Description                               |
|---------------------------------------------|----------|---------|-------------------------------------------|
| <span class="nw cb">direct parameter</span> | Yes      | integer | id or instance of the device to duplicate |
| <span class="nw cb">`duplicateName`</span>  | No       | string  | name for the newly duplicated device      |

### Enable/Disable { .ca #enable-disable }

Enable/Disable the specified device regardless of the type.

<span class="ca">**Command Syntax Examples**</span>

```python
indigo.device.enable(123, value=True) # enable
indigo.device.enable(123, value=False) # disable
```

<span class="ca">**Parameters**</span>

| Parameter                                   | Required | Type    | Description                                    |
|---------------------------------------------|----------|---------|------------------------------------------------|
| <span class="nw cb">direct parameter</span> | Yes      | integer | id or instance of the device to enable/disable |
| <span class="nw cb">`value`</span>          | No       | boolean | `True` to enable, `False` to disable           |

### Get Dependencies { .ref-head-no-code }

Return an indigo.Dict with all the dependencies on this device.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.device.getDependencies(123)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                   | Required | Type    | Description                                               |
|---------------------------------------------|----------|---------|-----------------------------------------------------------|
| <span class="nw cb">direct parameter</span> | Yes      | integer | id or instance of the device to get the dependencies for. |

The dictionary will look something like this:

```python
>>> print( )indigo.device.getDependencies(91776575))
Data : (dict)
     actionGroups : (list)
          Data : (dict)
               ID : 1280166770 (integer)
               Name : Set var to device state (string)
     controlPages : (list)
     devices : (list)
     schedules : (list)
     triggers : (list)
          Data : (dict)
               ID : 106487666 (integer)
               Name : Thermostat condition test (string)
     variables : (list)
```

So, the dictionary will have 6 top-level keys: "actionGroups", "controlPages", "devices", "schedules", "triggers", and "variables". Each one of those keys will return a list object. Inside that list object will be multiple dicts, one for each dependency (or an empty list if there are none). Each dependency dictionary has two keys: "ID" which is the unique id and "Name" which is the name of the object.

### Get Group List { .ref-head-no-code }

!!! note
    API v1.14+ only

Return an indigo.List with all device IDs in a device group.

<span class="ca">**Command Syntax Examples**</span>

Returns an indigo.List of all devices grouped with dev

<span class="nw cb">`indigo.device.getGroupList(123)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                   | Required | Type    | Description                                                  |
|---------------------------------------------|----------|---------|--------------------------------------------------------------|
| <span class="nw cb">direct parameter</span> | Yes      | integer | id or instance of any device that belongs to a device group. |

getGroupList() is useful to get the main/root device of a device group. Some properties, such as batteryLevel, only exist on the main/root device. In this example we log the batteryLevel for a module given any devices that belong to its group:

```python
groupList = indigo.device.getGroupList(devIdOrInstance)
rootDevice = indigo.devices[groupList[0]]
indigo.server.log('battery level is: ' + str(rootDevice.batteryLevel))
```

See also `indigo.device.groupWithDevice()` and `indigo.device.ungroupDevice()`.

### Group With Device { .ref-head-no-code }

To group two or more devices together, use the `indigo.device.groupWithDevice()` command. The parameters are the Indigo Device object IDs of the devices to be grouped. **Note if you have the device dialog UI open, it will not dynamically update, and you shouldn’t call either method if the device factory UI is open.**

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.device.groupWithDevice(dev_1, dev_2)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                           | Required | Type    | Description                                                           |
|-----------------------------------------------------|----------|---------|-----------------------------------------------------------------------|
| <span class="nw cb">direct parameter</span> (dev_1) | Yes      | integer | id, name or instance of a device that will belong to the group.       |
| <span class="nw cb">direct parameter</span> (dev_2) | Yes      | integer | id, name or instance of another device that will belong to the group. |

For example, if you want to group devices 123 and 456, you would use `indigo.device.groupWithDevice(123, 456)`. There is no message printed to the events log if the devices grouped together successfully. If you want to add device 789 to the group, you would use `indigo.device.groupWithDevice(456, 789)`. This is a great way to bring together different devices that have a common thread, but bear in mind that it's best not to try to group too many devices together. See also `indigo.device.ungroupDevice()` and `indigo.device.getGroupList()`.

### Move To Folder { .ref-head-no-code }

Use this command to move the device to a different folder.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.device.moveToFolder(123, value=987)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                   | Required | Type    | Description                                        |
|---------------------------------------------|----------|---------|----------------------------------------------------|
| <span class="nw cb">direct parameter</span> | Yes      | integer | id or instance of the device                       |
| <span class="nw cb">`value`</span>          | Yes      | integer | id or instance of the folder to move the device to |

### Ping Device { .ref-head-no-code }

!!! note
    API v1.16+ only

Sends the Z-Wave or Insteon module a ping command and measures the round trip ACK time. Returns a dict containing the `Success` and `TimeDelta` (milliseconds) result.

<span class="ca">**Command Syntax Examples**</span>

```python
result = indigo.device.ping(123, suppressLogging=True)
if result["Success"]:
    indigo.server.log("%.3f seconds ping for %s" % (result["TimeDelta"]/1000.0, dev.name))
else:
    indigo.server.log("ping failed for %s" % dev.name, isError=True)
```

<span class="ca">**Parameters**</span>

| Parameter                                    | Required | Type    | Description                                                                                 |
|----------------------------------------------|----------|---------|---------------------------------------------------------------------------------------------|
| <span class="nw cb">direct parameter</span>  | Yes      | integer | id or instance of the device                                                                |
| <span class="nw cb">`suppressLogging`</span> | No       | boolean | `True` to keep the request from being logged into the event log window (default is `False`) |

### Remove Delayed Actions { .ref-head-no-code }

This command will remove delayed actions for the specified device.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.device.removeDelayedActions(123)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                   | Required | Type    | Description                  |
|---------------------------------------------|----------|---------|------------------------------|
| <span class="nw cb">direct parameter</span> | No       | integer | id or instance of the device |

### Reset Accumulated Energy Total { .ref-head-no-code }

!!! note
    API v1.11+ only

Resets the `energyAccumTotal` and `energyAccumTimeDelta` values and changes the `energyAccumBaseTime` to the server's current datetime.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.device.resetEnergyAccumTotal(123)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                   | Required | Type    | Description                  |
|---------------------------------------------|----------|---------|------------------------------|
| <span class="nw cb">direct parameter</span> | Yes      | integer | id or instance of the device |

### Set Remote Display { .ref-head-no-code }

Use this command to set the remote display flag for the folder.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.device.displayInRemoteUI(123, value=True)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                   | Required | Type    | Description                                                              |
|---------------------------------------------|----------|---------|--------------------------------------------------------------------------|
| <span class="nw cb">direct parameter</span> | Yes      | integer | id or instance of the device                                             |
| <span class="nw cb">`value`</span>          | Yes      | boolean | True to display the device on remote user interfaces or False to hide it |

### Status Request { .ref-head-no-code }

This tells IndigoServer to send a status request command to the specified device and refresh its status.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.device.statusRequest(123)`<br>
`indigo.device.statusRequest(123, suppressLogging=True)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                    | Required | Type    | Description                                                                                 |
|----------------------------------------------|----------|---------|---------------------------------------------------------------------------------------------|
| <span class="nw cb">direct parameter</span>  | Yes      | integer | the id of the device                                                                        |
| <span class="nw cb">`suppressLogging`</span> | No       | boolean | `True` to keep the request from being logged into the event log window (default is `False`) |

### Toggle { .ref-head-no-code }

This tells IndigoServer to toggle a device from on to off or vice versa depending on its current state. This command only works for device types that can be turned on and off.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.device.toggle(123)`<br>
`indigo.device.toggle(123, delay=10, duration=300)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                   | Required | Type    | Description                                                                   |
|---------------------------------------------|----------|---------|-------------------------------------------------------------------------------|
| <span class="nw cb">direct parameter</span> | Yes      | integer | id or instance of the device                                                  |
| <span class="nw cb">`delay`</span>          | No       | integer | number of seconds to delay before toggling the device                         |
| <span class="nw cb">`duration`</span>       | No       | integer | number of seconds delay before the device toggles back to it’s original state |

### Turn Off { .ref-head-no-code }

This tells IndigoServer to turn off a device. This command only works for device types that can be turned on and off.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.device.turnOff(123)`<br>
`indigo.device.turnOff(123, delay=10, duration=300)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                   | Required | Type    | Description                                              |
|---------------------------------------------|----------|---------|----------------------------------------------------------|
| <span class="nw cb">direct parameter</span> | Yes      | integer | id or instance of the device                             |
| <span class="nw cb">`delay`</span>          | No       | integer | number of seconds to delay before turning off the device |
| <span class="nw cb">`duration`</span>       | No       | integer | number of seconds delay before the device turns back on  |

### Turn On { .ref-head-no-code }

This tells IndigoServer to turn on a device. This command only works for device types that can be turned on and off.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.device.turnOn(123)`<br>
`indigo.device.turnOn(123, delay=10, duration=300)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                   | Required | Type    | Description                                              |
|---------------------------------------------|----------|---------|----------------------------------------------------------|
| <span class="nw cb">direct parameter</span> | Yes      | integer | id or instance of the device                             |
| <span class="nw cb">`delay`</span>          | No       | integer | number of seconds to delay before turning on the device  |
| <span class="nw cb">`duration`</span>       | No       | integer | number of seconds delay before the device turns back off |

### Ungroup With Device { .ref-head-no-code }

If you want to remove a device from a group, use the `indigo.device.ungroupDevice()` command. Use this command with the ID of the device you want removed from the group.**Note if you have the device dialog UI open, it will not dynamically update, and you shouldn’t call either method if the device factory UI is open.**

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.device.ungroupDevice(dev)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                   | Required | Type    | Description                                                      |
|---------------------------------------------|----------|---------|------------------------------------------------------------------|
| <span class="nw cb">direct parameter</span> | Yes      | integer | id, name or instance of the device to be removed from the group. |

If successful, nothing will be printed to the events log. See also `indigo.device.groupWithDevice()` and `indigo.device.getGroupList()`.

### Unlock { .ref-head-no-code }

!!! note
    API v2.0+ only

This tells IndigoServer to unlock a device. This command only works for relay device types that have `pluginProps["IsLockSubType"]` set to True.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.device.unlock(123)`<br>
`indigo.device.unlock(123, delay=10, duration=300)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                   | Required | Type    | Description                                                   |
|---------------------------------------------|----------|---------|---------------------------------------------------------------|
| <span class="nw cb">direct parameter</span> | Yes      | integer | id or instance of the device                                  |
| <span class="nw cb">`delay`</span>          | No       | integer | number of seconds to delay before unlocking the device        |
| <span class="nw cb">`duration`</span>       | No       | integer | number of seconds delay before the device automatically locks |

### Lock { .ref-head-no-code }

!!! note
    API v2.0+ only

This tells IndigoServer to lock a device. This command only works for relay device types that have the property `pluginProps["IsLockSubType"]` set to True.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.device.lock(123)`<br>
`indigo.device.lock(123, delay=10, duration=300)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                   | Required | Type    | Description                                                     |
|---------------------------------------------|----------|---------|-----------------------------------------------------------------|
| <span class="nw cb">direct parameter</span> | Yes      | integer | id or instance of the device                                    |
| <span class="nw cb">`delay`</span>          | No       | integer | number of seconds to delay before locking the device            |
| <span class="nw cb">`duration`</span>       | No       | integer | number of seconds delay before the device automatically unlocks |

<span class="ca">**Command Syntax Examples**</span>

```python
# Creating a device
myDevice = indigo.device.create(protocol=indigo.kProtocol.X10,
    name="Office Lamp",
    description="X10 Lamp module",
    address="F7",
    deviceTypeId="LampLinc Plus Plug-In Dimmer")

# Getting a copy of a device
myDevice = indigo.devices[123]

# Logging a message if it’s an X10 device
if myDevice.protocol == indigo.kProtocol.X10:
    indigo.server.log("device is an X10 device")

# Logging a message if it’s showing in Indigo Touch
if myDevice.remoteDisplay:
    indigo.server.log("device is showing in Indigo Touch")

# Setting the folder ID that the device is in
indigo.device.setFolder(myDevice, 987)

# Turning off all devices (dimmer and relay)
indigo.device.allOff()

# Turning off all devices in X10 house code A
indigo.device.allOff(indigo.kAllDeviceSel.HouseCodeA)

# Turning off all Insteon devices
indigo.device.allOff(indigo.kAllDeviceSel.Insteon)
```
