import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import toast from 'react-hot-toast'; // IMPORT TOAST

const EmployeeDetailsPage: React.FC = () => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const fetchEmployee = useCallback(async () => {
        if (!employeeId) {
            setError("Employee ID is missing."); setLoading(false); return;
        }
        setLoading(true); setError(null);
        try {
            const data = await getEmployeeById(employeeId);
            setEmployee(data);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to load employee details.';
            setError(errorMessage);
            toast.error(`Failed to load employee: ${errorMessage}`);
            setEmployee(null);
        } finally { setLoading(false); }
    }, [employeeId]);

    useEffect(() => { fetchEmployee(); }, [fetchEmployee]);

    const handleOpenEditModal = () => setIsEditOpen(true);
    const handleCloseEditModal = () => setIsEditOpen(false);

    const handleSaveEdit = async (userId: string, formData: FormData) => {
        if (!userId) return;
        try {
            setLoading(true);
            const updatedEmployee = await updateEmployee(userId, formData);
            setEmployee(updatedEmployee);
            setIsEditOpen(false);
            toast.success('Employee updated successfully!'); // ADDED TOAST
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : 'Failed to update employee.'
            );
        } finally { setLoading(false); }
    };

    const handleDeleteEmployee = () => setIsDeleteConfirmOpen(true);
    const cancelDelete = () => setIsDeleteConfirmOpen(false);

    const confirmDelete = async () => {
        if (!employee?._id) return;
        try {
            setLoading(true);
            await deleteEmployee(employee._id);
            setIsDeleteConfirmOpen(false);
            toast.success('Employee deleted successfully'); // ADDED TOAST
            navigate('/employees'); // Go back to the list
        } catch (err: any) {
            const errorMessage =
                err.response && err.response.data && err.response.data.message
                    ? err.response.data.message
                    : err.message || 'Failed to delete user.';

            toast.error(errorMessage);
            setLoading(false);
            setIsDeleteConfirmOpen(false);
        }
    };

    return (
        <Sidebar>
            <EmployeeDetailsContent
                employee={employee}
                loading={loading}
                error={error}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteEmployee}
            />

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