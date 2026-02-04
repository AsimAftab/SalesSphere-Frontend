import { describe, it, expect } from "vitest";
import { getCellValue, transformExcelToBulkPayload, TEMPLATE_COLUMNS } from "@/components/modals/Product/common/ExcelUtils";

describe("getCellValue", () => {
  it("returns empty string for null/undefined/falsy", () => {
    expect(getCellValue(null)).toBe("");
    expect(getCellValue(undefined)).toBe("");
    expect(getCellValue("")).toBe("");
    expect(getCellValue(0)).toBe(""); // 0 is falsy, returns empty
  });

  it("extracts text from object with text property", () => {
    expect(getCellValue({ text: " Hello " })).toBe("Hello");
  });

  it("extracts result from formula object", () => {
    expect(getCellValue({ result: 42 })).toBe("42");
  });

  it("prefers text over result", () => {
    expect(getCellValue({ text: "Label", result: 99 })).toBe("Label");
  });

  it("converts primitive number to string", () => {
    expect(getCellValue(123)).toBe("123");
  });

  it("converts primitive string and trims", () => {
    expect(getCellValue("  test  ")).toBe("test");
  });

  it("converts boolean to string", () => {
    expect(getCellValue(true)).toBe("true");
  });
});

describe("transformExcelToBulkPayload", () => {
  it("transforms rows with standard headers", () => {
    const rows = [
      { "product name": "Widget", category: "Electronics", price: "29.99", "stock (qty)": "100" },
    ];
    const result = transformExcelToBulkPayload(rows);
    expect(result).toHaveLength(1);
    expect(result[0].productName).toBe("Widget");
    expect(result[0].category).toBe("Electronics");
    expect(result[0].price).toBe(29.99);
    expect(result[0].qty).toBe(100);
  });

  it("defaults price to 0 for non-numeric values", () => {
    const rows = [{ "product name": "X", category: "C", price: "abc" }];
    const result = transformExcelToBulkPayload(rows);
    expect(result[0].price).toBe(0);
  });

  it("defaults qty to 0 for non-numeric values", () => {
    const rows = [{ "product name": "X", category: "C", "stock (qty)": "N/A" }];
    const result = transformExcelToBulkPayload(rows);
    expect(result[0].qty).toBe(0);
  });

  it("handles alternate header 'stock'", () => {
    const rows = [{ "product name": "X", category: "C", stock: "50" }];
    const result = transformExcelToBulkPayload(rows);
    expect(result[0].qty).toBe(50);
  });

  it("picks up serialNo from various header names", () => {
    const rows = [{ "product name": "X", category: "C", "serial no": "SN001" }];
    const result = transformExcelToBulkPayload(rows);
    expect(result[0].serialNo).toBe("SN001");
  });

  it("sets serialNo to undefined when empty", () => {
    const rows = [{ "product name": "X", category: "C" }];
    const result = transformExcelToBulkPayload(rows);
    expect(result[0].serialNo).toBeUndefined();
  });

  it("returns empty productName for missing header", () => {
    const rows = [{ category: "C" }];
    const result = transformExcelToBulkPayload(rows);
    expect(result[0].productName).toBe("");
  });
});

describe("TEMPLATE_COLUMNS", () => {
  it("has 6 columns", () => {
    expect(TEMPLATE_COLUMNS).toHaveLength(6);
  });

  it("includes required columns", () => {
    const keys = TEMPLATE_COLUMNS.map((c) => c.key);
    expect(keys).toContain("productName");
    expect(keys).toContain("category");
    expect(keys).toContain("price");
    expect(keys).toContain("qty");
  });
});
