import { describe, it, expect } from "vitest";
import { MONTH_NAMES } from "../../utils/attendanceConstants";
import { getDaysInMonth, applyDefaultAttendance } from "../../utils/attendanceHelpers";

// Extract the pure logic from useAttendanceFilters for testing
// without requiring React Query or hook rendering.

interface CalendarDay {
  day: number;
  weekday: string;
  isWeeklyOff: boolean;
}

interface MockEmployee {
  name: string;
  attendance?: Record<string, string>;
}

function buildCalendarDays(
  selectedMonth: string,
  currentYear: number,
  weeklyOffDay: string
): CalendarDay[] {
  const monthIndex = MONTH_NAMES.indexOf(selectedMonth);
  const daysInMonth = getDaysInMonth(selectedMonth, currentYear);
  const dayOfWeekNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const shortWeeklyOff = weeklyOffDay.slice(0, 3);

  return Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(currentYear, monthIndex, i + 1);
    const weekday = dayOfWeekNamesShort[date.getDay()];
    return {
      day: i + 1,
      weekday,
      isWeeklyOff: weekday === shortWeeklyOff,
    };
  });
}

function filterEmployees(
  employees: MockEmployee[],
  selectedMonth: string,
  currentYear: number,
  calendarDays: CalendarDay[],
  searchTerm: string
) {
  const monthYearKey = `${selectedMonth}-${currentYear}`;
  return employees
    .map((emp) => {
      const rawAttendance = emp.attendance?.[monthYearKey];
      const finalAttendanceString = applyDefaultAttendance(calendarDays, rawAttendance);
      return { ...emp, attendanceString: finalAttendanceString };
    })
    .filter((emp) => emp.name.toLowerCase().includes(searchTerm.toLowerCase()));
}

function paginate<T>(items: T[], page: number, perPage: number) {
  const startIndex = (page - 1) * perPage;
  return items.slice(startIndex, startIndex + perPage);
}

function paginationInfo(total: number, page: number, perPage: number) {
  const pages = Math.ceil(total / perPage) || 1;
  const start = total > 0 ? (page - 1) * perPage + 1 : 0;
  const end = Math.min(start + perPage - 1, total);
  return { totalPages: pages, showingStart: start, showingEnd: end, totalEntries: total };
}

describe("Attendance filters – calendar day generation", () => {
  it("generates correct number of days for January 2026", () => {
    const days = buildCalendarDays("January", 2026, "Sunday");
    expect(days).toHaveLength(31);
  });

  it("marks Sundays as weekly off when weeklyOffDay is 'Sunday'", () => {
    const days = buildCalendarDays("January", 2026, "Sunday");
    const sundays = days.filter((d) => d.isWeeklyOff);
    expect(sundays.length).toBeGreaterThan(0);
    sundays.forEach((d) => expect(d.weekday).toBe("Sun"));
  });

  it("marks Saturdays as weekly off when weeklyOffDay is 'Saturday'", () => {
    const days = buildCalendarDays("January", 2026, "Saturday");
    const saturdays = days.filter((d) => d.isWeeklyOff);
    expect(saturdays.length).toBeGreaterThan(0);
    saturdays.forEach((d) => expect(d.weekday).toBe("Sat"));
  });

  it("handles February in a leap year", () => {
    const days = buildCalendarDays("February", 2024, "Sunday");
    expect(days).toHaveLength(29);
  });
});

describe("Attendance filters – employee filtering", () => {
  const calendarDays = buildCalendarDays("January", 2026, "Sunday");
  const employees: MockEmployee[] = [
    { name: "Alice", attendance: { "January-2026": "PPPPPW" } },
    { name: "Bob", attendance: {} },
    { name: "Charlie", attendance: { "January-2026": "AAAAAAW" } },
  ];

  it("returns all employees when search is empty", () => {
    const result = filterEmployees(employees, "January", 2026, calendarDays, "");
    expect(result).toHaveLength(3);
  });

  it("filters by name (case-insensitive)", () => {
    const result = filterEmployees(employees, "January", 2026, calendarDays, "alice");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Alice");
  });

  it("applies default attendance for employees with no data", () => {
    const result = filterEmployees(employees, "January", 2026, calendarDays, "Bob");
    expect(result).toHaveLength(1);
    // Bob has no attendance, so all days should be defaults (W for weekly off, - for rest)
    expect(result[0].attendanceString.length).toBe(31);
  });

  it("returns empty array when no match", () => {
    const result = filterEmployees(employees, "January", 2026, calendarDays, "Zara");
    expect(result).toHaveLength(0);
  });
});

describe("Attendance filters – pagination", () => {
  const items = Array.from({ length: 25 }, (_, i) => ({ id: i }));

  it("returns first page of 10", () => {
    expect(paginate(items, 1, 10)).toHaveLength(10);
  });

  it("returns partial last page", () => {
    expect(paginate(items, 3, 10)).toHaveLength(5);
  });

  it("computes pagination info correctly", () => {
    const info = paginationInfo(25, 1, 10);
    expect(info.totalPages).toBe(3);
    expect(info.showingStart).toBe(1);
    expect(info.showingEnd).toBe(10);
    expect(info.totalEntries).toBe(25);
  });

  it("computes pagination info for empty data", () => {
    const info = paginationInfo(0, 1, 10);
    expect(info.totalPages).toBe(1);
    expect(info.showingStart).toBe(0);
    expect(info.totalEntries).toBe(0);
  });

  it("computes pagination info for last page", () => {
    const info = paginationInfo(25, 3, 10);
    expect(info.showingStart).toBe(21);
    expect(info.showingEnd).toBe(25);
  });
});
