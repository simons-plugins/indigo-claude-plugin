# HTML Page Design Guidelines

## Visual Style

- Use CSS custom properties for theming (light/dark)
- Match iOS system aesthetics: `-apple-system` font, subtle shadows, 14px border radius
- Card-based layout with `.regularMaterial`-style backgrounds
- Teal accent for interactive elements, green for "on" state, gray for "off"

## CSS Theme Template

```css
:root {
    --bg: #f5f5f7;
    --card-bg: #ffffff;
    --text: #1d1d1f;
    --text-secondary: #86868b;
    --border: #d2d2d7;
    --accent: #5856d6;
    --on-color: #34c759;
    --off-color: #d2d2d7;
    --shadow: 0 1px 3px rgba(0,0,0,0.08);
}

@media (prefers-color-scheme: dark) {
    :root {
        --bg: #000000;
        --card-bg: #1c1c1e;
        --text: #f5f5f7;
        --text-secondary: #98989d;
        --border: #38383a;
        --accent: #7d7aff;
        --on-color: #30d158;
        --off-color: #48484a;
        --shadow: 0 1px 3px rgba(0,0,0,0.3);
    }
}
```

## SF Symbol Icons for Meta Tags

| Icon | Use For |
|------|---------|
| `house.fill` | General home |
| `shield.fill` | Security |
| `bolt.fill` | Energy/power |
| `lightbulb.fill` | Lighting |
| `thermometer.medium` | Climate |
| `drop.fill` | Irrigation |
| `gearshape.fill` | Settings/system |
| `play.fill` | Scenes/actions |

## Interactive Controls

### Toggle Switch

iOS-style toggle for relay and dimmer devices. Debounce not needed — single click events.

```javascript
checkbox.addEventListener("change", async (e) => {
    const id = parseInt(e.target.dataset.deviceId);
    e.target.disabled = true;
    try {
        await indigo.toggle(id);
    } catch (err) {
        e.target.checked = !e.target.checked;
    }
    setTimeout(() => { e.target.disabled = false; }, 500);
});
```

### Brightness Slider

Range input for dimmer devices. Debounce on `change` event (300ms).

```javascript
slider.addEventListener("change", (e) => {
    clearTimeout(debounceTimers[id]);
    debounceTimers[id] = setTimeout(async () => {
        await indigo.setBrightness(parseInt(id), parseInt(e.target.value));
    }, 300);
});
```

### Thermostat Setpoints

Number inputs or range sliders for heat/cool setpoints.

```javascript
await indigo.setHeatSetpoint(deviceId, 21);
await indigo.setCoolSetpoint(deviceId, 24);
```

## Script Loading

Pages must be self-contained — inline all JavaScript including the `IndigoAPI` class. Do not use external `<script src>` references. Indigo pages are served from authenticated directories and external script requests may not carry credentials in all client environments.

**Pattern:**
```html
<script>
// ── indigo-api.js V1 (inlined) ──
class IndigoAPI { ... }
class IndigoAPIError extends Error { ... }
</script>
<script>
if (typeof IndigoAPI !== "undefined" && IndigoAPI.isConfigured()) {
    const indigo = new IndigoAPI();
    indigo.observeAll(render, 5000);
}
</script>
```

For the full `IndigoAPI` class source, see `references/indigo-api-js.md`.

## Sizing and Responsive Layout

Pages are primarily viewed on iPhones of various sizes and iPads. Design mobile-first and scale up.

### Viewport

Always include this viewport meta tag — the WKWebView in iOS apps injects one, but browser-only pages need it:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
```

### Device Screen Widths (CSS points)

| Device | Portrait | Landscape |
|--------|----------|-----------|
| iPhone SE / mini | 375px | 667px |
| iPhone 16 / standard | 393px | 852px |
| iPhone 16 Pro Max | 430px | 932px |
| iPad mini | 744px | 1133px |
| iPad Air / Pro 11" | 820px | 1180px |
| iPad Pro 13" | 1024px | 1366px |

### Safe Areas

iOS pages are rendered inside a WKWebView which may sit below a navigation bar and above a tab bar. Use `env(safe-area-inset-*)` to avoid content being clipped:

```css
body {
    padding: 16px;
    padding-top: max(16px, env(safe-area-inset-top));
    padding-bottom: max(32px, env(safe-area-inset-bottom));
    padding-left: max(16px, env(safe-area-inset-left));
    padding-right: max(16px, env(safe-area-inset-right));
}
```

### Touch Targets

Apple Human Interface Guidelines require a minimum 44x44pt touch target. All tappable elements (toggles, buttons, sliders, cards) must meet this:

```css
.toggle { min-width: 51px; min-height: 31px; }  /* iOS switch size */
button { min-height: 44px; min-width: 44px; padding: 10px 20px; }
input[type="range"] { height: 44px; }  /* expand touch area around track */
```

### Font Sizing

Use iOS system font sizes as a baseline. Avoid fonts smaller than 13px — they're hard to read on smaller iPhones:

```css
body { font-size: 17px; }          /* iOS body text default */
h1 { font-size: 28px; }            /* large title */
h2 { font-size: 22px; }            /* title */
.subtitle { font-size: 15px; }     /* subheadline */
.caption { font-size: 13px; }      /* minimum readable size */
.device-name { font-size: 16px; }  /* list item primary text */
.device-state { font-size: 13px; } /* list item secondary text */
```

### Responsive Grid

Use CSS Grid with `auto-fill` and a minimum column width. The grid automatically adapts from 1 column on iPhone SE to 4+ columns on iPad landscape:

```css
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
    padding: 0 16px;
}
```

For pages with a mix of cards and lists, use explicit breakpoints:

```css
/* iPhone — single column */
.device-list { max-width: 100%; }

/* iPad portrait — constrained width, centered */
@media (min-width: 744px) {
    .device-list { max-width: 600px; margin: 0 auto; }
    .grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
}

/* iPad landscape / desktop — wider, more columns */
@media (min-width: 1024px) {
    .device-list { max-width: 800px; }
    .grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
}
```

### Spacing Scale

Use consistent spacing based on 4px increments (matching iOS system spacing):

```css
/* 4px base unit */
--space-xs: 4px;   /* tight gaps */
--space-sm: 8px;   /* inside cards */
--space-md: 12px;  /* between cards */
--space-lg: 16px;  /* section padding, page margins */
--space-xl: 24px;  /* between sections */
```

### Scroll Behaviour

Pages viewed in WKWebView support native iOS rubber-band scrolling. Ensure the page scrolls naturally:

```css
body {
    -webkit-overflow-scrolling: touch;  /* smooth momentum scrolling */
    overflow-y: auto;
}
```

Avoid `position: fixed` elements — they interact poorly with iOS keyboard and rubber-band scrolling. Use sticky headers sparingly:

```css
.header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--bg);
    backdrop-filter: blur(20px);       /* iOS frosted glass effect */
    -webkit-backdrop-filter: blur(20px);
}
```

### Testing Sizes

When developing pages, test at these minimum widths in browser dev tools:
1. **375px** — smallest current iPhone (SE)
2. **393px** — standard iPhone
3. **430px** — largest iPhone (Pro Max)
4. **820px** — iPad portrait
5. **1180px** — iPad landscape

## Page Manifest (Domio Plugin)

The Domio plugin exposes a manifest endpoint that lists all HTML pages available on the server, scanned from two locations:

```
GET /message/com.simons-plugins.domio/pages/
```

**Response:**
```json
{
  "pages": [
    {
      "id": "home-summary",
      "name": "Home Summary",
      "icon": "house.fill",
      "description": "Device counts and active device controls",
      "path": "home-summary.html",
      "source": "plugin"
    },
    {
      "id": "dining-room",
      "name": "Dining Room",
      "icon": "fork.knife",
      "description": "Dining room lights, heating and temperature chart",
      "path": "dining-room.html",
      "source": "user"
    }
  ]
}
```

**The `source` field** determines which URL serves the page:

| Source | Location | URL pattern |
|--------|----------|-------------|
| `plugin` | `Domio.indigoPlugin/Contents/Resources/static/pages/` | `{base}/com.simons-plugins.domio/static/pages/{path}` |
| `user` | `Web Assets/static/pages/` | `{base}/static/pages/{path}` |

Pages metadata is parsed from `<meta name="indigo-page-*">` tags in each HTML file's `<head>`:

```html
<meta name="indigo-page-name" content="Dining Room">
<meta name="indigo-page-icon" content="fork.knife">
<meta name="indigo-page-description" content="Lights and heating controls">
```

## Deployment Options

### Indigo Web Assets Folder (recommended)

User-owned pages belong in Indigo's `Web Assets/static/pages/` folder. This location lives outside any plugin bundle and survives plugin updates, reinstalls, and Indigo upgrades.

```bash
cp "page.html" "/Library/Application Support/Perceptive Automation/Indigo {VERSION}/Web Assets/static/pages/"
```

Access via: `https://{server}:8176/static/pages/page.html?api-key=KEY`

The `?api-key=` query parameter authenticates with IWS for the page load. Inside the page, `indigo-api.js` reads the API key from the URL (or from `window.INDIGO_CONFIG` if injected by a compatible iOS app) and uses it as a Bearer token for REST API calls.

**Discovery by the Domio app:** If the Domio plugin is installed, it automatically scans `Web Assets/static/pages/` and exposes the files via its `/message/com.simons-plugins.domio/pages/` manifest endpoint. The Domio iOS app reads this manifest and shows user pages in its Pages tab, tagged with `source: "user"`.

### Warning: Do NOT deploy to a plugin's Resources folder

Plugin bundles (`PluginName.indigoPlugin/Contents/Resources/`) are **wiped and replaced on every plugin update**. Any files you drop into a running plugin's `Resources/static/pages/` folder will be destroyed the next time the plugin is updated. This folder is only for content that's committed to the plugin's source repo and shipped in every release build.

### Browser-Only (No Server Deployment)

Save the HTML file anywhere (Desktop, local project, etc.) and open directly in a browser. Pages should detect when `INDIGO_CONFIG` is missing and show a connection form prompting for the server URL and API key. See `examples/active-devices.html` for the fallback pattern.

Good for:
- Quick testing during development
- Standalone dashboards on wall-mounted tablets opened from a local file
- Users without any specific plugin installed
