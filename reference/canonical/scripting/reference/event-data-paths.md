<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/reference/event-data-paths/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Events Data Path Specifiers
## Path Strings
Path strings use a specific syntax and require knowledge about the data you'll be working with. For example, given this Indigo event data:
```json
{
    "foo": 1234567890,
    "bar": "Baz",
    "data": ["Thing 1", "Thing 2"],  # a list
    "more_data": {'a': 1, 'b': 2},  # a dictionary
    "timestamp": "2025-08-07T14:32:21",
}
```

You could use path strings like these to retrieve the associated data:

| Path String        | Result                 |
|--------------------|------------------------|
| *`bar`*            | "Baz"                  |
| *`data`*           | ["Thing 1", "Thing 2"] |
| *`more_data['b']`* | 2                      |


If you want to go deeper into the payload, path strings can be chained together like this:

```json
{
    "foo": 1234567890,
    "bar": "Baz",
    "data": [
        "Thing 1",
        [
            "Thing A",
            "Thing B",
            "Thing C"
        ]
    ],
    "more_data": {
        "a": 1,
        "b": 2,
        "c": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    "timestamp": "2025-08-07T14:32:21"
}
```

You can go deeper like this:

| Path String        | Result                                                                                                                 |
|--------------------|------------------------------------------------------------------------------------------------------------------------|
| *`data[0]`*        | "Thing 1"  (The index of the list element, the index starts at zero)                                                   |
| *`data[1][2]`*     | "Thing C" # The second element (index 1) of "data" is a list and the third element (index 2) of that list is "Thing C" |
| *`more_data.a`*    | 1  # The value of key "a" is 1                                                                                         |
| *`more_data.c[3]`* | 4  # The value of key "c" is a list and the fourth element (index 3) of that list is 4                                 |


You can chain these path strings as needed, such as *`some_json[3].a.foo[9]`*. NOTE: if a path string is not provided, Indigo will return the entire payload. Any path that includes a collection (like the lists and dicts above), Indigo will convert it to JSON and respond with that data.

## Indigo-Supplied Event Data
We updated most of the built-in events (Triggers, Schedules, etc.) to pass through the event data that's specific to those events. All events, regardless of what they are, will contain the following values:

```json
{
  "event-indigo-id": 127375748,
  "event-type": "VariableValueChangeTrigger",
  "source": "server",
  "timestamp": "2025-08-07T14:13:54"
}
```

The `event-indigo-id` is the Indigo ID for the trigger, schedule, or action group. The `event-type` is the IOM event type. `source` is how the trigger was fired, and `timestamp` is an ISO formatted `datetime` of the event.

Each specific trigger/schedule/action group may add additional data that will assist you later in the event processing chain. The following blocks provide samples of event data that Indigo supplies for various events.

### Action Groups
```json
[
  {
    "_comment": "This is what you get when you execute an action group from the http api",
    "event-indigo-id": 1893263747,
    "event-type": "ActionGroup",
    "source": "api-http",
    "timestamp": "2025-10-16T14:59:05",
    "unique-id": "1dd66fc1-ce8c-43f7-996f-5b29278c1b90"
  },
  {
    "_comment": "When a webhook is called with a JSON dictionary (in data param)",
    "data": {
      "id": "ShortcutWithJsonInputTests.test_webhook_json_input_var_output",
      "message": "something-happened",
      "some-data": {
        "some-key": [
          "some-value",
          "some-other-value"
        ],
        "unique-id": "9d34e21b-9926-4023-ab94-c0cc52ecedd5"
      }
    },
    "event-indigo-id": 879507411,
    "event-plugin-event-id": "simpleWebhook",
    "event-plugin-id": "com.indigodomo.webserver",
    "event-plugin-name": "Web Server",
    "event-type": "PluginEventTrigger",
    "http-method": "POST",
    "http-post-content": "JSON",
    "request-url": "https://localhost:8176/webhook/shortcut-json-input-var-output",
    "source": "python",
    "status-code": 200,
    "timestamp": "2025-10-16T14:58:55",
    "webhook-id": "shortcut-json-input-var-output"
  }
]
```

### Control Page Clicks
```json
{
  "client-ip": "127.0.0.1",
  "client-is-private": true,
  "control-id": 0,
  "event-indigo-id": 120091806,
  "event-type": "ControlPage",
  "timestamp": "2025-10-16T16:10:54"
}
```

### Device State Change Trigger
If a device state has any change.

```python
{
  "_comment": "When the server executes a has any change device state change trigger"
  "change-type": "any change",
  "change-type-iom": "indigo.kStateChange.Changes",
  "device-id": 1167180255,
  "event-indigo-id": 625370601,
  "event-type": "DeviceStateChangeTrigger",
  "new-value": "on",
  "old-value": "off",
  "source": "server",
  "state-key": "onOffState",
  "timestamp": "2025-10-16T17:07:23"
}
```

### Insteon Command Received
```json
[
  {
    "_comment": "when any insteon command is received",
    "event-indigo-id": 1086420814,
    "event-type": "InsteonCommandReceivedTrigger",
    "insteon-cmd-rcvd": {
      "Address": 1652724,
      "AddressStr": "19.37.F4",
      "CommandDetails": 0,
      "CommandName": "on",
      "CommandVal": 0,
      "GroupBroadcastNum": 1,
      "IsGroupBroadcast": true,
      "SendCleanups": false
    },
    "source": "server",
    "timestamp": "2025-09-24T15:00:12"
  },
  {
    "_comment": "when a double-tap off command is received"
    "event-indigo-id": 1398699236,
    "event-type": "InsteonCommandReceivedTrigger",
    "insteon-cmd-rcvd": {
      "Address": 1652724,
      "AddressStr": "19.37.F4",
      "CommandDetails": 0,
      "CommandName": "off (instant)",
      "CommandVal": 0,
      "GroupBroadcastNum": 1,
      "IsGroupBroadcast": true,
      "SendCleanups": false
    },
    "source": "server",
    "timestamp": "2025-08-12T17:39:49"
  }
]
```

### Server Executed Schedules
When the server executes a schedule during normal operation.

```json
{
  "event-indigo-id": 485722026,
  "event-type": "Schedule",
  "source": "server",
  "timestamp": "2025-10-16T13:55:02"
}
```

### Variable Changes
```python
[
  {
    "change-type": "becomes equal",
    "change-type-iom": "indigo.kVarChange.BecomesEqual",
    "event-indigo-id": 1533121690,
    "event-type": "VariableValueChangeTrigger",
    "new-val": "var_becomes_equal_to",
    "old-val": "",
    "source": "server",
    "test-val": "var_becomes_equal_to",
    "timestamp": "2025-10-16T13:56:23",
    "var-id": 54247914
  },
  {
    "change-type": "becomes false",
    "change-type-iom": "indigo.kVarChange.BecomesFalse",
    "event-indigo-id": 1202935007,
    "event-type": "VariableValueChangeTrigger",
    "new-val": "false",
    "old-val": "true",
    "source": "server",
    "timestamp": "2025-10-16T13:56:24",
    "var-id": 24284935
  },
  {
    "change-type": "becomes greater than",
    "change-type-iom": "indigo.kVarChange.BecomesGreaterThan",
    "event-indigo-id": 1952491014,
    "event-type": "VariableValueChangeTrigger",
    "new-val": "11",
    "old-val": "9",
    "source": "server",
    "test-val": "10",
    "timestamp": "2025-10-16T13:56:25",
    "var-id": 738010762
  },
  {
    "change-type": "becomes less than",
    "change-type-iom": "indigo.kVarChange.BecomesLessThan",
    "event-indigo-id": 1574402918,
    "event-type": "VariableValueChangeTrigger",
    "new-val": "9",
    "old-val": "11",
    "source": "server",
    "test-val": "10",
    "timestamp": "2025-10-16T13:56:26",
    "var-id": 1177127882
  },
  {
    "change-type": "becomes not equal",
    "change-type-iom": "indigo.kVarChange.BecomesNotEqual",
    "event-indigo-id": 986473566,
    "event-type": "VariableValueChangeTrigger",
    "new-val": "",
    "old-val": "var_becomes_not_equal_to",
    "source": "server",
    "test-val": "var_becomes_not_equal_to",
    "timestamp": "2025-10-16T13:56:28",
    "var-id": 127994353
  },
  {
    "change-type": "becomes true",
    "change-type-iom": "indigo.kVarChange.BecomesTrue",
    "event-indigo-id": 184109916,
    "event-type": "VariableValueChangeTrigger",
    "new-val": "true",
    "old-val": "false",
    "source": "server",
    "timestamp": "2025-10-16T13:56:29",
    "var-id": 836393156
  },
  {
    "change-type": "any change",
    "change-type-iom": "indigo.kVarChange.Changes",
    "event-indigo-id": 127375748,
    "event-type": "VariableValueChangeTrigger",
    "new-val": "2025-10-16T13:56:30.146312",
    "old-val": "",
    "source": "server",
    "timestamp": "2025-10-16T13:56:30",
    "var-id": 908899214
  }
]
```

### Z-Wave
```python
[
  {
    "_comment": "This is an example of the event_data from a Z-Wave command received, all event types except match raw (see below)",
    "event-indigo-id": 886317539,
    "event-plugin-event-id": "zwaveCommand",
    "event-plugin-id": "com.perceptiveautomation.indigoplugin.zwave",
    "event-plugin-name": "Z-Wave",
    "event-type": "PluginEventTrigger",
    "timestamp": "2025-07-25T15:37:14",
    "zwavecmd-device-id": 1191650674,
    "zwavecmd-node-id": 2,
    "zwavecmd-scene-id": 255
  },
  {
    "_comment": "This is an example of the event_data from a Z-Wave command received, Match Raw Packet",
    "event-indigo-id": 572444380,
    "event-plugin-event-id": "zwaveCommand",
    "event-plugin-id": "com.perceptiveautomation.indigoplugin.zwave",
    "event-plugin-name": "Z-Wave",
    "event-type": "PluginEventTrigger",
    "timestamp": "2025-07-25T16:44:40",
    "zwavecmd-node-id": 2,
    "zwavecmd-packet": [
      1,
      9,
      0,
      4,
      0,
      2,
      3,
      38,
      3,
      58,
      242
    ],
    "zwavecmd-packet-str": "01 09 00 04 00 02 03 26 03 3A F2"
  },
  "If you want to get the match string from the trigger, then you can do this:",
  "    trigger_id = event_data['event-indigo-id']  # get the trigger id",
  "    firing_trigger = indigo.triggers[trigger_id]  # get the trigger instance",
  "    zwave_plugin_id = event_data['event-plugin-id']  # get the z-wave plugin id",
  "    zwave_props = firing_trigger.globalProps[zwave_plugin_id]  # get the properties",
  "    match_string = zwave_props['matchBytes']  # get the match string from properties"
]
```
