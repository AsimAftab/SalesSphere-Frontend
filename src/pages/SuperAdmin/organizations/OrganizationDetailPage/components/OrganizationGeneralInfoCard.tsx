import React, { useEffect, useState } from 'react';
import { Building2, User, Phone, LogIn, LogOut, Timer, CalendarOff, Globe, Earth, CalendarPlus, CalendarClock, CalendarCheck, Clock, Mail, Crown, IdCard } from 'lucide-react';
import type { Organization } from '@/api/SuperAdmin/organizationService';
import { subscriptionPlanService } from '@/api/SuperAdmin/subscriptionPlanService';
import { formatDisplayDate, formatDisplayDateTime } from '@/utils/dateUtils';
import { StatusBadge, InfoBlock } from '@/components/ui';

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
                                    <Crown className="w-3.5 h-3.5 text-blue-500" />
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
            <div className="p-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    <InfoBlock icon={User} label="Owner Name" value={organization.owner} />
                    <InfoBlock icon={Mail} label="Owner Email" value={organization.ownerEmail} />
                    <InfoBlock icon={Phone} label="Phone Number" value={organization.phone} />
                    <InfoBlock icon={IdCard} label="PAN/VAT Number" value={organization.panVat} />
                    <InfoBlock icon={Globe} label="Country" value={organization.country || 'Nepal'} />
                    <InfoBlock icon={Earth} label="Timezone" value={organization.timezone} />
                    <InfoBlock icon={LogIn} label="Check-in Time" value={formatTimeTo12Hour(organization.checkInTime)} />
                    <InfoBlock icon={LogOut} label="Check-out Time" value={formatTimeTo12Hour(organization.checkOutTime)} />
                    <InfoBlock icon={Timer} label="Half Day Checkout" value={formatTimeTo12Hour(organization.halfDayCheckOutTime)} />
                    <InfoBlock icon={CalendarOff} label="Weekly Off" value={organization.weeklyOff} />
                    <InfoBlock icon={CalendarPlus} label="Subscription Start Date" value={organization.createdDate ? formatDisplayDate(organization.createdDate) : 'N/A'} />
                    <InfoBlock icon={CalendarCheck} label="Subscription End Date" value={organization.subscriptionExpiry ? formatDisplayDate(organization.subscriptionExpiry) : 'N/A'} />
                    <InfoBlock icon={CalendarClock} label="Created At" value={formatDisplayDateTime(organization.createdDate)} />
                    <InfoBlock icon={Clock} label="Last Updated" value={organization.lastUpdated} />
                </div>
            </div>
        </div>
    );
};
