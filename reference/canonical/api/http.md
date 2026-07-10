<!-- GENERATED from https://docs.indigodomo.com/2025.2/api/http/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# HTTP API

!!! abstract "In this guide"
    This API is meant for use with standard HTTP as the communication mechanism. HTTP **GET** requests to get Indigo object
    instances in JSON format, and **POST** requests to send commands to the Indigo Server.

## HTTP API Endpoints
The following is a summary of endpoints (URLs that you will need to use the API) that are available (detail on each is further down):

- `/v2/api/indigo.devices` - endpoint to get a list of devices
- `/v2/api/indigo.devices/123456789` - endpoint to get a specific device instance (See [Device Objects](messages.md#device-objects) below)
- `/v2/api/indigo.variables` - endpoint to get a list of variables
- `/v2/api/indigo.variables/123456789` - endpoint to specific variable object  (See [Variable Objects](messages.md#variable-objects) below)
- `/v2/api/indigo.actionGroups` - endpoint to get a list of action groups
- `/v2/api/indigo.actionGroups/123456789` - endpoint to get a specific action group (See [Action Group Objects](messages.md#action-group-objects) below)
- `/v2/api/command` - endpoint to send Indigo a command (device control, variable update, action execution).

You’ll receive full JSON objects which represent either a list of all instances of the object type requested (for example, a list of all action groups) or an individual Indigo object instance (a single device, variable, etc.) Each individual object will be different based on the object type, class and its definition (a custom device, for example). See the [Indigo Object Model](../scripting/iom-concepts.md) docs for details about each object type.

## Authentication
HTTP API requests must be authenticated using an **API Key**. You can manage API Keys in the [Authorizations section of your Indigo Account](https://www.indigodomo.com/account/authorizations). Using keys instead of your Indigo Server username/password has several advantages: you can, at any time, revoke an API key, and it will immediately cause anything using it to fail. This will not affect anything else using your username/password or another API key, so your server protections against intrusions are much more granular. Also, if someone does manage to get your API Key, they can control devices, but they cannot modify your database (add/delete devices, etc.) - that is reserved for Indigo clients using the username/password.

The best way to use an API Key is to include it in an **Authorization** header on your HTTP request. All the examples below show this approach. If you are using a system which does not allow you to set headers for your HTTP request, you can include the API Key as a query argument with the URL:

`https://YOUR-REFLECTOR-NAME.indigodomo.net/v2/api/indigo.devices/123456789?api-key=YOUR-API-KEY`

When using HTTPS, such as when you are using your Indigo Reflector, then your API Key (in both instances) is protected by the TLS security used by the HTTPS protocol. You may use the API locally (or thorough your own router port forwarding), but those connections will be HTTP and **will not be secure**. It is highly recommended that you always use your Indigo Reflector because it provides a very simple and **secure** solution for accessing your system. 

!!! warning
    Don't share your API keys with anyone who is not authorized to use them — especially in posts to the user forums.</span>

## Getting Device Objects
The HTTP API includes a couple of methods for getting device instances as JSON objects.

### Getting All Device Objects
[Device Objects](messages.md#device-objects) are JSON representations of an Indigo device instance. This JSON object will contain all information about the object, which you can use in your solutions. By using the endpoint without specifying a specific device id, you can get the complete list of all devices in your Indigo database:

`/v2/api/indigo.devices`

Here are some examples in different languages/technologies that illustrate how to get all devices.

#### Pure Python 3 (no additional libraries)

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.

```python
# This is a pure python example - no additional libraries needed
from urllib.request import Request, urlopen
import json

REFLECTORNAME = "YOUR-REFLECTOR-NAME"
APIKEY = "YOUR-API-KEY"

req = Request(f"https://{REFLECTORNAME}.indigodomo.net/v2/api/indigo.devices")
req.add_header('Authorization', f"Bearer {APIKEY}")
with urlopen(req) as request:
    device_list = json.load(request)
    print(device_list)
```

#### JavaScript run from nodejs (no additional libraries)

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.

```javascript
// Things that are specific to your environment
const REFLECTORNAME = "YOUR-REFLECTOR-NAME"
const APIKEY = "YOUR-API-KEY"

// Get the http module, and tell it that you're using HTTPS
const http = require("https")

// These are options that you'll pass to the get call
const options = {
  hostname: `${REFLECTORNAME}.indigodomo.net`,
  path: `/v2/api/indigo.devices`,
  headers: {
    Authorization: `Bearer ${APIKEY}`
  }
}

// Get the device JSON from Indigo, parse it into an object, and log it to the console
http.get(options, (response) => {
  let result = ""
  response.on("data", chunk => {
    result += chunk;
  })
  response.on("end", () => {
    const deviceList = JSON.parse(result);
    console.log(deviceList);
  })
})
```

#### Using curl from the command line

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.

```bash
curl -H "Authorization: Bearer YOUR-API-KEY" https://YOUR-REFLECTOR-NAME.indigodomo.net/v2/api/indigo.devices
```

### Getting a Single Device Object
Here are a few examples in different languages that illustrate how to get device objects.

#### Pure Python 3 (no additional libraries) { #getting-a-single-device-object-pure-python-3-no-additional-libraries }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.
- Replace `*123456789*` with a valid Indigo device ID.

```python
# This is a pure python example - no additional libraries needed
from urllib.request import Request, urlopen
import json

REFLECTORNAME = "YOUR-REFLECTOR-NAME"
APIKEY = "YOUR-API-KEY"
DEVICEID = 123456789

req = Request(f"https://{REFLECTORNAME}.indigodomo.net/v2/api/indigo.devices/{DEVICEID}")
req.add_header('Authorization', f"Bearer {APIKEY}")
with urlopen(req) as request:
    device_instance = json.load(request)
    print(device_instance)
```

#### JavaScript run from nodejs (no additional libraries) { #getting-a-single-device-object-javascript-run-from-nodejs-no-additional-libraries }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.
- Replace `*123456789*` with a valid Indigo device ID.

```javascript
// Things that are specific to your environment
const REFLECTORNAME = "YOUR-REFLECTOR-NAME"
const APIKEY = "YOUR-API-KEY"
const DEVICEID = 123456789

// Get the http module, and tell it that you're using HTTPS
const http = require("https")

// These are options that you'll pass to the get call
const options = {
  hostname: `${REFLECTORNAME}.indigodomo.net`,
  path: `/v2/api/indigo.devices/${DEVICEID}`,
  headers: {
    Authorization: `Bearer ${APIKEY}`
  }
}

// Get the device JSON from Indigo, parse it into an object, and log it to the console
http.get(options, (response) => {
  let result = ""
  response.on("data", chunk => {
    result += chunk;
  })
  response.on("end", () => {
    const deviceInstance = JSON.parse(result);
    console.log(deviceInstance);
  })
})
```

#### Using curl from the command line { #getting-a-single-device-object-using-curl-from-the-command-line }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.

```bash
curl -H "Authorization: Bearer YOUR-API-KEY" https://YOUR-REFLECTOR-NAME.indigodomo.net/v2/api/indigo.devices/123456789
```

### Controlling an Indigo Device
You can control Indigo devices by sending commands through the API that instruct Indigo how to control the device. Indigo devices come in a variety of types, and each type has its own command set. See the [Device Command Messages](messages.md#device-command-messages) below for a description of all messages. For now, here are some simple examples to toggle devices:

#### Pure Python 3 (no additional libraries) { #controlling-an-indigo-device-pure-python-3-no-additional-libraries }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.
- Replace `*123456789*` with a valid Indigo device ID.

```python
# This is a pure python example - no additional libraries needed
from urllib.request import Request, urlopen
import json

REFLECTORNAME = "YOUR-REFLECTOR-NAME"
APIKEY = "YOUR-API-KEY"
DEVICEID = 123456789

# The message to send to the Indigo Server
message = json.dumps({
    "id": "optional-custom-user-message",
    "message": "indigo.device.toggle",
    "objectId": DEVICEID
}).encode("utf8")

req = Request(f"https://{REFLECTORNAME}.indigodomo.net/v2/api/command", data=message)
req.add_header('Authorization', f"Bearer {APIKEY}")
with urlopen(req) as request:
    reply = json.load(request)
    print(reply)
```

#### JavaScript toggle from nodejs (no additional libraries)

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.
- Replace `*123456789*` with a valid Indigo device ID.

```javascript
// Things that are specific to your environment
const REFLECTORNAME = "YOUR-REFLECTOR-NAME"
const APIKEY = "YOUR-API-KEY"
const DEVICEID = 123456789

// Get the http module, and tell it that you're using HTTPS
const http = require("https")

// The message to send to the Indigo Server
const message = JSON.stringify({
    "id": "optional-custom-user-message",
    "message": "indigo.device.toggle",
    "objectId": DEVICEID
})

// These are options that you'll pass to the get call
const options = {
  hostname: `${REFLECTORNAME}.indigodomo.net`,
  path: "/v2/api/command",
  method: "POST",
  headers: {
    Authorization: `Bearer ${APIKEY}`,
    "Content-Length": message.length
  }
}

// Get the device JSON from Indigo, parse it into an object, and log it to the console
const req = http.request(options, (response) => {
  let result = ""
  response.on("data", chunk => {
    result += chunk;
  })
  response.on("end", () => {
    const deviceInstance = JSON.parse(result);
    console.log(deviceInstance);
  })
})
req.write(message)
req.end()
```

#### Using curl from the command line { #controlling-an-indigo-device-using-curl-from-the-command-line }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.
- Replace `*123456789*` with a valid Indigo device ID.

```bash
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message": "indigo.device.toggle", "objectId": 123456789}' https://YOUR-REFLECTOR-NAME.indigodomo.net/v2/api/command
```

Using these examples, you can now construct any command listed below for any device type.

### Controlling an Indigo Device with Parameters
As noted above, Indigo devices come in a variety of types, and each type has its own command set. As a part of this command set, some devices require specific parameters in order for Indigo to be able to execute them (some devices accept optional parameters, and others do not require any parameters at all). See the [Device Command Messages](messages.md#device-command-messages) below for a description of all messages. The following examples use the `indigo.dimmer.setBrightness` command and demonstrate how to include parameters.

#### Pure Python 3 (no additional libraries) { #controlling-an-indigo-device-with-parameters-pure-python-3-no-additional-libraries }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.
- Replace `*123456789*` with a valid Indigo device ID.

```python
# This is a pure python example - no additional libraries needed
from urllib.request import Request, urlopen
import json

REFLECTORNAME = "YOUR-REFLECTOR-NAME"
APIKEY = "YOUR-API-KEY"
DEVICEID = 123456789

# The message to send to the Indigo Server
message = json.dumps({
  "id": "optional-custom-user-message",
  "message": "indigo.dimmer.setBrightness",
  "objectId": DEVICEID,
  "parameters": {
    "value": 50,
    "delay": 10
  }
}).encode("utf8")

req = Request(f"https://{REFLECTORNAME}.indigodomo.net/v2/api/command", data=message)
req.add_header('Authorization', f"Bearer {APIKEY}")
with urlopen(req) as request:
    reply = json.load(request)
    print(reply)
```

#### JavaScript run from nodejs (no additional libraries) { #controlling-an-indigo-device-with-parameters-javascript-run-from-nodejs-no-additional-libraries }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.
- Replace `*123456789*` with a valid Indigo device ID.

```javascript
// Things that are specific to your environment
const REFLECTORNAME = "YOUR-REFLECTOR-NAME"
const APIKEY = "YOUR-API-KEY"
const DEVICEID = 123456789

// Get the http module, and tell it that you're using HTTPS
const http = require("https")

// The message to send to the Indigo Server
const message = JSON.stringify({
  "id": "optional-custom-user-message",
  "message": "indigo.dimmer.setBrightness",
  "objectId": DEVICEID,
  "parameters": {
    "value": 50,
    "delay": 10
  }
})

// These are options that you'll pass to the get call
const options = {
  hostname: `${REFLECTORNAME}.indigodomo.net`,
  path: "/v2/api/command",
  method: "POST",
  headers: {
    Authorization: `Bearer ${APIKEY}`,
    "Content-Length": message.length
  }
}

// Get the device JSON from Indigo, parse it into an object, and log it to the console
const req = http.request(options, (response) => {
  let result = ""
  response.on("data", chunk => {
    result += chunk;
  })
  response.on("end", () => {
    const deviceInstance = JSON.parse(result);
    console.log(deviceInstance);
  })
})
req.write(message)
req.end()
```

#### Using curl from the command line { #controlling-an-indigo-device-with-parameters-using-curl-from-the-command-line }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.
- Replace `*123456789*` with a valid Indigo device ID.

```bash
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message": "indigo.dimmer.setBrightness", "objectId": 123456789, "parameters": {"value": 50, "delay": 10}}' https://YOUR-REFLECTOR-NAME.indigodomo.net/v2/api/command
```

Using these examples, you can now construct any command listed below for any device type.

## Getting Variable Objects
### Getting All Variable Objects
[Variable Objects](messages.md#variable-objects) are JSON representations of an Indigo variable instance. This JSON object will contain all information about the object, which you can use in your solutions. By using the endpoint without specifying a specific variable id, you can get the complete list of all variables in your Indigo database:

`/v2/api/indigo.variables`

Here are some examples in different languages/technologies that illustrate how to get all variables.

#### Pure Python 3 (no additional libraries) { #getting-all-variable-objects-pure-python-3-no-additional-libraries }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.

```python
# This is a pure python example - no additional libraries needed
from urllib.request import Request, urlopen
import json

REFLECTORNAME = "YOUR-REFLECTOR-NAME"
APIKEY = "YOUR-API-KEY"

req = Request(f"https://{REFLECTORNAME}.indigodomo.net/v2/api/indigo.variables")
req.add_header('Authorization', f"Bearer {APIKEY}")
with urlopen(req) as request:
    variable_list = json.load(request)
    print(variable_list)
```

#### JavaScript run from nodejs (no additional libraries) { #getting-all-variable-objects-javascript-run-from-nodejs-no-additional-libraries }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.

```javascript
// Things that are specific to your environment
const REFLECTORNAME = "YOUR-REFLECTOR-NAME"
const APIKEY = "YOUR-API-KEY"

// Get the http module, and tell it that you're using HTTPS
const http = require("https")

// These are options that you'll pass to the get call
const options = {
  hostname: `${REFLECTORNAME}.indigodomo.net`,
  path: `/v2/api/indigo.variables`,
  headers: {
    Authorization: `Bearer ${APIKEY}`
  }
}

// Get the variable JSON from Indigo, parse it into an object, and log it to the console
http.get(options, (response) => {
  let result = ""
  response.on("data", chunk => {
    result += chunk;
  })
  response.on("end", () => {
    const VariableList = JSON.parse(result);
    console.log(VariableList);
  })
})
```

#### Using curl from the command line { #getting-all-variable-objects-using-curl-from-the-command-line }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.

```bash
curl -H "Authorization: Bearer YOUR-API-KEY" https://YOUR-REFLECTOR-NAME.indigodomo.net/v2/api/indigo.variables
```

### Getting a Single Variable Object
Here are a few examples in different languages that illustrate how to get variable objects.

#### Pure Python 3 (no additional libraries) { #getting-a-single-variable-object-pure-python-3-no-additional-libraries }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.
- Replace `*123456789*` with a valid Indigo variable ID.

```python
# This is a pure python example - no additional libraries needed
from urllib.request import Request, urlopen
import json

REFLECTORNAME = "YOUR-REFLECTOR-NAME"
APIKEY = "YOUR-API-KEY"
VARID = 123456789  # Indigo variable object id

req = Request(f"https://{REFLECTORNAME}.indigodomo.net/v2/api/indigo.variables/{VARID}")
req.add_header('Authorization', f"Bearer {APIKEY}")
with urlopen(req) as request:
    var_instance = json.load(request)
    print(var_instance)
```

#### JavaScript run from nodejs (no additional libraries) { #getting-a-single-variable-object-javascript-run-from-nodejs-no-additional-libraries }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.
- Replace `*123456789*` with a valid Indigo variable ID.

```javascript
// Things that are specific to your environment
const REFLECTORNAME = "YOUR-REFLECTOR-NAME"
const APIKEY = "YOUR-API-KEY"
const VARID = 123456789

// Get the http module, and tell it that you're using HTTPS
const http = require("https")

// These are options that you'll pass to the get call
const options = {
  hostname: `${REFLECTORNAME}.indigodomo.net`,
  path: `/v2/api/indigo.variables/${VARID}`,
  headers: {
    Authorization: `Bearer ${APIKEY}`
  }
}

// Get the variable object JSON from Indigo, parse it into an object, and log it to the console
http.get(options, (response) => {
  let result = ""
  response.on("data", chunk => {
    result += chunk;
  })
  response.on("end", () => {
    const varInstance = JSON.parse(result);
    console.log(varInstance);
  })
})
```

#### Using curl from the command line { #getting-a-single-variable-object-using-curl-from-the-command-line }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.
- Replace `*123456789*` with a valid Indigo variable ID.

```bash
curl -H "Authorization: Bearer YOUR-API-KEY" https://YOUR-REFLECTOR-NAME.indigodomo.net/v2/api/indigo.variables/123456789
```

### Updating a Variable's Value
You can interact with Indigo variables by sending commands through the API that instruct Indigo what to do. There is only one type of Indigo variable, and the variable type has its own command set. See the [Variable Command Messages](messages.md#variable-command-messages) below for a description of all messages. For now, here is an example of how to set the value of a variable:

#### Pure Python 3 (no additional libraries) { #updating-a-variables-value-pure-python-3-no-additional-libraries }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.
- Replace `*123456789*` with a valid Indigo variable ID.

```python
# This is a pure python example - no additional libraries needed
from urllib.request import Request, urlopen
import json

REFLECTORNAME = "YOUR-REFLECTOR-NAME"
APIKEY = "YOUR-API-KEY"
VARIABLEID = 123456789

# The message to send to the Indigo Server
message = json.dumps({
  "id": "optional-custom-user-message",
  "message": "indigo.variable.updateValue",
  "objectId": VARIABLEID,
  "parameters": {
    "value": "Some string value"
  }
}).encode("utf8")

req = Request(f"https://{REFLECTORNAME}.indigodomo.net/v2/api/command", data=message)
req.add_header('Authorization', f"Bearer {APIKEY}")
with urlopen(req) as request:
    reply = json.load(request)
    print(reply)
```

#### JavaScript run from nodejs (no additional libraries) { #updating-a-variables-value-javascript-run-from-nodejs-no-additional-libraries }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.
- Replace `*123456789*` with a valid Indigo variable ID.

```javascript
// Things that are specific to your environment
const REFLECTORNAME = "YOUR-REFLECTOR-NAME"
const APIKEY = "YOUR-API-KEY"
const VARIABLEID = 123456789

// Get the http module, and tell it that you're using HTTPS
const http = require("https")

// The message to send to the Indigo Server
const message = JSON.stringify({
  "id": "optional-custom-user-message",
  "message": "indigo.variable.updateValue",
  "objectId": VARIABLEID,
  "parameters": {
    "value": "Some string value"
  }
})

// These are options that you'll pass to the get call
const options = {
  hostname: `${REFLECTORNAME}.indigodomo.net`,
  path: "/v2/api/command",
  method: "POST",
  headers: {
    Authorization: `Bearer ${APIKEY}`,
    "Content-Length": message.length
  }
}

// Get the variable JSON from Indigo, parse it into an object, and log it to the console
const req = http.request(options, (response) => {
  let result = ""
  response.on("data", chunk => {
    result += chunk;
  })
  response.on("end", () => {
    const VariableInstance = JSON.parse(result);
    console.log(VariableInstance);
  })
})
req.write(message)
req.end()
```

#### Using curl from the command line { #updating-a-variables-value-using-curl-from-the-command-line }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.
- Replace `*123456789*` with a valid Indigo variable ID.

```bash
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message": "indigo.variable.updateValue", "objectId": 123456789, "parameters": {"value": "Some string value"}}' https://YOUR-REFLECTOR-NAME.indigodomo.net/v2/api/command
```

Using these examples, you can now construct any command listed below for any variable type.

## Getting Action Group Objects
### Getting All Action Group Objects
[Action Group Objects](messages.md#action-group-objects) are JSON representations of an Indigo action group instance. This JSON object will contain all information about the object, which you can use in your solutions. By using the endpoint without specifying a specific action group id, you can get the complete list of all action groups in your Indigo database:

`/v2/api/indigo.actionGroups`

Here are some examples in different languages/technologies that illustrate how to get all action groups.

#### Pure Python 3 (no additional libraries) { #getting-all-action-group-objects-pure-python-3-no-additional-libraries }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.

```python
# This is a pure python example - no additional libraries needed
from urllib.request import Request, urlopen
import json

REFLECTORNAME = "YOUR-REFLECTOR-NAME"
APIKEY = "YOUR-API-KEY"

req = Request(f"https://{REFLECTORNAME}.indigodomo.net/v2/api/indigo.actionGroups")
req.add_header('Authorization', f"Bearer {APIKEY}")
with urlopen(req) as request:
    action_group_list = json.load(request)
    print(action_group_list)
```

#### JavaScript run from nodejs (no additional libraries) { #getting-all-action-group-objects-javascript-run-from-nodejs-no-additional-libraries }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.

```javascript
// Things that are specific to your environment
const REFLECTORNAME = "YOUR-REFLECTOR-NAME"
const APIKEY = "YOUR-API-KEY"

// Get the http module, and tell it that you're using HTTPS
const http = require("https")

// These are options that you'll pass to the get call
const options = {
  hostname: `${REFLECTORNAME}.indigodomo.net`,
  path: `/v2/api/indigo.actionGroups`,
  headers: {
    Authorization: `Bearer ${APIKEY}`
  }
}

// Get the action group JSON from Indigo, parse it into an object, and log it to the console
http.get(options, (response) => {
  let result = ""
  response.on("data", chunk => {
    result += chunk;
  })
  response.on("end", () => {
    const actionGroupList = JSON.parse(result);
    console.log(actionGroupList);
  })
})
```

#### Using curl from the command line { #getting-all-action-group-objects-using-curl-from-the-command-line }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.

```bash
curl -H "Authorization: Bearer YOUR-API-KEY" https://YOUR-REFLECTOR-NAME.indigodomo.net/v2/api/indigo.actionGroups
```

### Executing an Action Group
You can control Indigo action groups by sending commands through the API that instruct Indigo how to execute the action group. There is only one type of Indigo action group, and the action group type has its own command set. See the [Action Group Command Messages](messages.md#action-group-command-messages) below for a description of all messages. For now, here is a simple example of how to execute an action group:

#### Pure Python 3 (no additional libraries) { #executing-an-action-group-pure-python-3-no-additional-libraries }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.
- Replace `*123456789*` with a valid Indigo action group ID.

```python
# This is a pure python example - no additional libraries needed
from urllib.request import Request, urlopen
import json

REFLECTORNAME = "YOUR-REFLECTOR-NAME"
APIKEY = "YOUR-API-KEY"
ACTIONGROUPID = 123456789

# The message to send to the Indigo Server
message = json.dumps({
  "id": "optional-custom-user-message",
  "message": "indigo.actionGroup.execute",
  "objectId": ACTIONGROUPID
}).encode("utf8")

req = Request(f"https://{REFLECTORNAME}.indigodomo.net/v2/api/command", data=message)
req.add_header('Authorization', f"Bearer {APIKEY}")
with urlopen(req) as request:
    reply = json.load(request)
    print(reply)
```

#### JavaScript run from nodejs (no additional libraries) { #executing-an-action-group-javascript-run-from-nodejs-no-additional-libraries }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.
- Replace `*123456789*` with a valid Indigo action group ID.

```javascript
// Things that are specific to your environment
const REFLECTORNAME = "YOUR-REFLECTOR-NAME"
const APIKEY = "YOUR-API-KEY"
const ACTIONGROUPID = 123456789

// Get the http module, and tell it that you're using HTTPS
const http = require("https")

// The message to send to the Indigo Server
const message = JSON.stringify({
  "id": "optional-custom-user-message",
  "message": "indigo.actionGroup.execute",
  "objectId": ACTIONGROUPID
})

// These are options that you'll pass to the get call
const options = {
  hostname: `${REFLECTORNAME}.indigodomo.net`,
  path: "/v2/api/command",
  method: "POST",
  headers: {
    Authorization: `Bearer ${APIKEY}`,
    "Content-Length": message.length
  }
}

// Get the action group JSON from Indigo, parse it into an object, and log it to the console
const req = http.request(options, (response) => {
  let result = ""
  response.on("data", chunk => {
    result += chunk;
  })
  response.on("end", () => {
    const actionGroupInstance = JSON.parse(result);
    console.log(actionGroupInstance);
  })
})
req.write(message)
req.end()
```

#### Using curl from the command line { #executing-an-action-group-using-curl-from-the-command-line }

- Replace `*YOUR-API-KEY*` with a valid key from your Indigo account.
- Replace `*YOUR-REFLECTOR-NAME*` with the reflector name for your Indigo server.
- Replace `*123456789*` with a valid Indigo action group ID.

```bash
curl -X POST -H "Authorization: Bearer YOUR-API-KEY" -d '{"message": "indigo.actionGroup.execute", "objectId": 123456789}' https://YOUR-REFLECTOR-NAME.indigodomo.net/v2/api/command
```

Using these examples, you can now construct any command listed below for any action group type.
