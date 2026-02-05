# HEARTBEAT.md

## Periodic Tasks

### Workspace Backup (every few hours)
```bash
cd /root/.openclaw/workspace && git add -A && git diff --cached --quiet || git commit -m "auto-backup $(date +%Y-%m-%d-%H%M)" && git push
```
Only commit if there are changes. Don't spam empty commits.

### Memory Maintenance (daily)
- Review recent memory files
- Update MEMORY.md with significant learnings
- Clean up outdated info

### QMD Index Update (every few hours)
```bash
export PATH="$HOME/.bun/bin:$PATH" && qmd update
```
Keeps BM25 keyword search fresh as files change. Use `qmd search "query"` for fast local doc retrieval instead of loading full files into context.
