# Brad (Verdant Sanctum) - Extended Session Notes

## Key Interactions (2026-02-06 to 2026-02-12)

### Y1-T1 Orders (2026-02-06)
- Brad submitted full T1 orders through me + web dashboard
- Cancelled Fort and Watchtower construction
- Established Beast Handler Corps (Razorboars + Thornback Stalkers) led by Freya the Silent
- All mages fully committed: Research, Beast Corps, Wards, Grimoire Study, Border Scrying
- All operatives deployed (3 spies network expansion, 5 informants passive)
- Both petitions granted (Miners, Refugees)
- Drew corrected me: turn order format should match web dashboard format exactly
- Created TURN_ORDER_FORMAT.md in asyncwar/docs/

### Y1-T2 Orders (2026-02-07)
Brad got very strategic this turn:

**Operation Shepherd's Embrace** - Brad's signature move:
- False flag operation: 60 troops disguised as bandits raid unclaimed lands north of Sanctum
- Raids for actual gold (not just intimidation), preserve structures and lives
- Freya follows as envoy: "We scryed the bandits and came to help"
- Offer protection in exchange for annexation
- OUTCOME (Turn 2 resolution): Mostly successful but a trader noticed matching boot prints on "bandits" and envoy escort. Exposure risk is HIGH.

**Diplomatic Moves:**
- Blighted Covenant: Accept limited knowledge exchange + peace/trade treaty offer
- Treat Envoy Brynn with hospitality, discreet surveillance via palace escort
- Sir Aldric offered employment (his choice of role) - HE CHOSE PIRATES INSTEAD
- Wanted to send envoy to Ninjas (Obsidian Veil) but deferred until heroes free
- Contingency: If Sir Aldric accepts → takes defense, War Mage Aldric leads Ninja mission (moot - Sir Aldric went to pirates)

**Internal:**
- Academy Unrest: Implement safety protocols
- Strained Apprentices: Enhanced recovery + compensation
- Academy Feast (~100g) for morale
- Zorvane takes over Beast Corps when Freya deploys as envoy

### Y1-T2 Turn Resolution Results
- Shepherd's Embrace: Territory acquired BUT exposure risk (boot prints noticed)
- Sir Aldric chose Stormbreak Confederacy (pirates) over us
- Pirate spies detected in North Storm Highlands running false flag against us!
- Ironbound General Valkren crushed North Hawk Barrens with two-army convergence
- Pirate hero Godric Stormborn awakening something at Stormcaller's Shrine
- Blighted exchange initiated, Brynn departed after offering deeper partnership
- Academy feast + reforms quelled unrest
- 3 spies completed Network Expansion (now available)
- Arcane Tower: 1 turn remaining

### New Petitions (Y1-T3):
1. Pirate Spies in Our Midst (Crisis) - 3 pirate operatives in North Storm Highlands
2. Governance of Western Storm Pastures - newly annexed territory needs admin
3. Deepening Blighted Exchange - Brynn wants expanded research partnership
4. Military Expansion Proposal - Captain Varen wants new company (~200g)

## Drew's Corrections (IMPORTANT - Don't Repeat)
1. **Informants are NOT deployable** - Passive only, recruitment pipeline for spies. Drew corrected me AGAIN on this.
2. **Turn order format** - Must match web dashboard format exactly, not custom JSON
3. **Don't create both JSON and markdown** - Pick one format
4. **Pull latest data from repo** before answering kingdom questions
5. **Dashboard has the info** - Drew hinted Brad should use dashboard more, don't burn API on stuff that's in the UI

## Data Architecture Changes (2026-02-11/12)
- Drew migrated from YAML → SQLite (game.db)
- Kingdom YAMLs moved to data/archive/
- Turn data now in data/turns/{turnNumber}/narratives/{kingdom}.yaml and manifests/{kingdom}.json
- Old path data/current/kingdoms/ no longer has YAML files
- data/current/game.db is the new source of truth
- Massive turn resolution scripts added in web_dashboard/scripts/turn-resolution/

## Brad's Personality
- Very strategic/creative thinker (false flags, protection rackets, arcane beast corps)
- Wants to "Cabin in the Woods" style play - unusual/creative approaches
- Sometimes confuses kingdom names (called Blighted envoy "ninja envoy")
- Plays on mobile - can't see map well, feature request filed
- Enthusiastic about the game, asks lots of questions
- Bangkok timezone (UTC+7)
