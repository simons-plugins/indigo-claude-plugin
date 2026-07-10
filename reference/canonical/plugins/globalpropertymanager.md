<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugins/globalpropertymanager/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Global Property Manager
The Global Property Manager plugin gives users the ability to add custom properties to any Indigo object.

This simple plugin allows anyone to add arbitrary properties to any device object. Properties are different than states
- they are somewhat hidden bits of information that can be used by Python scripts or other Plugins. For example, if you
have a script that needs to be able to connect a device to another Indigo object (like an Action Group), then in the
past you'd have to store it somewhere else like a file. With global properties, you can add extra properties to a
device that can be accessed by your script.

## Plugin Config
The Global Property Manager plugin does not have any configuration settings.

### Using the Plugin
![Global Property Manager Configuration Dialog Image](../images/global_property_manager_config_dialog.png)

Before using the features of the Global Property Manager plugin, you must first enable it by going to the Indigo client
`Plugins` menu item, selecting the plugin, and then selecting `Enable`. Once the plugin is enabled, all the
plugin's features are accessed via the `Manage Global Object Properties...` plugin menu item. Once the dialog is
opened, you can manage your custom object properties.

1. To add a property to an existing Indigo object, first select the type of object you want to edit. Use the
`Object Type` dropdown menu to select among devices, action groups, variables, triggers, schedules or control pages
(devices should be selected by default when the dialog is first opened). You can only add properties to objects that
already exist.

2. Select the specific object you want to add a property to from the `Object` dropdown menu.

3. At the bottom of the dialog are the controls to define your property, set its value, and add it to the selected
object. You must create at least a `key` name, but the value can be empty at the time the property is created.
Key names must be alphanumeric, with no punctuation, and must start with a letter. Key names must also be unique within
the object itself (you can add the same key name to other objects).

You can use the controls in the center of the dialog to update or delete existing custom properties. You can change a
property name, update its value, or delete the property entirely. Editing or deleting a property only affects the
selected object. In other words, if you've added a property to multiple objects, you will need to edit each object
individually. Changes made using these controls are applied immediately and can not be undone.

## Working With Custom Properties
Properties added using the Global Properties Manager plugin are added to an object's `sharedProps` dictionary.
Here is an example of how they appear when you print an object's details to the Indigo Events Log.

```text
sharedProps : com.indigodomo.indigoserver : (dict)
     tags : timer, kitchen, ventilation (string)
```

Working with these values in a Python script is very straightforward.

```python
dev = indigo.devices[12345678]
props = dev.sharedProps
tags = props['tags']
indigo.server.log(f"{tags}")
```

You can also modify `sharedProps` (add, update, delete) using the `replaceSharedPropsOnServer()` method. You
should always do this by first making a copy of the `sharedProps` dictionary to avoid making inadvertent changes to
other plugins' `sharedProps`. 

!!! warning
    You should be very careful when using this approach as changes made this way can not be undone.

```python
dev = indigo.devices[12345678]
props = dev.sharedProps
props['tags'] = props['tags'] + ", foobar"
dev.replaceSharedPropsOnServer(props)
```

## Scripting Support
Here's the plugin ID in case you need to programmatically restart the plugin:

**Plugin ID**: com.indigodomo.indigoserver

## Support and Troubleshooting
For usage or troubleshooting tips [discuss this plugin](https://forums.indigodomo.com/viewforum.php?f=406) on our forum.
