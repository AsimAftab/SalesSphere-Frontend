import React from 'react';
import type { Collection } from '@/api/collectionService';
import { formatDisplayDate } from '@/utils/dateUtils';
import { InfoBlock } from '@/components/ui';
import {
    Banknote,
    CalendarDays,
    CreditCard,
    FileText,
    User,
} from 'lucide-react';

interface CollectionInfoCardProps {
    collection: Collection;
    additionalRow?: React.ReactNode;
}

const CollectionInfoCard: React.FC<CollectionInfoCardProps> = ({ collection, additionalRow }) => {
    return (
        <>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                    <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-black text-black">Collection Information</h3>
            </div>

            <hr className="border-gray-200 -mx-8 mb-5" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5">
                <InfoBlock icon={User} label="Party Name" value={collection.partyName} />
                <InfoBlock icon={Banknote} label="Amount Received" value={`Rs. ${collection.paidAmount.toLocaleString('en-IN')}`} />
                <InfoBlock icon={CreditCard} label="Payment Mode" value={collection.paymentMode} />
                <InfoBlock
                    icon={CalendarDays}
                    label="Received Date"
                    value={collection.receivedDate ? formatDisplayDate(collection.receivedDate) : 'N/A'}
                />

                <InfoBlock icon={User} label="Created By" value={collection.createdBy.name} />
                <InfoBlock
                    icon={CalendarDays}
                    label="Created Date"
                    value={collection.createdAt ? formatDisplayDate(collection.createdAt) : ''}
                />

                {/* Additional Row (e.g. Bank Details) */}
                {additionalRow && (
                    <div className="md:col-span-2">
                        {additionalRow}
                    </div>
                )}

            </div>

            <hr className="border-gray-200 -mx-8 mt-4 mb-4" />

            <div>
                <InfoBlock
                    icon={FileText}
                    label="Description"
                    value={`${collection.notes || 'No additional notes provided for this collection.'}`}
                />
            </div>
        </>
    );
};

export default CollectionInfoCard;
