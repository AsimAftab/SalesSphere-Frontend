import React from 'react';
import {
  AlertCircle,
  Calendar,
  Clock,
  Pencil,
  Phone,
  RefreshCw,
  Users,
} from 'lucide-react';
import type { OrganizationUser } from '@/api/SuperAdmin/organizationService';
import { StatusBadge, EmptyState } from '@/components/ui';

const UserAvatar: React.FC<{ name: string; avatarUrl?: string }> = ({ name, avatarUrl }) => {
    const initial = name?.charAt(0)?.toUpperCase() || '?';
    const src = avatarUrl || `https://placehold.co/32x32/197ADC/ffffff?text=${initial}`;
    return (
        <img
            src={src}
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
const MobileUserCard: React.FC<{ user: OrganizationUser; index: number; onToggleAccess?: () => void }> = ({ user, index, onToggleAccess }) => (
    <div className="p-4 rounded-xl border shadow-sm bg-white border-gray-200">
        {/* Top: Index, Name & Status */}
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-5">{index}</span>
                <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Name</span>
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">{user.name}</h3>
                </div>
            </div>
            <StatusBadge status={user.isActive ? 'Active' : 'Inactive'} />
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 gap-2.5 ml-8">
            <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="font-medium text-gray-900">{user.email}</span>
            </div>
            {user.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Phone size={13} className="text-gray-400 shrink-0" />
                    <span>{user.phone}</span>
                </div>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock size={13} className="text-gray-400 shrink-0" />
                <span>Last active: <span className="font-medium">{formatRelativeTime(user.lastActiveAt)}</span></span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar size={13} className="text-gray-400 shrink-0" />
                <span>Joined {formatDate(user.createdAt)}{user.createdBy ? ` by ${user.createdBy}` : ''}</span>
            </div>
            {user.updatedAt && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Pencil size={13} className="text-gray-400 shrink-0" />
                    <span>Updated {formatDate(user.updatedAt)}{user.updatedBy ? ` by ${user.updatedBy}` : ''}</span>
                </div>
            )}
            {onToggleAccess && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-1">
                    <span className="text-xs font-medium text-gray-600">Access</span>
                    <ToggleSwitch enabled={user.isActive} onChange={onToggleAccess} />
                </div>
            )}
        </div>
    </div>
);

/* ─── Main Component ─── */
export const OrganizationUsersTable: React.FC<OrganizationUsersTableProps> = ({
    users,
    isLoading,
    isError,
    error,
    onRetry,
    onToggleAccess
}) => {
    return (
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
                            {users.map((user, index) => (
                                <tr key={user.id} className="hover:bg-gray-200 transition-colors">
                                    <td className="px-3 py-3 text-black text-sm">{index + 1}</td>
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
                    {users.map((user, index) => (
                        <MobileUserCard
                            key={user.id}
                            user={user}
                            index={index + 1}
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
    );
};
