import { describe, it, expect } from "vitest";
import {
  getDaysInMonth,
  getWorkingDays,
  applyDefaultAttendance,
  getFullDateString,
} from "../attendanceHelpers";

describe("getDaysInMonth", () => {
  it("returns 31 for January", () => {
    expect(getDaysInMonth("January", 2026)).toBe(31);
  });

  it("returns 28 for February in a non-leap year", () => {
    expect(getDaysInMonth("February", 2026)).toBe(28);
  });

  it("returns 29 for February in a leap year", () => {
    expect(getDaysInMonth("February", 2024)).toBe(29);
  });

  it("returns 30 for April", () => {
    expect(getDaysInMonth("April", 2026)).toBe(30);
  });

  it("returns 31 for December", () => {
    expect(getDaysInMonth("December", 2026)).toBe(31);
  });
});

describe("getWorkingDays", () => {
  it("counts present days", () => {
    expect(getWorkingDays("PPPPP")).toBe(5);
  });

  it("counts half days as 0.5", () => {
    expect(getWorkingDays("PPPHH")).toBe(4); // 3P + 2*0.5
  });

  it("counts weekly offs", () => {
    expect(getWorkingDays("PPPPPPW")).toBe(7); // 6P + 1W
  });

  it("counts leaves", () => {
    expect(getWorkingDays("PPPPL")).toBe(5); // 4P + 1L
  });

  it("does not count absent days", () => {
    expect(getWorkingDays("PPAA")).toBe(2);
  });

  it("handles mixed string", () => {
    // 3P + 1H(0.5) + 1W + 1L + 1A = 3 + 0.5 + 1 + 1 = 5.5
    expect(getWorkingDays("PPPHWLA")).toBe(5.5);
  });

  it("handles empty string", () => {
    expect(getWorkingDays("")).toBe(0);
  });

  it("handles dashes (no data)", () => {
    expect(getWorkingDays("-----")).toBe(0);
  });
});

describe("applyDefaultAttendance", () => {
  const calendarDays = [
    { day: 1, weekday: "Mon", isWeeklyOff: false },
    { day: 2, weekday: "Tue", isWeeklyOff: false },
    { day: 3, weekday: "Wed", isWeeklyOff: false },
    { day: 4, weekday: "Thu", isWeeklyOff: false },
    { day: 5, weekday: "Fri", isWeeklyOff: false },
    { day: 6, weekday: "Sat", isWeeklyOff: true },
    { day: 7, weekday: "Sun", isWeeklyOff: false },
  ];

  it("fills empty slots with '-' for non-weekly-off days", () => {
    const result = applyDefaultAttendance(calendarDays, "");
    expect(result).toBe("-----W-");
  });

  it("fills weekly off days with 'W' when empty", () => {
    const result = applyDefaultAttendance(calendarDays);
    expect(result[5]).toBe("W");
  });

  it("preserves existing attendance data", () => {
    const result = applyDefaultAttendance(calendarDays, "PPA  W ");
    expect(result).toBe("PPA--W-");
  });

  it("truncates to number of calendar days", () => {
    const result = applyDefaultAttendance(calendarDays, "PPPPPPPPPPPP");
    expect(result.length).toBe(7);
  });
});

describe("getFullDateString", () => {
  it("formats day 1 of January 2026", () => {
    expect(getFullDateString(1, "January", 2026)).toBe("2026-01-01");
  });

  it("formats day 15 of December 2025", () => {
    expect(getFullDateString(15, "December", 2025)).toBe("2025-12-15");
  });

  it("pads single-digit day", () => {
    expect(getFullDateString(5, "March", 2026)).toBe("2026-03-05");
  });
});
