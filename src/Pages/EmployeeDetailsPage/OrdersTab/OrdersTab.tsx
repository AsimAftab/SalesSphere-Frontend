import React from 'react';
import { type TabCommonProps } from '../tabs.config';
import { useEmployeeOrders } from '../hooks/useEmployeeOrders';
import { useStatusModal } from '../hooks/useStatusModal';
import EmployeeOrdersTable from './components/EmployeeOrdersTable';
import EmployeeOrdersMobileList from './components/EmployeeOrdersMobileList';
import Pagination from '../../../components/UI/Page/Pagination';
import StatusUpdateModal from '../../../components/modals/StatusUpdateModal';
import Skeleton from 'react-loading-skeleton';
import { EmptyState } from '../../../components/UI/EmptyState/EmptyState';

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
    } = useStatusModal({ updateStatus });

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <Skeleton count={5} height={40} className="mb-4" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 bg-red-50 p-4 rounded-lg">Error loading orders: {error}</div>;
    }

    if (totalOrders === 0) {
        return (
            <EmptyState
                title="No Orders Found"
                description={`${employee?.name || 'Employee'} has not created any orders yet.`}
                icon={
                    <div className="p-4 bg-blue-50 rounded-full mb-4">
                        <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                }
            />
        );
    }

    return (
        <div className="flex flex-col h-full py-4 md:py-6 space-y-4 overflow-y-auto md:overflow-hidden min-h-0 scrollbar-hide">

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
