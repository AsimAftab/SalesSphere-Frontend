import { describe, it, expect } from "vitest";

// Test the validation logic directly (extracted from the useMemo in the hook)
// to avoid needing React rendering for pure logic tests.

interface ValidationInput {
  status: string | null;
  note: string;
  originalStatus: string | null;
  originalNote: string | null;
  isWeeklyOffDay: boolean;
  isDataLoading: boolean;
}

function computeValidation(input: ValidationInput) {
  const { status, note, originalStatus, originalNote, isWeeklyOffDay, isDataLoading } = input;
  const isStatusChanged = originalStatus !== status;
  const isNoteChanged = (originalNote || "") !== note;
  const isUnchanged = !isStatusChanged && !isNoteChanged;
  const isNoteRequired = isStatusChanged && !isWeeklyOffDay;
  const isNoteMissing = isNoteRequired && !note.trim();
  const canSave =
    !!status &&
    status !== "-" &&
    !isUnchanged &&
    !isDataLoading &&
    !isNoteMissing &&
    !isWeeklyOffDay;

  return { isStatusChanged, isNoteChanged, isUnchanged, isNoteRequired, isNoteMissing, canSave };
}

describe("Attendance validation logic", () => {
  const base: ValidationInput = {
    status: "P",
    note: "",
    originalStatus: "P",
    originalNote: "",
    isWeeklyOffDay: false,
    isDataLoading: false,
  };

  it("detects unchanged state", () => {
    const result = computeValidation(base);
    expect(result.isUnchanged).toBe(true);
    expect(result.canSave).toBe(false); // nothing changed
  });

  it("detects status change", () => {
    const result = computeValidation({ ...base, status: "A" });
    expect(result.isStatusChanged).toBe(true);
  });

  it("detects note change", () => {
    const result = computeValidation({ ...base, note: "Updated note" });
    expect(result.isNoteChanged).toBe(true);
    expect(result.canSave).toBe(true); // note changed, status valid
  });

  it("requires note when status changes on a normal day", () => {
    const result = computeValidation({ ...base, status: "A", note: "" });
    expect(result.isNoteRequired).toBe(true);
    expect(result.isNoteMissing).toBe(true);
    expect(result.canSave).toBe(false);
  });

  it("allows save when status changes and note is provided", () => {
    const result = computeValidation({ ...base, status: "A", note: "Sick leave" });
    expect(result.isNoteRequired).toBe(true);
    expect(result.isNoteMissing).toBe(false);
    expect(result.canSave).toBe(true);
  });

  it("does not require note for weekly off day status change", () => {
    const result = computeValidation({ ...base, status: "A", isWeeklyOffDay: true });
    expect(result.isNoteRequired).toBe(false);
    expect(result.isNoteMissing).toBe(false);
  });

  it("cannot save on weekly off day", () => {
    const result = computeValidation({
      ...base,
      status: "A",
      note: "Some note",
      isWeeklyOffDay: true,
    });
    expect(result.canSave).toBe(false);
  });

  it("cannot save while data is loading", () => {
    const result = computeValidation({
      ...base,
      status: "A",
      note: "Note",
      isDataLoading: true,
    });
    expect(result.canSave).toBe(false);
  });

  it("cannot save when status is null", () => {
    const result = computeValidation({ ...base, status: null, note: "Note" });
    expect(result.canSave).toBe(false);
  });

  it("cannot save when status is '-'", () => {
    const result = computeValidation({ ...base, status: "-", originalStatus: "P", note: "Note" });
    expect(result.canSave).toBe(false);
  });

  it("treats null originalNote as empty string", () => {
    const result = computeValidation({ ...base, originalNote: null, note: "" });
    expect(result.isNoteChanged).toBe(false);
  });

  it("detects note change from null to text", () => {
    const result = computeValidation({ ...base, originalNote: null, note: "New note" });
    expect(result.isNoteChanged).toBe(true);
    expect(result.canSave).toBe(true);
  });
});
