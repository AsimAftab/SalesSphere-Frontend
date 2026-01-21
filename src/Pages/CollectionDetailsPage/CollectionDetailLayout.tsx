import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, PhotoIcon, TrashIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/UI/Button/Button';
import ImagePreviewModal from '../../components/modals/Image/ImagePreviewModal';
import ConfirmationModal from '../../components/modals/ConfirmationModal';

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
    onDeleteImage?: (imageNumber: number) => void;
    isDeletingImage?: boolean; // New prop
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

// ImageThumbnail component matching SiteDetailsPage design
interface ImageThumbnailProps {
    image: string;
    index: number;
    onPreview: () => void;
    onDelete?: () => void;
    isDeleting?: boolean;
}

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({
    image,
    index,
    onPreview,
    onDelete,
    isDeleting
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

            {/* Delete Button */}
            {onDelete && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    disabled={isDeleting}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 disabled:opacity-50 z-10"
                    title="Delete Image"
                >
                    {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <TrashIcon className="w-4 h-4" />
                    )}
                </button>
            )}
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
    onDeleteImage,
    isDeletingImage,
    onUploadImage,
    isUploadingImage
}) => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Delete Confirmation State
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; slotNum: number | null }>({
        isOpen: false,
        slotNum: null
    });
    const [deletingSlot, setDeletingSlot] = useState<number | null>(null);

    // Reset deleting slot when parent signals deletion processing is done
    useEffect(() => {
        if (!isDeletingImage) {
            setDeletingSlot(null);
        }
    }, [isDeletingImage]);

    // Limit to 2 images maximum
    const limitedImages = receiptImages.slice(0, 2);

    // Determine next available slot (1 or 2)
    // Here we need to know WHICH slot is empty. Since the API returns an array of URLs,
    // we assume if length is 0, slot 1 is free. If length is 1, slot 2 is free.
    // NOTE: This assumes images are returned in order or we just append.
    // Ideally the API would tell us image numbers.
    // Based on `useCollectionDetail`, `images` is just string[].
    // And `uploadCollectionImage` takes `imageNumber`.
    // We will assume:
    // If 0 images -> Next is 1
    // If 1 image -> Next is 2
    // If 2 images -> Full
    const nextAvailableImageNumber = limitedImages.length < 2 ? limitedImages.length + 1 : null;

    // Prepare images for modal
    const allImages = limitedImages.map((url, idx) => ({
        url,
        description: `${receiptLabel} ${limitedImages.length > 1 ? idx + 1 : ''}`,
        imageNumber: idx + 1, // 1-based index for API
    }));

    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index);
        setIsPreviewOpen(true);
    };

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Only image files are allowed.');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File is too large. Max 5MB.');
                return;
            }
            if (nextAvailableImageNumber !== null && onUploadImage) {
                onUploadImage(nextAvailableImageNumber, file);
            }
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadButtonClick = () => {
        if (isUploadingImage) return;
        if (nextAvailableImageNumber === null) {
            toast.error("Image limit reached. Max 2 images.");
            return;
        }
        fileInputRef.current?.click();
    };

    const initiateDelete = (imageNumber: number) => {
        setDeleteConfirm({ isOpen: true, slotNum: imageNumber });
    };

    const handleConfirmDelete = () => {
        if (deleteConfirm.slotNum !== null && onDeleteImage) {
            setDeletingSlot(deleteConfirm.slotNum);
            onDeleteImage(deleteConfirm.slotNum);
            setDeleteConfirm({ isOpen: false, slotNum: null });
        }
    };

    const renderImageCard = (isSidebar: boolean) => (
        <motion.div
            variants={itemVariants}
            className={`${isSidebar ? 'w-full' : 'lg:col-span-2'} bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full`}
        >
            <div className={`flex ${isSidebar ? 'flex-col gap-4' : 'flex-row items-center justify-between'} mb-6`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shrink-0">
                        <PhotoIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-900 leading-none">
                            {receiptLabel}
                        </h3>
                        <p className="text-xs font-medium text-gray-500 mt-1">
                            ({limitedImages.length} / 2 uploaded)
                        </p>
                    </div>
                </div>

                {onUploadImage && (
                    <>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelected}
                            className="hidden"
                            accept="image/png, image/jpeg, image/webp"
                            aria-label="Upload image"
                        />
                        <Button
                            variant="primary"
                            onClick={handleUploadButtonClick}
                            className={`${isSidebar ? 'w-full' : 'w-auto'} text-sm py-2 px-4 shadow-sm`}
                            disabled={isUploadingImage}
                        >
                            {isUploadingImage ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
                            )}
                            {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                        </Button>
                    </>
                )}
            </div>

            <div className={`grid gap-4 ${isSidebar
                ? 'grid-cols-2'
                : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9'
                } flex-grow`}>
                {limitedImages.map((image, index) => (
                    <ImageThumbnail
                        key={index}
                        image={image}
                        index={index}
                        onPreview={() => handleImageClick(index)}
                        onDelete={onDeleteImage ? () => initiateDelete(index + 1) : undefined}
                        isDeleting={isDeletingImage && deletingSlot === (index + 1)}
                    />
                ))}
            </div>

            {limitedImages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50 flex-grow">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <PhotoIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">No images uploaded</p>
                    <p className="text-xs text-gray-500 mt-1">Upload proof for this collection</p>
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
                {(extraInfo || (imagePosition === 'right' && showReceiptCard)) && (
                    <div className="lg:col-span-1 space-y-6">
                        {extraInfo && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                {extraInfo}
                            </div>
                        )}
                        {imagePosition === 'right' && showReceiptCard && renderImageCard(true)}
                    </div>
                )}
            </motion.div>

            {/* Image Card at bottom */}
            {imagePosition === 'bottom' && showReceiptCard && (
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
                onDeleteImage={onDeleteImage ? initiateDelete : undefined}
                isDeletingImage={isDeletingImage}
            />

            <ConfirmationModal
                isOpen={deleteConfirm.isOpen}
                title="Delete Image"
                message={`Are you sure you want to permanently remove this image?`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteConfirm({ isOpen: false, slotNum: null })}
                confirmButtonVariant="danger"
            />
        </motion.div>
    );
};

export default CollectionDetailLayout;
