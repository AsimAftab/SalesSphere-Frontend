import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for lazy-loading image assets.
 * Eliminates duplicated useEffect + dynamic import pattern across auth pages.
 *
 * @param importFn - Dynamic import function returning the image module
 * @returns The resolved image URL or null while loading
 */
export const useLazyImage = (importFn: () => Promise<{ default: string }>): string | null => {
    const [src, setSrc] = useState<string | null>(null);
    const importFnRef = useRef(importFn);

    useEffect(() => {
        importFnRef.current().then((img) => setSrc(img.default));
    }, []);

    return src;
};
