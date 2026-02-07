import React from 'react';
import { toast } from 'react-hot-toast';
import CollectionDetailLayout from './CollectionDetailLayout';
import CollectionInfoCard from './components/CollectionInfoCard';
import type { Collection } from '@/api/collectionService';
import { formatDisplayDate } from '@/utils/dateUtils';
import { InfoBlock } from '@/components/ui';
import {
    CalendarDays,
    Copy,
    FileText,
    Landmark,
} from 'lucide-react';

interface ChequeCollectionDetailsProps {
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
    backLabel,
    permissions,
    onEdit,
    onDelete,
    onDeleteImage,
    isDeletingImage,
    onUploadImage,
    isUploadingImage,
}) => {
    // Cheque Details Row
    const chequeDetailsRow = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 w-full">
            <InfoBlock icon={Landmark} label="Bank Name" value={collection.bankName || 'N/A'} />
            <InfoBlock icon={Copy} label="Cheque Number" value={collection.chequeNumber || 'N/A'} />
            <InfoBlock
                icon={CalendarDays}
                label="Cheque Date"
                value={collection.chequeDate ? formatDisplayDate(collection.chequeDate) : 'N/A'}
            />
            {/* Custom Status Badge Info Block */}
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                    <h4 className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">
                        Cheque Status
                    </h4>
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-full border ${collection.chequeStatus ? getChequeStatusStyle(collection.chequeStatus) : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {collection.chequeStatus || 'Pending'}
                    </span>
                </div>
            </div>
        </div>
    );

    const handleEdit = () => {
        if (!onEdit) return;

        if (collection.chequeStatus === 'Cleared') {
            toast.error("This cheque has been Cleared and cannot be edited.");
            return;
        }

        onEdit();
    };

    const handleDeleteImage = (imageNumber: number) => {
        if (!onDeleteImage) return;

        if (collection.chequeStatus === 'Cleared') {
            toast.error("Cannot delete images from a Cleared cheque.");
            return;
        }

        onDeleteImage(imageNumber);
    };

    return (
        <CollectionDetailLayout
            title="Collection Details"
            onBack={onBack}
            backLabel={backLabel}
            commonInfo={<CollectionInfoCard collection={collection} additionalRow={chequeDetailsRow} />}
            extraInfo={null}
            imagePosition="right"
            receiptImages={collection.images || []}
            receiptLabel="Cheque Images"
            permissions={permissions}
            onEdit={handleEdit}
            onDelete={onDelete}
            onDeleteImage={handleDeleteImage}
            isDeletingImage={isDeletingImage}
            onUploadImage={onUploadImage}
            isUploadingImage={isUploadingImage}
        />
    );
};

export default ChequeCollectionDetails;
