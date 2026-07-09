<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/reference/x10-commands/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# X10 Commands (indigo.X10.*)

Commands that are specific to X10 devices.

## Send Address { .ref-head-no-code }

This command will send an X10 address to the interface with NO function code.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.x10.sendAddress("A1")`</span>

<span class="ca">**Parameters**</span>

| Parameter                                    | Required | Type    | Description                                                                              |
|----------------------------------------------|----------|---------|------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>     | Yes      | string  | X10 address                                                                              |
| <span class="nw cb">`suppressLogging`</span> | No       | boolean | a boolean indicating if entries in the event log should be suppressed (default is False) |

## Send Brighten { .ref-head-no-code }

This will send the Brighten command to an X10 address.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.x10.sendBrighten("A1", delta=15)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                     | Required | Type    | Description                                                                                                                               |
|-----------------------------------------------|----------|---------|-------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>      | Yes      | string  | X10 address                                                                                                                               |
| <span class="nw cb">`delta`</span>            | Yes      | integer | the amount to brighten by relative to the current brightness - valid values from 1 to 100                                                 |
| <span class="nw cb">`suppressLogging`</span>  | No       | boolean | a boolean indicating if entries in the event log should be suppressed (default is False)                                                  |
| <span class="nw cb">`updateStatesOnly`</span> | No       | boolean | use if you only want Indigo's internal device state representation to be updated - no actual X10 commands will be sent (default is False) |

## Send Dim { .ref-head-no-code }

This will send the Dim command to an X10 address.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.x10.sendDim("A1", delta=15)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                     | Required | Type    | Description                                                                                                                               |
|-----------------------------------------------|----------|---------|-------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>      | Yes      | string  | X10 address                                                                                                                               |
| <span class="nw cb">`delta`</span>            | Yes      | integer | the amount to dim by relative to the current brightness - valid values from 1 to 100                                                      |
| <span class="nw cb">`suppressLogging`</span>  | No       | boolean | a boolean indicating if entries in the event log should be suppressed (default is False)                                                  |
| <span class="nw cb">`updateStatesOnly`</span> | No       | boolean | use if you only want Indigo's internal device state representation to be updated - no actual X10 commands will be sent (default is False) |

## Send Extended { .ref-head-no-code }

This will send an Extended command to an X10 address.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.x10.sendExtended("A1", data=10, command=128)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                     | Required | Type    | Description                                                                                                                               |
|-----------------------------------------------|----------|---------|-------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>      | Yes      | string  | X10 address                                                                                                                               |
| <span class="nw cb">`command`</span>          | Yes      | integer | the command to send                                                                                                                       |
| <span class="nw cb">`data`</span>             | Yes      | integer | the data to send                                                                                                                          |
| <span class="nw cb">`suppressLogging`</span>  | No       | boolean | a boolean indicating if entries in the event log should be suppressed (default is False)                                                  |
| <span class="nw cb">`updateStatesOnly`</span> | No       | boolean | use if you only want Indigo's internal device state representation to be updated - no actual X10 commands will be sent (default is False) |

## Send Hail Request { .ref-head-no-code }

This will send a Hail Request command to the interface.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.x10.sendHailRequest("A1")`</span>

<span class="ca">**Parameters**</span>

| Parameter                                    | Required | Type    | Description                                                                              |
|----------------------------------------------|----------|---------|------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>     | Yes      | string  | X10 address                                                                              |
| <span class="nw cb">`suppressLogging`</span> | No       | boolean | a boolean indicating if entries in the event log should be suppressed (default is False) |

## Send Hail Reply { .ref-head-no-code }

This will send a Hail Reply command to the interface.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.x10.sendHailReply("A1")`</span>

<span class="ca">**Parameters**</span>

| Parameter                                    | Required | Type    | Description                                                                              |
|----------------------------------------------|----------|---------|------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>     | Yes      | string  | X10 address                                                                              |
| <span class="nw cb">`suppressLogging`</span> | No       | boolean | a boolean indicating if entries in the event log should be suppressed (default is False) |

## Send On { .ref-head-no-code }

This will send an ON command to an X10 address.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.x10.sendOn("A1")`<br>
`indigo.x10.sendOn("A1", suppressLogging=True)`<br>
`indigo.x10.sendOn("A1", updateStatesOnly=True)`<br>
`indigo.x10.sendOn("A1", suppressLogging=True, updateStatesOnly=True)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                     | Required | Type    | Description                                                                                                                               |
|-----------------------------------------------|----------|---------|-------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>      | Yes      | string  | X10 address                                                                                                                               |
| <span class="nw cb">`suppressLogging`</span>  | No       | boolean | a boolean indicating if entries in the event log should be suppressed (default is False)                                                  |
| <span class="nw cb">`updateStatesOnly`</span> | No       | boolean | use if you only want Indigo's internal device state representation to be updated - no actual X10 commands will be sent (default is False) |

## Send Off { .ref-head-no-code }

This will send an OFF command to an X10 address.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.x10.sendOff("A1")`<br>
`indigo.x10.sendOff("A1", suppressLogging=True)`<br>
`indigo.x10.sendOff("A1", updateStatesOnly=True)`<br>
`indigo.x10.sendOff("A1", suppressLogging=True, updateStatesOnly=True)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                     | Required | Type    | Description                                                                                                                               |
|-----------------------------------------------|----------|---------|-------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>      | Yes      | string  | X10 address                                                                                                                               |
| <span class="nw cb">`suppressLogging`</span>  | No       | boolean | a boolean indicating if entries in the event log should be suppressed (default is False)                                                  |
| <span class="nw cb">`updateStatesOnly`</span> | No       | boolean | use if you only want Indigo's internal device state representation to be updated - no actual X10 commands will be sent (default is False) |

## Send Status Response On { .ref-head-no-code }

This will send a Status Response On command to the interface.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.x10.sendStatusResponseOn("A1")`</span>

<span class="ca">**Parameters**</span>

| Parameter                                    | Required | Type    | Description                                                                              |
|----------------------------------------------|----------|---------|------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>     | Yes      | string  | X10 address                                                                              |
| <span class="nw cb">`suppressLogging`</span> | No       | boolean | a boolean indicating if entries in the event log should be suppressed (default is False) |

## Send Status Response Off { .ref-head-no-code }

This will send a Status Response Off command to the interface.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.x10.sendStatusResponseOff("A1")`</span>

<span class="ca">**Parameters**</span>

| Parameter                                    | Required | Type    | Description                                                                              |
|----------------------------------------------|----------|---------|------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>     | Yes      | string  | X10 address                                                                              |
| <span class="nw cb">`suppressLogging`</span> | No       | boolean | a boolean indicating if entries in the event log should be suppressed (default is False) |
