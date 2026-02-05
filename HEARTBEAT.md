# HEARTBEAT.md

## Periodic Tasks

### Workspace Backup (every 4 hours max)
Only run if it's been 4+ hours since last backup OR you just did significant work.
```bash
cd /root/.openclaw/workspace && git add -A && git diff --cached --quiet || git commit -m "auto-backup $(date +%Y-%m-%d-%H%M)" && git push
```
Skip if nothing significant changed. Trust that work done in conversation usually gets committed explicitly.

### Memory Maintenance (daily)
- Review recent memory files
- Update MEMORY.md with significant learnings
- Clean up outdated info

## When to just reply HEARTBEAT_OK

Most heartbeats should be quick. Only take action when:
- You've done significant work that wasn't committed
- It's been several hours since last backup
- There's actually something in these tasks that needs doing

If nothing needs attention → HEARTBEAT_OK (no backup needed every time)
