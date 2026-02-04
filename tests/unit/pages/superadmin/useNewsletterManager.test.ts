import { describe, it, expect } from 'vitest';

// Extracted filter logic from useNewsletterManager
interface Subscriber {
    email: string;
    isActive: boolean;
}

function filterSubscribers(
    subscribers: Subscriber[],
    filterActive: boolean | null,
    searchQuery: string
): Subscriber[] {
    let result = subscribers;

    // Filter by active status
    if (filterActive !== null) {
        result = result.filter(s => s.isActive === filterActive);
    }

    // Filter by search query
    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        result = result.filter(s => s.email.toLowerCase().includes(q));
    }

    return result;
}

// Extracted pagination logic
function paginateSubscribers(
    subscribers: Subscriber[],
    currentPage: number,
    itemsPerPage: number
): Subscriber[] {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return subscribers.slice(startIndex, startIndex + itemsPerPage);
}

// Extracted selection logic
function toggleSelection(selectedEmails: Set<string>, email: string): Set<string> {
    const next = new Set(selectedEmails);
    if (next.has(email)) {
        next.delete(email);
    } else {
        next.add(email);
    }
    return next;
}

function selectAllActive(
    activeSubscribers: Subscriber[],
    selectedEmails: Set<string>
): Set<string> {
    const activeEmails = activeSubscribers.map(s => s.email);
    const allSelected = activeEmails.every(email => selectedEmails.has(email));

    if (allSelected) {
        return new Set();
    } else {
        return new Set(activeEmails);
    }
}

function isAllActiveSelected(
    activeSubscribers: Subscriber[],
    selectedEmails: Set<string>
): boolean {
    return activeSubscribers.length > 0 &&
        activeSubscribers.every(s => selectedEmails.has(s.email));
}

// Test data
const mockSubscribers: Subscriber[] = [
    { email: 'john@example.com', isActive: true },
    { email: 'jane@example.com', isActive: true },
    { email: 'bob@test.com', isActive: false },
    { email: 'alice@example.com', isActive: true },
    { email: 'charlie@test.com', isActive: false },
];

describe('Newsletter Manager - Filter Logic', () => {
    it('should return all subscribers when no filters applied', () => {
        const result = filterSubscribers(mockSubscribers, null, '');
        expect(result).toHaveLength(5);
    });

    it('should filter by active status (true)', () => {
        const result = filterSubscribers(mockSubscribers, true, '');
        expect(result).toHaveLength(3);
        expect(result.every(s => s.isActive)).toBe(true);
    });

    it('should filter by active status (false)', () => {
        const result = filterSubscribers(mockSubscribers, false, '');
        expect(result).toHaveLength(2);
        expect(result.every(s => !s.isActive)).toBe(true);
    });

    it('should filter by search query', () => {
        const result = filterSubscribers(mockSubscribers, null, 'example');
        expect(result).toHaveLength(3);
        expect(result.every(s => s.email.includes('example'))).toBe(true);
    });

    it('should filter by search query (case insensitive)', () => {
        const result = filterSubscribers(mockSubscribers, null, 'JOHN');
        expect(result).toHaveLength(1);
        expect(result[0].email).toBe('john@example.com');
    });

    it('should combine active filter and search query', () => {
        const result = filterSubscribers(mockSubscribers, true, 'example');
        // john@example.com, jane@example.com, alice@example.com are all active with 'example'
        expect(result).toHaveLength(3);
        expect(result.every(s => s.isActive && s.email.includes('example'))).toBe(true);
    });

    it('should handle empty search query with whitespace', () => {
        const result = filterSubscribers(mockSubscribers, null, '   ');
        expect(result).toHaveLength(5);
    });

    it('should return empty array when no matches', () => {
        const result = filterSubscribers(mockSubscribers, null, 'nonexistent');
        expect(result).toHaveLength(0);
    });
});

describe('Newsletter Manager - Pagination Logic', () => {
    it('should return first page correctly', () => {
        const result = paginateSubscribers(mockSubscribers, 1, 2);
        expect(result).toHaveLength(2);
        expect(result[0].email).toBe('john@example.com');
        expect(result[1].email).toBe('jane@example.com');
    });

    it('should return second page correctly', () => {
        const result = paginateSubscribers(mockSubscribers, 2, 2);
        expect(result).toHaveLength(2);
        expect(result[0].email).toBe('bob@test.com');
        expect(result[1].email).toBe('alice@example.com');
    });

    it('should handle last page with fewer items', () => {
        const result = paginateSubscribers(mockSubscribers, 3, 2);
        expect(result).toHaveLength(1);
        expect(result[0].email).toBe('charlie@test.com');
    });

    it('should return empty array for page beyond data', () => {
        const result = paginateSubscribers(mockSubscribers, 10, 2);
        expect(result).toHaveLength(0);
    });

    it('should handle single item per page', () => {
        const result = paginateSubscribers(mockSubscribers, 3, 1);
        expect(result).toHaveLength(1);
        expect(result[0].email).toBe('bob@test.com');
    });
});

describe('Newsletter Manager - Selection Logic', () => {
    it('should add email to selection when not selected', () => {
        const selected = new Set<string>();
        const result = toggleSelection(selected, 'john@example.com');
        expect(result.has('john@example.com')).toBe(true);
        expect(result.size).toBe(1);
    });

    it('should remove email from selection when already selected', () => {
        const selected = new Set(['john@example.com']);
        const result = toggleSelection(selected, 'john@example.com');
        expect(result.has('john@example.com')).toBe(false);
        expect(result.size).toBe(0);
    });

    it('should not mutate original set', () => {
        const selected = new Set(['john@example.com']);
        toggleSelection(selected, 'jane@example.com');
        expect(selected.size).toBe(1);
    });
});

describe('Newsletter Manager - Select All Logic', () => {
    const activeSubscribers = mockSubscribers.filter(s => s.isActive);

    it('should select all active when none selected', () => {
        const result = selectAllActive(activeSubscribers, new Set());
        expect(result.size).toBe(3);
        expect(result.has('john@example.com')).toBe(true);
        expect(result.has('jane@example.com')).toBe(true);
        expect(result.has('alice@example.com')).toBe(true);
    });

    it('should deselect all when all are selected', () => {
        const allSelected = new Set(['john@example.com', 'jane@example.com', 'alice@example.com']);
        const result = selectAllActive(activeSubscribers, allSelected);
        expect(result.size).toBe(0);
    });

    it('should select all when only some are selected', () => {
        const someSelected = new Set(['john@example.com']);
        const result = selectAllActive(activeSubscribers, someSelected);
        expect(result.size).toBe(3);
    });

    it('should handle empty active subscribers', () => {
        const result = selectAllActive([], new Set());
        expect(result.size).toBe(0);
    });
});

describe('Newsletter Manager - All Active Selected Check', () => {
    const activeSubscribers = mockSubscribers.filter(s => s.isActive);

    it('should return true when all active are selected', () => {
        const allSelected = new Set(['john@example.com', 'jane@example.com', 'alice@example.com']);
        expect(isAllActiveSelected(activeSubscribers, allSelected)).toBe(true);
    });

    it('should return false when not all active are selected', () => {
        const someSelected = new Set(['john@example.com']);
        expect(isAllActiveSelected(activeSubscribers, someSelected)).toBe(false);
    });

    it('should return false when none selected', () => {
        expect(isAllActiveSelected(activeSubscribers, new Set())).toBe(false);
    });

    it('should return false when active subscribers is empty', () => {
        const selected = new Set(['john@example.com']);
        expect(isAllActiveSelected([], selected)).toBe(false);
    });

    it('should return true when extra emails selected beyond active', () => {
        const selected = new Set([
            'john@example.com',
            'jane@example.com',
            'alice@example.com',
            'extra@example.com'
        ]);
        expect(isAllActiveSelected(activeSubscribers, selected)).toBe(true);
    });
});
