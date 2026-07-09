<!-- GENERATED from https://docs.indigodomo.com/2025.2/api/websocket/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# WebSocket API
The Indigo WebSocket API is a persistent connection, meaning that your app/integration will open the connection and keep it open until your app/integration quits. If you are looking for a transactional API, try our [HTTP API](http.md). WebSockets are bidirectional TCP connections, which clients can read from and write to – much like you can a socket or serial connection. This initial version of this API is meant to support functionality like that provided by the Indigo Touch and Domotics Pat clients and does not provide all the necessary bits to support a full configuration clients like the Mac Client. In other words, there are things that the Indigo client can do that are not supported in the WebSockets API at this time.

There are 7 WebSocket feeds that are available:

1. `/v2/api/ws/device-feed` - WebSocket to do all communication about devices
1. `/v2/api/ws/variable-feed` - WebSocket to do all communication about variables
1. `/v2/api/ws/action-feed` - WebSocket to do all communication about action groups
1. `/v2/api/ws/schedule-feed` - WebSocket to do all communication about schedules
1. `/v2/api/ws/trigger-feed` - WebSocket to do all communication about triggers
1. `/v2/api/ws/page-feed` - WebSocket to do all communication about control pages
1. `/v2/api/ws/log-feed` - WebSocket to do all communication about logs

Each feed (except log feed) sends the following server messages:

- **add** (when a new Indigo object is added)
- **patch** (when an Indigo object changes - you would apply the patch to an existing object)
- **delete** (when the Indigo object is deleted)
- **refresh** (when you request a fresh copy of a device or the entire list of devices)

## WebSocket Lifecycle
The flow of how you will interact with any of the WebSockets above will generally be:

1. Setup:
    - Open the websocket connection, and
    - Send a refresh message to obtain all of the existing instances of that Indigo type in your database.
1. Routine operation (asynchronously processing for the lifetime of your app/integration):
    - Read incoming messages from the server (add/patch/delete/refresh) and handle those as appropriate, and
    - Write messages to the server to instruct the server to do something (commands like statusRequest, turnOn, or refresh).
1. Close the connection when your app/integration quits.

The **log-feed** is different in that it will only send **add** messages with the appropriate log event object defined below.

## Authentication
WebSocket API requests must be authenticated using an **API Key**. You can manage API Keys in the [Authorizations section of your Indigo Account](https://www.indigodomo.com/account/authorizations). Alternatively, you can create "[local secrets](../user/remote-access/web-server.md#authentication)" -- a special kind of API key that doesn't pass through the Indigo reflector -- or a combination of both types of keys. Using keys instead of your Indigo Server username/password has several advantages: you can, at any time, revoke an API key, and it will immediately cause anything using it to fail. This will not affect anything else using a username/password or another API key, so your server protections against intrusions are much more granular. Also, if someone does manage to get your API Key, they can control devices, but they cannot modify your database (add/delete devices, etc.) - that is reserved for Indigo clients using the username/password.

The best way to use an API Key is to include it in an **Authorization** header on your HTTP request. If you are using a system which does not allow you to set headers for your HTTP request, you can include the API Key as a query argument with the URL:

`*wss://YOUR-REFLECTOR-NAME.indigodomo.net/v2/api/ws/device-feed?api-key=YOUR-API-KEY*`

Note the protocol: `wss`. WebSockets actually begin their life as HTTP/HTTPS connections, which the WebSocket client then requests the server to upgrade to a WebSocket. In this respect, you can think of WSS as HTTPS (protected) and WS as HTTP (unprotected). When using WSS, such as when you are using your Indigo Reflector, then your API Key (in both instances) is protected by the TLS security used by the HTTPS protocol. You may use the API locally (or thorough your own router port forwarding), but those connections will be WS and **will not be secure**. It is highly recommended that you always use your Indigo Reflector because it provides a very simple and **secure** solution for accessing your system.

!!! warning
    In order to use API Key authentication, you MUST have enabled *`Enable OAuth and API Key authentication`* in the Indigo ["Start Local Server"](../user/getting-started/installation.md#starting-indigo-server) dialog box. Don't share your API keys with anyone who is not authorized to use them — especially in posts to the Indigo user forums. Note that disabling this feature disables both API Keys and secrets.</span>

## Examples
The WebSocket and HTTP APIs are designed to be familiar to those that have been using the legacy RESTful API. However, anyone with knowledge of Python, JavaScript or similar languages should be able to pick up the structure of the new APIs very quickly. To help those making the transition as well as those learning to use API calls for the first time, we've laid out several examples to show how API calls are made, as well as all the current API hooks available.

Here's a simple Python script to open the device-feed and print out any messages it receives (you'll need to `pip3 install websockets` before running it if it isn't already installed - Indigo installs it on the Indigo Server Mac so you won't need to install there).

### Python Receiver Example
This example opens a websocket connection and prints all messages received to the console. It runs until you stop it.
```python
import asyncio
import websockets
import json

API_KEY = 'YOUR-API-KEY'

async def receiver():
    try:
        headers = {"Authorization": f"Bearer {API_KEY}"}
        # Note the update to Python 3.13 changed the `websockets.connect()` attribute `additional_headers` to
        `additional_headers`.
        async with websockets.connect("ws://localhost:8176/v2/api/ws/device-feed", additional_headers=headers) as websocket:
            while True:
                message = await websocket.recv()
                print(json.dumps(json.loads(message), indent=2))
    except Exception as exc:
        print(f"Exception:\n{exc}")

asyncio.run(receiver())
```

### Python Receiver/Sender Example
This example opens a websocket connection and shows how messages can be received and sent from the same websocket connection. It runs until the loop counters run out.

```python
import asyncio
import json
from websockets import connect

API_KEY = 'YOUR_API_KEY'  # YOUR API KEY HERE
DEVICE_ID = 12345678  # YOUR DEVICE ID HERE
HEADERS = {"Authorization": f"Bearer {API_KEY}"}
URI = "ws://127.0.0.1:8176/v2/api/ws/device-feed"  # wss:// if using the reflector

async def receiver(ws):
    try:
        print("Starting receiver task")
        # Ask for a refresh of device with ID 12345678
        refresh_message = {
            "id": "initial-device-refresh",
            "message": "refresh",
            "objectType": "indigo.Device",
            "objectId": DEVICE_ID
        }
        await ws.send(json.dumps(refresh_message))
        counter = 0
        device = {}

        while counter < 20:
            # just keep looping waiting for a message to come
            log_string = "ignoring message"
            message_json = await ws.recv()
            message = json.loads(message_json)
            message_type = message['message']

            if message_type == "refresh":
                # This is the response to the refresh message we sent above. It gets us a full copy of the device.
                device = message["objectDict"]
                log_string = f"receiver: device refresh message: '{device.get('name', 'unknown')}'"

            elif message_type == "patch":
                # There's been a change, so confirm it's the device we want then log the change
                if message["objectId"] == device["id"]:
                    log_string = f"'receiver: device patch message: {device.get('name', 'unknown')}' update: \n{message_json}"

            print(f"receiver: loop count: {counter}")
            print(f"receiver: {log_string}")
            counter += 1

    except Exception as exc:
        print(f"Exception:\n{exc}")

async def sender(ws, count):
    try:
        print("Starting sender task")
        message = {
            "id": "initial-device-refresh",
            "message": "refresh",
            "objectType": "indigo.Device",
            "objectId": DEVICE_ID
        }

        for count in range(10):
            print(f"sender: loop count: {count}")
            msg = json.dumps(message)
            print(f"sender: sending message: {msg}")
            await ws.send(json.dumps(msg))
            await asyncio.sleep(5)

    except Exception as exc:
        print(f"Exception:\n{exc}")

async def main():
    try:
        # Note the update to Python 3.13 changed the `websockets.connect()` attribute `additional_headers` to
        `additional_headers`.
        async with connect(URI, additional_headers=HEADERS) as websocket:
            await asyncio.gather(receiver(websocket), sender(websocket, 10))

    except Exception as exc:
        print(f"Exception:\n{exc}")

asyncio.run(main())
```

### JavaScript Example
Here's a simple Node.js JavaScript to open the device-feed and print out any messages it receives (you'll need to `npm install websocket` before running it).

```javascript
const APIKEY = "YOUR-API-KEY";

const W3CWebSocket = require("websocket").w3cwebsocket;

console.log("Creating websocket");

const client = new W3CWebSocket(
  `ws://localhost:8176/v2/api/ws/device-feed?api-key=${APIKEY}`
);
client.onmessage = function (message) {
  console.log(message.data);
};
client.onerror = function (err) {
  console.log(`Error: ${JSON.stringify(err)}`);
};
```

## Device Feed
This is the WebSocket you'll use for all device-related communication. You will receive the following messages from the Indigo server during the lifetime of the WebSocket.

Here are the URLs you will use to connect to this feed.

```bash
ws://localhost:8176/v2/api/ws/device-feed
wss://YOUR-REFLECTOR-NAME.indigodomo.net/v2/api/ws/device-feed
```


### Device messages from the server
The following are examples of all the device messages that you will receive from the server.

#### add device message
```json
{
  "message": "add",
  "objectType": "indigo.Device",
  "objectDict": {
    "class": "indigo.DimmerDevice",
    "address": "3B.04.7A",
    "batteryLevel": null,
    "blueLevel": null,
    "brightness": 100,
    "buttonConfiguredCount": 0,
    "buttonGroupCount": 1,
    "configured": true,
    "defaultBrightness": 100,
    "description": "- sample device -",
    "deviceTypeId": "",
    "displayStateId": "brightnessLevel",
    "displayStateImageSel": "indigo.kStateImageSel.DimmerOn",
    "displayStateValRaw": 100,
    "displayStateValUi": "100",
    "enabled": true,
    "energyAccumBaseTime": null,
    "energyAccumTimeDelta": null,
    "energyAccumTotal": null,
    "energyCurLevel": null,
    "errorState": "",
    "folderId": 1552926800,
    "globalProps": {
      "com.indigodomo.indigoserver": {},
      "emptyDict": {}
    },
    "greenLevel": null,
    "id": 1508839119,
    "lastChanged": "2023-02-16T15:43:53",
    "lastSuccessfulComm": "2023-02-16T15:43:53",
    "ledStates": [],
    "model": "LampLinc (dual-band)",
    "name": "Insteon Dimmer",
    "onBrightensToDefaultToggle": true,
    "onBrightensToLast": false,
    "onState": true,
    "ownerProps": {},
    "pluginId": "",
    "pluginProps": {},
    "protocol": "indigo.kProtocol.Insteon",
    "redLevel": null,
    "remoteDisplay": false,
    "sharedProps": {},
    "states": {
      "brightnessLevel": 100,
      "onOffState": true
    },
    "subModel": "Plug-In",
    "subType": "Plug-In",
    "supportsAllLightsOnOff": true,
    "supportsAllOff": true,
    "supportsColor": false,
    "supportsOnState": true,
    "supportsRGB": false,
    "supportsRGBandWhiteSimultaneously": false,
    "supportsStatusRequest": true,
    "supportsTwoWhiteLevels": false,
    "supportsTwoWhiteLevelsSimultaneously": false,
    "supportsWhite": false,
    "supportsWhiteTemperature": false,
    "version": 67,
    "whiteLevel": null,
    "whiteLevel2": null,
    "whiteTemperature": null
  }
}
```

When a new device is added to the Indigo Server after you've opened the connection, you will receive this message. It contains a [device object](messages.md#device-objects) that you will want to add to your device list (since you'll want to patch it as it changes over time - see the next section). You'll also receive this message when a device's remote display property is changed from False to True.

#### update device message
```json
{
  "message": "patch",
  "objectType": "indigo.Device",
  "objectId": 1508839119,
  "patch": [
    [
      "change",
      "brightness",
      [100, 0]
    ],
    [
      "change",
      "displayStateImageSel",
      ["indigo.kStateImageSel.DimmerOn", "indigo.kStateImageSel.DimmerOff"]
    ],
    [
      "change",
      "displayStateValRaw",
      [100,  0]
    ],
    [
      "change",
      "displayStateValUi",
      ["100", "0"]
    ],
    [
      "change",
      "lastChanged",
      ["2023-02-17T16:29:56", "2023-02-17T16:30:54"]
    ],
    [
      "change",
      "lastSuccessfulComm",
      ["2023-02-17T16:29:56", "2023-02-17T16:30:54"]
    ],
    [
      "change",
      "onState",
      [true, false]
    ],
    [
      "change",
      "states.brightnessLevel",
      [100, 0]
    ],
    [
      "change",
      "states.onOffState",
      [true, false]
    ]
  ]
}
```

Patch objects are created via the [dictdiffer python module](https://dictdiffer.readthedocs.io/en/latest/), by comparing the device dictionary (`dict(some_device)`) for the old device with the one for the new dictionary as they are received in the `device_updated()` plugin method call. We've implemented a JavaScript library, [dictdiffer-js](https://github.com/IndigoDomotics/dictdiffer-js), to patch JavaScript objects given the patch object created by the dictdiffer Python library. You can use it in your projects if you like.

#### device refresh messages
When you send a command that asks to refresh the entire list of devices, you'll receive the following message from the server:

```json
{
  "id": "optional-custom-user-message",
  "message": "refresh",
  "objectType": "indigo.Device",
  "list": []
}
```

And if you requested just a single device refresh, you will receive the following message from the server:

```json
{
  "id": "optional-custom-user-message",
  "message": "refresh",
  "objectType": "indigo.Device",
  "objectDict": {}
}
```

!!! note
    That the first message includes a list of objectDict elements, and the second includes a single objectDict element.

#### delete device message
```json
{
  "message": "delete",
  "objectType": "indigo.Device",
  "objectId": 123456789
}
```

This is the simplest of the messages, as it just contains the Indigo ID of the device to delete from your collection. You'll receive this message when a device is deleted from the Indigo server and when a device's remote display property is set from True to False.

### Device messages to the server
You have a variety of messages you can send to the server.

#### device refresh requests
To refresh either the full device list or a single device from the server, send the following message.

```json
{
  "id": "optional-custom-user-message",
  "message": "refresh",
  // Specify the object type
  "objectType": "indigo.Device",
  "objectId": 123456789
}
```

If you want the entire device list, simply omit the `objectId` key and the server will return the full list. The server will respond with the appropriate [device refresh message](#device-refresh-messages) shown above.

#### device command messages
To command devices to do something, you will be using the [Device Command Messages](#device-command-messages) described below. For instance, to toggle a lamp device, you would send the following message:

```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.device.toggle",
  "objectId": 123456789,
}
```
You will receive a "patch" message as a result of this command.

## Variable Feed
This is the WebSocket you'll use for all variable-related communication. You will receive the following messages from the Indigo server during the lifetime of the WebSocket.

Here are the URLs you will use to connect to this feed.

```bash
ws://localhost:8176/v2/api/ws/variable-feed
wss://YOUR-REFLECTOR-NAME.indigodomo.net/v2/api/ws/variable-feed
```

### Variable messages from the server
The following is an example of the variable message that you will receive from the server.

#### Example variable object (dictionary in Python)
```json
{
  "class": "indigo.Variable",
  "description": "",
  "folderId": 0,
  "globalProps": {
    "com.indigodomo.indigoserver": {}
  },
  "id": 345633244,
  "name": "house_status",
  "pluginProps": {},
  "readOnly": false,
  "remoteDisplay": true,
  "sharedProps": {},
  "value": "home"
}
```

Here are some examples of the server messages that clients will receive on the variable feed.

#### add variable message
```json
{
  "message": "add",
  "objectType": "indigo.Variable",
  "objectDict": {} // Variable object as outlined above
}
```
When a new variable is added to the Indigo Server after you've opened the connection, you will receive this message. It contains a [variable object](messages.md#variable-objects) that you will want to add to your variable list (since you'll want to patch it as it changes over time - see the next section). You'll also receive this message when a variable's remote display property is changed from False to True.

#### update variable message
```json
{
  "message": "patch", // we use a patch rather than send the entire updated device
  "objectType": "indigo.Variable",
  "patch": {}  // A patch object - see the Object Patches below for details
}
```

Variable patch objects are created via the [dictdiffer python module](https://dictdiffer.readthedocs.io/en/latest/) by comparing the variable dictionary (`dict(some_variable)`) for the old variable with the one for the new dictionary as they are received in the `variable_updated()` Plugin method call.

#### delete variable message
```json
{
  "message": "delete",
  "objectType": "indigo.Variable",
  "objectId": 123456789
}
```
This is the simplest of the messages, as it just contains the Indigo ID of the variable to delete from your collection. You'll receive this message when a variable is deleted from the Indigo server and when a variable's remote display property is set from True to False.

### Variable messages to the server
There are a few messages you can send to the server.

#### variable refresh messages
```json
{
  "id": "optional-custom-user-message",
  "message": "refresh",
  "objectType": "indigo.Variable",
  "objectDict": {} // Variable object as outlined above
}
```

#### Example refresh all variables message
```json
{
  "id": "optional-custom-user-message",
  "message": "refresh",
  "objectType": "indigo.Variable",
  "list": [] // a list of Variable objects as outlined above
}
```

### variable command messages
The `updateValue` command is currently the only command message you can send to the variable feed. It closely mirrors the Python-based [IOM command for updating variables](../scripting/iom-concepts.md). This was completely intentional to make learning one API a stepping stone to another. The HTTP API messages and the Websocket API messages are identical, and are very clearly a JSON-rendered version of the associated IOM command.

#### updateValue
```json
{
  // Note, values passed in the parameter dictionary must be strings. You can
  // pass in an empty string ("") to clear the variable value.
  "id": "optional-custom-user-message",
  "message": "indigo.variable.updateValue",
  "objectId": 123456789,  // the variable id to update
  "parameters": {
    "value": "Some string value"
  }
}
```

## Action Group Feed
This is the WebSocket you'll use for all action group-related communication. You will receive the following messages from the Indigo server during the lifetime of the WebSocket.

Here are the URLs you will use to connect to this feed.

```bash
ws://localhost:8176/v2/api/ws/action-feed
wss://YOUR-REFLECTOR-NAME.indigodomo.net/v2/api/ws/action-feed
```


### Action Group messages from the server
The following are examples of all the action group messages that you will receive from the server.

#### Example action group object (dictionary in Python)
```json
{
  "class": "indigo.ActionGroup",
  "description": "",
  "folderId": 532526508,
  "globalProps": {
    "com.indigodomo.indigoserver": {
      "speakDelayTime": "5",
      "speakTextVariable": "speech_string"
    }
  },
  "id": 94914463,
  "name": "Movie Night",
  "pluginProps": {},
  "remoteDisplay": true,
  "sharedProps": {
    "speakDelayTime": "5",
    "speakTextVariable": "speech_string"
  }
}
```

Here are some examples of the server messages that clients will receive on the action feed.

#### add action group message
```json
{
  "message": "add",
  "objectType": "indigo.ActionGroup",
  "objectDict": {} // ActionGroup object as outlined above
}
```
When a new action group is added to the Indigo Server after you've opened the connection, you will receive this message. It contains an [action group object](messages.md#action-group-objects) object that you will want to add to your action group list (since you'll want to patch it as it changes over time - see the next section). You'll also receive this message when an action group's remote display property is changed from False to True.

#### update action group message
The update action group message is received when an action group has been updated on the Indigo server. It doesn't allow users to update action groups via the WebSocket API.

```json
{
  "message": "patch", // we use a patch rather than send the entire updated device
  "objectType": "indigo.ActionGroup",
  "patch": {}  // A patch object - see the Object Patches below for details
}
```

Action group patch objects are created via the [dictdiffer python module](https://dictdiffer.readthedocs.io/en/latest/), by comparing the action dictionary (`dict(some_action_group)`) for the old action with the one for the new dictionary as they are received in the `action_group_updated()` Plugin method call.

#### delete action group message
```json
{
  "message": "delete",
  "objectType": "indigo.ActionGroup",
  "objectId": 123456789
}
```
This is the simplest of the messages, as it just contains the Indigo ID of the action group to delete from your collection. You'll receive this message when an action group is deleted from the Indigo server and when an action group's remote display property is set from True to False.

### Action Group messages to the server
The following are examples of the action group messages that you can send to the server.

#### action group refresh messages
```json
{
  "id": "optional-custom-user-message",
  "message": "refresh",
  "objectType": "indigo.ActionGroup",
  "objectDict": {} // ActionGroup object as outlined above
}
```

#### Example refresh all action groups message
```json
{
  "id": "optional-custom-user-message",
  "message": "refresh",
  "objectType": "indigo.ActionGroup",
  "list": [] // a list of ActionGroup objects as outlined above
}
```

### action group command messages
The `execute` command is currently the only command message you can send to the action group feed. It closely mirrors the Python-based [IOM command for executing action groups](../scripting/iom-concepts.md). This was completely intentional to make learning one API a stepping stone to another. The HTTP API messages and the Websocket API messages are identical, and are very clearly a JSON-rendered version of the associated IOM command.

#### Execute
```json
{
  "id": "optional-custom-user-message",
  "message": "indigo.actionGroup.execute",
  "objectId": 123456789  // the action group id to execute
}
```

## Control Page Feed
This is the WebSocket you'll use for all control page-related communication. You will receive the following messages from the Indigo server during the lifetime of the WebSocket. The control page feed has no command messages you can send to the server; rather, its purpose is to use incoming messages to manage a list of the available control pages which (presumably) the user would select to open that page.

Here are the URLs you will use to connect to this feed.

```bash
ws://localhost:8176/v2/api/ws/page-feed
wss://YOUR-REFLECTOR-NAME.indigodomo.net/v2/api/ws/page-feed
```

### Control Page messages from the server
The following are examples of the control page messages that you will receive from the server.

#### Example variable object (dictionary in Python) { #control-page-messages-from-the-server-example-variable-object-dictionary-in-python }
```json
{
  "class": "indigo.ControlPage",
  "backgroundImage": "",
  "description": "",
  "folderId": 0,
  "globalProps": {},
  "hideTabBar": true,
  "id": 963336187,
  "name": "Weather Images",
  "pluginProps": {},
  "remoteDisplay": true,
  "sharedProps": {}
}
```

Here are some examples of the server messages that clients will receive on the control page feed.

#### add control page message
```json
{
  "message": "add",
  "objectType": "indigo.ControlPage",
  "objectDict": {} // ControlPage object as outlined above
}
```
When a new control page is added to the Indigo Server after you've opened the connection, you will receive this message. It contains a control page that you will want to add to your control page list (since you'll want to patch it as it changes over time - see the next section). You'll also receive this message when a control page's remote display property is changed from False to True.

#### update control page message
The update control page message is received when a control page has been updated on the Indigo server. It doesn't allow users to update control pages via the WebSocket API.

```json
{
  "message": "patch", // we use a patch rather than send the entire updated control page
  "objectType": "indigo.ControlPage",
  "patch": {}  // A patch object - see the Object Patches below for details
}
```

Page patch objects are created via the [dictdiffer python module](https://dictdiffer.readthedocs.io/en/latest/), by comparing the device dictionary (`dict(some_page)`) for the old page with the one for the new dictionary as they are received in the `control_page_updated()` Plugin method call.

#### delete control page message
```json
{
  "message": "delete",
  "objectType": "indigo.ControlPage",
  "objectId": 123456789
}
```
This is the simplest of the messages, as it just contains the Indigo ID of the control page to delete from your collection. You'll receive this message when a control page is deleted from the Indigo server and when a control page's remote display property is set from True to False.

## Indigo Object Folders
Each object type above may have folders. Since those folders are specific to the type, you will use the same feed (i.e. device-feed, etc.) to get all the available folders for that type.

This is an example of a folder object. It is the same for any folder in any feed - children is the generic name for the indigo objects contained in the folder (device, variable, etc.)

```python
{
  "id": 617272302,
  "class": "indigo.Folder",
  "name": "My Device Folder",
  "remoteDisplay": true
}
```

### refresh folder server message
To get the full folder list from the server, send the following message.

```python
{
  "message": "refresh",
  "id": "optional-custom-user-message",
  "objectType": "indigo.Device.Folder",
}
```
You will then receive the following message with all the folders for that Indigo object type.

```python
{
  "message": "refresh",
  "id": "optional-custom-user-message",
  "objectType": "indigo.Device.Folder", // or indigo.Variable.Folder, etc
  "list": []  // A list of folder objects defined above
}
```

As of this release, this is the only way to get the current state of folders (there are no add/update/delete messages). If you think you need to refresh your folder list, then send the refresh message. Since folders are generally static, there really isn't much need to continually get the folder list.

## Log Feed
Use this feed to catch all log messages as they happen in the Indigo Server. When you first open the log-feed WebSocket, you will receive the last 25 log messages from the server ***in chronological order***. After that, the messages come through the socket as they are generated (chronological order). See the [Log Messages](messages.md#log-messages) section below for a description of a log message object.

Here are the URLs you will use to connect to this feed:

```text
ws://localhost:8176/v2/api/ws/log-feed
wss://YOUR-REFLECTOR-NAME.indigodomo.net/v2/api/ws/log-feed
```

The only message you will receive on the log feed will be an add message for every new log entry:

```json
{
  "message": "add",
  "objectType": "indigo.LogEvent",
  "objectDict": {
    "message": "Stopping plugin \"Web Server 2025.1.0\" (pid 1020)",
    "timeStamp": "2022-12-01T12:03:27.759000",
    "typeStr": "Application",
    "typeVal": 0
    "objectType": "indigo.LogEvent"
  }
}
```

You can also send messages to the log feed from your websocket client with the following payload:

```json
{
  "id": "optional-custom-user-message",
  "messageText": "My log message.",  // required
  "message": "indigo.server.log",  // required
}
```
