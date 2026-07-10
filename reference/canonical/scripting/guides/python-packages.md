<!-- GENERATED from https://docs.indigodomo.com/2025.2/scripting/guides/python-packages/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Python Packages and Indigo

!!! abstract "In this guide"
    How Python 3.11 is bundled with Indigo {{ version }}, which packages come pre-installed, how to install additional packages using `pip3`, and where plugin packages should be installed to avoid conflicts. Also covers the risks of installing other Python versions on the same Mac.

This page describes how **Indigo {{ version }}.0** works with Python, specifically with respect to packages/libraries.

Indigo {{ version }} ships with [API version 3.8](https://www.indigodomo.com/indigo/api_release_notes/3.8/) (check the [Api Version Chart](https://www.indigodomo.com/indigo/api_version_chart.html) to see what version of the API is available in which Indigo versions). Python 3 support was introduced in Indigo 2023.2 (API 3.4), and Python 3 is automatically installed as part of the Indigo installer. For Indigo {{ version }}, we are including **Python 3.13**.

**All embedded and external Python scripts are run in Python 3** - so you will need to update your scripts if they aren't working (we can't automatically tell if they will work or not unfortunately). We believe that simple scripts will most likely work without change, but if not, you can walk through [the document](https://github.com/IndigoDomotics/IndigoSDK/blob/main/Updating%20to%20API%20version%203.0%20(Python%203).md) mentioned above and perhaps spot the changes you need. You can also post your scripts on the [Help Converting to Python 3](https://forums.indigodomo.com/viewforum.php?f=364) forum to get help with any conversion issues.

The Indigo {{ version }} installer includes the Python installer (including Intel and Apple Silicon support) from [https://www.python.org](https://www.python.org) - the official Mac installers for the Python language. As a result, any installs of other versions of Python from that website may cause unexpected results in Indigo and potentially cause it to break. We've taken all precautions we can try to avoid conflicts, but there is only so much we can do. So please use caution when installing other Python versions to your server machine. If you have any questions about other Python versions, [post your questions on our forums](https://forums.indigodomo.com/viewforum.php?f=106).

## Installing Additional Python Packages with Indigo {{ version }}
As noted above, Indigo {{ version }} ships with Python 3.11 and which contains several modules in addition to Python's standard core modules. The specific modules installed with each version of Python are listed below. However, in some instances, you may need to manually install one or more additional Python packages to support a third-party plugin or your own custom scripts. The manner in which this is done, depends on the Indigo API version that the plugin supports.

Use `pip3 install [package]` commands to install packages:

```text
Last login: Tue jan 1 12:34:56 on console
user@my mac ~ % pip3 install tensorflow
...
```

To see which packages are installed, use the `list` command:

```text
Last login: Tue jan 1 12:34:56 on ttys000
user@my mac ~ % pip3 list
Package            Version
------------------ ---------
astroid            2.9.3
certifi            2021.10.8
charset-normalizer 2.0.11
cycler             0.11.0
fonttools          4.29.1
...
user@my mac ~ %
```

!!! note "Note"
    Some Python packages -- and specifically those that are included in IPH3 as [described below](#python-packages-installed-by-indigo) -- will not appear in the `pip3 list` output.

To see more detailed information about an individual package, use the `show` command.

```text
Last login: Sun Mar 27 10:20:04 on ttys000
user@my mac ~ % pip3 show requests
Name: requests
Version: 2.27.1
Summary: Python HTTP for Humans.
Home-page: https://requests.readthedocs.io
Author: Kenneth Reitz
Author-email: me@kennethreitz.org
License: Apache 2.0
Location: /Library/Frameworks/Python.framework/Versions/3.11/lib/python3.11/site-packages
Requires: charset-normalizer, certifi, idna, urllib3
Required-by:
user@my mac ~ %
```

Particularly helpful in the `show` output is the dependencies information -- both what the package requires and what requires the package. Note that the dependencies information may not include information about packages that are included with the IPH.

!!! warning
    Installing additional Python versions on the Indigo {{ version }} server machine is ****NOT**** recommended (see above). Installing additional Python modules should only be done when necessary.

### Python Packages for Plugin Developers
Because the packages included with Indigo should not be modified (to ensure a smoothly running server), plugin developers must include any other desired version within the plugin package. Plugin developers should note that some Python packages will not integrate universally across all installations as they rely on code compiled for specific hardware configurations (for example, Intel vs. Apple silicon). The IPH processes use the following [Module Search Paths](https://docs.python.org/3/tutorial/modules.html#the-module-search-path) (Python interpreters use `PYTHONPATH` to describe the order of directories to search for installed packages, the first matching package will be used):

The `PYTHONPATH` for IPH3 is:

1. `Contents/Server Plugin` (inside the plugin bundle)
1. `Contents/Packages` (inside the plugin bundle)
1. IndigoPluginHost3 (inside the app itself)
1. `/Library/Application Support/Perceptive Automation/Python3-includes`
1. `/Library/Frameworks/Python.framework/Versions/3.11/lib/python3.11/site-packages`

Packages are installed in several ways:

1. You may add modules/packages **that you develop yourself** to the `Python#-includes` folders above, and those will be shared across all Indigo Plugins and Scripts.
1. Other packages are installed using a `pip3` process. **<span class="dw-color-orange">Warning</span>**: Indigo will preinstall several packages ([listed below](#python-packages-installed-by-indigo)) at install time. You should avoid modifying those unless absolutely necessary as other 3rd party plugins may rely on them.

If you are going to instruct users to install packages that support your plugin using *`pip`*, you should probably do one of the following:

#### Using a "requirements.txt" File
If your plugin requires libraries that are not part of the basic Python installation or packages installed by Indigo, the preferred method is to include a list of those modules so Indigo can install them automatically when your plugin is installed. This automatic process is available in Server API version 3.4 and later (prior API versions will not invoke this process). This is handled by the following process:

If a plugin contains the plain text file: *`Contents/Server Plugin/requirements.txt`*, we'll run *`pip`* to install the listed modules into *`Contents/Packages`* (an example is shown below).

1. When a plugin starts up, it'll look for the *`Contents/Server Plugin/requirements.txt`* file. If it's not there, we'll continue with plugin startup. If it **is** there, we'll proceed to the next step.
1. Indigo will check to see if this file exists: *`Contents/Packages/pip-install-log-success.txt`*. If it does exist (meaning that we've already successfully installed requirements before), we will continue plugin startup. If it doesn't exist, we'll proceed to the next step.
1. We run *`pip3`* with the requirements file and target the *`Contents/Package`* directory (all libraries and dependencies will be installed there). If it fails, we output an error and log the install attempt to the Event Log window and stop the plugin. If it installs correctly, we write the install log results to the *`Contents/Packages/pip-install-log-success.txt`* file so that the next time it starts it won't do it again (see previous step above).

If processing the *`requirements.txt`* file has failed (say, if the network is down so that pip can't get to pypi.org to download), it will continue to try when the user reloads the plugin, so transient issues will eventually resolve themselves. If the error is caused by a problem with the *`requirements.txt`* file or with a specific requirement, the developer will need to address in a new version.

Here is a sample *`requirements.txt`* file. Note that the following includes references to specific versions of the packages to be installed. We strongly recommend this approach to minimize the possibility that a newer version could be installed which may cause problems with your plugin.
```text
zeroconf==0.130.0
websocket-client==1.7.0
```

**Best Practices:**

If you're using GitHub, be sure that the contents of the `*../Packages*` folder is included in your `*.gitignore*` file. This will ensure the `*Contents/Packages/pip-install-log-success.txt*` and any other content is not included as a part of your package. When testing your plugin, you should include any needed binaries in this folder so when you publish an update, the binaries will not be included.

**Troubleshooting:**

If you find that packages are not being installed when a user installs/updates your plugin, one cause might be that you have a *`Contents/Packages/pip-install-log-success.txt`* file left over in your plugin bundle. If it's in the bundle, Indigo will assume the packages are already installed.

If you're working on transitioning from included binaries to using a `*requirements.txt*` file, be sure to remove the deprecated binaries from your package. If they're present, Indigo may favor those over the libraries you're trying to install automatically.

##### Manual Installation by User
**Using pip:**

If you're going to instruct users to install needed packages individually, they should use a command similar to:
`pip3 install package -t /Path/To/Plugin/Contents/Packages/`
or, if a specific version is required, use:

```text
pip3 install package==1.2.3 -t /Path/To/Plugin/Contents/Packages/
```

which will install the libraries to the specified folder that exists in your plugin bundle. It is strongly recommended that you use the *`Packages`* folder as this may be required in future versions of Indigo.

**Logging Import Errors**

If your plugin requires one or more libraries that your users will install manually, you should provide some helpful messages to guide them through the process. One such way is to monitor import failures and notify users that they will need to install some additional libraries in order to use your plugin, such as:

```python
import_errors = []
try:
    import zeroconf
except ImportError:
    import_errors.append("zeroconf")
```

```python
def startup(self):
    self.logger.debug("startup called")

    if len(import_errors):
        msg = f"Required Python libraries missing.  Run the following command(s) in a Terminal window to install them, then reload the plugin.\n\n"
        for i in import_errors:
            msg += f'pip3 install {i} -t "{self.pluginFolderPath}/Contents/Packages/"\n'
        self.logger.error(msg)
        return "Plugin startup canceled due to missing Python libraries."
```

#### Access to IPH3 Libraries
There are some important implications that result from having some libraries included in the IPH3.  Namely, those packages will be available to plugins, Indigo scripts (embedded and linked), the Indigo python shell (from the menu item or by doing `indigo-host` in a terminal window), but IPH3 libraries will ****NOT**** be available if you start the python interpreter  directly (by doing python2 or python3 in a terminal window).  Refer to this chart to determine accessibility:

| Method | Access to<br>IPH3 Libraries |
| --- | --- |
| plugins | yes |
| embedded scripts | yes |
| linked scripts | yes |
| Indigo python shell using Indigo menu | yes |
| Indigo python shell using Terminal `indigo-host` | yes |
| Mac Terminal using `python3` command | no |


#### Python Packages for Scripters
All Python scripts (either embedded or linked) are executed using the IPH3 process using Python 3. Therefore, the server will be able to locate any packages your scripts use in the same way as described above:

1. IndigoPluginHost3
1. /Library/Application Support/Perceptive Automation/Python3-includes
1. /Library/Frameworks/Python.framework/Versions/3.11/lib/python3.11/site-packages

If you need a module/package for your plugin, you can install it via `pip3` as shown above, which will install it into the Python `site-packages` folder. We recommend (but don't require) the following folders be used for custom scripts and modules:

- **/Library/Application Support/Perceptive Automation/Scripts** -- any linked scripts you use for Indigo Schedules and Actions using the "Execute Script > Script and File Actions" command should be stored in this folder.
- **/Library/Application Support/Perceptive Automation/Python3-includes** -- any modules you have developed (a module is a file that contains classes, functions, constants, etc.) that you want to share across multiple scripts, should be stored in the `/Library/Application Support/Perceptive Automation/Python3-includes` folder. (Indigo versions prior to 2022 should use the `/Library/Application Support/Perceptive Automation/Python2-includes` folder).

!!! warning "Warning 1"
    As mentioned above, Indigo will preinstall several packages ([listed below](#python-packages-installed-by-indigo)) at install time. You should avoid modifying those unless absolutely necessary as other 3rd party plugins may rely on them.

!!! warning "Warning 2"
    You should use caution when naming your custom scripts to ensure they don't supplant other Python packages. For example, if you install the **holidays** Python package using `pip3 install holidays`, it will be installed in the **site-packages** folder. If you also have a custom script in the `Python3-includes` folder named **holidays.py**, the IPH will import your script instead of the **site-packages** version (because the Python3-includes folder is searched before the site-packages folder).

#### If Something Goes Wrong
To provide users with a measure of safety regarding the Python packages that Indigo installs, the Indigo installer also includes the capacity to repair the Python installation if something should become damaged. For example, if a user were to accidentally upgrade one of the Python packages -- and as a result cause the Indigo server to stop functioning properly -- re-running the Indigo installer may be able to bring things back under control. There's [a few things you can try](../../user/troubleshooting/python-conflicts.md) should you run into conflicts between Python versions.

Re-running the Indigo installer on an existing server shouldn't affect user-installed libraries (existing user-installed libraries should be unaffected).

#### Moving Indigo to a New Machine
Depending on the method used, any Python modules installed via **pip3** may need to be re-installed on the new machine. For more information, consult [Moving an Indigo Installation to Another Mac](../../user/maintenance/moving.md).

#### Python 3.11.6 Packages Installed by Indigo { #python-packages-installed-by-indigo }
Indigo {{ version }} ships with support for the following Python 3 packages in addition to the packages installed with the standard Python framework. Generally, if earlier versions of the listed packages are installed at the location Indigo uses, they will be upgraded to the version numbers below. The *`>=`* symbol means the version installed by Indigo may be newer than the version listed, but will not be older. *`pyserial`* is also installed but is installed differently than the other packages listed above and should be unmodifiable. Libraries marked with * are dependencies and may get newer versions on later installs. **You should not update any of the libraries listed as they (and their dependencies may rely on a specific version.)**

| PIP installed by Indigo<br>PIP Modifiable (but not recommended) |              |
|-----------------------------------------------------------------|--------------|
| Package                                                         | Version      |
| * aiofiles                                                      | >=24.1.0     |
| * anyio                                                         | >=4.8.0      |
| certifi                                                         | ==2023.11.17 |
| * cffi                                                          | >=1.17.1     |
| charset_normalizer                                              | ==3.3.2      |
| * contourpy                                                     | >=1.3.1      |
| cryptography                                                    | ==41.0.7     |
| * cycler                                                        | >=0.12.1     |
| dictdiffer                                                      | ==0.9.0      |
| * fonttools                                                     | >=4.56.0     |
| future                                                          | ==0.18.3     |
| * h11                                                           | >=0.14.0     |
| * html5tagger                                                   | >=1.3.0      |
| * httpcore                                                      | >=1.0.7      |
| * httptools                                                     | >=0.6.4      |
| httpx                                                           | ==0.25.2     |
| idna                                                            | ==3.6        |
| janus                                                           | ==1.0.0      |
| * jedi                                                          | >=0.19.2     |
| Jinja2                                                          | ==3.1.2      |
| * kiwisolver                                                    | >=1.4.8      |
| MarkupSafe                                                      | ==2.1.3      |
| matplotlib                                                      | ==3.8.2      |
| * multidict                                                     | >=6.1.0      |
| * numpy                                                         | >=1.26.4     |
| oauthlib                                                        | ==3.2.2      |
| * packaging                                                     | >=24.2       |
| * parso                                                         | >=0.8.4      |
| Pillow                                                          | ==11.1.0     |
| pudb                                                            | ==2023.1     |
| py-applescript                                                  | ==1.0.3      |
| pyaes                                                           | ==1.6.1      |
| * pycparser                                                     | >=2.22       |
| * Pygments                                                      | >=2.19.1     |
| pyobjc                                                          | ==10.0       |
| pyparsing                                                       | ==3.1.1      |
| python-box                                                      | ==7.3.2      |
| python-dateutil                                                 | ==2.8.2      |
| requests                                                        | ==2.31.0     |
| requests-oauthlib                                               | ==1.3.1      |
| sanic                                                           | ==23.6.0     |
| * sanic-routing                                                 | >=23.12.0    |
| sanic-session                                                   | ==0.8.0      |
| scipy                                                           | ==1.11.4     |
| six                                                             | ==1.16.0     |
| * sniffio                                                       | >=1.3.1      |
| * tracerite                                                     | >=1.1.1      |
| * typing_extensions                                             | >=4.12.2     |
| * ujson                                                         | >=5.10.0     |
| urllib3                                                         | ==2.1.0      |
| * urwid                                                         | >=2.6.16     |
| * urwid-readline                                                | >=0.15.1     |
| * uvloop                                                        | >=0.21.0     |
| * wcwidth                                                       | >= 0.2.13    |
| websockets                                                      | ==14.1       |
| xmljson                                                         | ==0.2.1      |
|                                                                 |              |
| pyserial                                                        | 3.5          |


## Special Packages
This section contains notes and examples about some library features that may be of particular help to developers.

### Python Box
Depending on your Indigo version, we may have installed the [Python-Box library](https://github.com/cdgriffith/Box). This library allows the user to use JavaScript style dot notation to access parts of a collection. There are good descriptions of all the functionality on the library's page link above. What we were most interested in is a `box` instance that has the `box_dots` option set to true, like this:

```text
my_box = box.Box(some_dict, box_dots=True)
```

This allows developers to specify a string using JavaScript style dot notation to get to parts of the `box` object:

```text
some_element = my_box["keyhere.[0].anotherkey"]
```

Here are some concrete examples:

```python
import box

# Given this dictionary
my_dict = {
    "a-list":[1, 2, {"dict-in-list":"fun stuff"}],
    "a-dict":{"first":"first element", "second":"second element"}
}

my_box = box.Box(my_dict, box_dots=True)  # create a box object of my_dict

dict_in_list = my_box["a-list.[2].dict-in-list"]  # equals "fun stuff"

int_from_list = my_box["a-list.[0]"]  # equals 1

a_dict = my_box["a-dict"]  # equals {'first': 'first element', 'second': 'second element'}
```

This is useful in a variety of ways, but we use it extensively in the [Event Data Passing](../../user/automation/event-data.md) and [Webhook](../../api/webhooks.md) features. You can determine whether you have the *`box`* library installed by simply trying to import it into a scripting shell or embedded script.
