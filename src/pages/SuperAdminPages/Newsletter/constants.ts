import type { DropDownOption } from '@/components/ui';

export const ITEMS_PER_PAGE = 10;

export const SOURCE_LABELS: Record<string, string> = {
    website: 'Website',
    'landing-page': 'Landing Page',
    referral: 'Referral',
    other: 'Other',
};

export const STATUS_FILTER_OPTIONS: DropDownOption[] = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'unsubscribed', label: 'Unsubscribed' },
];
