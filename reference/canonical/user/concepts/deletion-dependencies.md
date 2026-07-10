<!-- GENERATED from https://docs.indigodomo.com/2025.2/user/concepts/deletion-dependencies/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Deletion Dependencies

!!! abstract "In this guide"
    When deleting an Indigo object, a confirmation dialog shows any dependent objects that will also be affected or
    deleted. You can also inspect dependencies at any time by right-clicking an object and choosing Show Dependencies.

When an object (Device, Trigger, Schedule, Action Group, Control Page, or Variable) is deleted, you will be presented a dialog to confirm. If there are any other objects that are dependent on the object you're deleting, the dialog will show you the dependencies.

![Dependency Sheet Image](../../images/depencency_sheet.png)

If you double-click on the dependency, the edit dialog for that object will open so you can change/remove it. If you want the dependent objects to be deleted, just click the `Delete` button.

Specifically - if the object being deleted will render the dependent object useless. For instance, a trigger event that's defined with the device you're deleting in the device state changed definition, then the entire object will be deleted - in this case the trigger. Same with conditions. If the object is used in one of several actions or if it's used on a control page, just the action or page element will be deleted.

You may also right-click on any object to pop up the contextual menu and a new menu item, Show Dependencies, will allow you to open a separate window showing the dependencies for the object:

![Dependency Window Image](../../images/dependency_window.png)

This should be a big help in figuring out what a given object's dependencies are and allow you to quickly change those relationships.
