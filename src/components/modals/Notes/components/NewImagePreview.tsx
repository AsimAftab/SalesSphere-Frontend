import React from 'react';
import { X } from 'lucide-react';

interface NewImagePreviewProps {
    previews: string[];
    onRemove: (index: number) => void;
}

export const NewImagePreview: React.FC<NewImagePreviewProps> = ({ previews, onRemove }) => {
    return (
        <>
            {previews.map((url: string, i: number) => (
                <div
                    key={url}
                    className="relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-blue-50 border border-blue-100 shadow-sm group/img"
                >
                    <img
                        src={url}
                        className="w-full h-full object-cover"
                        alt={`New image preview ${i + 1}`}
                    />
                    <div
                        className="absolute top-1 left-1 bg-blue-500 text-[8px] text-white px-1.5 py-0.5 rounded-full font-bold"
                        aria-label="New image"
                    >
                        NEW
                    </div>
                    <button
                        type="button"
                        onClick={() => onRemove(i)}
                        className="absolute top-1 right-1 bg-white text-red-500 p-1 rounded-full shadow-lg opacity-100 sm:opacity-0 group-hover/img:opacity-100 transition-opacity"
                        aria-label={`Remove new image ${i + 1}`}
                    >
                        <X size={12} strokeWidth={3} aria-hidden="true" />
                    </button>
                </div>
            ))}
        </>
    );
};
