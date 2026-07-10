<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugins/airfoilpro/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Airfoil Pro
[Airfoil](http://rogueamoeba.com/airfoil/) is a great application from [Rogue Amoeba](http://rogueamoeba.com/) that allows you to stream sound from your Mac or Windows computer to any combination of Airplay Devices, Bluetooth speakers, and [Airfoil satellite clients](http://rogueamoeba.com/airfoil/#satellite) (iOS, Android, Mac, Windows, Linux) - and it keeps it all in sync. Many Indigo users use it in conjunction with Apple TVs, Airport Expresses, and other computers and iOS devices to create whole-home audio systems, all streaming from your Mac/Windows computer running iTunes or other music applications.

The latest major release, [Airfoil v5](http://rogueamoeba.com/airfoil/), has a new API that enables a much more reliable and capable integration with Indigo. It works with both Airfoil 5 on [Mac](http://rogueamoeba.com/airfoil/mac/) and [Windows](http://rogueamoeba.com/airfoil/windows/) and can work with as many Airfoil instances as there are on your network.

!!! note
    This plugin requires v1.5 or later of the Airfoil API. This was delivered in Airfoil 5 for Mac and Windows. If you need support for earlier versions of Airfoil for Mac, please see [the legacy Airfoil plugin](https://github.com/IndigoDomotics/airfoil) that we open-sourced. Note, however, that it may not work with newer versions of Indigo.

## Airfoil Device Types
Each Airfoil instance that can be found on your local network can be added as a device in Indigo. When you add an Airfoil device, each speaker that's available in that instance of Airfoil will also be represented by its own device. This gives you a much more flexible set of devices that can be used in triggers, actions, and control pages.

### Airfoil Instance
This device type represents a single instance of Airfoil running on a Mac or Windows computer. Every Airfoil instance knows about the source that's currently selected, and in some cases (such as iTunes) knows about what's currently playing (album name, album art, artist, source name/id/icon, track name) and can control the source to some extent (toggle play/pause, next track, previous track). It also knows what sources are available so you can easily switch between them.

#### Adding an Instance
To create an Airfoil Instance device, click the `New...` button above the devices list. In the resulting Create New Device dialog, select Airfoil Pro as the type and you will see the Add Airfoil Instance... dialog:

![Add Airfoil Instance Image](../images/add_airfoil_instance.png)

In the first popup, select the Airfoil instance that you want to add. This popup is dynamically generated based on Airfoil's discovery protocol. If you don't see your Airfoil instance, make sure Airfoil v5 is running on a Mac or Windows computer on the same network as your Indigo server Mac.

The plugin can store a variety of images from Airfoil. You can use these images in refreshing image URLs on your control pages. The second field in the dialog is a full path to a directory where the plugin will store the image files. If you have multiple Airfoil instances, make sure you use a different directory since the image files have a fixed name. The plugin will store the following images in this directory:

- `albumArt.png` - an image of the currently playing album track if the source supports it (notably, iTunes)
- `machineIcon.png` - an icon representing the computer that is running this instance of Airfoil
- `machineIconAndScreenshot.png` - a screenshot from the host computer with the machine icon overlaid (though this functionality seems to be missing in Airfoil versions through v5.1.0 - you just get the same image as the machine icon)
- `sourceIcon.png` - an icon representing the selected audio source in Airfoil.

Leave the field empty if you don't wish for the plugin to store these images.

One oversight that there is in the Airfoil API is the ability to know the play state of the source. So the plugin can't know whether iTunes is playing or paused. If you are using the iTunes Indigo plugin, you have this information, but it's in a different device which could make control page design a little tricky. To work around this missing functionality, we allow you to select an iTunes server Indigo device (that you've previously created) that represents the same iTunes server as the one your Airfoil instance is using as its source. The plugin will monitor that iTunes device and update the sourcePlayStatus state so that it mirrors the iTunes device.

When you click the "Save" button, the plugin will create your Airfoil Instance device, and it will query Airfoil and get all it's known speakers. It will then create devices for each of those speakers (see the next section for details on those devices).

This is what the Edit Device dialog will look like when it's finished:

![Airfoil Edit Group Image](../images/airfoil_edit_group.png)

Airfoil instances are actually a group of devices: the instance itself (the first tab), and then multiple speaker devices, one for each speaker device that your instance knows about. We set the name of the Airfoil Instance to the Airfoil name. For each speaker, we name the speaker with this pattern: "Speaker Name (Airfoil Instance Name speaker)" to help you see how the devices relate to each other. We also add a note to each speaker device with a bit more detail about its relationship to its parent Airfoil Instance device.

Airfoil Instance devices have the following state changes that you can use in Triggers:

![Airfoil Triggers Image](../images/airfoil_triggers.png)

!!! warning
    Due to changes that Apple has made to their API, the *`Source Status Is Playing`* trigger will no longer fire. This trigger option will be adjusted in a future release.

Those states can also be displayed in Control Pages.

#### States available to Scripts
If you want to use an Airfoil Instance device in a script, here are the state details:

| **State Key**               | **Value Type**                                        | **Description**                                                                                                                              |
|-----------------------------|-------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| *`canConnect`*              | boolean                                               | This instance allows remote speakers to connect                                                                                              |
| *`canRemoteControl`*        | boolean                                               | This instance allows remote control of the source                                                                                            |
| *`instanceName`*            | string                                                | The name of the instance. On Mac systems, this is the name of the Mac as defined in the Sharing System Preference Panel                      |
| *`protocolVersion`*         | string                                                | This is the version of Airfoil's API that this instance uses. v1.5 is the minimum.                                                           |
| *`sourceAlbum`*             | string                                                | The name of the album that the selected source is playing (if sourceMetadataAvailable == True)                                               |
| *`sourceArtist`*            | string                                                | The name of the artist of the album that the selected source is playing (if sourceMetadataAvailable == True)                                 |
| *`sourceBundleId`*          | string                                                | The unique identifier of the source                                                                                                          |
| *`sourceMachineModel`*      | string                                                | The model of the computer running Airfoil                                                                                                    |
| *`sourceMachineName`*       | string                                                | The name of the computer running Airfoil (usually the same as the instanceName)                                                              |
| *`sourceMetadataAvailable`* | boolean                                               | The source supplies metadata (album, artist, track, etc)                                                                                     |
| *`sourceName`*              | string                                                | The name of the selected source                                                                                                              |
| *`sourcePlayStatus`*        | string (playing, paused, stopped, unavailable, error) | If the source is iTunes and you've selected an iTunes server as the source in this device's config, this will mirror that device's playState |
| *`sourceTrackName`*         | string                                                | The name of the track that the current source is playing (if sourceMetadataAvailable == True)                                                |
| *`status`*                  | string (disconnected, connected, unavailable)         | The status of this device with respect to the Airfoil communication                                                                          |


#### Notes
If you change the name of your Mac, you'll need to perform the `Define and Sync...` again - select the correct Airfoil instance in the sync dialog and `Save`. Unfortunately, Airfoil doesn't send out a name change notification so the plugin doesn't know what happened other than the instance it was talking to is now gone.

### Speaker
Each Airfoil Instance device has a collection of "Speaker" devices in its group. These are all the various outputs to which Airfoil can direct its source audio. These devices are created automatically when you create your Airfoil Instance and any time a new source gets added to the instance. For instance, if you create an Airfoil Instance and it finds 3 speakers, then at a later time you add a Bluetooth speaker to the Mac that Airfoil is running on, the plugin will automatically create a new speaker device for that Bluetooth speaker.

We never automatically delete speakers: if you have a Bluetooth speaker that fails, and you won't ever use it again, you'll need to remove it manually.

!!! warning
    You can't use the `Delete...` button above the device list without deleting ALL the devices in that Airfoil Instance Group. If you need to delete just a single speaker, select the `Plugins->Airfoil Pro->Permanently Delete Speaker` menu item. This will allow you to just delete a single speaker.

An unfortunate side effect of how Airfoil handles AirPlay devices, like AppleTVs, is that if you change the name of them it will create a new speaker instance (rather than just replacing it). From the API perspective, it's just another new speaker that was added. What you'll need to do in that case is switch over any triggers, actions, and control pages that use the old speaker to use the newly created speaker, then delete the speaker manually.

#### States available to Scripts { #speaker-states-available-to-scripts }
If you want to use an Airfoil Instance device in a script, here are the state details:

| **State Key**        | **Value Type**                                | **Description**                                                                 |
|----------------------|-----------------------------------------------|---------------------------------------------------------------------------------|
| *`longIdentifier`*   | string                                        | The unique identifier of the speaker                                            |
| *`name`*             | string                                        | The name of the speaker in Airfoil (which is different than its name in Indigo) |
| *`parentInstanceId`* | number                                        | The device ID of the parent Airfoil Instance                                    |
| *`status`*           | string (connected, disconnected, unavailable) | The status of the speaker                                                       |
| *`type`*             | string (local, airplay, Bluetooth, group)     | The type of speaker                                                             |
| *`volume`*           | number                                        | The volume that the speaker is currently set to.                                |


## Airfoil Actions
The Airfoil plugin provides a variety of actions that allow you to fully manage an Airfoil Instance and Speakers. We'll separate these into Speaker actions and Instance actions. These actions are available on the `Type:` menu in the actions edit dialog under `Device Actions->Airfoil Pro Controls` submenu.

![Action Menu Image](../images/actionmenu.png)

For those interested in controlling Airfoil Pro devices from another plugin or script, you will find the details below after a description of each action in the **Scripting details** section. You don't need to know or understand those sections if you're not interested in writing scripts.

### Notes for Script/Plugin Writers
If you examine the example scripts below, you'll note that each action call will return a result. Unless otherwise specified, it's just a boolean indicating if the action correctly ran.

You may also note that the action calls are inside a try block. If you specify *waitUntilDone=True* in your action call, you may catch an exception if something happened during the action execution. The exception message will explain in a human-readable string what occurred.

Finally, at the very end of the list are Script Actions - these are actions that don't really appear in the UI, but will return something useful for your script/plugin. See that section for more details.

### Speaker Actions
The things you want to do with speaker actions are pretty simple: control whether a speaker is being used and setting the volume of the speaker. To that end, here are the actions.

#### Connect Speaker
This action will cause Airfoil to begin broadcasting audio to the specified speaker.

##### Scripting details
**Action id**: connect

The deviceId is the Indigo ID of the Speaker device.

No properties for scripting required.

Example:

```python
plugin_id = "com.perceptiveautomation.indigoplugin.airfoilpro"

# Get a plugin object given the plugin id:
airfoil_plugin = indigo.server.getPlugin(plugin_id)

if airfoilPlugin.isEnabled():
    try:
        result = airfoilPlugin.executeAction(
            "connect",
            deviceId=135305663,  # ID of Speaker device
            waitUntilDone=True
        )
    except Exception as e:
        print(f"Exception occurred: {e}")
```


#### Disconnect Speaker
This action will cause Airfoil to stop broadcasting audio to the specified speaker.

##### Scripting details { #disconnect-speaker-scripting-details }
**Action id**: disconnect

The deviceId is the Indigo ID of the Speaker device.

No properties for scripting required.

Example:

```python
plugin_id = "com.perceptiveautomation.indigoplugin.airfoilpro"

# Get a plugin object given the plugin id:
airfoil_plugin = indigo.server.getPlugin(plugin_id)

if airfoilPlugin.isEnabled():
    try:
        result = airfoilPlugin.executeAction(
            "disconnect",
            deviceId=135305663,  # ID of Speaker device
            waitUntilDone=True
        )
    except Exception as e:
        print(f"Exception occurred: {e}")
```

#### Toggle Speaker
This action will cause Airfoil to toggle the specified speaker between connected and disconnected. Useful to execute from a single element (i.e. button) from a control page.

##### Scripting details { #toggle-speaker-scripting-details }
The deviceId is the Indigo ID of the Speaker device.

**Action id**: toggle

No properties for scripting required.

Example:

```python
plugin_id = "com.perceptiveautomation.indigoplugin.airfoilpro"

# Get a plugin object given the plugin id:
airfoil_plugin = indigo.server.getPlugin(plugin_id)

if airfoilPlugin.isEnabled():
    try:
        result = airfoilPlugin.executeAction(
            "toggle",
            deviceId=135305663,  # ID of Speaker device
            waitUntilDone=True
        )
    except Exception as e:
        print(f"Exception occurred: {e}")
```

#### Save Current Speaker States
This action will save the connection state for each speaker on the selected Airfoil device. This is useful if you need to temporarily change the state of some speakers, but you want to be able to easily, set them back to how they were before the change. You can optionally specify that Airfoil Group states also be saved though this option is usually not very useful since storing the current state of all speakers will usually accomplish the same as restoring a group.

##### Scripting details { #save-current-speaker-states-scripting-details }
**Action id**: saveCurrentSpeakerStates

The deviceId is the Indigo ID of the Airfoil device.

| *`includeAirfoilGroups`* | Optional (default is False) boolean specifying whether to include Airfoil Groups |
|--------------------------|----------------------------------------------------------------------------------|


Example 1 (no groups):

```python
plugin_id = "com.perceptiveautomation.indigoplugin.airfoilpro"

# Get a plugin object given the plugin id:
airfoil_plugin = indigo.server.getPlugin(plugin_id)

if airfoilPlugin.isEnabled():
    try:
        result = airfoilPlugin.executeAction(
            "saveCurrentSpeakerStates",
            deviceId=135305663,  # ID of Airfoil device
            waitUntilDone=True
        )
    except Exception as e:
        print(f"Exception occurred: {e}")
```

Example 2 (include groups):

```python
plugin_id = "com.perceptiveautomation.indigoplugin.airfoilpro"

# Get a plugin object given the plugin id:
airfoil_plugin = indigo.server.getPlugin(plugin_id)

if airfoilPlugin.isEnabled():
    try:
        # This time, we'll add the includeAirfoilGroups property that will also store group states
        result = airfoilPlugin.executeAction(
            "saveCurrentSpeakerStates",
            deviceId=135305663,  # ID of Airfoil device
            props={"includeAirfoilGroups": True},
            waitUntilDone=True
        )
    except Exception as e:
        print(f"Exception occurred: {e}")
```

#### Restore Saved Speaker States
This action will restore speaker states to what was previously saved using the above action.

##### Scripting details { #restore-saved-speaker-states-scripting-details }
**Action id**: saveCurrentSpeakerStates

The deviceId is the Indigo ID of the Airfoil device.

Example 1 (no groups):

```python
plugin_id = "com.perceptiveautomation.indigoplugin.airfoilpro"

# Get a plugin object given the plugin id:
airfoil_plugin = indigo.server.getPlugin(plugin_id)

if airfoilPlugin.isEnabled():
    try:
        result = airfoilPlugin.executeAction(
            "restoreSavedSpeakerStates",
            deviceId=135305663,  # ID of Airfoil device
            waitUntilDone=True
        )
    except Exception as e:
        print(f"Exception occurred: {e}")
```

#### Set Volume
This action will cause Airfoil to set the volume of specified speaker.

##### Scripting details { #set-volume-scripting-details }
**Action id**: setVolume

The deviceId is the Indigo ID of the Speaker device.

| *`volume`* | The volume (0-100) to set the speaker to |
|------------|------------------------------------------|


Example:

```python
plugin_id = "com.perceptiveautomation.indigoplugin.airfoilpro"

# Get a plugin object given the plugin id:
airfoil_plugin = indigo.server.getPlugin(plugin_id)

if airfoilPlugin.isEnabled():
    try:
        result = airfoilPlugin.executeAction(
            'setVolume',
            deviceId=135305663,  # ID of Speaker device
            props={'volume': 50},
            waitUntilDone=True
        )
    except Exception as e:
        print(f"Exception occurred: {e}")
```

#### Increase Volume
This action will cause Airfoil to increase the volume of specified speaker by the specified amount (defaults to 5).

##### Scripting details { #increase-volume-scripting-details }
**Action id**: increaseVolume

The deviceId is the Indigo ID of the Speaker device.

| *`volume`* | The delta (0-100) increase the speaker's volume by - default is 5 |
|------------|-------------------------------------------------------------------|


Example 1 (using default delta):

```python
plugin_id = "com.perceptiveautomation.indigoplugin.airfoilpro"

# Get a plugin object given the plugin id:
airfoil_plugin = indigo.server.getPlugin(plugin_id)

if airfoilPlugin.isEnabled():
    try:
        result = airfoilPlugin.executeAction(
            'increaseVolume',
            deviceId=135305663,  # ID of Speaker device
            waitUntilDone=True
        )
    except Exception as e:
        print(f"Exception occurred: {e}")
```

Example 2 (specifying delta):

```python
plugin_id = "com.perceptiveautomation.indigoplugin.airfoilpro"

# Get a plugin object given the plugin id:
airfoil_plugin = indigo.server.getPlugin(plugin_id)

if airfoilPlugin.isEnabled():
    try:
        result = airfoilPlugin.executeAction(
            'increaseVolume',
            deviceId=135305663,  # ID of Speaker device
            props={'volume': 15},
            waitUntilDone=True
        )
    except Exception as e:
        print(f"Exception occurred: {e}")
```

!!! note
    Because the Airfoil API doesn't directly support increase/decrease, the plugin gets the current volume from the speaker device and calculates the new volume. An unfortunate side effect is that if you send multiple increase/decrease actions in a brief amount of time, the plugin won't yet know that the speaker's volume has changed from the previous command and may not work. So space your increase/decrease commands out a bit to avoid this problem.

#### Decrease Volume
This action will cause Airfoil to decrease the volume of specified speaker by the specified amount (defaults to 5).

##### Scripting details { #decrease-volume-scripting-details }
**Action id**: decreaseVolume

The deviceId is the Indigo ID of the Speaker device.

| *`volume`* | The delta (0-100) increase the speaker's volume by |
|------------|----------------------------------------------------|


Example 1 (using default delta):

```python
plugin_id = "com.perceptiveautomation.indigoplugin.airfoilpro"

# Get a plugin object given the plugin id:
airfoil_plugin = indigo.server.getPlugin(plugin_id)

if airfoilPlugin.isEnabled():
    try:
        result = airfoilPlugin.executeAction(
            'increaseVolume',
            deviceId=135305663,  # ID of Speaker device
            waitUntilDone=True
        )
    except Exception as e:
        print(f"Exception occurred: {e}")
```

Example 2 (specifying delta):

```python
plugin_id = "com.perceptiveautomation.indigoplugin.airfoilpro"

# Get a plugin object given the plugin id:
airfoil_plugin = indigo.server.getPlugin(plugin_id)

if airfoilPlugin.isEnabled():
    try:
        result = airfoilPlugin.executeAction(
            'decreaseVolume',
            deviceId=135305663,  # ID of Speaker device
            props={'volume': 15},
            waitUntilDone=True
        )
    except Exception as e:
        print(f"Exception occurred: {e}")
```

!!! note
    Because the Airfoil API doesn't directly support increase/decrease, the plugin gets the current volume from the speaker device and calculates the new volume. An unfortunate side effect is that if you send multiple increase/decrease actions in a brief amount of time, the plugin won't yet know that the speaker's volume has changed from the previous command and may not work. So space your increase/decrease commands out a bit to avoid this problem.

### Airfoil Instance Actions
Actions that you can perform on Airfoil Instance devices relate to the current source.

#### Disconnect All Speakers
Tell Airfoil to disconnect all speakers. This is useful if you want to connect just the speakers in an Airfoil Group (disconnect everything first then connect the group).

##### Scripting details { #disconnect-all-speakers-scripting-details }
**Action id**: disconnectAllSpeakers

No properties for scripting required. The deviceId is the Indigo ID of the Airfoil device.

Example:

```python
plugin_id = "com.perceptiveautomation.indigoplugin.airfoilpro"

# Get a plugin object given the plugin id:
airfoil_plugin = indigo.server.getPlugin(plugin_id)

if airfoilPlugin.isEnabled():
    try:
        result = airfoilPlugin.executeAction(
            'disconnectAllSpeakers',
            deviceId=12345678,  # ID of Airfoil device
            waitUntilDone=True
        )
    except Exception as e:
        print(f"Exception occurred: {e}")
```

#### Change Source
This action allows you to change the audio source of the Airfoil instance (as if you changed it by selecting a new source from the popup in the Airfoil app).

##### Scripting details { #change-source-scripting-details }
**Action id**: changeSource

The deviceId is the Indigo ID of the Airfoil device.

| *`sourceGroup`* | One of the following: 'audioDevices', 'recentApplications', 'systemAudio'. You can see what sources are known by selecting the `Plugins->Airfoil Pro->Show Sources` menu item and all source groups and sources will be shown in the event log. You can also call it programmatically (as shown below with the Show Speakers Action/Menu Item) and it will return a dictionary of valid sources. |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| *`source`*      | The unique identifier of the source.                                                                                                                                                                                                                                                                                                                                                             |


Example:

```python
plugin_id = "com.perceptiveautomation.indigoplugin.airfoilpro"

# Get a plugin object given the plugin id:
airfoil_plugin = indigo.server.getPlugin(plugin_id)

if airfoilPlugin.isEnabled():
    try:
        props = {"sourceGroup": "systemAudio",
                 "source": "com.rogueamoeba.source.systemaudio"
                 }
        result = airfoilPlugin.executeAction(
            "changeSource",
            deviceId=1346588091,  # ID of Airfoil device
            props=props,
            waitUntilDone=True
        )
    except Exception as e:
        print(f"Exception occurred: {e}")
```

#### Save Current Source
This action will save the currently selected source for the specified Airfoil device. This is useful if you need to temporarily change the source (for instance, to perform some kind of announcement), then switch it back to the previous source.

##### Scripting details { #save-current-source-scripting-details }
**Action id**: saveCurrentSource

The deviceId is the Indigo ID of the Airfoil device.

Example:

```python
plugin_id = "com.perceptiveautomation.indigoplugin.airfoilpro"

# Get a plugin object given the plugin id:
airfoil_plugin = indigo.server.getPlugin(plugin_id)

if airfoilPlugin.isEnabled():
    try:
        result = airfoilPlugin.executeAction(
            "saveCurrentSource",
            deviceId=1346588091,  # ID of Airfoil device
            waitUntilDone=True
        )
    except Exception as e:
        print(f"Exception occurred: {e}")
```

#### Restore Saved Source
This action will restore the previously saved source for the specified Airfoil device. This is useful if you need to temporarily change the source (for instance, to perform some kind of announcement), then switch it back to the previous source.

##### Scripting details { #restore-saved-source-scripting-details }
**Action id**: restoreSavedSource

The deviceId is the Indigo ID of the Airfoil device.

Example:

```python
plugin_id = "com.perceptiveautomation.indigoplugin.airfoilpro"

# Get a plugin object given the plugin id:
airfoil_plugin = indigo.server.getPlugin(plugin_id)

if airfoilPlugin.isEnabled():
    try:
        result = airfoilPlugin.executeAction(
            "restoreSavedSource",
            deviceId=1346588091,  # ID of Airfoil device
            waitUntilDone=True
        )
    except Exception as e:
        print(f"Exception occurred: {e}")
```

#### Toggle Play/Pause
Tell Airfoil to tell the source to toggle play/pause. This only works with some sources and there *aren't* discrete play and pause commands available in the Airfoil API.

##### Scripting details { #toggle-playpause-scripting-details }
**Action id**: playPause

No properties for scripting required. The deviceId is the Indigo ID of the Airfoil device.

Example:

```python
plugin_id = "com.perceptiveautomation.indigoplugin.airfoilpro"

# Get a plugin object given the plugin id:
airfoil_plugin = indigo.server.getPlugin(plugin_id)

if airfoilPlugin.isEnabled():
    try:
        result = airfoilPlugin.executeAction(
            'playPause',
            deviceId=12345678,  # ID of Airfoil device
            waitUntilDone=True
        )
    except Exception as e:
        print(f"Exception occurred: {e}")
```

#### Next Track
Tell Airfoil to tell the source to go to the next track. This only works with some sources.

##### Scripting details { #next-track-scripting-details }
**Action id**: nextTrack

No properties for scripting required. The deviceId is the Indigo ID of the Airfoil device.

Example:

```python
plugin_id = "com.perceptiveautomation.indigoplugin.airfoilpro"

# Get a plugin object given the plugin id:
airfoil_plugin = indigo.server.getPlugin(plugin_id)

if airfoilPlugin.isEnabled():
    try:
        result = airfoilPlugin.executeAction(
            'nextTrack',
            deviceId=12345678,  # ID of Airfoil device
            waitUntilDone=True
        )
    except Exception as e:
        print(f"Exception occurred: {e}")
```

#### Previous Track
Tell Airfoil to tell the source to go to the next track. This only works with some sources.

##### Scripting details { #previous-track-scripting-details }
**Action id**: prevTrack

No properties for scripting required. The deviceId is the Indigo ID of the Airfoil device.

Example:

```python
plugin_id = "com.perceptiveautomation.indigoplugin.airfoilpro"

# Get a plugin object given the plugin id:
airfoil_plugin = indigo.server.getPlugin(plugin_id)

if airfoilPlugin.isEnabled():
    try:
        result = airfoilPlugin.executeAction(
            'prevTrack',
            deviceId=12345678,  # ID of Airfoil device
            waitUntilDone=True
        )
    except Exception as e:
        print(f"Exception occurred: {e}")
```

### Airfoil Scripting Actions
The following action is available specifically for scripts.

#### = getSources
This script action will return an indigo.Dict object. The keys are the source groups, the values are lists of dicts with the following keys: friendlyName (the user-friendly name), icon (a binhex'd string that is the source's icon), identifier (the ID used in the source property above). You can unbinhex the icon and save it to a PNG file and store it somewhere for use if you like.

**Action id**: getSources

No properties are required. The deviceId is the Indigo ID of the Airfoil device.

```python
plugin_id = "com.perceptiveautomation.indigoplugin.airfoilpro"

# Get a plugin object given the plugin id:
airfoil_plugin = indigo.server.getPlugin(plugin_id)

if airfoilPlugin.isEnabled():
    try:
        result = airfoilPlugin.executeAction(
            'getSources',
            deviceId=12345678  # ID of Airfoil device
        )
    except Exception as e:
        print(f"Exception occurred: {e}")
```

The *result* that's returned from this call will look something like this:

```text
Data : (dict)
     audioDevices : (list)
          Item : (dict)
               friendlyName : Apple USB audio device (string)
               icon : [SNIP]
               identifier : AppleUSBAudioEngine:Apple Inc.:Apple USB audio device:241000:2,1 (string)
          Item : (dict)
               friendlyName : Built-in Microphone (string)
               icon : [SNIP]
               identifier : AppleHDAEngineInput:1B,0,1,0:1 (string)
          Item : (dict)
               friendlyName : USB audio CODEC (string)
               icon : [SNIP]
               identifier : AppleUSBAudioEngine:Burr-Brown from TI:USB audio CODEC:400000:2,1 (string)
     recentApplications : (list)
          Item : (dict)
               friendlyName : iTunes (string)
               icon : [SNIP]
               identifier : /Applications/iTunes.app (string)
          Item : (dict)
               friendlyName : iMovie (string)
               icon : [SNIP]
               identifier : /Applications/iMovie.app (string)
    systemAudio : (list)
    	  Item : (dict)
    	  	   friendlyName : System Audio (string)
    	  	   icon : [SNIP]
    	  	   identifier : com.rogueamoeba.source.systemaudio
```

That's an indigo.Dict() object. Each group is the key, and the value for each group is a list of "source" indigo.Dict()'s. Each source dict has the following keys: *friendlyName* (the user-friendly name), *icon* (a binhex'd string that is the source's icon - snipped from the above example to save space), *identifier* (the ID used in the source property above). You can unbinhex the icon and save it to a PNG file and store it somewhere for use if you like. You can use the group name and identifier combination in the changeSource action described above.
