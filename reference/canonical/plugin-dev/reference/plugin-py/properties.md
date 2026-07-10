<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/reference/plugin-py/properties/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Properties

The base plugin provides some properties that are specific to a plugin instance.

| Property                                      | Value Type | Notes                                                                                                                                                                                         |
|-----------------------------------------------|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="nw cb">`pluginFolderPath`</span> | string     | The return value is the full path to the plugin. This is useful if you need to construct a full path to a file somewhere in the plugin's hierarchy, perhaps to have IWS stream the file back. |
| <span class="nw cb">`pluginSupportURL`</span> | string     | The return value is URL that's specified in the plugin's Info.plist.                                                                                                                          |
