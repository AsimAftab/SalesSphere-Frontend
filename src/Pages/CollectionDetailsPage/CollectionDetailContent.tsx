import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SkeletonTheme } from 'react-loading-skeleton';
import type { Collection } from '../../api/collectionService';
import CashCollectionDetails from './CashCollectionDetails';
import ChequeCollectionDetails from './ChequeCollectionDetails';
import BankTransferCollectionDetails from './BankTransferCollectionDetails';
import QRPayCollectionDetails from './QRPayCollectionDetails';
import { CollectionDetailSkeleton } from './CollectionDetailSkeleton';

interface CollectionDetailContentProps {
    data: {
        collection: Collection | undefined;
        cachedPaymentMode: 'Cash' | 'Cheque' | 'Bank Transfer' | 'QR Pay' | null;
    };
    state: {
        isLoading: boolean;
        error: string | null;
        isSaving: boolean;
        isDeleting: boolean;
        isDeletingImage?: boolean;
        isUploadingImage?: boolean; // New
        activeModal: 'edit' | 'delete' | null;
    };
    actions: {
        update: (formData: any, files: File[] | null) => Promise<any>;
        delete: () => void;
        deleteImage?: (imageNumber: number) => void;
        uploadImage?: (imageNumber: number, file: File) => void; // New
        openEditModal: () => void;
        openDeleteModal: () => void;
        closeModal: () => void;
    };
    permissions: {
        canUpdate: boolean;
        canDelete: boolean;
    };
}

const CollectionDetailContent: React.FC<CollectionDetailContentProps> = ({
    data,
    state,
    actions,
    permissions,
}) => {
    const navigate = useNavigate();
    const { collection, cachedPaymentMode } = data;

    const handleBack = () => {
        navigate('/collection');
    };

    // Loading State
    if (state.isLoading && !collection) {
        return (
            <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
                <CollectionDetailSkeleton
                    paymentMode={cachedPaymentMode}
                    permissions={permissions}
                />
            </SkeletonTheme>
        );
    }

    // Error State
    if (state.error) {
        return (
            <div className="text-center p-10 text-red-600 bg-red-50 rounded-2xl m-4 font-bold border border-red-100">
                {state.error}
            </div>
        );
    }

    // Not Found State
    if (!collection) {
        return (
            <div className="text-center p-10 text-gray-500 font-black uppercase tracking-widest">
                Collection Details Not Found
            </div>
        );
    }

    // Common props for all payment mode components
    const commonProps = {
        collection,
        onBack: handleBack,
        permissions,
        onEdit: actions.openEditModal,
        onDelete: actions.openDeleteModal,
        onDeleteImage: actions.deleteImage,
        isDeletingImage: state.isDeletingImage,
        onUploadImage: actions.uploadImage,
        isUploadingImage: state.isUploadingImage,
    };

    // Render appropriate component based on payment mode
    switch (collection.paymentMode) {
        case 'Cash':
            return <CashCollectionDetails {...commonProps} />;

        case 'Cheque':
            return <ChequeCollectionDetails {...commonProps} />;

        case 'Bank Transfer':
            return <BankTransferCollectionDetails {...commonProps} />;

        case 'QR Pay':
            return <QRPayCollectionDetails {...commonProps} />;

        default:
            return (
                <div className="text-center p-10 text-gray-500 font-black uppercase tracking-widest">
                    Unknown Payment Mode: {collection.paymentMode}
                </div>
            );
    }
};

export default CollectionDetailContent;
