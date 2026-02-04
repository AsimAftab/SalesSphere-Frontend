import { describe, it, expect } from "vitest";

// Extracted multi-criteria note filtering from useNoteManager

interface MockNote {
  _id: string;
  title: string;
  createdBy: { _id: string; name: string };
  entityType: string;
  createdAt: string;
}

interface NoteFilters {
  entityType: string;
  date: string;
  month: string;
  employee: string;
}

function filterNotes(
  notes: MockNote[],
  searchQuery: string,
  filters: NoteFilters
): MockNote[] {
  return notes.filter((n) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !n.title.toLowerCase().includes(q) &&
        !n.createdBy.name.toLowerCase().includes(q)
      )
        return false;
    }
    if (filters.entityType && n.entityType !== filters.entityType) return false;
    if (filters.employee && n.createdBy._id !== filters.employee) return false;
    if (filters.month) {
      const monthName = new Date(n.createdAt).toLocaleString("default", { month: "long" });
      if (monthName !== filters.month) return false;
    }
    if (filters.date) {
      const noteDate = new Date(n.createdAt).toISOString().split("T")[0];
      if (noteDate !== filters.date) return false;
    }
    return true;
  });
}

function extractEmployeeOptions(notes: MockNote[]): { label: string; value: string }[] {
  const map = new Map<string, string>();
  notes.forEach((n) => map.set(n.createdBy._id, n.createdBy.name));
  return Array.from(map.entries()).map(([id, name]) => ({ label: name, value: id }));
}

const notes: MockNote[] = [
  { _id: "1", title: "Meeting notes", createdBy: { _id: "u1", name: "Alice" }, entityType: "Party", createdAt: "2025-01-15T00:00:00Z" },
  { _id: "2", title: "Follow-up call", createdBy: { _id: "u2", name: "Bob" }, entityType: "Prospect", createdAt: "2025-02-20T00:00:00Z" },
  { _id: "3", title: "Site visit", createdBy: { _id: "u1", name: "Alice" }, entityType: "Site", createdAt: "2025-01-25T00:00:00Z" },
];

const noFilters: NoteFilters = { entityType: "", date: "", month: "", employee: "" };

describe("Note manager – filtering", () => {
  it("returns all with no filters", () => {
    expect(filterNotes(notes, "", noFilters)).toHaveLength(3);
  });

  it("filters by title search", () => {
    expect(filterNotes(notes, "Meeting", noFilters)).toHaveLength(1);
  });

  it("filters by creator name search", () => {
    expect(filterNotes(notes, "Alice", noFilters)).toHaveLength(2);
  });

  it("filters by entity type", () => {
    expect(filterNotes(notes, "", { ...noFilters, entityType: "Party" })).toHaveLength(1);
  });

  it("filters by employee", () => {
    expect(filterNotes(notes, "", { ...noFilters, employee: "u2" })).toHaveLength(1);
  });

  it("filters by month", () => {
    expect(filterNotes(notes, "", { ...noFilters, month: "January" })).toHaveLength(2);
  });

  it("combines search and entity type", () => {
    expect(filterNotes(notes, "Alice", { ...noFilters, entityType: "Site" })).toHaveLength(1);
  });

  it("returns empty for no match", () => {
    expect(filterNotes(notes, "xyz", noFilters)).toHaveLength(0);
  });
});

describe("Note manager – employee options", () => {
  it("extracts unique employees", () => {
    const options = extractEmployeeOptions(notes);
    expect(options).toHaveLength(2);
    expect(options.find((o) => o.label === "Alice")).toBeDefined();
    expect(options.find((o) => o.label === "Bob")).toBeDefined();
  });
});
