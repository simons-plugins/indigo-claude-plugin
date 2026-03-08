# Scripting Shell & CLI

Indigo provides an interactive Python scripting shell and a command-line interface for running scripts outside of plugins.

## Interactive Scripting Shell (IPH)

Open via **Plugins > Open Scripting Shell** in the Indigo application.

The shell provides a Python REPL with full access to the Indigo Object Model:

```python
>>> indigo.devices["Hallway Light"].onState
True
>>> indigo.device.turnOff("Hallway Light")
>>> indigo.variables["myVar"].value
'42'
>>> indigo.variable.updateValue("myVar", value="100")
```

Useful for:
- Testing API calls before adding them to a plugin
- Quick device control and state inspection
- Debugging device properties and states
- Exploring the Indigo Object Model interactively

## Command-Line Interface

### Run a Script File

```bash
/Library/Application\ Support/Perceptive\ Automation/Indigo\ 2023.2/IndigoPluginHost.app/Contents/MacOS/IndigoPluginHost -x /path/to/script.py
```

### Run Inline Code

```bash
/Library/Application\ Support/Perceptive\ Automation/Indigo\ 2023.2/IndigoPluginHost.app/Contents/MacOS/IndigoPluginHost -e 'indigo.device.turnOn("Hallway Light")'
```

### SSH Remote Access

You can run Indigo scripts remotely via SSH:

```bash
ssh user@indigo-mac '/Library/Application\ Support/Perceptive\ Automation/Indigo\ 2023.2/IndigoPluginHost.app/Contents/MacOS/IndigoPluginHost -e "indigo.server.log(\"Hello from SSH\")"'
```

## Notes

- The scripting shell and CLI share the same Python environment as plugins
- Scripts run via CLI have full access to the Indigo Object Model
- The CLI is useful for cron jobs, automation scripts, and CI/CD integration
- All logging from CLI scripts appears in the Indigo Event Log

## See Also

- [Plugin Lifecycle](plugin-lifecycle.md) - How plugins run within Indigo
- [Indigo Object Model](../api/indigo-object-model.md) - Available API
