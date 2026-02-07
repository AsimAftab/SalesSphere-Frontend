import React from 'react';
import { useViewBeatPlan } from './hooks/useViewBeatPlan';
import ViewBeatPlanContent from './components/ViewBeatPlanContent';
import type { BeatPlanList } from '@/api/beatPlanService';
import { FormModal } from '@/components/ui';

interface ViewBeatPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: BeatPlanList | null;
}

const ViewBeatPlanModal: React.FC<ViewBeatPlanModalProps> = ({ isOpen, onClose, template }) => {
    const {
        activeTab,
        setActiveTab,
        tabs,
        activeData
    } = useViewBeatPlan(template);

    if (!template) return null;

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={template.name}
            description={`Created by ${template.createdBy?.name} • ${template.totalDirectories} Total Stops`}
            size="xl"
        >
            <ViewBeatPlanContent
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
                activeData={activeData}
            />
        </FormModal>
    );
};

export default ViewBeatPlanModal;
