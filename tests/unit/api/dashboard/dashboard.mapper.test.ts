import { describe, it, expect } from "vitest";
import { DashboardMapper } from "@/api/dashboard/dashboard.mapper";

describe("DashboardMapper.formatCurrency", () => {
  it("formats a number to INR currency", () => {
    const result = DashboardMapper.formatCurrency(1234);
    expect(result).toContain("1,234");
    expect(result).toContain("₹");
  });

  it("formats a string number", () => {
    const result = DashboardMapper.formatCurrency("5000.50");
    expect(result).toContain("5,000.5");
  });

  it("returns ₹0.00 for NaN", () => {
    expect(DashboardMapper.formatCurrency("not-a-number")).toBe("₹0.00");
  });

  it("formats zero", () => {
    const result = DashboardMapper.formatCurrency(0);
    expect(result).toContain("₹");
    expect(result).toContain("0");
  });
});

describe("DashboardMapper.formatChartDate", () => {
  it("formats a date string to 'Mon day'", () => {
    const result = DashboardMapper.formatChartDate("2026-03-15");
    expect(result).toMatch(/Mar.*15/);
  });

  it("returns empty string for empty input", () => {
    expect(DashboardMapper.formatChartDate("")).toBe("");
  });
});

describe("DashboardMapper.formatRate", () => {
  it("appends % sign", () => {
    expect(DashboardMapper.formatRate(85)).toBe("85%");
  });

  it("handles zero", () => {
    expect(DashboardMapper.formatRate(0)).toBe("0%");
  });
});

describe("DashboardMapper.getInitials", () => {
  it("returns first character uppercased", () => {
    expect(DashboardMapper.getInitials("alice")).toBe("A");
  });

  it("returns empty string for empty name", () => {
    expect(DashboardMapper.getInitials("")).toBe("");
  });
});

describe("DashboardMapper.getDisplayRole", () => {
  it("maps 'user' to 'SalesPerson'", () => {
    expect(DashboardMapper.getDisplayRole("user")).toBe("SalesPerson");
  });

  it("returns customRole when provided", () => {
    expect(DashboardMapper.getDisplayRole("user", "Regional Manager")).toBe(
      "Regional Manager"
    );
  });

  it("returns 'Staff' when role is empty and no customRole", () => {
    expect(DashboardMapper.getDisplayRole("")).toBe("Staff");
  });

  it("returns the role as-is for unknown roles", () => {
    expect(DashboardMapper.getDisplayRole("admin")).toBe("admin");
  });
});

describe("DashboardMapper.formatPaymentMode", () => {
  it("maps known modes", () => {
    expect(DashboardMapper.formatPaymentMode("bank_transfer")).toBe(
      "Bank Transfer"
    );
    expect(DashboardMapper.formatPaymentMode("cheque")).toBe("Cheque");
    expect(DashboardMapper.formatPaymentMode("qr")).toBe("QR Code");
    expect(DashboardMapper.formatPaymentMode("cash")).toBe("Cash");
  });

  it("title-cases unknown modes with underscores", () => {
    expect(DashboardMapper.formatPaymentMode("mobile_wallet")).toBe(
      "Mobile Wallet"
    );
  });
});

describe("DashboardMapper initial states", () => {
  it("has zero-value INITIAL_STATS", () => {
    expect(DashboardMapper.INITIAL_STATS.totalParties).toBe(0);
    expect(DashboardMapper.INITIAL_STATS.totalSalesToday).toBe("0");
  });

  it("has zero-value INITIAL_ATTENDANCE", () => {
    expect(DashboardMapper.INITIAL_ATTENDANCE.teamStrength).toBe(0);
    expect(DashboardMapper.INITIAL_ATTENDANCE.attendanceRate).toBe(0);
  });
});
