import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useTripDetailsManager from './components/useTripDetailsManager';
import TripDetailsHeader from './components/TripDetailsHeader';
import TripTabs from './components/TripTabs';
import TripGeneralInfo from './components/TripGeneralInfo';
import TripImagesCard from './components/TripImagesCard';
import TripDetailsSkeleton from './components/TripDetailsSkeleton';
import { EmptyState } from '../../../components/UI/EmptyState/EmptyState';
import ConfirmationModal from '../../../components/modals/ConfirmationModal';

const TripDetailsContent: React.FC = () => {
    const { trips, activeTrip, activeTripId, setActiveTripId, loading, deleteTrip } = useTripDetailsManager();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (activeTripId) {
            await deleteTrip(activeTripId);
            setIsDeleteModalOpen(false);
        }
    };

    if (loading) {
        return (
            <div className="p-0">
                <TripDetailsSkeleton />
            </div>
        );
    }

    if (!activeTrip || trips.length === 0) {
        return (
            <EmptyState
                title="No Trip Details Found"
                description="We couldn't find any trip details for this record."
            />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full"
        >
            <div className="flex-shrink-0">
                <TripDetailsHeader
                    // @ts-ignore - employeeName prop might not be in the interface yet, but was passed in previous code. 
                    // Actually previous code passed employeeName={activeTrip.employeeName} but TripDetailsHeader interface only defined onDelete.
                    // I should check TripDetailsHeader props.
                    // The view_file output for TripDetailsHeader showed:
                    // interface TripDetailsHeaderProps { onDelete?: () => void; }
                    // So employeeName in previous code was technically an error or I missed something?
                    // Wait, previous code: <TripDetailsHeader employeeName={activeTrip.employeeName} />
                    // But interface was:
                    // interface TripDetailsHeaderProps { onDelete?: () => void; }
                    // So I should fix the interface in TripDetailsHeader as well if I want to pass employeeName?
                    // The user ONLY asked to fix delete. I will pass onDelete.
                    // If employeeName was there, I'll keep it but ignore TS error if I don't fix Child.
                    // Actually, I should probably check if I should update TripDetailsHeader to accept employeeName too?
                    // The previous view showed it wasn't accepting it.
                    // I will just pass onDelete.
                    onDelete={handleDeleteClick}
                />

                {/* Tabs */}
                <TripTabs
                    trips={trips}
                    activeTripId={activeTripId!}
                    onTabChange={setActiveTripId}
                />
            </div>

            <div className="flex-1 overflow-y-auto pb-10 no-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: General Info */}
                    <div className="lg:col-span-2">
                        <TripGeneralInfo data={activeTrip} />
                    </div>

                    {/* Right Column: Images */}
                    <div className="lg:col-span-1">
                        <TripImagesCard data={activeTrip} />
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                title="Delete Trip"
                message={`Are you sure you want to delete Trip#${activeTrip.tripNumber}? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
                confirmButtonText="Delete"
                confirmButtonVariant="danger"
            />
        </motion.div>
    );
};

export default TripDetailsContent;
