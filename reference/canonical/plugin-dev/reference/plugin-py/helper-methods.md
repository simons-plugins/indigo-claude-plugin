<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/reference/plugin-py/helper-methods/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Helper Methods

## applicationWithBundleIdentifier() { .ref-head data-toc-label="applicationWithBundleIdentifier" }

What's returned is a scripting bridge SBApplication instance. See the [Scripting Bridge documentation](http://developer.apple.com/library/mac/#documentation/Cocoa/Conceptual/ScriptingBridgeConcepts/Introduction/Introduction.html) for more information.

<span class="ca">**Method**</span>  

| Method Name                                                                  |
|------------------------------------------------------------------------------|
| <span class="nw cb">`applicationWithBundleIdentifier(self, bundleID)`</span> |

<span class="ca">**Return Value:**</span>

| Type          | Description                              |
|---------------|------------------------------------------|
| SBApplication | A Scripting Bridge application instance. |

<span class="ca">**Parameters**</span>  

| Parameter                             | Description                                                                                  |
|---------------------------------------|----------------------------------------------------------------------------------------------|
| <span class="nw cb">`bundleID`</span> | the bundle identifier for the app (usually a fully qualified string like `com.apple.iTunes`) |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span>

```python
app = self.applicationWithBundleIdentifier("com.apple.iTunes")
if app:
    app.playpause()
```

## browserOpen() { .ref-head data-toc-label="browserOpen" }

This method will open the specified URL in the default browser. Note it does so on the server machine and not on any remotely connected clients.

<span class="ca">**Method**</span>  

| Method Name                                         |
|-----------------------------------------------------|
| <span class="nw cb">`browserOpen(self, url)`</span> |

<span class="ca">**Return Value:**</span>

| Type | Description                          |
|------|--------------------------------------|
| None | This method does not return a value. |

<span class="ca">**Parameters**</span>  

| Parameter                        | Description                    |
|----------------------------------|--------------------------------|
| <span class="nw cb">`url`</span> | the URL to open in the browser |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span>

```python
self.browserOpen("https://www.indigodomo.com")
```

## debugLog() { .ref-head data-toc-label="debugLog" }

!!! warning "Deprecated"
    (See Logging below) If, at any point in your plugin, you set `self.debug = True`, then any time debugLog is called the string will get inserted into Indigo's event log. If `self.debug = False` (the default) any call to debugLog does nothing.

<span class="ca">**Method**</span>

| Method Name                                      |
|--------------------------------------------------|
| <span class="nw cb">`debugLog(self, msg)`</span> |

<span class="ca">**Return Value:**</span>

| Type | Description                          |
|------|--------------------------------------|
| None | This method does not return a value. |

<span class="ca">**Parameters**</span>  

| Parameter                        | Description                             |
|----------------------------------|-----------------------------------------|
| <span class="nw cb">`msg`</span> | the string to insert into the event log |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span>

```python
self.debugLog("This is a debug message")  # deprecated; use self.logger.debug() instead
```

## errorLog() { .ref-head data-toc-label="errorLog" }
!!! warning "Deprecated"
    See Logging below If you want an error to show up in the event log (in red text), use this log method rather than `indigo.server.log()`.


<span class="ca">**Method**</span>  

| Method Name                                      |
|--------------------------------------------------|
| <span class="nw cb">`errorLog(self, msg)`</span> |

<span class="ca">**Return Value:**</span>

| Type | Description                          |
|------|--------------------------------------|
| None | This method does not return a value. |

<span class="ca">**Parameters**</span>  

| Parameter                        | Description                             |
|----------------------------------|-----------------------------------------|
| <span class="nw cb">`msg`</span> | the string to insert into the event log |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span>

```python
self.errorLog("An error occurred")  # deprecated; use self.logger.error() instead
```

## openSerial() { .ref-head data-toc-label="openSerial" }

This method is identical to creating a new [pySerial Serial object](http://pyserial.sourceforge.net/pyserial_api.html#classes) except that it never throws an exception. If the serial connection cannot be opened then None is returned and an error will be automatically logged to the Indigo Server event log.

<span class="ca">**Method**</span>  

| Method Name                                                                                                                                                               |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`openSerial(self, ownerName, portUrl, baudrate, bytesize, parity, stopbits, timeout, xonxoff, rtscts, writeTimeout, dsrdtr, interCharTimeout)`</span> |

<span class="ca">**Return Value:**</span>

| Type          | Description                                                      |
|---------------|------------------------------------------------------------------|
| serial.Serial | The opened serial port object, or None if the connection failed. |

<span class="ca">**Parameters**</span>  

| Parameter                                   | Description                                                                                                                         |
|---------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`ownerName`</span>      | the name of the device or plugin that owns this serial port (used for error logging); must be ASCII text with no Unicode characters |
| <span class="nw cb">`all other args`</span> | passed directly to [pySerial's Serial constructor](http://pyserial.sourceforge.net/pyserial_api.html#classes)                       |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span>

```python
self.serial_port = self.openSerial(
    dev.name, dev.pluginProps["portUrl"],
    baudrate=9600, bytesize=8, parity="N",
    stopbits=1, timeout=1.0, xonxoff=False,
    rtscts=False, writeTimeout=1.0, dsrdtr=False,
    interCharTimeout=None
)
if self.serial_port is None:
    self.logger.error(f"Unable to open serial port for \"{dev.name}\"")
```

## sleep() { .ref-head data-toc-label="sleep" }

This method should be called from within your plugin's `runConcurrentThread()` defined method, if it is defined. It will automatically raise the `StopThread` exception when the Indigo Server is trying to shut down or restart the plugin. See `runConcurrentThread` documentation above for more details.

<span class="ca">**Method**</span>  

| Method Name                                       |
|---------------------------------------------------|
| <span class="nw cb">`sleep(self, seconds)`</span> |

<span class="ca">**Return Value:**</span>

| Type | Description                          |
|------|--------------------------------------|
| None | This method does not return a value. |

<span class="ca">**Parameters**</span>  

| Parameter                            | Description                         |
|--------------------------------------|-------------------------------------|
| <span class="nw cb">`seconds`</span> | the sleep duration as a real number |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span>

```python
self.sleep(60)  # sleep for 60 seconds; raises StopThread on plugin shutdown
```

## substituteVariable() { .ref-head data-toc-label="substituteVariable" }

This method will allow any string with the following markup to have a variable value substituted: `%%v:VARID%%` where VARID is the unique variable ID as found in the UI. It's recommended that you call this method twice: first during validation to check syntax and confirm the variable exists, and again at action execution time to perform the substitution. Errors will show up in the event log if the variable doesn't exist (or if there's a formatting problem) at action execution time.

<span class="ca">**Method**</span>  

| Method Name                                                                         |
|-------------------------------------------------------------------------------------|
| <span class="nw cb">`substituteVariable(self, inString, validateOnly=False)`</span> |

<span class="ca">**Return Value:**</span>

| Type        | Description                                                             |
|-------------|-------------------------------------------------------------------------|
| str         | The substituted string (when `validateOnly` is False).                  |
| (bool, str) | A `(isValid, errorString)` tuple (when `validateOnly` is True).         |

<span class="ca">**Parameters**</span>  

| Parameter                                 | Description                                                                                                                                                  |
|-------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`inString`</span>     | the string which contains a valid variable ID                                                                                                                |
| <span class="nw cb">`validateOnly`</span> | if False (default), returns the substituted string; if True, returns a `(bool, errStr)` tuple indicating whether the syntax is valid and the variable exists |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span>

```python
# Validate during UI validation, then substitute at execution time
is_valid, err_msg = self.substituteVariable(action.props["varString"], validateOnly=True)
if is_valid:
    result = self.substituteVariable(action.props["varString"])
```

## substituteDeviceState() { .ref-head data-toc-label="substituteDeviceState" }

This method will allow any string with the following markup to have a device state value substituted: `%%d:DEVICEID:STATEKEY%%` where DEVICEID is the unique device ID and STATEKEY is the identifier for the state. It's recommended that you call this method twice: first during validation, and again at action execution time. Errors will show up in the event log if the device doesn't exist (or if there's a formatting problem) at action execution time.

<span class="ca">**Method**</span>  

| Method Name                                                                            |
|----------------------------------------------------------------------------------------|
| <span class="nw cb">`substituteDeviceState(self, inString, validateOnly=False)`</span> |

<span class="ca">**Return Value:**</span>

| Type        | Description                                                             |
|-------------|-------------------------------------------------------------------------|
| str         | The substituted string (when `validateOnly` is False).                  |
| (bool, str) | A `(isValid, errorString)` tuple (when `validateOnly` is True).         |

<span class="ca">**Parameters**</span>  

| Parameter                                 | Description                                                                                                                                                |
|-------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`inString`</span>     | the string which contains a valid device ID and state key                                                                                                  |
| <span class="nw cb">`validateOnly`</span> | if False (default), returns the substituted string; if True, returns a `(bool, errStr)` tuple indicating whether the syntax is valid and the device exists |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span>

```python
# Validate during UI validation, then substitute at execution time
is_valid, err_msg = self.substituteDeviceState(action.props["devString"], validateOnly=True)
if is_valid:
    result = self.substituteDeviceState(action.props["devString"])
```

## substitute() { .ref-head data-toc-label="substitute" }

Validation works the same and should be called when your dialog validates user input. This method calls `substituteVariable()` first followed by `substituteDeviceState()`. The ordering was carefully chosen such that the variable substitution could, in fact, add more device markup to the string before the device substitution happens. So the user can even more dynamically generate content by inserting device markup into a variable value. However, only device markup will be honored in variable values - we don't recursively call variable markup on variable values.

<span class="ca">**Method**</span>  

| Method Name                                                                 |
|-----------------------------------------------------------------------------|
| <span class="nw cb">`substitute(self, inString, validateOnly=False)`</span> |

<span class="ca">**Return Value:**</span>

| Type        | Description                                                             |
|-------------|-------------------------------------------------------------------------|
| str         | The substituted string (when `validateOnly` is False).                  |
| (bool, str) | A `(isValid, errorString)` tuple (when `validateOnly` is True).         |

<span class="ca">**Parameters**</span>  

| Parameter                                                                                                                     | Description |
|-------------------------------------------------------------------------------------------------------------------------------|-------------|
| <span class="nw cb">`inString` and `validateOnly` as described in `substituteVariable()` and `substituteDeviceState()`</span> |             |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span>

```python
# Validate during UI validation, then substitute at execution time
is_valid, err_msg = self.substitute(action.props["inputString"], validateOnly=True)
if is_valid:
    result = self.substitute(action.props["inputString"])
```
