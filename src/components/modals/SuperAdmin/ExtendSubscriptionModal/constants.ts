import type { SubscriptionDuration } from './types';

export interface DurationOption {
    value: SubscriptionDuration;
    label: string;
    description: string;
}

export const DURATION_OPTIONS: DurationOption[] = [
    {
        value: '6months',
        label: '6 Months',
        description: 'Extend subscription by 6 months'
    },
    {
        value: '12months',
        label: '12 Months',
        description: 'Extend subscription by 1 year'
    },
];

export const INITIAL_FORM_DATA = {
    duration: '' as const,
};
