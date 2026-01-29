export const SUBSCRIPTION_DURATIONS = [
    { label: '6 Months', value: '6 Months' },
    { label: '12 Months', value: '12 Months' }
];

export const WEEK_DAYS = [
    { label: 'Sunday', value: 'Sunday' },
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' }
];

export const COUNTRIES = [
    { label: 'Nepal', value: 'Nepal' },
    { label: 'India', value: 'India' },
    { label: 'United States', value: 'United States' },
    { label: 'United Kingdom', value: 'United Kingdom' },
    { label: 'Australia', value: 'Australia' },
    { label: 'Canada', value: 'Canada' },
    { label: 'Germany', value: 'Germany' },
    { label: 'France', value: 'France' },
    { label: 'Japan', value: 'Japan' },
    { label: 'China', value: 'China' },
    { label: 'Brazil', value: 'Brazil' },
    { label: 'South Africa', value: 'South Africa' },
    { label: 'Singapore', value: 'Singapore' },
    { label: 'United Arab Emirates', value: 'United Arab Emirates' },
    { label: 'Saudi Arabia', value: 'Saudi Arabia' },
    { label: 'Italy', value: 'Italy' },
    { label: 'Spain', value: 'Spain' },
    { label: 'Russia', value: 'Russia' },
    { label: 'South Korea', value: 'South Korea' },
    { label: 'Mexico', value: 'Mexico' },
    { label: 'Netherlands', value: 'Netherlands' },
    { label: 'Sweden', value: 'Sweden' },
    { label: 'Switzerland', value: 'Switzerland' }
];

export const TIMEZONES = [
    { label: 'Asia/Kathmandu', value: 'Asia/Kathmandu' },
    { label: 'Asia/Kolkata', value: 'Asia/Kolkata' },
    { label: 'America/New_York', value: 'America/New_York' },
    { label: 'Europe/London', value: 'Europe/London' },
    { label: 'Australia/Sydney', value: 'Australia/Sydney' },
    { label: 'Asia/Dubai', value: 'Asia/Dubai' },
    { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
    { label: 'America/Chicago', value: 'America/Chicago' },
    { label: 'Europe/Paris', value: 'Europe/Paris' },
    { label: 'Europe/Berlin', value: 'Europe/Berlin' },
    { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
    { label: 'Asia/Shanghai', value: 'Asia/Shanghai' },
    { label: 'Asia/Singapore', value: 'Asia/Singapore' },
    { label: 'Asia/Seoul', value: 'Asia/Seoul' },
    { label: 'Pacific/Auckland', value: 'Pacific/Auckland' },
    { label: 'Europe/Moscow', value: 'Europe/Moscow' },
    { label: 'Africa/Johannesburg', value: 'Africa/Johannesburg' },
    { label: 'America/Toronto', value: 'America/Toronto' },
    { label: 'America/Vancouver', value: 'America/Vancouver' },
    { label: 'America/Sao_Paulo', value: 'America/Sao_Paulo' },
    { label: 'Asia/Hong_Kong', value: 'Asia/Hong_Kong' },
    { label: 'Asia/Bangkok', value: 'Asia/Bangkok' }
];

// Map countries to their primary timezone
export const COUNTRY_TIMEZONE_MAP: Record<string, string> = {
    'Nepal': 'Asia/Kathmandu',
    'India': 'Asia/Kolkata',
    'United States': 'America/New_York',
    'United Kingdom': 'Europe/London',
    'Australia': 'Australia/Sydney',
    'Canada': 'America/Toronto',
    'Germany': 'Europe/Berlin',
    'France': 'Europe/Paris',
    'Japan': 'Asia/Tokyo',
    'China': 'Asia/Shanghai',
    'Brazil': 'America/Sao_Paulo',
    'South Africa': 'Africa/Johannesburg',
    'Singapore': 'Asia/Singapore',
    'United Arab Emirates': 'Asia/Dubai',
    'Saudi Arabia': 'Asia/Dubai',
    'Italy': 'Europe/Paris',
    'Spain': 'Europe/Paris',
    'Russia': 'Europe/Moscow',
    'South Korea': 'Asia/Seoul',
    'Mexico': 'America/Chicago',
    'Netherlands': 'Europe/Berlin',
    'Sweden': 'Europe/Berlin',
    'Switzerland': 'Europe/Berlin'
};

export const MONTH_OPTIONS = [
    { label: 'January', value: 'January' },
    { label: 'February', value: 'February' },
    { label: 'March', value: 'March' },
    { label: 'April', value: 'April' },
    { label: 'May', value: 'May' },
    { label: 'June', value: 'June' },
    { label: 'July', value: 'July' },
    { label: 'August', value: 'August' },
    { label: 'September', value: 'September' },
    { label: 'October', value: 'October' },
    { label: 'November', value: 'November' },
    { label: 'December', value: 'December' }
];

export const ITEMS_PER_PAGE = 9;
