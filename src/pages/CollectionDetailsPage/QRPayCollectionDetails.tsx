import React from 'react';
import CollectionDetailLayout from './CollectionDetailLayout';
import CollectionInfoCard from './components/CollectionInfoCard';
import type { Collection } from '@/api/collectionService';

interface QRPayCollectionDetailsProps {
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

const QRPayCollectionDetails: React.FC<QRPayCollectionDetailsProps> = ({
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
    return (
        <CollectionDetailLayout
            title="Collection Details"
            onBack={onBack}
            backLabel={backLabel}
            commonInfo={<CollectionInfoCard collection={collection} />}
            receiptImages={collection.images || []}
            receiptLabel="Payment Screenshot"
            imagePosition="right"
            permissions={permissions}
            onEdit={onEdit}
            onDelete={onDelete}
            onDeleteImage={onDeleteImage}
            isDeletingImage={isDeletingImage}
            onUploadImage={onUploadImage}
            isUploadingImage={isUploadingImage}
        />
    );
};

export default QRPayCollectionDetails;
