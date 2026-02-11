import { describe, it, expect } from "vitest";

// Extracted preview slicing and result processing from useBulkUpload

interface ExcelRowData {
  [key: string]: string | number;
}

interface UploadResult {
  data?: { successfullyImported: number } | unknown[];
  length?: number;
}

function slicePreview(data: ExcelRowData[], maxRows: number): ExcelRowData[] {
  return data.slice(0, maxRows);
}

function extractImportCount(result: UploadResult): number {
  const data = result?.data;
  const count =
    (data && !Array.isArray(data) ? data.successfullyImported : undefined) ||
    result?.length ||
    0;
  return count;
}

describe("Bulk upload – preview slicing", () => {
  const rows: ExcelRowData[] = [
    { name: "A", price: 10 },
    { name: "B", price: 20 },
    { name: "C", price: 30 },
    { name: "D", price: 40 },
    { name: "E", price: 50 },
    { name: "F", price: 60 },
  ];

  it("takes first 5 rows", () => {
    expect(slicePreview(rows, 5)).toHaveLength(5);
  });

  it("returns all if fewer than max", () => {
    expect(slicePreview(rows.slice(0, 2), 5)).toHaveLength(2);
  });

  it("returns empty for empty data", () => {
    expect(slicePreview([], 5)).toHaveLength(0);
  });
});

describe("Bulk upload – extract import count", () => {
  it("extracts from data.successfullyImported", () => {
    expect(extractImportCount({ data: { successfullyImported: 42 } })).toBe(42);
  });

  it("falls back to result.length", () => {
    expect(extractImportCount({ length: 10 })).toBe(10);
  });

  it("returns 0 when no count available", () => {
    expect(extractImportCount({})).toBe(0);
  });

  it("does not use array data successfullyImported", () => {
    expect(extractImportCount({ data: [1, 2, 3], length: 3 })).toBe(3);
  });
});
