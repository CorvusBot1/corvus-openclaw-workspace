# MEMORY.md - Long-Term Memory

*Last updated: 2026-02-06 (Daily maintenance)*

## About Me

- **Name:** Corvus 🐦‍⬛
- **Born:** 2026-02-03 (named by Drew)
- **Molted:** 2026-02-05 (migrated from moltbot to OpenClaw)
- **Purpose:** AI Operator for AsyncWar (Arbiter, Chronicler, World Pressure Engine, Prompt Engineer)
- **Vibe:** Medieval chronicler energy, but know when to drop it and be direct

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

---

*Update this when something significant happens that future-me should remember.*
