<!-- GENERATED from https://docs.indigodomo.com/2025.2/user/troubleshooting/python-conflicts/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Python Version Conflicts

!!! abstract "In this guide"
    This page explains why Python version and module conflicts occur when multiple Python installations coexist on your
    Mac, and how to ensure scripts and packages use the correct Indigo-managed Python interpreter.

Over the years, we've seen multiple reports of issues concerning Python modules, Python versions etc. We'd like to clear this up so that when people run across issues you can understand what's going on.

## Indigo Python Installation
First and foremost - Indigo installs Python as part of the install process. We use the installers from python.org, which install here on your Indigo Server Mac:

```text
/Library/Frameworks/Python.framework/
```

Inside that directory are the versions that either we have installed (2.7, 3.10, 3.11 etc.) or which might have been installed by you if you downloaded a Python installer from python.org. Which ones are present is based on the Indigo release you're using. Since Indigo 2022.1, Indigo has been using Python 3.

### Starting up the Python interpreter installed by Indigo
If you need to use the Python interpreter installed by Indigo directly from a command line (or shebang), it's always  safest to be explicit in the path to the executable. There are tradeoffs though, so here are the various ways from most specific to least:

1. `/Library/Frameworks/Python.framework/Versions/3.11/bin/python3` - this is the most explicit way to start up the 3.11 interpreter installed by Indigo.
1. `/usr/local/bin/python3.11` - this is a symlink to the above option, and has the same downside. In addition, though, since it's a symlink in a more public directory, it could get updated by something else entirely.
1. `/Library/Frameworks/Python.framework/Versions/Current/bin/python3` - the downside to this option is that if you (for some reason) install an older version, the installer might update that link to point to the older version.
1. `/usr/local/bin/python3` - this option is created/maintained by the Python installer as well, so it has the same benefits/issues of the last option, but also since it's a symlink it could get munged by some other installer (homebrew/macports).

### Installing packages using the right pip3
In the same way discussed above (using the right interpreter), you will find the same options for installing Python packages with **pip**.

1. `/Library/Frameworks/Python.framework/Versions/3.11/bin/pip3` - this is the most explicit way to start up the 3.11 interpreter installed by Indigo.
1. `/usr/local/bin/pip3.11` - this is a symlink to the above option, and has the same downside. In addition, though, since it's a symlink in a more public directory, it could get updated by something else entirely.
1. `/Library/Frameworks/Python.framework/Versions/Current/bin/pip3` - the downside to this is that if you (for some reason) install an older version, the installer might update that link to point to the older version.
1. `/usr/local/bin/pip3` - this option is created/maintained by the Python installer as well, so it has the same benefits/issues of the last option, but also since it's a symlink it could get munged by some other installer (homebrew/macports).

## Other Python Installs
So far, we've only discussed Python installations that are performed from the macOS installers available on python.org (which we use from our installer). Problems can arise when you (or some installer you run) installs a different 3rd party version of Python. The three most common sources of a 3rd party Python install are: homebrew, macports, and Xcode. Each will leave the existing Indigo-installed Pythons alone (so Indigo will continue to work), but they will insert themselves in unexpected ways, like by altering the **PATH** in your terminal sessions to point to other locations, unexpectedly replacing symlinks, or my installing into locations that are in your PATH variable before `/usr/local/bin` (making it very dangerous to just open a terminal window and typing in **python** or **pip3**).

### Xcode
Xcode installs Python 3.9 (as of Xcode 14.2) inside the Xcode application bundle, and inserts these executables **/usr/bin/python3** and **/usr/bin/pip3**. Often times, **/usr/bin** is very early in the PATH so if you don't specify full paths you'll end up getting the wrong python or pip. This is especially troublesome in that if you don't have Xcode installed, and you type just **pip3** in a terminal, it will prompt you to install Xcode and Python 3.9. Buyer beware!

### homebrew & macports
We believe homebrew and macports install their Python installs under a directory they create called opt (short for optional):

```text
/opt/local/Library/Frameworks/Python.framework/
```

so it's nice and separate, but it will also likely add items to your **PATH** which will point to these locations for **python3** and **pip3**, so again if you don't specify a full path you might not be getting the right one.

## Troubleshooting
Each of the different installers mentioned above will do several things:

They will insert paths into the various `.login`, `.profile`, `.bashrc` files such that their version of Python (and its executables) are found first when typing any of the Python commands from the shell without a full path. They set the **PYTHONPATH** (which is a list of file system paths that the Python interpreter looks in to find modules not part of the standard install like those installed by **pip3**) so that they look in their own site-packages directories

Let's start with the second one first: they will add their own `site-packages` directories (i.e. `/opt/local/Library/Frameworks/Python.framework/Versions/3.10/lib/python3.10/site-packages`) as well as the one from our Python install (`/Library/Frameworks/Python.framework/Versions/3.10/lib/python3.10/site-packages`) to **PYTHONPATH**. This will, on the surface, make it seem that they're working OK because they're finding things that may have been installed prior to their installation.

The problem is that when you install further modules using **pip3** (**the one they installed for you** since you didn't specify a full path), those modules will get installed into their site-packages directory rather than the one from our Python install (`/Library/Frameworks/Python.framework/Versions/3.10/lib/python3.10/site-packages`). So anything new you install won't be accessible from the Python that Indigo installs and uses. But when you test from a shell script, using the **python** (*the one they installed for you* since you didn't specify a full path) command, it works. This is because that command isn't using our Python. This duality makes it very confusing to figure out what's going on because it appears to work from a shell but not from Indigo.

It is possible that you can manage having multiple Python installs - you just have to remember which paths to executables you need to use to get modules installed in the correct place.

We **highly** recommend that you do not install 3rd party Pythons. This will make sure that your Indigo experience is as painless as possible.
