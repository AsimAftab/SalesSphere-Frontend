import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useTripDetailsManager from './components/useTripDetailsManager';
import TripDetailsHeader from './components/TripDetailsHeader';
import TripTabs from './components/TripTabs';
import TripGeneralInfo from './components/TripGeneralInfo';
import TripImagesCard from './components/TripImagesCard';
import TripDetailsSkeleton from './components/TripDetailsSkeleton';
import ConfirmationModal from '../../../components/modals/ConfirmationModal';
import { ExportTripService } from './components/ExportTripService';
import TripPDF from './TripPDF';

const TripDetailsContent: React.FC = () => {
    const { trips, activeTrip, activeTripId, setActiveTripId, loading, deleteTrip, initialTripCount } = useTripDetailsManager();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handlePdfExport = () => {
        if (activeTrip) {
            ExportTripService.exportToPdf(
                activeTrip,
                <TripPDF trip={activeTrip} />
            );
        }
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
                <TripDetailsSkeleton tabsCount={trips.length || initialTripCount || 3} />
            </div>
        );
    }

    if (!activeTrip || trips.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full"
        >
            <div className="flex-shrink-0">
                <TripDetailsHeader
                    onDelete={handleDeleteClick}
                    onPdfExport={handlePdfExport}
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
