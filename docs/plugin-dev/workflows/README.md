# Canonical CI workflows for Indigo plugins

Drop-in GitHub Actions workflows for any Indigo plugin in the workspace. They auto-detect the plugin bundle (`*.indigoPlugin`) so the same files work in every repo without edits.

## Files

- [`version-check.yml`](version-check.yml) — runs on PR. Extracts `PluginVersion` from `Info.plist` and fails the check if the resulting tag (`v$VERSION` or bare `$VERSION`) already exists. Enforces the workspace rule that every PR bumps the version.
- [`create-release.yml`](create-release.yml) — runs on push to `main`/`master`. If a tag for the current `PluginVersion` doesn't yet exist, it zips the plugin bundle (excluding `.pyc`, `__pycache__`, IDE files) and creates a GitHub release tagged `v$VERSION` with auto-generated release notes and the zip attached.

## Conventions

- **Tag prefix**: `v$VERSION` (e.g. `v2026.0.3`). The version-check is conservative and rejects either prefixed or bare tags clashing with the new version.
- **Plugin bundle detection**: `find . -maxdepth 1 -name "*.indigoPlugin" -type d`. The bundle must live at the repo root.
- **Action versions**: `actions/checkout@v4`, `softprops/action-gh-release@v2`. Both run on Node 20.

## Usage

Copy both YAML files to `.github/workflows/` in the target repo. No edits required — the workflows discover the plugin name at runtime.

```bash
mkdir -p .github/workflows
cp /path/to/indigo-claude-plugin/docs/plugin-dev/workflows/version-check.yml  .github/workflows/
cp /path/to/indigo-claude-plugin/docs/plugin-dev/workflows/create-release.yml .github/workflows/
```

Bump `PluginVersion` in `*.indigoPlugin/Contents/Info.plist`, open a PR. CI will gate the merge on a fresh version; merge to `main` triggers the release.

## Coexistence with other CI

These workflows do not interact with linting/test workflows. Repos with `tests.yml`, `test.yml`, `lint.yml`, etc. can keep them — they run as independent jobs.
