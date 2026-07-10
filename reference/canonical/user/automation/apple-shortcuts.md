<!-- GENERATED from https://docs.indigodomo.com/2025.2/user/automation/apple-shortcuts/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Using Apple Shortcuts with Indigo

!!! abstract "In this guide"
    How to use Apple Shortcuts with Indigo's HTTP API to control devices, run action groups, and query status from iOS, iPadOS, and macOS. Covers API key setup, building GET and POST shortcut actions, using the Indigo Reflector for remote access, and a known compatibility issue with macOS Sonoma 14.7.5.

Apple's Shortcuts application allows you to create custom workflows on macOS, iOS and iPadOS (you can't currently run shortcuts on tvOS). You can also use Apple Shortcuts with Indigo to call many functions and use Indigo events to fire Apple shortcuts. Using Indigo's [HTTP API](../../api/http.md) with Apple's Shortcuts app is easy and there are different methods to accomplish this (this document uses Indigo's v2 API).

!!! warning
    Unfortunately, it looks like [Apple broke the shortcuts command line tool](https://discussions.apple.com/thread/256038658?sortBy=rank) (which we use to run shortcuts) in Sonoma 14.7.5. If you rely on shortcuts in Indigo you'll probably want to skip that release. We tested on Sequoia 15.3.1 and it works correctly.

If you'd like to ask questions or share your Shortcuts success stories with others, use the [Apple Shortcuts Forum](https://forums.indigodomo.com/viewforum.php?f=298)

* The shortcuts app for macOS is only available for Monterey (12.x) and newer versions. It has been available for iOS and iPadOS since version 12.

## Obtaining an API Key
In order to use authorization keys as used in the following examples, you'll need an active Indigo Up-To-Date subscription and an activated reflector.

1. Log into [your Indigo account](https://www.indigodomo.com/account/authorizations)'s Authorizations Page.
1. Go to `Add an API Key`.
1. Select the Server that you want to use to accept the key.
1. Click on the `Add API Key` button.

!!! important
    in order to use API Key authentication, you MUST have enabled *`Enable OAuth and API Key authentication`* in the Indigo ["Start Local Server"](../getting-started/installation.md#starting-indigo-server) dialog box.</span>

## Building Your First Shortcut
Building your shortcut in the Shortcuts app is largely the same whether you do it on macOS or iOS, and -- depending on the type of activity you want to initiate -- only takes a couple of steps. The information you'll need depends on what you want to do, but all the API events are constructed in the same way. For this example, we'll use the macOS Shortcuts App to build our shortcut (you can also do it on iOS and iPadOS). At first, this looks like a lot of steps, but there's actually only a few pieces of information required. **All values below are entered without quotes.** For our first example, we'll perform a simple Indigo Device Toggle.

You'll need:

- The base URL: `https://MY-REFLECTOR-NAME.indigodomo.net/v2/api/command/` (replace `MY-REFLECTOR-NAME` with the name of your active reflector),
- Your authentication key: `c2xr7q35-9385-10f9-3652-12z765j99vnv` (replace with your valid key. This one is fake.),
- The command you want to execute -- such as: `indigo.device.toggle`,
- The Indigo ID of the device (or action, or variable, etc.) you want the command to apply to: `123456`, and
- Any parameters you want to include (some are optional, some are required.)

### The Steps

1. New shortcut (`+` at the top)
1. In the search box on the right side, type "Get Contents of URL".
1. Drag (or double-click) the action to add it to the editor.
1. Click on the `URL` field and enter the base URL above. If using an external IP address or reflector make sure to use `https:` and not just `http:`.
1. Click on "Show More".
1. Select Method: `Post`.
1. Expand the Headers section by clicking on the `>`.
1. Within the Headers section, click the `+`.
1. Under Key: `Authorization`.
1. Under Value: `Bearer 2x7a35-9385-10f9-3652-12765:99vnv`.  (The word `Bearer`, one space and then your API key.)
1. Make sure that `Request Body` is set to `JSON`.
1. Within the Request Body section, click the `+`.
1. Under Key: `message` (make sure the `Type` is set to `Text`).
1. Under Value: `indigo.device.toggle`.
1. Within the Request Body section, click the `+`.
1. Under Key: `objectId`.
1. Under Value: `123456` (your device ID, make sure the `Type` is set to `Number`.)

At the top of the Shortcut editor window, you can change "Get Contents of URL" to something descriptive like "Toggle Living Room Lamp". Likewise, you can click on the icon to customize it to your taste.  Finally, if you'd like, you can add the Shortcut to your dock (or home screen on iOS), a shortcuts widget, or simply fire them from within the Shortcuts app.

![Shortcuts Get Contents of URL Image](../../images/screenshot_2023-02-24_at_12.31.40_pm.png)

Once you've built and tested your first Shortcut, it's easy to duplicate and edit additional shortcuts. All HTTP API commands should work in a similar way.

### Optional Parameters
In order to add parameters to the command (for those calls that take parameters -- not all commands do), you include those as a dictionary attached to the command payload like this:

!!! note
    "optional" here refers to our toggle device example. For other API commands, parameters may be required.

![Shortcuts Get Contents of URL Optional Parameters Image](../../images/screenshot_2023-02-08_at_4.17.30_pm.png)

Of course, you can add additional Shortcuts Apps and Actions to the workflow as needed.

## Action Group Shortcuts
There is currently only one API command for Action Groups -- `indigo.actionGroup.execute` -- which requires two payload elements:

- The command: `indigo.actionGroup.execute` (Text)
- The Action ID: 123456  (Number)

![Action Groups Shortcuts Image](../../images/screenshot_2023-02-08_at_10.36.32_pm.png)

## Variable Shortcuts
### Get a Variable Value
This example shows how to obtain a variable's value and do something with it -- in this case, speak the value aloud. The action you take in your shortcut could be any number of things.

![Get a Variable Value Image](../../images/screenshot_2023-02-22_at_5.18.39_pm.png)

- You can get an individual variable object by referencing its Indigo ID directly `%%https://MY-REFLECTOR-NAME.indigodomo.net/v2/api/indigo.variables/MY-VAR-ID%%` where you replace `MY-REFLECTOR-NAME` with your active reflector name and `MY-VAR-ID` with your variable's ID.

- The "trick" to getting the variable's value into the `speak` action is to tell your shortcut what kind of data it is. To do this, click on `Get Contents of URL` **in the speak action**, set the data type to `Dictionary`, and set `Get Value for Key` to `value` (be sure to hit return or tab to get the setting `value` to stick.)

![Get Contents of URL Image](../../images/screenshot_2023-02-22_at_5.19.04_pm.png)

### Update a Variable Value
There is currently only one API command for Variables -- `indigo.variable.updateValue` -- which requires three payload elements:

- The command: `indigo.variable.updateValue` (Text)
- The Action ID: 123456  (Number)
- A parameters dictionary that has one key/value pair (required):
    - `key`: value,
    - the new variable value <span class="dw-color-red">which must be set to Text</span> because all Indigo variable values are stored as text.

![Update Variable Value JSON Image](../../images/screenshot_2023-02-13_at_6.55.07_am.png)

### Variable Value as a Conditional
You can include conditions in your shortcuts and take action -- or not -- based on the condition. For example, turn on a light -- but only if it's dark outside.

![Variable Value as a Conditional Image](../../images/screenshot_2023-02-22_at_5.44.27_pm.png)

- As with the other examples, set up your `Get Contents of URL` action to get a variable's value -- in this example, the built-in variable `isDaylight`,
- Take the returned dictionary and extract the value of the `isDaylight` variable in a `Text` action,
- Add an `If` condition and, if the Text value is equal to `false` (Indigo variable values are always strings/text) then run your next shortcut action. Alternatively, you could send another command directly to the Indigo server (which is essentially what your linked shortcut is doing).
- If the Text value is not `false`, the `Otherwise` action will be executed.

## Running an External Python Script
In most instances, it's recommended that you use Indigo's built in script actions, such as: [Execute Script](../concepts/actions.md#script-and-file-actions), [Run Shell Script](../concepts/actions.md#script-and-file-actions), and [Run Apple Shortcut](../concepts/actions.md#run-apple-shortcut). In some instances, however, you might want to use a shortcut to run a script outside the Indigo environment. Luckily, this is easy using Apple's Shortcuts ***Run Shell Script*** action.

The example below prompts the user for text, passes the text to the script, receives the script's output, and sends that output to a macOS notification. This very basic example is simply to show how to pass input to your script and pass the script's output on to other steps. Note the use of *`sys.argv[1]`*. This statement is reading the second argument passed to the script (the first argument is its source--the shortcut itself--which we won't need). The second argument -- *`sys.argv[1]`* -- is passed as a string, and that's the bit we need. You'll need to account for whatever format your inputs and outputs turn out to be. These are the two most important settings to this example:

1. Shell: *`Python 3`*
1. Pass Input: *`as arguments`*

![Apple Shortcut Run Shell Script Image](../../images/apple_shortcut_run_shell_script.png)

The rest is up to you.

!!! note
    The Run Shell Script action is not supported on iOS or tvOS.

## Using Your Shortcuts
How you use your shortcuts is a matter of taste -- and you can always run them from the shortcuts app -- but here are a few other suggestions to get you started:

- Save shortcuts to your Home Screen in iOS (using the Share menu),
- Using a Shortcuts Widget,
- Create a folder of your shortcuts on iOS to mimic a widget,
- Add shortcuts to the Dock in macOS (File menu),
- Using Siri: "Hey Siri -- Living Room Lamp" (name of the shortcut).

### Location Based Shortcuts
You can run location-based shortcuts too, but they require "additional" steps and at least part of the automation must be built on an iPhone or iPad. There are several options to choose from, including:

- Time of Day,
- Alarm,
- Sleep,
- Arrive,
- Leave,
- Before I Commute, and
- and many others.

Location-based shortcuts are not currently available in macOS (so you'll need to set up the location control piece on iPhone or iPad). The `Leave` and `Arrive` shortcuts **cannot** be run automatically. They require confirmation each time they are run. There is currently no way to turn this requirement off.

!!! tip
    Using the Indigo Reflector service is recommended (the URL you use for a location-based shortcut can't be one that only works on your local network.)

1. Review your automation.

1. Create the shortcut using the steps outlined above using macOS or iOS. For example, you could update a variable value set to `Home` or `Away`.
1. In the Shortcuts app for iOS (or iPadOS), select `Automations` from the tab at the bottom.
1. Click the `+` at the top.
1. Choose "Create Personal Automation".
1. Choose `Arrive` or `Leave`.
1. On the Location setting, select `Choose`.
1. Select "Current Location" or whatever location you choose, then select `Done`. You can also adjust the range of the trigger in the bottom map panel (the minimum range is about 100 meters or 328 feet).
1. Select `Next`.
1. Search for and select "Run Shortcut".
1. Next to "Run", tap the word `Shortcut` and select the shortcut you created in step 1. Add any next actions as needed (not covered in this example).
1. Select `Done`

Now, your iPhone (or iPad) should run your shortcut when you Arrive/Leave that location.

If you don't like the requirement to confirm the shortcut each time, there are other apps that allow for URL calls to be fired based on location.

## Firing Shortcuts From Indigo
Using shortcuts to make Indigo *do something* is an awesome feature. But you can also use Indigo to run your shortcuts as well.

### Run from Indigo Action
The easiest way to run a shortcut is via an Indigo Action. Create a new Action and select `*Server Actions*` > `*Run Apple Script*`. You can optionally add text as input to the shortcut if you wish; otherwise, leave the Shortcut Input field blank.

![Run Shortcut Action Image](../../images/run_shortcut_action_2023_1.png)

### Run from the Command Line
When calling a shortcut from the "Run Shell Script" action, it's best to use the full path to the target: `%%/usr/bin/shortcuts%%` to make sure Indigo can find it.

![Firing Shortcuts From Indigo Image](../../images/screenshot_2023-02-16_at_12.44.05_pm-2.png)

This specific approach requires the shortcut to be accessible by the Indigo server machine. If you don't have access to your shortcuts on the server, there are other ways to do this such as using Indigo to send a text message and linking the shortcut to Messages. Note that the Run Shell Script action doesn't support pipes, so if you want to send data to the shortcut, read on.

### Run Shell Script Action
Sometimes, you may want to pass information to your shortcut from Indigo. For example, you can have Indigo fire a Notification on the server machine that includes real-time information. In this example, Indigo is asking the shortcut to run, and then the shortcut requests the pertinent data through the HTTP API.

1. Run the shortcut using a Run Shell Script Action.
1. Configure the shortcut to request the text value from Indigo using the appropriate API method outlined above.

![Run Shell Script Action Image](../../images/screenshot_2023-02-16_at_10.58.59_am.png)

### Run Python Script Action
If you'd like to avoid the round trip of the example above, you can pass data directly to a shortcut using a simple Python script. In this example, we'll use Indigo's built-in Run Embedded Script action (the script should take less than 10 seconds to complete; otherwise, use a linked script to avoid the time limitation). The following example is the bare minimum required to use this approach.

#### os.system()
```python
import os

val = indigo.variables[123456].value  # The value to pass. In this case, a variable value.
os.system(f'/usr/bin/shortcuts run "Post Event to Calendar" <<< \"{val}\"')  # Will return 0 on success; 256 on error.
```
Note the escaped double-quotes for the shortcut payload. These are important to ensure that payloads with embedded spaces are sent as an encapsulated string object. For more information on the *`os.system()`* Python command, take a look at the [official docs](https://docs.python.org/3/library/os.html#os.system).

**Apple Shortcut**

- Get Text From - Shortcut Input
- Calendar - Add New Event

![Post Event to Calendar Image](../../images/screenshot_2023-03-13_at_6.56.59_pm.png)

#### subprocess.run()
When using the *`os.system()`* command, the function returns a 16-bit value (*`0`* on success / *`256`* on error) to let you know if the command was successful. If you'd like to get a value back to Indigo after running the shortcut, one way is to use the more robust *`subprocess.run()`* function. This function supports a **bytes object** return for more elaborate scripting capabilities. Here is an example of a call using the *`subprocess.run()`* function:

```python
import subprocess
result = subprocess.run(['/usr/bin/shortcuts', 'run', 'My Shortcut'], input=b"Input Text", check=True, capture_output=True).stdout  # 'result' is a bytes object.
```
Notice that the input is also a bytes object and will need to be decoded to use it. With this command, the shortcut will receive *`b"Input Text"`* as input, and anything returned by the shortcut will be stored in the *`result`* variable. If the call is unsuccessful, subprocess will throw the relevant error trace.

This type of call would be useful for things like getting a list of upcoming appointments or reminders. For example, you could send the number of appointments you want in the *`subprocess`* call and get the appointment details back in the result.

### External Shell Scripts
You can also accomplish the same result using a shell script.

1. Create your Notification shortcut named "Test Alert":
1. Create a new shortcut and add the "Show Notification" action.
1. For `Attachment`, select "Shortcut Input".
1. Double-click "Shortcut Input" and select Type: `Text`

It should look something like this:

![External Shell Scripts Image](../../images/screenshot_2023-02-16_at_10.40.56_am.png)

Using a plain text editor, create a new file called `script1.sh` (or whatever), enter the following text, and save it.

```bash
#!/bin/bash

# Note that redirects such as `pipe` aren't supported in the Indigo Run Shell
# Script dialog and will require a script file method.

echo "$1" | /usr/bin/shortcuts run "Test Alert"
```

We need to make our script executable, so in Terminal, head to the folder where your script is saved and type:
`chmod +x script1.sh` and hit return. Now we can run our shell script from Indigo.

1. Under Actions, create a new Action (or add a new Action to an existing Action Group).
1. Select Type: `Run Shell Script`.
1. Select `Edit Action Settings`.
1. Enter the full path to your script and the custom message you want to send:  `/Users/username/Temp/script1.sh "Hello world."` replacing `/Users/username/Temp/` with the path to your script.
1. If you like, you can elect to have the result saved to an Indigo Variable (optional).
1. Select `Save`, and then `OK`.

From within Indigo, execute your action. The custom message you sent (in this example, "Hello world.") will be sent to the script and will appear in the resulting notification.

![Run Shell Script Action Image](../../images/screenshot_2023-02-16_at_10.58.59_am.png)

You probably want to send something more interesting than `Hello world.`, for example the value of some variable. We can do this using Indigo's substitutions feature.

`/Users/username/Temp/script1.sh "%%v:568909175%%"`

Notice the quotes around the substitution. If you don't enclose the substitution in quotes, you'll get the variable text value only up to the first space. Quotes will ensure the whole value is sent.

![Test Alert Image](../../images/screenshot_2023-02-16_at_11.09.20_am.png)

The opportunities here are only limited by the boundaries of the Shortcuts app. For example, you could add the value of a variable to your Calendar or send the value to a text message.

## Firing Your Shortcuts with Siri
Of course, you can have Siri run your shortcut by saying the name of the shortcut you want to run. To run the `Toggle Living Room Lamp` shortcut, say, "Hey Siri. Toggle Living Room Lamp". However, once you begin to have a lot of shortcuts, it can be tough to remember the exact name of every shortcut in your collection. One thing that can help is to create multiple shortcuts with similar names that all point to the same "original" shortcut. That way, if you make a change to the original shortcut, you don't need to change the others (if you change the name of the original shortcut, the Shortcuts app will update the others).

| Siri Phrase          | Action taken                          |
|----------------------|---------------------------------------|
| "Party Time"         | sets lights, temperature, tv, whatever |
| "Let's Party"        | Runs Party Time shortcut              |
| "It's Party Time"    | Runs Party Time shortcut              |
| "I'm Having a Party" | Runs Party Time shortcut              |


![Firing Your Shortcuts With Siri Image](../../images/screenshot_2023-02-18_at_7.46.27_pm.png)

## Ideas
### Calendar

- Create a separate calendar called "Indigo Events" to track events over time.
- Add weather information to your Calendar.

### Clock

- Create an alarm on your phone.

### Home

- Use Indigo to trigger events with your HomeKit devices.
- Use HomeKit to trigger events with your Indigo server.

### Messages

- Send messages with important information about your Indigo server.
- Trigger your Indigo server by texting a phrase.

## Tips
These tips can help make using shortcuts to control Indigo easier:

- If you save your shortcuts to the Home Screen in iOS, be sure you're happy with the look of the icons before you add a bunch of them. Changes you make to the icons later in the Shortcuts app won't update home screen bookmarks automatically (they will change automatically in widgets).
- Put your most commonly used shortcuts first because widgets only display a few at a time.
- You can create shortcuts in the iOS app, but it is **much easier** to create them in macOS.
- With location-based automations, some (but not all) notifications can be silenced. When available, you will see a toggle for "Ask Before Running". If you set this to `off`, a new toggle will appear that says, "Notify When Run". If this is also set to `off`, then notifications for this automation will not be sent. Presently, there is no global setting to turn off all automation notifications.
- Create folders in the shortcuts app that mimic the folders in Indigo. If you find that you can't drag a shortcut to a new folder, it may help to create a "dummy" shortcut into the folder first.
- If using a local address such as `localhost:8176` or `10.0.1.123:8176` make sure to use `%%http://%%` and not `%%https://%%`)
- To use your shortcuts with Apple Watch, edit your shortcut, click on the <span class="dw-color-green">**ⓘ**</span> icon and select "Show on Apple Watch".
- **Indigo servers running versions of macOS prior to Monterey do not have local access to the Shortcuts app.**

## Reference
### Command Line Commands
Here are a few commands you can run from the command line with the Shortcuts App that may be useful:

| Command                                                                                                            | Result                                          |
|--------------------------------------------------------------------------------------------------------------------|-------------------------------------------------|
| `shortcuts run "My Shortcut"`                                                                                      | Run shortcut named "My Shortcut"                |
| `%%shortcuts run "My Shortcut" <<< '{"message":"indigo.device.toggle", "objectId":"123456", "Arg":"Arg Value"}'%%` | Pass a dictionary to Indigo.                    |
| `shortcuts list`                                                                                                   | List available shortcuts.                       |
| `shortcuts list --f`                                                                                               | List available folders.                         |
| `%%shortcuts list -f Living\ Room%%`                                                                               | List all shortcuts in the "Living Room" folder. |
| `man shortcuts`                                                                                                    | List of available commands.                     |


### Apple Documentation
[Shortcuts User Guide Mac](https://support.apple.com/guide/shortcuts-mac/welcome/mac)   
[Shortcuts User Guide iOS/iPadOS](https://support.apple.com/guide/shortcuts/welcome/ios)
