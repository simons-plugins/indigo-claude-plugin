<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/reference/plugin-py/message-flow/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Event and Message Flow
Under some circumstances, the Indigo Server will send callbacks to your plugin based on events that take place. For example, if your plugin devices expose features like Turn On, Turn Off or Status Request, Indigo will send a callback to your plugin so you can take actions on these events. There are many different callbacks that can occur which are documented extensively in the [SDK](https://github.com/IndigoDomotics/IndigoSDK/releases/tag/v2025.1).

Here is a simple example showing how to handle these callbacks (consult the [SDK](https://github.com/IndigoDomotics/IndigoSDK/releases) for a detailed example that relates to your device's class).

<span class="ca">**Command Syntax Examples**</span> 

```python
def actionControlDevice(self, action, dev):
    ###### TURN ON ######
    if action.deviceAction == indigo.kDeviceAction.TurnOn:
        # Command hardware module (dev) to turn ON here:
        send_success = True        # Set to False if it failed.

        if send_success:
            # If success then log that the command was successfully sent.
            self.logger.info(f"sent \"{dev.name}\" on")

            # And then tell the Indigo Server to update the state.
            dev.updateStateOnServer("onOffState", True)
        else:
            # Else log failure but do NOT update state on Indigo Server.
            self.logger.error(f"send \"{dev.name}\" on failed")

    ###### TURN OFF ######
    elif action.deviceAction == indigo.kDeviceAction.TurnOff:
        # Command hardware module (dev) to turn OFF here:
        send_success = True        # Set to False if it failed.

        if send_success:
            # If success then log that the command was successfully sent.
            self.logger.info(f"sent \"{dev.name}\" off")

            # And then tell the Indigo Server to update the state:
            dev.updateStateOnServer("onOffState", False)
        else:
            # Else log failure but do NOT update state on Indigo Server.
            self.logger.error(f"send \"{dev.name}\" off failed")

    ###### STATUS REQUEST ######
    elif action.deviceAction == indigo.kUniversalAction.RequestStatus:
        # Report on the status of the device
        self.update_device_status()  # Take your action(s) to update the device's status.
        self.logger.info(f"\"{dev.name}\" updated.")
```

Note that you may see camel case examples of these callbacks like `actionControlDevice()` or snake case `action_control_device()`. As a convenience, Indigo supports both naming styles; however, camel case may be deprecated in the future.

[//]: # (FIXME Add discussion about plugin event and message flow for several types of plugins: with devices, events, actions - and plugins that use runConcurrentThread and plugins that start up threads, etc., so that it'll be easier to envision how to approach thinking about a plugin.)
