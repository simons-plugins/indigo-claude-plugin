# Testing Patterns

How to test Indigo plugins. Two complementary patterns:

- **Pattern A — Unit tests with mocks**: fast, no Indigo runtime required, runs in CI.
- **Pattern B — Live integration with TestingBase**: exercises a real running Indigo server, catches integration bugs and validates plugin XML.

They are complementary, not alternatives. Run A often, B before a release.

---

## Pattern A — Unit tests with a mocked Indigo runtime

Mock `indigo` via `unittest.mock` and import your plugin module directly. Tests can then exercise business logic — API parsing, state computation, ConfigUI validation, scheduling — without an Indigo install.

**When to use**: anything that doesn't depend on Indigo's database — most of your plugin's logic.

**Reference shape**:

```python
# tests/conftest.py
import sys
from pathlib import Path
from unittest.mock import Mock
import pytest

SERVER_PLUGIN_DIR = (
    Path(__file__).parent.parent
    / "MyPlugin.indigoPlugin"
    / "Contents"
    / "Server Plugin"
)
sys.path.insert(0, str(SERVER_PLUGIN_DIR))


@pytest.fixture
def mock_logger():
    # Mock() auto-creates these attributes on first access — the explicit
    # assignment is for readability so test failures point at named mocks.
    logger = Mock()
    for level in ("debug", "info", "warning", "error", "exception"):
        setattr(logger, level, Mock())
    return logger
```

Tests then import plugin modules and inject `mock_logger` (and other fixtures) where the plugin would normally use `self.logger`. Run with `pytest` — no Indigo running, no credentials, no network.

---

## Pattern B — Live integration with TestingBase

Indigo ships [`TestingBase`](https://github.com/IndigoDomotics/TestingBase) as a shared git submodule. Tests subclass `APIBase` — an abstract `unittest.TestCase` — and exercise a running Indigo server's HTTP API. The companion `ValidateXmlFile` helper validates `Devices.xml`, `Actions.xml`, `Events.xml`, and `MenuItems.xml` against the Indigo schema.

**When to use**: pre-release smoke tests; XML schema validation; end-to-end checks against your plugin's HTTP responder.

**Setup**:

```bash
# At the top level of your plugin repo
git submodule add https://github.com/IndigoDomotics/TestingBase.git tests/shared
git submodule update --init
```

**Layout** (the convention TestingBase expects):

```
my-plugin/
├── tests/
│   ├── shared/                       # submodule — do NOT edit
│   ├── .env                          # gitignored — Indigo API credentials
│   ├── testing-requirements.txt      # references shared/module-requirements.txt
│   ├── venv/                         # gitignored — your test venv
│   └── test_my_plugin.py
```

`tests/.env` carries credentials — see `tests/shared/ENV_TEMPLATE` for the exact keys. `tests/testing-requirements.txt` should chain to the shared list:

```
-r shared/module-requirements.txt
# anything else your tests need
```

**Minimal `APIBase` test**:

```python
# tests/test_my_plugin.py
from shared import APIBase

class TestMyPlugin(APIBase):
    def test_device_reachable(self):
        device = self.get_indigo_object(<device_id>)
        self.assertTrue(device["enabled"])
```

**XML validation** — `ValidateXmlFile` MUST come first in the MRO. Resolve the path relative to the test file so the test runs on any machine:

```python
import os
from shared import APIBase, ValidateXmlFile

class TestActionsXml(ValidateXmlFile, APIBase):
    server_plugin_dir_path = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "../MyPlugin.indigoPlugin/Contents/Server Plugin",
        )
    )
    file_name = "Actions.xml"
```

**Maintenance**: `tests/shared` is a submodule. Pull updates with
`git submodule update --recursive --remote tests/shared` and never commit
local changes back to it — the upstream README is explicit about that.

---

## Choosing between A and B

| | Pattern A (mocks) | Pattern B (TestingBase) |
|---|---|---|
| Speed | Seconds | Slower — HTTP round-trips per assertion; helpers like `run_host_script` spawn an IPH3 process per call |
| Indigo install needed | No | Yes — running server + admin API access |
| What it catches | Logic errors | Integration + XML schema errors |
| Best for | CI on every PR | Pre-release smoke |

Use both for any non-trivial plugin: A on every commit, B before each release.

---

## TestingBase conventions worth knowing

The upstream [TestingBase repo](https://github.com/IndigoDomotics/TestingBase) is the authoritative source for TestingBase usage — its `README.md` and `example_test_xml_files.py` document the public API. `/indigo:dev` covers Indigo plugin SDK questions; for TestingBase-specific questions, read upstream first.

A few conventions that aren't intuitive and have bitten downstream consumers:

### `run_host_script` uses `return`, not `print`

`tests/shared/utils.py:run_host_script(script)` wraps `indigo-host -e <script>`. Indigo wraps your script as a function body; `print()` goes to Indigo's event log, not the subprocess stdout. Use `return` to send a value back:

```python
# WRONG — print goes to event log, run_host_script returns ""
script = "print(indigo.server.getInstallFolderPath())"

# RIGHT — return value comes back via stdout
script = "return indigo.server.getInstallFolderPath()"
```

Upstream's own `tests/shared/utils.py:get_install_folder` uses the same `return` convention. Result is always a string — JSON-encode and decode if you need richer types.

### Plugin state is not on the HTTP API — use the IOM

Indigo's HTTP API (`/v2/api/indigo.<endpoint>`) only knows about `devices`, `variables`, `actionGroups`, `controlPages`, `logs`, `triggers`, `schedules`. There is no `indigo.plugins` endpoint. Plugin state queries (`isEnabled`, `isRunning`, `isInstalled`) go through the IOM via `run_host_script`:

```python
from shared import APIBase
from shared.utils import run_host_script

class TestPluginLoaded(APIBase):
    def test_loaded(self):
        script = (
            f"plugin = indigo.server.getPlugin('{self.plugin_id}')\n"
            f"if plugin is None:\n"
            f"    return 'state=missing'\n"
            f"return f'state=found|enabled={{plugin.isEnabled()}}|running={{plugin.isRunning()}}'\n"
        )
        result = run_host_script(script)
        self.assertIn("enabled=True", result, f"indigo-host returned: {result!r}")
```

The plugin object's API (`isInstalled()`, `isEnabled()`, `isRunning()`, plus several properties) is documented in `/indigo:dev` → `docs/plugin-dev/api/iom/command-namespaces.md` under "Plugin Object Access". That's the SDK side; this section covers how to *invoke* it from a TestingBase test.

### `/usr/local/indigo/` must be traversable by your user

A fresh Indigo 2025.2 install sets `drwxrwx---  root:wheel` on `/usr/local/indigo/`, which means a regular user can't even traverse into the directory to execute `indigo-host` or `indigo-restart-plugin`. Symptom: `PermissionError: [Errno 13] Permission denied: '/usr/local/indigo/indigo-host'` raised from `subprocess.run` inside `setUpClass`.

Fix once on each developer machine:

```bash
sudo chmod 0755 /usr/local/indigo/   # makes the dir traversable + listable
```

The binaries inside stay `0770 root:admin` so only admin-group users can run them. macOS primary users are in `admin` by default.

### Reflector setup needs an Indigo Server restart

If `URL_PREFIX` points at a brand-new reflector (e.g. `https://yourname.indigodomo.net`), the reflector address resolves immediately but indigodomo.com's reflector service shows "Reflector Not Found" until Indigo Server is restarted with the reflector configured. Symptom: `httpx` returns HTTP 200 with the public indigodomo.com error page (HTML, not JSON). Fix: restart Indigo Server after enabling the reflector.

### Local IWS is HTTP, not HTTPS

`URL_PREFIX=https://localhost:8176` gives an SSL handshake timeout — local Indigo Web Server is HTTP-only by default. Use `http://localhost:8176` for direct local testing, or a reflector for HTTPS. The upstream `ENV_TEMPLATE` shows `https://localhost:8176` as the default, which is misleading for local-only setups.

---

## References

- TestingBase upstream (authoritative for TestingBase): https://github.com/IndigoDomotics/TestingBase
- TestingBase upstream `example_test_xml_files.py`: shows the canonical `ValidateXmlFile` patterns
- Plugin HTTP API (consumed by Pattern B): see `/indigo:api`
- Plugin lifecycle (what you'd typically test): see `concepts/plugin-lifecycle.md`
- Plugin Object Access (the IOM surface for plugin queries): see `docs/plugin-dev/api/iom/command-namespaces.md` — "Plugin Object Access" section
