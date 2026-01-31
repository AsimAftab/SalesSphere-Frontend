import React from 'react';
import FilterBar from '../../../../components/UI/FilterDropDown/FilterBar';
import FilterDropdown from '../../../../components/UI/FilterDropDown/FilterDropDown';

interface EstimateListFiltersProps {
    isVisible: boolean;
    onClose: () => void;
    onReset: () => void;
    filters: {
        parties: string[];
        creators: string[];
    };
    setFilters: (filters: EstimateListFiltersProps['filters']) => void;
    options: {
        parties: string[];
        creators: string[];
    };
}

const EstimateListFilters: React.FC<EstimateListFiltersProps> = ({
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
        </FilterBar>
    );
};

export default EstimateListFilters;
