<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugins/timersandpesters/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Timers and Pesters
As the name implies, this plugin implements a very simple timer device object that works almost exactly like a manual kitchen timer (if the kitchen timer had the ability to pause and resume). Pesters are little mini schedules that can cycle for some fixed number of times. They are lightweight versions of Indigo [Schedules](../user/concepts/schedules.md#schedules).

**Note**: make sure that the plugin is enabled or the options below will not be available.

## Timers
Timers are very simple to use - they're pretty much like kitchen timers. The notable difference is that timers in Indigo are created with their start/run time as part of the timer device. This means when you start one it will use the time specified in the timer itself (this can be changed later - see the actions below). So, first, create a timer device.

## Create a Timer
![Plugin Timers New Timer Image](../images/plugin_timers_new_timer.png)

A timer is like any other device in Indigo - it shows up in the device list, it has states, etc.

1. Select `DEVICES` (or one of its subfolders) from the [Outline View](../user/mac-client/home-window.md#outline-view)
1. Click on the `New...` button
1. In the resulting `Create New Device` dialog, select `Timers and Pesters` from the `Type:` popup
1. Select `Timer` from the `Model:` menu
1. In the resulting `Configure Timer` dialog, specify the amount of time the timer will default to when started and the time increments
1. Click `Save`
1. Name the timer something useful and close the `Create New Device` dialog

The timer device you created has 6 device states:

- `Timer Start Value` - the default value of the timer when the `Start Timer` action is selected. It's set when you create a timer device and may be modified either via the device dialog or by using the `Set Timer Start Value` action.
- `Timer Status String` - a human-readable string representing the state of the timer. This is what's shown in the "State" column in the device table and can be displayed in a control page. The format is this: "Active with D:HH:MM:SS left", "Paused with D:HH:MM:SS left", "Inactive".
- `Timer Status` - the status of a timer in a way that's useful for image selection, scripts, etc. Values are one of: "inactive", "active", "paused".
- `Time Left in Seconds` - the amount of time remaining in seconds for the timer. Inactive timers will have a value of 0.
- `Time Left in Minutes` - the amount of time remaining in minutes for the timer. Inactive timers will have a value of 0.
- `Time Left in Hours` - the amount of time remaining in hours for the timer. Inactive timers will have a value of 0.
- `Time Left in Days` - the amount of time remaining in days for the timer. Inactive timers will have a value of 0.

## Use a Timer
There are two things you need to do to use a timer: control the timer (start, stop, pause, etc.) and trigger when a timer expires (when it runs out of time naturally as opposed to being stopped intentionally).

### Timer Actions
![Plugin Timers Actions Image](../images/plugin_timers_actions.png)

To operate/control the timer, you use the following actions (also available interactively from the plugin's submenu):

- `Start Timer` - use this action to start a timer. The timer device will automatically start counting down and the state will change. When the countdown completes, the status will be set to "inactive" and any triggers that are triggering off of the `Timer Expired` event for this timer will be fired. The action will only start the timer when it's inactive and will be ignored when in any other state.
- `Restart Timer` - use this action to restart a timer using the default time set for the timer. The action will always work regardless of the timer's current state.
- `Pause Timer` - as the name implies, this action will pause the selected timer. The amount of time will not be modified so that you can resume the timer at will. The action will only pause an active timer and will be ignored when the timer is in any other state.
- `Resume Timer` - use this action resume a previously paused timer. The action will only resume a paused timer and will be ignored when the timer is in any other state.
- `Stop Timer` - use this action to stop a timer prematurely. The state becomes "Inactive" and all the time left states will be set to 0. It will **not** cause any `Timer Expired` triggers to fire. The action will be ignored if the timer is already inactive.
- `Set Timer Start Value` - use this action to set the default timer value without actually starting the timer. If the timer is running when it has its start value changed, it will stop running.

### Timer Event
![Plugin Timers Events Image](../images/plugin_timers_events.png)

There is also one custom event that you can use in a Trigger: `Timer Expired`. This allows you to easily know when a timer runs out of time versus when it's explicitly stopped (by the `Stop Timer` action described above). This is synonymous to when a kitchen timer starts beeping/ringing: if it runs out of time it rings but if you expressly turn it off then it doesn't.

To create a timer expired trigger:

1. Select `TRIGGERS` (or one of its subfolders) from the [Outline View](../user/mac-client/home-window.md#outline-view)
1. Click on the `New...` button
1. In the resulting `Create New Trigger` dialog, select `Timers and Pesters Event` from the `Type:` popup
1. Select `Timer Expired` from the `Event:` menu
1. In the resulting `Configure Timer Expired` dialog, specify the timer to watch
1. Click `Save`
1. Add any [Conditions](../user/concepts/conditions.md#conditions) you need
1. Add all the [Actions](../user/concepts/actions.md#actions) you want to perform when the timer expires
1. Name the trigger something useful and close the `Create New Trigger` dialog

## Timer Uses
So, what else would you do with the timer aside from triggering off of its expiration? You can display the various states on a control page and use those states in triggers and conditions as well. You could also show the countdown on a control page if that information is useful. You could even have an audio countdown by speaking the time left on the timer.

## Pesters
![Plugins Timers and Pesters Actions Image](../images/plugin_timers_pester_actions.png)

Another very useful feature of this plugin is the "Create Pester" action. This action will create a little mini timer which will repeat a specified number of times, executing an action group each time through and will execute an optional action group at the end of its final occurrence. So - say you want to have your computer announce that it's time to take out the trash. However, if you're like me, once is never enough - I need to be nagged about it several times. Create a pester that repeats every 30 seconds for 5 times (so it doesn't go forever) that executes an action group that tells you to take out the trash. The final time can send an SMS to your phone.

Pesters can be thought of as transient schedules - they only live for a limited amount of time. You give a pester a name so that you can later cancel it, or you can cancel all pesters.

## Scripting Support
As with all plugins, actions defined by this plugin may be executed by [Python scripts](../scripting/tutorial.md#scripting-indigo-plugins). Here's the information you need to script the actions in this plugin.

**Plugin ID**: com.perceptiveautomation.indigoplugin.SimpleTimer

## Action specific properties
### Start Timer
**Action id**: startTimer

No properties for scripting required.

Example:

```python
t_id = "com.perceptiveautomation.indigoplugin.timersandpesters"

# Get a plugin object given the plugin id:
timerPlugin = indigo.server.getPlugin(t_id)
if timerPlugin.isEnabled():
	timerPlugin.executeAction("startTimer", deviceId=1604521627)
```


#### Pause Timer
**Action id**: pauseTimer

No properties for scripting required.

Example:

```python
t_id = "com.perceptiveautomation.indigoplugin.timersandpesters"

# Get a plugin object given the plugin id:
timerPlugin = indigo.server.getPlugin(t_id)
if timerPlugin.isEnabled():
	timerPlugin.executeAction("pauseTimer", deviceId=1604521627)
```

#### Restart Timer
**Action id**: restartTimer

No properties for scripting required.

Example:

```python
t_id = "com.perceptiveautomation.indigoplugin.timersandpesters"

# Get a plugin object given the plugin id:
timerPlugin = indigo.server.getPlugin(t_id)
if timerPlugin.isEnabled():
	timerPlugin.executeAction("restartTimer", deviceId=1604521627)
```

#### Resume Timer
**Action id**: resumeTimer

No properties for scripting required.

Example:

```python
t_id = "com.perceptiveautomation.indigoplugin.timersandpesters"

# Get a plugin object given the plugin id:
timerPlugin = indigo.server.getPlugin(t_id)
if timerPlugin.isEnabled():
	timerPlugin.executeAction("resumeTimer", deviceId=1604521627)
```

#### Stop Timer
**Action id**: stopTimer

No properties for scripting required.

Example:

```python
t_id = "com.perceptiveautomation.indigoplugin.timersandpesters"

# Get a plugin object given the plugin id:
timerPlugin = indigo.server.getPlugin(t_id)
if timerPlugin.isEnabled():
	timerPlugin.executeAction("stopTimer", deviceId=1604521627)
```

#### Set Timer Start Value
**Action id**: setTimerStartValue

Properties for scripting:

| *`timer`*      | the ID of the timer device                                                                                           |
|----------------|----------------------------------------------------------------------------------------------------------------------|
| *`amount`*     | a positive integer representing the initial countdown amount                                                         |
| *`amountType`* | one of the following that represents the units of measure of the amount field: "seconds", "minutes", "hours", "days" |


Example:

```python
t_id = "com.perceptiveautomation.indigoplugin.timersandpesters"

# Get a plugin object given the plugin id:
timerPlugin = indigo.server.getPlugin(t_id)
if timerPlugin.isEnabled():
	timerPlugin.executeAction(
        "setTimerStartValue",
        deviceId=1604521627,
        props={
            'amount':'30',
            'amountType':'minutes'}
    )
```

## Support and Troubleshooting
For usage or troubleshooting tips [discuss this plugin](https://forums.indigodomo.com/viewforum.php?f=99) on our forum.
