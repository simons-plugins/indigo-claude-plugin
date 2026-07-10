<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/reference/server-commands/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Server Properties and Commands (indigo.server.*)

!!! abstract "In this guide"
    These are properties and commands that aren't associated with any specific object type and are inside the indigo.server.* command namespace.

## Properties For Connected Indigo Server { .ref-head-no-code }

| Property                                    | Type    | Writable | Description                                                                                                                   |
|---------------------------------------------|---------|----------|-------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`address`</span>        | string  | No       | the IP address of the currently connected Indigo Server                                                                       |
| <span class="nw cb">`apiVersion`</span>     | string  | No       | [API v1.7](https://www.indigodomo.com/indigo/api_release_notes/1.7/): the currently connected Indigo Server plugin API version as a string (ex: "1.7")     |
| <span class="nw cb">`connectionGood`</span> | boolean | No       | true if the connection to the Indigo Server is currently good                                                                 |
| <span class="nw cb">`licenseStatus`</span>  | string  | No       | [API v2.5](https://www.indigodomo.com/indigo/api_release_notes/2.5/): returns one of the values specified in the `indigo.kLicenseStatus` enumeration below |
| <span class="nw cb">`portNum`</span>        | integer | No       | the port number of the currently connected Indigo Server                                                                      |
| <span class="nw cb">`version`</span>        | string  | No       | the currently connected Indigo Server version string                                                                          |

## License Status Enumeration { .ref-head-no-code }

| <span class="nw cb">`indigo.kLicenseStatus`</span> |                                                                                  |
|----------------------------------------------------|----------------------------------------------------------------------------------|
| Value                                              | Description                                                                      |
| <span class="nw cb">`ActiveTrial`</span>           | the license is a trial                                                           |
| <span class="nw cb">`ActiveSubscription`</span>    | license has an active Indigo Up-to-Date subscription (access to a reflector)     |
| <span class="nw cb">`ExpiredSubscription`</span>   | license has an expired Indigo Up-to-Date subscription (no access to a reflector) |
| <span class="nw cb">`Unknown`</span>               | license is in an unknown state                                                   |

## Broadcast to Subscribers { .ref-head-no-code }

This command will broadcast message to other plugins that have subscribed to the specified name message.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.server.broadcastToSubscribers(messageName)`</span>

## Calculate Sunrise { .ref-head-no-code }

This command will return a datetime object that represents the sunrise for the specified day (or the next sunrise if no date is passed in).

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.server.calculateSunrise()`<br>
`indigo.server.calculateSunrise(myDateObject)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type                                       | Description                                                                                                |
|------------------------------------------|----------|--------------------------------------------|------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span> | No       | <span class="nw cb">`datetime.date`</span> | a <span class="nw cb">`datetime.date`</span> object representing the day to calculate the sunrise time for |

## Calculate Sunset { .ref-head-no-code }

This command will return a datetime object that represents the sunset for the specified day (or the next sunset if no date is passed in).

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.server.calculateSunset()`<br>
`indigo.server.calculateSunset(myDateObject)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type                                       | Description                                                                                                |
|------------------------------------------|----------|--------------------------------------------|------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span> | No       | <span class="nw cb">`datetime.date`</span> | a <span class="nw cb">`datetime.date`</span> object representing the day to calculate the sunrise time for |

## Event Log List { .ref-head-no-code }

This command will return a string that contains the latest log entries. Each line is terminated with a line feed character.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.server.getEventLogList()`<br>
`indigo.server.getEventLogList(lineCount=5)`<br>
`indigo.server.getEventLogList(showTimeStamp=False)`<br>
`indigo.server.getEventLogList(lineCount=5, showTimeStamp=False)`<br>
`indigo.server.getEventLogList(returnAsList=True, lineCount=5)`
</span>

<span class="ca">**Parameters**</span>

| Parameter     | Required | Type    | Description                                                                                                                                                                            |
|---------------|----------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| returnAsList  | No       | boolean | if true a list of dicts is returned containing individual log entry attributes; if false a string containing a textual description of the log lines is returned - the default is false |
| lineCount     | No       | integer | the number of lines to return from the event log starting from newest and going backwards in time - the default is 1500                                                                |
| showTimeStamp | No       | boolean | indicate whether every line should have its timestamp prepended to the log entry - the default is true                                                                                 |

## Get Database File Name { .ref-head-no-code }

Returns the name of the current database name (without the file extension). It takes no parameters.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`name=indigo.server.getDbName()`</span>

## Get Database File Path { .ref-head-no-code }

Returns the POSIX path to the current database file (includes the file name with extension). It takes no parameters.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`name=indigo.server.getDbFilePath()`</span>

## Get Deprecated Elements { .ref-head-no-code }

Returns the server's list of elements that have attributes or properties that are now deprecated.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`name=indigo.server. getDeprecatedElems(includeWarnings=[True/False]`</span>

## Get Install Folder Path { .ref-head-no-code }

Returns the POSIX path to the current Indigo installation path. Useful if you want to manipulate files (like graphics and scripts) that are in the Indigo installation path. It takes no parameters.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`name=indigo.server.getInstallFolderPath()`</span>

## Get Latitude and Longitude { .ref-head-no-code }

Returns a list of floating point numbers where the first float is the latitude and the second (and last) is the longitude. It takes no parameters.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`latLong = indigo.server.getLatitudeAndLongitude()`<br>
`lat = latLong[0]`<br>
`long = latLong[1]`
</span>

## Get Plugin { .ref-head-no-code }

Returns a plugin object given the plugin id.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`myPlugin=indigo.server.getPlugin("com.company.pluginId")`</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type   | Description                      |
|------------------------------------------|----------|--------|----------------------------------|
| <span class="nw">direct parameter</span> | Yes      | string | the id of the plugin to retrieve |

See [scripting plugins](../tutorial.md#scripting-indigo-plugins) for details and examples of using this method.

## Get Plugin List { .ref-head-no-code }

**[API v2.4](https://www.indigodomo.com/indigo/api_release_notes/2.4/)**: Returns a list of all enabled plugin object instances.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`enabled_plugin_list=indigo.server.getPluginList()`</span>

## Get Reflector URL { .ref-head-no-code }

**[API v2.5](https://www.indigodomo.com/indigo/api_release_notes/2.5/)**: Returns a string with the URL to the active reflector. Returns None if there is no reflector or if remote access is disabled.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.server.getReflectorURL()`<br>
`>>> "https://myreflector.indigodomo.net/"`
</span>

## Get Serial Ports { .ref-head-no-code }

Returns a dictionary representing all serial ports on the server machine. The key is the full path specification for the port (for use by PySerial) and the value is just the name of the port (for display purposes).

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.server.getSerialPorts()`<br>
`indigo.server.getSerialPorts(filter="indigo.ignoreBluetooth")`
</span>

```python
ports = indigo.server.getSerialPorts(filter="indigo.ignoreBluetooth")
# iterate through the full paths
for posixPath in ports:
	print(posixPath)
# iterate through just the port name itself
for uiName in ports.itervalues():
	print(uiName)
# iterate through both
for posixPath, uiName in ports.iteritems():
	print(posixPath)
	print(uiName)
```

<span class="ca">**Parameters**</span>

| Parameter                           | Required | Type   | Description                                                                                                                       |
|-------------------------------------|----------|--------|-----------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`filter`</span> | No       | string | currently there’s only one valid filter: "indigo.ignoreBluetooth" which will remove the "Bluetooth-PDA-Sync" option from the list |

## Get Time { .ref-head-no-code }

Returns a datetime object representing the server's current time.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.server.getTime()`</span>

<span class="ca">**Parameters**</span><br>
None

## Get Web Server URL { .ref-head-no-code }

Returns a URL string that best represents the URL to the active Indigo Web Server. This is the order of which URL will be returned:

1. Reflector (`https://reflector.indigodomo.net`) if a reflector is configured.
1. Bonjour name (`http://MacName.local:PORT`) if it can be determined.
1. Localhost (`http://localhost:PORT`) if all else fails.

Note, there is no trailing slash. `PORT` is the port number of the server (for example, 8176).

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.server.getWebServerURL()`</span>

<span class="ca">**Parameters**</span><br>
None

## Log { .ref-head-no-code }

This tells IndigoServer to write a log entry with the specified text. The type in the log will be the name of the plugin. The examples below that refer to the logging package assume that you've done this somewhere before: `import logging`

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.server.log("Info Text to log")`<br>
`indigo.server.log("Info Text to log", type="myType")`<br>
`indigo.server.log("Warning Text to log", level=logging.WARNING)`<br>
`indigo.server.log("Error Text to log1", level=logging.ERROR)`<br>
`indigo.server.log("Error Text to log2", isError=True)`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type    | Description                                                                                                                                                                                                                                                   |
|------------------------------------------|----------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span> | Yes      | string  | this is the text that’s written to the log                                                                                                                                                                                                                    |
| <span class="nw cb">`type`</span>        | No       | string  | a string representing the type - if it’s not included and is run from a Server Plugin, the name of the plugin will automatically be used                                                                                                                      |
| <span class="nw cb">`level`</span>       | No       | integer | **[API v2.4](https://www.indigodomo.com/indigo/api_release_notes/2.4/)**:  the python logging level which determines both the type shown and the text color used.  (ex: using `level=logging.WARNING` will show orange text)                                                               |
| <span class="nw cb">`isError`</span>     | No       | boolean | if <span class="nw cb">`True`</span>, it will show up in red in the event log - default is <span class="nw cb">`False`</span> - if no <span class="nw cb">`type`</span> is included, the name of the plugin will automatically be used with " Error" appended |

## Remove All Delayed Actions { .ref-head-no-code }

This command will remove all delayed actions currently scheduled. It doesn’t take any parameters.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.server.removeAllDelayedActions()`</span>

## Restart Plugin { .ref-head-no-code }

This command will tell the server to restart our plugin process. The message is printed to the event log, and if isError is true then it's logged as an error. This command can only be called from a plugin, and it refers to the plugin itself (not other plugins).

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.server.restartPlugin("Restarting now for some reason", isError=True)`</span>

## Save Plugin Preferences { .ref-head-no-code }

The Indigo server will save changes to plugin preferences automatically, and this command will cause the server to save plugin preferences immediately. It doesn’t take any parameters.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.server.savePluginPrefs()`</span>

## Send Email { .ref-head-no-code }

This tells IndigoServer to send an email using the SMTP settings configured in the preferences "Email" tab.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">
`indigo.server.sendEmailTo("my.address@example.com")`<br>
`indigo.server.sendEmailTo("my.address@example.com",`<br>&nbsp;&nbsp;&nbsp;&nbsp;`subject="Subject of email", body="Body of email")`
</span>

<span class="ca">**Parameters**</span>

| Parameter                                | Required | Type   | Description                                     |
|------------------------------------------|----------|--------|-------------------------------------------------|
| <span class="nw">direct parameter</span> | Yes      | string | a semicolon separated string of email addresses |
| <span class="nw cb">`subject`</span>     | No       | string | the subject of the email                        |
| <span class="nw cb">`body`</span>        | No       | string | the body of the email                           |

## Speak { .ref-head-no-code }

Speak a text string using the built-in speech synthesizer.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.server.speak("text to speak", waitUntilDone=True)`</span>

<span class="ca">**Parameters**</span>

| Parameter                                  | Required | Type    | Description                                                                                                        |
|--------------------------------------------|----------|---------|--------------------------------------------------------------------------------------------------------------------|
| <span class="nw">direct parameter</span>   | Yes      | string  | the string to speak                                                                                                |
| <span class="nw cb">`waitUntilDone`</span> | No       | boolean | should the method call block until speaking is complete or should it just return immediately (queue up the speech) |

## Stop Plugin { .ref-head-no-code }

Tell the server to shut down our plugin process. Plugin will remain enabled but be in a stopped state. This command can only be called from a plugin, and it refers to the plugin itself (not all plugins).

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.server.stopPlugin("Stopping now for some reason", isError=True)`</span>

## Subscribe To Log Broadcasts { .ref-head-no-code }

Subscribes to all server event log broadcasts.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.server.subscribeToLogBroadcasts()`</span>

<span class="ca">**Parameters**</span><br>
None

## Wait Until Idle { .ref-head-no-code }

Wait (block) until server has completed event processing and command sending.

<span class="ca">**Command Syntax Examples**</span>

<span class="nw cb">`indigo.server.waitUntilIdle()`</span>

<span class="ca">**Parameters**</span><br>
None
