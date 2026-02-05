import React from 'react';
import {
    Phone,
    Mail,
    MapPin,
    Calendar,
    ChevronRight
} from 'lucide-react';
import type { SystemUser } from '@/api/SuperAdmin/systemUserService';
import { StatusBadge } from '@/components/ui';
import { formatDisplayDate } from '@/utils/dateUtils';

interface SystemUserCardProps {
    user: SystemUser;
    onClick: (user: SystemUser) => void;
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

// Role Configuration Map
const ROLE_CONFIG: Record<string, { label: string; className: string }> = {
    superadmin: {
        label: 'Super Admin',
        className: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    developer: {
        label: 'Developer',
        className: 'bg-blue-100 text-blue-800 border-blue-200'
    }
};

export const SystemUserCard: React.FC<SystemUserCardProps> = ({ user, onClick }) => {

    const roleConfig = ROLE_CONFIG[user.role || 'developer'] || {
        label: user.role || 'Developer',
        className: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
        <div
            className="group hover:shadow-xl transition-all duration-300 border border-gray-300 bg-white overflow-hidden flex flex-col rounded-2xl"
        >
            {/* Header Section */}
            <div className="p-4 flex items-start justify-between gap-3 bg-gradient-to-b from-gray-50/50 to-white border-b border-gray-200">
                <div className="flex items-center gap-3 overflow-hidden">
                    {/* Avatar */}
                    <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg ring-4 ring-white shrink-0 relative">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="h-full w-full rounded-full object-cover" />
                        ) : (
                            <span className="text-white font-bold text-xl tracking-wide">
                                {getInitials(user.name).charAt(0)}
                            </span>
                        )}
                        {/* Status Indicator */}
                        <div className={`absolute bottom-0 right-0 h-4 w-4 border-[3px] border-white rounded-full z-20 ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>

                    {/* Name & Role Badge */}
                    <div className="flex flex-col min-w-0">
                        <h3 className="font-bold text-gray-900 truncate text-lg leading-tight mb-1" title={user.name}>
                            {user.name}
                        </h3>
                        {/* Interactive Role Badge */}
                        <div className={`flex w-fit whitespace-nowrap items-center px-2 py-0.5 rounded-full text-xs font-medium border ${roleConfig.className}`}>
                            {roleConfig.label}
                        </div>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0">
                    <StatusBadge status={user.isActive ? 'Active' : 'Inactive'} />
                </div>
            </div>

            {/* Details Body */}
            <div className="pt-3 px-4 pb-2 flex flex-col gap-3 flex-1 bg-white">
                {/* Row 1: Contact Information */}
                <InfoRow
                    icon={Phone}
                    label="PHONE"
                    value={user.phone || 'N/A'}
                    colorClass="text-green-600"
                    bgClass="bg-green-50"
                />
                <InfoRow
                    icon={Mail}
                    label="EMAIL"
                    value={user.email || 'N/A'}
                    colorClass="text-blue-600"
                    bgClass="bg-blue-50"
                />

                {/* Row 2: Date Joined */}
                <InfoRow
                    icon={Calendar}
                    label="DATE JOINED"
                    value={user.createdAt ? formatDisplayDate(user.createdAt) : 'N/A'}
                    colorClass="text-purple-600"
                    bgClass="bg-purple-50"
                />

                {/* Row 3: Address */}
                <InfoRow
                    icon={MapPin}
                    label="ADDRESS"
                    value={user.address || 'N/A'}
                    colorClass="text-red-600"
                    bgClass="bg-red-50"
                />
            </div>

            {/* Footer */}
            <div
                className="px-4 py-3.5 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between cursor-pointer transition-all"
                onClick={() => onClick(user)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(user); }}
                role="button"
                tabIndex={0}
            >
                <span className="text-sm font-bold text-gray-600 group-hover:text-indigo-600 transition-colors">
                    View Profile
                </span>
                <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-indigo-600 transform group-hover:translate-x-1 transition-all" />
            </div>
        </div>
    );
};
