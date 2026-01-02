import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  getExpenseById, 
  deleteExpense, 
  getExpenseCategories,
  updateExpense,
  deleteExpenseReceipt 
} from '../../api/expensesService';
import { getParties } from "../../api/partyService";

export const useExpenseDetail = (id: string | undefined) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- Data Fetching ---
  const expenseQuery = useQuery({
    queryKey: ['expense', id],
    queryFn: () => getExpenseById(id!),
    enabled: !!id,
  });

  const categoriesQuery = useQuery({
    queryKey: ["expense-categories"],
    queryFn: getExpenseCategories,
  });

  const partiesQuery = useQuery({
    queryKey: ["parties-list"],
    queryFn: getParties,
  });

  // --- Mutations ---
  const deleteMutation = useMutation({
    mutationFn: () => deleteExpense(id!), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success("Expense Deleted Sucessfully");
      navigate('/expenses'); 
    },
    onError: () => toast.error("Failed to delete record")
  });

  const updateMutation = useMutation({
    mutationFn: ({ data, file }: { data: any; file: File | null }) => updateExpense(id!, data, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense', id] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success("Expense Detail Updated Sucessfully");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Sync failed")
  });

  const removeReceiptMutation = useMutation({
    mutationFn: () => deleteExpenseReceipt(id!),
    onSuccess: (updatedExpense) => {
      queryClient.setQueryData(['expense', id], updatedExpense);
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success("Receipt image removed");
    },
    onError: () => toast.error("Failed to remove attachment")
  });

  return {
    data: {
      expense: expenseQuery.data,
      categories: categoriesQuery.data || [],
      parties: partiesQuery.data || [],
    },
    state: {
      isLoading: expenseQuery.isLoading,
      error: expenseQuery.error ? (expenseQuery.error as Error).message : null,
      isSaving: updateMutation.isPending,
      isDeleting: deleteMutation.isPending,
      isRemovingReceipt: removeReceiptMutation.isPending,
    },
    actions: {
      update: updateMutation.mutateAsync,
      delete: deleteMutation.mutate,
      removeReceipt: removeReceiptMutation.mutate,
    }
  };
};