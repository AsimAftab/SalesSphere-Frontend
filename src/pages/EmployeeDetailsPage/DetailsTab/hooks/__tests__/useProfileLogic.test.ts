import { describe, it, expect } from "vitest";

// Extracted role resolution and attendance formatting from useProfileLogic

interface MockRole {
  _id: string;
  name: string;
}

function resolveRoleName(
  employee: { customRoleId?: { name: string } | string | null; role?: string } | null,
  roles: MockRole[]
): string {
  if (!employee) return "";
  if (typeof employee.customRoleId === "object" && employee.customRoleId?.name) {
    return employee.customRoleId.name;
  }
  if (typeof employee.customRoleId === "string") {
    const found = roles.find((r) => r._id === employee.customRoleId);
    if (found) return found.name;
  }
  return employee.role || "User";
}

interface AttendanceSummary {
  month: number | string;
  year: number;
  attendancePercentage: string | number;
  attendance: {
    present: number;
    weeklyOff: number;
    halfDay: number;
    leave: number;
    absent: number;
    workingDays: number;
  };
}

function formatAttendance(summary: AttendanceSummary | null | undefined) {
  if (!summary?.attendance) return null;
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  let monthIndex = 0;
  if (typeof summary.month === "number") {
    monthIndex = summary.month - 1;
  } else if (typeof summary.month === "string") {
    monthIndex = parseInt(summary.month, 10) - 1;
  }

  const monthName = monthNames[monthIndex] || "Month";
  const percentageValue = parseFloat(String(summary.attendancePercentage));

  const stats = summary.attendance;
  return {
    percentage: isNaN(percentageValue) ? 0 : percentageValue,
    stats: [
      { value: stats.present, label: "Present", color: "bg-green-500" },
      { value: stats.weeklyOff, label: "Weekly Off", color: "bg-blue-500" },
      { value: stats.halfDay, label: "Half Day", color: "bg-purple-500" },
      { value: stats.leave, label: "Leave", color: "bg-yellow-500" },
      { value: stats.absent, label: "Absent", color: "bg-red-500" },
    ].filter((s) => s.value > 0),
    monthYear: `${monthName} ${summary.year}`,
    totalWorkingDays: stats.workingDays,
  };
}

const roles: MockRole[] = [
  { _id: "role1", name: "Sales Rep" },
  { _id: "role2", name: "Manager" },
];

describe("Profile logic – role resolution", () => {
  it("returns empty for null employee", () => {
    expect(resolveRoleName(null, roles)).toBe("");
  });

  it("uses object customRoleId name", () => {
    expect(resolveRoleName({ customRoleId: { name: "Admin" } }, roles)).toBe("Admin");
  });

  it("looks up string customRoleId from roles list", () => {
    expect(resolveRoleName({ customRoleId: "role1" }, roles)).toBe("Sales Rep");
  });

  it("falls back to employee.role when string ID not found", () => {
    expect(resolveRoleName({ customRoleId: "unknown", role: "editor" }, roles)).toBe("editor");
  });

  it("defaults to 'User' when no role info", () => {
    expect(resolveRoleName({ customRoleId: null }, roles)).toBe("User");
  });

  it("defaults to 'User' when customRoleId is undefined", () => {
    expect(resolveRoleName({}, roles)).toBe("User");
  });
});

describe("Profile logic – attendance formatting", () => {
  const summary: AttendanceSummary = {
    month: 3,
    year: 2025,
    attendancePercentage: "85.5",
    attendance: { present: 20, weeklyOff: 4, halfDay: 1, leave: 2, absent: 1, workingDays: 24 },
  };

  it("returns null for null summary", () => {
    expect(formatAttendance(null)).toBeNull();
  });

  it("returns null for undefined summary", () => {
    expect(formatAttendance(undefined)).toBeNull();
  });

  it("parses percentage from string", () => {
    expect(formatAttendance(summary)?.percentage).toBe(85.5);
  });

  it("handles numeric percentage", () => {
    const result = formatAttendance({ ...summary, attendancePercentage: 90 });
    expect(result?.percentage).toBe(90);
  });

  it("defaults to 0 for NaN percentage", () => {
    const result = formatAttendance({ ...summary, attendancePercentage: "invalid" });
    expect(result?.percentage).toBe(0);
  });

  it("formats monthYear correctly", () => {
    expect(formatAttendance(summary)?.monthYear).toBe("March 2025");
  });

  it("parses month from string", () => {
    const result = formatAttendance({ ...summary, month: "7" });
    expect(result?.monthYear).toBe("July 2025");
  });

  it("falls back to 'Month' for invalid month", () => {
    const result = formatAttendance({ ...summary, month: 0 });
    expect(result?.monthYear).toBe("Month 2025");
  });

  it("filters out zero-value stats", () => {
    const withZeros: AttendanceSummary = {
      ...summary,
      attendance: { present: 20, weeklyOff: 0, halfDay: 0, leave: 0, absent: 0, workingDays: 20 },
    };
    const result = formatAttendance(withZeros);
    expect(result?.stats).toHaveLength(1);
    expect(result?.stats[0].label).toBe("Present");
  });

  it("includes totalWorkingDays", () => {
    expect(formatAttendance(summary)?.totalWorkingDays).toBe(24);
  });
});
