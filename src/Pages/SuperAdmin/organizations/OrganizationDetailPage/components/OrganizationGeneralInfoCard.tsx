import React, { useEffect, useState } from 'react';
import { StatusBadge } from '../../../../../components/ui/StatusBadge/StatusBadge';
import { Building2, User, Phone, Clock, Globe, Calendar, Mail, Zap, IdCard } from 'lucide-react';
import type { Organization } from '../../../../../api/superAdmin/organizationService';
import { subscriptionPlanService } from '../../../../../api/superAdmin/subscriptionPlanService';
import { formatDisplayDate, formatDisplayDateTime } from '../../../../../utils/dateUtils';

// Helper Component for consistent field display
const DisplayValue = ({ label, icon: Icon, value, className = "" }: { label: string, icon: React.ComponentType<{ className?: string }>, value?: string | number | null, className?: string }) => (
    <div>
        <label className="text-xs font-semibold tracking-wider text-slate-500 flex items-center gap-2 mb-1">
            <Icon className="w-3.5 h-3.5" />
            {label}
        </label>
        <p className={`text-base font-medium text-slate-900 pl-5 ${className}`}>
            {value || 'N/A'}
        </p>
    </div>
);

// Helper to format time string "HH:mm" to "hh:mm AM/PM"
const formatTimeTo12Hour = (time?: string) => {
    if (!time) return 'N/A';
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

interface OrganizationGeneralInfoCardProps {
    organization: Organization;
}

export const OrganizationGeneralInfoCard: React.FC<OrganizationGeneralInfoCardProps> = ({ organization }) => {
    const [planName, setPlanName] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlanName = async () => {
            if (organization.customPlanId) {
                try {
                    const response = await subscriptionPlanService.getById(organization.customPlanId as string);
                    if (response.data && response.data.data) {
                        setPlanName(response.data.data.name);
                    }
                } catch (error) {
                    console.error('Failed to fetch subscription plan details', error);
                }
            }
        };

        fetchPlanName();
    }, [organization.customPlanId]);

    const displayPlanName = planName || (organization.subscriptionType
        ? `${organization.subscriptionType.replace(/(\d+)([a-zA-Z]+)/, '$1 $2')} Plan`
        : null);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <div className="p-6 pb-0">
                {/* Merged Header Content */}
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-100 flex-shrink-0">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-none">{organization.name}</h3>
                            {displayPlanName && (
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Zap className="w-3.5 h-3.5 text-blue-500" />
                                    <span className="text-xs font-semibold tracking-wider text-blue-600">
                                        {displayPlanName}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                        <StatusBadge status={organization.status} />
                    </div>
                </div>
                <div className="h-px bg-gray-300 -mx-6 my-3" />
            </div>
            <div className="p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    {/* Row 1 */}
                    <DisplayValue label="Owner Name" icon={User} value={organization.owner} />
                    <DisplayValue label="Owner Email" icon={Mail} value={organization.ownerEmail} className="break-all" />

                    {/* Row 2 */}
                    <DisplayValue label="Phone Number" icon={Phone} value={organization.phone} />
                    <DisplayValue label="PAN/VAT Number" icon={IdCard} value={organization.panVat} />

                    {/* Row 3 */}
                    <DisplayValue label="Country" icon={Globe} value={organization.country || 'Nepal'} />
                    <DisplayValue label="Timezone" icon={Globe} value={organization.timezone} />

                    {/* Row 4 */}
                    <DisplayValue label="Check-in Time" icon={Clock} value={formatTimeTo12Hour(organization.checkInTime)} />
                    <DisplayValue label="Check-out Time" icon={Clock} value={formatTimeTo12Hour(organization.checkOutTime)} />

                    {/* Row 5 */}
                    <DisplayValue label="Half Day Checkout" icon={Clock} value={formatTimeTo12Hour(organization.halfDayCheckOutTime)} />
                    <DisplayValue label="Weekly Off" icon={Calendar} value={organization.weeklyOff} />

                    {/* Row 6 - Dates */}
                    <DisplayValue
                        label="Subscription Start Date"
                        icon={Calendar}
                        value={organization.createdDate ? formatDisplayDate(organization.createdDate) : 'N/A'}
                    />
                    <DisplayValue
                        label="Subscription End Date"
                        icon={Calendar}
                        value={organization.subscriptionExpiry ? formatDisplayDate(organization.subscriptionExpiry) : 'N/A'}
                    />

                    {/* Row 7 - Timestamps */}
                    <DisplayValue
                        label="Created At"
                        icon={Calendar}
                        value={formatDisplayDateTime(organization.createdDate)}
                    />
                    <DisplayValue
                        label="Last Updated"
                        icon={Calendar}
                        value={organization.lastUpdated} // lastUpdated is already formatted in mapper
                    />
                </div>
            </div>
        </div>
    );
};
