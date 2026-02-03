import React, { useMemo } from 'react';
import { Button, SearchBar, DropDown } from '@/components/ui';
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
        <div className="w-full flex flex-col gap-0 mb-8 px-1">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="text-left shrink-0">
                    <h1 className="text-2xl sm:text-3xl font-black text-[#202224]">
                        Newsletter Subscribers
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Manage newsletter subscriptions and send campaigns
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto lg:flex-1 lg:justify-end">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search by email"
                        className="w-full lg:w-72 xl:w-80"
                    />

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <DropDown
                            value={filterValue}
                            onChange={handleFilterChange}
                            options={STATUS_OPTIONS}
                            className="w-40"
                            triggerClassName="!min-h-10 !py-2"
                        />

                        <Button
                            className="w-full sm:w-auto whitespace-nowrap text-sm px-4 h-10 flex-shrink-0"
                            onClick={onSendClick}
                        >
                            Send Newsletter
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsletterHeader;
