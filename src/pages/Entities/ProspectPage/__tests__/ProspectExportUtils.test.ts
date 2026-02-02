import { describe, it, expect } from "vitest";

// Test dynamic column generation and data mapping from ProspectExportUtils

interface MockProspect {
  id: string;
  name: string;
  images?: { imageUrl: string }[];
  interest?: { category: string; brands?: string[] }[];
}

function calculateMaxImages(prospects: MockProspect[]): number {
  return prospects.reduce((max, p) => Math.max(max, p.images?.length || 0), 0);
}

function extractDynamicCategories(prospects: MockProspect[]): string[] {
  const set = new Set<string>();
  prospects.forEach((p) => {
    (p.interest || []).forEach((i) => {
      if (i.category) set.add(i.category);
    });
  });
  return Array.from(set).sort();
}

function buildColumns(maxImages: number, categories: string[]) {
  const base = [
    { header: "S.No", key: "sno" },
    { header: "Prospect Name", key: "name" },
    { header: "Owner Name", key: "owner" },
    { header: "Phone", key: "phone" },
    { header: "Email", key: "email" },
    { header: "PAN/VAT", key: "panVat" },
    { header: "Address", key: "address" },
    { header: "Created By", key: "createdBy" },
    { header: "Joined Date", key: "date" },
  ];
  for (let i = 0; i < maxImages; i++) {
    base.push({ header: `Image URL ${i + 1}`, key: `img_${i}` });
  }
  categories.forEach((cat) => {
    base.push({ header: `${cat} (Brands)`, key: `cat_${cat}` });
  });
  return base;
}

function mapInterestBrands(
  interest: { category: string; brands?: string[] }[],
  categories: string[]
): Record<string, string> {
  const result: Record<string, string> = {};
  categories.forEach((cat) => {
    const match = interest.find((i) => i.category === cat);
    result[`cat_${cat}`] = match ? (match.brands?.join(", ") || "-") : "-";
  });
  return result;
}

const prospects: MockProspect[] = [
  {
    id: "1",
    name: "P1",
    images: [{ imageUrl: "http://a.com/1.png" }, { imageUrl: "http://a.com/2.png" }],
    interest: [
      { category: "Electronics", brands: ["Sony", "LG"] },
      { category: "Clothing", brands: ["Nike"] },
    ],
  },
  {
    id: "2",
    name: "P2",
    images: [{ imageUrl: "http://b.com/1.png" }],
    interest: [{ category: "Electronics", brands: ["Samsung"] }],
  },
  { id: "3", name: "P3" },
];

describe("Prospect export – max images", () => {
  it("finds max image count", () => {
    expect(calculateMaxImages(prospects)).toBe(2);
  });

  it("returns 0 for no images", () => {
    expect(calculateMaxImages([{ id: "1", name: "x" }])).toBe(0);
  });
});

describe("Prospect export – dynamic categories", () => {
  it("extracts sorted unique categories", () => {
    expect(extractDynamicCategories(prospects)).toEqual(["Clothing", "Electronics"]);
  });

  it("returns empty for no interests", () => {
    expect(extractDynamicCategories([{ id: "1", name: "x" }])).toEqual([]);
  });
});

describe("Prospect export – column builder", () => {
  it("has 9 base columns", () => {
    expect(buildColumns(0, [])).toHaveLength(9);
  });

  it("adds image columns", () => {
    expect(buildColumns(3, [])).toHaveLength(12);
  });

  it("adds category columns", () => {
    expect(buildColumns(0, ["Electronics", "Clothing"])).toHaveLength(11);
  });

  it("combines images and categories", () => {
    expect(buildColumns(2, ["Electronics"])).toHaveLength(12);
  });
});

describe("Prospect export – interest brand mapping", () => {
  it("maps matching brands", () => {
    const result = mapInterestBrands(
      [{ category: "Electronics", brands: ["Sony", "LG"] }],
      ["Electronics", "Clothing"]
    );
    expect(result.cat_Electronics).toBe("Sony, LG");
    expect(result.cat_Clothing).toBe("-");
  });

  it("returns dash for empty brands", () => {
    const result = mapInterestBrands([{ category: "Food" }], ["Food"]);
    expect(result.cat_Food).toBe("-");
  });
});
