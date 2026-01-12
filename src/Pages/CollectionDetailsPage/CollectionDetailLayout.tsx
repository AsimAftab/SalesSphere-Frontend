import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Button from '../../components/UI/Button/Button';
import ImagePreviewModal from '../../components/modals/ImagePreviewModal';

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
    imagePosition?: 'bottom' | 'right';

    // Actions
    permissions: {
        canUpdate: boolean;
        canDelete: boolean;
    };
    onEdit?: () => void;
    onDelete?: () => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
};

// ImageThumbnail component matching SiteDetailsPage design
interface ImageThumbnailProps {
    image: string;
    index: number;
    onPreview: () => void;
}

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({
    image,
    index,
    onPreview,
}) => {
    return (
        <div className="relative aspect-square rounded-lg overflow-hidden group">
            <img
                src={image}
                alt={`Receipt ${index + 1}`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={onPreview}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all" />
            <button
                onClick={onPreview}
                className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Preview image"
            >
                <PhotoIcon className="w-8 h-8" />
            </button>
        </div>
    );
};

const CollectionDetailLayout: React.FC<CollectionDetailLayoutProps> = ({
    title,
    onBack,
    commonInfo,
    extraInfo,
    receiptImages = [],
    receiptLabel = 'Receipt Images',
    showReceiptCard = true,
    imagePosition = 'bottom',
    permissions,
    onEdit,
    onDelete,
}) => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Limit to 2 images maximum
    const limitedImages = receiptImages.slice(0, 2);

    // Prepare images for modal
    const allImages = limitedImages.map((url, idx) => ({
        url,
        description: `${receiptLabel} ${limitedImages.length > 1 ? idx + 1 : ''}`,
    }));

    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index);
        setIsPreviewOpen(true);
    };

    const renderImageCard = (isSidebar: boolean) => (
        <motion.div
            variants={itemVariants}
            className={`${isSidebar ? 'w-full' : 'lg:col-span-2'} bg-white rounded-xl shadow-md border border-gray-200 p-6`}
        >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <PhotoIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    {receiptLabel} ({limitedImages.length} / 2)
                </h3>
            </div>

            <div className={`grid gap-4 ${isSidebar
                ? 'grid-cols-3'
                : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9'
                }`}>
                {limitedImages.map((image, index) => (
                    <ImageThumbnail
                        key={index}
                        image={image}
                        index={index}
                        onPreview={() => handleImageClick(index)}
                    />
                ))}
            </div>

            {limitedImages.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    No images have been uploaded for this collection.
                </div>
            )}
        </motion.div>
    );

    return (
        <motion.div className="relative space-y-6" variants={containerVariants} initial="hidden" animate="show">

            {/* Top Header Actions */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="hover:text-blue-600 transition-colors">
                        <ArrowLeftIcon className="h-5 w-5" />
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
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Common Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Common Info Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        {commonInfo}
                    </div>
                </div>

                {/* Right Column: Extra Info & Side Images */}
                {(extraInfo || (imagePosition === 'right' && showReceiptCard && limitedImages.length > 0)) && (
                    <div className="lg:col-span-1 space-y-6">
                        {extraInfo && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                {extraInfo}
                            </div>
                        )}
                        {imagePosition === 'right' && showReceiptCard && limitedImages.length > 0 && renderImageCard(true)}
                    </div>
                )}
            </motion.div>

            {/* Image Card at bottom */}
            {imagePosition === 'bottom' && showReceiptCard && limitedImages.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {renderImageCard(false)}
                    </div>
                </div>
            )}

            <ImagePreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                images={allImages}
                initialIndex={currentImageIndex}
            />
        </motion.div>
    );
};

export default CollectionDetailLayout;
