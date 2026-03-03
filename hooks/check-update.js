#!/usr/bin/env node
// SessionStart hook: read cached update info and inject notification, then refresh cache in background
// Called synchronously so stdout is captured by Claude Code as additionalContext

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const homeDir = os.homedir();
const cacheDir = path.join(homeDir, '.claude', 'cache');
const cacheFile = path.join(cacheDir, 'indigo-plugin-update-check.json');

// Installed version from plugin.json in this plugin's directory
const pluginRoot = path.resolve(__dirname, '..');
const pluginJsonFile = path.join(pluginRoot, '.claude-plugin', 'plugin.json');

// Ensure cache directory exists
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// --- Step 1: Read cache and output notification if update available ---
let additionalContext = '';

try {
  if (fs.existsSync(cacheFile)) {
    const cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    if (cache.update_available && cache.installed && cache.latest) {
      // AI context (stdout)
      additionalContext = `<important-reminder>Indigo plugin update available: ${cache.installed} → ${cache.latest}. Run /indigo:update to install.</important-reminder>`;

      // Terminal display (stderr) — visible to the user
      const yellow = '\x1b[33m';
      const bold = '\x1b[1m';
      const dim = '\x1b[2m';
      const reset = '\x1b[0m';

      const header = `Indigo Plugin Update: ${cache.installed} → ${cache.latest}`;
      const footer = 'Run /indigo:update to install';

      // Calculate box width from longest line
      let maxLen = Math.max(header.length, footer.length);
      const notes = cache.release_notes || [];
      for (const rel of notes) {
        const lines = (rel.body || '').split('\n').filter(l => l.trim());
        const verLine = `v${rel.version}`;
        maxLen = Math.max(maxLen, verLine.length);
        for (const line of lines) {
          maxLen = Math.max(maxLen, line.length);
        }
      }
      const w = maxLen + 4; // padding

      const pad = (s, len) => s + ' '.repeat(Math.max(0, len - s.length));

      let box = '';
      box += `${yellow}╔${'═'.repeat(w)}╗${reset}\n`;
      box += `${yellow}║${reset}  ${bold}${header}${reset}${' '.repeat(Math.max(0, w - header.length - 2))}${yellow}║${reset}\n`;

      if (notes.length > 0) {
        box += `${yellow}╠${'═'.repeat(w)}╣${reset}\n`;
        for (const rel of notes) {
          box += `${yellow}║${reset}${' '.repeat(w)}${yellow}║${reset}\n`;
          const verLine = `v${rel.version}`;
          box += `${yellow}║${reset}  ${bold}${verLine}${reset}${' '.repeat(Math.max(0, w - verLine.length - 2))}${yellow}║${reset}\n`;
          const lines = (rel.body || '').split('\n').filter(l => l.trim());
          for (const line of lines) {
            box += `${yellow}║${reset}  ${dim}${line}${reset}${' '.repeat(Math.max(0, w - line.length - 2))}${yellow}║${reset}\n`;
          }
        }
      }

      box += `${yellow}║${reset}${' '.repeat(w)}${yellow}║${reset}\n`;
      box += `${yellow}║${reset}  ${bold}${footer}${reset}${' '.repeat(Math.max(0, w - footer.length - 2))}${yellow}║${reset}\n`;
      box += `${yellow}╚${'═'.repeat(w)}╝${reset}\n`;

      process.stderr.write(box);
    }
  }
} catch (e) {
  // Cache read failed - skip notification
}

// Output JSON for Claude Code context injection
const output = {};
if (additionalContext) {
  output.additional_context = additionalContext;
  output.hookSpecificOutput = {
    hookEventName: 'SessionStart',
    additionalContext: additionalContext
  };
}
console.log(JSON.stringify(output));

// --- Step 2: Refresh cache in background for next session ---
const child = spawn(process.execPath, ['-e', `
  const fs = require('fs');
  const https = require('https');

  const cacheFile = ${JSON.stringify(cacheFile)};
  const pluginJsonFile = ${JSON.stringify(pluginJsonFile)};
  const REPO = 'simons-plugins/indigo-claude-plugin';

  // Read installed version
  let installed = '0.0.0';
  try {
    const pluginJson = JSON.parse(fs.readFileSync(pluginJsonFile, 'utf8'));
    installed = pluginJson.version || '0.0.0';
  } catch (e) {}

  function httpsGet(url) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('timeout')), 10000);
      https.get(url, { headers: { 'User-Agent': 'indigo-plugin-update-check' } }, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          clearTimeout(timeout);
          try { resolve(JSON.parse(data)); }
          catch (e) { reject(e); }
        });
      }).on('error', reject);
    });
  }

  async function main() {
    // Fetch latest version from plugin.json on main
    let latest = 'unknown';
    try {
      const url = 'https://raw.githubusercontent.com/' + REPO + '/main/.claude-plugin/plugin.json';
      const res = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('timeout')), 10000);
        https.get(url, { headers: { 'User-Agent': 'indigo-plugin-update-check' } }, (r) => {
          let data = '';
          r.on('data', (chunk) => data += chunk);
          r.on('end', () => { clearTimeout(timeout); resolve(data); });
        }).on('error', reject);
      });
      const json = JSON.parse(res);
      latest = json.version || 'unknown';
    } catch (e) {}

    const update_available = latest !== 'unknown' && installed !== latest;

    // Fetch release notes if update available
    let release_notes = [];
    if (update_available) {
      try {
        const releases = await httpsGet(
          'https://api.github.com/repos/' + REPO + '/releases?per_page=20'
        );
        if (Array.isArray(releases)) {
          // Collect releases newer than installed version
          for (const rel of releases) {
            const ver = (rel.tag_name || '').replace(/^v/, '');
            if (ver && ver !== installed) {
              release_notes.push({ version: ver, body: rel.body || '' });
            }
            // Stop once we reach the installed version
            if (ver === installed) break;
          }
        }
      } catch (e) {
        // Release fetch failed — still cache version info
      }
    }

    const result = {
      update_available,
      installed,
      latest,
      release_notes,
      checked: Math.floor(Date.now() / 1000)
    };
    fs.writeFileSync(cacheFile, JSON.stringify(result));
  }

  main();
`], {
  stdio: 'ignore',
  windowsHide: true,
  detached: true
});

child.unref();
