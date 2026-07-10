<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugins/alexa/troubleshooting/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Alexa Troubleshooting
Because this integration is made up of a variety of parts, and because Alexa itself can talk to multiple smart home skills as well as allow the definition of custom "routines", there are a variety of places where things can go wrong. This section will hopefully cover many of those scenarios.

If you don't find an answer to your problem in this section, post a detailed description of your issue and the steps you have taken (and any relevant Event Log entries) to the [Alexa plugin support forum](https://forums.indigodomo.com/viewforum.php?f=359).

## Device Caching
The first and foremost issue that users experience with Alexa, device discovery and device changes, is that Amazon caches device definitions, and any changes (additions, changes, deletions) may take minutes to complete. Sometimes the changes don't propagate throughout their various caches at all.

So, when making any changes, it's always a good idea to wait for maybe 10 minutes between any changes that you make. For instance, if you change the name of a device, run discovery as advised below, but wait for 10 minutes before looking for the change in the Alexa app or trying to control the device using the new name.

Usually, when adding a new device, it happens pretty quickly. However, not always, and especially if it's combined with a change in another device. This seems not only to slowly propagate the change, but also slow the addition of a new device.

If you want to delete a device (or all devices to start over), this seems to be the most problematic scenario for their caching scheme. You will want to wait 10 minutes to make sure that the deletion actually occurs before doing anything else. Users have reported that doing a Remove All from the Alexa website will continually fail and that the way to accomplish it is to delete a few at a time. While we haven't confirmed this behavior, it would not surprise us given all the caching issues we've experienced and read about.

## Account Linking Issues
When you enable the Indigo Smart Home Skill in the Alexa app, you're required to link it to a [license in your Indigo Account](https://www.indigodomo.com/account/codes). You'll automatically be forwarded to the login page for your Indigo Account: log in using your normal credentials. You will then be forwarded to the skill authorization page which will have a popup that contains all of your licenses. Most users will only have a single license, but some will have multiple. You can only control a single Indigo Server from any given Alexa account.

If you see an error page saying that you don't have any available licenses, this could be a result of a couple of things:

1. You have previously linked your license to Alexa but haven't revoked it on the [Authorizations page in your Indigo Account](https://www.indigodomo.com/account/authorizations). This may happen if you disable the Indigo Skill then attempt to re-enable it. Click on the Revoke button next to the Alexa authorization for your license to revoke the authorization then try linking again.
1. Your Indigo Up-to-Date subscription has expired. To use Alexa (and similar types of integrations), you need to have an active Indigo Up-to-Date subscription and your reflector must be active.
1. Your Indigo License doesn't have an active/working Indigo Reflector (included with your UTD subscription).  To use Alexa (and similar types of integrations), you need to have an active Indigo Up-to-Date subscription and [your reflector must be active](https://www.indigodomo.com/docs/reflectors).
1. You may also see this error if Alexa has had some issue talking to your Indigo Server. We don't know exactly why this happens, but the solution is the same as #1 above - revoke and relink and it should continue working. If you have repeated link failures, check to see if your internet connection has had any periodic issues as this can cause Alexa to forget about its link authentication. Also, if you have more than around 50 devices publishes, this seems to exacerbate the problem. We recommend that you keep the number of devices published to a smaller reasonable number that really need voice control.

## Changing a Published Device in Indigo
### Changing the Indigo Name
If you specified an alternate name for a device when publishing it, then changing the Indigo name won't make any difference, and you won't need to do anything.

If, however, you didn't specify an alternate name, then Indigo will use the Indigo device name. If you change it, then you will need to rerun discovery in the Alexa app or on an Alexa-enabled device. If discovering by voice command, Alexa will say that it couldn't find any new devices (which is technically correct), but the device will now respond to the new name.

If it doesn't then the most likely scenario is that the new name conflicts with another device Alexa knows about. Check the list of devices in the Alexa app to ensure that there isn't a duplicate name. Also, when you check the list, make sure that the old device name is no longer in the list. If it is, confirm that you changed the name (and that you didn't specify an alternate name) then rerun discovery.

Also, remember our discussion of device caches above: give Alexa at least 10 minutes for changes to propagate throughout their device caches.

If you've made a change and waited, and it's still not responding, one other possibility is that you have a routine defined in Alexa with the name or a similar name - that may cause conflicts when Alexa attempts to determine what it is you're asking.

### Changing the Alternate (Alexa) Name
If you change the alternate name, you will need to rerun discovery. If the new name doesn't work, try the troubleshooting tips in the [Changing the Indigo Name](../alexa/troubleshooting.md#changing-the-indigo-name) section just above this one.

### Changing the Device Type
If you edit a device and change the type, protocol, or anything that changes the nature of the device, you will most likely want to follow this procedure:

1. In the Alexa app, remove the device.
1. Go back to the [Publication Dialog](../alexa/smart-home-skill.md#making-a-device-available-in-alexa), select the device, and make sure that you are satisfied with the subtype (or change it as necessary).
1. Save any changes.
1. Rerun discovery in Alexa.

It should say that it has found a new device (since you deleted it first) and you should now be able to control it based on the new type. Note that changing protocol might not require the process above (an Indigo dimmer device works the same no matter the protocol), but we have found that Alexa caches information about devices and just doing a discover after changing may not be enough to force Alexa to reset the device cache.

## General Issues
Alexa uses some sophisticated caching mechanisms throughout their hosted systems in order to optimize performance/responsiveness. Unfortunately, sometimes that caching mechanism can lead to odd and misleading issues. Sometimes when you make changes (initial publishing, updating, removing publications) it can take a while for the change to propagate throughout their systems. The Indigo skill, which is hosted by Amazon (a requirement), does no caching of devices. The Alexa plugin does some local caching, but that has nothing to do with how Alexa interprets what you say and converts it into the command it sends to the plugin.

The very first thing you want to check when troubleshooting any Alexa issues is the Event Log window. You will see various warnings and errors that will help you determine if there are issues. Those errors may help you to determine where to go next. First, ensure the following:

1. Make sure that you have [enabled the Indigo Skill and linked it to your Indigo Account & license](smart-home-skill.md) successfully
1. Make sure that your [Indigo Up-to-Date subscription is active](https://www.indigodomo.com/account/codes/).
1. Ensure that your Indigo Reflector is configured and connected. Check this by hitting your reflector URL in a browser: https://YOURREFLECTORNAME.indigodomo.net/

Here are a few things to help you diagnose issues.

### Alexa can't find a device

1. Make sure that you have [enabled the Indigo Skill and linked it to your Indigo Account](smart-home-skill.md) & license successfully
1. Watch the Event Log window for [discovery requests](../alexa/operations.md#discovery-requests-from-alexa)
    - If you don't see any discovery requests:
        - Make sure that your reflector is up and running
        - Make sure your Indigo Up-to-Date subscription hasn't lapsed
        - Make sure you have OAuth enabled in the [Start Local Server dialog](../../user/getting-started/installation.md#starting-indigo-server)

    - If you see a discovery request:
        - Make sure that the device you are publishing is in the list. Take note of the names of your published devices to ensure that they are unique - if you publish two devices with the same name Alexa will ignore or both of them.
        - If the above step is fine, then make sure that you aren't using a name that's used by a device in some other smart home skill (some users use the Hue skill to directly control Hue lights, if you have the Alexa-Hue Bridge plugin enabled that may also be publishing a device with the same name).
        - Make sure that you are giving Alexa enough time to update its caches - 10 minutes after a discovery is the recommended wait time.
    - If you have a slow or unreliable internet connection, Alexa can time out a request rather quickly and will speak some error message. If you see inconsistent behavior, this may be a hint that there is some kind of internet connection issue between the Alexa hosted servers and your Indigo Server (see below for more details).

### Alexa can't control a device
Some steps to try when Alexa says it can't find a device:

1. Make sure you are clearly saying the device name. Alexa can sometimes hear something slightly different than what you're saying.
1. Make sure you have the device published in the plugin. You can do this by selecting the `Plugins->Alexa->Show Device Publications` menu item. Verify that you are saying the name that is published to Alexa if it's different than the name of the device in Indigo.
1. Rerun discovery from the Alexa app for an Alexa device.
1. Look in the Event Log window for errors when trying to control the device.

### Alexa can't speak a variable value
Some steps to try when Alexa has a problem speaking the value of a variable:

1. Make sure that the value doesn't contain any [SSML markup](https://developer.amazon.com/en-US/docs/alexa/custom-skills/speech-synthesis-markup-language-ssml-reference.html) symbols by themselves, like <, >, /, etc. Alexa will just throw a very unhelpful error (*"Sorry, I'm having trouble accessing your Indigo Skills skill right now"*) when it thinks that the string contains malformed SSML.
1. Make sure that the value of the variable is less than 8000 characters - that's the speech output limit for Alexa.

### Alexa can't speak the variable list
Some steps to try when Alexa has a problem speaking the variable list:

1. If you have too many variables, you may get the error *“There is a problem with the requested skill response”*. The issue is that the speech output sent to Alexa can't be longer than 8000 characters, so if you have a lot of variables or lots of variables with long names you may run into this situation. The next release of the plugin will only speak variables that have the "Remote Display" flag set for them, so you will be able to exclude variables using that mechanism without deleting them.

### Alexa can't speak the variable of a variable
If the value of your variable contains an ampersand (&) or perhaps other special characters, you should replace them with the actual english word (and). Alternately, you can probably HTML encode the character as well (&amp;).

### Alexa says there are issues when you try various things
Alexa skills are hosted on their servers, and must communicate with your Indigo server through your reflector. If you have a poor internet connection, you may see some odd issues: not being able to discover, errors when you ask Indigo for things even though it appears on the Indigo side that they have happened, etc. Their API is very picky about response times, as slow response times is a poor user experience. This does mean, however, that anyone with slow connections (Satellite) or unreliable internet connections will experience various error messages from Alexa. Unfortunately, there is nothing we can do about this issue.

### If All Else Fails =
If every other troubleshooting step has been taken, and you have multiple Indigo licenses, contact support (mentioning that you have multiple licenses) so we can more quickly determine if this is related to your problem.
