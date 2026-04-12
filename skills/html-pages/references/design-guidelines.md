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

## Responsive Layout

Target three breakpoints:
- iPhone: single column, full-width cards
- iPad portrait: 2-column grid
- iPad landscape / desktop: 3+ column grid

```css
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
}
```

## Deployment Paths

### Domio Plugin (primary)

```bash
cp "page.html" "/Volumes/Macintosh HD-1/Library/Application Support/Perceptive Automation/Indigo 2025.1/Plugins/Domio.indigoPlugin/Contents/Resources/static/pages/"
```

Then restart: `mcp__indigo__restart_plugin(plugin_id="com.simons-plugins.domio")`

### Other Plugins

Copy to any plugin's `Contents/Resources/static/pages/` directory.

### Browser Testing

Access via: `https://{server}:8176/{bundleID}/static/pages/page.html?api-key=KEY`

The `?api-key=` parameter authenticates with IWS and provides credentials to `indigo-api.js`.
