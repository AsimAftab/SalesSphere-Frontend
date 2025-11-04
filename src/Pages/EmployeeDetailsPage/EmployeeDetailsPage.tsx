// Make sure useEffect is imported
import React, { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import EmployeeDetailsContent from './EmployeeDetailsContent';
import EditEmployeeModal from '../../components/modals/EditEmployeeModal';
import ConfirmationModal from '../../components/modals/DeleteEntityModal';
import {
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    type Employee,
} from '../../api/employeeService';
import toast from 'react-hot-toast';

const EmployeeDetailsPage: React.FC = () => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient(); 

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    // --- ADDED: useQuery for Data Fetching ---
    const {
        data: employee,
        isLoading: isQueryLoading,
        error: queryError,
        isError, // FIX 1: Get the 'isError' boolean
    } = useQuery<Employee, Error>({ // This generic typing is correct
        // 1. Query Key: Uniquely identifies this query.
        queryKey: ['employee', employeeId],
        
        // 2. Query Function: The async function to fetch data.
        queryFn: async () => {
            if (!employeeId) {
                throw new Error("Employee ID is missing.");
            }
            return getEmployeeById(employeeId);
        },
        
        // 3. Options:
        enabled: !!employeeId, // Only run the query if employeeId exists

        // FIX 2: 'onError' is NOT a valid option in useQuery v5. Remove this block.
        // onError: (err: Error) => { ... },
    });

    // FIX 3: Add this useEffect to handle the error toast
    useEffect(() => {
        if (isError && queryError) {
            const errorMessage =
                queryError instanceof Error ? queryError.message : 'Failed to load employee details.';
            toast.error(`Failed to load employee: ${errorMessage}`);
        }
    }, [isError, queryError]); // This effect runs when the error state changes


    // --- ADDED: useMutation for Updating Employee ---
    // (This syntax is correct for v5)
    const updateMutation = useMutation({
        mutationFn: ({ userId, formData }: { userId: string, formData: FormData }) =>
            updateEmployee(userId, formData),
        onSuccess: (_updatedEmployee) => {
            queryClient.invalidateQueries({ queryKey: ['employee', employeeId] });
            toast.success('Employee updated successfully!');
            setIsEditOpen(false);
        },
        onError: (err: unknown) => {
            toast.error(
                err instanceof Error ? err.message : 'Failed to update employee.'
            );
        },
    });

    // --- ADDED: useMutation for Deleting Employee ---
    // (This syntax is correct for v5)
    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteEmployee(id),
        onSuccess: () => {
            setIsDeleteConfirmOpen(false);
            toast.success('Employee deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            navigate('/employees'); 
        },
        onError: (err: Error) => {
            toast.error(err.message);
            setIsDeleteConfirmOpen(false);
        },
    });

    // --- Modal Handlers ---
    const handleOpenEditModal = () => setIsEditOpen(true);
    const handleCloseEditModal = () => setIsEditOpen(false);

    const handleSaveEdit = async (userId: string, formData: FormData) => {
        if (!userId) return;
        updateMutation.mutate({ userId, formData }); 
    };

    const handleDeleteEmployee = () => setIsDeleteConfirmOpen(true);
    const cancelDelete = () => setIsDeleteConfirmOpen(false);

    const confirmDelete = async () => {
        // By fixing the useQuery, 'employee' will now be correctly typed
        if (!employee?._id) return;
        deleteMutation.mutate(employee._id); 
    };

    // --- Prepare props for content component ---
    
    // This was already correct: .isPending for mutations, .isLoading for query
    const isLoading = isQueryLoading || updateMutation.isPending || deleteMutation.isPending;
    
    // This will now be correctly typed
    const errorString = queryError instanceof Error ? queryError.message : null;

    return (
        <Sidebar>
            <EmployeeDetailsContent
                employee={employee || null} // Typo 'mployee' was also fixed here
                loading={isLoading} 
                error={errorString} 
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteEmployee}
            />

            {/* All these errors about '[]' and '_id' will disappear
                because 'employee' will now be correctly typed as 'Employee | undefined' */}
            {employee && (
                <EditEmployeeModal
                    isOpen={isEditOpen}
                    onClose={handleCloseEditModal}
                    initialData={employee}
                    onSave={handleSaveEdit}
                />
            )}

            {employee && (
                <ConfirmationModal
                    isOpen={isDeleteConfirmOpen}
                    title="Confirm Deletion"
                    message={`Are you sure you want to delete "${employee.name}"? This action cannot be undone.`}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                    confirmButtonText="Delete"
                    confirmButtonVariant="danger"
                />
            )}
        </Sidebar>
    );
};

export default EmployeeDetailsPage;