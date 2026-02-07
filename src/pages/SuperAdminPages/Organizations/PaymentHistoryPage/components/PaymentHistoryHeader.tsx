import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import { SearchBar, Button } from '@/components/ui';

interface PaymentHistoryHeaderProps {
    organizationId: string;
    organizationName: string;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    isFilterVisible: boolean;
    onFilterToggle: () => void;
    onAddPayment: () => void;
}

export const PaymentHistoryHeader: React.FC<PaymentHistoryHeaderProps> = ({
    organizationId,
    organizationName,
    searchTerm,
    onSearchChange,
    isFilterVisible,
    onFilterToggle,
    onAddPayment,
}) => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 px-1 mb-6">
            {/* Left: Back Arrow + Title */}
            <div className="flex items-start gap-2">
                <Link
                    to={`/system-admin/organizations/${organizationId}`}
                    className="p-1.5 mt-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#202224]">
                        Payment History
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500">{organizationName}</p>
                </div>
            </div>

            {/* Right: Search, Filter, Create Button */}
            <div className="flex items-center gap-2 sm:gap-3">
                <SearchBar
                    value={searchTerm}
                    onChange={onSearchChange}
                    placeholder="Search by received by..."
                />
                <button
                    onClick={onFilterToggle}
                    className={`p-2 sm:p-2.5 rounded-lg border transition-colors shrink-0 ${
                        isFilterVisible
                            ? 'bg-secondary text-white border-secondary shadow-md'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                    aria-label="Toggle filters"
                >
                    <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <Button
                    onClick={onAddPayment}
                    className="h-9 sm:h-10 px-4 sm:px-6 text-sm tracking-wider"
                >
                    Add Payment
                </Button>
            </div>
        </div>
    );
};

export default PaymentHistoryHeader;
