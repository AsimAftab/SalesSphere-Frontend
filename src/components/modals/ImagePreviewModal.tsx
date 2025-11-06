// src/components/modals/ImagePreviewModal.tsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  XMarkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react'; // For loading state

interface Image {
  url: string;
  description: string;
  imageNumber?: number; // Add imageNumber to identify the image for deletion
}

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: Image[];
  initialIndex?: number;
  onDeleteImage?: (imageNumber: number) => void; // New prop for deletion
  isDeletingImage?: boolean; // New prop for delete loading state
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  onDeleteImage, // Destructure new prop
  isDeletingImage, // Destructure new prop
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialIndex]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return;
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      } else if (event.key === 'ArrowLeft') {
        goToPrevious();
      }
    },
    [isOpen, onClose, goToNext, goToPrevious]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  const currentImage = images[currentIndex];
  const canNavigate = images.length > 1;

  // Handle delete
  const handleDelete = async () => {
    if (onDeleteImage && currentImage?.imageNumber) {
      // Pass the imageNumber to the parent handler
      onDeleteImage(currentImage.imageNumber);
      // After deletion, the parent will usually invalidate queries and re-render.
      // It's often best to close the modal and let the parent refresh the main view.
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className="relative max-w-4xl w-full max-h-full bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-gray-800 text-white flex-shrink-0">
          <h3 className="text-lg font-semibold truncate">
            {currentImage?.description || 'Image Preview'}
          </h3>
          <div className="flex items-center space-x-2">
            {onDeleteImage && currentImage?.imageNumber && (
              <button
                onClick={handleDelete}
                className="p-2 rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
                aria-label="Delete image"
                disabled={isDeletingImage}
              >
                {isDeletingImage ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <TrashIcon className="w-5 h-5" />
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center"
              aria-label="Close modal"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Image Display Area */}
        <div className="relative flex-grow flex items-center justify-center bg-gray-900 overflow-hidden">
          {currentImage ? (
            <img
              src={currentImage.url}
              alt={currentImage.description}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-white text-lg">No image to display.</div>
          )}

          {/* Navigation Buttons */}
          {canNavigate && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white rounded-full transition-colors z-10"
                aria-label="Previous image"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white rounded-full transition-colors z-10"
                aria-label="Next image"
              >
                <ArrowRightIcon className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Footer (Optional: for captions/index) */}
        {canNavigate && (
          <div className="p-3 bg-gray-800 text-white text-center text-sm flex-shrink-0">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreviewModal;