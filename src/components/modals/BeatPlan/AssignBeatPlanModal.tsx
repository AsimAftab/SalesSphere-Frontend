import React, { useEffect } from 'react';
import { useAssignBeatPlan } from './hooks/useAssignBeatPlan';
import AssignBeatPlanForm from './components/AssignBeatPlanForm';
import type { BeatPlanList } from '@/api/beatPlanService';
import { FormModal } from '@/components/ui';

interface AssignBeatPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    template: BeatPlanList | null;
}

const AssignBeatPlanModal: React.FC<AssignBeatPlanModalProps> = ({ isOpen, onClose, onSuccess, template }) => {
    const {
        employees,
        loading,
        fetchEmployees,
        selectedEmployeeId, setSelectedEmployeeId,
        startDate, setStartDate,
        assign,
        submitting,
        reset
    } = useAssignBeatPlan(onSuccess);

    useEffect(() => {
        if (isOpen) {
            fetchEmployees();
            reset();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleClose = () => {
        if (!submitting) onClose();
    };

    const handleSubmit = () => {
        if (template) {
            assign(template);
        }
    };

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Assign Beat Plan"
            description={`Assign "${template?.name}" to an employee`}
            size="md"
            closeOnBackdrop={!submitting}
        >
            <AssignBeatPlanForm
                employees={employees}
                loading={loading}
                selectedEmployeeId={selectedEmployeeId}
                setSelectedEmployeeId={setSelectedEmployeeId}
                startDate={startDate}
                setStartDate={setStartDate}
                submitting={submitting}
                onSubmit={handleSubmit}
                onCancel={handleClose}
            />
        </FormModal>
    );
};

export default AssignBeatPlanModal;
