import React, { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  Clock,
  Mail,
  Pencil,
  Phone,
  RefreshCw,
  Users,
} from 'lucide-react';
import type { OrganizationUser } from '@/api/SuperAdmin/organizationService';
import { StatusBadge, EmptyState, Pagination, MobileCard } from '@/components/ui';
import { getAvatarUrl } from '@/utils/userUtils';

const ITEMS_PER_PAGE = 10;

const UserAvatar: React.FC<{ name: string; avatarUrl?: string }> = ({ name, avatarUrl }) => {
    return (
        <img
            src={getAvatarUrl(avatarUrl, name, 'xs')}
            alt={name}
            className="h-8 w-8 rounded-full object-cover"
        />
    );
};

/* ─── Toggle Switch ─── */
const ToggleSwitch: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => (
    <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}
    >
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
    </button>
);

interface OrganizationUsersTableProps {
    users: OrganizationUser[];
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    onRetry: () => void;
    onToggleAccess?: (userId: string, currentStatus: boolean) => void;
}

const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatRelativeTime = (dateStr?: string) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Never';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 30) return `${diffDay}d ago`;
    return formatDate(dateStr);
};

/* ─── Loading Skeleton ─── */
const SkeletonTable: React.FC = () => (
    <table className="w-full border-collapse table-auto">
        <thead className="bg-gray-100 text-sm">
            <tr>
                <th className="px-3 py-4 text-left w-[50px]"><div className="h-4 w-10 bg-gray-200 rounded" /></th>
                <th className="px-3 py-4 text-left"><div className="h-4 w-12 bg-gray-200 rounded" /></th>
                <th className="px-3 py-4 text-left"><div className="h-4 w-10 bg-gray-200 rounded" /></th>
                <th className="px-3 py-4 text-left"><div className="h-4 w-12 bg-gray-200 rounded" /></th>
                <th className="px-3 py-4 text-left"><div className="h-4 w-12 bg-gray-200 rounded" /></th>
                <th className="px-3 py-4 text-left"><div className="h-4 w-16 bg-gray-200 rounded" /></th>
                <th className="px-3 py-4 text-left"><div className="h-4 w-16 bg-gray-200 rounded" /></th>
                <th className="px-3 py-4 text-left"><div className="h-4 w-16 bg-gray-200 rounded" /></th>
                <th className="px-3 py-4 text-left"><div className="h-4 w-16 bg-gray-200 rounded" /></th>
                <th className="px-3 py-4 text-left"><div className="h-4 w-12 bg-gray-200 rounded" /></th>
                <th className="px-3 py-4 text-left"><div className="h-4 w-16 bg-gray-200 rounded" /></th>
                <th className="px-3 py-4 text-left w-[80px]"><div className="h-4 w-12 bg-gray-200 rounded" /></th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
            {[1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                    <td className="px-3 py-3"><div className="h-4 w-6 bg-gray-200 rounded" /></td>
                    <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                            <div className="h-4 w-16 bg-gray-200 rounded" />
                        </div>
                    </td>
                    <td className="px-3 py-3"><div className="h-4 w-12 bg-gray-200 rounded" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-16 bg-gray-200 rounded" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-14 bg-gray-200 rounded" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-16 bg-gray-200 rounded" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-14 bg-gray-200 rounded" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-16 bg-gray-200 rounded" /></td>
                    <td className="px-3 py-3"><div className="h-5 w-14 bg-gray-200 rounded-full" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-12 bg-gray-200 rounded" /></td>
                    <td className="px-3 py-3"><div className="h-6 w-11 bg-gray-200 rounded-full" /></td>
                </tr>
            ))}
        </tbody>
    </table>
);

/* ─── Mobile Card ─── */
const MobileUserCard: React.FC<{ user: OrganizationUser; index: number; onToggleAccess?: () => void }> = ({ user, index, onToggleAccess }) => {
    // Build details array dynamically
    const details = [
        {
            icon: Mail,
            label: 'Email',
            value: user.email,
            valueClassName: 'font-medium text-gray-900',
        },
        ...(user.phone ? [{
            icon: Phone,
            label: 'Phone',
            value: user.phone,
        }] : []),
        {
            icon: Clock,
            label: 'Last Active',
            value: formatRelativeTime(user.lastActiveAt),
            valueClassName: 'font-medium',
        },
        {
            icon: Calendar,
            label: 'Joined',
            value: `${formatDate(user.createdAt)}${user.createdBy ? ` by ${user.createdBy}` : ''}`,
        },
        ...(user.updatedAt ? [{
            icon: Pencil,
            label: 'Updated',
            value: `${formatDate(user.updatedAt)}${user.updatedBy ? ` by ${user.updatedBy}` : ''}`,
        }] : []),
    ];

    return (
        <MobileCard
            id={user.id}
            header={{
                serialNumber: index,
                title: user.name,
                titleLabel: 'Name',
                avatar: {
                    imageUrl: getAvatarUrl(user.avatarUrl, user.name, 'xs'),
                },
                badge: {
                    type: 'status',
                    status: user.isActive ? 'Active' : 'Inactive',
                },
            }}
            details={details}
            detailsLayout="single"
            footerContent={onToggleAccess && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs font-medium text-gray-600">Access</span>
                    <ToggleSwitch enabled={user.isActive} onChange={onToggleAccess} />
                </div>
            )}
        />
    );
};

/* ─── Main Component ─── */
export const OrganizationUsersTable: React.FC<OrganizationUsersTableProps> = ({
    users,
    isLoading,
    isError,
    error,
    onRetry,
    onToggleAccess
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Pagination logic
    const totalItems = users.length;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedUsers = users.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Reset to page 1 if current page becomes invalid
    if (currentPage > 1 && paginatedUsers.length === 0 && users.length > 0) {
        setCurrentPage(1);
    }

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-secondary" />
                        <h3 className="text-lg font-semibold text-gray-900">Users & Access</h3>
                    </div>
                    {!isLoading && !isError && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-700">
                            {users.length} User{users.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>
            </div>

            {/* Error */}
            {isError && !isLoading && (
                <div className="px-6 py-12 text-center">
                    <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-800">Unable to load users</p>
                    <p className="text-xs text-gray-500 mt-1">{error}</p>
                    <button
                        onClick={onRetry}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Retry
                    </button>
                </div>
            )}

            {/* Loading */}
            {isLoading && <SkeletonTable />}

            {/* Desktop Table */}
            {!isLoading && !isError && users.length > 0 && (
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-secondary text-white text-sm">
                            <tr>
                                <th className="px-3 py-4 text-left font-semibold w-[50px]">S.NO.</th>
                                <th className="px-3 py-4 text-left font-semibold">Name</th>
                                <th className="px-3 py-4 text-left font-semibold">Role</th>
                                <th className="px-3 py-4 text-left font-semibold">Phone</th>
                                <th className="px-3 py-4 text-left font-semibold">Email</th>
                                <th className="px-3 py-4 text-left font-semibold">Created By</th>
                                <th className="px-3 py-4 text-left font-semibold">Created At</th>
                                <th className="px-3 py-4 text-left font-semibold">Updated By</th>
                                <th className="px-3 py-4 text-left font-semibold">Updated At</th>
                                <th className="px-3 py-4 text-left font-semibold">Status</th>
                                <th className="px-3 py-4 text-left font-semibold">Last Active</th>
                                <th className="px-3 py-4 text-left font-semibold w-[80px]">Access</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {paginatedUsers.map((user, index) => (
                                <tr key={user.id} className="hover:bg-gray-200 transition-colors">
                                    <td className="px-3 py-3 text-black text-sm">{startIndex + index + 1}</td>
                                    <td className="px-3 py-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <UserAvatar name={user.name} avatarUrl={user.avatarUrl} />
                                            <span className="font-medium text-black">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3 text-black text-sm">{user.role}</td>
                                    <td className="px-3 py-3 text-black text-sm">{user.phone || '—'}</td>
                                    <td className="px-3 py-3 text-black text-sm">{user.email}</td>
                                    <td className="px-3 py-3 text-black text-sm">{user.createdBy || '—'}</td>
                                    <td className="px-3 py-3 text-black text-sm">{formatDate(user.createdAt)}</td>
                                    <td className="px-3 py-3 text-black text-sm">{user.updatedBy || '—'}</td>
                                    <td className="px-3 py-3 text-black text-sm">{user.updatedAt ? formatDate(user.updatedAt) : '—'}</td>
                                    <td className="px-3 py-3">
                                        <StatusBadge status={user.isActive ? 'Active' : 'Inactive'} />
                                    </td>
                                    <td className="px-3 py-3 text-black text-sm">{formatRelativeTime(user.lastActiveAt)}</td>
                                    <td className="px-3 py-3">
                                        <ToggleSwitch
                                            enabled={user.isActive}
                                            onChange={() => onToggleAccess?.(user.id, user.isActive)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Mobile List */}
            {!isLoading && !isError && users.length > 0 && (
                <div className="md:hidden space-y-3 p-4">
                    {paginatedUsers.map((user, index) => (
                        <MobileUserCard
                            key={user.id}
                            user={user}
                            index={startIndex + index + 1}
                            onToggleAccess={onToggleAccess ? () => onToggleAccess(user.id, user.isActive) : undefined}
                        />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && users.length === 0 && (
                <div className="px-6 py-12">
                    <EmptyState
                        title="No Users Found"
                        description="No users are associated with this organization yet."
                        icon={<Users className="w-12 h-12 text-gray-300" />}
                    />
                </div>
            )}
            </div>

            {/* Pagination - Outside the card */}
            {!isLoading && !isError && users.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
};
