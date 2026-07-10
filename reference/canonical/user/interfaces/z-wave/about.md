<!-- GENERATED from https://docs.indigodomo.com/2025.2/user/interfaces/z-wave/about/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Z-Wave® Terminology and Technical Overview

Z-Wave is a wireless (RF) home automation technology that's available worldwide. There are several characteristics of Z-Wave technology that we think are important for users to understand. In this article, we'll attempt to explain these features in terms that our users will find easily understood.

This page is about the Z-Wave technology in general terms: if you're ready to get started using Z-Wave with Indigo, check out the [Managing Your Z-Wave Network](index.md) document.

## Overview
Z-Wave is a wireless mesh network technology. That is, all signals are transmitted over RF (for those with power line-based systems, no more signal noise problems from stuff plugged into the wall). Z-Wave is a proprietary technology, owned by Silicon Labs, and licensed to a variety of vendors. The [Z-Wave Alliance](https://z-wavealliance.org) was formed by various vendors to help assure interoperability between devices.

Z-Wave is a mesh network - where each node knows about the ones around it so that a message can be sent through various devices on the network until it reaches its destination. This increases network and message reliability.

Z-Wave devices operate on different frequencies, so you'll find devices specific for North America (908MHz), Europe (868MHz) and Australia/New Zealand (921MHz). Many vendors supply devices for each so finding devices in your area shouldn't be a problem.

## Controllers
If you are an existing Indigo user, specifically one who uses INSTEON, you may recognize the term "controller" to mean a device which can control other devices: KeypadLinc, RemoteLinc, SwitchLincs, etc. You can link a controller directly to a "responder" such that when a button is pressed on a keypad or switch, a command is sent directly from it to the linked "responder" device. Z-Wave has a similar mechanism ([Associations](#associations)) which we'll discuss in a bit.

However, Z-Wave uses the word "controller" differently.

### Primary Controller
The Z-Wave primary controller is responsible for assigning network id and node ids to devices (Z-Wave devices are referred to as a "node") and to create Secondary Controllers. This controller is the one that keeps the definitive list of nodes on the network. There must always be a primary controller in any Z-Wave network. For Indigo controlled Z-Wave networks, the primary controller will be the Z-Stick - it will create the network id (or home id) and will assign node id's to any device that's added to the network (see [Including/Excluding a Device](#including-excluding) below for more details on how to add devices to the network).

### Controller Types
Controllers are generally one of two types. Portable controllers are handheld controllers, like remote controls, which can move around your house. Because these controllers can be at any place in the house, they must constantly be asking for nodes around it so they can maintain the routing information.

Static controllers are controllers that don't move around so don't necessarily need to update routing information very often. The Z-Stick is primarily a static controller - however, since it can be moved around to include other devices it may need routing updates more frequently. Other types of static controllers are some scene controllers (synonymous to the INSTEON KeypadLinc), some switches, etc.

## Devices
There are Z-Wave devices of all types you'd expect with any mature home automation technology: plug-in modules (aka wall-warts), switches, outlets, thermostats, motion sensors, etc. Z-Wave also supports locks from a variety of vendors.

### Including/Excluding a Device in a Z-Wave Network { #including-excluding }
When you add a device to a network via the controller, it's called "including" the device (i.e. the inclusion process). Each device may have a different inclusion process. Likewise, you must exclude a device from the network if you are no longer using it.

You can usually [include and exclude devices directly from Indigo](index.md). Older versions require you to take your controller to the device to include/exclude it using the button on the controller.

Devices must be awake to be included into the Z-Wave controller (the procedure for each device that supports sleep is different so you'll need to refer to the docs for your device). Once included, Indigo may attempt to queue up messages to the device and wait for it to wake up. That behavior may or may not work based on the capability of the device, so if you need to communicate with a sleeping device (for instance to update any configuration parameters) you may need to manually wake it up.

## Associations
Z-Wave associations are used when one module needs to command one or more other modules. For example, an association with a switch module could be created to control a remote lamp module when the switch is turned ON and OFF. Associations are also used between a module and the Z-Stick used by Indigo. In that case, the association is often used so that Indigo can update its UI when a module changes states, or so that user defined Triggers can be executed when a button is pressed.

## Routing and Network Healing
Z-Wave uses a routed mesh network for extending the range between all modules. For reliable communication to occur between distant modules, an established route, or path, needs to be created. Indigo tells the Z-Stick to create these routes when a module is Defined or Synced. If you move modules to different locations it may be necessary to re-Sync them so that their new routes can be established. If you are unable to communicate with a distant module, then try re-Syncing modules that are nearby the distant module to help establish a new route.

## Glossary of Terms

| Term | Definition |
|---|---|
| **Association** | A pre-defined grouping of Z-Wave devices that allows them to interact with each other. |
| **Command Class** | A standard set of instructions that defines how a Z-Wave device can communicate and perform specific actions. |
| **Controller** | A hardware device that acts as the primary hub and manages the Z-Wave network, including routing and security. |
| **Encryption** | Devices that support encryption use a secure transmission protocol to relay traffic. Not all devices support encryption, and it is recommended that encryption should only be used in circumstances where security is important like door locks. |
| **Exclusion** | Exclusion mode is a controller state that allows devices to be removed from a Z-Wave network. |
| **Hop Limit** | In a Z-Wave network, the hop limit is four hops. This means that a signal can travel through a maximum of four intermediate Z-Wave devices (routers) to reach its destination. The maximum range with four hops is roughly 600 feet (or 200 meters). |
| **Hub** | A hardware device that typically contains both communication circuits and a software application to manage a Z-Wave network. Indigo, along with a Z-Wave hardware controller, acts as the hub in a Z-Wave network. |
| **Inclusion** | Inclusion mode is a controller state that allows devices to be added to a Z-Wave network. |
| **Interface** | The software component used to communicate between Indigo and the Z-Wave Network. |
| **Mesh Network** | A network where devices communicate with each other directly or through intermediate nodes, allowing for a wider range and better signal reliability. |
| **Node** | A single device in a Z-Wave network. |
| **NodeID** | A unique identifier for each Z-Wave node within the network. |
| **Optimization** | Indigo supports a feature to optimize the Z-Wave network by iterating through all network devices to "refresh" their settings and routing tables. This is typically only required when significant changes are made to a network (for example, many devices are added/moved/removed from the network). |
| **Parameter** | Z-Wave devices typically have parameters that dictate how the device behaves. For example, a dimmer may have a setting to control how quickly a light's intensity will change, or determine how frequently a battery-powered device sends data. |
| **Primary Controller** | The main controller that manages the Z-Wave network. |
| **Repeater** | A Z-Wave device whose purpose is simply to pass traffic along the network. Repeaters help extend the range of the network. |
| **Secondary Controller** | A secondary controller can control Z-Wave devices, but it cannot add new devices to the network (only the primary controller can include or exclude devices). Secondary controllers are added or removed from the network by the primary controller. An example of a secondary controller would be a hand-held Z-Wave remote. |
| **Raw Command** | Raw commands are how Indigo communicates with the Z-Wave network. Indigo supports sending custom raw commands via the Z-Wave interface. This is more of an advanced feature. |
| **Sensor** | A device that detects and transmits information to the network, such as temperature or motion. |
| **Z-Wave** | A wireless communications protocol that uses low-energy radio waves to connect smart devices in a mesh network. |

## Further Reading
If you want even more detailed information about Z-Wave, here are some resources we suggest:

- [Z-Wave on Wikipedia](https://en.wikipedia.org/wiki/Z-Wave)
- [Z-Wave Alliance](https://z-wavealliance.org)

---
