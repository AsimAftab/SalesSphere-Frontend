import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar'; // Use the correct layout
import EmployeeDetailsContent from './EmployeeDetailsContent';
import EditEmployeeModal from '../../components/modals/EditEmployeeModal';
import ConfirmationModal from '../../components/modals/DeleteEntityModal';
import {
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    type Employee,
    // type UpdateEmployeeData // Not needed here since we pass FormData now
} from '../../api/employeeService';


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
            setError(err instanceof Error ? err.message : "Failed to load employee details.");
            setEmployee(null);
        } finally { setLoading(false); }
    }, [employeeId]);

    useEffect(() => { fetchEmployee(); }, [fetchEmployee]);

    const handleOpenEditModal = () => setIsEditOpen(true);
    const handleCloseEditModal = () => setIsEditOpen(false);

    // FIX: Update the signature of handleSaveEdit to match the EditEmployeeModal's onSave prop.
    const handleSaveEdit = async (userId: string, formData: FormData) => {
        if (!userId) return; 
        try {
            setLoading(true);
            // FIX: Pass the userId and the formData to the service function.
            const updatedEmployee = await updateEmployee(userId, formData);
            
            // Note: Since the backend update is successful, we should fetch the latest 
            // data to ensure the UI has the new avatarUrl/other changes.
            // Using setEmployee to directly update the data received from the API call.
            setEmployee(updatedEmployee); 
            setIsEditOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update employee.");
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
        navigate('/employees'); // Go back to the list after successful deletion
    } catch (err: any) { // Use 'any' or define a proper type for err to access response.data
        
        // 🛑 FIX: Extract the specific error message from the 403 response body
        const errorMessage = 
            err.response && err.response.data && err.response.data.message
            ? err.response.data.message // Use the specific message from the backend
            : err.message || "Failed to delete user due to a network or server error.";
        
        console.error("Deletion Failed:", err);

        // Update the component's state to display the specific message
        setError(errorMessage); 
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
                    // FIX: Pass the handler with the correct (userId, formData) signature.
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