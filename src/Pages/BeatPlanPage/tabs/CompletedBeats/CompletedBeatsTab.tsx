import React, { useState } from 'react';
import { useCompletedBeatPlans } from './hooks/useCompletedBeatPlans';
import CompletedBeatsTable from './components/CompletedBeatsTable';
import ActiveBeatViewModal from '../../../../components/modals/beat-plan/components/ActiveBeatViewModal';
import { getArchivedBeatPlanById } from '../../../../api/beatPlanService';
import type { BeatPlan } from '../../../../api/beatPlanService';
import CompletedBeatsSkeleton from './components/CompletedBeatsSkeleton';
import CompletedBeatsHeader from './components/CompletedBeatsHeader';

const CompletedBeatsTab: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const {
        beatPlans,
        loading,
        totalPlans,
        currentPage,
        itemsPerPage,
        setCurrentPage,
    } = useCompletedBeatPlans(searchQuery);

    const [selectedPlan, setSelectedPlan] = useState<BeatPlan | null>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    const handleView = async (plan: BeatPlan) => {
        // Optimistic open
        setSelectedPlan(plan);
        setIsDetailLoading(true);

        try {
            // Background fetch for full details
            const fullPlan = await getArchivedBeatPlanById(plan._id);
            // Only update if the user is still viewing this plan (prevent re-opening if closed)
            setSelectedPlan(current =>
                (current && current._id === plan._id) ? fullPlan : current
            );
        } catch (error) {
            console.error('Failed to load full details', error);
        } finally {
            setIsDetailLoading(false);
        }
    };

    if (loading) {
        return <CompletedBeatsSkeleton />;
    }

    return (
        <div className="space-y-4">
            <CompletedBeatsHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <CompletedBeatsTable
                beatPlans={beatPlans}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalPlans={totalPlans}
                onPageChange={setCurrentPage}
                onView={handleView}
            />

            {/* Reuse the ActiveBeatViewModal for consistency */}
            {selectedPlan && (
                <ActiveBeatViewModal
                    isOpen={!!selectedPlan}
                    onClose={() => setSelectedPlan(null)}
                    plan={selectedPlan}
                    isLoading={isDetailLoading}
                />
            )}
        </div>
    );
};

export default CompletedBeatsTab;
