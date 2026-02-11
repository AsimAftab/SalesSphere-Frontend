import { describe, it, expect } from "vitest";

// Extracted dynamic brand filtering logic from useProspects

interface MockCategory {
  name: string;
  brands: string[];
}

function getAvailableBrands(
  allCategories: MockCategory[],
  selectedCategories: string[]
): string[] {
  if (selectedCategories.length === 0) {
    const brands = allCategories.flatMap((c) => c.brands || []);
    return Array.from(new Set(brands)).sort();
  }

  const filteredBrands = allCategories
    .filter((c) => selectedCategories.includes(c.name))
    .flatMap((c) => c.brands || []);

  return Array.from(new Set(filteredBrands)).sort();
}

const categories: MockCategory[] = [
  { name: "Electronics", brands: ["Sony", "Samsung", "LG"] },
  { name: "Clothing", brands: ["Nike", "Adidas"] },
  { name: "Food", brands: ["Nestle", "Samsung"] }, // Samsung intentionally duplicated
];

describe("Prospect – available brands", () => {
  it("returns all unique brands when no category selected", () => {
    const brands = getAvailableBrands(categories, []);
    expect(brands).toEqual(["Adidas", "LG", "Nestle", "Nike", "Samsung", "Sony"]);
  });

  it("returns brands for selected category", () => {
    const brands = getAvailableBrands(categories, ["Electronics"]);
    expect(brands).toEqual(["LG", "Samsung", "Sony"]);
  });

  it("returns combined brands for multiple categories", () => {
    const brands = getAvailableBrands(categories, ["Electronics", "Clothing"]);
    expect(brands).toEqual(["Adidas", "LG", "Nike", "Samsung", "Sony"]);
  });

  it("deduplicates brands across categories", () => {
    const brands = getAvailableBrands(categories, ["Electronics", "Food"]);
    expect(brands.filter((b) => b === "Samsung")).toHaveLength(1);
  });

  it("returns empty for non-existent category", () => {
    expect(getAvailableBrands(categories, ["Unknown"])).toEqual([]);
  });

  it("handles categories with no brands", () => {
    const cats = [{ name: "Empty", brands: [] }];
    expect(getAvailableBrands(cats, [])).toEqual([]);
  });
});
