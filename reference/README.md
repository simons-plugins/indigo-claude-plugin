# SDK Reference Materials

This directory contains reference materials from the official Indigo SDK.

## Files

### [SDK-README.md](SDK-README.md)
Original README from the Indigo SDK 2025.1. Contains:
- SDK overview
- What's included in the SDK
- Getting started with the examples
- File locations and structure

### [SDK-CLAUDE.md](SDK-CLAUDE.md)
Quick reference guide for Claude Code when working with the Indigo SDK. Contains:
- Quick lookups for common tasks
- File structure reference
- Example plugin descriptions
- Common patterns

### [Python3-Migration-Guide.md](Python3-Migration-Guide.md)
**Legacy porting reference — only needed if you're updating an old Python 2 plugin.**

Indigo has shipped Python 3 since 2023.2 (API 3.4), so new plugins never need this. It remains
accurate and is still linked from the live SDK, kept here for the few porting a legacy plugin.
Covers updating a Python 2 plugin to Python 3:
- Python 2 vs Python 3 syntax changes
- Import statement updates
- String/Unicode handling
- Dictionary iteration changes
- Exception handling updates
- Print function changes
- Info.plist updates (ServerApiVersion)

**When to use this guide**:
- Upgrading an existing Python 2 plugin to Python 3
- Maintaining compatibility with older Indigo versions
- Understanding API version differences

## SDK Version

Current target: **Indigo 2025.2** — Python 3.13, ServerApiVersion 3.8. Python 3 support began at
Indigo 2023.2 (API 3.4). For any live reference fact, prefer the vendored canonical docs under
[`../reference/canonical/`](canonical/) (see `canonical/VERSION`).

## Related Resources

- **[Canonical docs (vendored)](canonical/INDEX.md)** - Indigo 2025.2 reference, source of truth
- **[SDK Examples](../sdk-examples/)** - 16 complete example plugins
- **[Plugin Development (official docs)](https://docs.indigodomo.com/2025.2/plugin-dev/)**
- **[Scripting / IOM (official docs)](https://docs.indigodomo.com/2025.2/scripting/)**

## Using These References

### For New Developers
Start with SDK-README.md to understand the SDK structure, then explore the examples.

### For Python 2 → 3 Migration
Read Python3-Migration-Guide.md carefully and follow the step-by-step process.

### For Claude Code Integration
SDK-CLAUDE.md provides quick references that Claude can use for lookups.

## Questions?

- 📚 Check the [main documentation](../docs/plugin-dev/)
- 💬 Ask in [Discussions](https://github.com/simons-plugins/indigo-claude-skill/discussions)
- 🌐 Visit [Indigo Forum](https://forums.indigodomo.com/viewforum.php?f=18)
