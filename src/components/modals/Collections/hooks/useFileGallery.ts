import { useState, useEffect, useCallback } from 'react';

export interface ExistingImage {
    imageUrl?: string;
    url?: string;
    publicId?: string;
    _id?: string;
}

export const useFileGallery = (maxTotalFiles: number) => {
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);

    const setInitialImages = useCallback((images: ExistingImage[]) => {
        setExistingImages(images || []);
    }, []);

    const addFiles = useCallback((incomingFiles: File[]) => {
        setNewFiles(prev => {
            const currentTotal = prev.length + existingImages.length;
            const remainingSlots = maxTotalFiles - currentTotal;

            if (remainingSlots <= 0) return prev;

            // Only take what fits in the remaining slots
            const allowedFiles = incomingFiles.slice(0, remainingSlots);
            return [...prev, ...allowedFiles];
        });
    }, [maxTotalFiles, existingImages.length]);

    const removeNewFile = useCallback((index: number) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
    }, []);

    const removeExistingImage = useCallback((index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    }, []);

    useEffect(() => {
        const urls = newFiles.map(file => URL.createObjectURL(file));
        setNewPreviews(urls);

        return () => urls.forEach(url => URL.revokeObjectURL(url));
    }, [newFiles]);

    /**
     * Clears all file state (both new and existing).
     * Should be called when modal opens in create mode.
     */
    const clearAll = useCallback(() => {
        setNewFiles([]);
        setExistingImages([]);
    }, []);

    return {
        newFiles,
        newPreviews,
        existingImages,
        addFiles,
        removeNewFile,
        removeExistingImage,
        setInitialImages,
        clearAll,
        totalCount: newFiles.length + existingImages.length,
        isFull: (newFiles.length + existingImages.length) >= maxTotalFiles
    };
};
