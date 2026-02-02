import { describe, it, expect } from "vitest";
import { DateTime } from "luxon";

// We test the time window logic extracted from useWebAttendance
// since the hook itself requires react-query + API mocking.

const TIMEZONE = "Asia/Kolkata";

function isCheckInEnabled(
  attendanceType: string,
  orgCheckInTime: string | null,
  now: DateTime
): boolean {
  if (attendanceType !== "CHECK_IN") return false;
  if (!orgCheckInTime) return false;

  try {
    const [h, m] = orgCheckInTime.split(":").map(Number);
    const checkInTime = now.set({ hour: h, minute: m, second: 0 });
    const startWindow = checkInTime.minus({ hours: 2 });
    const endWindow = checkInTime.plus({ minutes: 30 });
    return now >= startWindow && now <= endWindow;
  } catch {
    return false;
  }
}

function canHalfDayCheckOut(
  attendanceType: string,
  orgHalfDayCheckOutTime: string | null,
  now: DateTime
): boolean {
  if (attendanceType !== "CHECK_OUT") return false;
  if (!orgHalfDayCheckOutTime) return false;

  try {
    const [h, m] = orgHalfDayCheckOutTime.split(":").map(Number);
    const halfDayTime = now.set({ hour: h, minute: m, second: 0 });
    const startWindow = halfDayTime.minus({ minutes: 30 });
    const endWindow = halfDayTime.plus({ minutes: 15 });
    return now >= startWindow && now <= endWindow;
  } catch {
    return false;
  }
}

function canFullDayCheckOut(
  attendanceType: string,
  orgCheckOutTime: string | null,
  now: DateTime
): boolean {
  if (attendanceType !== "CHECK_OUT") return false;
  if (!orgCheckOutTime) return false;

  try {
    const [h, m] = orgCheckOutTime.split(":").map(Number);
    const checkOutTime = now.set({ hour: h, minute: m, second: 0 });
    const startWindow = checkOutTime.minus({ minutes: 30 });
    return now >= startWindow;
  } catch {
    return false;
  }
}

function getAttendanceState(record: { checkInTime?: string; checkOutTime?: string } | null) {
  if (!record) return { type: "CHECK_IN" };
  if (record.checkInTime && !record.checkOutTime) return { type: "CHECK_OUT" };
  if (record.checkInTime && record.checkOutTime) return { type: "COMPLETED" };
  return { type: "CHECK_IN" };
}

describe("Check-in time window", () => {
  // Org check-in time: 09:00
  const checkInTime = "09:00";

  it("enables check-in 1 hour before (within 2hr window)", () => {
    const now = DateTime.fromObject({ hour: 8, minute: 0 }, { zone: TIMEZONE });
    expect(isCheckInEnabled("CHECK_IN", checkInTime, now)).toBe(true);
  });

  it("enables check-in exactly 2 hours before", () => {
    const now = DateTime.fromObject({ hour: 7, minute: 0 }, { zone: TIMEZONE });
    expect(isCheckInEnabled("CHECK_IN", checkInTime, now)).toBe(true);
  });

  it("enables check-in at exact check-in time", () => {
    const now = DateTime.fromObject({ hour: 9, minute: 0 }, { zone: TIMEZONE });
    expect(isCheckInEnabled("CHECK_IN", checkInTime, now)).toBe(true);
  });

  it("enables check-in within 30min grace period", () => {
    const now = DateTime.fromObject({ hour: 9, minute: 20 }, { zone: TIMEZONE });
    expect(isCheckInEnabled("CHECK_IN", checkInTime, now)).toBe(true);
  });

  it("disables check-in after grace period", () => {
    const now = DateTime.fromObject({ hour: 9, minute: 31 }, { zone: TIMEZONE });
    expect(isCheckInEnabled("CHECK_IN", checkInTime, now)).toBe(false);
  });

  it("disables check-in too early (before 2hr window)", () => {
    const now = DateTime.fromObject({ hour: 6, minute: 59 }, { zone: TIMEZONE });
    expect(isCheckInEnabled("CHECK_IN", checkInTime, now)).toBe(false);
  });

  it("disables when attendance type is not CHECK_IN", () => {
    const now = DateTime.fromObject({ hour: 8, minute: 30 }, { zone: TIMEZONE });
    expect(isCheckInEnabled("CHECK_OUT", checkInTime, now)).toBe(false);
  });
});

describe("Half-day checkout window", () => {
  // Org half-day checkout: 13:00
  const halfDayTime = "13:00";

  it("enables 30 min before half-day time", () => {
    const now = DateTime.fromObject({ hour: 12, minute: 30 }, { zone: TIMEZONE });
    expect(canHalfDayCheckOut("CHECK_OUT", halfDayTime, now)).toBe(true);
  });

  it("enables within 15 min grace after half-day time", () => {
    const now = DateTime.fromObject({ hour: 13, minute: 10 }, { zone: TIMEZONE });
    expect(canHalfDayCheckOut("CHECK_OUT", halfDayTime, now)).toBe(true);
  });

  it("disables after 15 min grace", () => {
    const now = DateTime.fromObject({ hour: 13, minute: 16 }, { zone: TIMEZONE });
    expect(canHalfDayCheckOut("CHECK_OUT", halfDayTime, now)).toBe(false);
  });

  it("disables too early", () => {
    const now = DateTime.fromObject({ hour: 12, minute: 29 }, { zone: TIMEZONE });
    expect(canHalfDayCheckOut("CHECK_OUT", halfDayTime, now)).toBe(false);
  });

  it("disables when not CHECK_OUT state", () => {
    const now = DateTime.fromObject({ hour: 12, minute: 45 }, { zone: TIMEZONE });
    expect(canHalfDayCheckOut("CHECK_IN", halfDayTime, now)).toBe(false);
  });
});

describe("Full-day checkout window", () => {
  // Org checkout: 18:00
  const checkOutTime = "18:00";

  it("enables 30 min before checkout", () => {
    const now = DateTime.fromObject({ hour: 17, minute: 30 }, { zone: TIMEZONE });
    expect(canFullDayCheckOut("CHECK_OUT", checkOutTime, now)).toBe(true);
  });

  it("enables well after checkout time (no upper limit)", () => {
    const now = DateTime.fromObject({ hour: 20, minute: 0 }, { zone: TIMEZONE });
    expect(canFullDayCheckOut("CHECK_OUT", checkOutTime, now)).toBe(true);
  });

  it("disables before the 30 min window", () => {
    const now = DateTime.fromObject({ hour: 17, minute: 29 }, { zone: TIMEZONE });
    expect(canFullDayCheckOut("CHECK_OUT", checkOutTime, now)).toBe(false);
  });

  it("disables when not CHECK_OUT state", () => {
    const now = DateTime.fromObject({ hour: 18, minute: 0 }, { zone: TIMEZONE });
    expect(canFullDayCheckOut("COMPLETED", checkOutTime, now)).toBe(false);
  });
});

describe("Attendance state determination", () => {
  it("returns CHECK_IN when no record exists", () => {
    expect(getAttendanceState(null)).toEqual({ type: "CHECK_IN" });
  });

  it("returns CHECK_OUT when checked in but not out", () => {
    expect(
      getAttendanceState({ checkInTime: "09:00", checkOutTime: undefined })
    ).toEqual({ type: "CHECK_OUT" });
  });

  it("returns COMPLETED when both check-in and check-out exist", () => {
    expect(
      getAttendanceState({ checkInTime: "09:00", checkOutTime: "18:00" })
    ).toEqual({ type: "COMPLETED" });
  });

  it("returns CHECK_IN when record has no checkInTime", () => {
    expect(getAttendanceState({})).toEqual({ type: "CHECK_IN" });
  });
});
