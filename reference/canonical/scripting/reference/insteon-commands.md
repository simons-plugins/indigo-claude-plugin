<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/reference/insteon-commands/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Insteon Commands (indigo.insteon.*)

Commands that are specific to Insteon devices.

## Send Scene Decrease { .ref-head-no-code }

This command will send an Insteon Scene Decrease (dim on dimmable loads) command to the specified PowerLinc scene. The value will decrease by 3% for each call.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.insteon.sendSceneDecrease(11)`<br>
`indigo.insteon.sendSceneDecrease(11, repeatCount=5)`<br>
`indigo.insteon.sendSceneDecrease(11, suppressLogging=True)`<br>
`indigo.insteon.sendSceneDecrease(11, updateStatesOnly=True)`<br>
`indigo.insteon.sendSceneDecrease("working in office scene")`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                     | Required | Type              | Description                                                                                                                                                          |
|-----------------------------------------------|----------|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>      | Yes      | integer or string | either the scene number or the scene name - we encourage numbers since they won't change and the scene names can.                                                    |
| <span class="nw cb">`repeatCount`</span>      | No       | integer           | a value from 1-32 for the number of times to repeat the decrease (default is 1)                                                                                      |
| <span class="nw cb">`suppressLogging`</span>  | No       | boolean           | True if entries in the event log should be suppressed (default is False)                                                                                             |
| <span class="nw cb">`updateStatesOnly`</span> | No       | boolean           | use if you only want Indigo's internal device state representation to be updated - no actual Insteon command will be sent on RF or the power line (default is False) |

## Send Scene Increase { .ref-head-no-code }

This command will send an Insteon Scene Increase (brighten on dimmable loads) command to the specified PowerLinc scene. The value will increase by 3% for each call.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.insteon.sendSceneIncrease(11)`<br>
`indigo.insteon.sendSceneIncrease(11, repeatCount=5)`<br>
`indigo.insteon.sendSceneIncrease(11, suppressLogging=True)`<br>
`indigo.insteon.sendSceneDecrease(11, updateStatesOnly=True)`<br>
`indigo.insteon.sendSceneIncrease("working in office scene")`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                     | Required | Type              | Description                                                                                                                                                          |
|-----------------------------------------------|----------|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>      | Yes      | integer or string | either the scene number or the scene name - we encourage numbers since they won't change and the scene names can.                                                    |
| <span class="nw cb">`repeatCount`</span>      | No       | integer           | a value from 1-32 for the number of times to repeat the increase (default is 1)                                                                                      |
| <span class="nw cb">`suppressLogging`</span>  | No       | boolean           | True if entries in the event log should be suppressed (default is False)                                                                                             |
| <span class="nw cb">`updateStatesOnly`</span> | No       | boolean           | use if you only want Indigo's internal device state representation to be updated - no actual Insteon command will be sent on RF or the power line (default is False) |

## Send Scene ON { .ref-head-no-code }

This command will send an Insteon Scene ON command using the specified PowerLinc scene.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.insteon.sendSceneOn(11)`<br>
`indigo.insteon.sendSceneOn(11)`<br>
`indigo.insteon.sendSceneOn(11, sendCleanUps=False)`<br>
`indigo.insteon.sendSceneOn(11, suppressLogging=True)`<br>
`indigo.insteon.sendSceneOn(11, updateStatesOnly=True)`<br>
`indigo.insteon.sendSceneOn("working in office scene")`<br>
`indigo.insteon.sendSceneDecrease(11, updateStatesOnly=True)`<br>
`indigo.insteon.sendSceneOn("working in office scene", sendCleanUps=False)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                     | Required | Type              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|-----------------------------------------------|----------|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>      | Yes      | integer or string | either the scene number or the scene name - we encourage numbers since they won't change and the scene names can.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| <span class="nw cb">`sendCleanUps`</span>     | No       | boolean           | True if cleanup messages should be sent to each device in the scene after the scene command - this will have the PowerLinc send each device a message to make sure it received the command. You might want to stop cleanup messages from being sent because it involves adding a lot of Insteon traffic and might affect performance (particularly if a group has a lot of responders). But, of course, disabling it may reduce reliability of some modules receiving the scene command so it's usually best to ignore this setting. (default is True) |
| <span class="nw cb">`suppressLogging`</span>  | No       | boolean           | True if entries in the event log should be suppressed (default is False)                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| <span class="nw cb">`updateStatesOnly`</span> | No       | boolean           | use if you only want Indigo's internal device state representation to be updated - no actual Insteon command will be sent on RF or the power line (default is False)                                                                                                                                                                                                                                                                                                                                                                                   |

## Send Scene OFF { .ref-head-no-code }

This command will send an Insteon Scene OFF command using the specified PowerLinc scene.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.insteon.sendSceneOff(11)`<br>
`indigo.insteon.sendSceneOff(11, sendCleanUps=False)`<br>
`indigo.insteon.sendSceneOff(11, suppressLogging=True)`<br>
`indigo.insteon.sendSceneOff(11, updateStatesOnly=True)`<br>
`indigo.insteon.sendSceneOff("working in office scene")`<br>
`indigo.insteon.sendSceneOff("working in office scene", sendCleanUps=False)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                     | Required | Type              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|-----------------------------------------------|----------|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>      | Yes      | integer or string | either the scene number or the scene name - we encourage numbers since they won't change and the scene names can.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| <span class="nw cb">`sendCleanUps`</span>     | No       | boolean           | True if cleanup messages should be sent to each device in the scene after the scene command - this will have the PowerLinc send each device a message to make sure it received the command. You might want to stop cleanup messages from being sent because it involves adding a lot of Insteon traffic and might affect performance (particularly if a group has a lot of responders). But, of course, disabling it may reduce reliability of some modules receiving the scene command so it's usually best to ignore this setting. (default is True) |
| <span class="nw cb">`suppressLogging`</span>  | No       | boolean           | True if entries in the event log should be suppressed (default is False)                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| <span class="nw cb">`updateStatesOnly`</span> | No       | boolean           | use if you only want Indigo's internal device state representation to be updated - no actual Insteon command will be sent on RF or the power line (default is False)                                                                                                                                                                                                                                                                                                                                                                                   |

## Send Scene Fast ON { .ref-head-no-code }

This command will send an Insteon Scene Fast ON command using the specified PowerLinc scene.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.insteon.sendSceneFastOn(11)`<br>
`indigo.insteon.sendSceneFastOn(11, sendCleanUps=False)`<br>
`indigo.insteon.sendSceneFastOn(11, suppressLogging=True)`<br>
`indigo.insteon.sendSceneFastOn(11, updateStatesOnly=True)`<br>
`indigo.insteon.sendSceneFastOn("working in office scene")`<br>
`indigo.insteon.sendSceneFastOn("working in office scene", sendCleanUps=False)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                     | Required | Type              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|-----------------------------------------------|----------|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>      | Yes      | integer or string | either the scene number or the scene name - we encourage numbers since they won't change and the scene names can.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| <span class="nw cb">`sendCleanUps`</span>     | No       | boolean           | True if cleanup messages should be sent to each device in the scene after the scene command - this will have the PowerLinc send each device a message to make sure it received the command. You might want to stop cleanup messages from being sent because it involves adding a lot of Insteon traffic and might affect performance (particularly if a group has a lot of responders). But, of course, disabling it may reduce reliability of some modules receiving the scene command so it's usually best to ignore this setting. (default is True) |
| <span class="nw cb">`suppressLogging`</span>  | No       | boolean           | True if entries in the event log should be suppressed (default is False)                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| <span class="nw cb">`updateStatesOnly`</span> | No       | boolean           | use if you only want Indigo's internal device state representation to be updated - no actual Insteon command will be sent on RF or the power line (default is False)                                                                                                                                                                                                                                                                                                                                                                                   |

## Send Scene Fast OFF { .ref-head-no-code }

This command will send an Insteon Scene Fast OFF command using the specified PowerLinc scene.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.insteon.sendSceneFastOff(11)`<br>
`indigo.insteon.sendSceneFastOff(11, sendCleanUps=False)`<br>
`indigo.insteon.sendSceneFastOff(11, suppressLogging=True)`<br>
`indigo.insteon.sendSceneFastOff(11, updateStatesOnly=True)`<br>
`indigo.insteon.sendSceneFastOff("working in office scene")`<br>
`indigo.insteon.sendSceneFastOff("working in office scene", sendCleanUps=False)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                     | Required | Type              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|-----------------------------------------------|----------|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>      | Yes      | integer or string | either the scene number or the scene name - we encourage numbers since they won't change and the scene names can.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| <span class="nw cb">`sendCleanUps`</span>     | No       | boolean           | True if cleanup messages should be sent to each device in the scene after the scene command - this will have the PowerLinc send each device a message to make sure it received the command. You might want to stop cleanup messages from being sent because it involves adding a lot of Insteon traffic and might affect performance (particularly if a group has a lot of responders). But, of course, disabling it may reduce reliability of some modules receiving the scene command so it's usually best to ignore this setting. (default is True) |
| <span class="nw cb">`suppressLogging`</span>  | No       | boolean           | True if entries in the event log should be suppressed (default is False)                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| <span class="nw cb">`updateStatesOnly`</span> | No       | boolean           | use if you only want Indigo's internal device state representation to be updated - no actual Insteon command will be sent on RF or the power line (default is False)                                                                                                                                                                                                                                                                                                                                                                                   |

## Send Scene Start Change { .ref-head-no-code }

This command will tell the specified PowerLinc scene to begin increasing/decreasing in value. It will continue to ramp each device in the scene until either the corresponding [Send Scene Stop Change](#send-scene-stop-change) command is called or until the devices are at 100% for increase ramping or 0% for decrease ramping.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.insteon.sendSceneIncrease(11, increase=True)`<br>
`indigo.insteon.sendSceneIncrease(11, suppressLogging=True)`<br>
`indigo.insteon.sendSceneIncrease("working in office scene")`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                    | Required | Type              | Description                                                                                                       |
|----------------------------------------------|----------|-------------------|-------------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>     | Yes      | integer or string | either the scene number or the scene name - we encourage numbers since they won't change and the scene names can. |
| <span class="nw cb">`increase`</span>        | Yes      | boolean           | True if you want to ramp up, False if you want to ramp down                                                       |
| <span class="nw cb">`suppressLogging`</span> | No       | boolean           | True if entries in the event log should be suppressed (default is False)                                          |

## Send Scene Stop Change { .ref-head-no-code }

This command will tell the specified PowerLinc scene to stop any ramping activity started by a [Send Scene Start Change](#send-scene-start-change) command.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.insteon.sendSceneIncrease(11)`<br>
`indigo.insteon.sendSceneIncrease(11, suppressLogging=True)`<br>
`indigo.insteon.sendSceneIncrease("working in office scene")`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                    | Required | Type              | Description                                                                                                       |
|----------------------------------------------|----------|-------------------|-------------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>     | Yes      | integer or string | either the scene number or the scene name - we encourage numbers since they won't change and the scene names can. |
| <span class="nw cb">`suppressLogging`</span> | No       | boolean           | True if entries in the event log should be suppressed (default is False)                                          |

## Send Status Request { .ref-head-no-code }

This command will send an Insteon Status Request command to the specified address.

<span class="ca">**Command Syntax Examples**</span>

```python
reply = indigo.insteon.sendStatusRequest("0A.B9.DC")
indigo.server.log("reply success: %d, ack value: %02X" % (reply.cmdSuccess, reply.ackValue))
```

<span class="ca">**Parameters**</span>

| Parameter                                    | Required | Type    | Description                                                              |
|----------------------------------------------|----------|---------|--------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>     | Yes      | string  | the target Insteon address as a hexadecimal string.                      |
| <span class="nw cb">`waitUntilAck`</span>    | No       | boolean | true if the caller wants to wait for the result. (default is True)       |
| <span class="nw cb">`suppressLogging`</span> | No       | boolean | True if entries in the event log should be suppressed (default is False) |

## Send Raw { .ref-head-no-code }

This command will send a raw Insteon standard command.

<span class="ca">**Command Syntax Examples**</span>

```python
reply = indigo.insteon.sendRaw("0A.B9.DC", [0x10, 0x00])
indigo.server.log("reply success: %d, ack value: %02X" % (reply.cmdSuccess, reply.ackValue))
```

<span class="ca">**Parameters**</span>

| Parameter                                         | Required | Type    | Description                                                                                |
|---------------------------------------------------|----------|---------|--------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>          | Yes      | string  | the target Insteon address as a hexadecimal string.                                        |
| <span class="nw cb">`cmdBytes`</span>             | Yes      | list    | a list of 2 integer bytes that represent the command to be sent.                           |
| <span class="nw cb">`waitUntilAck`</span>         | No       | boolean | True if the caller wants to wait for the result. (default is True)                         |
| <span class="nw cb">`waitForStandardReply`</span> | No       | boolean | True if the caller wants to wait for a follow-up direct standard reply. (default is False) |
| <span class="nw cb">`waitForExtendedReply`</span> | No       | boolean | True if the caller wants to wait for a follow-up direct extended reply. (default is False) |
| <span class="nw cb">`suppressLogging`</span>      | No       | boolean | True if entries in the event log should be suppressed (default is False)                   |

## Send Raw Extended { .ref-head-no-code }

This command will send a raw Insteon extended command (command payload can be between 2 and 16 bytes).

<span class="ca">**Command Syntax Examples**</span>

```python
# Get KeypadLinc info (LED states, brightness, etc.)
reply = indigo.insteon.sendRawExtended("11.7B.2E", [0x2E, 0x00], waitForExtendedReply=True)
if reply.cmdSuccess:
	indigo.server.log("     backlight brightness: %d" % (reply.replyBytes[10],))
	indigo.server.log("button toggle mode bitmap: 0x%02X" % (reply.replyBytes[11],))
	indigo.server.log("     button states bitmap: 0x%02X" % (reply.replyBytes[12],))
```

```python
# Change the Keypad LED brightness from dim to bright
setKeypadLedBrightness = [
	0x2E, 0x00,
	0x00,			# unused
	0x07,			# change LED backlight brightness
	0x11,			# brightness between 0x11 and 0x7F
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
]
for brightness in [0x07, 0x44, 0x66, 0x7F]:
	setKeypadLedBrightness[4] = brightness
	indigo.insteon.sendRawExtended("11.7B.2E", setKeypadLedBrightness)
```

<span class="ca">**Parameters**</span>

| Parameter                                         | Required | Type    | Description                                                                                        |
|---------------------------------------------------|----------|---------|----------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>          | Yes      | string  | the target Insteon address as a hexadecimal string.                                                |
| <span class="nw cb">`cmdBytes`</span>             | Yes      | list    | a list of 2 to 16 integer bytes that represent the command to be sent.                             |
| <span class="nw cb">`calcCrc`</span>              | No       | boolean | automatically calculate 8-bit CRC byte for message (used by i2CS firmware). (default is True)      |
| <span class="nw cb">`calc16bitCrc`</span>         | No       | boolean | automatically calculate 16-bit CRC byte for message (used by specific modules). (default is False) |
| <span class="nw cb">`waitUntilAck`</span>         | No       | boolean | True if the caller wants to wait for the result. (default is True)                                 |
| <span class="nw cb">`waitForStandardReply`</span> | No       | boolean | True if the caller wants to wait for a follow-up direct standard reply. (default is False)         |
| <span class="nw cb">`waitForExtendedReply`</span> | No       | boolean | True if the caller wants to wait for a follow-up direct extended reply. (default is False)         |
| <span class="nw cb">`suppressLogging`</span>      | No       | boolean | True if entries in the event log should be suppressed (default is False)                           |

## Send PowerLinc SET Button Press Message { .ref-head-no-code }

This will command the PowerLinc to send its SET Button Press Message, which can be useful in some linking scenarios.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`reply = indigo.insteon.sendPowerLincSetButtonPress()`</span>

<span class="ca">**Parameters**</span>

| Parameter                                    | Required | Type    | Description                                                              |
|----------------------------------------------|----------|---------|--------------------------------------------------------------------------|
| <span class="nw cb">`suppressLogging`</span> | No       | boolean | True if entries in the event log should be suppressed (default is False) |

## Subscribe to Events { .ref-head-no-code }

Use the lower-level `subscribeToIncoming()` and `subscribeToOutgoing()` methods in the `indigo.insteon` command space to see commands regardless of their effect on device state.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.insteon.subscribeToIncoming()`<br>
`indigo.insteon.subscribeToOutgoing()`
</span>

For example,
```python
def startup(self):
        self.logger.debug("startup called -- subscribing to all Insteon commands")
        indigo.insteon.subscribeToIncoming()
        indigo.insteon.subscribeToOutgoing()

    ########################################
    def insteonCommandReceived(self, cmd):
        self.logger.debug(f"insteonCommandReceived: \n{str(cmd)}")

    def insteonCommandSent(self, cmd):
        self.logger.debug(f"insteonCommandSent: \n{str(cmd)}")
```
