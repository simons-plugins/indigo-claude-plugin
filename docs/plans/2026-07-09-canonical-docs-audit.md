# indigo-claude-plugin — Docs Audit vs. Indigo 2025.2 canonical (`llms-full.txt`)

Date: 2026-07-09. Canonical source: https://docs.indigodomo.com/llms-full.txt (20,624 lines).
Method: 4 parallel agents compared our ~11.3k lines of bundled docs against the rewritten canonical.
**Context: Indigo rewrote the docs completely but did NOT change functionality.** So every "inaccuracy"
below is a *pre-existing* error in our docs the clearer canonical surfaced — not a behaviour change.

---

## TIER 1 — HIGH: actively wrong, produces broken code. Fix regardless of refactor scope.

### API skill (`skills/api/SKILL.md` — the always-loaded file, currently ~100% wrong on command shape)
1. `PUT /v2/api/indigo.devices/<id>` — **does not exist.** Only write path is `POST /v2/api/command`. (canon 52-64; PUT is the *deprecated* old-REST form, canon 1850)
2. Command envelope wrong in every example: `{"name":"device.turnOn","parameters":{"id":123}}` → real is `{"message":"indigo.device.turnOn","objectId":123,"parameters":{...}}`. Three errors: `message` not `name`; namespaced `indigo.device.*` names; top-level `objectId` not `parameters.id`. (canon 243-248, 1036-1085). Note our deeper files http-api.md/device-commands.md get this right — SKILL.md contradicts them.
3. WebSocket wrong: bare `/v2/api/ws` isn't a feed (use `/v2/api/ws/device-feed` etc., 7 feeds); subscribe `{"name":"device","id":..}` should be `{"message":"refresh","objectType":"indigo.Device","objectId":..}`. (canon 2403-2411, 2770-2778)
4. `?detail=true` — **fabricated.** GET always returns full objects. (no such param in canon)
5. Invented `errorId` codes (`device_not_found`, `unknown_command`…) in http-api.md/device-commands.md → real error model is `error` + `validationErrors` dict + passthrough `id`. (canon 1704-1754)
6. Thermostat command family **entirely missing** from device-commands.md (setHeat/CoolSetpoint, setHvacMode, setFanMode + `indigo.kHvacMode.*`/`indigo.kFanMode.*`). (canon 1284-1405)

### Plugin authoring
7. **super() story is backwards.** We tell authors `super().deviceStartComm/StopComm()` is "required/recommended" (SKILL.md:183, quick-start.md:183, plugin-lifecycle.md:263/296/656) — canonical treats these as override hooks (no super needed). The methods that DO need the base call — `deviceUpdated`/`triggerUpdated`/`deviceCreated`/`deviceDeleted` — are where we under-emphasize it. (canon 4090-4124, 5484-5518, 7274-7278)
8. `validateDeviceConfigUi` success-return documented wrong in `devices.md:230-254` (docstring says 3-tuple always). Real: success = `True` | `(True, valuesDict)` | `(True, valuesDict, msgDict)`; failure = `(False, valuesDict, errorDict)`. Our own configui.md:347 gets it right — devices.md contradicts it. (canon 6867-6973)
9. MenuItem ConfigUI callback wrong: `menu-items.md:75` takes `(values_dict, menu_item_id)` and returns `None` → must be `(valuesDict, typeId)` returning `True` or `(False, valuesDict, errorsDict)`. Returning None is a real bug. (canon 6155-6172)
10. **`secure="true"` "stored encrypted" is FALSE** (configui.md:20,:169 + echoes). Canonical (6827): "not stored securely — solely masks the value in the UI." Security-misleading. (canon 6827)

### IOM / scripting reference
11. `indigo.actionGroup.enable()` — **doesn't exist** (command-namespaces.md:163, :387). Action groups have no enabled state. (canon 10963-11076)
12. `DeviceStateChangeTrigger` missing the two props you MUST set: `stateChangeType`, `stateSelectorIndex` (triggers.md:40) — a plugin following our doc can't build the trigger. (canon 13005-13009, 13096-13102)
13. `InsteonCommandReceivedTrigger.address` wrong (triggers.md:72) → real props `deviceId`, `command`, `commandSourceType`, `buttonOrGroup`. (canon 13161-13166)
14. `indigo.server.error()` — **doesn't exist** (command-namespaces.md:249) → `log(..., isError=True)`. Our api-patterns.md already does it right. (canon 12618-12639)

---

## TIER 2 — MED: stale/misleading, should fix.

**Version currency (pervasive — a global sweep):**
- Platform stated as 2023.2 / 2025.1 / Python 3.10 / API 3.0 → should be **2025.2 / Python 3.13 / API 3.8**. Files: README.md:133, reference/README.md:40-42, troubleshooting/README.md:12, SDK-CLAUDE.md:40, common-issues.md:14-15, examples/README.md:88. (Python 3 = API **3.4** @ 2023.2, not 3.0.) Our own common-issues.md:348 already has 3.13 right — inconsistent internally.
- **Stale external links** in `commands/dev.md:194-195` and `commands/api.md:162`: point at old `wiki.indigodomo.com/doku.php?id=indigo_2025.1_documentation:*` → moved to `docs.indigodomo.com/2025.2/*`.

**API:**
- Auth model omits HTTP Digest; reframe local secrets as "a special kind of API key" (not a separate prefs secret); portal path is account **Authorizations** not "API Keys". (canon 8, 69, 2434)
- `enable` device param is optional, we say required (device-commands.md:169). Sprinkler `run`/`stop`/`setActiveZone` missing. Plugin messaging (`plugin.restart`, `plugin.executeAction`) missing. schedule-feed/trigger-feed missing from WS feed table. Typo: http-api.md:285 stray quote.

**Authoring:**
- `body_params` is form-POST-only; JSON POST authors get empty dict — must document `request_body`/`headers` (http-responder.md). (canon 4967-4979)
- Device `subType` + subtype enums (`kDeviceSubType` Lock/Presence/GarageController…) + `allowUserCreation` missing from devices.md — **directly relevant to Domio lock/presence/garage work**. (canon 5827-5869)
- Custom-device state ValueTypes: add `List`, canonical set is Boolean/Number/List/String/Separator (devices.md:82). (canon 5924)

**IOM:**
- `getPluginList()` returns enabled plugin *objects*, not IDs (command-namespaces.md:292). (canon 12542)
- `displayStateValue` → `displayStateValRaw`/`displayStateValUi` (devices.md:47). (canon 15115)
- Sprinkler `zoneDurations` → `zoneMaxDurations` (devices.md:132). `speedLabels` likely nonexistent (verify). Folder `getId` on `.folders` not `.folder` (architecture.md:147).

---

## TIER 3 — GAPS: net-new coverage worth adding.

- **Webhooks** — entirely absent, a first-class integration surface (Webhook trigger type, `/webhook/<id>?api-key=`, JSON/FORM/GET, event_data). (canon 2098-2397)
- **REST→HTTP migration** guidance — absent. (canon 1794-2096)
- **`indigo.utils.ValidationError`** — the modern validation idiom, recurs in BOTH authoring (ConfigUI/HTTP) and IOM. We still hand-roll error dicts everywhere. (canon 4981-5007, 6975-7006, 13565-13615)
- **`substitute*()`, `getDeviceStateList()`/`getDeviceDisplayStateId()`** — common authoring APIs, missing. (canon 4203-4281, 4811-4925)
- **Dev environment**: symlink workflow (canonical's *recommended* approach; we tell users to `cp`), debuggers (pdb/PuDB/PyCharm — we say "can't use debuggers"), Python-conflicts page. (canon 3634-3785, 20564-20624)
- **Device base-class props**: energy* group, errorState, sharedProps, supportsOnState. Subclass gaps: ledStates, MultiIO *Count, thermostat supports*/humidifier, sprinkler paused*. (canon 15106-15141, 14138-15055)
- **Constants**: kAllDeviceSel, kInsteonCmd, kStateChange/kStateSelector, kDeviceSourceType, extra kStateImageSel icons. (canon 13017-13199, 15157-15479)
- Plugin management: status-dot legend, uninstall procedure, Plugin Store submission, upgrade path. (canon 17562-17689, 19747-19844)

---

## KEEP AS-IS (ahead of canonical — no change)
`patterns/testing.md`, `patterns/README.md`, `workflows/README.md`, `patterns/open-source-contributing.md`, `examples/sdk-examples-guide.md`, `events.md` (event-data section).

## REFRAME
`reference/Python3-Migration-Guide.md` — still correct & live-linked from the SDK, but audience shrank to legacy Py2→3 porters. Demote from "Essential reading" (reference/README.md:22, README.md:134) to "legacy porting reference."

---

## STRATEGIC ROOT CAUSE
Indigo now publishes `llms-full.txt` — a single, always-current, LLM-optimised canonical. We ship ~11k lines of hand-derived docs that (a) drift, (b) fabricate specifics (items 1-6, 10-14 are invented, not just stale), (c) have gaps. Maintaining a parallel derivative is the drift trap. But we can't just point Claude at a 1.5MB file (context blow-up), and our real value-add is curation the canonical lacks: workspace conventions, testing patterns, CI workflows, SDK examples, query-routing. → the answer is a **hybrid**, not "delete ours" or "keep grinding derivatives."
