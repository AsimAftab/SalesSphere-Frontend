import React from 'react';
import CollectionDetailLayout from './CollectionDetailLayout';
import CollectionInfoCard from './components/CollectionInfoCard';
import type { Collection } from '@/api/collectionService';
import { InfoBlock } from '@/components/ui';
import { Landmark } from 'lucide-react';

interface BankTransferCollectionDetailsProps {
    collection: Collection;
    onBack: () => void;
    backLabel?: string;
    permissions: {
        canUpdate: boolean;
        canDelete: boolean;
    };
    onEdit?: () => void;
    onDelete?: () => void;
    onDeleteImage?: (imageNumber: number) => void;
    isDeletingImage?: boolean;
    onUploadImage?: (imageNumber: number, file: File) => void;
    isUploadingImage?: boolean;
}

const BankTransferCollectionDetails: React.FC<BankTransferCollectionDetailsProps> = ({
    collection,
    onBack,
    backLabel,
    permissions,
    onEdit,
    onDelete,
    onDeleteImage,
    isDeletingImage,
    onUploadImage,
    isUploadingImage,
}) => {
    const bankInfo = (
        <div className="grid grid-cols-1 gap-y-5">
            <InfoBlock icon={Landmark} label="Bank Name" value={collection.bankName || 'N/A'} />
        </div>
    );

    return (
        <CollectionDetailLayout
            title="Collection Details"
            onBack={onBack}
            backLabel={backLabel}
            // Passing bankInfo as additional row in common info card
            commonInfo={<CollectionInfoCard collection={collection} additionalRow={bankInfo} />}
            receiptImages={collection.images || []}
            receiptLabel="Transfer Proof"
            imagePosition="right"
            permissions={permissions}
            onEdit={onEdit}
            onDelete={onDelete}
            onDeleteImage={onDeleteImage}
            isDeletingImage={isDeletingImage}
            onUploadImage={onUploadImage} // Added
            isUploadingImage={isUploadingImage} // Added
        />
    );
};

export default BankTransferCollectionDetails;
