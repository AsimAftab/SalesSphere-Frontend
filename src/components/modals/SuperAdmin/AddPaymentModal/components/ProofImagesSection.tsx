import React, { useRef, useState } from 'react';
import { UploadCloud, X, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui';

interface ProofImagesSectionProps {
    images: File[];
    existingImages?: string[];
    onAddImage: (file: File) => void;
    onRemoveImage: (index: number) => void;
    onRemoveExistingImage?: (index: number) => void;
    error?: string;
}

const MAX_IMAGES = 2;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Sub-component to handle existing image with error state
const ExistingImageCard: React.FC<{
    url: string;
    index: number;
    onRemove?: (index: number) => void;
}> = ({ url, index, onRemove }) => {
    const [hasError, setHasError] = useState(false);

    return (
        <div className="group relative aspect-square w-24 h-24">
            {/* Image Card */}
            <div className="w-full h-full rounded-2xl border-2 border-blue-300 shadow-sm bg-blue-50 overflow-hidden">
                {hasError ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <ImageOff size={24} className="text-gray-400" />
                    </div>
                ) : (
                    <img
                        src={url}
                        alt={`Proof ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={() => setHasError(true)}
                    />
                )}
            </div>

            {/* Badge */}
            <div className="absolute -top-2 -left-2 bg-blue-500 backdrop-blur-sm text-[10px] text-white px-2 py-0.5 rounded-full font-bold shadow-sm ring-2 ring-white">
                SAVED
            </div>

            {/* Remove Button */}
            {onRemove && (
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1.5 shadow-lg border border-red-50 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                >
                    <X size={14} strokeWidth={3} />
                </button>
            )}
        </div>
    );
};

const ProofImagesSection: React.FC<ProofImagesSectionProps> = ({
    images,
    existingImages = [],
    onAddImage,
    onRemoveImage,
    onRemoveExistingImage,
    error,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const totalImages = existingImages.length + images.length;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];

        for (const file of files) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                continue;
            }

            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
                alert('Image size must be less than 5MB');
                continue;
            }

            // Check max images
            if (totalImages >= MAX_IMAGES) {
                alert(`Maximum ${MAX_IMAGES} images allowed`);
                break;
            }

            onAddImage(file);
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="md:col-span-2 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                    Proof Images <span className="text-gray-400 text-sm font-normal">(Optional - Max 2)</span>
                </span>

                {totalImages < MAX_IMAGES ? (
                    <>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleUploadClick}
                            className="flex items-center gap-2 py-2 h-9 text-xs"
                        >
                            <UploadCloud size={14} className="text-secondary" />
                            Upload
                        </Button>
                    </>
                ) : (
                    <div className="px-3 py-1.5 bg-secondary/10 border border-secondary/20 rounded-lg flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                        <span className="text-xs text-secondary font-medium">Limit reached (2/2)</span>
                    </div>
                )}
            </div>

            {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}

            {/* Image Gallery */}
            {(existingImages.length > 0 || images.length > 0) && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    {/* Existing Images (from server) */}
                    {existingImages.map((url, idx) => (
                        <ExistingImageCard
                            key={`existing-${idx}`}
                            url={url}
                            index={idx}
                            onRemove={onRemoveExistingImage}
                        />
                    ))}

                    {/* New Images (File objects) */}
                    {images.map((file, idx) => (
                        <div key={`new-${idx}`} className="group relative aspect-square w-24 h-24">
                            {/* Image Card */}
                            <div className="w-full h-full rounded-2xl border-2 border-secondary/30 shadow-sm bg-secondary/5 overflow-hidden">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Proof ${existingImages.length + idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Badge */}
                            <div className="absolute -top-2 -left-2 bg-secondary/90 backdrop-blur-sm text-[10px] text-white px-2 py-0.5 rounded-full font-bold shadow-sm ring-2 ring-white">
                                NEW
                            </div>

                            {/* Remove Button */}
                            <button
                                type="button"
                                onClick={() => onRemoveImage(idx)}
                                className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1.5 shadow-lg border border-red-50 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                            >
                                <X size={14} strokeWidth={3} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default ProofImagesSection;
