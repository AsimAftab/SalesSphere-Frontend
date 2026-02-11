import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PartyOrdersTable from './PartyOrdersTable';
import ordersIcon from '@/assets/images/icons/orders-icon.svg';
import type { Order } from '@/api/orderService';
import { PartyOrdersMobileList } from './PartyOrdersMobileList';
import { Pagination, EmptyState, SearchBar } from '@/components/ui';

interface PartyOrdersTabProps {
    orders: Order[];
    partyName: string;
    partyId: string;
}

export const PartyOrdersTab: React.FC<PartyOrdersTabProps> = ({ orders, partyName, partyId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 10;

    const filteredOrders = React.useMemo(() => {
        if (!searchQuery) return orders;
        const lowerQuery = searchQuery.toLowerCase();
        return orders.filter(order =>
            order.invoiceNumber.toLowerCase().includes(lowerQuery) ||
            order.status.toLowerCase().includes(lowerQuery)
        );
    }, [orders, searchQuery]);

    const totalOrders = filteredOrders.length;

    // Inlined Header Component JSX
    const headerJSX = (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
                <Link to="/parties" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">
                    {partyName || 'Party'} - Orders List
                </h1>
            </div>

            <div className="w-full sm:w-auto p-1">
                <SearchBar
                    value={searchQuery}
                    onChange={(val) => {
                        setSearchQuery(val);
                        setCurrentPage(1);
                    }}
                    placeholder="Search by Invoice Number or Status"
                    className="w-full sm:w-80"
                />
            </div>
        </div>
    );

    // Empty State Check
    if (totalOrders === 0) {
        return (
            <div className="flex flex-col h-full py-4 md:py-6 space-y-4">
                {headerJSX}
                <EmptyState
                    title="No Orders Found"
                    description={`No orders have been placed for ${partyName} yet.`}
                    icon={
                        <img
                            src={ordersIcon}
                            alt="No Orders"
                            className="w-12 h-12"
                        />
                    }
                />
            </div>
        );
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="flex flex-col h-full py-4 md:py-6 space-y-4 overflow-y-auto">
            {headerJSX}
            <div className="relative w-full space-y-4">
                {/* Orders Table - Desktop */}
                <PartyOrdersTable orders={currentOrders} startIndex={startIndex} partyId={partyId} />

                {/* Mobile List View */}
                <PartyOrdersMobileList orders={currentOrders} partyId={partyId} />

                {totalOrders > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalOrders}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        className="w-full"
                    />
                )}
            </div>
        </div>
    );
};
