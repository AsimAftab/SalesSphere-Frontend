import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import ExpenseDetailContent from './ExpenseDetailContent';
import ExpenseFormModal from '../../components/modals/ExpenseFormModal';
import ConfirmationModal from '../../components/modals/ConfirmationModal';

// Repository Methods
import { 
  getExpenseById, 
  deleteExpense, // Restored single delete
  getExpenseCategories,
  updateExpense 
} from '../../api/expensesService';
import { getParties } from "../../api/partyService";
import toast from 'react-hot-toast';

const ExpenseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- UI State ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);



  // --- 1. Data Fetching ---
  const { data: expense, isLoading, error } = useQuery({
    queryKey: ['expense', id],
    queryFn: () => getExpenseById(id!),
    enabled: !!id,
  });

  const { data: categories } = useQuery({
    queryKey: ["expense-categories"],
    queryFn: getExpenseCategories,
  });

  const { data: parties } = useQuery({
    queryKey: ["parties-list"],
    queryFn: getParties,
  });

  // --- 2. Mutations ---

  /**
   * Logic: Restored specialized single delete targeting the DETAIL endpoint.
   */
  const deleteMutation = useMutation({
    mutationFn: () => deleteExpense(id!), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success("Audit record purged successfully");
      navigate('/expenses'); 
    },
    onError: () => toast.error("Failed to delete record")
  });

  const updateMutation = useMutation({
    mutationFn: async ({ data, file }: { data: any; file: File | null }) => {
      return updateExpense(id!, data, file); 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense', id] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success("Audit record synchronized");
      setIsEditModalOpen(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Sync failed")
  });

  return (
    <Sidebar>
      <ExpenseDetailContent 
        expense={expense || null} 
        loading={isLoading} 
        error={error ? (error as Error).message : null} 
        onBack={() => navigate(-1)}
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={() => setIsDeleteModalOpen(true)}
      />

      {/* Triggered by onEdit in Content component */}
      <ExpenseFormModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={expense} 
        categories={categories || []}
        parties={parties || []}
        isSaving={updateMutation.isPending}
        onSave={async (formData, file) => {
          const payload = { ...formData, isReceiptDeleted: !file && !formData.receipt };
          await updateMutation.mutateAsync({ data: payload, file });
        }}
      />

      {/* Triggered by onDelete in Content component */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Record"
        message="Are you sure? This action is permanent and will be logged in the audit trail."
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmButtonText={deleteMutation.isPending ? "Purging..." : "Delete Record"}
        confirmButtonVariant="danger"
      />
    </Sidebar>
  );
};

export default ExpenseDetailPage;