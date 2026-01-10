import { useRef, useState, useLayoutEffect } from 'react';

/**
 * Custom hook to handle resize observation for Recharts responsive containers.
 * Solves the issue where charts don't render until resizing or have zero dimensions initially.
 */
export const useChartResize = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);

    useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) {
                    setReady(true);
                }
            }
        });

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return { containerRef, ready };
};
