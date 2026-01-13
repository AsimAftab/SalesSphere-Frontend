import React from 'react';
import {
    BuildingLibraryIcon,
} from '@heroicons/react/24/outline';
import CollectionDetailLayout from './CollectionDetailLayout';
import CollectionInfoCard from './components/CollectionInfoCard';
import type { Collection } from '../../api/collectionService';

interface BankTransferCollectionDetailsProps {
    collection: Collection;
    onBack: () => void;
    permissions: {
        canUpdate: boolean;
        canDelete: boolean;
    };
    onEdit?: () => void;
    onDelete?: () => void;
}

const BankTransferCollectionDetails: React.FC<BankTransferCollectionDetailsProps> = ({
    collection,
    onBack,
    permissions,
    onEdit,
    onDelete,
}) => {
    return (
        <CollectionDetailLayout
            title="Collection Details"
            onBack={onBack}
            commonInfo={
                <CollectionInfoCard collection={collection}>
                    <div className="mt-2 pt-2 border-t border-gray-100 -mx-8 px-8">
                        <div className="bg-purple-100 rounded-xl p-3 border border-purple-100 flex items-center gap-4 shadow-sm">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-purple-100 shadow-sm shrink-0">
                                <BuildingLibraryIcon className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-0.5">Transferred / Deposited To Bank</h4>
                                <p className="text-base font-black text-gray-900">{collection.bankName || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </CollectionInfoCard>
            }
            receiptImages={collection.images || []}
            receiptLabel="Transaction Proof"
            imagePosition="right"
            permissions={permissions}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    );
};

export default BankTransferCollectionDetails;
