import React, { useState } from 'react';
import type { NoteImage } from '../../../api/notesService';
import { PhotoIcon } from '@heroicons/react/24/outline';
import ImagePreviewModal from '../../../components/modals/Image/ImagePreviewModal';

interface NoteImagesCardProps {
    images: NoteImage[];
}

/**
 * NoteImagesCard - Displays note images in a styled card with preview functionality.
 * Matches the TripImagesCard pattern for visual consistency across the application.
 */
const NoteImagesCard: React.FC<NoteImagesCardProps> = ({ images }) => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openPreview = (index: number) => {
        setCurrentImageIndex(index);
        setIsPreviewOpen(true);
    };

    const hasImages = images && images.length > 0;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 px-8 pt-8 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shrink-0 text-blue-600">
                    <PhotoIcon className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 leading-none">
                        Note Attachments
                    </h3>
                    <p className="text-xs font-medium text-gray-500 mt-1">
                        ({images.length} {images.length === 1 ? 'image' : 'images'} attached)
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 flex-1 flex flex-col justify-center">
                {hasImages ? (
                    <div className="flex flex-col gap-4">
                        {images.map((img, index) => (
                            <div
                                key={img.imageNumber || index}
                                className="group relative rounded-xl overflow-hidden border border-gray-300 bg-gray-50 cursor-pointer shadow-sm hover:shadow-md transition-all"
                                onClick={() => openPreview(index)}
                            >
                                <div className="h-40 w-full overflow-hidden relative">
                                    <img
                                        src={img.imageUrl}
                                        alt={`Attachment ${index + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <PhotoIcon className="w-8 h-8 text-white drop-shadow-lg" />
                                    </div>
                                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 z-10">
                                        <p className="text-xs font-semibold text-white tracking-wide">
                                            Image {index + 1}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <PhotoIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No images attached</p>
                        <p className="text-xs text-gray-400 mt-1">This note has no attachments</p>
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
            />
        </div>
    );
};

export default NoteImagesCard;
