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
import { Pagination, EmptyState, TableSkeleton, MobileCardSkeleton } from '@/components/ui';

const OrdersTab: React.FC<TabCommonProps> = ({ employee }) => {
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
    } = useEmployeeOrders(employee?._id);

    // 2. UI Logic (Modal)
    const {
        isOpen,
        editingOrder,
        orderStatusOptions,
        openModal,
        closeModal,
        handleSave
    } = useStatusModal({ updateStatus: async (id, status) => { await updateStatus(id, status); } });

    // Header Component
    const TabHeader = () => (
        <div className="flex items-center gap-4 mb-6">
            <Link to="/employees" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
                {employee?.name || 'Employee'} - Orders List
            </h1>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex flex-col h-full py-4 md:py-6 space-y-4">
                <TabHeader />
                <div className="relative w-full space-y-4">
                    {/* Desktop Table Skeleton */}
                    <TableSkeleton
                        rows={10}
                        columns={[
                            { width: 100, type: 'text' },  // Invoice
                            { width: 120, type: 'text' },  // Date
                            { width: 100, type: 'text' },  // Party
                            { width: 80, type: 'text' },   // Amount
                            { width: 70, type: 'badge' },  // Status
                        ]}
                        showSerialNumber={true}
                        showCheckbox={false}
                        hideOnMobile={true}
                    />

                    {/* Mobile Card Skeleton */}
                    <MobileCardSkeleton
                        cards={4}
                        config={{
                            showCheckbox: false,
                            showAvatar: false,
                            detailRows: 2,
                            detailColumns: 2,
                            showAction: true,
                            actionCount: 1,
                            showBadge: true,
                            badgeCount: 1,
                        }}
                        showOnlyMobile={true}
                    />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col h-full py-4 md:py-6 space-y-4">
                <TabHeader />
                <div className="text-red-500 bg-red-50 p-4 rounded-lg">Error loading orders: {error}</div>
            </div>
        );
    }

    if (totalOrders === 0) {
        return (
            <div className="flex flex-col h-full py-4 md:py-6 space-y-4">
                <TabHeader />
                <EmptyState
                    title="No Orders Found"
                    description={`${employee?.name || 'Employee'} has not created any orders yet.`}
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
            <TabHeader />

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
