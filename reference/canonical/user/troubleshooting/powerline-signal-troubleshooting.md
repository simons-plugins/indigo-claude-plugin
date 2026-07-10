<!-- GENERATED from https://docs.indigodomo.com/2025.2/user/troubleshooting/powerline-signal-troubleshooting/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Insteon and X10 Troubleshooting Basics

Insteon and X10 are both power line protocols that allow remote control and monitoring of modules through your existing home wiring. Insteon is a newer, more robust standard that provides improved performance and signal reliability. There are dozens of different Insteon and X10 [control modules](https://www.indigodomo.com/devices/) supported by Indigo which can be used to control lighting, appliances, hot tubs, sprinklers, thermostats (HVAC), and much more. These control modules listen for Insteon or X10 commands on your existing power lines, decode this information, and then control the device (light, appliance, thermostat, etc.). Indigo both listens and transmits to these control modules using a [home control computer interface](https://www.indigodomo.com/devices/interfaces).

Insteon is also dual-band, which means that it sends signals both on the power line and wirelessly. Most Insteon devices that are not battery powered and have shipped since 2014 or so are dual-band. That is, they send and receive signals from both the power line and from RF. It's worth noting however that these dual-band devices often prioritize power line signals over RF. That means that if there is signal noise on the power line, the device may still fail to operate reliably even though it's dual-band.

## Signal Troubleshooting
In some cases Insteon or X10 control modules fail to receive or properly decode the information sent over the power line. This typically happens because there is excessive noise on the power line caused by some other appliance, such as a power supply, surge protector strips, portable electronics charger, etc., or because the signal is not able to travel over that particular leg, or phase, of your household wiring.

The most common symptom of a signal problem is when some Insteon or X10 modules are controllable, but others fail to respond to commands sent by Indigo. In extreme cases, the signal can fail to get to all modules. To troubleshoot modules that will not turn on/off from Indigo:

### Bridge Your Home's 110V Power Legs
Every house has two 110V power legs that are electrically connected only at the street or alley transformer. Most Insteon devices that shipped over the past several years that aren't battery powered are dual-band, which means that they repeat over both the power line and RF. If you have older devices, then properly installing two [Insteon Range Extenders](https://www.smarthome.com/insteon-2992-222-range-extender.html) will also bridge all Insteon signals across both power legs. Dual-band devices (which includes the Range Extenders) are required to have a complete and reliable Insteon home network. Be sure and follow the instructions that come with the Range Extenders to ensure that they are plugged into outlets on opposite power legs. X10 customers will need to find an alternate device to bridge the power legs for X10 commands.

**Important**: *The Insteon Range Extenders, AccessPoint RFs and SignaLinc RFs ONLY bridge Insteon signals.*

### Change the Insteon / X10 Signal Path
Sometimes just changing the signal path from the transmitting computer interface (PowerLinc, CM11, etc.) to the destination module can help. Try the following, attempting to turn the module on/off after each step:

- Plug the computer interface into a different outlet. If needed, use a short extension cord to reach another outlet.
- If the destination module is a plug-in type (LampLinc, ApplianceLinc, etc.), then temporarily plug it directly into the PowerLinc's passthrough outlet. If it works there, then this proves it is a signal problem.
- Insteon users can move their AccessPoint RF pair (or SignaLinc RF pair) to other outlets in the house. Per their instructions, be sure the new outlets are on opposite power legs.
- Insteon users can also plug one of the AccessPoint RFs directly into the PowerLinc's passthrough outlet. Per the AccessPoint instructions, the other AccessPoint must still be installed on the opposite power leg. This can help if there are severe signal problems on the same circuit as the PowerLinc.

### Temporarily Remove or Filter "Signal Suckers"
Some electronics can significantly attenuate, or diminish, the strength of Insteon and X10 signals. Uninterruptible Power Supplies (UPSs) and high-end surge protector strips are notorious for attenuating both Insteon and X10 signals. Try temporarily unplugging all UPSs (just let them run off of battery for a couple of minutes) to see if that allows control of the module. If it does, then you can isolate the UPS so that it doesn't cause problems by plugging it into an [Insteon Noise Filter](https://www.smarthome.com/filterlinc-10-amp-plug-in-noise-filter.html).

In addition to UPSs, try temporarily unplugging other electronics and surge protector strips that are on the same circuit as the PowerLinc. Potential problem devices include:

- UPSs and surge protector power strips
- televisions and video game systems
- laptop and mobile phone chargers
- fax machines
- MIDI musical instruments

If unplugging any of them helps, then you can isolate the problem device with an [Insteon Noise Filter](https://www.smarthome.com/filterlinc-10-amp-plug-in-noise-filter.html).

**Important**: Although UPSs and other electronics on the same circuit as the PowerLinc are most often the culprit, it is possible for UPSs on other circuits or other parts of the house to cause signal problems. Try unplugging all UPSs if you don't see an improvement after removing devices on the same circuit as the PowerLinc.

### Temporarily Remove or Filter Noisy Electronics
Some electronics can also introduce noise on the power lines that can cause problems for Insteon and X10 signal reliability. Try temporarily unplugging the following, especially if they are on the same power circuit as the home control computer interface (PowerLinc, CM11, etc.) or the module you are trying to control:

- portable electronic chargers (laptop, mobile phone, tooth brushes, razors, etc.)
- CFL, LED, halogen and HID lighting
- fans, treadmills, and other appliances with motors

If unplugging any of them helps, then you can isolate the problem device with an [Insteon Noise Filter](https://www.smarthome.com/filterlinc-10-amp-plug-in-noise-filter.html).

### Identify Failing X10 (and Insteon) Devices
If you see traffic from X10 device addresses for which you don't have a corresponding device, it is possible that you have another X10 or Insteon device that's starting to fail and is erroneously broadcasting out garbage that looks to the interface like valid X10 traffic. The interface may become so busy trying to decipher these garbage transactions that it will not reliably send commands. You'll need to find the offending device and disable it.

With plug-in modules that's simple, just unplug them all and start adding them back one at a time. It's a bit harder with devices that are in-wall. Some of these devices have the ability to be "air-gapped" which will completely remove power to them. Most SwitchLinc devices, for instance, can be air-gapped by pulling the LED pipe below the switch out until it clicks and stays pulled out. Other devices that don't have this ability will be harder to deal with. You can cut off circuit by circuit at your power panel until the problem ceases. That will give you a better clue where the problem device is located.

### Increase the Insteon / X10 Signal Strength
Although we recommend making sure your power legs are bridged correctly (see above) and isolating problem electronics first (see above), if you still have unreliable operation with some modules then you can try increasing the signal strength with a signal repeater or booster. All Insteon modules are automatically repeaters (of Insteon commands only), so adding additional modules (LampLinc, ApplianceLinc, SwitchLinc, etc.) or additional AccessPoint RFs can help.

X10 commands are only repeated by an active couple repeater, like the dryer SignaLinc Coupler Repeater. Another option besides repeating the command is to use a signal booster, like the BoosterLinc. Note the BoosterLinc only boosts X10 signals.

## Signal Isolation Steps
When diagnosing issues, the most thorough practice is to isolate which circuit appears to have the most problems. As described above, changing the signal path may help you identify specific circuits that have issues. A more definitive approach is to check circuits individually. Start by turning off all circuits in your house except the one with your Mac and PowerLinc. Make sure that all devices on that circuit work correctly. Then, turn the circuits back on one by one and check all the devices on all active circuits. When you start experiencing failures (no acknowledgements with Insteon), then it's likely that the most recently turned on circuit has something that's causing the noise. You can then start unplugging/disabling devices (air-gap any in-wall switches — for Insteon switches this means pulling the LED pipe below the switch out until it clicks, thus completely removing the power) and other things plugged in until communication seems to improve.

Repeat this process as necessary until you can isolate the problem areas and devices.

## Getting More Help
Still having a problem? Perform the following troubleshooting steps and send the results to us in an email, or — to draw on the expertise of the entire Indigo community — post the results on our active [online forum](https://forums.indigodomo.com/).

1. Choose the **Window → Event Log** menu item.
2. Press the **Clear Window** button at the top of the **Event Log** window.
3. Choose the **Interfaces → Insteon/X10 Power Line → Enable** menu item if it isn't already enabled.
4. From the Main Window select the Devices list and the Device you want to control, then press the **Turn On** and **Turn Off** buttons at the bottom of the window several times.
5. **Question**: Did the module turn on or off?
6. If the Device module is a plug-in type (LampLinc, ApplianceLinc, etc.), then plug it and its lamp/appliance directly into the PowerLinc's passthrough outlet. **Otherwise**, if the Device module is not a plug-in type, then plug the PowerLinc (or CM11) into a different outlet. If needed, use a short extension cord to reach another outlet.
7. From the Main Window select the Devices list and the Device you want to control, then press the **Turn On** and **Turn Off** buttons at the bottom of the window several times.
8. **Question**: Did the module turn on or off?
9. Select the Event Log window, then select all the logged text and copy/paste it into a [forum post](https://forums.indigodomo.com/) or email, along with a description of what occurred while following these steps.
