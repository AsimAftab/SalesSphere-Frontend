import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar'; 
import EmployeeDetailsContent from './EmployeeDetailsContent';
import EditEmployeeModal from '../../components/modals/EditEmployeeModal';
import ConfirmationModal from '../../components/modals/DeleteEntityModal';
import {
    getEmployeeById,
    updateEmployee,
    fetchAttendanceSummary,
    deleteEmployee,
    type Employee,
    type AttendanceSummaryData,
} from '../../api/employeeService';
import toast from 'react-hot-toast';

const EmployeeDetailsPage: React.FC = () => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient(); 

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const now = new Date();
    const currentMonth = now.getMonth() + 1; 
    const currentYear = now.getFullYear();

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
        
        if (attendanceError) { 
              attendanceError instanceof Error ? attendanceError.message : 'Failed to load attendance summary.';
        }
    }, [isError, queryError, attendanceError]); 

    
    const updateMutation = useMutation({
        mutationFn: ({ userId, formData }: { userId: string, formData: FormData }) =>
            updateEmployee(userId, formData),
        onSuccess: (_updatedEmployee) => {
            queryClient.invalidateQueries({ queryKey: ['employee', employeeId] });
            queryClient.invalidateQueries({ queryKey: ['attendanceSummary', employeeId] }); 
            setIsEditOpen(false);
        },
        onError: (err: unknown) => {
            toast.error(
                err instanceof Error ? err.message : 'Failed to update employee.'
            );
        },
    });

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

    const handleOpenEditModal = () => setIsEditOpen(true);
    const handleCloseEditModal = () => setIsEditOpen(false);

    const handleSaveEdit = async (userId: string, formData: FormData) => {
        if (!userId) return;
        updateMutation.mutate({ userId, formData }); 
    };

    const handleDeleteEmployee = () => setIsDeleteConfirmOpen(true);
    const cancelDelete = () => setIsDeleteConfirmOpen(false);

    const confirmDelete = async () => {
        if (!employee?._id) return;
        deleteMutation.mutate(employee._id); 
    };

    const formattedAttendance = useMemo(() => {
    if (!attendanceSummary) return null;
    
    if (!attendanceSummary.attendance) {
        return null;
    }
    
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
        || deleteMutation.isPending;
    
    const errorString = queryError 
        ? (queryError instanceof Error ? queryError.message : 'Unknown employee loading error') 
        : attendanceError 
        ? (attendanceError instanceof Error ? attendanceError.message : 'Failed to load attendance summary.') 
        : null;

    return (
        <Sidebar>
            <EmployeeDetailsContent
                employee={employee || null} 
                loading={isLoading} 
                error={errorString} 
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteEmployee}
                attendanceSummary={formattedAttendance} 
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