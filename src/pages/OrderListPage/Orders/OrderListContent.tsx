import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import StatusUpdateModal from '@/components/modals/CommonModals/StatusUpdateModal';
import { OrderExportService } from './components/OrderExportService';
import useOrderManager from './useOrderManager';
import type { Order, InvoiceStatus } from '@/api/orderService';

// --- SOLID Components ---
import OrderListHeader from './components/OrderListHeader';
import OrderListFilters from './components/OrderListFilters';
import OrderListTable from './components/OrderListTable';
import OrderListMobile from './components/OrderListMobile';
import OrderListSkeleton from './components/OrderListSkeleton';
import { Pagination, EmptyState } from '@/components/ui';


interface OrderListContentProps {
  state: ReturnType<typeof useOrderManager>['state'];
  actions: ReturnType<typeof useOrderManager>['actions'];
  permissions?: {
    canCreate?: boolean;
    canUpdateStatus?: boolean;
    canExportPdf?: boolean;
  };
  currentUserId?: string;
  currentUserRole?: string;
}

// ✅ Define Status Options for the Generic Modal
const orderStatusOptions = [
  { value: 'pending', label: 'Pending', colorClass: 'blue' },
  { value: 'in progress', label: 'In Progress', colorClass: 'violet' },
  { value: 'in transit', label: 'In Transit', colorClass: 'orange' },
  { value: 'completed', label: 'Completed', colorClass: 'green' },
  { value: 'rejected', label: 'Rejected', colorClass: 'red' },
];

const containerVariants = { hidden: { opacity: 1 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const OrderListContent: React.FC<OrderListContentProps> = ({ state, actions, permissions, currentUserId, currentUserRole }) => {
  const navigate = useNavigate();

  const {
    orders, allOrders, isLoading, error, currentPage, searchTerm,
    isFilterVisible, filters, editingOrder, isUpdatingStatus,
    options, totalItems
  } = state;

  const {
    setCurrentPage, setSearchTerm, setIsFilterVisible,
    setFilters, setEditingOrder, onResetFilters, updateStatus
  } = actions;

  const handleExportPdf = async () => {
    if (!orders || orders.length === 0) {
      toast.error("No orders found to export");
      return;
    }
    try {
      await OrderExportService.toPdf(orders);
    } catch {
      toast.error("Failed to open PDF");
    }
  };

  const currentOrders = orders?.slice((currentPage - 1) * 10, currentPage * 10) || [];

  const handleStatusClick = (order: Order) => {
    // Security Check: Self-Approval Policy
    const creatorId = order.createdBy?.id || order.createdBy?._id;
    const isAdmin = currentUserRole === 'admin' || currentUserRole === 'superadmin';

    if (!isAdmin && currentUserId && creatorId && (currentUserId.toString() === creatorId.toString())) {
      toast.error("Security Policy: You cannot update the status of orders you created.");
      return;
    }
    setEditingOrder(order);
  };

  // Show skeleton when loading and no raw data yet (allOrders is undefined)
  if (isLoading && !allOrders) return (
    <OrderListSkeleton canCreate={permissions?.canCreate} canExportPdf={permissions?.canExportPdf} />
  );
  if (error && !allOrders) return <EmptyState title="Error" description={error} variant="error" />;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex-1 flex flex-col">
      <StatusUpdateModal
        isOpen={!!editingOrder}
        onClose={() => setEditingOrder(null)}
        onSave={(s) => editingOrder && updateStatus(editingOrder.id || editingOrder._id, s as InvoiceStatus)}
        currentValue={editingOrder?.status || 'pending'}
        entityIdValue={editingOrder?.invoiceNumber || ''}
        entityIdLabel="Order ID"
        title="Update Order Status"
        options={orderStatusOptions}
        isSaving={isUpdatingStatus}
      />

      <OrderListHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isFilterVisible={isFilterVisible}
        onToggleFilters={() => setIsFilterVisible(!isFilterVisible)}
        onExportPdf={handleExportPdf}
        onCreateOrder={() => navigate('/sales/create?type=order')}
        canCreate={permissions?.canCreate}
        canExportPdf={permissions?.canExportPdf}
      />

      <OrderListFilters
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onReset={onResetFilters}
        filters={filters}
        setFilters={setFilters}
        options={options}
      />

      {/* Content Area */}
      <motion.div variants={itemVariants} className="relative w-full">
        {isUpdatingStatus && (<div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10"><Loader2 className="animate-spin text-blue-500 h-8 w-8" /></div>)}

        {(currentOrders.length > 0) ? (
          <>
            <OrderListTable
              orders={currentOrders}
              startIndex={(currentPage - 1) * 10}
              onStatusClick={handleStatusClick}
              canUpdateStatus={permissions?.canUpdateStatus}
            />
            <OrderListMobile
              orders={currentOrders}
              onStatusClick={handleStatusClick}
              canUpdateStatus={permissions?.canUpdateStatus}
            />
          </>
        ) : (
          <EmptyState
            title="No Orders Found"
            description={searchTerm || filters.status.length > 0 || filters.month.length > 0
              ? "No orders match your current filters. Try adjusting your search criteria."
              : "No orders have been created yet. Create your first order to get started."}
            icon={
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
        )}

        {/* Pagination Section */}
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={10}
          onPageChange={setCurrentPage}
        />
      </motion.div>
    </motion.div>
  );
};

OrderListContent.displayName = 'OrderListContent';

export default OrderListContent;