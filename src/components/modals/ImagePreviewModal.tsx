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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        /* FIX 1: Removed 'w-full' and 'max-w-4xl'. 
           Added 'w-auto' so the white/dark frame hugs the image width.
        */
        className="relative flex w-full max-w-5xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden flex-col transition-all duration-300 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-secondary bg-secondary flex-shrink-0">
          <div className="min-w-0 flex-1 px-1">
            <h3 className="text-lg font-bold text-white truncate">
              {currentImage?.description || 'Image Preview'}
            </h3>
            {canNavigate && (
              <p className="text-xs font-medium text-white/80 mt-0.5">
                Image {currentIndex + 1} of {images.length}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-1 ml-3">
            {onDeleteImage && currentImage?.imageNumber && (
              <button
                onClick={handleDelete}
                className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
                disabled={isDeletingImage}
                title="Delete Image"
              >
                {isDeletingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrashIcon className="w-5 h-5" />}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
              title="Close"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Image Display Area */}
        {/* FIX 2: Changed bg-gray-900 to a lighter gray or transparent so the image stands out */}
        <div className="relative flex-grow flex items-center justify-center bg-gray-50 min-h-[300px]">
          {currentImage ? (
            <img
              src={currentImage.url}
              alt={currentImage.description}
              /* FIX 3: Ensure height allows for header/footer (approx 120px) 
                 so the image never forces the modal off-screen.
              */
              className="max-w-full max-h-[calc(95vh-120px)] object-contain block mx-auto shadow-sm"
            />
          ) : (
            <div className="text-gray-500 text-lg">No image to display.</div>
          )}

          {/* Navigation Buttons */}
          {canNavigate && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-700 shadow-md rounded-full transition-all z-20 backdrop-blur-sm"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-700 shadow-md rounded-full transition-all z-20 backdrop-blur-sm"
              >
                <ArrowRightIcon className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Footer */}

      </div>
    </div>
  );
};

export default ImagePreviewModal;