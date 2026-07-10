<!-- GENERATED from https://docs.indigodomo.com/2025.2/user/interfaces/z-wave/associations/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Indigo Z-Wave® Association Management

!!! abstract "In this guide"
    How to view and manage Z-Wave device associations using Indigo's Association Management dialog. Z-Wave associations allow devices to control each other directly (similar to Insteon links); this guide covers selecting a controlling device, choosing an association group, and adding or removing responding devices.

Z-Wave has a couple of mechanisms that allow devices to control and respond to each other directly (similar to how [Insteon links](../insteon/index.md) work). Currently, Indigo supports the management of one of these mechanisms - Associations. Some Z-Wave devices can control associations - we'll call them association controllers. These devices may have multiple groups that they can control as well. All devices can respond to an association - we'll call these association responders.

To edit associations, select `Interfaces->Z-Wave->Manage Associations...`.

![Z-Wave Associations Image](../../../images/zwave_associations.png)

The `Controlling device` popup lists all Z-Wave devices in your system that support control associations. Once you select one of those (if you have any), then the `Controlling group` popup will show how many different association groups the device can control. The `Responding devices` list shows all Z-Wave devices that are being controlled by the selected device/group. Select any you want to delete and click the `Remove Selected Device` button to remove them from the association. Select a device from the `Device to add popup` and click `Add Responding Device` to add the device to the association.

---
*Z-Wave® is a registered trademark of Sigma Designs, Inc. Indigo's support of Z-Wave hardware is neither endorsed nor certified by Sigma Designs.*
