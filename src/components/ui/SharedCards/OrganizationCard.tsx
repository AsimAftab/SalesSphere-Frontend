import React, { useEffect, useState } from 'react';
import {
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    UsersIcon,
    CurrencyDollarIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import type { Organization } from '@/api/SuperAdmin/organizationService';
import { subscriptionPlanService } from '@/api/SuperAdmin/subscriptionPlanService';
import { StatusBadge } from '@/components/ui';

interface OrganizationCardProps {
    organization: Organization;
    onClick: (org: Organization) => void;
}

// InfoRow Helper Component
const InfoRow = ({ icon: Icon, label, value, colorClass, bgClass }: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; label: string; value: string; colorClass: string; bgClass: string }) => (
    <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${bgClass}`}>
            <Icon className={`h-5 w-5 ${colorClass}`} />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold mb-0.5">{label}</span>
            <span className="text-sm font-semibold text-gray-900 break-words" title={value}>{value}</span>
        </div>
    </div>
);

const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export const OrganizationCard: React.FC<OrganizationCardProps> = ({ organization: org, onClick }) => {
    const [planName, setPlanName] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlanName = async () => {
            if (org.customPlanId) {
                // Handle different types of customPlanId (string or object)
                let planId: string | undefined;
                let existingName: string | undefined;

                if (typeof org.customPlanId === 'string') {
                    planId = org.customPlanId;
                } else if (typeof org.customPlanId === 'object' && org.customPlanId !== null) {
                    const plan = org.customPlanId as { _id?: string; id?: string; name?: string };
                    // Check if name is already populated
                    if (plan.name) {
                        existingName = plan.name;
                    }
                    // Extract ID if needed
                    planId = plan._id || plan.id;
                }

                // Optimization: if name is already there, use it directly
                if (existingName) {
                    setPlanName(existingName);
                    return;
                }

                if (planId) {
                    try {
                        const response = await subscriptionPlanService.getById(planId);
                        if (response.data && response.data.data) {
                            setPlanName(response.data.data.name);
                        }
                    } catch (error) {
                        console.error('Failed to fetch subscription plan details', error);
                    }
                }
            }
        };

        fetchPlanName();
    }, [org.customPlanId]);

    const displayPlanName = planName || (org.subscriptionType
        ? `${org.subscriptionType.replace(/(\d+)([a-zA-Z]+)/, '$1 $2')} Plan`
        : 'N/A');

    return (
        <div
            className="group hover:shadow-xl transition-all duration-300 border border-gray-300 bg-white overflow-hidden flex flex-col rounded-2xl"
        >
            {/* Header Section - Enhanced */}
            <div className="p-4 flex items-start justify-between gap-3 bg-gradient-to-b from-gray-50/50 to-white border-b border-gray-200">
                <div className="flex items-center gap-3 overflow-hidden">
                    {/* Avatar */}
                    <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg ring-4 ring-white shrink-0 relative">
                        <span className="text-white font-bold text-xl tracking-wide">
                            {getInitials(org.name).charAt(0)}
                        </span>
                        {/* Status Indicator */}
                        <div className={`absolute bottom-0 right-0 h-4 w-4 border-[3px] border-white rounded-full z-20 ${org.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>

                    {/* Name, Owner & User Count */}
                    <div className="flex flex-col min-w-0">
                        <h3 className="font-bold text-gray-900 truncate text-lg leading-tight mb-1" title={org.name}>
                            {org.name}
                        </h3>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-500 truncate">{org.owner || 'Unknown Owner'}</p>
                            <span className="text-xs text-gray-300">|</span>
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-50 border border-purple-200 rounded-full">
                                <UsersIcon className="h-3.5 w-3.5 text-purple-600" />
                                <span className="text-xs font-bold text-purple-700">{org.userCount ?? org.users?.length ?? 0} Users</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0">
                    <StatusBadge status={org.status || 'Inactive'} />
                </div>
            </div>

            {/* Details Body */}
            <div className="pt-3 px-4 pb-2 flex flex-col gap-3 flex-1 bg-white">
                {/* Row 1: Contact Information */}
                <InfoRow
                    icon={PhoneIcon}
                    label="PHONE"
                    value={org.phone || 'N/A'}
                    colorClass="text-green-600"
                    bgClass="bg-green-50"
                />
                <InfoRow
                    icon={EnvelopeIcon}
                    label="EMAIL"
                    value={org.ownerEmail || 'N/A'}
                    colorClass="text-blue-600"
                    bgClass="bg-blue-50"
                />

                {/* Row 2: Subscription Details */}
                <InfoRow
                    icon={CurrencyDollarIcon}
                    label="CURRENT PLAN"
                    value={displayPlanName}
                    colorClass="text-purple-600"
                    bgClass="bg-purple-50"
                />

                {/* Row 3: Location */}
                <InfoRow
                    icon={MapPinIcon}
                    label="ADDRESS"
                    value={org.address || 'N/A'}
                    colorClass="text-red-600"
                    bgClass="bg-red-50"
                />
            </div>

            {/* Footer */}
            <div
                className="px-4 py-3.5 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between cursor-pointer transition-all"
                onClick={() => onClick(org)}
            >
                <span className="text-sm font-bold text-gray-600 group-hover:text-blue-600 transition-colors">
                    View Details
                </span>
                <ChevronRightIcon className="h-4 w-4 text-gray-600 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
            </div>
        </div>
    );
};
