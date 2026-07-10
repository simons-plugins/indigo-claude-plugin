<!-- GENERATED from https://docs.indigodomo.com/2025.2/user/concepts/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Core Concepts
Indigo has several high-level objects that you interact with: Devices, Triggers, Schedules, Action Groups, Control Pages, and Variables. While some of these objects are obvious, others aren't, so let's create some definitions (each one has a section with more detail below):

| Object | Definition |  |
| --- | --- | --- |
| [Devices](devices.md#devices) | A device is any "thing" that Indigo can interact with - usually it's some kind of hardware (light switch, appliance module, motion sensor, etc), but devices can also be other non-hardware things (iTunes server, calendar, etc). |  |
| [Triggers](triggers.md#triggers) | A trigger is generally some kind of "event" that occurs. Indigo can use that event to execute actions in response. |  |
| [Schedules](schedules.md#schedules) | A schedule is similar to a trigger, but the event that causes the execution of the actions is a temporal event of some kind. Either a fixed point in time (5/2/2011 at 1:00pm) or more likely some repeating time (every day at 1:00pm). |  |
| [Action Groups](actions.md#action-groups) | Action Groups are collections of actions that may be reused (and modified) easily between multiple triggers, schedules, and control pages and executed via various clients (the Mac Client, the Indigo Web Server (IWS) web pages, Indigo Touch, etc). |
| [Control Pages](control-pages.md#control-pages) | Control Pages are user-created interfaces to control their Indigo system - for instance you could create a graphical floor plan with light icons in the various rooms. |
| [Variables](variables.md#variables) | A variable is a place where your home automation logic can store information that changes during the normal operation of your home and that can be used in other parts of your system: for instance, you can have a variable that represents whether your home is occupied or not - then you can have special automation logic that takes place when that variable changes. |  |


That is the very high-level definition of the primary objects in Indigo. If you don't find what you're looking for there, check out our [Glossary Of Terms](../glossary.md) which includes just about every term we can think of that you might run across. Next, we want to go into a little more detail about each of the main object types to help you understand when and why you would want to use them.

## Reading On

You work with these objects through Indigo's clients: the [Mac Client](../mac-client/index.md) (where all configuration happens), [Indigo Touch for Web](../remote-access/touch-for-web.md) in any browser, and [Indigo Touch for iOS](https://www.indigodomo.com/touch.html) on your iPhone, iPad, and Apple Watch.

Each object has its own chapter: [Devices](devices.md), [Triggers](triggers.md), [Schedules](schedules.md), [Actions & Action Groups](actions.md), [Variables](variables.md), [Control Pages](control-pages.md), and [Conditions](conditions.md) — which restrict *when* triggers and schedules execute. Finally, [Managing Plugins](plugins.md) covers what plugins are and how to install and manage them.

---
*Z-Wave® is a registered trademark of Sigma Designs, Inc. Indigo's support of Z-Wave hardware is neither endorsed nor certified by Sigma Designs.*
