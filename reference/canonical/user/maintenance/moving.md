<!-- GENERATED from https://docs.indigodomo.com/2025.2/user/maintenance/moving/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Moving Indigo to Another Computer

!!! abstract "In this guide"
    This guide describes how to move your Indigo installation to another computer, another computer with a different processor architecture, or restoring from a backup.

## Moving Indigo to another Mac or Restoring From a Backup
Note this process can also be followed to recover from a backup, though if your system crashed then you may need to contact us directly to perform step #1 for you.

1. Deactivate Indigo on your Mac by selecting the `Indigo {{ version }}->License Details...` menu item and clicking the `Deactivate License` button. Do this while the Indigo Server is still running (do not shutdown the Indigo Server first)
1. Copy this folder over to the new Mac: `/Library/Application Support/Perceptive Automation/Indigo {{ version }}/` (if restoring from a backup, you'll need to locate this folder in whatever backup system you use)
1. Install Indigo {{ version }} on the new Mac ([download](https://www.indigodomo.com/downloads.html) and run the installer - you must be logged in to your Indigo Account to see all the installers available to you)

!!! warning "NOTE"
    this is not the Library folder that's in your home directory - it's the one at the top level of your hard drive. The easiest way to get there is to select the `Go->Go To Folder...` menu item in the Finder and paste in this:

`/Library/Application Support/`

It'll open the correct folder and you'll see the "Perceptive Automation" folder - that's the one you want to copy over. That should get all of your customizations and allow the installer to update anything as necessary. You may also need to install the drivers for the technology you use - see the appropriate section below for details.

If you're moving Indigo to a Mac with a different architecture, read on...

## Moving an Indigo Installation to another Architecture
When you move your Indigo installation from one macOS architecture to another (for example from an Intel-based Mac to an M-series Mac) -- especially if you use Migration Assistant or Time Machine -- you will likely need to take additional steps because many Python libraries are compiled to the specific hardware they're installed on. One signal that this has become an issue is an error message like:

```text
'/Library/Frameworks/Python.framework/Versions/3.11/lib/python3.11/site-packages/httptools/parser/parser.cpython-310-darwin.so' (mach-o file, but is an incompatible architecture (have 'x86_64', need 'arm64'))
```

If you see errors like that (*incompatible architecture*), can't get the login or license dialog to work, or you have other errors that keep Indigo from starting up, you may need to take a few extra steps:

1. manually remove the `/Library/Frameworks/Python.framework/` directory, and
1. run the Indigo installer again to reinstall Python.

Taking these additional steps should ensure that your Python installation is compiled for your new Mac and that all file permissions are properly set.
