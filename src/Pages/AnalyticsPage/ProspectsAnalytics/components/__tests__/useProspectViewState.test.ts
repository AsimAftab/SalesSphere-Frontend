import { describe, it, expect } from "vitest";

// Extracted merge logic, stat cards, and pagination from useProspectViewState

interface BrandCount {
  brand: string;
  prospectCount: number;
}

interface Category {
  name: string;
  brands: string[];
}

interface CategoryData {
  categoryName: string;
  brands: { name: string; count: number }[];
}

function mergeCategoryData(categories: Category[], brandCounts: BrandCount[]): CategoryData[] {
  const brandCountMap = new Map<string, number>();
  brandCounts.forEach((item) => {
    brandCountMap.set(item.brand.toLowerCase(), item.prospectCount);
  });

  const merged = categories.map((cat) => {
    const brandsWithCounts = (cat.brands || []).map((brandName) => ({
      name: brandName,
      count: brandCountMap.get(brandName.toLowerCase()) || 0,
    }));
    brandsWithCounts.sort((a, b) => b.count - a.count);
    const totalCount = brandsWithCounts.reduce((sum, b) => sum + b.count, 0);
    return { categoryName: cat.name, brands: brandsWithCounts, totalCount };
  });

  merged.sort((a, b) => b.totalCount - a.totalCount);
  return merged.map(({ categoryName, brands }) => ({ categoryName, brands }));
}

function buildStatCards(stats: { totalProspects: number; totalProspectsToday: number; totalCategories: number; totalBrands: number } | null) {
  if (!stats) return [];
  return [
    { title: "Total No. of Prospects", value: stats.totalProspects },
    { title: "Today's Total Prospects", value: stats.totalProspectsToday },
    { title: "Total No. of Categories", value: stats.totalCategories },
    { title: "Total No. of Brands", value: stats.totalBrands },
  ];
}

const categories: Category[] = [
  { name: "Electronics", brands: ["Sony", "Samsung", "LG"] },
  { name: "Clothing", brands: ["Nike", "Adidas"] },
];

const brandCounts: BrandCount[] = [
  { brand: "Sony", prospectCount: 10 },
  { brand: "Samsung", prospectCount: 5 },
  { brand: "Nike", prospectCount: 20 },
  { brand: "Adidas", prospectCount: 3 },
];

describe("Prospect view state – merge category data", () => {
  it("merges brand counts into categories", () => {
    const result = mergeCategoryData(categories, brandCounts);
    const electronics = result.find((c) => c.categoryName === "Electronics");
    expect(electronics?.brands[0].name).toBe("Sony");
    expect(electronics?.brands[0].count).toBe(10);
  });

  it("sorts brands by count descending within category", () => {
    const result = mergeCategoryData(categories, brandCounts);
    const electronics = result.find((c) => c.categoryName === "Electronics")!;
    expect(electronics.brands[0].count).toBeGreaterThanOrEqual(electronics.brands[1].count);
  });

  it("sorts categories by total count descending", () => {
    const result = mergeCategoryData(categories, brandCounts);
    // Clothing: Nike(20) + Adidas(3) = 23, Electronics: Sony(10) + Samsung(5) + LG(0) = 15
    expect(result[0].categoryName).toBe("Clothing");
    expect(result[1].categoryName).toBe("Electronics");
  });

  it("defaults to 0 count for missing brands", () => {
    const result = mergeCategoryData(categories, brandCounts);
    const electronics = result.find((c) => c.categoryName === "Electronics")!;
    const lg = electronics.brands.find((b) => b.name === "LG");
    expect(lg?.count).toBe(0);
  });

  it("is case-insensitive for brand matching", () => {
    const result = mergeCategoryData(
      [{ name: "Test", brands: ["SONY"] }],
      [{ brand: "sony", prospectCount: 7 }]
    );
    expect(result[0].brands[0].count).toBe(7);
  });

  it("returns empty for empty categories", () => {
    expect(mergeCategoryData([], brandCounts)).toEqual([]);
  });

  it("handles empty brand counts", () => {
    const result = mergeCategoryData(categories, []);
    expect(result[0].brands.every((b) => b.count === 0)).toBe(true);
  });
});

describe("Prospect view state – stat cards", () => {
  it("returns 4 cards for valid stats", () => {
    expect(buildStatCards({ totalProspects: 100, totalProspectsToday: 5, totalCategories: 3, totalBrands: 10 })).toHaveLength(4);
  });

  it("returns empty for null stats", () => {
    expect(buildStatCards(null)).toEqual([]);
  });

  it("maps values correctly", () => {
    const cards = buildStatCards({ totalProspects: 42, totalProspectsToday: 3, totalCategories: 5, totalBrands: 8 });
    expect(cards[0].value).toBe(42);
    expect(cards[3].value).toBe(8);
  });
});
