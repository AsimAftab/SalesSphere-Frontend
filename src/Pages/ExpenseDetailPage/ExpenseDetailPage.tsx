import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import ExpenseDetailContent from './ExpenseDetailContent';
import ExpenseFormModal from '../../components/modals/ExpenseFormModal';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { useExpenseDetail } from './useExpenseDetail';

const ExpenseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Custom hook handles all the heavy lifting
  const { data, state, actions, permissions } = useExpenseDetail(id);

  // --- UI State (Only Modals) ---
  const [activeModal, setActiveModal] = useState<'edit' | 'delete' | null>(null);

  const handleUpdate = async (formData: any, file: File | null) => {
    const payload = { ...formData, isReceiptDeleted: !file && !formData.receipt };
    await actions.update({ data: payload, file });
    setActiveModal(null);
  };

  return (
    <Sidebar>
      <ExpenseDetailContent
        expense={data.expense || null}
        loading={state.isLoading}
        error={state.error}
        onBack={() => navigate(-1)}
        onEdit={() => setActiveModal('edit')}
        onDelete={() => setActiveModal('delete')}
        onDeleteReceipt={() => actions.removeReceipt()}
        permissions={permissions}
      />

      <ExpenseFormModal
        isOpen={activeModal === 'edit'}
        onClose={() => setActiveModal(null)}
        initialData={data.expense}
        categories={data.categories}
        parties={data.parties}
        isSaving={state.isSaving}
        isDeletingReceipt={state.isRemovingReceipt}
        onDeleteReceipt={async () => {
          await actions.removeReceipt();
        }}
        onSave={handleUpdate}
      />

      <ConfirmationModal
        isOpen={activeModal === 'delete'}
        title="Delete Record"
        message="Are you sure? This action is permanent and will be logged in the audit trail."
        onConfirm={actions.delete}
        onCancel={() => setActiveModal(null)}
        confirmButtonText={state.isDeleting ? "Deleting..." : "Delete Expense"}
        confirmButtonVariant="danger"
      />
    </Sidebar>
  );
};

export default ExpenseDetailPage;