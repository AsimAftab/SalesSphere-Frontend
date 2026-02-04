import { describe, it, expect } from 'vitest';

// Extracted empty state logic from SubscribersTable

interface EmptyStateContent {
    title: string;
    description: string;
}

function getEmptyStateContent(
    searchQuery: string,
    filterActive: boolean | null
): EmptyStateContent {
    const title = searchQuery
        ? 'No Results Found'
        : filterActive === true
            ? 'No Active Subscribers'
            : filterActive === false
                ? 'No Unsubscribed Users'
                : 'No Subscribers';

    const description = searchQuery
        ? 'No subscribers match your search criteria.'
        : filterActive === true
            ? 'There are no active subscribers at the moment.'
            : filterActive === false
                ? 'No users have unsubscribed from the newsletter.'
                : 'No one has subscribed to the newsletter yet.';

    return { title, description };
}

// Extracted source label mapping
const sourceLabels: Record<string, string> = {
    website: 'Website',
    'landing-page': 'Landing Page',
    referral: 'Referral',
    other: 'Other',
};

function getSourceLabel(source: string): string {
    return sourceLabels[source] || source;
}

describe('Subscribers Table - Empty State Logic', () => {
    describe('Title', () => {
        it('should show "No Results Found" when search query exists', () => {
            const result = getEmptyStateContent('test@email.com', null);
            expect(result.title).toBe('No Results Found');
        });

        it('should show "No Active Subscribers" when filtering active', () => {
            const result = getEmptyStateContent('', true);
            expect(result.title).toBe('No Active Subscribers');
        });

        it('should show "No Unsubscribed Users" when filtering unsubscribed', () => {
            const result = getEmptyStateContent('', false);
            expect(result.title).toBe('No Unsubscribed Users');
        });

        it('should show "No Subscribers" when no filters applied', () => {
            const result = getEmptyStateContent('', null);
            expect(result.title).toBe('No Subscribers');
        });

        it('should prioritize search query over filter for title', () => {
            const result = getEmptyStateContent('search', true);
            expect(result.title).toBe('No Results Found');
        });
    });

    describe('Description', () => {
        it('should show search message when search query exists', () => {
            const result = getEmptyStateContent('test', null);
            expect(result.description).toBe('No subscribers match your search criteria.');
        });

        it('should show active message when filtering active', () => {
            const result = getEmptyStateContent('', true);
            expect(result.description).toBe('There are no active subscribers at the moment.');
        });

        it('should show unsubscribed message when filtering unsubscribed', () => {
            const result = getEmptyStateContent('', false);
            expect(result.description).toBe('No users have unsubscribed from the newsletter.');
        });

        it('should show default message when no filters', () => {
            const result = getEmptyStateContent('', null);
            expect(result.description).toBe('No one has subscribed to the newsletter yet.');
        });
    });
});

describe('Subscribers Table - Source Labels', () => {
    it('should return "Website" for website source', () => {
        expect(getSourceLabel('website')).toBe('Website');
    });

    it('should return "Landing Page" for landing-page source', () => {
        expect(getSourceLabel('landing-page')).toBe('Landing Page');
    });

    it('should return "Referral" for referral source', () => {
        expect(getSourceLabel('referral')).toBe('Referral');
    });

    it('should return "Other" for other source', () => {
        expect(getSourceLabel('other')).toBe('Other');
    });

    it('should return original value for unknown source', () => {
        expect(getSourceLabel('unknown-source')).toBe('unknown-source');
    });
});
