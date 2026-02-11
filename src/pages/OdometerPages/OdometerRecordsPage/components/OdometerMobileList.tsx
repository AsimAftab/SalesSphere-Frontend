import React from 'react';
import { formatDateToLocalISO } from '@/utils/dateUtils';
import type { OdometerStat } from '@/api/odometerService';
import { MobileCard, MobileCardList } from '@/components/ui';

interface OdometerMobileListProps {
    data: OdometerStat[];
    onViewDetails: (employeeId: string) => void;
}

const OdometerMobileList: React.FC<OdometerMobileListProps> = ({ data, onViewDetails }) => {
    return (
        <MobileCardList isEmpty={data.length === 0} emptyMessage="No odometer records found.">
            {data.map((item, index) => {
                const startDate = formatDateToLocalISO(new Date(item.dateRange.start));
                const endDate = formatDateToLocalISO(new Date(item.dateRange.end));

                return (
                    <MobileCard
                        key={item._id}
                        id={item._id}
                        header={{
                            serialNumber: index + 1,
                            title: item.employee.name || "Unknown User",
                            badge: {
                                type: 'custom',
                                label: item.employee.role || 'Staff',
                                className: 'bg-blue-100 text-blue-700',
                            },
                        }}
                        detailsLayout="grid"
                        details={[
                            {
                                label: 'Total Distance',
                                value: `${item.totalDistance.toLocaleString()} KM`,
                                valueClassName: 'font-bold text-secondary',
                            },
                            {
                                label: 'Start Date',
                                value: startDate,
                            },
                            {
                                label: 'End Date',
                                value: endDate,
                            },
                        ]}
                        actions={[
                            {
                                label: 'View Details',
                                onClick: () => onViewDetails(item._id),
                                variant: 'primary',
                            },
                        ]}
                        actionsFullWidth
                    />
                );
            })}
        </MobileCardList>
    );
};

export default OdometerMobileList;
