---
name: html-pages
description: >-
  This skill should be used when the user asks to "build an HTML page for Indigo",
  "create an HTML dashboard", "make an Indigo web page", "create a device dashboard",
  "build a home summary page", "generate an HTML control page", "create a web dashboard",
  or is working with HTML files in a plugin's Resources/static/pages/ directory.
  Generates self-contained HTML pages with indigo-api.js for live device data and controls.
match:
  - "**/Resources/static/pages/*.html"
  - "**/indigo-api.js"
---

# Indigo HTML Pages

HTML dashboard pages served by Indigo plugins via the IWS static file system.
Pages use `indigo-api.js` for client-side device data and control via the Indigo REST API.

For full workflow and API reference, load the `/indigo:html-pages` command.

## Quick Reference

### Meta Tags (for page discovery)
```html
<meta name="domio-page-name" content="Page Name">
<meta name="domio-page-icon" content="house.fill">
<meta name="domio-page-description" content="Brief description">
```

### Script Loading
```html
<script src="../js/indigo-api.js"></script>
```

### Basic Pattern
```javascript
const indigo = new IndigoAPI();
indigo.observeAll(devices => renderDashboard(devices), 5000);
```

### Required CSS
- `prefers-color-scheme` dark mode support
- Responsive layout (iPhone + iPad)
- `-apple-system` font stack

### Deploy Path
```
PluginName.indigoPlugin/Contents/Resources/static/pages/your-page.html
```
