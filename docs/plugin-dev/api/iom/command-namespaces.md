# Command Namespaces Reference

Commands are organized into namespaces matching their target class type.

## Device Commands

| Class | Namespace | Description |
|-------|-----------|-------------|
| `indigo.Device` | `indigo.device.*` | All device subclasses |
| `indigo.DimmerDevice` | `indigo.dimmer.*` | Dimmer devices |
| `indigo.RelayDevice` | `indigo.relay.*` | Relay, lock, 2-state devices |
| `indigo.SensorDevice` | `indigo.sensor.*` | Sensor devices |
| `indigo.SpeedControlDevice` | `indigo.speedcontrol.*` | Speed control/motor devices |
| `indigo.SprinklerDevice` | `indigo.sprinkler.*` | Sprinkler devices |
| `indigo.ThermostatDevice` | `indigo.thermostat.*` | Thermostat devices |
| `indigo.MultiIODevice` | `indigo.iodevice.*` | Input/output devices |

### Common Device Commands

```python
# Create device (factory method for all types)
indigo.device.create(protocol, deviceTypeId=..., props=...)

# Duplicate device
indigo.device.duplicate(dev_or_id, duplicateName="Copy")

# Delete device
indigo.device.delete(dev_or_id)

# Move to folder
indigo.device.moveToFolder(dev_or_id, folder_id)

# Enable/disable
indigo.device.enable(dev_or_id, value=True)

# Display in remote UI
indigo.device.displayInRemoteUI(dev_or_id, value=True)
```

### Dimmer Commands

```python
indigo.dimmer.turnOn(dev)
indigo.dimmer.turnOff(dev)
indigo.dimmer.toggle(dev)
indigo.dimmer.setBrightness(dev, value=75)
indigo.dimmer.brightenBy(dev, value=10)
indigo.dimmer.dimBy(dev, value=10)
indigo.dimmer.statusRequest(dev)
```

### Relay Commands

```python
indigo.relay.turnOn(dev)
indigo.relay.turnOff(dev)
indigo.relay.toggle(dev)
indigo.relay.statusRequest(dev)
```

### Sensor Commands

```python
indigo.sensor.turnOn(dev)   # For virtual sensors
indigo.sensor.turnOff(dev)
indigo.sensor.statusRequest(dev)
```

### Thermostat Commands

```python
indigo.thermostat.setHeatSetpoint(dev, value=68)
indigo.thermostat.setCoolSetpoint(dev, value=76)
indigo.thermostat.setHvacMode(dev, value=indigo.kHvacMode.Auto)
indigo.thermostat.setFanMode(dev, value=indigo.kFanMode.Auto)
indigo.thermostat.statusRequest(dev)
```

### Sprinkler Commands

```python
indigo.sprinkler.setActiveZone(dev, index=1)
indigo.sprinkler.run(dev)
indigo.sprinkler.stop(dev)
indigo.sprinkler.pause(dev)
indigo.sprinkler.resume(dev)
indigo.sprinkler.previousZone(dev)
indigo.sprinkler.nextZone(dev)
```

### Speed Control Commands

```python
indigo.speedcontrol.turnOn(dev)
indigo.speedcontrol.turnOff(dev)
indigo.speedcontrol.toggle(dev)
indigo.speedcontrol.setSpeedLevel(dev, value=50)
indigo.speedcontrol.setSpeedIndex(dev, value=2)
indigo.speedcontrol.increaseSpeedIndex(dev)
indigo.speedcontrol.decreaseSpeedIndex(dev)
indigo.speedcontrol.statusRequest(dev)
```

## Trigger Commands

| Class | Namespace |
|-------|-----------|
| `indigo.Trigger` | `indigo.trigger.*` |
| `indigo.DeviceStateChangeTrigger` | `indigo.devStateChange.*` |
| `indigo.VariableValueChangeTrigger` | `indigo.varValueChange.*` |
| `indigo.EmailReceivedTrigger` | `indigo.emailRcvd.*` |
| `indigo.InsteonCommandReceivedTrigger` | `indigo.insteonCmdRcvd.*` |
| `indigo.X10CommandReceivedTrigger` | `indigo.x10CmdRcvd.*` |
| `indigo.ServerStartupTrigger` | `indigo.serverStartup.*` |
| `indigo.PowerFailureTrigger` | `indigo.powerFail.*` |
| `indigo.InterfaceFailureTrigger` | `indigo.interfaceFail.*` |
| `indigo.InterfaceInitializedTrigger` | `indigo.interfaceInit.*` |
| `indigo.PluginEventTrigger` | `indigo.pluginEvent.*` |

```python
# Common trigger commands
indigo.trigger.enable(trigger_or_id, value=True)
indigo.trigger.execute(trigger_or_id)
indigo.trigger.delete(trigger_or_id)
indigo.trigger.moveToFolder(trigger_or_id, folder_id)
```

## Variable Commands

| Class | Namespace |
|-------|-----------|
| `indigo.Variable` | `indigo.variable.*` |

```python
# Create variable
indigo.variable.create("VarName", value="initial", folder=folder_id)

# Update value
indigo.variable.updateValue(var_or_id, value="new value")

# Delete
indigo.variable.delete(var_or_id)

# Move to folder
indigo.variable.moveToFolder(var_or_id, folder_id)
```

## Action Group Commands

| Class | Namespace |
|-------|-----------|
| `indigo.ActionGroup` | `indigo.actionGroup.*` |

```python
# Execute action group
indigo.actionGroup.execute(ag_or_id)

# Execute with event data (indigo.Dict passed to actions)
# Indigo auto-adds "source" key ("server", "python", "api-http", or "api-websocket")
indigo.actionGroup.execute(ag_or_id, event_data=some_dict)

# Enable/disable
indigo.actionGroup.enable(ag_or_id, value=True)

# Delete
indigo.actionGroup.delete(ag_or_id)

# Duplicate (returns new action group instance)
indigo.actionGroup.duplicate(ag_or_id, duplicateName="Copy of AG")

# Move to folder
indigo.actionGroup.moveToFolder(ag_or_id, value=folder_id)

# Display in remote UI
indigo.actionGroup.displayInRemoteUI(ag_or_id, value=True)

# Get dependencies (returns indigo.Dict of dependent objects)
indigo.actionGroup.getDependencies(ag_or_id)
```

## Schedule Commands

| Class | Namespace |
|-------|-----------|
| `indigo.Schedule` | `indigo.schedule.*` |

```python
# Enable/disable (with optional delay and duration in seconds)
indigo.schedule.enable(sched_or_id, value=True, delay=0, duration=0)

# Delete
indigo.schedule.delete(sched_or_id)

# Duplicate (returns new schedule instance)
indigo.schedule.duplicate(sched_or_id, duplicateName="Copy of Schedule")

# Execute immediately
# ignoreConditions: bypass any schedule conditions
# schedule_data: indigo.Dict with optional metadata (Indigo auto-adds "source" and "timestamp")
indigo.schedule.execute(sched_or_id, ignoreConditions=False, schedule_data=None)

# Move to folder
indigo.schedule.moveToFolder(sched_or_id, value=folder_id)

# Get dependencies (returns indigo.Dict of dependent objects)
indigo.schedule.getDependencies(sched_or_id)

# Remove any pending delayed actions
indigo.schedule.removeDelayedActions(sched_or_id)
```

## Protocol-Specific Commands

### INSTEON

```python
indigo.insteon.sendRawInsteon(address, cmd, cmd2=0, waitUntilAck=True)
indigo.insteon.sendRawExtended(address, cmd, cmd2, data)
indigo.insteon.subscribeToIncoming()  # Low-level monitoring
indigo.insteon.subscribeToOutgoing()
```

### X10

```python
indigo.x10.sendRawX10(address, cmd)
indigo.x10.subscribeToIncoming()
indigo.x10.subscribeToOutgoing()
```

## Server Commands

### Properties

```python
indigo.server.apiVersion       # API version string, e.g., "3.6"
indigo.server.version          # Indigo version string, e.g., "2025.1"
indigo.server.address          # Server address
indigo.server.portNum          # Server port number
indigo.server.connectionGood   # True if connected to server
indigo.server.licenseStatus    # kLicenseStatus enum value
```

### Logging

```python
indigo.server.log("message")
indigo.server.log("message", type="My Plugin", level=logging.INFO)
indigo.server.error("error message")
indigo.server.getEventLogList(lineCount=100)
indigo.server.getEventLogList(returnAsList=True, lineCount=50, showTimeStamp=True)
```

### Communication

```python
indigo.server.speak("text to speak", waitUntilDone=False)
indigo.server.sendEmailTo("user@example.com", subject="Alert", body="Motion detected")
```

### Time & Location

```python
indigo.server.getTime()                     # Current server datetime
indigo.server.calculateSunrise()            # Today's sunrise
indigo.server.calculateSunset()             # Today's sunset
indigo.server.calculateSunrise(date_obj)    # Sunrise for specific date
indigo.server.calculateSunset(date_obj)     # Sunset for specific date
indigo.server.getLatitudeAndLongitude()     # Returns (latitude, longitude) tuple
```

### File System & Database

```python
indigo.server.getDbName()              # Database name
indigo.server.getDbFilePath()          # Full path to database file
indigo.server.getInstallFolderPath()   # Indigo installation folder
```

### Hardware & Network

```python
indigo.server.getSerialPorts(filter="indigo.ignoreBluetooth")
indigo.server.getReflectorURL()        # Remote access URL
indigo.server.getWebServerURL()        # Local web server URL
```

### Plugin Management

```python
indigo.server.getPlugin(pluginId)      # Returns plugin object (see below)
indigo.server.getPluginList()          # List of all installed plugin IDs
indigo.server.savePluginPrefs()        # Force save current plugin prefs
indigo.server.restartPlugin(message="Restarting", isError=False)
indigo.server.stopPlugin(message="Stopping", isError=False)
```

### Broadcasting

```python
indigo.server.broadcastToSubscribers(messageName="myEvent")
indigo.server.subscribeToLogBroadcasts()  # Receive log entries as broadcasts
```

### Maintenance

```python
indigo.server.removeAllDelayedActions()    # Remove all pending delayed actions
indigo.server.waitUntilIdle()              # Block until server is idle
indigo.server.getDeprecatedElems(includeWarnings=False)  # Deprecated object scan
```

## Plugin Object Access

Access other plugins (or self) via `indigo.server.getPlugin()`:

```python
plugin = indigo.server.getPlugin("com.other.plugin")
```

### Plugin Properties

```python
plugin.pluginId                  # Bundle identifier
plugin.pluginVersion             # Version string
plugin.pluginDisplayName         # Display name
plugin.pluginFolderPath          # Path to plugin bundle
plugin.pluginServerApiVersion    # API version
plugin.pluginSupportURL          # Support URL

# Status
plugin.isEnabled()               # Is plugin enabled?
plugin.isInstalled()             # Is plugin installed?
plugin.isRunning()               # Is plugin running?

# Plugin Store info
plugin.storeIconURL              # Store icon URL
plugin.storeName                 # Store display name
plugin.storePluginURL            # Store page URL
plugin.storeSummary              # Store description
plugin.includedWithServer        # Bundled with Indigo?

# Update info
plugin.compatibleUpdateAvailable     # Compatible update available?
plugin.incompatibleUpdateAvailable   # Incompatible update available?
plugin.latestCompatibleVers          # Latest compatible version string
plugin.latestVers                    # Latest version string (any)
plugin.latestCompatibleDownloadURL   # Download URL
plugin.latestCompatibleDownloadCount # Download count
plugin.latestCompatibleReleaseDate   # Release date
plugin.latestCompatibleSummaryDesc   # Release summary
plugin.latestCompatibleWhatsNewDesc  # What's new text
plugin.latestRequiresIndigoVers      # Required Indigo version
plugin.latestReleaseDate             # Latest release date
```

### Executing Actions on Other Plugins

```python
plugin = indigo.server.getPlugin("com.other.plugin")

# Execute a plugin action (defined in its Actions.xml)
result = plugin.executeAction("actionId", deviceId=12345,
                               props={"key": "value"},
                               waitUntilDone=True)
# result can be: None, bool, int, float, str, indigo.Dict, indigo.List
```

### Restarting Plugins

```python
plugin = indigo.server.getPlugin("com.other.plugin")
plugin.restart(waitUntilDone=True)
plugin.restartAndDebug(waitUntilDone=True)  # Restart with debug logging
```

## Common Command Patterns

All namespaces support these methods for their object type:

| Method | Description |
|--------|-------------|
| `create()` | Create new object |
| `duplicate()` | Duplicate existing object (returns new instance) |
| `delete()` | Delete object |
| `enable()` | Enable/disable object |
| `execute()` | Execute object (action groups, schedules) |
| `moveToFolder()` | Move to folder |
| `getDependencies()` | Get dependent Indigo objects (returns `indigo.Dict`) |
| `removeDelayedActions()` | Remove pending delayed actions (schedules) |
