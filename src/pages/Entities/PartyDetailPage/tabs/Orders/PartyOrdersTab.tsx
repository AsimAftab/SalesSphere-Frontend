import React, { useState } from 'react';
import PartyOrdersTable from './PartyOrdersTable';
import ordersIcon from '@/assets/images/icons/orders-icon.svg';
import type { Order } from '../../types';
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

    // Empty State Check
    if (totalOrders === 0) {
        return (
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
        );
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="flex flex-col h-full space-y-4">
            <h2 className="text-xl font-bold text-gray-800 px-1">{partyName}</h2>
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
