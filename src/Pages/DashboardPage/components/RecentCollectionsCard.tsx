import { DashboardMapper } from '../../../api/dashboard';
import InfoCard from '../../../components/UI/shared_cards/InfoCard';
import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { EmptyState } from '../../../components/UI/EmptyState/EmptyState';
import { formatDisplayDate } from '../../../utils/dateUtils';
import type { FlattenedCollection } from './useDashboardViewState';

interface RecentCollectionsCardProps {
    collections: FlattenedCollection[];
}

const RecentCollectionsCard: React.FC<RecentCollectionsCardProps> = ({ collections }) => {
    return (
        <InfoCard
            title="Recent Collections (Last 10 Days)"
            footer={
                <Link to="/collection" className="block w-full text-center text-sm font-medium text-secondary hover:text-blue-700 hover:underline transition-all">
                    View All Collections →
                </Link>
            }
        >
            {collections.length === 0 ? (
                <EmptyState
                    title="No Recent Collections"
                    description="No payments have been recorded in the last 10 days. Track new payments to see them here."
                    icon={<Wallet className="w-10 h-10 text-blue-200" />}
                />
            ) : (
                <div className="overflow-auto h-full pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    <table className="min-w-full relative border-separate border-spacing-0">
                        <thead className="bg-white sticky top-0 z-10 shadow-sm">
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-white border-b border-gray-200">Date</th>
                                <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-white border-b border-gray-200">Payment Mode</th>
                                <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-white border-b border-gray-200">Party Name</th>
                                <th className="text-right py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-white border-b border-gray-200">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {collections.map((collection) => (
                                <tr key={collection.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="py-3 px-2 text-sm text-gray-900 whitespace-nowrap">
                                        {formatDisplayDate(collection.receivedDate)}
                                    </td>
                                    <td className="py-3 px-2 text-sm text-gray-900">
                                        {DashboardMapper.formatPaymentMode(collection.paymentMode)}
                                    </td>
                                    <td className="py-3 px-2 text-sm text-gray-900 font-medium">
                                        {collection.partyName}
                                    </td>
                                    <td className="py-3 px-2 text-right text-sm font-bold text-green-600">
                                        {DashboardMapper.formatCurrency(collection.paidAmount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </InfoCard>
    );
};

export default RecentCollectionsCard;
