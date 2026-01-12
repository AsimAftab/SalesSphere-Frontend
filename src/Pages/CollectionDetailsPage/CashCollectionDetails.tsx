import React from 'react';
import CollectionDetailLayout from './CollectionDetailLayout';
import CollectionInfoCard from './components/CollectionInfoCard';
import type { Collection } from '../../api/collectionService';

interface CashCollectionDetailsProps {
    collection: Collection;
    onBack: () => void;
    permissions: {
        canUpdate: boolean;
        canDelete: boolean;
    };
    onEdit?: () => void;
    onDelete?: () => void;
}

const CashCollectionDetails: React.FC<CashCollectionDetailsProps> = ({
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
            showReceiptCard={false}
            permissions={permissions}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    );
};

export default CashCollectionDetails;


