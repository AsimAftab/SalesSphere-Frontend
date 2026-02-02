export const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December',
];

export const STATUS_COLORS: Record<string, string> = {
    P: 'text-green-500',
    A: 'text-red-500',
    W: 'text-blue-500',
    L: 'text-yellow-500',
    H: 'text-purple-500',
    '-': 'text-gray-400',
};

export const STATUS_LABELS: Record<string, string> = {
    P: 'Present',
    A: 'Absent',
    W: 'Weekly Off',
    L: 'Leave',
    H: 'Half Day',
};

export const LEGEND_ITEMS = [
    { code: 'P', label: 'Present', colorClass: 'bg-green-500' },
    { code: 'A', label: 'Absent', colorClass: 'bg-red-500' },
    { code: 'W', label: 'Weekly Off', colorClass: 'bg-blue-500' },
    { code: 'L', label: 'Leave', colorClass: 'bg-yellow-500' },
    { code: 'H', label: 'Half Day', colorClass: 'bg-purple-500' },
];
