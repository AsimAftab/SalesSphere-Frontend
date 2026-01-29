import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Button from '../../../../../components/UI/Button/Button';
import EmployeeFormModal from '../../../../../components/modals/Employees/EmployeeModal';
import ConfirmationModal from '../../../../../components/modals/CommonModals/ConfirmationModal';
import { useEmployeeActions } from '../../hooks/useEmployeeActions';
import { type Employee } from '../../../../../api/employeeService';
import { useAuth } from '../../../../../api/authService';
import { toast } from 'react-hot-toast';

interface HeaderActionsProps {
    employee: Employee | null;
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

const HeaderActions: React.FC<HeaderActionsProps> = ({ employee }) => {
    const {
        isEditOpen, setIsEditOpen,
        isDeleteConfirmOpen, setIsDeleteConfirmOpen,
        handleSaveEdit, confirmDeleteEmployee
    } = useEmployeeActions(employee);

    // Permission Check
    const { hasPermission } = useAuth();
    const canEdit = hasPermission('employees', 'update');
    const canDelete = hasPermission('employees', 'delete');

    return (
        <>
            <motion.div
                className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 p-1"
                variants={itemVariants}
            >
                <div className="flex items-center gap-4">
                    <Link to="/employees" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800 text-center md:text-left">Employee Details</h1>
                </div>

                {employee && (
                    <div className="flex flex-col md:flex-row w-full md:w-auto gap-4 md:space-x-4">
                        {canEdit && (
                            <Button
                                variant="primary"
                                onClick={() => {
                                    if (employee?.role === 'admin' || employee?.role === 'superadmin') {
                                        toast.error('Administrative accounts cannot be modified here. Please manage admin credentials in Settings.');
                                        return;
                                    }
                                    setIsEditOpen(true);
                                }}
                                className="w-full"
                            >
                                Edit Employee Details
                            </Button>
                        )}
                        {canDelete && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    if (employee?.role === 'admin' || employee?.role === 'superadmin') {
                                        toast.error('Administrative accounts cannot be deleted.');
                                        return;
                                    }
                                    setIsDeleteConfirmOpen(true);
                                }}
                                className="w-full text-red-600 border-red-300 hover:bg-red-50 focus:ring-red-500"
                            >
                                Delete Employee
                            </Button>
                        )}
                    </div>
                )}
            </motion.div>

            {/* Modals are Rendered Here - Encapsulated with Actions */}
            {employee && (
                <EmployeeFormModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    initialData={employee}
                    mode="edit"
                    onSave={handleSaveEdit}
                />
            )}

            {employee && (
                <ConfirmationModal
                    isOpen={isDeleteConfirmOpen}
                    title="Delete Employee"
                    message={`Are you sure you want to delete "${employee.name}"? This action cannot be undone.`}
                    onConfirm={confirmDeleteEmployee}
                    onCancel={() => setIsDeleteConfirmOpen(false)}
                    confirmButtonText="Delete Employee"
                    confirmButtonVariant="danger"
                />
            )}
        </>
    );
};

export default HeaderActions;
