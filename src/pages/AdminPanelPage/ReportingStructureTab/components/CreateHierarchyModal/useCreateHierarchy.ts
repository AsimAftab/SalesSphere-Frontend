import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployees, setUserSupervisors } from '@/api/employeeService';
import toast from 'react-hot-toast';

export const useCreateHierarchy = (
    isOpen: boolean,
    onClose: () => void,
    onSuccess: () => void,
    initialData?: { employeeId: string; supervisorIds: string[] } | null
) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [supervisorIds, setSupervisorIds] = useState<string[]>(['']);

    const queryClient = useQueryClient();

    // Initialize state when initialData provided
    useEffect(() => {
        if (isOpen && initialData) {
            setSelectedEmployeeId(initialData.employeeId);
            setSupervisorIds(initialData.supervisorIds.length > 0 ? initialData.supervisorIds : ['']);
        } else if (isOpen && !initialData) {
            // Reset for new creation
            setSelectedEmployeeId('');
            setSupervisorIds(['']);
        }
    }, [isOpen, initialData]);

    // Fetch all employees for dropdowns
    const { data: employeesList } = useQuery({
        queryKey: ['employees-list'],
        queryFn: getEmployees
    });

    const employees = employeesList || [];

    const handleAddSupervisor = () => {
        setSupervisorIds([...supervisorIds, '']);
    };

    const handleSupervisorChange = (index: number, value: string) => {
        const newIds = [...supervisorIds];
        newIds[index] = value;
        setSupervisorIds(newIds);
    };

    const handleRemoveSupervisor = (index: number) => {
        const newIds = supervisorIds.filter((_, i) => i !== index);
        setSupervisorIds(newIds);
    };

    const updateHierarchyMutation = useMutation({
        mutationFn: async () => {
            // Filter empty IDs
            const validSupervisors = supervisorIds.filter(id => id !== '');

            // Using dedicated supervisor update endpoint
            return setUserSupervisors(selectedEmployeeId, validSupervisors);
        },
        onSuccess: () => {
            toast.success('Hierarchy updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['org-hierarchy'] });
            onSuccess();
            onClose();
        },
        onError: (err: Error & { response?: { data?: { message?: string } } }) => {
            toast.error(err?.response?.data?.message || 'Failed to update hierarchy');
        }
    });

    return {
        selectedEmployeeId,
        setSelectedEmployeeId,
        supervisorIds,
        employees,
        handleAddSupervisor,
        handleSupervisorChange,
        handleRemoveSupervisor,
        handleSubmit: updateHierarchyMutation.mutate,
        isPending: updateHierarchyMutation.isPending
    };
};
