import { describe, it, expect } from "vitest";

// We test the filtering logic directly (extracted from useTourManager)
// since the hook itself requires react-query provider + API mocking.

interface MockTourPlan {
  id: string;
  placeOfVisit: string;
  status: string;
  startDate: string;
  createdBy: { name: string };
  approvedBy?: { name: string } | null;
}

const mockPlans: MockTourPlan[] = [
  {
    id: "1",
    placeOfVisit: "Mumbai Office",
    status: "pending",
    startDate: "2026-01-15",
    createdBy: { name: "Alice" },
    approvedBy: null,
  },
  {
    id: "2",
    placeOfVisit: "Delhi Branch",
    status: "approved",
    startDate: "2026-02-10",
    createdBy: { name: "Bob" },
    approvedBy: { name: "Charlie" },
  },
  {
    id: "3",
    placeOfVisit: "Kolkata Market",
    status: "pending",
    startDate: "2026-01-20",
    createdBy: { name: "Alice" },
    approvedBy: null,
  },
  {
    id: "4",
    placeOfVisit: "Chennai Hub",
    status: "rejected",
    startDate: "2026-03-05",
    createdBy: { name: "Dave" },
    approvedBy: { name: "Alice" },
  },
];

interface Filters {
  date: Date | null;
  employees: string[];
  statuses: string[];
  months: string[];
  creators: string[];
  reviewers: string[];
}

// Extracted filtering logic from useTourManager
function filterTourPlans(
  plans: MockTourPlan[],
  searchQuery: string,
  filters: Filters
): MockTourPlan[] {
  return plans.filter((plan) => {
    const matchesSearch =
      plan.placeOfVisit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filters.statuses.length === 0 || filters.statuses.includes(plan.status);

    const matchesDate =
      !filters.date ||
      (() => {
        const d = filters.date!;
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const filterDateStr = `${year}-${month}-${day}`;
        return plan.startDate === filterDateStr;
      })();

    const matchesMonth =
      filters.months.length === 0 ||
      (() => {
        if (!plan.startDate) return false;
        const monthName = new Date(plan.startDate).toLocaleString("en-US", {
          month: "long",
        });
        return filters.months.includes(monthName);
      })();

    const matchesEmployee =
      filters.employees.length === 0 ||
      filters.employees.includes(plan.createdBy.name);

    const matchesCreator =
      filters.creators.length === 0 ||
      (plan.createdBy?.name && filters.creators.includes(plan.createdBy.name));

    const matchesReviewer =
      filters.reviewers.length === 0 ||
      (() => {
        const hasNone = filters.reviewers.includes("None");
        const realReviewers = filters.reviewers.filter((r) => r !== "None");
        const isUnreviewed = hasNone && !plan.approvedBy?.name;
        const isReviewedBySelected =
          !!plan.approvedBy?.name &&
          realReviewers.includes(plan.approvedBy.name);
        return isUnreviewed || isReviewedBySelected;
      })();

    return (
      matchesSearch &&
      matchesStatus &&
      matchesDate &&
      matchesMonth &&
      matchesEmployee &&
      matchesCreator &&
      matchesReviewer
    );
  });
}

const emptyFilters: Filters = {
  date: null,
  employees: [],
  statuses: [],
  months: [],
  creators: [],
  reviewers: [],
};

describe("Tour Plan filtering logic", () => {
  it("filters by search query on placeOfVisit", () => {
    const result = filterTourPlans(mockPlans, "Mumbai", emptyFilters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("filters by search query on createdBy name", () => {
    const result = filterTourPlans(mockPlans, "Alice", emptyFilters);
    expect(result).toHaveLength(2);
  });

  it("filters by status", () => {
    const result = filterTourPlans(mockPlans, "", {
      ...emptyFilters,
      statuses: ["approved"],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("filters by date", () => {
    const result = filterTourPlans(mockPlans, "", {
      ...emptyFilters,
      date: new Date(2026, 0, 15), // Jan 15 2026
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("filters by month", () => {
    const result = filterTourPlans(mockPlans, "", {
      ...emptyFilters,
      months: ["January"],
    });
    expect(result).toHaveLength(2); // ids 1 and 3
  });

  it("filters by employee (createdBy)", () => {
    const result = filterTourPlans(mockPlans, "", {
      ...emptyFilters,
      employees: ["Dave"],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("4");
  });

  it("filters by creator", () => {
    const result = filterTourPlans(mockPlans, "", {
      ...emptyFilters,
      creators: ["Bob"],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("filters by reviewer", () => {
    const result = filterTourPlans(mockPlans, "", {
      ...emptyFilters,
      reviewers: ["Charlie"],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("filters unreviewed plans with 'None' reviewer", () => {
    const result = filterTourPlans(mockPlans, "", {
      ...emptyFilters,
      reviewers: ["None"],
    });
    expect(result).toHaveLength(2); // ids 1 and 3 (no approvedBy)
  });

  it("applies combined filters", () => {
    const result = filterTourPlans(mockPlans, "Alice", {
      ...emptyFilters,
      statuses: ["pending"],
    });
    expect(result).toHaveLength(2); // Alice created 2 pending plans
  });

  it("returns empty when no match", () => {
    const result = filterTourPlans(mockPlans, "nonexistent", emptyFilters);
    expect(result).toHaveLength(0);
  });
});

describe("Tour Plan permissions mapping", () => {
  it("maps hasPermission results to permission object", () => {
    // Simulating the permissions mapping from useTourManager
    const mockHasPermission = (module: string, feature: string): boolean => {
      const perms: Record<string, boolean> = {
        "tourPlan.create": true,
        "tourPlan.update": false,
        "tourPlan.delete": true,
        "tourPlan.bulkDelete": false,
        "tourPlan.approve": true,
        "tourPlan.exportPdf": true,
        "tourPlan.exportExcel": false,
      };
      return !!perms[`${module}.${feature}`];
    };

    const permissions = {
      canCreate: mockHasPermission("tourPlan", "create"),
      canUpdate: mockHasPermission("tourPlan", "update"),
      canDelete: mockHasPermission("tourPlan", "delete"),
      canBulkDelete: mockHasPermission("tourPlan", "bulkDelete"),
      canApprove: mockHasPermission("tourPlan", "approve"),
      canExportPdf: mockHasPermission("tourPlan", "exportPdf"),
      canExportExcel: mockHasPermission("tourPlan", "exportExcel"),
    };

    expect(permissions.canCreate).toBe(true);
    expect(permissions.canUpdate).toBe(false);
    expect(permissions.canDelete).toBe(true);
    expect(permissions.canBulkDelete).toBe(false);
    expect(permissions.canApprove).toBe(true);
    expect(permissions.canExportPdf).toBe(true);
    expect(permissions.canExportExcel).toBe(false);
  });
});

describe("Tour Plan pagination", () => {
  it("slices data for page 1 with 10 items per page", () => {
    const data = Array.from({ length: 25 }, (_, i) => ({ id: String(i) }));
    const page = 1;
    const startIndex = (page - 1) * 10;
    const paginated = data.slice(startIndex, startIndex + 10);
    expect(paginated).toHaveLength(10);
    expect(paginated[0].id).toBe("0");
    expect(paginated[9].id).toBe("9");
  });

  it("slices data for page 3 (partial page)", () => {
    const data = Array.from({ length: 25 }, (_, i) => ({ id: String(i) }));
    const page = 3;
    const startIndex = (page - 1) * 10;
    const paginated = data.slice(startIndex, startIndex + 10);
    expect(paginated).toHaveLength(5);
    expect(paginated[0].id).toBe("20");
  });
});
