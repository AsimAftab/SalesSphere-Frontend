import React from 'react';
import FilterDropdown from '../../../../../components/UI/FilterDropDown/FilterDropDown';
import FilterBar from '../../../../../components/UI/FilterDropDown/FilterBar';
import DatePicker from '../../../../../components/UI/DatePicker/DatePicker';
import type { OrganizationFilters } from '../types';
import { MONTH_OPTIONS } from '../constants';

interface OrganizationFiltersPanelProps {
    isVisible: boolean;
    onClose: () => void;
    onReset: () => void;
    values: OrganizationFilters;
    onFilterChange: (newFilters: OrganizationFilters) => void;
    options: {
        employees: string[];
        plans: string[];
        statuses: string[];
        customPlans?: string[]; // Make optional or required based on usage
    };
}

const OrganizationFiltersPanel: React.FC<OrganizationFiltersPanelProps> = ({
    isVisible,
    onClose,
    onReset,
    values,
    onFilterChange,
    options
}) => {
    // Helper to update specific filter
    const handleDropdownChange = (key: keyof OrganizationFilters, value: string[]) => {
        onFilterChange({ ...values, [key]: value });
    };


    return (
        <FilterBar
            isVisible={isVisible}
            onClose={onClose}
            onReset={onReset}
        >
            {/* Standard Plan Filter */}
            <FilterDropdown
                label="Plan"
                options={options.plans}
                selected={values.plans}
                onChange={(val) => handleDropdownChange('plans', val)}
            />

            {/* Status Filter */}
            <FilterDropdown
                label="Status"
                options={options.statuses}
                selected={values.statuses}
                onChange={(val) => handleDropdownChange('statuses', val)}
            />

            {/* Month Filter */}
            <FilterDropdown
                label="Month"
                options={MONTH_OPTIONS.map(m => m.value)}
                selected={values.months}
                onChange={(val) => handleDropdownChange('months', val)}
            />

            {/* Created Date Picker */}
            <div className="min-w-[140px] flex-1 sm:flex-none">
                <DatePicker
                    value={values.date}
                    onChange={(val) => onFilterChange({ ...values, date: val })}
                    placeholder="Created Date"
                    isClearable
                    className="bg-none border-gray-100 text-sm text-gray-900 font-semibold placeholder:text-gray-900"
                />
            </div>

            {/* Expiry Date Picker */}
            <div className="min-w-[140px] flex-1 sm:flex-none">
                <DatePicker
                    value={values.expiryDate}
                    onChange={(val) => onFilterChange({ ...values, expiryDate: val })}
                    placeholder="Expiry Date"
                    isClearable
                    className="bg-none border-gray-100 text-sm text-gray-900 font-semibold placeholder:text-gray-900"
                />
            </div>
        </FilterBar>
    );
};

export default OrganizationFiltersPanel;
