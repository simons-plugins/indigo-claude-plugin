<!-- GENERATED from https://docs.indigodomo.com/2025.2/plugin-dev/reference/plugin-py/additional-topics/ by tools/refresh_canonical.py — DO NOT EDIT. Run the script to refresh. -->

# Additional Topics

## Plugin Preferences File
The plugin's preferences are stored in its preferences file. Plugin prefs are cached but are flushed periodically to the actual preference file. It will also automatically flush when the plugin exits.


## 3rd Party Python Libraries
Indigo {{ version }} includes a variety of popular 3rd party Python libraries which are described on the [Python Packages](../../../scripting/guides/python-packages.md) page. Any changes to the libraries installed will be detailed there. 

!!! warning
    You should not make changes to the packages that Indigo installs. If you need a different package version, you should include it within your plugin package distribution.


## Setting Up a Development Environment
Many plugin developers choose to write their code in an IDE (Integrated Development Environment) such as [PyCharm](https://www.jetbrains.com/pycharm/) or [pdb](https://docs.python.org/3/library/pdb.html). There are several tips that will make using IDEs to develop Indigo Plugins more effective on the [Setting Up a Development Environment](../dev-environment.md) page.
