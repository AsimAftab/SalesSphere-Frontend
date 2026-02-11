import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { type TabCommonProps } from '../tabs.config';
import { useEmployeeOrders } from '../hooks/useEmployeeOrders';
import { useStatusModal } from '../hooks/useStatusModal';
import EmployeeOrdersTable from './components/EmployeeOrdersTable';
import EmployeeOrdersMobileList from './components/EmployeeOrdersMobileList';
import StatusUpdateModal from '@/components/modals/CommonModals/StatusUpdateModal';
import ordersIcon from '@/assets/images/icons/orders-icon.svg';
import { Pagination, EmptyState, TableSkeleton, MobileCardSkeleton, SearchBar } from '@/components/ui';

const OrdersTab: React.FC<TabCommonProps> = ({ employee }) => {
    const [searchQuery, setSearchQuery] = React.useState('');

    // 1. Data Logic
    const {
        orders,
        totalOrders,
        currentPage,
        itemsPerPage,
        setCurrentPage,
        isLoading,
        error,
        updateStatus,
        isUpdating
    } = useEmployeeOrders(employee?._id, searchQuery);

    // 2. UI Logic (Modal)
    const {
        isOpen,
        editingOrder,
        orderStatusOptions,
        openModal,
        closeModal,
        handleSave
    } = useStatusModal({ updateStatus: async (id, status) => { await updateStatus(id, status); } });

    // Inlined Header Component JSX
    const headerJSX = (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
                <Link to="/employees" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">
                    {employee?.name || 'Employee'} - Orders List
                </h1>
            </div>

            <div className="w-full sm:w-auto p-1">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by Party Name or Invoice Number"
                    className="w-full sm:w-80"
                />
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex flex-col h-full py-4 md:py-6 space-y-4">
                {headerJSX}
                <div className="relative w-full space-y-4">
                    {/* Orders Table - Desktop */}
                    <TableSkeleton
                        rows={10}
                        columns={[
                            { width: 100 },
                            { width: 120 },
                            { width: 180 },
                            { width: 80 },
                            { width: 120 },
                            { width: 100 },
                            { width: 80 },
                        ]}
                    />

                    {/* Mobile Card Skeleton */}
                    <MobileCardSkeleton
                        cards={5}
                        showOnlyMobile={true}
                        config={{
                            detailRows: 4
                        }}
                    />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col h-full py-4 md:py-6 space-y-4">
                {headerJSX}
                <EmptyState
                    title="Error Loading Orders"
                    description={error || "Something went wrong while fetching orders"}
                    icon={<div className="text-red-500 text-4xl">⚠️</div>}
                />
            </div>
        );
    }

    if (totalOrders === 0) {
        return (
            <div className="flex flex-col h-full py-4 md:py-6 space-y-4">
                {headerJSX}
                <EmptyState
                    title="No Orders Found"
                    description={searchQuery ? "No orders match your search criteria" : `No orders found for ${employee?.name}`}
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

    return (
        <div className="flex flex-col h-full py-4 md:py-6 space-y-4 overflow-y-auto">
            {headerJSX}

            {/* Logic: Status Update Modal */}
            <StatusUpdateModal
                isOpen={isOpen}
                onClose={closeModal}
                onSave={handleSave}
                currentValue={editingOrder?.status || 'pending'}
                entityIdValue={editingOrder?.invoiceNumber || ''}
                entityIdLabel="Order ID"
                title="Update Order Status"
                options={orderStatusOptions}
                isSaving={isUpdating}
            />

            <div className="relative w-full space-y-4">
                {/* Desktop View */}
                <EmployeeOrdersTable
                    orders={orders}
                    startIndex={(currentPage - 1) * itemsPerPage}
                    onStatusClick={openModal}
                    canUpdateStatus={true}
                    employeeName={employee?.name}
                />

                {/* Mobile View */}
                <EmployeeOrdersMobileList
                    orders={orders}
                    onStatusClick={openModal}
                    canUpdateStatus={true}
                    employeeName={employee?.name}
                />

                <Pagination
                    currentPage={currentPage}
                    totalItems={totalOrders}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    className="w-full"
                />
            </div>
        </div>
    );
};

export default OrdersTab;
