# Spec 001 — Tasks Workflow (CRUD + Search + Local Persistence)

## Summary
Implement a Tasks Board that supports create, list, filter/search, toggle done, delete, and persists tasks in localStorage.

## User Stories
1. As a user, I can add a task with a title so I can track work.
2. As a user, I can see all tasks in a list so I can review them.
3. As a user, I can search tasks by title/notes so I can find items quickly.
4. As a user, I can toggle a task as done so I can track progress.
5. As a user, I can delete a task so I can remove completed/irrelevant items.
6. As a user, my tasks persist after refresh so I don’t lose my work.

## Acceptance Criteria
### Create
- A form exists with:
  - Title (required, min 2 chars)
  - Notes (optional)
  - Add button
- If title is missing/too short, show an inline error and do not add.

### List
- Tasks display in a clean card/list layout:
  - Title
  - Notes (if present)
  - Created date (simple format)
  - Status indicator (Todo/Done)
  - Toggle Done button
  - Delete button

### Search/Filter
- A search input filters tasks by:
  - title OR notes (case-insensitive)
- A filter option exists:
  - All / Todo / Done
- When no results match, show “No matching tasks”.

### Toggle Done
- Clicking Toggle Done updates the task status and UI immediately.

### Delete
- Clicking Delete removes the task from UI immediately.

### Persistence
- On first load:
  - If localStorage has tasks, load them into state.
  - If not, start empty.
- After any change (create/toggle/delete):
  - Save the full tasks array to localStorage key `ca_tasks_v1`.

## UI/UX Requirements
- Use shadcn/ui for form controls and buttons where appropriate.
- Use Framer Motion for a subtle animation when tasks appear/remove.
- Responsive layout (works on mobile widths).

## Test Plan (Must Pass Locally)
Write tests that cover:
1) Add task success
2) Add task validation error
3) Search filters results
4) Toggle done changes UI/state
5) Delete removes task
6) Persistence:
   - Reads from localStorage on load
   - Writes to localStorage on change

## Files to Implement (Expected)
- `src/app/page.tsx` (main page)
- `src/components/tasks/TaskForm.tsx`
- `src/components/tasks/TaskList.tsx`
- `src/components/tasks/TaskItem.tsx`
- `src/lib/storage.ts` (localStorage helpers)
- `src/lib/tasks.ts` (task types + pure helpers)
- `src/test/tasks.spec.tsx` (workflow tests)
