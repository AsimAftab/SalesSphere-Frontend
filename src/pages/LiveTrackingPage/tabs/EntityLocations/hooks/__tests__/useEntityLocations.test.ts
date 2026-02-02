import { describe, it, expect } from "vitest";

// Extracted logic from useEntityLocations

type LocType = "Party" | "Prospect" | "Site";

interface MockLocation {
  id: string;
  type: LocType;
  name: string;
  address: string;
}

function countByType(locations: MockLocation[]) {
  return locations.reduce((acc, loc) => {
    acc[loc.type] = (acc[loc.type] || 0) + 1;
    return acc;
  }, {} as Record<LocType, number>);
}

function filterLocations(
  locations: MockLocation[],
  typeFilters: Record<LocType, boolean>,
  searchTerm: string,
  enabledTypes?: LocType[]
) {
  return locations.filter((loc) => {
    if (enabledTypes && !enabledTypes.includes(loc.type)) return false;
    if (!typeFilters[loc.type]) return false;
    if (searchTerm.trim() === "") return true;
    return (
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
}

const mockLocations: MockLocation[] = [
  { id: "1", type: "Party", name: "Acme Corp", address: "123 Main St" },
  { id: "2", type: "Party", name: "Beta Inc", address: "456 Oak Ave" },
  { id: "3", type: "Prospect", name: "Gamma Ltd", address: "789 Pine Rd" },
  { id: "4", type: "Site", name: "Warehouse A", address: "100 Industrial Blvd" },
];

const allEnabled: Record<LocType, boolean> = { Party: true, Prospect: true, Site: true };

describe("Entity locations – count by type", () => {
  it("counts correctly", () => {
    const counts = countByType(mockLocations);
    expect(counts.Party).toBe(2);
    expect(counts.Prospect).toBe(1);
    expect(counts.Site).toBe(1);
  });
});

describe("Entity locations – filtering", () => {
  it("returns all with no search and all types enabled", () => {
    expect(filterLocations(mockLocations, allEnabled, "")).toHaveLength(4);
  });

  it("filters by type toggle", () => {
    const result = filterLocations(mockLocations, { Party: true, Prospect: false, Site: false }, "");
    expect(result).toHaveLength(2);
    expect(result.every((l) => l.type === "Party")).toBe(true);
  });

  it("filters by search on name", () => {
    expect(filterLocations(mockLocations, allEnabled, "Acme")).toHaveLength(1);
  });

  it("filters by search on address", () => {
    expect(filterLocations(mockLocations, allEnabled, "Industrial")).toHaveLength(1);
  });

  it("respects enabledTypes permission", () => {
    const result = filterLocations(mockLocations, allEnabled, "", ["Party", "Prospect"]);
    expect(result).toHaveLength(3);
    expect(result.find((l) => l.type === "Site")).toBeUndefined();
  });

  it("combines type filter and search", () => {
    const result = filterLocations(mockLocations, { Party: true, Prospect: true, Site: false }, "Gamma");
    expect(result).toHaveLength(1);
  });

  it("returns empty when nothing matches", () => {
    expect(filterLocations(mockLocations, allEnabled, "xyz")).toHaveLength(0);
  });
});
