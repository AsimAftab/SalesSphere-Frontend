import React from 'react';
import { PageHeader } from '@/components/ui';

interface OrderListHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    isFilterVisible: boolean;
    onToggleFilters: () => void;
    onExportPdf: () => void;
    onCreateOrder: () => void;
    canCreate?: boolean;
    canExportPdf?: boolean;
}

const OrderListHeader: React.FC<OrderListHeaderProps> = ({
    searchTerm,
    onSearchChange,
    isFilterVisible,
    onToggleFilters,
    onExportPdf,
    onCreateOrder,
    canCreate = true,
    canExportPdf = true
}) => {
    return (
        <PageHeader
            title="Order List"
            subtitle="Manage and track all customer orders"
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            searchPlaceholder="Search By Invoice Number or Party"
            isFilterVisible={isFilterVisible}
            onFilterToggle={onToggleFilters}
            showFilter={true}
            onExportPdf={onExportPdf}
            onCreate={onCreateOrder}
            createButtonLabel="Create Order"
            permissions={{
                canCreate,
                canExportPdf
            }}
        />
    );
};

export default OrderListHeader;
