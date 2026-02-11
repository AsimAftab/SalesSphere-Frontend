import type { StatusOption } from './types';

export const BULK_STATUS_OPTIONS: StatusOption[] = [
    {
        code: 'L',
        label: 'Mark as Leave (Holiday)',
        description: 'Set a holiday for all employees (e.g., National Holiday).'
    }
];

export const MODAL_VARIANTS = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
};

export const OVERLAY_VARIANTS = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};
