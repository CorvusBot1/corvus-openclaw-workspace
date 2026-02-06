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

---

*Update this when something significant happens that future-me should remember.*
