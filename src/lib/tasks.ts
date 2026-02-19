export type TaskStatus = "todo" | "done";

export type Task = {
  id: string;
  title: string;
  notes?: string;
  status: TaskStatus;
  createdAt: string; // ISO string
};

export type TaskFilter = "all" | "todo" | "done";

export function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidTitle(title: string): boolean {
  return normalizeText(title).length >= 2;
}

export function createTask(input: { title: string; notes?: string }): Task {
  const title = input.title.trim();
  const notes = input.notes?.trim();

  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    title,
    notes: notes && notes.length > 0 ? notes : undefined,
    status: "todo",
    createdAt: new Date().toISOString(),
  };
}

export function toggleTaskStatus(task: Task): Task {
  return {
    ...task,
    status: task.status === "todo" ? "done" : "todo",
  };
}

export function deleteTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((t) => t.id !== id);
}

export function upsertTask(tasks: Task[], updated: Task): Task[] {
  const idx = tasks.findIndex((t) => t.id === updated.id);
  if (idx === -1) return [updated, ...tasks];
  const next = [...tasks];
  next[idx] = updated;
  return next;
}

export function filterTasks(tasks: Task[], query: string, filter: TaskFilter): Task[] {
  const q = normalizeText(query);

  return tasks.filter((t) => {
    const matchesStatus =
      filter === "all" ? true : filter === "todo" ? t.status === "todo" : t.status === "done";

    if (!matchesStatus) return false;

    if (!q) return true;

    const haystack = normalizeText(`${t.title} ${t.notes ?? ""}`);
    return haystack.includes(q);
  });
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  // simple, readable format without depending on locale libraries
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}
