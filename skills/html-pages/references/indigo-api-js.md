# indigo-api.js V1 Reference

Client-side JavaScript library for Indigo REST API access from HTML pages.

## Loading

```html
<script src="../js/indigo-api.js"></script>
```

The library reads credentials from `window.INDIGO_CONFIG` (injected by the Domio iOS app) or from `?api-key=` URL query parameter (browser testing fallback).

## API

### Constructor

```javascript
const indigo = new IndigoAPI();        // auto-reads INDIGO_CONFIG
const indigo = new IndigoAPI(config);  // manual config: { baseURL, apiKey }
```

### Configuration Check

```javascript
IndigoAPI.isConfigured()  // → boolean
```

### Devices

```javascript
await indigo.getDevices()              // → Device[]
await indigo.getDevice(id)             // → Device
await indigo.turnOn(id)                // → void
await indigo.turnOff(id)               // → void
await indigo.toggle(id)                // → void
await indigo.setBrightness(id, 75)     // 0-100 → void
await indigo.setHeatSetpoint(id, 21)   // → void
await indigo.setCoolSetpoint(id, 24)   // → void
```

### Action Groups

```javascript
await indigo.getActionGroups()         // → ActionGroup[]
await indigo.executeActionGroup(id)    // → void
```

### Variables

```javascript
await indigo.getVariables()            // → Variable[]
await indigo.getVariable(id)           // → Variable
```

### Reactive Polling

```javascript
// Observe a single device (calls back on change)
const watcher = indigo.observe(deviceId, device => {
    updateDeviceUI(device);
}, 5000);  // poll interval in ms

// Observe all devices
const watcher = indigo.observeAll(devices => {
    renderDashboard(devices);
}, 5000);

watcher.stop();  // cleanup
```

### Error Handling

```javascript
indigo.onError(err => console.error(err));
indigo.onAuthFailure(err => showAuthError());
```

All methods reject with `IndigoAPIError` which has `.status` (HTTP code, 0 for network errors) and `.message`.

If `INDIGO_CONFIG` is missing, the library shows a visible red error banner automatically.

## Device Properties

Key fields on device objects returned by the Indigo REST API:

| Property | Type | Notes |
|----------|------|-------|
| `id` | number | Unique device ID |
| `name` | string | Display name |
| `class` | string | `"indigo.RelayDevice"`, `"indigo.DimmerDevice"`, `"indigo.ThermostatDevice"`, `"indigo.SensorDevice"` |
| `onState` | boolean | On/off state |
| `brightness` | number | 0-100, dimmers only |
| `hvacMode` | string | `"heat"`, `"cool"`, `"auto"`, `"off"` — thermostats only |
| `setpointHeat` | number | Heat setpoint — thermostats only |
| `setpointCool` | number | Cool setpoint — thermostats only |
| `sensorValue` | number | Current reading — sensors only |

## Command Transport

All commands are sent via `POST /v2/api/command` with JSON body:

```json
{
  "message": "indigo.device.toggle",
  "objectId": 123456789,
  "parameters": { "value": 50 }
}
```

Refer to `/indigo:api` skill documentation (`docs/api/device-commands.md`) for the full command reference.
