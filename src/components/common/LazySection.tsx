// src/components/common/LazySection.tsx
import { useEffect, useRef, useState, type ReactNode } from 'react';

interface LazySectionProps {
  children: ReactNode;
  /**
   * Minimum height to reserve while loading (prevents layout shift)
   */
  minHeight?: string;
  /**
   * Root margin for IntersectionObserver
   * Positive values load content before it enters viewport
   * Default: "100px" (load 100px before visible)
   */
  rootMargin?: string;
  /**
   * Optional skeleton/placeholder to show while loading
   */
  fallback?: ReactNode;
  /**
   * Optional className for the container
   */
  className?: string;
}

/**
 * LazySection - Only renders children when the section is about to enter the viewport
 * Uses IntersectionObserver for optimal performance
 */
const LazySection = ({
  children,
  minHeight = '400px',
  rootMargin = '100px',
  fallback,
  className = '',
}: LazySectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = sectionRef.current;
    if (!currentRef) return;

    // Create IntersectionObserver to detect when section is near viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Once loaded, we can disconnect the observer
            observer.disconnect();
          }
        });
      },
      {
        rootMargin, // Load content before it enters viewport
        threshold: 0.01, // Trigger when even 1% is visible
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  return (
    <div
      ref={sectionRef}
      className={className}
      style={!isVisible ? { minHeight } : undefined}
    >
      {isVisible ? (
        children
      ) : (
        fallback || (
          <div
            className="flex items-center justify-center"
            style={{ minHeight }}
          >
            {/* Optional: Add a subtle loading indicator */}
            <div className="text-gray-400 text-sm">Loading...</div>
          </div>
        )
      )}
    </div>
  );
};

export default LazySection;
