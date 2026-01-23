import React, { useState, useRef } from 'react';
import type { NoteImage } from '../../../api/notesService';
import { PhotoIcon, ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../../components/UI/Button/Button';
import ImagePreviewModal from '../../../components/modals/CommonModals/ImagePreviewModal';
import ConfirmationModal from '../../../components/modals/CommonModals/ConfirmationModal';

interface NoteImagesCardProps {
    images: NoteImage[];
    onUploadImage?: (imageNumber: number, file: File) => void;
    isUploadingImage?: boolean;
    onDeleteImage?: (imageNumber: number) => void;
    isDeletingImage?: boolean;
}

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
                alt={`Attachment ${index + 1}`}
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
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                        <TrashIcon className="w-3.5 h-3.5" />
                    )}
                </button>
            )}
        </div>
    );
};

/**
 * NoteImagesCard - Displays note images in a styled card with preview functionality.
 * Supports direct image upload and deletion.
 */
const NoteImagesCard: React.FC<NoteImagesCardProps> = ({
    images,
    onUploadImage,
    isUploadingImage,
    onDeleteImage,
    isDeletingImage
}) => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Delete Confirmation State
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; slotNum: number | null }>({
        isOpen: false,
        slotNum: null
    });

    const openPreview = (index: number) => {
        setCurrentImageIndex(index);
        setIsPreviewOpen(true);
    };

    const hasImages = images && images.length > 0;
    const isMaxImagesReached = images.length >= 2;

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validation
            if (!file.type.startsWith('image/')) {
                toast.error('Only image files are allowed.');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File is too large. Max 5MB.');
                return;
            }

            // Calculate next available slot
            const takenNumbers = images.map(img => img.imageNumber);
            const availableNumbers = [1, 2].filter(num => !takenNumbers.includes(num));
            const nextSlot = availableNumbers[0];

            if (nextSlot && onUploadImage) {
                onUploadImage(nextSlot, file);
            } else {
                toast.error("Cannot upload: Image limit reached or error.");
            }
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadClick = () => {
        if (isUploadingImage || isMaxImagesReached) return;
        fileInputRef.current?.click();
    };

    const initiateDelete = (imageNumber: number) => {
        setDeleteConfirm({ isOpen: true, slotNum: imageNumber });
    };

    const handleConfirmDelete = () => {
        if (deleteConfirm.slotNum !== null && onDeleteImage) {
            onDeleteImage(deleteConfirm.slotNum);
            setDeleteConfirm({ isOpen: false, slotNum: null });
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shrink-0 text-blue-600">
                        <PhotoIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-900 leading-none">
                            Images
                        </h3>
                        <p className="text-xs font-medium text-gray-500 mt-1">
                            ({images.length} / 2 uploaded)
                        </p>
                    </div>
                </div>

                {/* Upload Button */}
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
                            onClick={handleUploadClick}
                            className="h-9 px-3 text-xs"
                            disabled={isUploadingImage || isMaxImagesReached}
                        >
                            {isUploadingImage ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <ArrowUpTrayIcon className="w-3.5 h-3.5 mr-1.5" />
                            )}
                            {isUploadingImage ? 'Uploading...' : isMaxImagesReached ? 'Limit Reached' : 'Upload Image'}
                        </Button>
                    </>
                )}
            </div>

            {/* Content */}
            <div className="px-6 pb-6 flex-1 flex flex-col">
                {hasImages ? (
                    <div className="grid grid-cols-2 gap-4">
                        {images.map((img, index) => (
                            <ImageThumbnail
                                key={img.imageNumber || index}
                                image={img.imageUrl}
                                index={index}
                                onPreview={() => openPreview(index)}
                                onDelete={onDeleteImage ? () => initiateDelete(img.imageNumber) : undefined}
                                isDeleting={isDeletingImage} // Ideally we'd track which specific image is deleting
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50 flex-grow">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <PhotoIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No images attached</p>
                        <p className="text-xs text-gray-500 mt-1">Upload proof for this note</p>
                    </div>
                )}
            </div>

            <ImagePreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                images={images.map((img, i) => ({
                    url: img.imageUrl,
                    description: `Image ${i + 1}`,
                    imageNumber: img.imageNumber
                }))}
                initialIndex={currentImageIndex}
                onDeleteImage={onDeleteImage ? initiateDelete : undefined}
                isDeletingImage={isDeletingImage}
            />

            <ConfirmationModal
                isOpen={deleteConfirm.isOpen}
                title="Delete Image"
                message="Are you sure you want to permanently remove this image?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteConfirm({ isOpen: false, slotNum: null })}
                confirmButtonVariant="danger"
                confirmButtonText={isDeletingImage ? "Deleting..." : "Delete Image"}
            />
        </div>
    );
};

export default NoteImagesCard;
