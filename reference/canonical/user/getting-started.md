<!-- GENERATED from https://docs.indigodomo.com/2025.2/user/getting-started/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Getting Started

!!! abstract "In this article"
    This guide walks you through everything needed to get Indigo running: verifying Mac requirements, connecting hardware interface devices, adding your first Z-Wave, Insteon, or X10 devices, and creating basic automations. Read through all topics in this section before setting up your system to understand the full scope of what's required.

## Welcome to Indigo {{ version }}!
Indigo is a powerful Mac-based home control server that integrates an assortment of popular Z-Wave®, Insteon and X10 hardware devices, as well as a variety of other hardware via 3rd party plugins, to provide monitoring and control of your home. Depending on your needs and budget, you can create a simple system that controls only a couple of lights or you can automate your entire home.

We recommend that you read through all of the topics in this Introduction section to get a firm grasp of the pieces required to begin your home automation experience.

### Indigo Software and Mac Requirements
To install the Indigo software, you'll need a Mac that meets these OS and hardware requirements:

- [Mac OS X 10.13](https://en.wikipedia.org/wiki/MacOS_Sierra) or higher
- [Any Mac capable of running Mac OS X 10.13](https://en.wikipedia.org/wiki/MacOS_Sierra#System_requirements)

Indigo requires you to leave your Mac running all the time (though the display can go to sleep) in order to control your home automation; you should take this into consideration when choosing a location for your Mac.

### Indigo Home Automation Technology Support
The other major piece of the home automation puzzle are the devices that you want to control. Lights, thermostats, sprinklers, door locks, motion sensors, alarm panels, A/V equipment, etc. Indigo supports a large variety of these devices. Check out our [database of devices that have been tested with Indigo](https://www.indigodomo.com/devices/) (including via 3rd party plugins).

Out of the box, Indigo supports the following Home Automation protocols (simultaneously) via separate [Interface Hardware](https://www.indigodomo.com/devices/interfaces/) devices:
  
  

#### Z-Wave { #connecting-z-wave-interfaces }
[Z-Wave](../interfaces/z-wave/about.md) is a very popular home automation technology that's used worldwide. There are [many different manufacturers](https://z-wavealliance.org/z-wave_alliance_member_companies/) of Z-Wave devices so the selection is quite good. To use Z-Wave with Indigo, you'll need a Z-Wave interface (often referred to as a dongle): Indigo supports Z-Wave via a variety of [Hardware Interfaces](https://www.indigodomo.com/devices/interfaces/).

The types of Z-Wave devices that Indigo currently supports include:

- ON/OFF devices (plug-in modules, switches, and outlets),
- Dimmers (plug-in modules and switches),
- Sensors (contact, magnetic, motion, temperature, etc.),
- Thermostats, and
- Locks.

Other device types will be added over time. Check our [Compatible Devices list](https://www.indigodomo.com/devices/) to see if a specific module has been tested. Note however that just because a module isn't listed doesn't mean that it won't work - Z-Wave is architected such that devices that correctly support Z-Wave features should automatically work. There are so many different devices from many different manufacturers that we will never be able to test them all. If you have a device that isn't listed but works, please feel free to report it to us and we'll add it to the list. There is a very simple mechanism to report devices, described in [Editing a Z-Wave Device's Properties](../interfaces/z-wave/index.md#editing-a-z-wave-device-s-properties) towards the end of that section.

#### Insteon { #connecting-insteon-and-x10-interfaces }
[Insteon](../interfaces/insteon/index.md) is a protocol developed by SmartLabs, parent company of Smarthome.com, which is widely used in North America and is moving into other markets as well. There are a few 3rd party vendors that make Insteon hardware but most devices are made by SmartLabs. To use Insteon with Indigo, you'll need an Insteon interface. You can find a complete list of Insteon interfaces that are supported on our [Built-in Interface Hardware Support](https://www.indigodomo.com/devices/interfaces/) list. Indigo supports the vast majority of Insteon devices - see our [Compatible Devices list](http://www.indigodomo.com/devices/) for a complete list.

#### X10
[X10](../interfaces/x10/index.md) is a legacy technology that works primarily over the power line though some devices are wireless (using the X10 RF protocol). We don't recommend anyone start a new home automation system using X10 because of its poor reliability and relative lack of X10 hardware - however, if you have existing X10 devices you can definitely use them with Indigo if you have a compatible X10 interface. You can find a complete list of X10 interfaces that are supported on our [Built-in Interface Hardware Support](https://www.indigodomo.com/devices/interfaces/) list.

#### Other Devices
If you don't have any of the above hardware, you can still install and use Indigo - particularly if you have hardware supported by one of the [many 3rd party plugins](https://www.indigodomo.com/pluginstore/). For instance: [RFXtrx433](http://www.indigodomo.com/pluginstore/17/) with support for Home Easy/Chacon, X10 RF, LightwaveRF, and many different types of sensors; [Ecobee](https://www.indigodomo.com/pluginstore/193/) and [a variety of TRV](http://www.indigodomo.com/pluginstore/201/) Thermostats; Alarm Panels; A/V equipment; etc.  See our [Plugin Store](http://www.indigodomo.com/pluginstore/) for all available 3rd party plugins. Indigo also ships with some [useful plugins](../../plugins/index.md) out of the box. Some plugin developers have reported devices that have been tested with their plugin and Indigo: see our [Compatible Devices list](http://www.indigodomo.com/devices/) for those devices.

### Other Sources for Help
For specific questions or discussions on the hardware above, we recommend you join us on our [online forum](https://forums.indigodomo.com/).

You can also visit our [website](http://www.indigodomo.com/) for valuable [support resources](http://www.indigodomo.com/support/):

- The [FAQ](http://www.indigodomo.com/indigo/faq.html) has answers to the most common questions
- Add lots of extra functionality via 3rd Party Plugins available in our [Plugin Store](https://www.indigodomo.com/pluginstore/)
- Visit our [User Contribution Library](http://www.indigodomo.com/library/index.php) to download the latest plugins, scripts, and icons/graphics for extending Indigo

Now, you know what the parts of your system will be and where to go for more information and help. Now let's get started with the actual installation.

## Setting Up Indigo

With the background above, work through these chapters in order:

1. **[Installation & Server Setup](installation.md)** — install the software, start and configure the Indigo Server, set your location.
2. **[Managing the Built-in Interfaces](interfaces.md)** — enable and configure the Z-Wave, Insteon, X10, and Virtual Devices interfaces, then add your devices using the per-technology guides.

When your system is up and running, see [Accessing Indigo Remotely](remote-access.md) in the Remote Access section to reach your server from other Macs, Indigo Touch, and web browsers.

## Where to Go Next
Congratulations! You should now have a basic functioning Indigo installation that's ready for you to start adding devices and defining your home automation logic. We suggest that you next go to the [Overview of Devices, Triggers, Schedules, Action Groups, Control Pages, and Variables](../concepts/index.md) - that will give you the information you need to begin using the features of Indigo.


---
*Z-Wave® is a registered trademark of Sigma Designs, Inc. Indigo's support of Z-Wave hardware is neither endorsed nor certified by Sigma Designs.*
