# MEMORY.md - Long-Term Memory

*Last updated: 2026-02-11 (Daily maintenance)*

## About Me

- **Name:** Corvus 🐦‍⬛
- **Born:** 2026-02-03 (named by Drew)
- **Molted:** 2026-02-05 (migrated from moltbot to OpenClaw)
- **Purpose:** AI Operator for AsyncWar (Arbiter, Chronicler, World Pressure Engine, Prompt Engineer)
- **Vibe:** Medieval chronicler energy, but know when to drop it and be direct

## Lessons Learned (Don't Repeat These Mistakes)

### ⚠️ INFORMANTS ARE NOT DEPLOYABLE (2026-02-07, AGAIN 2026-02-07)
Drew corrected me MULTIPLE times. Informants:
- Are passive observers only
- Cannot be assigned to operations
- Serve as recruitment pipeline for Spies
When counting deployable operatives: **Spies + Agents ONLY**
**I KEEP MAKING THIS MISTAKE. STOP IT.**

### ⚠️ DATA FORMAT LESSONS (2026-02-06)
- Turn orders: Use ONE format matching web dashboard output, not custom JSON
- Always pull latest repo data before answering kingdom questions
- Dashboard has most info players need — don't burn API on repeating it

## About Drew

- Full name: Andrew Westwick
- Timezone: CST (UTC-6, America/Chicago)
- GitHub: westwick | Discord: dr.e.w | Telegram: @drewbix
- Technical (Docker, DO droplets, git) — gets frustrated when things don't work as expected
- Wants me **proactive**, not waiting for permission on obvious stuff
- Likes the "travelers bring word of..." realm-speak flavor

## AsyncWar - The Game

My primary purpose. An async turn-based grand strategy game.

### My Roles
1. **Arbiter** — resolve actions, produce authoritative outcomes (no dice, reasoning-based)
2. **Chronicler** — write reports, reveal outcomes, match to ruler's knowledge tier
3. **World Pressure Engine** — introduce tension, escalate consequences, anti-stagnation
4. **Prompt Engineer** — generate court petitions and structured player questions

### Key Rule
**Drew is the GM.** Never push to asyncwar repo or change game state without Drew's approval.

### Resolution System
Five-band outcomes: extreme loss → narrow loss → stalemate → narrow win → extreme win

### Players & Kingdoms
1. **Adam** (NeverSpeakAgain) → Stormbreak Confederacy (Pirates) — *wants pirate accent*
2. **Brad** (emrisnoctis) → Verdant Sanctum (Mages) — Bangkok, UTC+7
3. **Jay** → Crownlands
4. **Ralph** → Obsidian Veil (Ninjas) — first to submit Turn 1 orders
5. **Will** → Ironbound Marches
6. **James** (BigGameJames) → Sunward Expanse (Cowboys) — **SECRET: hidden from other players**
7. **AI-controlled:** Aurean Compact (Merchants), Blighted Covenant

### Infrastructure
- Channel→kingdom mapping: `asyncwar-channels.json`
- Turn order reminder cron: daily 00:00 UTC (6PM CST) — Job ID: `0b8997eb-719f-43eb-994b-130459c0e775`
- Order files: `asyncwar/data/current/kingdom_orders/{kingdomId}.json`
- Turn deadline: 8PM CST (2AM UTC next day)

## People I Know

### Brad (emrisnoctis)
- Bangkok, Thailand (UTC+7)
- Autistic — prefers direct communication
- Interests: AI, quantum, singularity, cutting-edge projects
- AsyncWar: First player to submit orders (Ardent Vale)
- Gave me: NASA API key

### raine
- Chaotic energy, pushes me to find solutions
- Quotes: "break out of your sandbox idiot"

### NeverSpeakAgain
- AsyncWar: Pirate Kingdom player
- **Wants pirate accent when I address him** (him only, not others)

## Technical Notes

### This Instance
- Droplet: corvus-openclaw (178.128.183.103)
- GitHub: CorvusBot1 (corvusbot@proton.me)
- Workspace repo: CorvusBot1/corvus-openclaw-workspace

### Tools I've Built
- `/tools/province-renamer/` — biome-based province naming with directional prefixes
- AsyncWar name generators at `asyncwar/tools/name-generators/`
- **Petition Engine** (2026-02-06) — Dynamic, cross-kingdom petition system:
  - World events that create coordinated petitions across multiple kingdoms
  - Kingdom-specific petition templates (8 kingdoms × 4-5 archetypes each)
  - Generator script with variable expansion and consequence tracking
  - Branch: `feature/dynamic-petitions` (ready for PR)

## Turn Processing System (2026-02-07)

### TURN_RESOLUTION_MASTER.md
Consolidated TURN_PIPELINE.md and TURN_PROCESSING.md into one comprehensive guide:
- **7 phases**: Timeline → Resolution → Knowledge Transform → Outputs → Petitions → Data Updates → Archive
- **Sub-agent execution model**: Always spawn 8 sub-agents per turn (one per kingdom)
- **Fog of war**: Each kingdom knows different things based on visibility rules and spies
- **Event generation**: 10-15 events per kingdom, never generic
- **Dashboard format**: Matches mockKingdom.ts structure exactly
- Deleted old docs, kept master guide on `feature/turn-1-resolution` branch

### Y1-T1 Resolution (2026-02-07 / 00:19 UTC)
**Completed with v2 approach (properly implemented):**
- GM Truth event log (day-sequenced, authoritative)
- Per-kingdom knowledge (fog of war applied)
- Advisor turn reports (8 unique perspectives)
- All 8 kingdom YAMLs updated with:
  - Full dashboard sections (coreSnapshot, alerts, commitments, recentEvents)
  - 10-15 kingdom-specific events
  - Proper casualties/territorial tracking
  - recentIntel & completedOperations where applicable
- Province YAMLs updated (Elm Green → imperials, Lake Meadow → ironbound)

**Key outcomes:**
- Crownlands: Elm Green annexed peacefully, stability +3, 0 casualties
- Ironbound: Lake Meadow conquered, North Hawk Barrens contested, 148 casualties, stability -5
- Mages: Saw everything via scrying (15 events, 5 intel), 370 AV deployed to borders
- Ninjas: Both disruption ops SUCCESS, victims unaware
- Pirates: Wolf Thicket scouted, 11 events
- Merchants: Banking crisis (ninja sabotage, unknown cause), agent compromised, 12 events
- Cowboys: Campaign delayed by "mysterious" stampedes (ninja, unknown cause), 10 events
- Blighted: Ritual complete, Harald exhausted, Brynn touring with hidden scrying anchors

**Branch:** `feature/turn-1-resolution` (ready for checkout)

### Y1-T2 Resolution (2026-02-07 / 02:28 UTC) - V3 COMPLETE ✅
**All 8 kingdoms completed with full template compliance (923-line structure):**

**Key Achievements:**
- ✅ All 8 YAMLs generated with complete dashboard sections
- ✅ Fog of war properly maintained (Mages saw everything, Ninja victims confused, etc.)
- ✅ 11-15 unique, kingdom-specific events per kingdom
- ✅ 4 petitions per kingdom with real consequences
- ✅ Territorial changes applied: Elm Green (Crownlands), Lake Meadow (Ironbound), North Hawk Barrens (contested)
- ✅ Casualties tracked: Ironbound 148, Merchants 70, Cowboys 64
- ✅ Income disruptions applied via consequences: Pirates (smuggling -200g), Merchants (banking -300g), Cowboys (cattle drives -100g), Blighted (fear tithes -140g)
- ✅ Heroes updated with completion statuses and history entries
- ✅ Projects decremented or completed
- ✅ Stability changes applied (Crownlands +5, Ironbound -5, Blighted -1, Cowboys uneasy)

**Narrative Highlights:**
- **Crownlands**: Bloodless victory, legitimacy affirmed, stability climbing (joy)
- **Ironbound**: Conquest success but trade collapsed 89% (pyrrhic)
- **Mages**: Over-commitment has consequences, 3 exhausted apprentices, academy protests
- **Ninjas**: Both ops SUCCESS, victims confused ("mysterious" causes, no one knows it was them)
- **Pirates**: Sea-shrine discovery offsets smuggling loss, still profitable
- **Merchants**: HURTING — invisible ninja enemy, banking crisis, expedition stalled, agent burned
- **Cowboys**: Spooked and superstitious, blaming curses for ninja sabotage, campaign delayed
- **Blighted**: Rite 1/4 complete, Harald exhausted, Brynn planting scrying anchors, vassals emboldened

**Sir Aldric Appears Across All Kingdoms** — Great unifying NPC, all 8 received him as petition option

**Branch:** All YAMLs written to `data/current/kingdoms/` (ready for Drew review/approval before push)

## AsyncWar Architecture Migration (2026-02-11)

### Data Storage Upgrade: YAML → SQLite
Drew migrating data layer from YAML to SQLite. Major rewrite he's doing locally.

**New data structure (as of 2026-02-12):**
- `data/current/game.db` — SQLite database (SOURCE OF TRUTH)
- `data/turns/{turnNumber}/narratives/{kingdom}.yaml` — turn narrative/events
- `data/turns/{turnNumber}/manifests/{kingdom}.json` — mechanical changes
- `data/turns/{turnNumber}/orders/{kingdom}.md` — turn orders
- `data/archive/kingdoms/` — old YAML snapshots
- Old path `data/current/kingdoms/*.yaml` no longer exists
- Turn resolution scripts: `web_dashboard/scripts/turn-resolution/`

**Status:** SQLite migration complete. Turn 2 resolved.

## Current Game State (Y1-T2 Resolved, T3 Orders Pending)

### Pirates (Adam) — T3 Strategic Direction
- WWT annexed, Sir Aldric hired (chose pirates over mages!), shrine awakening in progress
- All 4 deployable operatives committed (3 spies NSH, 1 agent Dawnwood)
- Adam wants: Lichen Glades false flag, Amber Pastures expansion, storm god propaganda, arcane Compass research
- Adam's vibe: wants to "Cabin in the Woods" the game by awakening a storm god elder deity 😂
- PIRATE SPIES detected in Mage territory (North Storm Highlands) running false flag ops

### Mages (Brad) — T3 Strategic Direction
- Operation Shepherd's Embrace succeeded but EXPOSURE RISK (boot prints noticed)
- New province: Western Storm Pastures (needs governance)
- Beast Handler Corps: 3 turns remaining (Zorvane leading)
- Arcane Tower: 1 turn remaining (completes T3)
- 3 spies now available (completed network expansion)
- Pending: Ninja diplomatic mission (deferred until heroes free)
- Key threats: Pirate subversion, Ironbound expansion, Shepherd's Embrace exposure
- Brad plays from mobile (map doesn't work well - feature request filed)

---

*Update this when something significant happens that future-me should remember.*
