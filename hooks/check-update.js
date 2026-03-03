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
      additionalContext = `<important-reminder>Indigo plugin update available: ${cache.installed} → ${cache.latest}. Run /indigo:update to install.</important-reminder>`;
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

  // Read installed version
  let installed = '0.0.0';
  try {
    const pluginJson = JSON.parse(fs.readFileSync(pluginJsonFile, 'utf8'));
    installed = pluginJson.version || '0.0.0';
  } catch (e) {}

  // Fetch latest version from GitHub
  function fetchLatest() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('timeout')), 10000);
      const url = 'https://raw.githubusercontent.com/simons-plugins/indigo-claude-plugin/main/.claude-plugin/plugin.json';
      https.get(url, { headers: { 'User-Agent': 'indigo-plugin-update-check' } }, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          clearTimeout(timeout);
          try {
            const json = JSON.parse(data);
            resolve(json.version || 'unknown');
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
  }

  fetchLatest().then(latest => {
    const result = {
      update_available: latest !== 'unknown' && installed !== latest,
      installed,
      latest,
      checked: Math.floor(Date.now() / 1000)
    };
    fs.writeFileSync(cacheFile, JSON.stringify(result));
  }).catch(() => {
    // Network error - skip silently
  });
`], {
  stdio: 'ignore',
  windowsHide: true,
  detached: true
});

child.unref();
