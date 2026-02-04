import { describe, it, expect } from "vitest";

// Test the status determination logic extracted from useStatusUpdate

interface MockRecord {
  status: string;
  checkInTime?: string | null;
  markedBy?: string | null;
  notes?: string | null;
}

function determineInitialStatus(
  record: MockRecord | null,
  isWeeklyOffDay: boolean,
  isDataLoading: boolean
) {
  if (isDataLoading) return { status: "", note: "" };

  if (!record) {
    const defaultStatus = isWeeklyOffDay ? "W" : "";
    return { status: defaultStatus, note: "" };
  }

  const isSystemAbsent = record.status === "A" && !record.checkInTime && !record.markedBy;
  const hasValidData =
    record.status && record.status !== "-" && record.status !== "NA" && !isSystemAbsent;
  const isActuallyEmpty = !hasValidData && !record.checkInTime;

  if (isActuallyEmpty) {
    const defaultStatus = isWeeklyOffDay ? "W" : "";
    return { status: defaultStatus, note: "" };
  }

  const status = record.status === "NA" || record.status === "-" ? "" : record.status;
  const note = record.notes && record.notes !== "NA" ? record.notes : "";
  return { status: status || "", note };
}

describe("Status update – initial status determination", () => {
  it("returns empty while loading", () => {
    const result = determineInitialStatus(null, false, true);
    expect(result.status).toBe("");
  });

  it("defaults to empty when no record and not weekly off", () => {
    const result = determineInitialStatus(null, false, false);
    expect(result.status).toBe("");
  });

  it("defaults to 'W' when no record and is weekly off", () => {
    const result = determineInitialStatus(null, true, false);
    expect(result.status).toBe("W");
  });

  it("detects system absent (A without checkIn or markedBy)", () => {
    const record = { status: "A", checkInTime: null, markedBy: null };
    const result = determineInitialStatus(record, false, false);
    expect(result.status).toBe("");
  });

  it("uses existing status for valid records", () => {
    const record = { status: "P", checkInTime: "09:00", markedBy: "admin" };
    const result = determineInitialStatus(record, false, false);
    expect(result.status).toBe("P");
  });

  it("normalizes NA status to empty", () => {
    const record = { status: "NA", checkInTime: "09:00" };
    const result = determineInitialStatus(record, false, false);
    expect(result.status).toBe("");
  });

  it("normalizes '-' status to empty", () => {
    const record = { status: "-", checkInTime: "09:00" };
    const result = determineInitialStatus(record, false, false);
    expect(result.status).toBe("");
  });

  it("extracts note from record", () => {
    const record = { status: "L", notes: "Sick leave", checkInTime: null, markedBy: "admin" };
    const result = determineInitialStatus(record, false, false);
    expect(result.note).toBe("Sick leave");
  });

  it("treats 'NA' notes as empty", () => {
    const record = { status: "P", notes: "NA", checkInTime: "09:00" };
    const result = determineInitialStatus(record, false, false);
    expect(result.note).toBe("");
  });
});

function isNoteRequired(currentStatus: string, originalStatus: string): boolean {
  return currentStatus !== originalStatus && !!currentStatus;
}

describe("Status update – note requirement", () => {
  it("note is required when status changes", () => {
    expect(isNoteRequired("A", "P")).toBe(true);
  });

  it("note is not required when status unchanged", () => {
    expect(isNoteRequired("P", "P")).toBe(false);
  });

  it("note is not required when status is empty", () => {
    expect(isNoteRequired("", "P")).toBe(false);
  });
});
