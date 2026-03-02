#!/usr/bin/env node
// Check for Indigo plugin updates in background, write result to cache
// Called by SessionStart hook - runs once per session

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

// Run check in background
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
