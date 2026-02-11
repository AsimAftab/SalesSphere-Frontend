import { describe, it, expect } from "vitest";

// Extracted category resolution and diff detection from useProductEntity

interface MockCategory {
  _id: string;
  name: string;
}

function resolveCategoryName(
  categoryId: string,
  newCategoryName: string | undefined,
  categories: MockCategory[]
): string {
  if (categoryId === "OTHER") {
    return newCategoryName?.trim() || "";
  }
  const selected = categories.find((c) => c._id === categoryId);
  return selected ? selected.name : "";
}

interface ProductData {
  productName: string;
  price: number;
  qty: number;
  serialNo?: string;
  categoryId: string;
  newCategoryName?: string;
}

interface ExistingProduct {
  productName: string;
  price: number;
  qty: number;
  serialNo?: string;
  category: { _id: string };
}

function detectChanges(
  data: ProductData,
  existing: ExistingProduct,
  hasImageFile: boolean
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (data.productName !== existing.productName) payload.productName = data.productName;
  if (data.price !== existing.price) payload.price = data.price;
  if (data.qty !== existing.qty) payload.qty = data.qty;
  if ((data.serialNo || "") !== (existing.serialNo || "")) payload.serialNo = data.serialNo;
  if (data.categoryId === "OTHER") {
    payload.category = data.newCategoryName?.trim();
  } else if (data.categoryId !== existing.category._id) {
    payload.category = data.categoryId;
  }
  if (hasImageFile) payload.image = true;
  return payload;
}

const categories: MockCategory[] = [
  { _id: "cat1", name: "Electronics" },
  { _id: "cat2", name: "Clothing" },
];

describe("Product entity – category resolution", () => {
  it("returns category name for valid ID", () => {
    expect(resolveCategoryName("cat1", undefined, categories)).toBe("Electronics");
  });

  it("returns new category name for OTHER", () => {
    expect(resolveCategoryName("OTHER", "New Cat", categories)).toBe("New Cat");
  });

  it("trims new category name", () => {
    expect(resolveCategoryName("OTHER", "  Trimmed  ", categories)).toBe("Trimmed");
  });

  it("returns empty for unknown category", () => {
    expect(resolveCategoryName("unknown", undefined, categories)).toBe("");
  });

  it("returns empty for OTHER with no name", () => {
    expect(resolveCategoryName("OTHER", undefined, categories)).toBe("");
  });
});

describe("Product entity – change detection", () => {
  const existing: ExistingProduct = {
    productName: "Widget",
    price: 100,
    qty: 10,
    serialNo: "SN001",
    category: { _id: "cat1" },
  };

  it("returns empty when no changes", () => {
    const data: ProductData = { productName: "Widget", price: 100, qty: 10, serialNo: "SN001", categoryId: "cat1" };
    expect(Object.keys(detectChanges(data, existing, false))).toHaveLength(0);
  });

  it("detects name change", () => {
    const data: ProductData = { productName: "Gadget", price: 100, qty: 10, serialNo: "SN001", categoryId: "cat1" };
    expect(detectChanges(data, existing, false)).toHaveProperty("productName", "Gadget");
  });

  it("detects price change", () => {
    const data: ProductData = { productName: "Widget", price: 200, qty: 10, serialNo: "SN001", categoryId: "cat1" };
    expect(detectChanges(data, existing, false)).toHaveProperty("price", 200);
  });

  it("detects category change", () => {
    const data: ProductData = { productName: "Widget", price: 100, qty: 10, serialNo: "SN001", categoryId: "cat2" };
    expect(detectChanges(data, existing, false)).toHaveProperty("category", "cat2");
  });

  it("detects OTHER category", () => {
    const data: ProductData = { productName: "Widget", price: 100, qty: 10, serialNo: "SN001", categoryId: "OTHER", newCategoryName: "Custom" };
    expect(detectChanges(data, existing, false)).toHaveProperty("category", "Custom");
  });

  it("detects image change", () => {
    const data: ProductData = { productName: "Widget", price: 100, qty: 10, serialNo: "SN001", categoryId: "cat1" };
    expect(detectChanges(data, existing, true)).toHaveProperty("image", true);
  });

  it("handles serialNo null to empty normalization", () => {
    const noSerial: ExistingProduct = { ...existing, serialNo: undefined };
    const data: ProductData = { productName: "Widget", price: 100, qty: 10, serialNo: "", categoryId: "cat1" };
    expect(detectChanges(data, noSerial, false)).not.toHaveProperty("serialNo");
  });
});
