import { describe, it, expect } from "vitest";
import { transformExcelToPartyPayload, validatePartyRow } from "@/components/modals/superadmin/BulkUploadParties/utils/partyExcelUtils";

describe("transformExcelToPartyPayload", () => {
  it("transforms valid rows to party payload", () => {
    const rows = [
      {
        "S.No": 1,
        "Party Name": "Acme Corp",
        "Owner Name": "John Doe",
        "PAN/VAT Number": "123456789",
        "Phone Number": "9876543210",
        "Email": "john@acme.com",
        "Address": "123 Street, City",
        "Party Type": "Wholesaler",
        "Description": "Main supplier",
      },
    ];

    const result = transformExcelToPartyPayload(rows);
    expect(result).toHaveLength(1);
    expect(result[0].companyName).toBe("Acme Corp");
    expect(result[0].ownerName).toBe("John Doe");
    expect(result[0].panVat).toBe("123456789");
    expect(result[0].phone).toBe("9876543210");
    expect(result[0].email).toBe("john@acme.com");
    expect(result[0].address).toBe("123 Street, City");
    expect(result[0].partyType).toBe("Wholesaler");
    expect(result[0].description).toBe("Main supplier");
  });

  it("uses default coordinates (Kathmandu)", () => {
    const rows = [
      {
        "Party Name": "Test",
        "Owner Name": "Owner",
        "PAN/VAT Number": "1234567890",
        "Phone Number": "9876543210",
      },
    ];

    const result = transformExcelToPartyPayload(rows);
    expect(result[0].latitude).toBeCloseTo(27.7172);
    expect(result[0].longitude).toBeCloseTo(85.324);
  });

  it("uses default address when not provided", () => {
    const rows = [
      {
        "Party Name": "Test",
        "Owner Name": "Owner",
        "PAN/VAT Number": "1234567890",
        "Phone Number": "9876543210",
      },
    ];

    const result = transformExcelToPartyPayload(rows);
    expect(result[0].address).toBe("Kathmandu, Nepal");
  });

  it("skips invalid rows (missing required fields)", () => {
    const rows = [
      { "Party Name": "", "Owner Name": "", "PAN/VAT Number": "", "Phone Number": "" },
    ];

    const result = transformExcelToPartyPayload(rows);
    expect(result).toHaveLength(0);
  });

  it("handles numeric PAN/VAT and phone values", () => {
    const rows = [
      {
        "Party Name": "Test",
        "Owner Name": "Owner",
        "PAN/VAT Number": 123456789,
        "Phone Number": 9876543210,
      },
    ];

    const result = transformExcelToPartyPayload(rows);
    expect(result).toHaveLength(1);
    expect(result[0].panVat).toBe("123456789");
    expect(result[0].phone).toBe("9876543210");
  });
});

describe("validatePartyRow", () => {
  it("returns success for valid row", () => {
    const row = {
      "Party Name": "Acme Corp",
      "Owner Name": "John",
      "PAN/VAT Number": "1234567890",
      "Phone Number": "9876543210",
    };
    const result = validatePartyRow(row);
    expect(result.success).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it("returns errors for missing party name", () => {
    const row = {
      "Party Name": "",
      "Owner Name": "John",
      "PAN/VAT Number": "1234567890",
      "Phone Number": "9876543210",
    };
    const result = validatePartyRow(row);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors!.length).toBeGreaterThan(0);
  });

  it("returns errors for missing owner name", () => {
    const row = {
      "Party Name": "Acme",
      "Owner Name": "",
      "PAN/VAT Number": "1234567890",
      "Phone Number": "9876543210",
    };
    const result = validatePartyRow(row);
    expect(result.success).toBe(false);
  });

  it("returns errors for short phone number", () => {
    const row = {
      "Party Name": "Acme",
      "Owner Name": "John",
      "PAN/VAT Number": "1234567890",
      "Phone Number": "123",
    };
    const result = validatePartyRow(row);
    expect(result.success).toBe(false);
    expect(result.errors!.some((e) => e.toLowerCase().includes("phone"))).toBe(true);
  });

  it("accepts optional email", () => {
    const row = {
      "Party Name": "Acme",
      "Owner Name": "John",
      "PAN/VAT Number": "1234567890",
      "Phone Number": "9876543210",
      "Email": "",
    };
    const result = validatePartyRow(row);
    expect(result.success).toBe(true);
  });

  it("rejects invalid email format", () => {
    const row = {
      "Party Name": "Acme",
      "Owner Name": "John",
      "PAN/VAT Number": "1234567890",
      "Phone Number": "9876543210",
      "Email": "not-an-email",
    };
    const result = validatePartyRow(row);
    expect(result.success).toBe(false);
  });
});
