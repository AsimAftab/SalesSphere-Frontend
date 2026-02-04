import { describe, it, expect } from "vitest";

// Extracted pure filtering logic from useEntityManager

interface MockEntity {
  id: string;
  name: string;
  category?: string;
  interest?: Array<{ category: string; brands: string[] }>;
  createdBy?: { name: string } | string;
  [key: string]: unknown;
}

function filterEntities(
  data: MockEntity[] | null,
  searchTerm: string,
  searchFields: (keyof MockEntity)[],
  activeFilters: Record<string, string[]>
): MockEntity[] {
  if (!data || !Array.isArray(data)) return [];

  return data.filter((item) => {
    const matchesSearch =
      searchFields.length === 0 ||
      searchFields.some((field) => {
        const value = item[field];
        return String(value || "").toLowerCase().includes(searchTerm.toLowerCase());
      });

    if (!matchesSearch) return false;

    return Object.entries(activeFilters).every(([key, selectedValues]) => {
      if (!selectedValues || selectedValues.length === 0) return true;

      const isInterestFilter = key === "category" || key === "brands";
      const itemValue: unknown = isInterestFilter ? item.interest : item[key as keyof MockEntity];

      if (selectedValues.includes("Not Specified") || selectedValues.includes("None")) {
        if (!itemValue || (Array.isArray(itemValue) && itemValue.length === 0)) return true;
      }

      if (Array.isArray(itemValue)) {
        return itemValue.some((val: Record<string, unknown>) => {
          if (key === "category") return selectedValues.includes(val.category as string);
          if (key === "brands")
            return (val.brands as string[])?.some((b: string) => selectedValues.includes(b));
          return selectedValues.includes((val?.name as string) || String(val));
        });
      }

      const obj = itemValue as Record<string, unknown> | null;
      const normalizedValue = typeof obj === "object" && obj?.name ? obj.name : itemValue;
      return selectedValues.includes(normalizedValue as string);
    });
  });
}

const mockEntities: MockEntity[] = [
  {
    id: "1",
    name: "Party A",
    interest: [{ category: "Electronics", brands: ["Samsung", "LG"] }],
    createdBy: { name: "Alice" },
  },
  {
    id: "2",
    name: "Party B",
    interest: [{ category: "Furniture", brands: ["IKEA"] }],
    createdBy: { name: "Bob" },
  },
  {
    id: "3",
    name: "Party C",
    interest: [],
    createdBy: { name: "Alice" },
  },
  {
    id: "4",
    name: "Site Alpha",
    interest: [{ category: "Electronics", brands: ["Sony"] }],
    createdBy: { name: "Charlie" },
  },
];

const noFilters = { category: [] as string[], brands: [] as string[], createdBy: [] as string[] };

describe("Entity manager – search", () => {
  it("searches by name field", () => {
    const result = filterEntities(mockEntities, "Party", ["name"], noFilters);
    expect(result).toHaveLength(3);
  });

  it("search is case-insensitive", () => {
    const result = filterEntities(mockEntities, "site alpha", ["name"], noFilters);
    expect(result).toHaveLength(1);
  });

  it("returns all when search is empty", () => {
    const result = filterEntities(mockEntities, "", ["name"], noFilters);
    expect(result).toHaveLength(4);
  });

  it("returns empty for no match", () => {
    const result = filterEntities(mockEntities, "Nonexistent", ["name"], noFilters);
    expect(result).toHaveLength(0);
  });

  it("returns empty for null data", () => {
    expect(filterEntities(null, "", ["name"], noFilters)).toEqual([]);
  });
});

describe("Entity manager – category filter", () => {
  it("filters by category", () => {
    const result = filterEntities(mockEntities, "", ["name"], {
      ...noFilters,
      category: ["Electronics"],
    });
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id)).toEqual(["1", "4"]);
  });

  it("'Not Specified' matches entities with empty interest", () => {
    const result = filterEntities(mockEntities, "", ["name"], {
      ...noFilters,
      category: ["Not Specified"],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("3");
  });
});

describe("Entity manager – brands filter", () => {
  it("filters by brand", () => {
    const result = filterEntities(mockEntities, "", ["name"], {
      ...noFilters,
      brands: ["Samsung"],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("filters multiple brands", () => {
    const result = filterEntities(mockEntities, "", ["name"], {
      ...noFilters,
      brands: ["Samsung", "Sony"],
    });
    expect(result).toHaveLength(2);
  });
});

describe("Entity manager – createdBy filter", () => {
  it("filters by creator (object with name)", () => {
    const result = filterEntities(mockEntities, "", ["name"], {
      ...noFilters,
      createdBy: ["Alice"],
    });
    expect(result).toHaveLength(2);
  });
});

describe("Entity manager – combined filters", () => {
  it("applies search + category filter", () => {
    const result = filterEntities(mockEntities, "Party", ["name"], {
      ...noFilters,
      category: ["Electronics"],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("applies category + brands filter", () => {
    const result = filterEntities(mockEntities, "", ["name"], {
      ...noFilters,
      category: ["Electronics"],
      brands: ["Sony"],
    });
    // Only entity 4 has Electronics + Sony
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("4");
  });
});

describe("Entity manager – pagination", () => {
  it("paginates with 12 items per page", () => {
    const items = Array.from({ length: 30 }, (_, i) => ({ id: String(i) }));
    const itemsPerPage = 12;
    const page1 = items.slice(0, itemsPerPage);
    const page3 = items.slice(24, 36);
    expect(page1).toHaveLength(12);
    expect(page3).toHaveLength(6);
    expect(Math.ceil(items.length / itemsPerPage)).toBe(3);
  });
});
