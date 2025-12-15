// /src/components/modals/ViewImageModal.tsx
import React, { useState, useEffect } from 'react';
import { ImageOff, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'; 

interface ViewImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[]; // UPDATED: Accepts an array of strings now
  title: string;
}

const ViewImageModal: React.FC<ViewImageModalProps> = ({ isOpen, onClose, images = [], title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset states when the modal opens or images change
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setImgError(false);
      setIsLoading(true);
    }
  }, [isOpen, images]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]); // Dependencies for closure

  // Navigation handlers
  const handleNext = () => {
    if (images.length <= 1) return;
    setIsLoading(true);
    setImgError(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    if (images.length <= 1) return;
    setIsLoading(true);
    setImgError(false);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen || images.length === 0) return null;

  const currentImageUrl = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full mx-4 overflow-hidden shadow-2xl transform transition-all flex flex-col"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {images.length > 1 && (
              <p className="text-sm text-gray-500 mt-1">
                Image {currentIndex + 1} of {images.length}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Image Container with Navigation */}
        <div className="p-4 flex-1 overflow-hidden flex flex-col relative bg-gray-50 min-h-[300px]">
          
          <div className="flex-1 flex items-center justify-center relative w-full h-full">
            {/* Previous Button (Only if > 1 image) */}
            {images.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-0 z-20 p-2 m-2 bg-white/80 hover:bg-white rounded-full shadow-md text-gray-700 hover:text-blue-600 transition-all focus:outline-none"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Loading Spinner */}
            {isLoading && !imgError && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            )}

            {/* Error State */}
            {imgError ? (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <ImageOff className="w-12 h-12 mb-2" />
                <p>Image failed to load</p>
                <p className="text-xs mt-1 text-gray-300 select-all truncate max-w-xs">{currentImageUrl}</p>
              </div>
            ) : (
              <img
                key={currentImageUrl} // key ensures React remounts img on change to re-trigger onLoad
                src={currentImageUrl}
                alt={`Work Detail ${currentIndex + 1}`}
                className={`max-w-full max-h-full object-contain shadow-sm rounded-md transition-opacity duration-300 ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                style={{ maxHeight: '70vh' }}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setImgError(true);
                  setIsLoading(false);
                }}
              />
            )}

            {/* Next Button (Only if > 1 image) */}
            {images.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-0 z-20 p-2 m-2 bg-white/80 hover:bg-white rounded-full shadow-md text-gray-700 hover:text-blue-600 transition-all focus:outline-none"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
          
          {/* Dots Indicator (Optional, looks nice) */}
          {images.length > 1 && (
             <div className="flex justify-center gap-2 mt-4">
               {images.map((_, idx) => (
                 <button
                   key={idx}
                   onClick={() => setCurrentIndex(idx)}
                   className={`w-2 h-2 rounded-full transition-all ${
                     idx === currentIndex ? 'bg-blue-600 w-4' : 'bg-gray-300 hover:bg-gray-400'
                   }`}
                 />
               ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewImageModal;