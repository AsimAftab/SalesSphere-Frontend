export interface OrganizationFilters {
    date: Date | null;
    expiryDate: Date | null;
    employees: string[];
    plans: string[];
    planNames: string[];
    statuses: string[];
    months: string[];
}

export interface FilterOption {
    label: string;
    value: string;
    count?: number;
}
