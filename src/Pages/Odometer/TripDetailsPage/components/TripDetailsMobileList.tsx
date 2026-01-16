import React from 'react';
import type { TripOdometerDetails } from '../../../../api/odometerService';
import TripInfoCard from './TripInfoCard';

interface TripDetailsMobileListProps {
    data: TripOdometerDetails;
}

// Since the TripInfoCard is already responsive, the MobileList component 
// serves as a specific adapter or layout wrapper if mobile-specific tweaks are needed.
// For now, it reuses the TripInfoCard which handles mobile layouts via Tailwind classes.
const TripDetailsMobileList: React.FC<TripDetailsMobileListProps> = ({ data }) => {
    return (
        <div className="block md:hidden">
            <TripInfoCard data={data} />
        </div>
    );
};

export default TripDetailsMobileList;
