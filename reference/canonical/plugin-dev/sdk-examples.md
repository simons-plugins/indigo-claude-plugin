<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/sdk-examples/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# SDK Example Plugins

The [Indigo SDK](https://github.com/IndigoDomotics/IndigoSDK/releases) ships a set of fully working example plugins with complete XML and Python source. They're the recommended starting point for new plugins — find the example closest to what you're building and modify it. Several are also installed with Indigo itself (look in the Plugins menu under the disabled plugins list).

## Custom Device Plugin { #example-custom-device }

Illustrates how a plugin can create custom Indigo devices which, like native devices, have states, triggers, actions, and UI.

## Relay/Dimmer Device Plugin { #example-relay-dimmer }

Creates Indigo devices which inherit basic relay and dimmer states, triggers, actions, and UI — and shows how to add additional device states and actions on top.

## Sensor Device Plugin { #example-sensor }

Creates devices which inherit basic sensor states, triggers, actions, and UI, plus plugin-defined states and actions.

## Energy Meter Device Plugin { #example-energy-meter }

Creates devices which inherit energy meter states (watts, kWh), triggers, actions, and UI.

## Speed Control Device Plugin { #example-speed-control }

Creates speed-control devices (for example, ceiling fans) with inherited speed states, triggers, actions, and UI.

## Sprinkler Device Plugin { #example-sprinkler }

Creates sprinkler controller devices with inherited zone-control states, triggers, actions, and UI.

## Insteon/X10 Listener Plugin { #example-insteon-x10-listener }

Shows how a plugin can subscribe to receive callbacks whenever an Insteon or X10 command is received or sent by Indigo.

## Database Traverse Plugin { #example-db-traverse }

Shows how to traverse the [Indigo Object Model](../scripting/iom-concepts.md) to enumerate all devices, triggers, schedules, and other objects.

## Twisted Telnet Server Plugin { #example-twisted-telnet }

Shows how a plugin can use the Python [Twisted event framework](https://twistedmatrix.com). The example runs a small telnet server that can flash devices on/off; once enabled, connect from Terminal with:

```bash
telnet 127.0.0.1 9176
```

## More examples in the SDK

The SDK repository also includes examples not documented here — device factories, thermostat devices, action APIs, an HTTP responder, broadcaster/subscriber patterns, variable-change and Z-Wave listeners — plus the *Updating to API version 3.0 (Python 3)* migration guide. Browse the [SDK on GitHub](https://github.com/IndigoDomotics/IndigoSDK) for the full set.
