import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useCompletedBeatPlans } from './hooks/useCompletedBeatPlans';
import CompletedBeatsTable from './components/CompletedBeatsTable';
import ActiveBeatViewModal from '../../../../components/modals/beat-plan/components/ActiveBeatViewModal';
import { getArchivedBeatPlanById } from '../../../../api/beatPlanService';
import type { BeatPlan } from '../../../../api/beatPlanService';

import ActiveBeatsSkeleton from '../ActiveBeats/components/ActiveBeatsSkeleton';

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
    const [viewLoading, setViewLoading] = useState(false);

    const handleView = async (plan: BeatPlan) => {
        try {
            setViewLoading(true);
            // Fetch full details including visits and directories
            const fullPlan = await getArchivedBeatPlanById(plan._id);
            if (fullPlan) {
                setSelectedPlan(fullPlan);
            }
        } catch (error) {
            console.error('Error fetching plan details:', error);
            toast.error('Failed to load plan details');
        } finally {
            setViewLoading(false);
        }
    };

    if (loading) {
        return <ActiveBeatsSkeleton />;
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
                />
            )}

            {/* Simple loading overlay for detail fetch */}
            {viewLoading && (
                <div className="fixed inset-0 bg-black/10 z-[10000] flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium">Loading details...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompletedBeatsTab;
