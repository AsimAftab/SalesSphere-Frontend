import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import ExpenseDetailContent from './ExpenseDetailContent';
import ExpenseFormModal from '../../components/modals/Expenses';
import ConfirmationModal from '../../components/modals/CommonModals/ConfirmationModal';
import ErrorBoundary from '../../components/ui/ErrorBoundary/ErrorBoundary';
import { useExpenseDetail } from './useExpenseDetail';

const ExpenseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Custom hook handles all the heavy lifting
  const { data, state, actions, permissions } = useExpenseDetail(id);

  return (
    <Sidebar>
      <ErrorBoundary>
        <ExpenseDetailContent
          data={data}
          state={state}
          actions={actions}
          permissions={permissions}
          onBack={() => navigate(-1)}
        />
      </ErrorBoundary>

      <ExpenseFormModal
        isOpen={state.activeModal === 'edit'}
        onClose={actions.closeModal}
        initialData={data.expense}
        categories={data.categories}
        parties={data.parties}
        isSaving={state.isSaving}
        isDeletingReceipt={state.isRemovingReceipt}
        onDeleteReceipt={async () => { await actions.removeReceipt(); }}
        onSave={async (d, f) => { await actions.update(d, f); }}
      />

      <ConfirmationModal
        isOpen={state.activeModal === 'delete'}
        title="Delete Record"
        message="Are you sure? This action is permanent and will be logged in the audit trail."
        onConfirm={actions.delete}
        onCancel={actions.closeModal}
        confirmButtonText={state.isDeleting ? "Deleting..." : "Delete Expense"}
        confirmButtonVariant="danger"
      />
    </Sidebar>
  );
};

export default ExpenseDetailPage;