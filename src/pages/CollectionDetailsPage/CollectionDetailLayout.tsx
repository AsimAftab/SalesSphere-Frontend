import React from 'react';
import { motion } from 'framer-motion';
import CollectionImagesCard from './components/CollectionImagesCard';
import { Button } from '@/components/ui';
import { ArrowLeft } from 'lucide-react';

interface CollectionDetailLayoutProps {
    // Header
    title: string;
    onBack: () => void;

    // Common Info Card (Left - Top)
    commonInfo: React.ReactNode;

    // Extra Info Card (Right - for payment mode specific details)
    extraInfo?: React.ReactNode;

    // Receipt Images - maximum 2 images
    receiptImages?: string[];
    receiptLabel?: string;
    showReceiptCard?: boolean;
    imagePosition?: 'right';

    // Actions
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

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
};

/**
 * CollectionDetailLayout - Reusable layout for Collection detail pages.
 * Renders header, common info, extra info, and images card.
 * Image handling is delegated to the standalone CollectionImagesCard component.
 */
const CollectionDetailLayout: React.FC<CollectionDetailLayoutProps> = ({
    title,
    onBack,
    commonInfo,
    extraInfo,
    receiptImages = [],
    receiptLabel = 'Receipt Images',
    showReceiptCard = true,
    imagePosition = 'right',
    permissions,
    onEdit,
    onDelete,
    onDeleteImage,
    isDeletingImage,
    onUploadImage,
    isUploadingImage,
}) => {
    return (
        <motion.div className="relative space-y-6" variants={containerVariants} initial="hidden" animate="show">

            {/* Top Header Actions */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-black text-[#202224]">{title}</h1>
                </div>
                <div className="flex flex-row gap-3">
                    {permissions?.canUpdate && onEdit && (
                        <Button variant="secondary" onClick={onEdit} className="h-11 px-6 font-bold shadow-sm">
                            Edit Collection
                        </Button>
                    )}
                    {permissions?.canDelete && onDelete && (
                        <Button variant="danger" onClick={onDelete} className="h-11 px-6 font-bold shadow-sm">
                            Delete Collection
                        </Button>
                    )}
                </div>
            </motion.div>

            {/* Main Content Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

                {/* Left Column: Common Info */}
                <div className="lg:col-span-2 space-y-6 flex flex-col h-full">
                    {/* Common Info Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex-1">
                        {commonInfo}
                    </div>
                </div>

                {/* Right Column: Extra Info & Side Images */}
                {(extraInfo || (imagePosition === 'right' && showReceiptCard)) && (
                    <div className="lg:col-span-1 space-y-6">
                        {extraInfo && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                {extraInfo}
                            </div>
                        )}
                        {imagePosition === 'right' && showReceiptCard && (
                            <CollectionImagesCard
                                images={receiptImages}
                                label={receiptLabel}
                                onUploadImage={onUploadImage}
                                isUploadingImage={isUploadingImage}
                                onDeleteImage={onDeleteImage}
                                isDeletingImage={isDeletingImage}
                            />
                        )}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default CollectionDetailLayout;
