<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/reference/plugin-py/device-methods/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Device Specific Methods

## deviceCreated() { .ref-head data-toc-label="deviceCreated" }

This method will get called whenever a new device defined by your plugin is created. In many circumstances you won't need to implement this method since the default behavior — which is to call the `deviceStartComm()` method if the device belongs to your plugin and is enabled — is what you want anyway (see `deviceStartComm()` above for details). However, if you need to know when a device is created but before your plugin is asked to start communicating with it, this method provides that hook. If you implement this method you'll need to call `deviceStartComm()` yourself or duplicate the functionality here.

You can also have this method called for devices that don't belong to your plugin. If you want to know when all devices are created (and updated/deleted), call `indigo.devices.subscribeToChanges()` to have the IndigoServer send all device creation/update/deletion notifications. As with other change subscriptions, this should be used very sparingly since it's a lot of overhead both for your plugin and, more importantly, for the IndigoServer.

<span class="ca">**Method**</span>  

| Method Name                                           | Required |
|-------------------------------------------------------|----------|
| <span class="nw cb">`deviceCreated(self, dev)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter                        | Description                                                        |
|----------------------------------|--------------------------------------------------------------------|
| <span class="nw cb">`dev`</span> | an `indigo.Device` object representing the device that was created |

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
def deviceCreated(self, dev):
    # Perform any tasks necessary to make sure the new device is fully configured, and optionally, perform an initial refresh.
```

## deviceDeleted() { .ref-head data-toc-label="deviceDeleted" }

Complementary to the `deviceCreated()` method described above, but signals device deletes. The default implementation just checks to see if the device belongs to your plugin and -- if so -- calls the `deviceStopComm()` method. If you implement this method you'll need to call `deviceStopComm()` yourself or duplicate the functionality here.

<span class="ca">**Method**</span>  

| Method Name                                           | Required |
|-------------------------------------------------------|----------|
| <span class="nw cb">`deviceDeleted(self, dev)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter                        | Description                                                        |
|----------------------------------|--------------------------------------------------------------------|
| <span class="nw cb">`dev`</span> | an `indigo.Device` object representing the device that was deleted |

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
def deviceDeleted(self, dev):
    # Perform any clean up tasks after a plugin device is deleted
```

## deviceStartComm() { .ref-head data-toc-label="deviceStartComm" }

If your plugin defines devices, this is likely the place where you'll want to do the work of starting your device up. For instance, let's say that you have a device somewhere out on the network - the easiest way to "start" your device is to implement this method. You would open the network address:port (that's defined in `dev.pluginProps`), get it's current state(s) and tell the IndigoServer to set those states (using the `dev.updateStateOnServer()` method).

<span class="ca">**Method**</span>  

| Method Name                                             | Required |
|---------------------------------------------------------|----------|
| <span class="nw cb">`deviceStartComm(self, dev)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter                        | Description                                       |
|----------------------------------|---------------------------------------------------|
| <span class="nw cb">`dev`</span> | an `indigo.Device` object representing the device |

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
def deviceStartComm(self, dev):
    # Perform any clean up tasks after communication with a plugin device is (re)established.
```

## deviceStopComm() { .ref-head data-toc-label="deviceStopComm" }

This is the complementary method to `deviceStartComm()` - it gets called when the device should no longer be active/enabled. For instance, when the user disables or deletes a device, this method gets called.

<span class="ca">**Method**</span>  

| Method Name                                            | Required |
|--------------------------------------------------------|----------|
| <span class="nw cb">`deviceStopComm(self, dev)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter                        | Description                                       |
|----------------------------------|---------------------------------------------------|
| <span class="nw cb">`dev`</span> | an `indigo.Device` object representing the device |

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
def deviceStopComm(self, dev):
    # Perform any clean up tasks after communication with a plugin device is disabled.
```

## deviceUpdated() { .ref-head data-toc-label="deviceUpdated" }

Complementary to the `deviceCreated()` method described above, but signals device updates. You'll get a copy of the old device object as well as the new device object. The default implementation of this method will do a few things for you: if either the old or new device are devices defined by you, and if the device type changed OR the communication-related properties have changed (as defined by the `didDeviceCommPropertyChange()` method - see above for details) then `deviceStopComm()` and `deviceStartComm()` methods will be called as necessary (stop only if the device changed to a type that isn't your device, start only if the device changed to a type that belongs to you, or both if the props/type changed and they both belong to you).

<span class="ca">**Method**</span>  

| Method Name                                                       | Required |
|-------------------------------------------------------------------|----------|
| <span class="nw cb">`deviceUpdated(self, origDev, newDev)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter                            | Description                                                         |
|--------------------------------------|---------------------------------------------------------------------|
| <span class="nw cb">`origDev`</span> | an `indigo.Device` object representing the device before the change |
| <span class="nw cb">`newDev`</span>  | an `indigo.Device` object representing the device after the change  |

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
def deviceUpdated(self, origDev, newDev):
    # You are responsible for isolating the te difference(s) between the old and new device objects as needed.
```

## didDeviceCommPropertyChange() { .ref-head data-toc-label="didDeviceCommPropertyChange" }

This method gets called by the default implementation of `deviceUpdated()` to determine if any of the properties needed for device communication (or any other change requires a device to be stopped and restarted). The default implementation checks for any changes to properties. You can implement your own to provide more granular results. For instance, if your device requires 4 parameters, but only 2 of those parameters requires that you restart the device, then you can check to see if either of those changed. If they didn't then you can just return False and your device won't be restarted (via `deviceStopComm()`/`deviceStartComm()` calls).

<span class="ca">**Method**</span>  

| Method Name                                                                     | Required |
|---------------------------------------------------------------------------------|----------|
| <span class="nw cb">`didDeviceCommPropertyChange(self, origDev, newDev)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter                            | Description                                                         |
|--------------------------------------|---------------------------------------------------------------------|
| <span class="nw cb">`origDev`</span> | an `indigo.Device` object representing the device before the change |
| <span class="nw cb">`newDev`</span>  | an `indigo.Device` object representing the device after the change  |

<span class="ca">**Return Value:**</span>

| Type | Description                                                                |
|------|----------------------------------------------------------------------------|
| bool | True if communication-relevant device properties changed; False otherwise. |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span>

```python
def didDeviceCommPropertyChange(self, origDev, newDev):
    # You are responsible for isolating the te difference(s) between the old and new device objects as needed.
```

## getDeviceConfigUiValues() { .ref-head data-toc-label="getDeviceConfigUiValues" }

This method will get called whenever a Device configuration is opened. Indigo will look for this method and, if it exists, will pre-populate the configuration dialog with the information created/modified in the method. This method is particularly helpful when you want a Device's configuration to be different from the default (set in the Device configuration XML file). A simple example is provided below.

<span class="ca">**Method**</span>  

| Method Name                                                                            | Required |
|----------------------------------------------------------------------------------------|----------|
| <span class="nw cb">`getDeviceConfigUiValues(self, pluginProps, typeId, devId)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter                                | Description                                            |
|------------------------------------------|--------------------------------------------------------|
| <span class="nw cb">`pluginProps`</span> | a dictionary of the device's current plugin properties |
| <span class="nw cb">`typeId`</span>      | the device type ID string as defined in Devices.xml    |
| <span class="nw cb">`devId`</span>       | the integer ID of the device being configured          |

<span class="ca">**Return Value:**</span>

| Type  | Description                                                             |
|-------|-------------------------------------------------------------------------|
| tuple | A `(valuesDict, errorMsgDict)` tuple to pre-populate the config dialog. |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span>

```python
def getDeviceConfigUiValues(self, pluginProps, typeId, devId):
    valuesDict = pluginProps
    errorMsgDict = indigo.Dict()
    if not valuesDict.get("someProp"):
        valuesDict["someProp"] = "default value"
    return valuesDict, errorMsgDict
```

## getDeviceDisplayStateId() { .ref-head data-toc-label="getDeviceDisplayStateId" }

If your plugin defines custom devices, this method will be called by the server to determine which device state ID to display in the device list UI state column. The default implementation just returns the `<UiDisplayStateId>` element in your Devices.xml file. You can, however, implement the method the plugin needs to dynamically determine the which state ID to display.

<span class="ca">**Method**</span>  

| Method Name                                                     | Required |
|-----------------------------------------------------------------|----------|
| <span class="nw cb">`getDeviceDisplayStateId(self, dev)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter                        | Description                                       |
|----------------------------------|---------------------------------------------------|
| <span class="nw cb">`dev`</span> | an `indigo.Device` object representing the device |

<span class="ca">**Return Value:**</span>

| Type | Description                                                 |
|------|-------------------------------------------------------------|
| str  | The state ID to display in the device list UI state column. |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span>

```python
def getDeviceDisplayStateId(self, dev):
   return dev.states['some_state_id']
```

## getDeviceStateList() { .ref-head data-toc-label="getDeviceStateList" }

If your plugin defines custom devices, this method will be called by the server when it tries to build the state list for your device. The default implementation just returns the `<States>` element (reformatted as an `indigo.List()` that's available to your plugin via `devicesTypeDict["yourCustomTypeIdHere"]`) in your Devices.xml file. You can, however, implement the method yourself to return a custom set of states. For instance, you may want to allow the user to create custom labels for the various inputs on your device rather than use generic "Input 1", "Input 2", etc., labels. Check out the EasyDAQ plugin which uses this approach.

Most plugins will not need to subclass `get_device_state_list()` because -- by default -- it returns the `<States>` list as defined in Devices.xml. So only subclass this method if you dynamically need to change the device states list provided based on specific device instance data (not just device types).

<span class="ca">**Method**</span>  

| Method Name                                                | Required |
|------------------------------------------------------------|----------|
| <span class="nw cb">`getDeviceStateList(self, dev)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter                        | Description                                       |
|----------------------------------|---------------------------------------------------|
| <span class="nw cb">`dev`</span> | an `indigo.Device` object representing the device |

<span class="ca">**Return Value:**</span>

| Type        | Description                                |
|-------------|--------------------------------------------|
| indigo.List | The list of device states for this device. |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span>

```python
def getDeviceStateList(self, dev):
    type_id = dev.deviceTypeId
    default_states_list = self.devicesTypeDict[type_id]['States']
    new_states_list = indigo.List()
    
    for state in default_states_list:
        # Make your changes
        new_states_list.append(state)

    return new_states_list
```
