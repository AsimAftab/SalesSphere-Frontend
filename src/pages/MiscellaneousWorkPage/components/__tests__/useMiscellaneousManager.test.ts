import { describe, it, expect } from 'vitest';

// Extracted logic from useMiscellaneousManager

const MONTH_OPTIONS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

interface MiscWork {
    _id: string;
    natureOfWork: string;
    address: string;
    workDate: string;
    employee?: { name: string };
    assignedBy?: { name: string };
}

interface Filters {
    date: Date | null;
    employees: string[];
    months: string[];
    assigners: string[];
}

function filterMiscWorks(
    miscWorks: MiscWork[],
    searchQuery: string,
    filters: Filters
): MiscWork[] {
    return miscWorks.filter((work) => {
        const nature = (work.natureOfWork || "").toLowerCase();
        const addr = (work.address || "").toLowerCase();
        const emp = (work.employee?.name || "").toLowerCase();
        const term = searchQuery.toLowerCase();

        const matchesSearch = term === "" ||
            nature.includes(term) ||
            addr.includes(term) ||
            emp.includes(term);

        const matchesEmployee = filters.employees.length === 0 ||
            filters.employees.includes(work.employee?.name || "");

        const matchesAssigner = filters.assigners.length === 0 ||
            filters.assigners.includes(work.assignedBy?.name || "");

        const matchesMonth = filters.months.length === 0 || (() => {
            if (!work.workDate) return false;
            const monthName = MONTH_OPTIONS[new Date(work.workDate).getMonth()];
            return filters.months.includes(monthName);
        })();

        const matchesDate = !filters.date || (() => {
            if (!work.workDate) return false;
            const workDateString = new Date(work.workDate).toISOString().split('T')[0];
            const year = filters.date!.getFullYear();
            const month = String(filters.date!.getMonth() + 1).padStart(2, '0');
            const day = String(filters.date!.getDate()).padStart(2, '0');
            const localFilterDate = `${year}-${month}-${day}`;
            return workDateString === localFilterDate;
        })();

        return matchesSearch && matchesEmployee && matchesMonth && matchesDate && matchesAssigner;
    });
}

function paginateMiscWorks(
    miscWorks: MiscWork[],
    currentPage: number,
    itemsPerPage: number
): MiscWork[] {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return miscWorks.slice(startIndex, startIndex + itemsPerPage);
}

function getEmployeeOptions(miscWorks: MiscWork[]): { label: string; value: string }[] {
    const names = miscWorks
        .map(item => item.employee?.name)
        .filter((name): name is string => Boolean(name));

    return Array.from(new Set(names)).map(name => ({ label: name, value: name }));
}

function getAssignerOptions(miscWorks: MiscWork[]): { label: string; value: string }[] {
    const names = miscWorks
        .map(item => item.assignedBy?.name)
        .filter((name): name is string => Boolean(name));

    return Array.from(new Set(names)).map(name => ({ label: name, value: name }));
}

const emptyFilters: Filters = {
    date: null,
    employees: [],
    months: [],
    assigners: [],
};

// Test data
const mockMiscWorks: MiscWork[] = [
    { _id: '1', natureOfWork: 'Site Visit', address: '123 Main St', workDate: '2026-01-15', employee: { name: 'John' }, assignedBy: { name: 'Manager A' } },
    { _id: '2', natureOfWork: 'Client Meeting', address: '456 Oak Ave', workDate: '2026-01-20', employee: { name: 'Jane' }, assignedBy: { name: 'Manager B' } },
    { _id: '3', natureOfWork: 'Inspection', address: '789 Pine Rd', workDate: '2026-02-10', employee: { name: 'John' }, assignedBy: { name: 'Manager A' } },
    { _id: '4', natureOfWork: 'Training', address: '321 Elm St', workDate: '2026-02-15', employee: { name: 'Bob' }, assignedBy: { name: 'Manager B' } },
    { _id: '5', natureOfWork: 'Site Survey', address: '654 Maple Dr', workDate: '2026-03-01', employee: { name: 'Jane' }, assignedBy: { name: 'Manager A' } },
];

describe('Miscellaneous Manager - Filter Logic', () => {
    it('should return all work items when no filters applied', () => {
        const result = filterMiscWorks(mockMiscWorks, '', emptyFilters);
        expect(result).toHaveLength(5);
    });

    it('should filter by search term (nature of work)', () => {
        const result = filterMiscWorks(mockMiscWorks, 'Site', emptyFilters);
        expect(result).toHaveLength(2);
    });

    it('should filter by search term (address)', () => {
        const result = filterMiscWorks(mockMiscWorks, 'Main', emptyFilters);
        expect(result).toHaveLength(1);
    });

    it('should filter by search term (employee name)', () => {
        const result = filterMiscWorks(mockMiscWorks, 'John', emptyFilters);
        expect(result).toHaveLength(2);
    });

    it('should filter by employee', () => {
        const result = filterMiscWorks(mockMiscWorks, '', { ...emptyFilters, employees: ['John'] });
        expect(result).toHaveLength(2);
    });

    it('should filter by assigner', () => {
        const result = filterMiscWorks(mockMiscWorks, '', { ...emptyFilters, assigners: ['Manager A'] });
        expect(result).toHaveLength(3);
    });

    it('should filter by month', () => {
        const result = filterMiscWorks(mockMiscWorks, '', { ...emptyFilters, months: ['January'] });
        expect(result).toHaveLength(2);
    });

    it('should filter by multiple months', () => {
        const result = filterMiscWorks(mockMiscWorks, '', { ...emptyFilters, months: ['January', 'February'] });
        expect(result).toHaveLength(4);
    });

    it('should combine search and filters', () => {
        const result = filterMiscWorks(mockMiscWorks, 'Site', { ...emptyFilters, employees: ['John'] });
        expect(result).toHaveLength(1);
    });

    it('should return empty when no matches', () => {
        const result = filterMiscWorks(mockMiscWorks, 'nonexistent', emptyFilters);
        expect(result).toHaveLength(0);
    });

    it('should be case insensitive', () => {
        const result = filterMiscWorks(mockMiscWorks, 'MEETING', emptyFilters);
        expect(result).toHaveLength(1);
    });
});

describe('Miscellaneous Manager - Pagination', () => {
    it('should return first page correctly', () => {
        const result = paginateMiscWorks(mockMiscWorks, 1, 2);
        expect(result).toHaveLength(2);
        expect(result[0]._id).toBe('1');
    });

    it('should return second page correctly', () => {
        const result = paginateMiscWorks(mockMiscWorks, 2, 2);
        expect(result).toHaveLength(2);
        expect(result[0]._id).toBe('3');
    });

    it('should handle last page with fewer items', () => {
        const result = paginateMiscWorks(mockMiscWorks, 3, 2);
        expect(result).toHaveLength(1);
    });

    it('should return empty for page beyond data', () => {
        const result = paginateMiscWorks(mockMiscWorks, 10, 2);
        expect(result).toHaveLength(0);
    });
});

describe('Miscellaneous Manager - Option Extraction', () => {
    it('should extract unique employee options', () => {
        const result = getEmployeeOptions(mockMiscWorks);
        expect(result).toHaveLength(3);
        expect(result.map(o => o.value)).toContain('John');
        expect(result.map(o => o.value)).toContain('Jane');
        expect(result.map(o => o.value)).toContain('Bob');
    });

    it('should extract unique assigner options', () => {
        const result = getAssignerOptions(mockMiscWorks);
        expect(result).toHaveLength(2);
        expect(result.map(o => o.value)).toContain('Manager A');
        expect(result.map(o => o.value)).toContain('Manager B');
    });

    it('should return options with label and value', () => {
        const result = getEmployeeOptions(mockMiscWorks);
        result.forEach(option => {
            expect(option).toHaveProperty('label');
            expect(option).toHaveProperty('value');
            expect(option.label).toBe(option.value);
        });
    });

    it('should handle empty array', () => {
        const result = getEmployeeOptions([]);
        expect(result).toHaveLength(0);
    });
});
