<!-- GENERATED from https://docs.indigodomo.com/2025.2/user/maintenance/upgrading/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Upgrading Indigo

!!! abstract "In this guide"
    This guide provides detailed instructions on how to upgrade your Indigo software, including version-specific changes.

## Upgrading from a Previous Version
The upgrade process is pretty straight-forward, but below you'll find the specifics for each older version.

## Upgrading from Indigo 2021.1 or later
### Server Folder Change
For this release, we've changed the server install path to:

    /Library/Application Support/Perceptive Automation/Indigo {{ version }}/

and the Indigo Mac Client app is now named:

    /Applications/Indigo {{ version }}.app

### Web Assets Folder Change
The installer moves customer-installed images and other files from these folders:

    /Library/Application Support/Perceptive Automation/Indigo 202x.y/Web Assets/

(depending on version of Indigo you were using) to:

    /Library/Application Support/Perceptive Automation/Indigo {{ version }}/Web Assets/

### Shared Python Modules Folder Change
Lastly, the [shared Python modules folder](../../scripting/tutorial.md#shared-classes-and-methods-in-python-files-python-modules) available during script execution is located here:

    /Library/Application Support/Perceptive Automation/Python3-includes

If you have any existing Python modules/libraries in the old `Python2-includes` folder you should copy them to the new folder and **make sure** they are [Python 3 compatible](#python-script-changes-and-plugin-compatibility).

### Troubleshooting Not Compatible Error
If you experience the error `This version of the Indigo client application is not compatible with the Indigo Server` when trying to launch Indigo then that means the Indigo client version being launched doesn't match the version of Indigo Server currently being run. This can occur when an older version of Indigo Server is still running or an older version of Indigo Client was launched by mistake. To fix this follow these steps:

1. Shut down the Indigo Server by selecting the `Indigo 202x.y->Stop Server` menu item in the Mac client. This will shutdown the Indigo Server regardless of which version is running.
1. Quit the Mac client via the `Indigo 202x.y->Quit Indigo` menu item.
1. Open the `/Applications` folder on your Mac and launch the version of Indigo you wish to use. This will have it launch the correct version of the Indigo Server when it starts.

Once you are sure you are ready to run the latest version of Indigo can delete (backup first!) the older Indigo Server install paths in `/Library/Application Support/Perceptive Automation/` and client applications in `/Applications`.

## Upgrading from Legacy Versions of Indigo

!!! abstract "In this guide"
    Step-by-step instructions for upgrading from Indigo 6.x or 7.x to Indigo {{ version }}, including installer path changes, plugin migration, and database conversion steps. Review this before upgrading — particularly if you have scripts that may need updating for Python 3 compatibility.

### Upgrading from Indigo 7.5
For this release, we've changed the server install path to:

    /Library/Application Support/Perceptive Automation/Indigo {{ version }}/

and the Indigo Mac Client app is now named:

    /Applications/Indigo {{ version }}.app

In addition to the automatic upgrade logic described below (for upgrades from Indigo 6 and earlier), the installer moves previously installed control page images and web server plugins to the new install location. Note the folder that contains Web server images, legacy Web plugins, etc. has been renamed from:

    /Library/Application Support/Perceptive Automation/Indigo 7.5/IndigoWebServer/

to:

    /Library/Application Support/Perceptive Automation/Indigo {{ version }}/Web Assets/

If you experience the error `This version of the Indigo client application is not compatible with the Indigo Server` when trying to launch Indigo then that means the Indigo client version being launched doesn't match the version of Indigo Server currently being run. This can occur when an older version of Indigo Server is still running or an older version of Indigo Client was launched by mistake. To fix this follow these steps:

1. Shut down the Indigo Server by selecting the `Indigo 7.5->Stop Server` menu item in the Mac client. This will shut down the Indigo Server regardless of which version is running.
1. Quit the Mac client via the `Indigo 7.5->Quit Indigo` menu item.
1. Open the `/Applications` folder on your Mac and launch the version of Indigo you wish to use. This will have it launch the correct version of the Indigo Server when it starts.

Once you are sure you are ready to run the latest version of Indigo can delete (backup first!) the older Indigo Server install paths in `/Library/Application Support/Perceptive Automation/` and client applications in `/Applications`.

### Upgrading from Indigo 7.4
For this release, we've changed the server install path to:

    /Library/Application Support/Perceptive Automation/Indigo {{ version }}/

and the Indigo Mac Client app is now named:

    /Applications/Indigo {{ version }}.app

In addition to the automatic upgrade logic described below (for upgrades from Indigo 6 and earlier), the installer moves previously installed control page images and web server plugins to the new install location. Note the folder that contains Web server images, legacy Web plugins, etc. has been renamed from:

    /Library/Application Support/Perceptive Automation/Indigo 7.4/IndigoWebServer/

to:

    /Library/Application Support/Perceptive Automation/Indigo {{ version }}/Web Assets/

If you experience the error `This version of the Indigo client application is not compatible with the Indigo Server` when trying to launch Indigo then that means the Indigo client version being launched doesn't match the version of Indigo Server currently being run. This can occur when an older version of Indigo Server is still running or an older version of Indigo Client was launched by mistake. To fix this follow these steps:

1. Shut down the Indigo Server by selecting the `Indigo 7.4->Stop Server` menu item in the Mac client. This will shut down the Indigo Server regardless of which version is running.
1. Quit the Mac client via the `Indigo 7.4->Quit Indigo` menu item.
1. Open the `/Applications` folder on your Mac and launch the version of Indigo you wish to use. This will have it launch the correct version of the Indigo Server when it starts.

Once you are sure you are ready to run the latest version of Indigo can delete (backup first!) the older Indigo Server install paths in `/Library/Application Support/Perceptive Automation/` and client applications in `/Applications`.

### Upgrading from Indigo 7.3
For this release, we've changed the server install path to:

    /Library/Application Support/Perceptive Automation/Indigo {{ version }}/

and the Indigo Mac Client app is now named:

    /Applications/Indigo {{ version }}.app

In addition to the automatic upgrade logic described below (for upgrades from Indigo 6 and earlier), the installer moves previously installed control page images and web server plugins to the new install location. Note the folder that contains Web server images, legacy Web plugins, etc. has been renamed from:

    /Library/Application Support/Perceptive Automation/Indigo 7.3/IndigoWebServer/

to:

    /Library/Application Support/Perceptive Automation/Indigo {{ version }}/Web Assets/

If you experience the error `This version of the Indigo client application is not compatible with the Indigo Server` when trying to launch Indigo then that means the Indigo client version being launched doesn't match the version of Indigo Server currently being run. This can occur when an older version of Indigo Server is still running or an older version of Indigo Client was launched by mistake. To fix this follow these steps:

1. Shut down the Indigo Server by selecting the `Indigo 7.3->Stop Server` menu item in the Mac client. This will shut down the Indigo Server regardless of which version is running.
1. Quit the Mac client via the `Indigo 7.3->Quit Indigo` menu item.
1. Open the `/Applications` folder on your Mac and launch the version of Indigo you wish to use. This will have it launch the correct version of the Indigo Server when it starts.

Once you are sure you are ready to run the latest version of Indigo can delete (backup first!) the older Indigo Server install paths in `/Library/Application Support/Perceptive Automation/` and client applications in `/Applications`.

### Upgrading from Indigo 7.2
For this release, we've changed the server install path to:

    /Library/Application Support/Perceptive Automation/Indigo {{ version }}/

and the Indigo Mac Client app is now named:

    /Applications/Indigo {{ version }}.app

In addition to the automatic upgrade logic described below (for upgrades from Indigo 6 and earlier), the installer moves previously installed control page images and web server plugins to the new install location. Note the folder that contains Web server images, legacy Web plugins, etc. has been renamed from:

    /Library/Application Support/Perceptive Automation/Indigo 7.2/IndigoWebServer/

to:

    /Library/Application Support/Perceptive Automation/Indigo {{ version }}/Web Assets/

If you experience the error `This version of the Indigo client application is not compatible with the Indigo Server` when trying to launch Indigo then that means the Indigo client version being launched doesn't match the version of Indigo Server currently being run. This can occur when an older version of Indigo Server is still running or an older version of Indigo Client was launched by mistake. To fix this follow these steps:

1. Shut down the Indigo Server by selecting the `Indigo 7.2->Stop Server` menu item in the Mac client. This will shut down the Indigo Server regardless of which version is running.
1. Quit the Mac client via the `Indigo 7.2->Quit Indigo` menu item.
1. Open the `/Applications` folder on your Mac and launch the version of Indigo you wish to use. This will have it launch the correct version of the Indigo Server when it starts.

Once you are sure you are ready to run the latest version of Indigo can delete (backup first!) the older Indigo Server install paths in `/Library/Application Support/Perceptive Automation/` and client applications in `/Applications`.

### Upgrading from Indigo 7, or 7.1
For this release, we've changed the server install path to:

    /Library/Application Support/Perceptive Automation/Indigo {{ version }}/

and the Indigo Mac Client app is now named:

    /Applications/Indigo {{ version }}.app

In addition to the automatic upgrade logic described below (for upgrades from Indigo 6 and earlier), the installer is now smarter and moves previously installed control page images and web server plugins to the new install location. Note the folder that contains Web server images, legacy Web plugins, etc. has been renamed from:

    /Library/Application Support/Perceptive Automation/Indigo 7/IndigoWebServer/

to:

    /Library/Application Support/Perceptive Automation/Indigo {{ version }}/Web Assets/

If you experience the error `This version of the Indigo client application is not compatible with the Indigo Server` when trying to launch Indigo then that means the Indigo client version being launched doesn't match the version of Indigo Server currently being run. This can occur when an older version of Indigo Server is still running or an older version of Indigo Client was launched by mistake. To fix this follow these steps:

1. Shut down the Indigo Server by selecting the `Indigo 7->Stop Server` menu item in the Mac client. This will shut down the Indigo Server regardless of which version is running.
1. Quit the Mac client via the `Indigo 7->Quit Indigo` menu item.
1. Open the `/Applications` folder on your Mac and launch the version of Indigo you wish to use. This will have it launch the correct version of the Indigo Server when it starts.

Once you are sure you are ready to run the latest version of Indigo can delete (backup first!) the older Indigo Server install paths in `/Library/Application Support/Perceptive Automation/` and client applications in `/Applications`.

### Upgrading from Indigo 6, 5, 4, 3, or 2
First, run the Indigo {{ version }} installer. Then look through this list for any final actions.

- We have moved to Python v3.x, so if you installed any shared scripts ([as outlined here](../../scripting/tutorial.md#shared-classes-and-methods-in-python-files-python-modules)) then you'll need to move them from: `/Library/Python/X.X/site-packages/` to `/Library/Python/3.11/site-packages/`
- Indigo will automatically copy your old preference file into the new location during the installation.
- Indigo will also copy over any enabled and disabled Plugins from Indigo 6 or 5. If a newer version of a plugin is included in Indigo, then it will automatically be installed and used on launch.
- Your old Indigo database file will automatically be converted to the new Indigo file format on first launch. A copy of your database will automatically be made before it is converted, but any changes made in Indigo to your database will not be available in older versions of Indigo.
- If you are **upgrading from Indigo 6**, you'll need to manually copy over any custom scripts, web server plugins, and/or custom control page images that you may have added. They can be found in the following directories:
    - **Scripts**: `/Library/Application Support/Perceptive Automation/Indigo 6/Scripts/`
    - **Control Page Images**: `/Library/Application Support/Perceptive Automation/Indigo 6/IndigoWebServer/images/`
    - **Web Server Plugins**: `/Library/Application Support/Perceptive Automation/Indigo 6/IndigoWebServer/plugins/`
- If you are **upgrading from Indigo 5**, you'll need to manually copy over any custom scripts, web server plugins, and/or custom control page images that you may have added. They can be found in the following directories:
    - **Scripts**: `/Library/Application Support/Perceptive Automation/Indigo 5/Scripts/`
    - **Control Page Images**: `/Library/Application Support/Perceptive Automation/Indigo 5/IndigoWebServer/images/`
    - **Web Server Plugins**: `/Library/Application Support/Perceptive Automation/Indigo 5/IndigoWebServer/plugins/`
- If you are **upgrading from Indigo 4**, you'll need to manually copy over any custom scripts, web server plugins, and/or custom control page images that you may have added. They can be found in the following directories:
    - **Scripts**: `/Library/Application Support/Perceptive Automation/Indigo 4/Scripts/`
    - **Control Page Images**: `/Library/Application Support/Perceptive Automation/Indigo 4/IndigoWebServer/images/`
    - **Web Server Plugins**: `/Library/Application Support/Perceptive Automation/Indigo 4/IndigoWebServer/plugins/`
- If you are **upgrading from Indigo 3 or Indigo 2**, you'll need to manually copy over any custom scripts and/or custom control page images that you may have added. They can be found in the following directories:
    - **Scripts**: `/Library/Application Support/Perceptive Automation/Indigo 2/Scripts/`
    - **Control Page Images**: `/Library/Application Support/Perceptive Automation/Indigo 2/IndigoWebServer/images/`

!!! warning "NOTE"
    Do not replace the new Indigo versions of any file with your Indigo 6, 5, 4, 3, or 2 files. They have been modified to run optimally under the new version of Indigo.

### Upgrading from Indigo 1.x

- Indigo will automatically copy your old preference file into the new location on first launch.
- Your old Indigo database file will automatically be converted to the new Indigo file format on first launch. You will be prompted to save the new copy of the Indigo database file. The new Indigo file format is not compatible with Indigo 1.x. You should not replace or delete your older Indigo 1.x database file. Any changes made in Indigo to your database settings will not be available in older versions of Indigo.
- You will need to manually copy any of your custom script files. You only need to move the files from the Indigo 1.x location (`[~your user home folder]/Documents/Indigo User Data/Scripts/`) to the new folder specified above if you modified or added new script or script attachment files.

!!! warning "NOTE"
    Do not replace the new Indigo versions of any file with your Indigo 1.x files. They have been modified to run optimally under the new version of Indigo.

## AppleScript after Upgrading
Indigo no longer supports AppleScripts that target the Indigo Server process. Check out the [AppleScript Integration Strategies](https://www.indigodomo.com/indigo/applescript.html) article for options on converting your AppleScripts.

When Indigo first opens an Indigo 7.3 (or earlier) database, it will go through the database and identify items that will need changing and items you should look at to ensure that it will continue to function. The Event Log will contain the necessary information about where you can find those items. You can also select the `Help->Show AppleScript Usage in Event Log` menu item and Indigo will show you the list of those items in the Event Log window again.

Embedded AppleScripts and AppleScript conditionals will need to be evaluated to best determine how to handle them. In those edit boxes in the UI, we've commented out the previous AppleScript for reference if you wish to convert them. Both of those script edit boxes now will only accept Python scripts.

If you have [Execute Script](../concepts/actions.md#execute-script) actions that point to AppleScripts, those will continue to be run, though if the script contains a **tell "IndigoServer"** or **using terms from "IndigoServer"** they will fail.

## Python Script Changes and Plugin Compatibility
All Indigo embedded and external Python scripts run in Python 3. If any of them aren't working, they may have been written for an older version of Python. Take a look at our [updating to Python 3 tips](https://github.com/IndigoDomotics/IndigoSDK/blob/main/Updating%20to%20API%20version%203.0%20(Python%203).md) document. You can also post your scripts on the [Help Converting to Python 3 forum](https://forums.indigodomo.com/viewforum.php?f=364) to get help with any conversion issues.
