<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/reference/xml/pluginconfig/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# PluginConfig.xml { .ref-head-no-code #plugin-config }

We started the discussion of the Indigo XML by describing the `ConfigUI` element that’s present for `Devices`, `Events`, and `Actions`. But, how do you configure your plugin itself? For instance, let’s say your plugin requires a connection to some hardware interface, say something akin to the Insteon PowerLinc interface. How do you specify which serial port that interface is connected to?

The simple answer is that, just as there is a configuration interface for an Insteon hardware adaptor, your plugin has a configuration interface as well. The `PluginConfig.xml` file describes the UI to configure your plugin. The root element in that file is `PluginConfig`, and it contains exactly the same elements that the `ConfigUI` element described above does. Here’s an example:

```xml
<?xml version="1.0"?>
<PluginConfig>
	<SupportURL>http://www.yourdomain.com/plugin/config.html</SupportURL>

	[SNIP - lots of <Field> definitions]

</PluginConfig>
```

The IPH will handle retrieving saved preferences and passing them to your plugin as well as saving changed preferences to disk. Your preferences will be stored in a file in this directory:

`/Library/Application Support/Perceptive Automation/Indigo {{ version }}/Preferences/Plugins/`

and it will be named by using your plugin’s ID (as defined by the `CFBundleIdentifier` in the `Info.plist` file). So, using the example `Info.plist` at the beginning of this doc, the pref file would be named:

`com.yourdomain.plugin.indiPref`

We write each plugin’s preferences into individual files so that it will be easier for you to help your users troubleshoot problems by deleting the prefs and starting over. We also write them into the standard `Preferences` folder so that when you upgrade your plugin -- or we upgrade Indigo -- the preferences won’t get lost.

## Custom HTML Config Dialogs { #custom-html-config-dialogs }

You can also implement your own custom configuration in HTML if you prefer. Rather than adding lots of `<Field>` definitions, you simply specify a `<URL>` element. The URL specified can either be a fully specified URL (protocol://host/path) or it may be a relative URL (/some/relative/path). If it's the latter, then Indigo will attempt to guess the [best base URL](../../../scripting/reference/server-commands.md#get-web-server-url). You would then handle those form requests using [the built-in request handling mechanism discussed below](../plugin-py/http-requests.md#processing-http-requests-in-your-plugin). See the **Example HTTP Responder** plugin in the [SDK](https://github.com/IndigoDomotics/IndigoSDK/releases/tag/v2025.1) for an example.
