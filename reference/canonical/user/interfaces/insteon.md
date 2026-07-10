<!-- GENERATED from https://docs.indigodomo.com/2025.2/user/interfaces/insteon/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Managing Your Insteon Network in Indigo

!!! abstract "In this guide"
    How to connect an Insteon interface to Indigo, add and configure Insteon devices, and manage Insteon links so that devices can control each other without manual button-pressing at each fixture. Also covers replacing a failed device or PowerLinc controller while preserving your link database.

Indigo provides a variety of tools for managing your Insteon network - not only can you add/control/delete devices, but you can also manage Insteon Links so that you don't need to walk around your house pressing buttons (see the [Managing Insteon Links](#managing-insteon-links) section for details). You can also [replace devices](#replacing-and-resyncing-devices) and even your [PowerLinc controller](#replacing-your-powerlinc) and Indigo will make sure that all links are modified so your network continues to work with as little manual intervention as possible. The first thing you should do, of course, is [connect and configure your Insteon interface](#connecting-insteon-and-x10-power-line-interfaces).

Insteon is primarily a power line technology, and as such is susceptible to signal noise. Check out the [signal troubleshooting](../../troubleshooting/powerline-signal-troubleshooting.md) page for common causes and solutions to signal issues.

## Connecting Insteon and X10 Power Line Interfaces
Connecting an Insteon (or X10 power line) interface to Indigo requires a couple of steps, described below. Check out our [supported interfaces list](http://www.indigodomo.com/devices/interfaces/) to see if the interface you want to use has been tested with Indigo.

### Install the FTDI VCP Drivers
The **PowerLinc 2412U, [2413U](http://www.indigodomo.com/hardware/powerlinc2413u), and [2448A7H (Insteon RF USB Adaptor)](http://www.indigodomo.com/hardware/powerlinc2448)** interfaces should be plugged directly into one of your Mac's USB ports (preferably not into a USB hub port) and require the FTDI Virtual COM Port (VCP) driver to be installed. **If you are using Mac OS X 10.9 (Mavericks) or better, it has the driver already installed.**

For earlier versions of the OS, you can get the driver installer at [FTDI's website](http://www.indigodomo.com/ftdiurl) - be sure to get the installer that's appropriate for the architecture of your machine (Intel or PowerPC). If you select **PowerLinc 2412U/2412S/2413U/2413S/2448** from the Interface type popup menu in the Preferences dialog (see below), then Indigo will alert you if the driver is not installed on your Mac. If you're using a PowerLinc 2412S/2413S with a separate USB to serial adapter, you can ignore that warning alert. **Note**: there are known issues with the FTDI driver and macOS High Sierra, Mojave, and Catalina on ***some*** Macs - check out our [blog post](http://www.indigodomo.com/blog/2018/01/25/high-sierra-driver-bug-workaround/) for details.

The **PowerLinc 2414U/1132CU/1132U** (all of which have now been discontinued) and **CM15A** (aka CM15Pro) interfaces should also be plugged directly into your computer (preferably not into a USB hub port) - the Indigo installer automatically installed the drivers for these interfaces. Make sure you have restarted after the installation process. If you reinstall your OS, then you will need to rerun the Indigo installer for the driver.

The other supported interfaces (**PowerLinc 2412S/2413S, CM11 / HD11, LynX-PLC**) are serial based, and will require a USB serial port adapter. If you are using one of the serial based interfaces, then make sure that the latest drivers for the USB serial adapter are installed on your system. Look on the adapter manufacturer's website for the latest driver downloads. If you don't already have a serial-to-USB adapter, we highly recommend getting one that uses the same FTDI chipset that the PowerLincs use since it seems to be the most reliable.

<span class="dw-color-red">**Note**</span>: PowerLincs are quite sensitive to USB versions and hubs. It's known that there are often times failures on hubs (as mentioned above), but we also know that there are also failures on USB3 ports. In this last case, you may need to find a USB2 hub and use that for the PowerLinc.

Check the [Interface Hardware](https://www.indigodomo.com/devices/interfaces/) list to see what interfaces we've actually tested.

### Connecting the Interface
Plug the interface directly into an outlet (with the exception of the Insteon RF USB Adapter). Do not plug the interface into your computer's power strip because many power strips contain filters that will severely degrade the Insteon / X10 signal quality being received and transmitted by the interface. Additionally, uninterruptible power supplies (UPSs) can cause signal quality problems. If at all possible plug the interface into a different outlet than used by power strips and UPSs. Signal filters are available to isolate computer power strips and UPSs as well.

If you are using the **CM11 / HD11** or **CM15A** interface, then do not install the battery into the interface. Indigo does not support uploading macros to these interfaces so the battery should not be used.

### Configuring Indigo to use Your Interface

1. Choose `Indigo {{ version }}->Preferences...` menu, then make sure the `Interfaces` tab is selected.
1. Select the `Enabled` checkbox next to the `Insteon / X10 Powerline Interface` item.
1. Double-click the `Insteon/X10 Power Line Interface` line in the table (you can also get to this dialog by selecting the `Interfaces->Insteon/X10 Power Line->Configure…` menu item)
1. Choose your `Interface type` in the popup menu.
    - If you are using the **PowerLinc 2412U/2413U/2448A7H** interface, then the `Serial port:` popup menu will be enabled and the  [FTDI driver](http://www.indigodomo.com/ftdiurl) (see Install the Correct Drivers above) will create a new `Serial port:` popup menu item that looks like `usbserial-XXXXXXXX`. Select that item. **<span class="dw-color-red">NOTE</span>**: you ***must*** have the FTDI driver installed already.
    - If you are using the **PowerLinc 2414U/1132CU/1132U** or the **CM15** interface, then the `Serial port:` popup menu will be disabled because these interfaces do not use a virtual serial port driver.
    - If you are using one of the serial based interfaces (**PowerLinc 2412S, CM11 / HD11, LynX-PLC**), then the `Serial port:` popup menu will be enabled and you should choose which serial port adapter name the interface is connected to in the `Serial port:` popup menu. **<span class="dw-color-red">NOTE`**: if no names are listed in the `Serial port:` popup menu, then you probably do not have the proper driver installed for your USB serial adapter. Download your adapter's driver from the driver manufacturer's website.
1. Optionally select the `Group addresses on transmission` checkbox to combine like-command transmissions together. For example A1-On, A3-On, A4-On, would be transmitted as A1, A3, A4, On.
1. Some interfaces, such as the PowerLinc V2 and LynX-PLC, have additional settings that can be accessed from the Interface Options... button. Generally, these options don't need to be changed unless you're troubleshooting a problem.

![Insteon X10 Configuration Dialog Image](../../../images/insteon_x10_config_dialog.png)

If you click on the `Interface Options...` button, you'll see something like this:

![Insteon Advanced Options Image](../../../images/insteonadvancedoptions.png)

You should only use these options on the recommendation of Indigo Support.

### Enabling and Disabling Communication
Choose the `Interfaces->Insteon/X10 Power Line->Disable` (or `Enable`) menu item to disable/enable the interface.

## Adding and Managing Insteon Devices
Indigo uses Smart Link Syncing to quickly define and link Insteon devices with the PowerLinc. This link syncing process will allow Indigo to control and see messages from the device.

First, make sure that Indigo has enabled communication with the interface. If Indigo is not online with the interface, then choose the `Interfaces->Insteon/X10 Power Line->Enable` menu item. See [connecting the Interface](#connecting-insteon-and-x10-power-line-interfaces) above for more details.

Additionally, make sure you have Insteon range extenders or other dual-band modules correctly installed on opposite power legs. If the range extenders or other dual-band devices are improperly installed or missing, then you may not be able to control some of your Insteon devices. See the instructions included with your Access Point RF pair for installation details.

!!! tip "TIP"
    Access Point RFs do not bridge X10 signals, so if you also have X10 devices you will likely need an additional bridge.

To add a new Insteon device:

1. Select Devices in the [Outline View of the Home window](../../mac-client/home-window.md#home-window).
1. Press the `New...` button at the top of the Home window and select `Insteon` from the `Type` popup.

Here's the Insteon device dialog:

![Insteon Device Detail Image](../../../images/insteon_device_detail.png)

The `Define and Sync...` button will open the `Define Insteon Define` dialog:

![Define Insteon Dialog Image](../../../images/define_insteon_dialog.png)

This is how you initially add an Insteon device to Indigo. The directions on this dialog are quite self-explanatory. When you click the `Start` button you'll see the checkboxes turn green when each step is complete, and the `Close` button will enable when the process is complete. The sync process can take a few minutes to complete. Lamp and appliance devices normally take less than a minute, but KeypadLincs and ControLincs can take a few minutes because of the additional link information needed for all the buttons.

If the sync process fails or does not complete, then make sure that the device is correctly wired or plugged in, both Access Point RFs are installed and on opposite power legs, and that you do not have an uninterruptible power supply (UPS) or surge protector strip plugged into the outlet the PowerLinc is using. If syncing still fails and the device is portable (ApplianceLinc or LampLinc), then try plugging it directly into the pass through outlet on the PowerLinc. See our [signal troubleshooting tips](../../troubleshooting/powerline-signal-troubleshooting.md) for additional help.

After the sync dialog is closed, some devices, such as the KeypadLinc, EZRain, Thermostat Adapter, Motion Sensor, and EZIO8SA, have additional custom settings shown in the main device dialog.

## Replacing and Resyncing Devices
### Resyncing Links
The `Re-Sync Links...` button on the device edit dialog will open the `Synchronize Insteon Device Links` dialog:

![Start Sync Dialog Image](../../../images/start_sync_dialog.png)

Use this dialog to resync a device when its links have been altered outside of Indigo. You may be asked to use this dialog by technical support when troubleshooting device problems.

### Replacing a Device
To replace a device that's malfunctioned, just open the edit dialog for the device and click the `Define and Sync...` button again to open the `Define Insteon Device` dialog. Enter the address of the replacement module (and make sure it has been installed) and click the `Start` button just like you did when you originally added the device. This will maintain all the links that you created to and from the device as well as maintain any Triggers, Schedules, Conditions, Actions, and Control Pages that might use the device.

## Managing Insteon Links
The last button, `Manage Links...` is how Indigo allows you to remotely manage Insteon links without having to walk around pressing set buttons (there is also a menu item on the Insteon/X10 Power Line submenu to access the dialog).

The Insteon protocol has linking built-in as part of its core functionality. The idea is that one device, a controller in Insteon speak, can be linked to another device, a responder, then from that point forward the controller device sends its command directly to the responder device. So, for instance, you can link a KeypadLinc button to a SwitchLinc so that when you press the button on the KPL the SwitchLinc responds. That's normally done by pressing various buttons on each device in specific ways until the link is established.

The manual linking method is useful if you don't have a software-controlled environment. However, since you've decided to have Indigo automate your home, you do have software to help you manage your automation needs. We've worked very hard to allow Indigo to perform the majority of link management tasks remotely so you don't have to walk around pressing buttons.

For some background on Insteon links, we have put together a separate page that discusses [Insteon Scenes](insteon_links.md). We highly recommend that you read through that page as it will give you a better understanding of what links are and how they work.

### Managing Insteon Device Links
The primary place that you'll manage links between devices is in the Manage Insteon Device Links dialog. Select the `Interfaces->Insteon/X10 Power Line->Manage Device Links` menu item and the dialog will pop up:

![Device Links Dialog Image](../../../images/device_links_dialog.png)

The dialog may look slightly different depending on the roles that the device selected in the popup at the top can play. As we mentioned earlier, devices that can control other devices are called "controllers" and devices that can be controlled are called "responders". Many devices are both controllers and responders (the example above is a SwitchLinc, which is both). These links are also called groups and/or scenes, depending on usage, so keep that in mind.

For example, you can use Indigo to remotely program the button on a RemoteLinc to: set a ceiling fan (FanLinc) to Medium, brighten a dimmer to 75% over 2 seconds, turn off an on/off device.

![Device Links Example Image](../../../images/device_links_example.png)

Indigo automatically creates the links to define the scene in most remote modules. This means you do not have to press-and-hold the set button or up paddle on most remote modules. Indigo will do it all remotely for you with a single press of the Sync Now button.

You can also define Indigo initiated scenes to control multiple remote modules in unison. See the defining [Insteon scenes section](#defining-the-scene) for more information on this capability.

#### Responder Modules vs. Controller Modules
Every Insteon module is either a *responder module*, a *controller module* or both:

- *Responder modules* respond to incoming Insteon commands by controlling a load (light or appliance), a thermostat setting, sprinkler valves, low-voltage relays, etc. Examples of responder modules include: LampLinc, ApplianceLinc, and the EZRain sprinkler controller.
- *Controller modules* send outgoing Insteon commands onto the power line or via RF to modules that are responders. Examples of controller modules include: RemoteLinc, ControLinc, and the PowerLinc computer interface.
- Some modules are both *responders* and *controllers*. For example, a KeypadLinc can respond to a RemoteLinc, but it can also control other modules, such as a LampLinc.

#### Defining the Scene between Modules
First, select the module you want to edit. You can choose to edit either the controller module in the scene (ex: RemoteLinc) or the responder module in the scene (ex: LampLinc).

1. Select the `Interfaces->Insteon/X10 Power Line->Manage Device Links` menu item.
1. Select the module's device name to edit in the `Show links used by device` popup control.

If the module you selected is a controller (RemoteLinc, KeypadLinc, SwitchLinc, etc.), then you can add or edit responders:

1. If you want to add a new responder module to the scene, then press the `New Link to Responder` button. If you want to change the settings (brightness, ramp rate duration, etc.) of an existing responder module in the scene, then select that module's link in the table with the `Link to Responder Device` column title.
1. Choose the button or group number that identifies the scene you are defining in the controller (ex: RemoteLinc button #1) from the `broadcast of button/group number` popup control.
1. Choose the responder module's device name from the responder popup control (ex: LampLinc).
1. When responding to a scene command, most modules will control the main load (light or appliance) connected to that module. For these modules (SwitchLinc, ToggleLinc, LampLinc, etc.) you can specify the exact brightness you want for that module as well as a duration for how quickly the module should go to that brightness: Some modules will have different options. For example, when a KeypadLinc is responding to a scene command, it can turn one of the secondary button LEDs on instead of controlling the main load, or the thermostat module can respond to a scene command by changing both the thermostat operation mode and the current `cool` and `heat` setpoint temperatures.
1. Optionally turn on the `Persistent` checkbox to force this link to automatically be restored whenever either the responder module or controller module is synced. If the modules are ever reset, replaced, or have this link modified, then Indigo will automatically rewrite the original link on the next sync operation.
1. Repeat steps 1 through 5 for every new responder module that you want to add to the selected controller.

If the module you selected is a responder (LampLinc, Thermostat Adapter, KeypadLinc, SwitchLinc, etc.), then you can add or edit controllers:

1. If you want to add a controller of the selected responder module, then press the `New Link to Controller` button. If you want to change the settings (brightness, ramp rate duration, etc.) used by the selected module in a controller's scene, then select the controller module's link in the table with the `Link to Controller Device` column title.
1. Choose the controller module's device name from the On controller popup control (ex: RemoteLinc).
1. Choose the button or group number that identifies the controller scene for which you want the responder to listen (ex: RemoteLinc button #3) from the `broadcast of button/group number` popup control.
1. When responding to a scene command, most modules will control the main load (light or appliance) connected to that module. For these modules (SwitchLinc, ToggleLinc, LampLinc, etc.) you can specify the exact brightness you want for that module as well as a duration for how quickly the module should go to that brightness using the % text box and the rate popup. Some modules will have different options. For example, when a KeypadLinc is responding to a scene command, it can turn one of the secondary button LEDs on instead of controlling the main load, or the thermostat module can respond to a scene command by changing both the thermostat operation mode via the mode popup and the current `cool` and `heat` setpoint temperatures via those text boxes.
1. Optionally turn on the `Persistent` checkbox to force this link to automatically be restored whenever either the responder module or controller module is synced. If the modules are ever reset, replaced, or have this link modified, then Indigo will automatically rewrite the original link on the next sync operation.
1. Repeat steps 1 through 5 for every new controller module you want to add for the selected responder.

Lastly, to have Indigo write all of your link changes to the remote modules, press the `Sync Now` button to have Indigo immediately write all changed links to the remote modules. Or, press the `Close (Sync Later)` button to close the link editor window and write the changes to the modules at a later time. When you are ready to write the changes to the remote modules, select `Start Sync Device Links...` from the `Interfaces->Insteon/X10 Power Line` menu, and then press the `Sync Changes Only` button.

#### Manually Creating Links between Modules
In addition to using Indigo's remote link and scene management, you can also manually create the links physically at the devices themselves. Follow the instructions that came with the hardware for the exact steps, which usually involves creating the links by press-and-holding the set button or up paddles for 10 seconds on each module.

If you manually create or delete a link, then you must tell Indigo to [re-sync those modules](#insteon-link-syncing). This enables Indigo to read in the link changes, and is required for Indigo to accurately show the state of the modules as they change.

### Managing Insteon PowerLinc Scenes
Insteon scenes (also called groups) can be used to control multiple Insteon modules, such as light switch modules, lamp or appliance plug-in modules, and thermostat modules, all in unison. For example, you could create a *home theater lighting* scene that turns off all lighting in your media room, except for a few sconce side lights which are set to 20% brightness. You can create lighting scenes for any activity you desire: *dining*, *entertaining*, *sleeping*, *reading in bed*, *emergency*, etc.

![Manage Powerlinc Scenes Image](../../../images/manage_powerlinc_scenes.png)

Indigo can remotely create scenes in the computer interface (PowerLinc) that control multiple remote modules. Indigo automatically creates the links to define the scene in both the PowerLinc and most remote modules. This means you do not have to press-and-hold the button on either the PowerLinc or most remote modules. Indigo will do it all remotely for you with a single press of the Sync Now button.

Once Indigo writes the links defining the scene to the PowerLinc and remote modules, you can execute the scene from any [Trigger](../../concepts/triggers.md#triggers), [Schedule](../../concepts/schedules.md#schedules), or [Action Group](../../concepts/actions.md#action-groups) using the `Execute Insteon Scene` [action](../../concepts/actions.md#execute-insteon-scene).

Indigo can also remotely create and edit scenes between remote modules (ex: from a KeypadLinc to a LampLinc). See [Managing Insteon Device Links](#managing-insteon-device-links) for more information on this capability.

#### Defining the Scene
First, specify which PowerLinc Group/Scene number you want to use:

1. Choose `Manage PowerLinc Links...` from the `Interfaces->Insteon/X10 Power Line` menu.
1. Select a `PowerLinc Group/Scene` number to use for the scene. Use 1 if this is your first scene.
1. Optionally enter a `PowerLinc Group/Scene` name in the edit field (ex: "reading in bed").

Next, create a new link for every responder module in the scene:

1. If you want to add a new responder module to the scene, then press the `New Link to Responder` button. If you want to change the settings (brightness, ramp rate duration, etc.) of an existing responder module in the scene, then select that module's link in the table in the top-half of the window.
1. Choose the responder module's device name from the `responder` popup control.
1. When responding to a scene command most modules will control the main load (light or appliance) connected to that module. For these modules (SwitchLinc, ToggleLinc, LampLinc, etc.) you can specify the exact brightness you want for that module as well as a duration for how quickly the module should go to that brightness by using the % text box and the duration popup. Some modules will have different options. For example, when a KeypadLinc is responding to a scene command it can turn one of the secondary button LEDs on instead of controlling the main load, or the thermostat module can respond to a scene command by changing both the thermostat operation mode via the mode popup and the current `cool` and `heat` setpoint temperatures using the text boxes.
1. Optionally turn on the `Persistent` checkbox to force this link to automatically be restored whenever the responder module is synced. If the responder module is ever reset, replaced, or has this link modified, then Indigo will automatically rewrite the original link into the device when it is next synced.
1. Repeat steps 1 through 4 for every new module you want to add to the scene.

Lastly, have Indigo write all of your link changes to both the PowerLinc and the remote modules by pressing the `Sync Now` button to have Indigo immediately write all changed links to the PowerLinc and remote modules. Or, press the `Close (Sync Later)` button to close the link editor window and write the changes to the modules at a later time. When you are ready to write the changes to the PowerLinc and remote modules select `Start Sync Device Links...` from the `Interfaces->Insteon/X10 Power Line` menu, and then press the `Sync Changes Only` button.

You can test the scene after the links are written by using the Send On and Send Off buttons.

#### Executing the Scene
The Indigo scene can now be executed from any Trigger, Schedule, or Action Group:

1. Follow the instructions to create a [Trigger](../../concepts/triggers.md#triggers), [Schedule](../../concepts/schedules.md#schedules), or [Action Group](../../concepts/actions.md#action-groups).
1. Select the `Actions` tab inside the edit window.
1. Select `Insteon Actions->[Execute Insteon Scene](../../concepts/actions.md#execute-insteon-scene)` from the action `Type` popup item.
1. Use the `Send` popup item to select which scene command to send:
    - `Group On` will command all the responder modules to their scene-specific brightness using their scene-specific ramp rate duration, if any.
    - `Group On to 100% (instant / ignore rate)` will set the brightness of dimmable modules to 100% immediately, ignoring any ramp rate duration.
    - `Group Off` will turn off all the responder modules using their scene-specific ramp rate duration, if any.
    - `Group Off (instant / ignore rate)` will turn off all the modules immediately, ignoring any ramp rate duration.
1. Select the scene number defined previously (see above) from the `Scene` popup item.

<span class="dw-color-red">Note</span>: you can press the `Modify this Scene button...` to add a new responder module to the currently selected scene, or you can double-click a device in the scene list to edit its settings (brightness, ramp rate duration, etc.).

### Insteon Link Syncing
Indigo's smart Insteon Link Syncing makes it easy to set up and keep all of your devices working with your PowerLinc. This link syncing process allows Indigo to control devices, and to update its internal device state (on / off / brightness) as the device is controlled locally (at the switch) or remotely by other devices. Indigo shows the state of all Insteon devices as they change, even if the change is because of a command from another device. For example, a LampLinc that is turned ON from a ControLinc will immediately show as ON within Indigo. Indigo automatically does link syncing when you first create the device.

If, after the device is initially created, a remote device has any additional controller links added (ex: LampLinc is controlled by a KeypadLinc), then that device (LampLinc in this case) should have its links re-synced. This option is available from the Device dialog and will ensure Indigo has an accurate representation of the device's internal links, allowing it to correctly show state (on / off / brightness) changes as they occur.

#### Re-Syncing a Single Insteon Device
 - Make sure the device is properly wired or plugged in.
 - Select Device List from the View menu.
 - Double-click the device you need to re-sync.
 - Press the Re-Sync Links... button.
 - Press the Start Sync button.
 - Wait for the Smart Link Syncing steps to complete and press the Close button.
 - The sync process can take a few minutes to complete. Lamp and appliance devices normally take less than a minute, but KeypadLincs and ControLincs can take a few minutes because of the additional link information needed for all the buttons.

Battery powered devices will need to be awake for a sync to complete. If you see an error that says the device is asleep, you will need to have that device handy and hit the sync button. Sometimes just operating the device will be enough to wake it up, but that's device specific. For a door sensor, for instance, you may be able to wake it up enough for a sync just by tripping the sensor.

#### Re-Syncing All Insteon Devices
In addition to syncing individual devices, you can also batch sync all of your Insteon devices. Depending on the number of Insteon devices you have, this process can take a significant amount of time to complete. Because control of your devices will be limited during the synchronization process, it is recommended that you start the synchronization process at night or before you leave the house.

 - Make sure all devices are properly wired or plugged in.
 - Select Start Sync Device Links... from the Interface menu.
 - Press the Sync All Devices button.
 - Watch the Event Log window to see when the synchronization process is complete.
 - The batch synchronization process can be canceled at any time.
 - Select Stop Sync Device Links from the Interface menu.
 - Watch the Event Log window to see when the synchronization process is canceled.

## Resetting your PowerLinc
Sometimes, customer support will ask you to reset your PowerLinc. Here's the process:

1. In Indigo 5 or above, select the `Interfaces->Insteon/X10 Power Line->Disable` menu item
1. Unplug your PowerLinc and wait about 15 seconds
1. Press and hold the black set button on the side
1. While holding the button, plug it back in and continue to hold the button for about 15 seconds
1. Release the button
1. In Indigo, select the `Interfaces->Insteon/X10 Power Line->Enable` menu item
1. Select the `Interfaces->Insteon/X10 Power Line->Configure...` menu item
1. Click the `Interface Options...` button
1. Click the `Sync Links` button

The last step will take a while, so watch the Event Log window for progress.

## Replacing Your PowerLinc
If your PowerLinc is ever replaced, then you must re-sync all of your devices. This will ensure that all devices have their internal links updated to reflect the new PowerLinc's Insteon address. If you are replacing a 2414U with a newer PowerLinc, you may also need to [install the drivers](#install-the-ftdi-vcp-drivers) for your new PowerLinc.

Once you have the driver installed, just connect the PowerLinc to your Mac. If you're switching from a 2414 to one of the current ones, you'll need to select it in the [config dialog for Insteon](#configuring-indigo-to-use-your-interface). Otherwise, you'll need to select the new Serial Port in that same dialog. Once you click "Save" on that dialog, Indigo will prompt you to resync all links - do that. Once it's done, all links in all devices should be correct. Be sure to have any battery-powered devices close at hand - you'll need to press and hold the set button to wake them up.

<span class="dw-color-red">Note</span>: that any links that you create, either using the UIs described above, or by manual linking must be marked as Persistent  in the link dialogs in order for them to be recreated correctly. For links that you create manually between devices, when you have the manual links created successfully, you must come back to Indigo and sync the device(s) links. The manual links will show up in the dialogs - you must then mark them as `Persistent in order for them to be retained when doing a resync/replacement.

## Other Insteon Features in Indigo
The `Interfaces->Insteon/X10 Power Line` submenu contains a collection of miscellaneous Insteon commands that will help you manage specific aspects of devices as well as do so low-level Insteon commands not directly supported in the UI:

![Insteon Menu Image](../../../images/insteon_menu.png)

Note that these are also actions available in the [Insteon Brand Specific](../../concepts/actions.md#insteon) submenu.

### Execute Raw Insteon Command
This action will allow you to send a raw Insteon command to any Insteon device. You can send standard messages (2 bytes) or extended messages (16 bytes). You can also have the results of the command inserted into a variable for later processing.

#### Set Motion Sensor LED Brightness
This action will set the brightness of the LED that flashes inside the motion sensor when motion is detected. While the brightness value is between 0 and 255, 0 does not mean the LED is completely off - it's just very dim. Note: only revision 2 Motion Sensors with jumper 5 set can be configured.

#### Set Motion Sensor Timeout
This action will set the timeout value between the time the motion sensor stops detecting motion and when it sends the OFF command. The timeout values work like this: 0 is equal to 30 seconds and 255 is equal to 2 hours. Values in between are proportional to those values.

**Note**: only revision 2 Motion Sensors with jumper 5 set can be configured.

**Note**: a value of 0 will be interpreted as 3 for Motion Sensor II models.

#### Set Motion Sensor Day/Night Sensitivity
This action will set the sensitivity for when the motion sensor detects changes from dawn to dusk and vice versa. The sensitivity values work like this: 0 will make the sensor register day all the time and 255 is equal to night all the time. Values in between are proportional to those values. Note: only revision 2 Motion Sensors with jumper 5 set can be configured.

#### Set LED Brightness
This action will set the brightness of the LEDs on certain devices. Newer KeypadLincs are supported as well as some SwitchLinc models. Unfortunately there isn't really a way to tell you which devices are supported so you'll just have to try it and see if it works.

You can script this action from Python:

```python
insteonId = "com.perceptiveautomation.indigoplugin.InsteonCommands"
insteonPlugin = indigo.server.getPlugin(insteonId)
if insteonPlugin.isEnabled():
    actionProps = dict()
    actionProps["brightness"] = 1  # a value from 1-100
    actionProps["device"] = 123456  # the ID of the KeypadLinc or SwitchLinc
    actionProps["brightenMethod"] = "kpl"  # the device is a KeypadLinc - use "swl" if it's a SwitchLinc
    insteonPlugin.executeAction("setLedBrightness", props=actionProps)
```

#### Set KeypadLinc Auto-Off Button Group
This action will allow you to specify what buttons will go off automatically when you press any other button. Useful in conjunction with Toggle Mode below for creating "radio groups". See the [Fanlinc And Keypadlinc](fanlinc_and_keypadlinc.md) article for usage examples.

#### Set KeypadLinc Button Toggle Mode
This action will allow you to specify whether a button toggles (alternates between ON and OFF when pressed) or whether it sends a single command anytime it's pressed (can send either ON or OFF). Useful in conjunction with Auto-Off groups above for creating "radio groups". See the [Fanlinc And Keypadlinc](fanlinc_and_keypadlinc.md) article for usage examples.

#### Turn On/Off KeypadLinc Buttons
This action allows you to turn on/off groups of buttons. Why not just have multiple actions using the built-in Turn ON/Turn OFF LED actions? Because each of those requires a lot of Insteon traffic - and if you need to set several buttons at once this action will do it in one (or two if you want to maintain some buttons) action(s). It's more efficient and easier to configure (one action versus potentially seven actions). Select the action you want to take for each button: `Turn On`, `Turn Off`, `Leave Alone`. The latter option will require that we query the KPL to find the states first so if you select that for any of the buttons the action may execute a bit slower than it would otherwise.

Note: using this action, which is sending raw Insteon commands through the IndigoServer, will cause the KeypadLinc's button states in Indigo to become out of sync. This is because the server doesn't know that you're changing the button states given that it's just a raw command message that it's being asked to send to the PowerLinc. If you need to keep the states in sync then add another action to do a status request to the KeypadLinc (after a short delay to avoid collisions).

#### Configure SynchroLinc
This action will allow you to configure the Trigger Watts, Threshold Watts, and Delay Seconds in a SynchroLinc. Here are the details of those settings:

- Trigger Watts (0 to 1800 watts in 0.5 watt steps): the wattage needed before the SynchroLinc broadcasts.
- Threshold Watts (aka hysteresis, 0 to 127.5 watts in 0.5 watt steps): tolerance before on/off toggle is sent.
- Delay Seconds (0.15 to 38.25 seconds): prevents message flooding if thresholdWatts is too low.

#### Set I/O Linc Momentary Mode
This action will allow you to set the momentary mode of an I/O Linc to A, B, C, or None (the built-in UI only sets A or None).

#### Set Siren Alarm Sound
This action will allow you to set the sound that the siren makes when it's turned on. The choices are chime which is a softer sound, and siren which is a very loud sound.

#### Set Siren LED Mode
This action will allow you to set how the LED on the siren behaves. The LED can always be on or off, or it can flicker based on Insteon traffic.

#### Set OutletLinc Load Sense
This action will allow you to turn the load sense feature of the dual outlet OutletLinc on and off (on either the top or bottom outlet).

### Troubleshooting
If you can't get a device to sync, follow these steps:

1. Hold down the shift & option keys while selecting the **Interfaces->Insteon/X10 Power Line->Configure...** menu item
1. In the resulting dialog, check the box next to **LILO debug logging** (leave the dialog open)
1. Switch back to the home window and try the define and sync with the AL again - you'll see a lot of debugging information show up in the Event Log window.
1. Starting with the first part of the define and sync, copy/paste all the event log lines into an email to support@indigodomo.com.
1. Switch back to the Insteon Debugging window and uncheck the **LILO debug logging** checkbox (and close the dialog)
