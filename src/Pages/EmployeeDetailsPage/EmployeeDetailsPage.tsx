import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import EmployeeDetailsContent from './EmployeeDetailsContent';
import EmployeeFormModal from '../../components/modals/EmployeeFormModal';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import {
    getEmployeeById,
    updateEmployee,
    fetchAttendanceSummary,
    deleteEmployee,
    uploadEmployeeDocuments,
    deleteEmployeeDocument,
    type Employee,
    type AttendanceSummaryData,
} from '../../api/employeeService';
import { assignRoleToUser } from '../../api/roleService';
import toast from 'react-hot-toast';

const EmployeeDetailsPage: React.FC = () => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Ref for hidden file input
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- STATE MANAGEMENT ---
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Employee Deletion State
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    // Document Deletion State
    const [isDocDeleteModalOpen, setIsDocDeleteModalOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<{ id: string; name: string } | null>(null);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // --- QUERIES ---

    // 1. Fetch Employee
    const {
        data: employee,
        isLoading: isQueryLoading,
        error: queryError,
        isError,
    } = useQuery<Employee, Error>({
        queryKey: ['employee', employeeId],
        queryFn: async () => {
            if (!employeeId) {
                throw new Error("Employee ID is missing.");
            }
            return getEmployeeById(employeeId);
        },
        enabled: !!employeeId,
    });

    // 2. Fetch Attendance
    const {
        data: attendanceSummary,
        isLoading: isAttendanceLoading,
        error: attendanceError,
    } = useQuery<AttendanceSummaryData, Error>({
        queryKey: ['attendanceSummary', employeeId, currentMonth, currentYear],
        queryFn: () => {
            if (!employeeId) {
                throw new Error("Employee ID is missing for attendance.");
            }
            return fetchAttendanceSummary(employeeId, currentMonth, currentYear);
        },
        enabled: !!employeeId,
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (isError && queryError) {
            const errorMessage =
                queryError instanceof Error ? queryError.message : 'Failed to load employee details.';
            toast.error(`Failed to load employee: ${errorMessage}`);
        }
    }, [isError, queryError]);


    // --- MUTATIONS ---

    // 3. Update Employee Mutation
    const updateMutation = useMutation({
        mutationFn: ({ userId, formData }: { userId: string, formData: FormData }) =>
            updateEmployee(userId, formData),
        onSuccess: (_updatedEmployee) => {
            queryClient.invalidateQueries({ queryKey: ['employee', employeeId] });
            queryClient.invalidateQueries({ queryKey: ['attendanceSummary', employeeId] });
            setIsEditOpen(false);
            toast.success('Employee updated successfully');
        },
        onError: (err: unknown) => {
            toast.error(
                err instanceof Error ? err.message : 'Failed to update employee.'
            );
        },
    });

    // 4. Delete Employee Mutation
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

    // 5. Upload Documents Mutation
    const uploadDocMutation = useMutation({
        mutationFn: ({ userId, files }: { userId: string, files: File[] }) =>
            uploadEmployeeDocuments(userId, files),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employee', employeeId] });
            toast.success('Documents uploaded successfully');
            if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
        },
        onError: (err: any) => {
            toast.error(err instanceof Error ? err.message : 'Upload failed');
            if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
        }
    });

    // 6. Delete Document Mutation
    const deleteDocMutation = useMutation({
        mutationFn: ({ userId, docId }: { userId: string, docId: string }) =>
            deleteEmployeeDocument(userId, docId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employee', employeeId] });
            toast.success('Document deleted successfully');
            // Close modal and reset state
            setIsDocDeleteModalOpen(false);
            setDocumentToDelete(null);
        },
        onError: (err: any) => {
            toast.error(err instanceof Error ? err.message : 'Deletion failed');
            // Close modal on error too, or keep it open? Usually close or show error.
            setIsDocDeleteModalOpen(false);
        }
    });


    // --- HANDLERS ---

    const handleOpenEditModal = () => setIsEditOpen(true);
    const handleCloseEditModal = () => setIsEditOpen(false);

    const handleSaveEdit = async (formData: FormData, customRoleId: string) => {
        if (!employee?._id) return;

        try {
            // 1. Update Standard Fields
            await updateMutation.mutateAsync({ userId: employee._id, formData });

            // 2. Update Role (if provided)
            if (customRoleId) {
                await assignRoleToUser(customRoleId, employee._id);
                queryClient.invalidateQueries({ queryKey: ['employee', employeeId] });
            }
        } catch (error) {
            console.error(error);
            // Error is handled by mutation callbacks or we can toast here
        }
    };

    const handleDeleteEmployee = () => setIsDeleteConfirmOpen(true);
    const cancelDeleteEmployee = () => setIsDeleteConfirmOpen(false);

    const confirmDeleteEmployee = async () => {
        if (!employee?._id) return;
        deleteMutation.mutate(employee._id);
    };

    // Document Upload Handlers
    const handleTriggerUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0 && employee?._id) {
            const fileArray = Array.from(files);
            uploadDocMutation.mutate({ userId: employee._id, files: fileArray });
        }
    };

    // --- DOCUMENT DELETE HANDLERS (UPDATED) ---

    // 1. Triggered when trash icon is clicked
    const handleRequestDeleteDocument = (docId: string) => {
        if (!employee) return;

        // Find the document name for the modal message
        const docName = employee.documents?.find(d => d._id === docId)?.fileName || 'Document';

        setDocumentToDelete({ id: docId, name: docName });
        setIsDocDeleteModalOpen(true);
    };

    // 2. Triggered when "Delete" is clicked inside the modal
    const confirmDeleteDocument = () => {
        if (employee?._id && documentToDelete?.id) {
            deleteDocMutation.mutate({
                userId: employee._id,
                docId: documentToDelete.id
            });
        }
    };

    // 3. Triggered when "Cancel" is clicked inside the modal
    const cancelDeleteDocument = () => {
        setIsDocDeleteModalOpen(false);
        setDocumentToDelete(null);
    };


    // --- DATA TRANSFORMATION ---

    const formattedAttendance = useMemo(() => {
        if (!attendanceSummary) return null;
        if (!attendanceSummary.attendance) return null;

        const stats: any = attendanceSummary.attendance;
        const totalWorkingDays = stats.workingDays;

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December',
        ];

        const monthIndex = (typeof attendanceSummary.month === 'string' ? parseInt(attendanceSummary.month, 10) : attendanceSummary.month) - 1;
        const monthName = monthNames[monthIndex];

        const percentageValue = parseFloat(String(attendanceSummary.attendancePercentage));

        const transformedStats = [
            { value: stats.present, label: 'Present', color: 'bg-green-500' },
            { value: stats.weeklyOff, label: 'Weekly Off', color: 'bg-blue-500' },
            { value: stats.halfday || stats.halfDay, label: 'Half Day', color: 'bg-purple-500' },
            { value: stats.leave, label: 'Leave', color: 'bg-yellow-500' },
            { value: stats.absent, label: 'Absent', color: 'bg-red-500' },
        ].filter(stat => stat.value > 0);

        return {
            percentage: isNaN(percentageValue) ? 0 : percentageValue,
            stats: transformedStats,
            monthYear: `${monthName || 'Month'} ${attendanceSummary.year}`,
            totalWorkingDays: totalWorkingDays,
        };
    }, [attendanceSummary]);

    const isLoading = isQueryLoading
        || isAttendanceLoading
        || updateMutation.isPending
        || deleteMutation.isPending
        || uploadDocMutation.isPending
        || deleteDocMutation.isPending;

    const errorString = queryError
        ? (queryError instanceof Error ? queryError.message : 'Unknown employee loading error')
        : attendanceError
            ? (attendanceError instanceof Error ? attendanceError.message : 'Failed to load attendance summary.')
            : null;

    return (
        <Sidebar>
            {/* Hidden File Input for Uploads */}
            <input
                type="file"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            />

            <EmployeeDetailsContent
                employee={employee || null}
                loading={isLoading}
                error={errorString}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteEmployee}
                attendanceSummary={formattedAttendance}
                onUploadDocument={handleTriggerUpload}
                // Update to use the new handler
                onDeleteDocument={handleRequestDeleteDocument}
            />

            {/* Modal 1: Edit Employee */}
            {employee && (
                <EmployeeFormModal
                    isOpen={isEditOpen}
                    onClose={handleCloseEditModal}
                    initialData={employee}
                    mode="edit"
                    onSave={handleSaveEdit}
                />
            )}

            {/* Modal 2: Delete Employee Confirmation */}
            {employee && (
                <ConfirmationModal
                    isOpen={isDeleteConfirmOpen}
                    title="Delete Employee"
                    message={`Are you sure you want to delete "${employee.name}"? This action cannot be undone.`}
                    onConfirm={confirmDeleteEmployee}
                    onCancel={cancelDeleteEmployee}
                    confirmButtonText="Delete Employee"
                    confirmButtonVariant="danger"
                />
            )}

            {/* Modal 3: Delete Document Confirmation (NEW) */}
            <ConfirmationModal
                isOpen={isDocDeleteModalOpen}
                title="Delete Document"
                message={`Are you sure you want to delete "${documentToDelete?.name || 'this file'}"? This action cannot be undone.`}
                onConfirm={confirmDeleteDocument}
                onCancel={cancelDeleteDocument}
                confirmButtonText="Delete Document"
                confirmButtonVariant="danger"
            />
        </Sidebar>
    );
};

export default EmployeeDetailsPage;