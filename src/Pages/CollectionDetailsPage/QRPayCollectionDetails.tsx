import React from 'react';
import CollectionDetailLayout from './CollectionDetailLayout';
import CollectionInfoCard from './components/CollectionInfoCard';
import type { Collection } from '../../api/collectionService';

interface QRPayCollectionDetailsProps {
    collection: Collection;
    onBack: () => void;
    permissions: {
        canUpdate: boolean;
        canDelete: boolean;
    };
    onEdit?: () => void;
    onDelete?: () => void;
}

const QRPayCollectionDetails: React.FC<QRPayCollectionDetailsProps> = ({
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
            commonInfo={<CollectionInfoCard collection={collection} />}
            receiptImages={collection.receiptUrl ? [collection.receiptUrl, ...(collection.images || [])] : (collection.images || [])}
            receiptLabel="Payment Proof"
            imagePosition="right"
            permissions={permissions}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    );
};

export default QRPayCollectionDetails;
