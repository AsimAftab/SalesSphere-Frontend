import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import TourPlanDetailContent from './TourPlanDetailContent';
import ConfirmationModal from '@/components/modals/CommonModals/ConfirmationModal';
import TourPlanFormModal from '@/components/modals/TourPlan/TourPlanModal';
import StatusUpdateModal from '@/components/modals/CommonModals/StatusUpdateModal';
import { useTourPlanDetail } from './useTourPlanDetail';
import type { TourStatus } from '@/api/tourPlanService';
import toast from 'react-hot-toast';
import { ErrorBoundary } from '@/components/ui';

const TourPlanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, state, actions, permissions } = useTourPlanDetail(id);

  /**
   * Business Logic: Only allow editing if the status is 'pending'
   */
  const handleEditClick = () => {
    const currentStatus = data.tourPlan?.status;

    if (currentStatus !== 'pending') {
      toast.error(`Cannot edit a tour plan that is already ${currentStatus?.toUpperCase()}`);
      return;
    }

    actions.openEditModal();
  };

  return (
    <Sidebar>
      <ErrorBoundary>
        <TourPlanDetailContent
          tourPlan={data.tourPlan || null}
          loading={state.isLoading}
          error={state.error}
          onBack={() => navigate(-1)}
          onEdit={handleEditClick}
          onDelete={actions.openDeleteModal}
          permissions={permissions}
          onStatusUpdate={actions.openStatusModal}
        />
      </ErrorBoundary>

      {/* Edit Modal */}
      <TourPlanFormModal
        isOpen={state.activeModal === 'edit'}
        onClose={actions.closeModal}
        initialData={data.tourPlan}
        onSave={async (formData) => {
          await actions.update(formData);
          actions.closeModal();
        }}
        isSaving={state.isSaving}
      />

      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={state.activeModal === 'status'}
        onClose={actions.closeModal}
        onSave={async (newStatus) => {
          await actions.updateStatus({ status: newStatus as TourStatus });
          actions.closeModal();
        }}
        isSaving={state.isSaving}
        currentValue={data.tourPlan?.status || ""}
        entityIdValue={data.tourPlan?.createdBy?.name || "Unknown"}
        entityIdLabel="Employee"
        options={[
          { value: "pending", label: "Pending", colorClass: "blue" },
          { value: "approved", label: "Approved", colorClass: "green" },
          { value: "rejected", label: "Rejected", colorClass: "red" },
        ]}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={state.activeModal === 'delete'}
        title="Cancel Tour Plan"
        message="Are you sure you want to remove this tour plan from the schedule? This action cannot be undone."
        onConfirm={async () => {
          await actions.delete();
          actions.closeModal();
        }}
        onCancel={actions.closeModal}
        confirmButtonText={state.isDeleting ? "Deleting..." : "Confirm Delete"}
        confirmButtonVariant="danger"
      />
    </Sidebar>
  );
};

export default TourPlanDetailPage;