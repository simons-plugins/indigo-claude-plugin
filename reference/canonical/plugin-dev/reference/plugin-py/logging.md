<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/reference/plugin-py/logging/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Logging

In previous versions of the API, the plugin base class defined three methods: `debugLog()`, `errorLog()`, and `exceptionLog()`. These were deprecated in favor of the standard [Python Logging Module](https://docs.python.org/2/library/logging.html) (don't worry, the previous APIs will continue to work).

The plugin base now has a couple of new attributes related to logging:

| Attribute                                        | Description                                                                                                                                                                                                                                                                                                                                                                                                                              |
|--------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`logger`</span>              | An instance of the [standard Python Logging class](https://docs.python.org/2/library/logging.html#logger-objects). You should use this instance to log messages. See the examples below for details.                                                                                                                                                                                                                                     |
| <span class="nw cb">`indigo_log_handler`</span>  | An instance of a special [Python Handler class](https://docs.python.org/2/library/logging.html#handler-objects) that emits messages to the Indigo Event Log window and the Indigo Server's log file.                                                                                                                                                                                                                                     |
| <span class="nw cb">`plugin_file_handler`</span> | An instance of a Python [TimedRotatingFileHandler](https://docs.python.org/2/library/logging.handlers.html#timedrotatingfilehandler) which writes you own log files in the /Logs/ directory. A subdirectory will be created using your plugin's ID as the name. Inside that directory will be daily log files (with 20 days of backups) of all log messages from your plugin. See below for examples of the default format of that file. |

The [Python logging module](https://docs.python.org/3/library/logging.html) is extremely powerful and flexible, and we recommend reading through [the docs](https://docs.python.org/2/library/logging.html) for a good understanding of how it works and how you can add great logging to your plugin. We'll describe the minimum here that you need to know to do basic logging to the Indigo Event Log window and to your plugin's log file. The logger module defines [5 levels of logging](https://docs.python.org/2/library/logging.html#logging-levels) shown below. Instances of the [Logger](https://docs.python.org/2/library/logging.html#logger-objects) object can be set to log messages at any of those 5 levels, and the level logged can be changed at any time. By default, the `self.logger` instance is set to `logging.DEBUG` (we'll see why a bit further down). You can change this if you want using the `setLevel()` method. We've named the `self.logger` instance "Plugin", because it's the name of the class from which your plugin begins. We'll see why this is important later in the examples.

You can very easily write log messages at any level using the following convenience methods defined in the [Logger](https://docs.python.org/2/library/logging.html#logger-objects) class:

<span class="ca">**Command Syntax Examples**</span> 

```python
self.logger.debug(u"Debug log message")
self.logger.info(u"Info log message")
self.logger.warn(u"Warning log message")
self.logger.error(u"Error log message")
self.logger.critical(u"Critical log message")
```

The `debugLog()`, `errorLog()`, and `exceptionLog()` methods are now just wrappers around the corresponding method above. There is another convenience method defined in the logging module: `self.logger.exception("Error log message with exception appended")`. If you call this method from within an `except` block in your plugin, it will automatically create a `logging.ERROR` level message and append the stack trace to whatever message you supply.

A [Logger](https://docs.python.org/2/library/logging.html#logger-objects) instance can have any number of [Handler](https://docs.python.org/2/library/logging.html#handler-objects) objects associated with it. These handler objects are what actually do the heavy lifting in terms of where log messages go and how those messages are formatted. The plugin base class provides two of them: `self.indigo_log_handler` and `self.plugin_file_handler`, both of which are automatically added to `self.logger`. Therefore, calling any of the 5 methods above (`self.logger.debug`, `self.logger.info`, etc.) will automatically route those messages to both the Indigo Server and the plugin file handler.

## self.indigo_log_handler
The `self.indigo_log_handler` is an instance of a custom [Handler](https://docs.python.org/3.10/library/logging.html#handler-objects) object that will write (or emit in Python Handler speak) your log messages into the Indigo Event Log. The message type (the left part in the Event Log) is modified so that it reflects the level of the log message (except for the `info` level). For convenience, the various log levels are also represented in color. Here's an example of each level:

![Embedded Script Logging Image](../../../images/embedded_script_logging.png)

## self.plugin_file_handler
The `self.plugin_file_handler` is an instance of a [TimedRotatingFileHandler](https://docs.python.org/2/library/logging.handlers.html#timedrotatingfilehandler). This handler is used to write log files with some automatic file management: it can rotate the log files (so they don't get too big), and can be configured to keep some number of backups. By default, we've configured it to rotate the log files at midnight each night and to keep 20 backups. You can, of course, change those settings on the handler.

[Handler](https://docs.python.org/2/library/logging.html#handler-objects) objects have a [Formatter](https://docs.python.org/2/library/logging.html#formatter-objects) object set, which is how the log line is formatted. By default, we format the log lines with the date/time stamp, the level (e.g. DEBUG), `[the logger name ("Plugin" by default)].[method name]:`, message. Each element is separated by a tab. So, for example, the lines from the methods above will result in these lines in your log file:

<span class="ca">**Command Syntax Examples**</span> 

```text
2016-02-10 15:27:18.194	DEBUG	Plugin.runConcurrentThread:	Debug logging
2016-02-10 15:27:18.194	INFO	Plugin.runConcurrentThread:	Info logging
2016-02-10 15:27:18.195	WARNING	Plugin.runConcurrentThread:	Warning logging
2016-02-10 15:27:18.195	ERROR	Plugin.runConcurrentThread:	Error logging
2016-02-10 15:27:18.195	CRITICAL	Plugin.runConcurrentThread:	Critical logging
```

So, date time, level, `Plugin.method` (in this case we're writing from the runConcurrentThread method): message. However, if that's not what you want, you can create your own [Formatter](https://docs.python.org/2/library/logging.html#formatter-objects) instance and set the handler to use that instead.

## Log Levels
Earlier, we mentioned that we set the level of the logger to `logger.DEBUG`. Does this mean that all debug or better messages are automatically sent to both the file and the Indigo Event Log? Actually, no. This is because you can also specify at the handler what level to actually log. We default the `plugin_file_handler` to `logger.DEBUG` but we default the `indigo_log_handler` to `logger.INFO`. The reasoning is that you want the file to have all debugging information, but you are likely to need less logging to the Event Log by default. Again, because you have access to those handlers, you can use their `setLevel()` methods to change them as well, and if you've implemented user selectable debug levels, this should fall right in line with what you're expecting.

In fact, we've done a little trickery for you so that the old `self.debug` attribute will continue to behave as you might expect. If you have `self.debug` set to `True`, we set the `indigo_log_handler` to `logger.DEBUG`. And if it's `False`, we set it to `logger.INFO`. We also continue to maintain the `self.debug` attribute so your legacy code will continue to work, though that is deprecated as well.

## Logging from Another Class or Submodule
Logging from another class or submodule is relatively straight-forward. You can either get the logger for the plugin:

<span class="ca">**Command Syntax Examples**</span> 

```python
plugin_logger = logging.getLogger("Plugin")
```
For example,
```python
class MyClass(object):

    def __init__(self):
        self.logger = logging.getLogger("Plugin")
        self.logger.debug("MyClass Object")
```

and use it directly, or you can pass your logger into the methods of the submodule. You could also pass in the event log handler defined for you by the plugin base (`self.indigo_log_handler`), and then attach that to a custom logger in your module.

### Custom IndigoLogHandler
If you use the instance of `self.indigo_log_handler`, the message emitted to the Event Log window will have a type that is the name of the plugin.

If you want log lines with titles other than the plugin name (like a name specific to the submodule), you can instantiate an instance of the `IndigoLogHandler` class (which is what `self.indigo_log_handler` is) instead:

<span class="ca">**Command Syntax Examples**</span> 

```python
custom_logger = logging.getLogger("MyModule")
custom_handler = self.IndigoLogHandler("MyModule", logging.DEBUG)
custom_logger.addHandler(custom_handler)
```

And anything logged to your `plugin_logger` will be reflected in the Event Log:

```text
MyModule Debug    Some event log debug message here
```

### exc_info
With the logging message `self.logger.critical("Something bad happened.")` you will see the following in the log:

<span class="ca">**Command Syntax Examples**</span> 

```text
My Plugin Error             Something bad happened.
My Plugin Error             plugin runConcurrentThread function returned or failed (will attempt again in 10 seconds)
```
which doesn't provide any detail on what actually went wrong. Fortunately, the logging method provides a way to pass more information about the error to the logger with `exc_info`; such as `self.logger.critical("Something bad happened.", exc_info=True)` which yields:

```text
My Plugin Error             Something bad happened.
Traceback (most recent call last):
  File "plugin.py", line 123, in runConcurrentThread
    x = 1 / 0
ZeroDivisionError: division by zero
   My Plugin Error             plugin runConcurrentThread function returned or failed (will attempt again in 10 seconds)
```

### Full Example
While there are many different ways to implement logging, here is a "full" example all in one place.

<span class="ca">**Command Syntax Examples**</span> 

```python
import logging

def __init__(self):
    # Get the current logging level from pluginPrefs
    self.debugLevel = int(self.pluginPrefs.get('showDebugLevel', "30"))

    # Set preferred log format specifier
    log_format = '%(asctime)s.%(msecs)03d\t%(levelname)-10s\t%(name)s.%(funcName)-28s %(message)s'
    self.plugin_file_handler.setFormatter(
        logging.Formatter(fmt=log_format, datefmt='%Y-%m-%d %H:%M:%S')
    )
    self.indigo_log_handler.setLevel(self.debugLevel)

def runConcurrentThread(self):
    self.logger.debug("Starting concurrent thread.")

    try:
        x = 1 / 0
    except ZeroDivisionError:
        self.logger.critical("Something bad happened.", exc_info=True)
```
Which yields:
```text
My Plugin Error             Something bad happened.
Traceback (most recent call last):
  File "plugin.py", line 123, in runConcurrentThread
    x = 1 / 0
ZeroDivisionError: division by zero
```

## Logging from Linked and Embedded Scripts
Logging from linked and embedded scripts is very straight-forward. You can simply set the level you want by accessing the `logging.*` level you want:

<span class="ca">**Command Syntax Examples**</span> 

```text
import logging

indigo.server.log("debug message", level=logging.DEBUG)
indigo.server.log("info message", level=logging.INFO)
indigo.server.log("warning message", level=logging.WARNING)
indigo.server.log("error message", level=logging.ERROR)
indigo.server.log("critical message", level=logging.CRITICAL)
```

and then logging messages will appear with the colors above. Result:

![Embedded Script Logging Image](../../../images/embedded_script_logging.png)
