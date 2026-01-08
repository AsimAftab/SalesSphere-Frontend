import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import TourPlanDetailContent from './TourPlanDetailContent';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import TourPlanFormModal from '../../components/modals/TourPlanFormModal';
import ErrorBoundary from '../../components/UI/ErrorBoundary';
import { useTourPlanDetail } from './useTourPlanDetail';
import toast from 'react-hot-toast';

const TourPlanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, state, actions, permissions } = useTourPlanDetail(id);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  /**
   * Business Logic: Only allow editing if the status is 'pending'
   */
  const handleEditClick = () => {
    const currentStatus = data.tourPlan?.status;

    if (currentStatus !== 'pending') {
      toast.error(`Cannot edit a tour plan that is already ${currentStatus?.toUpperCase()}`);
      return;
    }

    setIsEditModalOpen(true);
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
          onDelete={() => setIsDeleteModalOpen(true)}
          permissions={permissions}
        />
      </ErrorBoundary>

      {/* Edit Modal */}
      <TourPlanFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={data.tourPlan}
        onSave={async (formData) => {
          await actions.update(formData);
          setIsEditModalOpen(false);
        }}
        isSaving={state.isSaving}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Cancel Tour Plan"
        message="Are you sure you want to remove this tour plan from the schedule? This action cannot be undone."
        onConfirm={async () => {
          await actions.delete();
          setIsDeleteModalOpen(false);
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmButtonText={state.isDeleting ? "Deleting..." : "Confirm Delete"}
        confirmButtonVariant="danger"
      />
    </Sidebar>
  );
};

export default TourPlanDetailPage;