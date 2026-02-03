import React, { useState } from 'react';
import type { TripOdometerDetails } from '@/api/odometerService';
import ImagePreviewModal from '@/components/modals/CommonModals/ImagePreviewModal';
import {
  Image,
} from 'lucide-react';

interface TripImagesCardProps {
    data: TripOdometerDetails;
}

const TripImagesCard: React.FC<TripImagesCardProps> = ({ data }) => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = [
        { url: data.startImage, title: 'Start Reading', description: 'Odometer reading at trip start' },
        ...(data.status === 'Completed' ? [{ url: data.endImage, title: 'End Reading', description: 'Odometer reading at trip end' }] : [])
    ];

    const openPreview = (index: number) => {
        setCurrentImageIndex(index);
        setIsPreviewOpen(true);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 px-8 pt-8 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shrink-0 text-blue-600">
                    <Image className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 leading-none">
                        Odometer Images
                    </h3>
                    <p className="text-xs font-medium text-gray-500 mt-1">
                        ({images.filter(img => img.url).length} images uploaded)
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 flex-1 flex flex-col justify-center">
                <div className="flex flex-col gap-4">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className="group relative rounded-xl overflow-hidden border border-gray-300 bg-gray-50 cursor-pointer shadow-sm hover:shadow-md transition-all"
                            onClick={() => openPreview(index)}
                        >
                            <div className="h-40 w-full overflow-hidden relative">
                                <img
                                    src={img.url}
                                    alt={img.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Image className="w-8 h-8 text-white drop-shadow-lg" />
                                </div>
                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 z-10">
                                    <p className="text-xs font-semibold text-white tracking-wide">{img.title}</p>
                                </div>
                            </div>


                        </div>
                    ))}
                </div>
            </div>

            <ImagePreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                images={images.map((img, i) => ({
                    url: img.url,
                    description: img.title,
                    imageNumber: i + 1
                }))}
                initialIndex={currentImageIndex}
            />
        </div>
    );
};

export default TripImagesCard;