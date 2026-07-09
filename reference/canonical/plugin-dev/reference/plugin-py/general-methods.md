<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/reference/plugin-py/general-methods/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# General Plugin Methods

## \_\_init\_\_() { .ref-head data-toc-label="\_\_init\_\_" }

This is where the class is initialized. Here you can initialize class-wide variables, initialize and configure custom logging and so on. 

You have the opportunity to use or alter the prefs before passing them on, but most plugins simply forward them to the base class. You'll most likely use the `startup()` method, described below, to do your global plugin initialization.

<span class="ca">**Method Signature**</span>

```python 
def __init__(self, 
             pluginId: str, 
             pluginDisplayName: str, 
             pluginVersion: str, 
             pluginPrefs: indigo.Dict) -> None:
```

<span class="ca">**Parameters**</span>  

| Parameter                                      | Description                                                      |
|------------------------------------------------|------------------------------------------------------------------|
| <span class="nw cb">`pluginId`</span>          | the bundle identifier of the plugin (e.g. `com.example.myplugin`) |
| <span class="nw cb">`pluginDisplayName`</span> | the human-readable name of the plugin                            |
| <span class="nw cb">`pluginVersion`</span>     | the version string of the plugin                                 |
| <span class="nw cb">`pluginPrefs`</span>       | a dictionary of preferences that the server read from disk       |

<span class="ca">**Return Values**</span>

| Type | Description                          |
|------|--------------------------------------|
| None | This method does not return a value. |

<span class="ca">**Exceptions Raised**</span>

| Type | Description                                                                                               |
|------|-----------------------------------------------------------------------------------------------------------|
| None | This method should not raise any exceptions. If it does, then that would stop plugin startup immediately. |

<span class="ca">**Command Syntax Examples**</span> 

```python
def __init__(self, pluginId, pluginDisplayName, pluginVersion, pluginPrefs):
    super().__init__(pluginId, pluginDisplayName, pluginVersion, pluginPrefs)
```


## \_\_del\_\_() { .ref-head data-toc-label="\_\_del\_\_" }

This is the destructor for the class. You will almost certainly never need to override this method, but if you do, you'll need call the super class's method when you have finished your code.

<span class="ca">**Method Signature**</span>

```python
def __del__(self) -> None:
```
<span class="ca">**Parameters**</span>  

| Parameter | Description                                 |
|-----------|---------------------------------------------|
| None      | This method does not accept any parameters. |

<span class="ca">**Return Values**</span>

| Type | Description                          |
|------|--------------------------------------|
| None | This method does not return a value. |

<span class="ca">**Exceptions Raised**</span>

| Type | Description                                                                                      |
|------|--------------------------------------------------------------------------------------------------|
| None | This method should not raise any exceptions. If it does, the plugin will shut down ungracefully. |

<span class="ca">**Command Syntax Examples**</span> 

```python
def __del__(self):
    super().__del__(self)
```

## startup() { .ref-head data-toc-label="startup" }

This method will get called after your plugin has been initialized. This is really the place where you want to make sure that everything your plugin needs to do gets set up correctly. It's passed no parameters. If you're storing a config parameter that's not editable by the user, this is a good place to make sure it's there and set to the right value. This is not, however, where you want to initialize devices and triggers that your plugin may provide - those are handled after this method completes (see the methods below).

<span class="ca">**Method Signature**</span>  

```python 
def startup(self) -> None | bool | str:
```

<span class="ca">**Parameters**</span>  

| Parameter | Description                                 |
|-----------|---------------------------------------------|
| None      | This method does not accept any parameters. |

<span class="ca">**Return Values**</span>

| Type         | Description                                            |
|--------------|--------------------------------------------------------|
| None or True | Plugin starts up normally.                             |
| False        | Plugin stops with a default message.                   |
| str          | Plugin stops with the string used as the stop message. |

<span class="ca">**Exceptions Raised**</span>

| Type         | Description |
|--------------|-------------|
| <!--TODO --> |             |

<span class="ca">**Command Syntax Examples**</span> 

```python
def startup(self):
    indigo.server.info(u"Startup called")
    # if your plugin needs to connect to a single service and remain connected
    # this is a good place to do it
    self.connection = start_some_connection()

```

## runConcurrentThread() { .ref-head data-toc-label="runConcurrentThread" }

This method is called in a newly created thread after the `startup()` method finishes executing. It's expected that it should run a loop continuously until asked to shut down.

You must call `self.sleep()` with the number of seconds to delay between loops. `self.sleep()` will raise an `self.StopThread` exception when you should end `runConcurrentThread`. You don't have to catch that exception if you don't need to do any cleanup before returning - it will just throw out to the next level. Note: shutdown will be called after `runConcurrentThread` finishes processing so you can do your cleanup there.

<span class="ca">**Method**</span>  

| Method Name                                            | Required |
|--------------------------------------------------------|----------|
| <span class="nw cb">`runConcurrentThread(self)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter | Description                                 |
|-----------|---------------------------------------------|
| None      | This method does not accept any parameters. |

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
def runConcurrentThread(self):
    try:
        while True:
            # Do your stuff here
            self.sleep(60) # in seconds
    except self.StopThread:
        # do any cleanup here
        pass
```

## stopConcurrentThread() { .ref-head data-toc-label="stopConcurrentThread" }

This method will get called when the IndigoServer wants your plugin to stop any threads that it may have created. The default implementation (below) will set the stopThread instance [variable](../../../user/glossary.md) which causes the `self.sleep()` method to throw the exception that you handle in runConcurrentThread above. In most circumstances, your plugin won't need to implement this method.

<span class="ca">**Method**</span>  

| Method Name                                             | Required |
|---------------------------------------------------------|----------|
| <span class="nw cb">`stopConcurrentThread(self)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter | Description                                 |
|-----------|---------------------------------------------|
| None      | This method does not accept any parameters. |

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
def stopConcurrentThread(self):
    self.stopThread = True
```

## prepareToSleep() { .ref-head data-toc-label="prepareToSleep" }

The default implementation of this method will call `deviceStopComm()` for each device instance and `triggerStopProcessing()` for each [trigger](../../../user/glossary.md) instance provided by your plugin. You can of course override them to do anything you like.

<span class="ca">**Method**</span>  

| Method Name                                       | Required |
|---------------------------------------------------|----------|
| <span class="nw cb">`prepareToSleep(self)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter | Description                                 |
|-----------|---------------------------------------------|
| None      | This method does not accept any parameters. |

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
def prepareToSleep(self):
    # Perform any tasks that should be done before the server machine sleeps
```
## wakeUp() { .ref-head data-toc-label="wakeUp" }

The default implementation of this method will call `deviceStartComm()` for each device instance and `triggerStartProcessing()` for each [trigger](../../../user/glossary.md) instance provided by your plugin. You can of course override them to do anything you like.

<span class="ca">**Method**</span>  

| Method Name                               | Required |
|-------------------------------------------|----------|
| <span class="nw cb">`wakeUp(self)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter | Description                                 |
|-----------|---------------------------------------------|
| None      | This method does not accept any parameters. |

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
def wakeUp(self):
    # Perform any tasks that should be done immediately upon waking the server
```

## shutdown() { .ref-head data-toc-label="shutdown" }

This method will get called when the IndigoServer wants your plugin to exit. If you define a global shutdown [variable](../../../user/glossary.md), this is the place to set it. Other things you might do in this method: if your plugin uses a single interface to talk to multiple devices, this is the place where you would want to shut down that interface (close the serial port or network connection, etc.) Each device and [trigger](../../../user/glossary.md) will already have had a chance to shut down by the time this method is called (see the methods below).

!!! note
    `shutdown()` will be called after runConcurrentThread (discussed above) so any cleanup here will be performed after any changes that might result from a loop in runConcurrentThread.

<span class="ca">**Method**</span>  

| Method Name                                 | Required |
|---------------------------------------------|----------|
| <span class="nw cb">`shutdown(self)`</span> | No       |

<span class="ca">**Parameters**</span>  

| Parameter | Description                                 |
|-----------|---------------------------------------------|
| None      | This method does not accept any parameters. |

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
def shutdown(self):
    # do any cleanup necessary before exiting
```
