import React from 'react';
import { Users, IndianRupee, FileText, CalendarClock, Clock, CalendarDays, Crown, Coins } from 'lucide-react';
import type { SubscriptionPlan } from '@/api/SuperAdmin/subscriptionPlanService';
import { InfoBlock, StatusBadge } from '@/components/ui';
import { formatDisplayDateTime } from '@/utils/dateUtils';

interface PlanGeneralInfoCardProps {
    plan: SubscriptionPlan;
}

const tierConfig: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
    basic: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', gradient: 'from-blue-500 to-blue-600' },
    standard: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', gradient: 'from-purple-500 to-purple-600' },
    premium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', gradient: 'from-amber-500 to-amber-600' },
    custom: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', gradient: 'from-slate-500 to-slate-600' }
};

const PlanGeneralInfoCard: React.FC<PlanGeneralInfoCardProps> = ({ plan }) => {
    const config = tierConfig[plan.tier] || tierConfig.custom;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <div className="p-6 pb-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg shadow-blue-100 flex-shrink-0`}>
                            <Crown className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-none">{plan.name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center mt-2 md:mt-0">
                        <StatusBadge status={plan.isActive ? 'Active' : 'Inactive'} />
                    </div>
                </div>
                <div className="h-px bg-gray-300 -mx-6 my-3" />
            </div>
            <div className="p-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    <InfoBlock icon={Users} label="Max Employees" value={`${plan.maxEmployees} Users`} />
                    <InfoBlock icon={IndianRupee} label="Price" value={`${plan.price.amount}`} />
                    <InfoBlock icon={Coins} label="Currency" value={plan.price.currency || 'N/A'} />
                    <InfoBlock icon={CalendarDays} label="Billing Cycle" value={plan.price.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} />
                    <InfoBlock icon={CalendarClock} label="Created At" value={plan.createdAt ? formatDisplayDateTime(plan.createdAt) : 'N/A'} />
                    <InfoBlock icon={Clock} label="Last Updated" value={plan.updatedAt ? formatDisplayDateTime(plan.updatedAt) : 'N/A'} />
                </div>
                {plan.description && (
                    <div className="mt-5 pt-5 border-t border-gray-100">
                        <InfoBlock icon={FileText} label="Description" value={plan.description} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlanGeneralInfoCard;
