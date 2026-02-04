import { describe, it, expect } from "vitest";

// Extracted pure filtering logic from useOrganizationFilters

interface MockOrg {
  name: string;
  owner: string;
  status: string;
  createdDate: string;
  subscriptionExpiry?: string;
  subscriptionType?: string;
  customPlanId?: { name: string } | null;
}

interface OrgFilters {
  date: Date | null;
  expiryDate: Date | null;
  employees: string[];
  plans: string[];
  planNames: string[];
  statuses: string[];
  months: string[];
}

function filterOrgs(data: MockOrg[], searchQuery: string, filters: OrgFilters): MockOrg[] {
  return data.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (item.name?.toLowerCase().includes(query) || "") ||
      (item.owner?.toLowerCase().includes(query) || "");
    if (!matchesSearch) return false;

    if (filters.date) {
      const itemDate = new Date(item.createdDate);
      const filterDate = new Date(filters.date);
      if (
        itemDate.getDate() !== filterDate.getDate() ||
        itemDate.getMonth() !== filterDate.getMonth() ||
        itemDate.getFullYear() !== filterDate.getFullYear()
      )
        return false;
    }

    if (filters.expiryDate) {
      if (!item.subscriptionExpiry) return false;
      const itemDate = new Date(item.subscriptionExpiry);
      const filterDate = new Date(filters.expiryDate);
      if (
        itemDate.getDate() !== filterDate.getDate() ||
        itemDate.getMonth() !== filterDate.getMonth() ||
        itemDate.getFullYear() !== filterDate.getFullYear()
      )
        return false;
    }

    if (filters.employees.length > 0 && !filters.employees.includes(item.owner)) return false;

    if (filters.plans.length > 0) {
      const planDuration = item.subscriptionType || "Unknown";
      if (!filters.plans.includes(planDuration)) return false;
    }

    if (filters.planNames.length > 0) {
      let itemName = "Unknown";
      if (item.customPlanId && typeof item.customPlanId === "object" && "name" in item.customPlanId) {
        itemName = item.customPlanId.name;
      } else if (item.subscriptionType) {
        itemName = `${item.subscriptionType.replace(/(\d+)([a-zA-Z]+)/, "$1 $2")} Plan`;
      }
      if (!filters.planNames.includes(itemName)) return false;
    }

    if (filters.statuses.length > 0 && !filters.statuses.includes(item.status)) return false;

    if (filters.months.length > 0) {
      const itemMonth = new Date(item.createdDate).toLocaleString("default", { month: "long" });
      if (!filters.months.includes(itemMonth)) return false;
    }

    return true;
  });
}

const emptyFilters: OrgFilters = {
  date: null,
  expiryDate: null,
  employees: [],
  plans: [],
  planNames: [],
  statuses: [],
  months: [],
};

const mockOrgs: MockOrg[] = [
  {
    name: "Acme Corp",
    owner: "John",
    status: "active",
    createdDate: "2026-01-15T00:00:00Z",
    subscriptionExpiry: "2027-01-15T00:00:00Z",
    subscriptionType: "1year",
    customPlanId: null,
  },
  {
    name: "Beta Inc",
    owner: "Jane",
    status: "inactive",
    createdDate: "2026-03-10T00:00:00Z",
    subscriptionType: "6months",
    customPlanId: { name: "Enterprise" },
  },
  {
    name: "Gamma Ltd",
    owner: "John",
    status: "active",
    createdDate: "2026-01-20T00:00:00Z",
    subscriptionExpiry: "2026-07-20T00:00:00Z",
    subscriptionType: "6months",
    customPlanId: null,
  },
];

describe("Organization filtering logic", () => {
  it("returns all with no search or filters", () => {
    expect(filterOrgs(mockOrgs, "", emptyFilters)).toHaveLength(3);
  });

  it("searches by name", () => {
    expect(filterOrgs(mockOrgs, "Acme", emptyFilters)).toHaveLength(1);
  });

  it("searches by owner", () => {
    expect(filterOrgs(mockOrgs, "John", emptyFilters)).toHaveLength(2);
  });

  it("search is case-insensitive", () => {
    expect(filterOrgs(mockOrgs, "beta", emptyFilters)).toHaveLength(1);
  });

  it("filters by status", () => {
    const result = filterOrgs(mockOrgs, "", { ...emptyFilters, statuses: ["active"] });
    expect(result).toHaveLength(2);
  });

  it("filters by owner", () => {
    const result = filterOrgs(mockOrgs, "", { ...emptyFilters, employees: ["Jane"] });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Beta Inc");
  });

  it("filters by plan duration", () => {
    const result = filterOrgs(mockOrgs, "", { ...emptyFilters, plans: ["6months"] });
    expect(result).toHaveLength(2);
  });

  it("filters by custom plan name", () => {
    const result = filterOrgs(mockOrgs, "", { ...emptyFilters, planNames: ["Enterprise"] });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Beta Inc");
  });

  it("filters by creation date", () => {
    const result = filterOrgs(mockOrgs, "", {
      ...emptyFilters,
      date: new Date("2026-01-15T00:00:00Z"),
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Acme Corp");
  });

  it("filters by expiry date", () => {
    const result = filterOrgs(mockOrgs, "", {
      ...emptyFilters,
      expiryDate: new Date("2027-01-15T00:00:00Z"),
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Acme Corp");
  });

  it("excludes orgs without expiry when expiry filter set", () => {
    const result = filterOrgs(mockOrgs, "", {
      ...emptyFilters,
      expiryDate: new Date("2026-03-10T00:00:00Z"),
    });
    // Beta Inc has no subscriptionExpiry
    expect(result).toHaveLength(0);
  });

  it("filters by month", () => {
    const result = filterOrgs(mockOrgs, "", { ...emptyFilters, months: ["January"] });
    expect(result).toHaveLength(2);
  });

  it("combines multiple filters", () => {
    const result = filterOrgs(mockOrgs, "John", { ...emptyFilters, statuses: ["active"] });
    expect(result).toHaveLength(2);
  });

  it("returns empty when nothing matches", () => {
    expect(filterOrgs(mockOrgs, "NonExistent", emptyFilters)).toHaveLength(0);
  });
});
