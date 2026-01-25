import React, { useState } from 'react';
import PartyOrdersTable from './PartyOrdersTable';
import Pagination from '../../../../../components/UI/Page/Pagination';
import { EmptyState } from '../../../../../components/UI/EmptyState/EmptyState';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import type { Order } from '../../types';
import { PartyOrdersMobileList } from './PartyOrdersMobileList';

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
                description={`No orders found for ${partyName}.`}
                icon={
                    <div className="p-4 bg-blue-50 rounded-full mb-4">
                        <ShoppingBagIcon className="w-8 h-8 text-blue-500" />
                    </div>
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
