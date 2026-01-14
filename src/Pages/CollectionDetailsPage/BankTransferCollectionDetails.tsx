import React from 'react';
import {
    BuildingLibraryIcon,
} from '@heroicons/react/24/outline';
import CollectionDetailLayout from './CollectionDetailLayout';
import CollectionInfoCard from './components/CollectionInfoCard';
import InfoBlock from '../../components/UI/Page/InfoBlock';
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
    onDeleteImage?: (imageNumber: number) => void;
    isDeletingImage?: boolean;
    onUploadImage?: (imageNumber: number, file: File) => void; // Added
    isUploadingImage?: boolean; // Added
}

const BankTransferCollectionDetails: React.FC<BankTransferCollectionDetailsProps> = ({
    collection,
    onBack,
    permissions,
    onEdit,
    onDelete,
    onDeleteImage,
    isDeletingImage,
    onUploadImage, // Added
    isUploadingImage, // Added
}) => {
    const bankInfo = (
        <div className="grid grid-cols-1 gap-y-5">
            <InfoBlock icon={BuildingLibraryIcon} label="Bank Name" value={collection.bankName || 'N/A'} />
        </div>
    );

    return (
        <CollectionDetailLayout
            title="Collection Details"
            onBack={onBack}
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
