import React from 'react';
import {
    Calendar,
    Clock,
    Globe,
    Mail,
} from 'lucide-react';
import { Pagination, EmptyState, StatusBadge } from '@/components/ui';
import type { Subscriber } from '../types';
import { formatDisplayDateTime } from '@/utils/dateUtils';

interface SelectionState {
    selectedEmails: Set<string>;
    allActiveSelected: boolean;
    onSelectSubscriber: (email: string) => void;
    onSelectAll: () => void;
}

interface SubscribersTableProps {
    subscribers: Subscriber[];
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onUnsubscribe: (email: string) => void;
    onResubscribe: (email: string) => void;
    searchQuery: string;
    filterActive: boolean | null;
    loading?: boolean;
    selection?: SelectionState;
}

const sourceLabels: Record<string, string> = {
    website: 'Website',
    'landing-page': 'Landing Page',
    referral: 'Referral',
    other: 'Other',
};

/* ─── Checkbox Component ─── */
const Checkbox: React.FC<{
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
    indeterminate?: boolean;
}> = ({ checked, onChange, disabled = false, indeterminate = false }) => (
    <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${disabled
                ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
                : checked || indeterminate
                    ? 'border-secondary bg-secondary'
                    : 'border-gray-300 bg-white hover:border-secondary'
            }`}
    >
        {checked && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        )}
        {indeterminate && !checked && (
            <div className="w-2.5 h-0.5 bg-white rounded" />
        )}
    </button>
);

/* ─── Loading Skeleton ─── */
const SkeletonTable: React.FC<{ hasSelection: boolean }> = ({ hasSelection }) => (
    <table className="w-full border-collapse table-auto">
        <thead className="bg-secondary text-white text-sm">
            <tr>
                {hasSelection && <th className="px-3 py-4 w-[50px]" />}
                <th className="px-3 py-4 text-left font-semibold w-[50px]">S.NO.</th>
                <th className="px-3 py-4 text-left font-semibold">Email</th>
                <th className="px-3 py-4 text-left font-semibold">Source</th>
                <th className="px-3 py-4 text-left font-semibold">Subscribed Date</th>
                <th className="px-3 py-4 text-left font-semibold">Status</th>
                <th className="px-3 py-4 text-left font-semibold w-[100px]">Actions</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
            {[1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                    {hasSelection && <td className="px-3 py-3"><div className="h-5 w-5 bg-gray-200 rounded" /></td>}
                    <td className="px-3 py-3"><div className="h-4 w-6 bg-gray-200 rounded" /></td>
                    <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                            <div className="h-4 w-32 bg-gray-200 rounded" />
                        </div>
                    </td>
                    <td className="px-3 py-3"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
                    <td className="px-3 py-3"><div className="h-5 w-16 bg-gray-200 rounded-full" /></td>
                    <td className="px-3 py-3"><div className="h-8 w-8 bg-gray-200 rounded-lg" /></td>
                </tr>
            ))}
        </tbody>
    </table>
);

/* ─── Mobile Card ─── */
const MobileSubscriberCard: React.FC<{
    subscriber: Subscriber;
    index: number;
    onUnsubscribe: () => void;
    onResubscribe: () => void;
    isSelected?: boolean;
    onSelect?: () => void;
}> = ({ subscriber, index, onUnsubscribe, onResubscribe, isSelected = false, onSelect }) => {
    const sourceLabel = sourceLabels[subscriber.source] || sourceLabels.other;

    return (
        <div className={`p-4 rounded-xl border shadow-sm bg-white ${isSelected ? 'border-secondary ring-1 ring-secondary/20' : 'border-gray-200'}`}>
            {/* Top: Checkbox, Index, Email & Status */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    {onSelect && subscriber.isActive && (
                        <Checkbox
                            checked={isSelected}
                            onChange={onSelect}
                        />
                    )}
                    <span className="text-xs font-bold text-gray-400 w-5">{index}</span>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Email</span>
                        <h3 className="text-sm font-bold text-gray-900 leading-tight truncate">{subscriber.email}</h3>
                    </div>
                </div>
                <StatusBadge status={subscriber.isActive ? 'Active' : 'Inactive'} />
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 gap-2.5 ml-8">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Globe size={13} className="text-gray-400 shrink-0" />
                    <span>Source: <span className="font-medium text-gray-900">{sourceLabel}</span></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar size={13} className="text-gray-400 shrink-0" />
                    <span>Subscribed: <span className="font-medium">{formatDisplayDateTime(subscriber.createdAt)}</span></span>
                </div>
                {subscriber.unsubscribedAt && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock size={13} className="text-gray-400 shrink-0" />
                        <span>Unsubscribed: <span className="font-medium">{formatDisplayDateTime(subscriber.unsubscribedAt)}</span></span>
                    </div>
                )}
                <div className="flex items-center justify-end pt-2 border-t border-gray-100 mt-1">
                    {subscriber.isActive ? (
                        <button
                            onClick={onUnsubscribe}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-md hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-all"
                        >
                            Unsubscribe
                        </button>
                    ) : (
                        <button
                            onClick={onResubscribe}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-md hover:text-green-600 hover:border-green-300 hover:bg-green-50 transition-all"
                        >
                            Resubscribe
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─── Main Component ─── */
const SubscribersTable: React.FC<SubscribersTableProps> = ({
    subscribers,
    totalItems,
    currentPage,
    itemsPerPage,
    onPageChange,
    onUnsubscribe,
    onResubscribe,
    searchQuery,
    filterActive,
    loading = false,
    selection
}) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const hasSelection = Boolean(selection);

    // Calculate if some (but not all) are selected for indeterminate state
    const activeOnPage = subscribers.filter(s => s.isActive);
    const selectedOnPage = activeOnPage.filter(s => selection?.selectedEmails.has(s.email));
    const someSelected = selectedOnPage.length > 0 && selectedOnPage.length < activeOnPage.length;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-secondary" />
                        <h3 className="text-lg font-semibold text-gray-900">Subscribers</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        {selection && selection.selectedEmails.size > 0 && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-secondary/10 text-secondary">
                                {selection.selectedEmails.size} Selected
                            </span>
                        )}
                        {!loading && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-700">
                                {totalItems} Subscriber{totalItems !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Loading */}
            {loading && <SkeletonTable hasSelection={hasSelection} />}

            {/* Desktop Table */}
            {!loading && subscribers.length > 0 && (
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-secondary text-white text-sm">
                            <tr>
                                {selection && (
                                    <th className="px-3 py-4 w-[50px]">
                                        <Checkbox
                                            checked={selection.allActiveSelected && activeOnPage.length > 0}
                                            indeterminate={someSelected}
                                            onChange={selection.onSelectAll}
                                            disabled={activeOnPage.length === 0}
                                        />
                                    </th>
                                )}
                                <th className="px-3 py-4 text-left font-semibold w-[50px]">S.NO.</th>
                                <th className="px-3 py-4 text-left font-semibold">Email</th>
                                <th className="px-3 py-4 text-left font-semibold">Source</th>
                                <th className="px-3 py-4 text-left font-semibold">Subscribed Date</th>
                                <th className="px-3 py-4 text-left font-semibold">Status</th>
                                <th className="px-3 py-4 text-left font-semibold w-[100px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {subscribers.map((subscriber, index) => {
                                const sourceLabel = sourceLabels[subscriber.source] || sourceLabels.other;
                                const isSelected = selection?.selectedEmails.has(subscriber.email) ?? false;
                                return (
                                    <tr
                                        key={subscriber._id}
                                        className={`hover:bg-gray-200 transition-colors ${isSelected ? 'bg-secondary/5' : ''}`}
                                    >
                                        {selection && (
                                            <td className="px-3 py-3">
                                                {subscriber.isActive ? (
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onChange={() => selection.onSelectSubscriber(subscriber.email)}
                                                    />
                                                ) : (
                                                    <Checkbox checked={false} onChange={() => { }} disabled />
                                                )}
                                            </td>
                                        )}
                                        <td className="px-3 py-3 text-black text-sm">{startIndex + index + 1}</td>
                                        <td className="px-3 py-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                                    <Mail className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <span className="font-medium text-black">{subscriber.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 text-black text-sm">{sourceLabel}</td>
                                        <td className="px-3 py-3 text-black text-sm">
                                            {formatDisplayDateTime(subscriber.createdAt)}
                                        </td>
                                        <td className="px-3 py-3">
                                            <StatusBadge status={subscriber.isActive ? 'Active' : 'Inactive'} />
                                        </td>
                                        <td className="px-3 py-3">
                                            {subscriber.isActive ? (
                                                <button
                                                    onClick={() => onUnsubscribe(subscriber.email)}
                                                    className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-md hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-all"
                                                >
                                                    Unsubscribe
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => onResubscribe(subscriber.email)}
                                                    className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-md hover:text-green-600 hover:border-green-300 hover:bg-green-50 transition-all"
                                                >
                                                    Resubscribe
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Mobile List */}
            {!loading && subscribers.length > 0 && (
                <div className="md:hidden space-y-3 p-4">
                    {subscribers.map((subscriber, index) => (
                        <MobileSubscriberCard
                            key={subscriber._id}
                            subscriber={subscriber}
                            index={startIndex + index + 1}
                            onUnsubscribe={() => onUnsubscribe(subscriber.email)}
                            onResubscribe={() => onResubscribe(subscriber.email)}
                            isSelected={selection?.selectedEmails.has(subscriber.email)}
                            onSelect={selection ? () => selection.onSelectSubscriber(subscriber.email) : undefined}
                        />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && subscribers.length === 0 && (
                <div className="px-6 py-12">
                    <EmptyState
                        title={
                            searchQuery
                                ? 'No Results Found'
                                : filterActive === true
                                    ? 'No Active Subscribers'
                                    : filterActive === false
                                        ? 'No Unsubscribed Users'
                                        : 'No Subscribers'
                        }
                        description={
                            searchQuery
                                ? 'No subscribers match your search criteria.'
                                : filterActive === true
                                    ? 'There are no active subscribers at the moment.'
                                    : filterActive === false
                                        ? 'No users have unsubscribed from the newsletter.'
                                        : 'No one has subscribed to the newsletter yet.'
                        }
                        icon={<Mail className="w-12 h-12 text-gray-300" />}
                    />
                </div>
            )}

            {/* Pagination */}
            {!loading && subscribers.length > 0 && (
                <div className="border-t border-gray-200">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default SubscribersTable;
