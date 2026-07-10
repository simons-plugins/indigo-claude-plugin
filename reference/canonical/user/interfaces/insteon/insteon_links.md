<!-- GENERATED from https://docs.indigodomo.com/2025.2/user/interfaces/insteon/insteon_links/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Insteon Links

Insteon devices provide a simple way to link together so that one device knows about and can (optionally) control another. And, unlike X10, you can link multiple devices together in different ways to create groups or scenes. For instance, let's say you have a SwitchLinc called "Dining Room", a KeypadLinc (that has 6 buttons) called "Hallway", a LampLinc called "Office", and another SwitchLinc called "Media Room". You could link these devices together in the following ways (these are just a few examples):

1. Button 3 (the first small button) on "Hallway" could control "Office" such that pressing and holding (when off) would brighten that light, and doing so when it was on would dim that light.
2. By linking together "Dining Room", "Hallway", and "Media Room", you could have all of those lights come on, dim, brighten, and go off at the same time, same rate, etc.
3. You could have a button 4 on "Hallway" set each light to a different setting, creating a scene.

All of these things can be done using just the link protocols that are part of the Insteon specification. Creating these links manually in the devices can be a little cumbersome - you have to walk around your house putting each device into link mode, for each link you want to establish, on each device. For the last example, assuming you wanted to set "Dining Room", "Office", and "Media Room", you would need to touch "Hallway", then the device, to create the link. That's 6 device touches for just that scene.

That's where Indigo can help. Indigo will allow you to [create almost any Insteon links](index.md) that can be created manually, without having to walk around your house putting switches into link mode, setting options, etc. Indigo talks to the Insteon network via the PowerLinc 2414U interface. This interface is just like any other device: it can create links, etc. What's special about the PowerLinc is that it has a USB port that allows your Mac to communicate with it. So, your Mac can see what Insteon signals are being sent and can send those signals as well.

You can accomplish many of your Home Automation scenarios without Insteon links - for instance, you could have Indigo listen for a button press on "Hallway", and then Indigo would perform the actions of setting each light to a different brightness. There is a lot of flexibility in this approach because it's easier to change what actions are performed and Indigo has a much wider variety of actions to perform - not only directly controlling HA devices, but using more logic to determine if an action should be performed.

For instance, let's say that we want button 4 to operate as described above, but also if the time of day is between dusk and dawn, you want it to additionally turn on a new switch, called "Porch Light". Using only Insteon links, you couldn't accomplish this logic. However, if you were using Indigo, you could accomplish this. There are several ways, but the easiest would be to create 2 almost identical trigger actions: both would trigger when button 4 of "Hallway" was turned on. The difference would be that the condition for one would be "If dark" and the other would be "If daylight". The actions for both would be identical except you'd add another action to the "If dark" trigger that would also turn on "Porch Light".

So, why would you choose one over the other? Here are some advantages and disadvantages to each approach:

**Insteon Links**

- Don't require Indigo to be running to work
- Act instantaneously - that is, if dimmable lights are linked together, they can dim and brighten at the same rate as you hold down the button/switch
- Links aren't necessarily easily edited or altered - it's a little more difficult to see what's linked to what

**Indigo Triggers**

- Allow for considerable flexibility - Indigo has many more action types
- Require Indigo to be running
- Because of the extra step of communication between Indigo and the PLC, actions aren't necessarily immediate - a delay of up to a couple of seconds between the time the trigger fires and the time that Indigo can start sending Insteon commands is possible.

So, now that you have a general idea of each method, the good news is that you can use both at the same time! So, for instance, after you set up button 4 using Insteon links as described above, you could then add a trigger action in Indigo that would, if it's dark, turn on "Porch Light" as well.
