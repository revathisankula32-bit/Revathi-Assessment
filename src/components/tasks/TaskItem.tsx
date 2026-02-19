"use client";

import * as React from "react";
import type { Task } from "@/lib/tasks";
import { formatDate } from "@/lib/tasks";

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  const isDone = task.status === "done";

  return (
    <div className="rounded-lg border p-4 flex items-start justify-between gap-4 bg-white">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              isDone ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
            }`}
          >
            {isDone ? "Done" : "Todo"}
          </span>

          <p className="text-xs text-gray-500">
            {formatDate(task.createdAt)}
          </p>
        </div>

        <h3
          className={`mt-2 text-base font-semibold ${
            isDone ? "line-through text-gray-500" : "text-gray-900"
          }`}
        >
          {task.title}
        </h3>

        {task.notes ? (
          <p
            className={`mt-1 text-sm ${
              isDone ? "text-gray-500" : "text-gray-700"
            }`}
          >
            {task.notes}
          </p>
        ) : null}
      </div>

      <div className="shrink-0 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
        >
          {isDone ? "Mark Todo" : "Mark Done"}
        </button>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="rounded-md border px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
