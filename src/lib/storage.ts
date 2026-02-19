import type { Task } from "./tasks";

const STORAGE_KEY = "ca_tasks_v1";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function loadTasks(): Task[] {
  if (!isBrowser()) return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Task[];
  } catch (error) {
    console.error("Failed to load tasks from localStorage", error);
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks to localStorage", error);
  }
}

export function clearTasks(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}
