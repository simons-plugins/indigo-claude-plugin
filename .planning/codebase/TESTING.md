# TESTING.md — Testing and Validation

## No Automated Tests

This project has **no automated test suite**. The CLAUDE.md states `"Testing: none"` explicitly.

There are no:
- Unit tests
- Integration tests
- Linting configs
- Pre-commit hooks
- CI test jobs

## CI Checks (What Does Run)

One CI check runs on every PR:

**Version sync check**: Verifies that `version` in `.claude-plugin/plugin.json` and `version` in `.claude-plugin/marketplace.json` match, and that the version has been bumped from the base branch.

This is the only automated gate before merging. If the CI check fails, the PR cannot merge (branch protection is enforced — no `--admin` bypass).

## Manual Validation Approach

Since the plugin is content-only Markdown, validation is human-driven:

### For Commands and Skills

1. **Read the changed file** — verify frontmatter is valid YAML, body is coherent Markdown
2. **Check cross-references** — verify all `docs/` file paths mentioned actually exist
3. **Check routing completeness** — does the query routing table cover the likely user questions?
4. **Check size claims** — if file size is mentioned in a table, verify it's approximately correct

### For Hook (`check-update.js`)

1. **Manual run**: `node hooks/check-update.js` — should output `{}` (no update) or a JSON object with `systemMessage`
2. **Cache behavior**: Delete `~/.claude/cache/indigo-plugin-update-check.json` and re-run to test fresh fetch
3. **Update notification**: Temporarily change local version to `"0.0.1"` and run to verify `systemMessage` appears

### For Export Tool (`tools/create_clipping.py`)

1. Run with a sample XML file: `python3 tools/create_clipping.py input.xml output.textClipping`
2. Drag resulting `.textClipping` into Indigo to verify it imports correctly

### For HTML Pages (skill-generated output)

Testing is done in context, after a page is generated:

1. **Browser test**: Open the HTML file directly in Safari/Chrome — verify connection form appears and functions
2. **Plugin deployment test**: Copy to `Web Assets/static/pages/`, verify URL is accessible via Indigo server
3. **WKWebView test**: Load via Domio iOS app — verify `indigo-api.js` initializes correctly (no external script load)
4. **Dark mode**: Toggle system dark mode, verify `prefers-color-scheme` styles apply
5. **Device controls**: Tap toggles, move sliders — verify commands POST to `/v2/api/command`

### For Control Pages (skill-generated output)

1. **XML validity**: Paste generated XML into an XML validator
2. **Import test**: Convert to `.textClipping` with `tools/create_clipping.py`, drag-and-drop into Indigo
3. **Visual check**: Open control page in Indigo Touch or Indigo client

### For SDK Examples

SDK examples are upstream content from Indigo SDK — not modified here. They are validated by Indigo's own release process.

## PR Review Process

All PRs go through GitHub PR review before merge:

1. Open PR from feature branch to `main`
2. Wait for CI version-sync check to pass
3. Wait for user (repo owner) approval
4. Merge via GitHub UI (no squash, no `--admin`)

CodeRabbit (automated code review bot) has reviewed PRs (evidenced by PR #24 addressing CodeRabbit findings). CodeRabbit provides automated review comments but is not a blocking CI check.

## Skill Activation Validation

To verify a skill activates correctly:
1. Open a file matching one of the skill's `match` patterns in Claude Code
2. Confirm the skill is listed in the active context
3. Ask a question within the skill's domain — verify Claude's response reflects the skill content

## Known Gaps in Validation

- No way to programmatically test that command routing guides work as intended — relies on human review
- No linting for Markdown structure or frontmatter schema
- No checks that `${CLAUDE_PLUGIN_ROOT}` file paths in docs/skills actually resolve to real files
- No automated check that all 16 SDK examples are listed in `docs/plugin-dev/examples/sdk-examples-guide.md`
