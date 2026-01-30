import React, { useRef, useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PhotoIcon as HeroPhotoIcon,
  TrashIcon as HeroTrashIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import { Loader2 as LucideLoader2 } from 'lucide-react';

import Button from '../../../../components/UI/Button/Button';
import toast from 'react-hot-toast';
import ImagePreviewModal from '../../../../components/modals/CommonModals/ImagePreviewModal';
import ConfirmationModal from '../../../../components/modals/CommonModals/ConfirmationModal';

// Define local interface if not exported, effectively mimicking the shape used in the app
interface ProspectImage {
  imageNumber: number;
  imageUrl: string;
  [key: string]: any;
}

interface ProspectImageGalleryProps {
  images: ProspectImage[];
  actions: {
    uploadImage: (vars: { num: number; file: File }) => void;
    deleteImage: (num: number) => void;
  };
  loadingStates: {
    isUploading: boolean;
    isDeletingImage: boolean;
  };
  canManageImages?: boolean;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface ImageThumbnailProps {
  image: ProspectImage;
  onDelete: (imageNumber: number) => void;
  onPreview: () => void;
  isDeleting: boolean;
  canDelete?: boolean;
}

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({
  image,
  onDelete,
  onPreview,
  isDeleting,
  canDelete = true,
}) => {
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden group">
      <img
        src={image.imageUrl}
        alt={`Prospect ${image.imageNumber}`}
        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
        onClick={onPreview}
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300" />

      {/* Preview Button Overlay */}
      <button
        onClick={onPreview}
        className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Preview image"
      >
        <HeroPhotoIcon className="w-8 h-8 drop-shadow-lg" />
      </button>

      {/* Delete Button - Secured */}
      {canDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(image.imageNumber);
          }}
          disabled={isDeleting}
          className="absolute top-2 right-2 p-1.5 bg-red-600 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Delete image"
        >
          {isDeleting ? (
            <LucideLoader2 className="w-4 h-4 animate-spin" />
          ) : (
            <HeroTrashIcon className="w-4 h-4" />
          )}
        </button>
      )}

    </div>
  );
};

const ProspectImageGallery: React.FC<ProspectImageGalleryProps> = ({
  images,
  actions,
  loadingStates,
  canManageImages = false,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Explicit Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; slotNum: number | null }>({
    isOpen: false,
    slotNum: null
  });
  const [deletingSlot, setDeletingSlot] = useState<number | null>(null);

  // Reset deleting slot when parent signals deletion processing is done
  useEffect(() => {
    if (!loadingStates.isDeletingImage) {
      setDeletingSlot(null);
    }
  }, [loadingStates.isDeletingImage]);

  const sortedImages = useMemo(() => {
    return [...(images || [])].sort((a, b) => a.imageNumber - b.imageNumber);
  }, [images]);

  // ✅ LIMIT: 5 Images Max
  const nextAvailableImageNumber = useMemo(() => {
    const existingNumbers = new Set(sortedImages.map(img => img.imageNumber));
    for (let i = 1; i <= 5; i++) {
      if (!existingNumbers.has(i)) {
        return i;
      }
    }
    return null;
  }, [sortedImages]);

  const modalImages = useMemo(() => {
    return sortedImages.map((img) => ({
      url: img.imageUrl,
      description: `Prospect Image ${img.imageNumber}`,
      imageNumber: img.imageNumber,
    }));
  }, [sortedImages]);

  const handlePreviewClick = (imageNumber: number) => {
    const index = sortedImages.findIndex(
      (img) => img.imageNumber === imageNumber
    );
    if (index > -1) {
      setCurrentImageIndex(index);
      setIsPreviewOpen(true);
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
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
      if (nextAvailableImageNumber !== null) {
        actions.uploadImage({ num: nextAvailableImageNumber, file });
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadButtonClick = () => {
    if (loadingStates.isUploading) return;

    if (nextAvailableImageNumber === null) {
      toast.error("Image limit reached. Cannot upload more than 5 images.");
      return;
    }
    fileInputRef.current?.click();
  };

  // Delete flow handling
  const initiateDelete = (num: number) => {
    setDeleteConfirm({ isOpen: true, slotNum: num });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm.slotNum !== null) {
      setDeletingSlot(deleteConfirm.slotNum); // Track which one is deleting
      actions.deleteImage(deleteConfirm.slotNum);
      setDeleteConfirm({ isOpen: false, slotNum: null });
    }
  };

  return (
    <>
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <HeroPhotoIcon className="w-4 h-4 text-blue-600" />
            </div>
            Prospect Images ({sortedImages.length} / 5)
          </h3>

          {/* Permissions Check: Only show upload controls if allowed */}
          {canManageImages && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelected}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                aria-label="Upload prospect image"
              />

              <Button
                variant="secondary"
                onClick={handleUploadButtonClick}
                className={`w-full sm:w-auto ${(nextAvailableImageNumber === null || loadingStates.isUploading)
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
                  }`}
              >
                {loadingStates.isUploading ? (
                  <LucideLoader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                )}
                {loadingStates.isUploading ? 'Uploading...' : (nextAvailableImageNumber === null ? 'Limit Reached' : 'Upload Image')}
              </Button>
            </>
          )}
        </div>

        {/* Grid Layout: Adjusted to match Sites EXACTLY (up to 9 cols) for consistent sizing */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4">
          {sortedImages.map((image) => (
            <ImageThumbnail
              key={image.imageNumber}
              image={image}
              isDeleting={loadingStates.isDeletingImage && deletingSlot === image.imageNumber}
              onDelete={initiateDelete}
              onPreview={() => handlePreviewClick(image.imageNumber)}
              canDelete={canManageImages}
            />
          ))}
        </div>

        {sortedImages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <h4 className="text-base font-semibold text-gray-800">No Images</h4>
            <p className="text-sm text-gray-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
              No images have been uploaded for this prospect yet.
            </p>
          </div>
        )}
      </motion.div>

      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        images={modalImages}
        initialIndex={currentImageIndex}
        onDeleteImage={initiateDelete} // Uses the confirm modal flow
        isDeletingImage={loadingStates.isDeletingImage}
      />

      <ConfirmationModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Gallery Image"
        message={`Are you sure you want to permanently remove the image from Slot ${deleteConfirm.slotNum}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, slotNum: null })}
        confirmButtonVariant="danger"
      />
    </>
  );
};

export default ProspectImageGallery;