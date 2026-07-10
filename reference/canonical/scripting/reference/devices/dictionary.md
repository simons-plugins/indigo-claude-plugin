<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/reference/devices/dictionary/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Generating a Dictionary for a device { .ref-head-no-code }

Sometimes, it's useful to get a python dictionary that has all properties and states of a device, perhaps for conversion to JSON to send to some other system. This can easily be done for any device regardless of type:

```text
>>> my_device = indigo.devices[854505717] # "017 - Door/Window Sensor"
>>> python_dict = dict(my_device)
>>> print(json.dumps(python_dict, indent=4, cls=indigo.utils.IndigoJSONEncoder))
{
    "allowOnStateChange": false,
    "protocol": "ZWave",
    "configured": true,
    "states": {
        "onOffState": true,
        "batteryLevel.ui": "100%",
        "batteryLevel": 100
    },
    "subType": "",
    "globalProps": {
        "com.perceptiveautomation.indigoplugin.zwave": {
            "zwEncryptClassCmdMapStr": "- none -",
            "zwConfigVals": {},
            "zwClassInstanceCountMap": {},
            "zwFeatureListStr": "routing, battery, beaming, waking",
            "zwShowWakeIntervalUI": true,
            "zwModelId": 0,
            "zwClassIds": [
                4,
                7,
                1
            ],
            "zwModelName": "Notification Sensor",
            "zwShowDumpDevToLog": false,
            "zwEndpointClassMapStr": "- none -",
            "zwLibType": 3,
            "SupportsBatteryLevel": true,
            "zwShowSubmitModelInfoUI": true,
            "zwEncryptionStatusStr": "Not Supported",
            "zwProtoVersMajor": 4,
            "zwEndpointDevTypeMap": {},
            "userWakeInterval": 60,
            "indigoObjVersion": 10,
            "zwClassInstanceCountMapStr": "- none -",
            "version": "5.01",
            "zwClassCmdMap": {
                "c134": 1,
                "c90": 1,
                "c133": 1,
                "c132": 2,
                "c89": 1,
                "c94": 1,
                "c128": 1,
                "c122": 1,
                "c115": 1,
                "c114": 1,
                "c113": 1,
                "c32": 1
            },
            "SupportsOnState": true,
            "zwClassCmdMapStr": "20v1 80v1 84v2 85v1 86v1 71v1 72v1 73v1 59v1 5Av1 7Av1 5Ev1",
            "userEnergyPollingEnabled": false,
            "zwShowMainUI": true,
            "zwAppVersMinor": 1,
            "userPollInterval": 0,
            "zwDevSubIndex": 0,
            "zwShowManualModifyConfigParmUI": true,
            "zwManufactureName": "Unknown",
            "zwEncryptClassCmdMap": {},
            "address": 17,
            "zwEndpointClassMap": {},
            "zwConfigValsStr": "- none -",
            "zwClassName": "Notification Sensor",
            "zwEndpointDevTypeMapStr": "- none -",
            "zwNodeNeighborsStr": "1, 15, 16",
            "zwModelDefnVers": 0,
            "zwManufactureId": 0,
            "SupportsSensorValue": false,
            "zwAssociationsMap": {
                "g1": [
                    1
                ]
            },
            "zwShowPollingUI": false,
            "zwAssociationsMapStr": "1:[1]",
            "zwShowEnergyPollingUI": false,
            "zwWakeInterval": 60,
            "userPollAfterActivity": true,
            "zwClassCmdBase": 0,
            "zwAppVersMajor": 5,
            "zwProtoVersMinor": 5,
            "zwNodeNeighbors": [
                1,
                15,
                16
            ],
            "userPollingEnabled": true
        }
    },
    "pluginProps": {},
    "lastSuccessfulComm": "2021-11-18T10:56:35",
    "buttonGroupCount": 0,
    "id": 854505717,
    "supportsAllOff": false,
    "errorState": "",
    "remoteDisplay": true,
    "energyAccumBaseTime": null,
    "displayStateValUi": "on",
    "subModel": "",
    "allowSensorValueChange": false,
    "version": "5.01",
    "energyAccumTimeDelta": null,
    "displayStateId": "onOffState",
    "batteryLevel": 100,
    "supportsStatusRequest": true,
    "supportsSensorValue": false,
    "ownerProps": {
        "zwEncryptClassCmdMapStr": "- none -",
        "zwConfigVals": {},
        "zwClassInstanceCountMap": {},
        "zwFeatureListStr": "routing, battery, beaming, waking",
        "zwShowWakeIntervalUI": true,
        "zwModelId": 0,
        "zwClassIds": [
            4,
            7,
            1
        ],
        "zwModelName": "Notification Sensor",
        "zwShowDumpDevToLog": false,
        "zwEndpointClassMapStr": "- none -",
        "zwLibType": 3,
        "SupportsBatteryLevel": true,
        "zwShowSubmitModelInfoUI": true,
        "zwEncryptionStatusStr": "Not Supported",
        "zwProtoVersMajor": 4,
        "zwEndpointDevTypeMap": {},
        "userWakeInterval": 60,
        "indigoObjVersion": 10,
        "zwClassInstanceCountMapStr": "- none -",
        "version": "5.01",
        "zwClassCmdMap": {
            "c134": 1,
            "c90": 1,
            "c133": 1,
            "c132": 2,
            "c89": 1,
            "c94": 1,
            "c128": 1,
            "c122": 1,
            "c115": 1,
            "c114": 1,
            "c113": 1,
            "c32": 1
        },
        "SupportsOnState": true,
        "zwClassCmdMapStr": "20v1 80v1 84v2 85v1 86v1 71v1 72v1 73v1 59v1 5Av1 7Av1 5Ev1",
        "userEnergyPollingEnabled": false,
        "zwShowMainUI": true,
        "zwAppVersMinor": 1,
        "userPollInterval": 0,
        "zwDevSubIndex": 0,
        "zwShowManualModifyConfigParmUI": true,
        "zwManufactureName": "Unknown",
        "zwEncryptClassCmdMap": {},
        "address": 17,
        "zwEndpointClassMap": {},
        "zwConfigValsStr": "- none -",
        "zwClassName": "Notification Sensor",
        "zwEndpointDevTypeMapStr": "- none -",
        "zwNodeNeighborsStr": "1, 15, 16",
        "zwModelDefnVers": 0,
        "zwManufactureId": 0,
        "SupportsSensorValue": false,
        "zwAssociationsMap": {
            "g1": [
                1
            ]
        },
        "zwShowPollingUI": false,
        "zwAssociationsMapStr": "1:[1]",
        "zwShowEnergyPollingUI": false,
        "zwWakeInterval": 60,
        "userPollAfterActivity": true,
        "zwClassCmdBase": 0,
        "zwAppVersMajor": 5,
        "zwProtoVersMinor": 5,
        "zwNodeNeighbors": [
            1,
            15,
            16
        ],
        "userPollingEnabled": true
    },
    "description": "",
    "onState": true,
    "energyAccumTotal": null,
    "address": "17",
    "sharedProps": {},
    "folderId": 1145028206,
    "supportsOnState": true,
    "sensorValue": null,
    "energyCurLevel": null,
    "name": "017 - Door/Window Sensor",
    "lastChanged": "2021-11-18T10:56:35",
    "enabled": true,
    "pluginId": "com.perceptiveautomation.indigoplugin.zwave",
    "deviceTypeId": "zwOnOffSensorType",
    "supportsAllLightsOnOff": false,
    "displayStateImageSel": "SensorOn",
    "displayStateValRaw": true,
    "model": "Notification Sensor"
}
```

This will be a python dictionary with all details about a device. One other feature to note here: by default, Python datetime objects are not serializable by the JSON module (odd oversight we believe). We have included a JSON encoder class that will solve this problem: [`indigo.utils.IndigoJSONEncoder`](../utils.md#indigojsonencoder). Just specify that as the cls parameter to a JSON dump call and any datetime class that's encountered during JSON encoding will be correctly converted to a string in the resulting JSON string:

    json.dumps(python_dict_with_datetime, cls=indigo.utils.JSONDateEncoder)
