import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { assignBeatPlan } from '../../../../api/beatPlanService';
import { getEmployees, type Employee } from '../../../../api/employeeService';
import type { BeatPlanList } from '../../../../api/beatPlanService';

export const useAssignBeatPlan = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const data = await getEmployees();
            const filteredData = data.filter(emp => emp.role !== 'admin');
            setEmployees(filteredData);
        } catch {
            toast.error('Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    const { mutate: assign, isPending: submitting } = useMutation({
        mutationFn: async (template: BeatPlanList) => {
            if (!selectedEmployeeId) throw new Error('Please select an employee');
            if (!startDate) throw new Error('Please select a start date');

            return await assignBeatPlan({
                beatPlanListId: template._id,
                employees: [selectedEmployeeId],
                startDate
            });
        },
        onSuccess: () => {
            toast.success('Beat plan assigned successfully');
            queryClient.invalidateQueries({ queryKey: ['beat-plans'] });
            if (onSuccess) onSuccess();
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to assign beat plan');
        }
    });

    const reset = () => {
        setSelectedEmployeeId('');
        setStartDate('');
    };

    return {
        employees,
        loading,
        fetchEmployees,
        selectedEmployeeId, setSelectedEmployeeId,
        startDate, setStartDate,
        assign,
        submitting,
        reset
    };
};
