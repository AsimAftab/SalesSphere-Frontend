import React from 'react';
import { CreditCard } from 'lucide-react';
import type { Organization } from '@/api/SuperAdmin/organizationService';
import { StatusBadge, Button as CustomButton } from '@/components/ui';

interface SubscriptionDetailsCardProps {
    organization: Organization;
    onManage?: () => void;
}

export const SubscriptionDetailsCard: React.FC<SubscriptionDetailsCardProps> = ({ organization, onManage }) => {
    // Helper to determine subscription color


    // Calculate days remaining
    const calculateDaysRemaining = () => {
        if (!organization.subscriptionExpiry) return null;
        const endDate = new Date(organization.subscriptionExpiry);
        const today = new Date();
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysRemaining = calculateDaysRemaining();

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 pb-3">
                <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight leading-none text-slate-900">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        Subscription Details
                    </h3>
                    <CustomButton
                        onClick={onManage}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 h-auto text-sm"
                    >
                        Manage
                    </CustomButton>
                </div>
            </div>
            <div className="p-6 pt-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex-1">
                        <label className="text-sm font-medium text-slate-500 block mb-1">Status</label>
                        <StatusBadge status={organization.subscriptionStatus === 'Active' ? 'Active' : 'Expired'} />
                    </div>

                    <div className="flex-1 border-l-0 md:border-l border-slate-200 md:pl-6">
                        <label className="text-sm font-medium text-slate-500 block mb-1">Expiry Date</label>
                        <p className="text-base font-semibold text-slate-900">
                            {organization.subscriptionExpiry
                                ? new Date(organization.subscriptionExpiry).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })
                                : 'N/A'}
                        </p>
                    </div>

                    <div className="flex-1 border-l-0 md:border-l border-slate-200 md:pl-6">
                        <label className="text-sm font-medium text-slate-500 block mb-1">Days Remaining</label>
                        <p className={`text-base font-semibold ${daysRemaining && daysRemaining < 30 ? 'text-amber-600' : 'text-green-600'}`}>
                            {daysRemaining !== null
                                ? `${daysRemaining} days`
                                : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
