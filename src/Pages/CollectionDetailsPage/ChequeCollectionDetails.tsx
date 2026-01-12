import React from 'react';
import {
    CalendarDaysIcon,
    DocumentTextIcon,
    BuildingLibraryIcon,
    DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import InfoBlock from '../../components/UI/Page/InfoBlock';
import CollectionDetailLayout from './CollectionDetailLayout';
import CollectionInfoCard from './components/CollectionInfoCard';
import type { Collection } from '../../api/collectionService';

interface ChequeCollectionDetailsProps {
    collection: Collection;
    onBack: () => void;
    permissions: {
        canUpdate: boolean;
        canDelete: boolean;
    };
    onEdit?: () => void;
    onDelete?: () => void;
}

// Cheque Status Badge Colors
const getChequeStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
        Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        Deposited: 'bg-blue-50 text-blue-700 border-blue-200',
        Cleared: 'bg-green-50 text-green-700 border-green-200',
        Bounced: 'bg-red-50 text-red-700 border-red-200',
    };
    return styles[status] || styles.Pending;
};

const ChequeCollectionDetails: React.FC<ChequeCollectionDetailsProps> = ({
    collection,
    onBack,
    permissions,
    onEdit,
    onDelete,
}) => {
    // Extra Info Block (Cheque-specific fields)
    const extraInfo = (
        <>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-100">
                        <DocumentDuplicateIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-black text-black">Cheque Details</h3>
                </div>
                {collection.chequeStatus && (
                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${getChequeStatusStyle(collection.chequeStatus)}`}>
                        {collection.chequeStatus}
                    </span>
                )}
            </div>

            <hr className="border-gray-200 -mx-8 mb-5" />

            <div className="grid grid-cols-1 gap-y-5    ">
                <InfoBlock icon={BuildingLibraryIcon} label="Bank Name" value={collection.bankName || 'N/A'} />
                <InfoBlock icon={DocumentDuplicateIcon} label="Cheque Number" value={collection.chequeNumber || 'N/A'} />
                <InfoBlock
                    icon={CalendarDaysIcon}
                    label="Cheque Date"
                    value={collection.chequeDate
                        ? new Date(collection.chequeDate).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })
                        : 'N/A'
                    }
                />
                <InfoBlock
                    icon={DocumentTextIcon}
                    label="Cheque Status"
                    value={collection.chequeStatus || 'Pending'}
                />
            </div>
        </>
    );

    return (
        <CollectionDetailLayout
            title="Collection Details"
            onBack={onBack}
            commonInfo={<CollectionInfoCard collection={collection} />}
            extraInfo={extraInfo}
            receiptImages={collection.receiptUrl ? [collection.receiptUrl, ...(collection.images || [])] : (collection.images || [])}
            receiptLabel="Cheque Images"
            permissions={permissions}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    );
};

export default ChequeCollectionDetails;
