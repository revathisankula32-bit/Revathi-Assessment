"use client";

import * as React from "react";
import TaskForm from "@/components/tasks/TaskForm";
import TaskList from "@/components/tasks/TaskList";
import type { Task, TaskFilter } from "@/lib/tasks";
import {
  createTask,
  filterTasks,
  toggleTaskStatus,
  upsertTask,
  deleteTask,
} from "@/lib/tasks";
import { loadTasks, saveTasks } from "@/lib/storage";

export function HomePage() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<TaskFilter>("all");

  React.useEffect(() => {
    const existing = loadTasks();
    setTasks(existing);
  }, []);

  React.useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const visibleTasks = React.useMemo(() => {
    return filterTasks(tasks, query, filter);
  }, [tasks, query, filter]);

  function handleAdd(input: { title: string; notes?: string }) {
    const newTask = createTask(input);
    setTasks((prev) => [newTask, ...prev]);
  }

  function handleToggle(id: string) {
    setTasks((prev) => {
      const current = prev.find((t) => t.id === id);
      if (!current) return prev;
      const updated = toggleTaskStatus(current);
      return upsertTask(prev, updated);
    });
  }

  function handleDelete(id: string) {
    setTasks((prev) => deleteTask(prev, id));
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow">
        <div className="mx-auto max-w-3xl px-4 py-10 space-y-8">
          <header className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Tasks Board
            </h1>

            {/* Friend Name */}
            <p className="text-sm text-gray-500">
              Built by <span className="font-semibold">Revathi Sankula</span>
            </p>

            <p className="text-sm text-gray-600">
              Create tasks, search, filter by status, and keep them saved even after refresh.
            </p>
          </header>

          <section className="rounded-lg border bg-white p-5">
            <TaskForm onAdd={handleAdd} />
          </section>

          <section className="rounded-lg border bg-white p-5 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="w-full sm:max-w-xs">
                <label htmlFor="search" className="block text-sm font-medium">
                  Search
                </label>
                <input
                  id="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search title or notes..."
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                />
              </div>

              <div className="w-full sm:w-48">
                <label htmlFor="filter" className="block text-sm font-medium">
                  Status
                </label>
                <select
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as TaskFilter)}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                >
                  <option value="all">All</option>
                  <option value="todo">Todo</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            {visibleTasks.length === 0 ? (
              <div className="rounded-lg border p-6 text-center text-sm text-gray-600">
                {tasks.length === 0
                  ? "No tasks yet. Add your first task above."
                  : "No matching tasks."}
              </div>
            ) : (
              <TaskList
                tasks={visibleTasks}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            )}
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white py-4">
        <div className="mx-auto max-w-3xl px-4 text-center text-sm text-gray-500">
          © 2026 Revathi Sankula. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

export default HomePage;
