<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugins/alexa/custom-skill/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Custom Indigo Skill
!!! warning "NOTE"
    **the Custom Skill is available in English-speaking regions only**.

When you enable the **Indigo Smart Home Skill** in the Alexa app, you also gain access to some custom functionality that's specific to Indigo. We enable you to hear the value of a variable (complete with speech markup), hear a list of all of your variables, and run Action Groups.

Custom skill requests require that you preface your requests by saying *Alexa, tell Indigo* or *Alexa, ask Indigo*. These are called **invocations** and are needed so that Alexa can know where to direct the request. It's not needed for Smart Home Skills (ones that deal with Indigo devices as described above as well as devices from other skills) because Alexa knows details about each individual device and where to send the request based on that information.

!!! warning "NOTE"
    Unfortunately, the invocation for the skill is currently different in different regions.

- US, UK - "indigo" is the invocation
- CA, AU - "indigo home" is the invocation

We are attempting to get Amazon to help us correct this, but we are unsure if it's going to be possible or not at this time.

## Speaking the Value of a Variable
!!! note "Note"
    When naming variables for use with Alexa, you should use underscores_to_separate_words. That is how the plugin will map separate words from Alexa onto variables (which can't contain spaces).

To hear the value of a variable, just ask Indigo for it. There are a variety of ways to ask, here are a few (variable names are in quotes, underscores are treated as spaces):

- *Alexa, ask Indigo to get "current_weather_conditions"*
- *Alexa, ask Indigo to look up "current_weather_conditions"*
- *Alexa, ask Indigo to read "current_weather_conditions"*
- *Alexa, ask Indigo to say "current_weather_conditions"*
- *Alexa, ask Indigo to speak "current_weather_conditions"*
- *Alexa, ask Indigo to tell me "the_status_of_the_house"*
- *Alexa, ask Indigo for the value of variable "current_weather_conditions"*
- *Alexa, ask Indigo the value of "current_weather_conditions"*
- *Alexa, ask Indigo the current value of "weather_conditions"*

You can also use *tell Indigo* interchangeably with *ask Indigo*.

The default response (in the default voice) will be:

*The value of variable "current weather conditions" is "mostly cloudy"*

You can adjust how Alexa responds in a couple of ways:

- You can use [Speech Synthesis Markup Language (SSML)](https://developer.amazon.com/en-US/docs/alexa/custom-skills/speech-synthesis-markup-language-ssml-reference.html) to mark up the text in a variable to customize how Alexa reads back the value. Any variable value that begins with a less than sign (<), which we use as a key that the text contains SSML, will be read exactly as specified in the variable without any additional words (i.e. *The value of variable* won't be prepended). If your markup text doesn't naturally begin with a markup tag, wrap the entire string in `<speak></speak>` tags.
- Variable values that contain the device (%%d:deviceId:deviceState%%) or variable (%%v:variableId%%) markup values will be correctly substituted by Indigo.
- You may also specify in the plugin's config that all variable values should be read exactly as they are stored without the added verbiage.


### Get a List of Variables
You can hear a list of your variables as well. Here are a variety of ways to ask:

- *Alexa, ask Indigo to get my variable list*
- *Alexa, ask Indigo to list my variables*
- *Alexa, ask Indigo to list all variables*
- *Alexa, ask Indigo what variables are available*

You can also use *tell Indigo* interchangeably with *ask Indigo*.

### Execute an Action Group
You can tell Indigo to execute an action group. Here are a variety of ways to ask (action group names are in quotes):

- *Alexa, tell Indigo to arm "the kitchen zone"*
- *Alexa, tell Indigo to do "my favorite thing"*
- *Alexa, tell Indigo to execute "toggle music"*
- *Alexa, tell Indigo to launch "rocket"*
- *Alexa, tell Indigo to make "the house secure"*
- *Alexa, tell Indigo to perform "routine maintenance"*
- *Alexa, tell Indigo to play "my favorite playlist"*
- *Alexa, tell Indigo to reset "the alarm"*
- *Alexa, tell Indigo to restart "the laundry timer"*
- *Alexa, tell Indigo to restore "the standard speaker set"*
- *Alexa, tell Indigo to run "routine maintenance"*
- *Alexa, tell Indigo to start "the laundry timer"*
- *Alexa, tell Indigo to set "the playlist to classic rock"*

Action group names can contain letters, numbers, and spaces only. If you say "playlist eighties music", the action group name will need to be "playlist 80s music". If you are unsure how to name an action group, just attempt to execute it with one of the above utterances. If Indigo doesn't find an action group matching what you said, it will log it to the Event Log window like this:

`Alexa Error    an action group named 'kitchen zone' does not exist in your indigo server`

That will tell you the text that Alexa sent to the plugin, so you can name your action group exactly what's in single quotes and the next time it will work.

!!! note 
    What you say before the action group name will work for any action group name. We picked the above examples only because they are normal complete English sentences, but you could just as well say *Alexa, tell Indigo to arm "the laundry timer"* and the effect would be the same as saying *Alexa, tell Indigo to start "the laundry timer"*. You can also use *tell Indigo* interchangeably with *ask Indigo*.
