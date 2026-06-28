---
created_at: 2026-05-27
---
# PR #1: Add Sort by Due Date preference

Everything needed to file this PR manually.

## Quick links

- **Open the PR form (pre-filled):** https://github.com/ozencb/raycast-obsidian-tasks-extension/compare/main...shomtsm:raycast-obsidian-tasks-extension:pr/sort-by-due-date?expand=1
- **Fork branch:** https://github.com/shomtsm/raycast-obsidian-tasks-extension/tree/pr/sort-by-due-date
- **Upstream repo:** https://github.com/ozencb/raycast-obsidian-tasks-extension
- **Base / head:** `ozencb/raycast-obsidian-tasks-extension:main` ← `shomtsm:pr/sort-by-due-date`

## Title

```
Add Sort by Due Date preference for List Tasks
```

## Body (copy-paste)

```markdown
## Summary
- Adds a "Sort by Due Date" preference (checkbox, off by default) alongside the existing "Sort by Priority"
- When both are enabled, due date is primary and priority is the tiebreaker
- Tasks without a due date sort to the end
- Extracts the sort logic into a helper so it is also applied on `refreshTaskList` (previously the priority sort was only applied on the initial fetch, so order was lost after marking a task done)

## Why
List Tasks currently has no way to sort by due date. For users who plan around deadlines, deadline order is the most useful default. Existing behavior is preserved: `sortByDueDate` defaults to off and `sortByPriority` keeps its current semantics.

## Test plan
- [x] `npm run lint` passes
- [ ] Both prefs off: parse order (unchanged)
- [ ] Only Sort by Priority on: matches previous behavior
- [ ] Only Sort by Due Date on: earliest due first, no-date last
- [ ] Both on: due date primary, priority tiebreaker
- [ ] Mark a task done: sort is preserved
```

## Files changed (3)

- `package.json` — new `sortByDueDate` preference entry
- `src/types/index.ts` — `sortByDueDate: boolean` on `Preferences`
- `src/hooks/useTasks.ts` — extracted `sortTasks(tasks, preferences)` helper; applied in both `fetchTasks` and `refreshTaskList`

## Optional: file via gh CLI instead of the web form

```bash
gh pr create \
  --repo ozencb/raycast-obsidian-tasks-extension \
  --base main \
  --head shomtsm:pr/sort-by-due-date \
  --title "Add Sort by Due Date preference for List Tasks" \
  --body-file doc/pr-1-sort-by-due-date.body.md
```

(If you go this route, copy the **Body** section above into `doc/pr-1-sort-by-due-date.body.md` first — gh expects a plain markdown file without the surrounding fences.)

## Screenshots (optional but helpful)

The maintainer's repo doesn't use a PR template, so screenshots are not required — but a single screenshot of List Tasks with due-date-sorted output would make the value obvious. Easiest workflow:

1. Open the PR via the web link above
2. Drag-and-drop the screenshot into the body textarea on GitHub — it uploads and inserts the markdown automatically
3. Submit
