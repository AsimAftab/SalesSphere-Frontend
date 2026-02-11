import { describe, it, expect } from "vitest";
import {
  formatDateToLocalISO,
  isSameDate,
  getMonthName,
  formatFilterDate,
  formatDisplayDate,
  formatDisplayDateTime,
} from "@/utils/dateUtils";

describe("formatDateToLocalISO", () => {
  it("formats a date to YYYY-MM-DD", () => {
    const date = new Date(2026, 0, 5); // Jan 5, 2026
    expect(formatDateToLocalISO(date)).toBe("2026-01-05");
  });

  it("pads single-digit month and day", () => {
    const date = new Date(2026, 2, 9); // Mar 9
    expect(formatDateToLocalISO(date)).toBe("2026-03-09");
  });

  it("handles Dec 31", () => {
    const date = new Date(2025, 11, 31);
    expect(formatDateToLocalISO(date)).toBe("2025-12-31");
  });
});

describe("isSameDate", () => {
  it("returns true for identical strings", () => {
    expect(isSameDate("2026-01-15", "2026-01-15")).toBe(true);
  });

  it("returns false for different dates", () => {
    expect(isSameDate("2026-01-15", "2026-01-16")).toBe(false);
  });
});

describe("getMonthName", () => {
  it("extracts month name from YYYY-MM-DD", () => {
    expect(getMonthName("2026-03-15")).toBe("March");
  });

  it("extracts month name from ISO string", () => {
    expect(getMonthName("2026-12-01T00:00:00Z")).toBe("December");
  });
});

describe("formatFilterDate", () => {
  it("formats same as formatDateToLocalISO", () => {
    const date = new Date(2026, 5, 15); // Jun 15
    expect(formatFilterDate(date)).toBe("2026-06-15");
  });
});

describe("formatDisplayDate", () => {
  it("formats to 'day Mon year'", () => {
    const result = formatDisplayDate("2026-01-21");
    expect(result).toMatch(/21.*Jan.*2026/);
  });

  it("formats ISO string", () => {
    const result = formatDisplayDate("2026-07-04T12:00:00Z");
    expect(result).toMatch(/Jul.*2026/);
  });
});

describe("formatDisplayDateTime", () => {
  it("returns '-' for null/undefined", () => {
    expect(formatDisplayDateTime(null)).toBe("-");
    expect(formatDisplayDateTime(undefined)).toBe("-");
  });

  it("formats a full ISO datetime", () => {
    const result = formatDisplayDateTime("2026-01-21T14:30:00Z");
    expect(result).toMatch(/Jan.*2026/);
    expect(result).toMatch(/[AP]M/);
  });

  it("handles time-only string (legacy)", () => {
    const result = formatDisplayDateTime("14:30");
    expect(result).toMatch(/[AP]M/);
  });

  it("returns the original string for invalid dates", () => {
    expect(formatDisplayDateTime("not-a-date")).toBe("not-a-date");
  });

  it("formats a Date object", () => {
    const date = new Date(2026, 0, 21, 14, 30);
    const result = formatDisplayDateTime(date);
    expect(result).toMatch(/21.*Jan.*2026/);
  });
});
