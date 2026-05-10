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

## TestingBase conventions (from upstream docs)

The upstream [TestingBase repo](https://github.com/IndigoDomotics/TestingBase) is the **authoritative source for TestingBase usage** — its `README.md` and `example_test_xml_files.py` document the public API. `/indigo:dev` covers Indigo plugin SDK questions; for TestingBase-specific questions, read upstream first.

Two conventions from upstream that aren't intuitive at first read:

### `run_host_script` uses `return`, not `print`

Per upstream README:

> `run_host_script(script: str) -> str` — this will accept an Indigo Python script, run it against the IPH, and **return whatever value the script returns**.

Indigo wraps your script as a function body; `print()` inside it goes to Indigo's event log, not the subprocess stdout. Use `return` to send a value back:

```python
# WRONG — print goes to event log, run_host_script returns ""
script = "print(indigo.server.getInstallFolderPath())"

# RIGHT — return value comes back via stdout
script = "return indigo.server.getInstallFolderPath()"
```

Upstream's own `tests/shared/utils.py:get_install_folder` uses the same `return` convention. Result is always a string — JSON-encode in the script and decode in the test if you need richer types.

### Plugin state is not on the HTTP API — use the IOM

Per upstream README, `run_host_script` is *"useful for testing functions in the IOM that don't have a corresponding API method"*. Plugin state is one such case.

Indigo's HTTP API (`/v2/api/indigo.<endpoint>`) only exposes `devices`, `variables`, `actionGroups`, `controlPages`, `logs`, `triggers`, `schedules` — Indigo itself returns this list when you hit an invalid endpoint. There is no `indigo.plugins` endpoint. To query `isEnabled`, `isRunning`, or `isInstalled`, go through the IOM:

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

The plugin object's API (`isInstalled()`, `isEnabled()`, `isRunning()`, plus several properties) is in `/indigo:dev` → `docs/plugin-dev/api/iom/command-namespaces.md` under "Plugin Object Access". That's the SDK side; this section is about how to *invoke* it from a TestingBase test.

---

## Setup notes (from real-world adoption, not upstream docs)

These aren't in TestingBase's documentation — they're observations from this workspace's first adoption. Treat them as field notes; your environment may differ.

### `/usr/local/indigo/` perms can block your user from executing `indigo-host`

On at least one fresh install of Indigo 2025.2 we saw `/usr/local/indigo/` shipped as `drwxrwx--- root:wheel`. A regular user (not in `wheel`) can't even traverse into the directory to execute `indigo-host`. Symptom: `PermissionError: [Errno 13] Permission denied: '/usr/local/indigo/indigo-host'` raised from `subprocess.run` inside `setUpClass`, before any test code runs.

If you hit this, the one-time fix is:

```bash
sudo chmod 0755 /usr/local/indigo/   # makes the dir traversable + listable
```

The binaries inside stay `0770 root:admin` so only admin-group users can run them. macOS primary users are in `admin` by default. Whether this perm pattern is universal across all 2025.2 installs or installer-state-dependent is unclear — most users will never hit this since they won't be freshly setting up a developer machine. Documenting the fix here for the few who do.

### "Reflector Not Found" from a fresh reflector → restart Indigo Server

When you configure a new reflector in Indigo's preferences, the reflector address resolves immediately on the internet, but indigodomo.com's reflector service won't recognise it as live until Indigo Server is restarted. Until then, `httpx` returns HTTP 200 with the public indigodomo.com "Indigo Reflector Not Found" HTML error page. The test will fail with assertion errors that look like JSON-parse failures.

Fix: restart Indigo Server after enabling the reflector. Same applies if you change the reflector subdomain.

This is an Indigo Server quirk, not a TestingBase issue — but worth knowing because the failure mode is confusing (the test sees a 200, not a 404).

### `URL_PREFIX` must match your Indigo Server's HTTPS configuration

The upstream `ENV_TEMPLATE` shows `shared.URL_PREFIX=https://localhost:8176` as the default. Whether that's correct depends on how your Indigo Server is configured:

- **If Indigo allows HTTP on localhost** (the typical out-of-box setup): use `http://localhost:8176`. The default `https://` form will give an SSL handshake timeout because the local IWS isn't terminating TLS.
- **If you've enabled "force HTTPS" in Indigo's Server preferences**, or you're hitting a Reflector: use `https://...`.
- **If you're using a Reflector** (e.g. `https://yourname.indigodomo.net`): always `https://`.

The right `URL_PREFIX` is whatever protocol your specific server is configured to accept — check Indigo's Server preferences if unsure. Match it; the upstream default is reasonable for the Reflector case but assumes a particular config for localhost.

---

## References

- TestingBase upstream (authoritative for TestingBase usage): https://github.com/IndigoDomotics/TestingBase
- TestingBase upstream `example_test_xml_files.py`: canonical `ValidateXmlFile` patterns
- Plugin HTTP API (consumed by Pattern B): see `/indigo:api`
- Plugin lifecycle (what you'd typically test): see `concepts/plugin-lifecycle.md`
- Plugin Object Access (the IOM surface for plugin queries): `docs/plugin-dev/api/iom/command-namespaces.md` — "Plugin Object Access" section
