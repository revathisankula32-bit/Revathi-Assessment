import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HomePage } from "../../app/page";

// ✅ Mock framer-motion so animations don't keep elements in the DOM during tests
vi.mock("framer-motion", async () => {
  const React = (await import("react")).default;

  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
  };
});

function setLocalStorageTasks(raw: unknown) {
  window.localStorage.setItem("ca_tasks_v1", JSON.stringify(raw));
}

function getLocalStorageRaw() {
  return window.localStorage.getItem("ca_tasks_v1");
}

describe("Tasks Board workflow", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("adds a task successfully", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.type(screen.getByLabelText(/title/i), "Buy milk");
    await user.type(screen.getByLabelText(/notes/i), "Costco");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.getByText("Costco")).toBeInTheDocument();
  });

  it("shows validation error when title is too short", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.type(screen.getByLabelText(/title/i), "A");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument();
  });

  it("search filters tasks by title/notes", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.type(screen.getByLabelText(/title/i), "Buy milk");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    await user.type(screen.getByLabelText(/title/i), "Gym session");
    await user.type(screen.getByLabelText(/notes/i), "Leg day");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    // sanity: both are present
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.getByText("Gym session")).toBeInTheDocument();

    await user.type(screen.getByLabelText(/search/i), "milk");

    // After search, Gym session should disappear
    await waitFor(() => {
      expect(screen.getByText("Buy milk")).toBeInTheDocument();
      expect(screen.queryByText("Gym session")).toBeNull();
    });
  });

  it("toggles a task to done and updates UI", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.type(screen.getByLabelText(/title/i), "Pay bill");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    await user.click(screen.getByRole("button", { name: /mark done/i }));

    // ✅ Reliable assertion: button label changes
    expect(screen.getByRole("button", { name: /mark todo/i })).toBeInTheDocument();
    expect(screen.getByText("Pay bill")).toBeInTheDocument();
  });

  it("deletes a task", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.type(screen.getByLabelText(/title/i), "Remove me");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(screen.getByText("Remove me")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    expect(screen.queryByText("Remove me")).toBeNull();
  });

  it("reads tasks from localStorage on load and writes on changes", async () => {
    setLocalStorageTasks([
      {
        id: "t1",
        title: "Seeded task",
        notes: "from storage",
        status: "todo",
        createdAt: new Date().toISOString(),
      },
    ]);

    const setItemSpy = vi.spyOn(window.localStorage.__proto__, "setItem");

    const user = userEvent.setup();
    render(<HomePage />);

    expect(screen.getByText("Seeded task")).toBeInTheDocument();

    await user.type(screen.getByLabelText(/title/i), "New task");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(setItemSpy).toHaveBeenCalled();
    const raw = getLocalStorageRaw();
    expect(raw).toBeTruthy();
    expect(raw!).toContain("New task");
  });
});
