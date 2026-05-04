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
    logger = Mock()
    for level in ("debug", "info", "warning", "error", "exception"):
        setattr(logger, level, Mock())
    return logger
```

Tests then import plugin modules and inject `mock_logger` (and other fixtures) where the plugin would normally use `self.logger`. Run with `pytest` — no Indigo running, no credentials, no network.

---

## Pattern B — Live integration with TestingBase

Indigo ships [`TestingBase`](https://github.com/IndigoDomotics/TestingBase) as a shared git submodule. Tests subclass `APIBase` (a `unittest.TestCase`) and exercise a running Indigo server's HTTP API. The companion `ValidateXmlFile` helper validates `Devices.xml`, `Actions.xml`, `Events.xml`, and `MenuItems.xml` against the Indigo schema.

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

**XML validation** — `ValidateXmlFile` MUST come first in the MRO:

```python
from shared import APIBase, ValidateXmlFile

class TestActionsXml(ValidateXmlFile, APIBase):
    server_plugin_dir_path = (
        "/path/to/MyPlugin.indigoPlugin/Contents/Server Plugin"
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
| Speed | Seconds | Slow (spawns processes per call) |
| Indigo install needed | No | Yes — running server + admin API access |
| What it catches | Logic errors | Integration + XML schema errors |
| Best for | CI on every PR | Pre-release smoke |

Use both for any non-trivial plugin: A on every commit, B before each release.

---

## References

- TestingBase upstream: https://github.com/IndigoDomotics/TestingBase
- Plugin HTTP API (consumed by Pattern B): see `/indigo:api`
- Plugin lifecycle (what you'd typically test): see `concepts/plugin-lifecycle.md`
