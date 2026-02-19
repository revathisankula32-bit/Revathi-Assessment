"use client";

import * as React from "react";
import { isValidTitle } from "@/lib/tasks";

type Props = {
  onAdd: (input: { title: string; notes?: string }) => void;
};

export default function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isValidTitle(title)) {
      setError("Title must be at least 2 characters.");
      return;
    }

    setError(null);

    onAdd({
      title: title.trim(),
      notes: notes.trim() ? notes.trim() : undefined,
    });

    // reset fields
    setTitle("");
    setNotes("");
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <div className="space-y-1">
        <label htmlFor="title" className="block text-sm font-medium">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Prepare assessment demo"
          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
          aria-invalid={!!error}
          aria-describedby={error ? "title-error" : undefined}
        />
        {error ? (
          <p id="title-error" className="text-sm text-red-600">
            {error}
          </p>
        ) : null}
      </div>

      <div className="space-y-1">
        <label htmlFor="notes" className="block text-sm font-medium">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add more details..."
          className="w-full min-h-[90px] rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        Add Task
      </button>
    </form>
  );
}
