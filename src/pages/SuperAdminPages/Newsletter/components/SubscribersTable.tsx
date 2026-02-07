import React from 'react';
import { Calendar, Clock, Globe, Mail } from 'lucide-react';
import {
    Pagination,
    EmptyState,
    StatusBadge,
    Checkbox,
    MobileCard,
    MobileCardList,
} from '@/components/ui';
import type { MobileCardDetailRow } from '@/components/ui';
import type { Subscriber } from '../types';
import { SOURCE_LABELS } from '../constants';
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
    searchQuery: string;
    filterActive: boolean | null;
    loading?: boolean;
    selection?: SelectionState;
}

const SubscribersTable: React.FC<SubscribersTableProps> = ({
    subscribers,
    totalItems,
    currentPage,
    itemsPerPage,
    onPageChange,
    searchQuery,
    filterActive,
    loading = false,
    selection,
}) => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    // Calculate if some (but not all) are selected for indeterminate state
    const activeOnPage = subscribers.filter((s) => s.isActive);
    const selectedOnPage = activeOnPage.filter((s) =>
        selection?.selectedEmails.has(s.email)
    );
    const someSelected =
        selectedOnPage.length > 0 && selectedOnPage.length < activeOnPage.length;

    // Build mobile card details for a subscriber
    const buildMobileCardDetails = (subscriber: Subscriber): MobileCardDetailRow[] => {
        const sourceLabel = SOURCE_LABELS[subscriber.source] || SOURCE_LABELS.other;
        const details: MobileCardDetailRow[] = [
            {
                icon: Globe,
                iconColor: 'text-gray-400',
                label: 'Source',
                value: sourceLabel,
            },
            {
                icon: Calendar,
                iconColor: 'text-gray-400',
                label: 'Subscribed',
                value: formatDisplayDateTime(subscriber.createdAt),
            },
        ];

        if (subscriber.unsubscribedAt) {
            details.push({
                icon: Clock,
                iconColor: 'text-gray-400',
                label: 'Unsubscribed',
                value: formatDisplayDateTime(subscriber.unsubscribedAt),
            });
        }

        return details;
    };

    if (loading) {
        return null; // Loading state is handled by NewsletterSkeleton
    }

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
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-700">
                            {totalItems} Subscriber{totalItems !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            </div>

            {/* Desktop Table */}
            {subscribers.length > 0 && (
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-secondary text-white text-sm">
                            <tr>
                                {selection && (
                                    <th className="px-3 py-4 w-[50px]">
                                        <Checkbox
                                            checked={
                                                selection.allActiveSelected &&
                                                activeOnPage.length > 0
                                            }
                                            indeterminate={someSelected}
                                            onChange={selection.onSelectAll}
                                            disabled={activeOnPage.length === 0}
                                        />
                                    </th>
                                )}
                                <th className="px-3 py-4 text-left font-semibold w-[50px]">
                                    S.NO.
                                </th>
                                <th className="px-3 py-4 text-left font-semibold">Email</th>
                                <th className="px-3 py-4 text-left font-semibold">Source</th>
                                <th className="px-3 py-4 text-left font-semibold">
                                    Subscribed Date
                                </th>
                                <th className="px-3 py-4 text-left font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {subscribers.map((subscriber, index) => {
                                const sourceLabel =
                                    SOURCE_LABELS[subscriber.source] || SOURCE_LABELS.other;
                                const isSelected =
                                    selection?.selectedEmails.has(subscriber.email) ?? false;
                                return (
                                    <tr
                                        key={subscriber._id}
                                        className={`hover:bg-gray-50 transition-colors ${
                                            isSelected ? 'bg-secondary/5' : ''
                                        }`}
                                    >
                                        {selection && (
                                            <td className="px-3 py-3">
                                                {subscriber.isActive ? (
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onChange={() =>
                                                            selection.onSelectSubscriber(
                                                                subscriber.email
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <Checkbox
                                                        checked={false}
                                                        onChange={() => {}}
                                                        disabled
                                                    />
                                                )}
                                            </td>
                                        )}
                                        <td className="px-3 py-3 text-gray-900 text-sm">
                                            {startIndex + index + 1}
                                        </td>
                                        <td className="px-3 py-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                                    <Mail className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <span className="font-medium text-gray-900">
                                                    {subscriber.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 text-gray-900 text-sm">
                                            {sourceLabel}
                                        </td>
                                        <td className="px-3 py-3 text-gray-900 text-sm">
                                            {formatDisplayDateTime(subscriber.createdAt)}
                                        </td>
                                        <td className="px-3 py-3">
                                            <StatusBadge
                                                status={subscriber.isActive ? 'Active' : 'Inactive'}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Mobile List */}
            {subscribers.length > 0 && (
                <MobileCardList className="p-4">
                    {subscribers.map((subscriber, index) => {
                        const isSelected =
                            selection?.selectedEmails.has(subscriber.email) ?? false;
                        return (
                            <MobileCard
                                key={subscriber._id}
                                id={subscriber._id}
                                header={{
                                    selectable: selection && subscriber.isActive,
                                    isSelected,
                                    onToggleSelection: selection
                                        ? () => selection.onSelectSubscriber(subscriber.email)
                                        : undefined,
                                    serialNumber: startIndex + index + 1,
                                    title: subscriber.email,
                                    titleLabel: 'Email',
                                    badge: {
                                        type: 'status',
                                        status: subscriber.isActive ? 'Active' : 'Inactive',
                                    },
                                }}
                                details={buildMobileCardDetails(subscriber)}
                                detailsLayout="single"
                            />
                        );
                    })}
                </MobileCardList>
            )}

            {/* Empty State */}
            {subscribers.length === 0 && (
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
            {subscribers.length > 0 && (
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
