import type { StatusOption } from './types';

export const STATUS_OPTIONS: StatusOption[] = [
    { code: 'P', label: 'Present', color: 'green' },
    { code: 'A', label: 'Absent', color: 'red' },
    { code: 'L', label: 'Leave', color: 'yellow' },
    { code: 'H', label: 'Half Day', color: 'purple' },
    { code: 'W', label: 'Weekly Off', color: 'blue' },
];

export const COLORS: Record<string, string> = {
    green: 'text-green-700 bg-green-50 border-green-200 ring-green-500',
    red: 'text-red-700 bg-red-50 border-red-200 ring-red-500',
    yellow: 'text-yellow-700 bg-yellow-50 border-yellow-200 ring-yellow-500',
    purple: 'text-purple-700 bg-purple-50 border-purple-200 ring-purple-500',
    blue: 'text-blue-700 bg-blue-50 border-blue-200 ring-blue-500',
    gray: 'text-gray-700 bg-gray-50 border-gray-200 ring-gray-400',
};

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
