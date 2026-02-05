import React from 'react';
import { Cloud, X } from 'lucide-react';
import type { ExistingImage } from '../common/NoteEntityTypes';
import { getSafeImageUrl } from '@/utils/security';

interface ExistingImagePreviewProps {
    images: ExistingImage[];
    onRemove: (index: number) => void;
}

export const ExistingImagePreview: React.FC<ExistingImagePreviewProps> = ({ images, onRemove }) => {
    return (
        <>
            {images.map((img, i) => (
                <div
                    key={img._id || i}
                    className="relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-gray-50 border shadow-sm group/img"
                >
                    <img
                        src={getSafeImageUrl(img.imageUrl || img.url || '') || ''}
                        className="w-full h-full object-cover"
                        alt={`Saved attachment ${i + 1}`}
                    />
                    <div className="absolute top-1 left-1 bg-green-500 text-[8px] text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <Cloud size={8} aria-hidden="true" /> SAVED
                    </div>
                    <button
                        type="button"
                        onClick={() => onRemove(i)}
                        className="absolute top-1 right-1 bg-white text-red-500 p-1 rounded-full shadow-lg opacity-100 sm:opacity-0 group-hover/img:opacity-100 transition-opacity"
                        aria-label={`Remove saved image ${i + 1}`}
                    >
                        <X size={12} strokeWidth={3} aria-hidden="true" />
                    </button>
                </div>
            ))}
        </>
    );
};
