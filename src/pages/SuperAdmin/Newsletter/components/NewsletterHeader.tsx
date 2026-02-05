import React, { useMemo } from 'react';
import { PageHeader, DropDown } from '@/components/ui';
import type { DropDownOption } from '@/components/ui';

interface NewsletterHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filterActive: boolean | null;
    setFilterActive: (value: boolean | null) => void;
    onSendClick: () => void;
}

const STATUS_OPTIONS: DropDownOption[] = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'unsubscribed', label: 'Unsubscribed' }
];

const NewsletterHeader: React.FC<NewsletterHeaderProps> = ({
    searchQuery,
    setSearchQuery,
    filterActive,
    setFilterActive,
    onSendClick
}) => {
    const filterValue = useMemo(() => {
        if (filterActive === null) return 'all';
        return filterActive ? 'active' : 'unsubscribed';
    }, [filterActive]);

    const handleFilterChange = (value: string) => {
        if (value === 'all') {
            setFilterActive(null);
        } else {
            setFilterActive(value === 'active');
        }
    };

    return (
        <PageHeader
            title="Newsletter Subscribers"
            subtitle="Manage subscribers"
            searchTerm={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by email"
            showFilter={false}
            createButtonLabel="Send Newsletter"
            onCreate={onSendClick}
            permissions={{
                canExportPdf: false,
                canExportExcel: false,
            }}
            customActions={
                <DropDown
                    value={filterValue}
                    onChange={handleFilterChange}
                    options={STATUS_OPTIONS}
                    className="w-40"
                    triggerClassName="!min-h-10 !py-2"
                />
            }
        />
    );
};

export default NewsletterHeader;
