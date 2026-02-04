import { describe, it, expect } from 'vitest';

// Extracted filter logic from useCollectionViewState

interface Collection {
    _id: string;
    partyName: string;
    paymentMode: string;
    chequeStatus?: string;
    receivedDate: string;
    createdAt: string;
    createdBy?: { name: string };
}

function filterCollections(
    collections: Collection[],
    searchTerm: string,
    selectedMonth: string[],
    selectedDate: Date | null,
    selectedParty: string[],
    selectedPaymentMode: string[],
    selectedChequeStatus: string[],
    selectedCreatedBy: string[]
): Collection[] {
    return collections.filter((collection) => {
        const partyName = (collection.partyName || "").toLowerCase();
        const paymentMode = (collection.paymentMode || "").toLowerCase();
        const term = (searchTerm || "").toLowerCase();
        const matchesSearch = term === "" ||
            partyName.includes(term) ||
            paymentMode.includes(term);

        let matchesMonth = true;
        if (selectedMonth.length > 0 && collection.receivedDate) {
            const date = new Date(collection.receivedDate);
            const monthName = date.toLocaleString('default', { month: 'long' });
            matchesMonth = selectedMonth.includes(monthName);
        }

        let matchesDate = true;
        if (selectedDate && collection.receivedDate) {
            const d1 = new Date(collection.receivedDate);
            const d2 = selectedDate;
            matchesDate = d1.getFullYear() === d2.getFullYear() &&
                d1.getMonth() === d2.getMonth() &&
                d1.getDate() === d2.getDate();
        }

        const matchesParty = selectedParty.length === 0 ||
            selectedParty.includes(collection.partyName);

        const matchesPaymentMode = selectedPaymentMode.length === 0 ||
            selectedPaymentMode.includes(collection.paymentMode);

        let matchesChequeStatus = true;
        if (selectedChequeStatus.length > 0) {
            if (collection.paymentMode === 'Cheque' && collection.chequeStatus) {
                matchesChequeStatus = selectedChequeStatus.includes(collection.chequeStatus);
            } else {
                matchesChequeStatus = false;
            }
        }

        const matchesCreatedBy = selectedCreatedBy.length === 0 ||
            (collection.createdBy?.name && selectedCreatedBy.includes(collection.createdBy.name));

        return matchesSearch && matchesMonth && matchesDate &&
            matchesParty && matchesPaymentMode && matchesChequeStatus && matchesCreatedBy;
    });
}

function paginateCollections(
    collections: Collection[],
    currentPage: number,
    itemsPerPage: number
): Collection[] {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return collections.slice(startIndex, startIndex + itemsPerPage);
}

function getUniqueValues<T, K extends keyof T>(items: T[], key: K): T[K][] {
    return Array.from(new Set(items.map(item => item[key]).filter(Boolean))) as T[K][];
}

// Test data
const mockCollections: Collection[] = [
    { _id: '1', partyName: 'Acme Corp', paymentMode: 'Cash', receivedDate: '2026-01-15', createdAt: '2026-01-15T10:00:00Z', createdBy: { name: 'John' } },
    { _id: '2', partyName: 'Beta Inc', paymentMode: 'Cheque', chequeStatus: 'Pending', receivedDate: '2026-01-20', createdAt: '2026-01-20T10:00:00Z', createdBy: { name: 'Jane' } },
    { _id: '3', partyName: 'Gamma Ltd', paymentMode: 'Bank Transfer', receivedDate: '2026-02-10', createdAt: '2026-02-10T10:00:00Z', createdBy: { name: 'John' } },
    { _id: '4', partyName: 'Delta Corp', paymentMode: 'Cheque', chequeStatus: 'Cleared', receivedDate: '2026-02-15', createdAt: '2026-02-15T10:00:00Z', createdBy: { name: 'Jane' } },
    { _id: '5', partyName: 'Acme Corp', paymentMode: 'Cash', receivedDate: '2026-03-01', createdAt: '2026-03-01T10:00:00Z', createdBy: { name: 'Bob' } },
];

describe('Collection View State - Filter Logic', () => {
    it('should return all collections when no filters applied', () => {
        const result = filterCollections(mockCollections, '', [], null, [], [], [], []);
        expect(result).toHaveLength(5);
    });

    it('should filter by search term (party name)', () => {
        const result = filterCollections(mockCollections, 'Acme', [], null, [], [], [], []);
        expect(result).toHaveLength(2);
    });

    it('should filter by search term (payment mode)', () => {
        const result = filterCollections(mockCollections, 'cash', [], null, [], [], [], []);
        expect(result).toHaveLength(2);
    });

    it('should filter by payment mode', () => {
        const result = filterCollections(mockCollections, '', [], null, [], ['Cheque'], [], []);
        expect(result).toHaveLength(2);
    });

    it('should filter by cheque status', () => {
        const result = filterCollections(mockCollections, '', [], null, [], [], ['Pending'], []);
        expect(result).toHaveLength(1);
        expect(result[0].partyName).toBe('Beta Inc');
    });

    it('should exclude non-cheque payments when filtering by cheque status', () => {
        const result = filterCollections(mockCollections, '', [], null, [], [], ['Cleared'], []);
        expect(result).toHaveLength(1);
        expect(result[0].paymentMode).toBe('Cheque');
    });

    it('should filter by party', () => {
        const result = filterCollections(mockCollections, '', [], null, ['Acme Corp'], [], [], []);
        expect(result).toHaveLength(2);
    });

    it('should filter by created by', () => {
        const result = filterCollections(mockCollections, '', [], null, [], [], [], ['John']);
        expect(result).toHaveLength(2);
    });

    it('should combine multiple filters', () => {
        const result = filterCollections(mockCollections, '', [], null, ['Acme Corp'], ['Cash'], [], []);
        expect(result).toHaveLength(2);
    });

    it('should return empty when no matches', () => {
        const result = filterCollections(mockCollections, 'nonexistent', [], null, [], [], [], []);
        expect(result).toHaveLength(0);
    });
});

describe('Collection View State - Pagination', () => {
    it('should return first page correctly', () => {
        const result = paginateCollections(mockCollections, 1, 2);
        expect(result).toHaveLength(2);
        expect(result[0]._id).toBe('1');
    });

    it('should return second page correctly', () => {
        const result = paginateCollections(mockCollections, 2, 2);
        expect(result).toHaveLength(2);
        expect(result[0]._id).toBe('3');
    });

    it('should handle last page with fewer items', () => {
        const result = paginateCollections(mockCollections, 3, 2);
        expect(result).toHaveLength(1);
    });
});

describe('Collection View State - Unique Values', () => {
    it('should extract unique party names', () => {
        const result = getUniqueValues(mockCollections, 'partyName');
        expect(result).toContain('Acme Corp');
        expect(result).toContain('Beta Inc');
        expect(result.length).toBe(4); // Acme Corp, Beta Inc, Gamma Ltd, Delta Corp
    });

    it('should extract unique payment modes', () => {
        const result = getUniqueValues(mockCollections, 'paymentMode');
        expect(result).toContain('Cash');
        expect(result).toContain('Cheque');
        expect(result).toContain('Bank Transfer');
    });
});
