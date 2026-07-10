<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugins/alexa/operations/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Alexa Plugin operations
## Plugin Startup
When the plugin starts up, you will see a list of what's published to Alexa in the Event log. It will look something like this:

```text
   Started plugin "Alexa 2024.1.0"
   Alexa                           Finding devices to publish to Alexa...
   Alexa                           ... '010 - Smart Fan Control (14287)' published as 'office fan'
   Alexa                           ... '016 - Plug-In Appliance Module (ZL-PA-100)' published as 'office lamp'
   Alexa                           ... '038 - Lamp Module (AD130)' published as 'blinds'
   Alexa                           ... 'automatic door' published
   Alexa                           ... 'FanLinc - Fan' published as 'ceiling fan'
   Alexa                           ... 'FanLinc - Light' published as 'fan light'
   Alexa                           ... 'Fortrezz Strobe' published as 'strobe'
   Alexa                           ... 'Hue Bulb' published as 'office bulb'
   Alexa                           ... 'Insteon Dimmer' published as 'valve'
   Alexa                           ... 'Insteon On/Off' published as 'back door'
   Alexa                           ... 'Insteon Thermostat' published as 'thermostat'
   Alexa                           ... 'Kasa Plug' published as 'garage door'
   Alexa                           ... 'Office Siren' published
   Alexa                           ... 'outlet' published
   Alexa                           ... 'Simple Virtual On/Off' published as 'simple switch'
   Alexa                           A total of 15 devices are currently published to Alexa
   Alexa Warning                   If you can't control a device, rerun discover from your Alexa device.
```
### Showing Publications
You can also select the `Plugins->Alexa->Show Device Publications` menu item to show this list with more details and sorted by the Alexa name:
```text
   Alexa                           Currently published devices (Alexa name first if different than Indigo name):
   Alexa                             'Office Siren' ('Office Siren') - Type: RelayDevice - Subtype: Siren
   Alexa                             'automatic door' ('automatic door') - Type: RelayDevice - Subtype: Door Controller
   Alexa                             'back door' ('Insteon On/Off') - Type: RelayDevice - Subtype: Lock
   Alexa                             'blinds' ('038 - Lamp Module (AD130)') - Type: DimmerDevice - Subtype: Blind
   Alexa                             'ceiling fan' ('FanLinc - Fan') - Type: SpeedControlDevice - Subtype: None
   Alexa                             'fan light' ('FanLinc - Light') - Type: DimmerDevice - Subtype: Dimmer
   Alexa                             'garage door' ('Kasa Plug') - Type: RelayDevice - Subtype: Garage Controller
   Alexa                             'office bulb' ('Hue Bulb') - Type: DimmerDevice - Subtype: Color Bulb
   Alexa                             'office fan' ('010 - Smart Fan Control (14287)') - Type: DimmerDevice - Subtype: Fan
   Alexa                             'office lamp' ('016 - Plug-In Appliance Module (ZL-PA-100)') - Type: RelayDevice - Subtype: Plug-In
   Alexa                             'outlet' ('outlet') - Type: RelayDevice - Subtype: Outlet
   Alexa                             'simple switch' ('Simple Virtual On/Off') - Type: RelayDevice - Subtype: Switch
   Alexa                             'strobe' ('Fortrezz Strobe') - Type: RelayDevice - Subtype: Plug-In
   Alexa                             'thermostat' ('Insteon Thermostat') - Type: ThermostatDevice - Subtype: None
   Alexa                             'valve' ('Insteon Dimmer') - Type: DimmerDevice - Subtype: Valve
```
### Discovery Requests from Alexa
When the plugin receives a discover request from the Alexa servers, you will see something similar to this in the Event Log:
```text
   Alexa                           Alexa discovery request received, assembling reply...
   Alexa                           ...'ceiling fan' ('FanLinc - Fan') - Type: SpeedControlDevice - Subtype: None
   Alexa                           ...'simple switch' ('Simple Virtual On/Off') - Type: RelayDevice - Subtype: Switch
   Alexa                           ...'upstairs siren' ('Fortrezz Siren') - Type: RelayDevice - Subtype: Siren
   Alexa                           ...'outlet' - Type: RelayDevice - Subtype: Outlet
   Alexa                           ...'fan light' ('FanLinc - Light') - Type: DimmerDevice - Subtype: Dimmer
   Alexa                           ...'office fan' ('010 - Smart Fan Control (14287)') - Type: DimmerDevice - Subtype: Fan
   Alexa                           ...'back door' ('Insteon On/Off') - Type: RelayDevice - Subtype: Lock
   Alexa                           ...'automatic door' - Type: RelayDevice - Subtype: Door Controller
   Alexa                           ...'Office Siren' - Type: RelayDevice - Subtype: Siren
   Alexa                           ...'thermostat' ('Insteon Thermostat') - Type: ThermostatDevice - Subtype: None
   Alexa                           ...'blinds' ('038 - Lamp Module (AD130)') - Type: DimmerDevice - Subtype: Blind
   Alexa                           ...'office lamp' ('016 - Plug-In Appliance Module (ZL-PA-100)') - Type: RelayDevice - Subtype: Plug-In
   Alexa                           ...'office bulb' ('Hue Bulb') - Type: RelayDevice - Subtype: Plug-In
   Alexa                           ...'strobe' ('Fortrezz Strobe') - Type: RelayDevice - Subtype: Plug-In
   Alexa                           ...'garage door' ('Kasa Plug') - Type: RelayDevice - Subtype: Garage Controller
   Alexa                           ...'outside lights' ('Outdoor Appliance Module (45604)') - Type: RelayDevice - Subtype: Plug-In
   Alexa                           ...'valve' ('Insteon Dimmer') - Type: DimmerDevice - Subtype: Valve
   Alexa                           Found 17 devices to publish, replying
```
### Command Requests from Alexa
When an Alexa command is received, you will see something similar to this in the Event Log:

```text
   Alexa                           turning on 'Hue Bulb'
   Sent Hue Lights                 "Hue Bulb" on to 100 at ramp rate 2.0 sec.

This will allow you to easily see that the change was the result of an Alexa request. This will show for every change that the Alexa plugin makes.
```
