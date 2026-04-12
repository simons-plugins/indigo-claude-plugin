# Privacy Policy

**Indigo Claude Code Plugin**
Last updated: 2026-04-11

## Overview

The Indigo Claude Code Plugin is a documentation-only plugin for Claude Code. It provides reference materials, SDK examples, and development guidance for building Indigo home automation plugins. It does not collect, transmit, or store any user data.

## Data Collection

**This plugin collects no data.** Specifically:

- No telemetry or analytics
- No API calls to external services
- No user information collected or transmitted
- No cookies, tokens, or identifiers stored
- No network requests made by the plugin

## How the Plugin Works

The plugin operates entirely within your local Claude Code session:

1. **Documentation delivery** — When you invoke a command (`/indigo:dev`, `/indigo:api`, `/indigo:control-pages`), the plugin loads relevant documentation from its local files into the Claude Code context
2. **Skill auto-activation** — When you work on Indigo-related files (`.indigoPlugin/`, `plugin.py`, `Devices.xml`), the plugin automatically provides relevant documentation
3. **No external communication** — All documentation is bundled with the plugin. No network requests are made to fetch content

## Local File Access

The plugin reads files from your local project directory to provide contextual assistance (e.g., understanding your plugin's `Devices.xml` to give relevant advice). This is standard Claude Code behavior and the file contents are processed within your Claude Code session only.

## Third-Party Services

This plugin does not integrate with any third-party services, analytics platforms, or data processors.

## Data Storage

No data is stored by this plugin. It contains only static documentation files (Markdown, Python examples, XML schemas).

## Changes to This Policy

If this policy changes, the update will be reflected in this file with an updated date. Since the plugin collects no data, significant changes are unlikely.

## Contact

For questions about this privacy policy, open an issue at [simons-plugins/indigo-claude-plugin](https://github.com/simons-plugins/indigo-claude-plugin/issues).
