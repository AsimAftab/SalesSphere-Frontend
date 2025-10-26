import React, { useCallback, useEffect } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Define the interface for the image data passed to the modal
interface SiteImage {
    url: string;
    description: string;
}

interface ImagePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: SiteImage[];
    initialIndex: number;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ isOpen, onClose, images, initialIndex }) => {
    
    // State to track the current image index within the modal
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

    // Update index when initialIndex prop changes (e.g., if re-opened)
    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    if (!isOpen || images.length === 0) return null;

    const currentImage = images[currentIndex];
    const totalImages = images.length;
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === totalImages - 1;

    // Handlers for navigation
    const showPrevious = () => {
        if (!isFirst) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const showNext = () => {
        if (!isLast) {
            setCurrentIndex(currentIndex + 1);
        }
    };
    
    // Handler for keyboard navigation (ESC to close, arrows to navigate)
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        } else if (event.key === 'ArrowLeft') {
            showPrevious();
        } else if (event.key === 'ArrowRight') {
            showNext();
        }
    }, [onClose, showPrevious, showNext]);
    
    // Attach and detach the keyboard listener
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 transition-opacity"
            // Allows closing the modal by clicking the backdrop
            onClick={onClose}
        >
            <div 
                className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 p-4 md:p-6 transform transition-all"
                // Prevent modal from closing when clicking inside the content area
                onClick={(e) => e.stopPropagation()} 
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1.5 rounded-full text-white bg-gray-800 hover:bg-red-500 transition-colors z-50"
                    aria-label="Close modal"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                {/* Image Display Area */}
                <div className="flex items-center justify-center">
                    
                    {/* Previous Button */}
                    <button
                        onClick={showPrevious}
                        disabled={isFirst}
                        className={`p-3 rounded-full text-white bg-gray-800/50 hover:bg-gray-800 transition-colors absolute left-0 md:-left-12 ${isFirst ? 'opacity-30 cursor-not-allowed' : ''}`}
                        aria-label="Previous image"
                    >
                        <ChevronLeftIcon className="h-8 w-8" />
                    </button>

                    {/* Image */}
                    <img
                        src={currentImage.url}
                        alt={currentImage.description}
                        className="max-h-[80vh] w-auto max-w-full rounded-lg object-contain"
                    />

                    {/* Next Button */}
                    <button
                        onClick={showNext}
                        disabled={isLast}
                        className={`p-3 rounded-full text-white bg-gray-800/50 hover:bg-gray-800 transition-colors absolute right-0 md:-right-12 ${isLast ? 'opacity-30 cursor-not-allowed' : ''}`}
                        aria-label="Next image"
                    >
                        <ChevronRightIcon className="h-8 w-8" />
                    </button>
                </div>
                
                {/* Image Details */}
                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                    <p className="text-lg font-semibold text-gray-800">{currentImage.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        {currentIndex + 1} of {totalImages}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ImagePreviewModal;