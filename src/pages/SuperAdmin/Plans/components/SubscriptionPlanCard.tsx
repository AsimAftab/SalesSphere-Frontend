import React from 'react';
import type { SubscriptionPlan } from '@/api/SuperAdmin/subscriptionPlanService';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Building2,
  CalendarDays,
  ChevronRight,
  IndianRupee,
  Users,
} from 'lucide-react';

interface SubscriptionPlanCardProps {
    plan: SubscriptionPlan;
}

const tierConfig: Record<string, { bg: string; text: string; border: string; avatarGradient: string }> = {
    basic: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', avatarGradient: 'from-blue-500 to-blue-600' },
    standard: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', avatarGradient: 'from-purple-500 to-purple-600' },
    premium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', avatarGradient: 'from-amber-500 to-amber-600' },
    custom: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', avatarGradient: 'from-slate-500 to-slate-600' }
};

const InfoRow = ({ icon: Icon, label, value, colorClass, bgClass }: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
    value: string;
    colorClass: string;
    bgClass: string;
}) => (
    <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${bgClass}`}>
            <Icon className={`h-5 w-5 ${colorClass}`} />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold mb-0.5">{label}</span>
            <span className="text-sm font-semibold text-gray-900 break-words">{value}</span>
        </div>
    </div>
);

const LucideInfoRow = ({ icon: Icon, label, value, colorClass, bgClass }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    colorClass: string;
    bgClass: string;
}) => (
    <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${bgClass}`}>
            <Icon className={`h-5 w-5 ${colorClass}`} />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold mb-0.5">{label}</span>
            <span className="text-sm font-semibold text-gray-900 break-words">{value}</span>
        </div>
    </div>
);

const getInitials = (name: string): string => {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({ plan }) => {
    const navigate = useNavigate();
    const config = tierConfig[plan.tier] || tierConfig.custom;

    return (
        <div className="group hover:shadow-xl transition-all duration-300 border border-gray-300 bg-white overflow-hidden flex flex-col rounded-2xl">
            {/* Header */}
            <div className="p-4 flex items-start justify-between gap-3 bg-gradient-to-b from-gray-50/50 to-white border-b border-gray-200">
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                    <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${config.avatarGradient} flex items-center justify-center shadow-lg ring-4 ring-white shrink-0`}>
                        <span className="text-white font-bold text-xl tracking-wide">
                            {getInitials(plan.name).charAt(0)}
                        </span>
                    </div>

                    <div className="flex flex-col min-w-0">
                        <h3 className="font-bold text-gray-900 truncate text-lg leading-tight mb-1" title={plan.name}>
                            {plan.name}
                        </h3>
                        {!plan.isSystemPlan && (
                            <span className={`inline-flex items-center px-2 py-0.5 text-xs font-bold uppercase rounded-full border w-fit ${config.bg} ${config.text} ${config.border}`}>
                                {plan.tier}
                            </span>
                        )}
                    </div>
                </div>

                {plan.organizationCount !== undefined && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-full shrink-0">
                        <Building2 className="h-3.5 w-3.5 text-blue-600" />
                        <span className="text-xs font-bold text-blue-700">{plan.organizationCount} Orgs</span>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="pt-3 px-4 pb-2 flex flex-col gap-3 flex-1 bg-white">
                <InfoRow
                    icon={Users}
                    label="Max Employees"
                    value={`${plan.maxEmployees} Users`}
                    colorClass="text-green-600"
                    bgClass="bg-green-50"
                />
                <LucideInfoRow
                    icon={IndianRupee}
                    label="Price"
                    value={`₹ ${plan.price.amount} / ${plan.price.billingCycle}`}
                    colorClass="text-blue-600"
                    bgClass="bg-blue-50"
                />
                <InfoRow
                    icon={Box}
                    label="Modules"
                    value={`${plan.enabledModules?.filter((m) => m !== 'settings').length || 0} Modules Enabled`}
                    colorClass="text-purple-600"
                    bgClass="bg-purple-50"
                />
                <InfoRow
                    icon={CalendarDays}
                    label="Billing Cycle"
                    value={plan.price.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}
                    colorClass="text-amber-600"
                    bgClass="bg-amber-50"
                />
            </div>

            {/* Footer */}
            <div
                className="px-4 py-3.5 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between cursor-pointer transition-all"
                onClick={() => navigate(`/system-admin/plans/${plan._id}`)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(`/system-admin/plans/${plan._id}`)}
                role="button"
                tabIndex={0}
            >
                <span className="text-sm font-bold text-gray-600 group-hover:text-blue-600 transition-colors">
                    View Details
                </span>
                <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
            </div>
        </div>
    );
};

export default SubscriptionPlanCard;
