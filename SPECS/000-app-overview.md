# Spec 000 — App Overview (Frontend-only)

## Goal
Build a frontend-only web app that demonstrates a real workflow, local persistence, and a working test harness.

## Scope
Frontend-only (no backend). Data will persist using browser storage.

## Tech Stack
- Next.js (App Router)
- React
- Tailwind CSS
- shadcn/ui (UI components)
- Framer Motion (animations)
- Vitest + React Testing Library (tests)

## Core Workflow
A "Tasks Board" app that allows a user to:
1) Create a task
2) View tasks in a list
3) Filter/search tasks
4) Toggle completion status
5) Delete tasks
6) Persist tasks locally (localStorage)

## Data Model
Task:
- id: string (uuid or crypto.randomUUID)
- title: string (required)
- notes: string (optional)
- status: "todo" | "done"
- createdAt: ISO string

## Local Persistence
- Store tasks in localStorage under key: `ca_tasks_v1`
- On app load: read localStorage and hydrate UI
- On change: write updated tasks back to localStorage

## Accessibility + UX
- Inputs have labels
- Buttons have clear text
- Keyboard navigable
- Basic empty states (no tasks, no results)

## Non-Goals
- No authentication
- No server/API routes
- No database
- No external services

## Testing Strategy (High Level)
- Unit/UI tests for:
  - Creating a task
  - Filtering tasks
  - Toggling done
  - Persistence write/read behavior (mock localStorage)
