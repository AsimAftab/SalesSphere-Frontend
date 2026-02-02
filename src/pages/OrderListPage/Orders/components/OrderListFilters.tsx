import React from 'react';
import { FilterBar, FilterDropdown, DatePicker } from '@/components/ui';

interface OrderListFiltersProps {
    isVisible: boolean;
    onClose: () => void;
    onReset: () => void;
    filters: {
        parties: string[];
        creators: string[];
        status: string[];
        month: string[];
        date: Date | null;
    };
    setFilters: (filters: OrderListFiltersProps['filters']) => void;
    options: {
        parties: string[];
        creators: string[];
        statuses: string[];
        months: string[];
        calendarOpenToDate?: Date;
    };
}

const OrderListFilters: React.FC<OrderListFiltersProps> = ({
    isVisible,
    onClose,
    onReset,
    filters,
    setFilters,
    options
}) => {
    return (
        <FilterBar
            isVisible={isVisible}
            onClose={onClose}
            onReset={onReset}
        >
            <FilterDropdown
                label="Party"
                selected={filters.parties}
                options={options.parties}
                onChange={(val: string[]) => setFilters({ ...filters, parties: val })}
                align="left"
            />
            <FilterDropdown
                label="Created By"
                selected={filters.creators}
                options={options.creators}
                onChange={(val: string[]) => setFilters({ ...filters, creators: val })}
                align="left"
            />
            <FilterDropdown
                label="Status"
                selected={filters.status}
                options={options.statuses}
                onChange={(val: string[]) => setFilters({ ...filters, status: val })}
                align="right"
            />
            <FilterDropdown
                label="Month"
                selected={filters.month}
                options={options.months}
                onChange={(val: string[]) => setFilters({ ...filters, month: val })}
                align="left"
            />

            <div className="flex flex-col min-w-[140px] flex-1 sm:flex-none border-b sm:border-none pb-1 sm:pb-0">
                <DatePicker
                    value={filters.date}
                    onChange={(date: Date | null) => setFilters({ ...filters, date })}
                    openToDate={options.calendarOpenToDate}
                    placeholder="Select Date" isClearable
                    className="bg-none border-gray-100 text-sm text-gray-900 font-semibold placeholder:text-gray-900"
                />
            </div>
        </FilterBar>
    );
};

export default OrderListFilters;
