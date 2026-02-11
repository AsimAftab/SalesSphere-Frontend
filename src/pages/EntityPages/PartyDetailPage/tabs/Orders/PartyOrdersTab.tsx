import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PartyOrdersTable from './PartyOrdersTable';
import ordersIcon from '@/assets/images/icons/orders-icon.svg';
import type { Order } from '@/api/orderService';
import { PartyOrdersMobileList } from './PartyOrdersMobileList';
import { Pagination, EmptyState } from '@/components/ui';

interface PartyOrdersTabProps {
    orders: Order[];
    partyName: string;
    partyId: string;
}

export const PartyOrdersTab: React.FC<PartyOrdersTabProps> = ({ orders, partyName, partyId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalOrders = orders.length;

    // Header Component
    const TabHeader = () => (
        <div className="flex items-center gap-4 mb-6">
            <Link to="/parties" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
                {partyName || 'Party'} - Orders List
            </h1>
        </div>
    );

    // Empty State Check
    if (totalOrders === 0) {
        return (
            <div className="flex flex-col h-full py-4 md:py-6 space-y-4">
                <TabHeader />
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
    const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="flex flex-col h-full py-4 md:py-6 space-y-4 overflow-y-auto">
            <TabHeader />
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
