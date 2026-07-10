<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugins/alexa/migrating/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Migrating from the Alexa Hue Bridge plugin
If you are using the Alexa-Hue Bridge plugin, you will definitely want to read through this section.

We know there are users that have relied on the Alexa-Hue Bridge plugin even though it requires Echo hardware that is no longer available. It was a great stop-gap, and we really appreciate everyone who contributed to maintaining it through the years, particularly forum user @Autolog.

If you are migrating, we highly recommend that you do a full switch rather than try to use both while switching. While it's possible to use both, doing a full switch will help you avoid a variety of issues, including Alexa caching, device name conflicts, etc.

## Full Switch
Doing a full switch is pretty simple, just follow these steps:

1. Disable the Alexa-Hue Bridge plugin.
1. In the [Alexa website](https://alexa.amazon.com/spa/index.html#appliances), remove all devices. The simplest way is to click the `Remove All` button at the bottom. Note, if you are using other smart home skills, using that button will also cause those devices to be forgotten, so when you do a discover later you'll need to perform any steps needed to make discover work on for that skill.
1. In Indigo, follow the directions above in the [Making a Device Available in Alexa](../alexa/smart-home-skill.md#making-a-device-available-in-alexa) to publish your devices.
1. Once you have all your devices published, you can confirm that they are all published by selecting the `Plugins->Alexa->Show Device Publications` menu item and it will print the list of publications in the Event Log window.
1. In the Alexa app, website, or using an Alexa enabled device, click/touch the Discover button or say "discover devices".

This should make all of your devices available in Alexa. Whenever you ask an Alexa device to discover, you will see the following Event Log line followed by a summary of publications:

`Alexa                           Alexa discovery request received, assembling reply...`

### Partial Switch
If you want to attempt to switch one at a time, the process is more complicated and somewhat error-prone. The general process is:

1. Disable the device from the Alexa-Hue Bridge plugin (see [the docs for the plugin](https://github.com/IndigoDomotics/alexa-hue-bridge/wiki) for details). This is very critical in order to avoid complications/confusion later.
1. In the [Alexa website](https://alexa.amazon.com/spa/index.html#appliances), remove that specific device.
1. In Indigo, follow the directions above in the [Making a Device Available in Alexa](../alexa/smart-home-skill.md#making-a-device-available-in-alexa) to publish your device. Be sure to confirm/select the appropriate subtype.
1. In the Alexa app, website, or using an Alexa enabled device, click/touch the Discover button or say "discover devices".

Hopefully, Alexa will find your device and it will work properly. Unfortunately, sometimes that doesn't work. We believe that there are some caching issues within the Alexa environment where removing a device doesn't fully remove a device. If you experience this, you may need to remove the device again and wait a while before rerunning discovery. It may even require that you disable the Alexa plugin, rerun discovery, then enabling the Alexa plugin, and running discovery again. We haven't been able to find the silver bullet for this so it's a bit of trial and error.
