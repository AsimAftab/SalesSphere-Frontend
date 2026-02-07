import React from 'react';
import type { DailyOdometerStat } from '@/api/odometerService';
import { MobileCard, MobileCardList } from '@/components/ui';

interface OdometerDetailsMobileListProps {
    data: DailyOdometerStat[];
    onViewDetails: (tripId: string, tripCount: number) => void;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const OdometerDetailsMobileList: React.FC<OdometerDetailsMobileListProps> = ({ data, onViewDetails }) => {

    return (
        <MobileCardList isEmpty={data.length === 0} emptyMessage="No daily records found.">
            {data.map((record, index) => (
                <MobileCard
                    key={record.id}
                    id={record.id}
                    header={{
                        serialNumber: index + 1,
                        title: formatDate(record.date),
                        badge: {
                            type: 'custom',
                            label: `${record.tripCount} Trips`,
                            className: 'bg-blue-100 text-blue-700',
                        },
                    }}
                    detailsLayout="grid"
                    details={[
                        {
                            label: 'Total Distance',
                            value: `${record.totalKm} KM`,
                            valueClassName: 'font-bold text-secondary',
                        },
                    ]}
                    actions={[
                        {
                            label: 'View Details',
                            onClick: () => onViewDetails(record.id, record.tripCount),
                            variant: 'primary',
                        },
                    ]}
                    actionsFullWidth
                />
            ))}
        </MobileCardList>
    );
};

export default OdometerDetailsMobileList;
