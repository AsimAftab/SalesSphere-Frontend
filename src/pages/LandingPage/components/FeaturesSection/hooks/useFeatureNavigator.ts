import { useState, useEffect, useCallback, useRef } from 'react';
import type { UseFeatureNavigatorOptions, UseFeatureNavigatorReturn } from '../FeaturesSection.types';

/**
 * Custom hook for feature carousel navigation
 * Handles auto-play, manual navigation, and keyboard controls
 */
export const useFeatureNavigator = ({
  features,
  autoPlayInterval = 5000,
}: UseFeatureNavigatorOptions): UseFeatureNavigatorReturn => {
  const [activeIndex, setActiveIndexState] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalFeatures = features.length;

  const handleNext = useCallback(() => {
    setActiveIndexState((prev) => (prev + 1) % totalFeatures);
  }, [totalFeatures]);

  const handlePrev = useCallback(() => {
    setActiveIndexState((prev) => (prev - 1 + totalFeatures) % totalFeatures);
  }, [totalFeatures]);

  const setActiveIndex = useCallback((index: number) => {
    setActiveIndexState(index);
    setIsAutoPlaying(false);
  }, []);

  const pauseAutoPlay = useCallback(() => {
    setIsAutoPlaying(false);
  }, []);

  const resumeAutoPlay = useCallback(() => {
    setIsAutoPlaying(true);
  }, []);

  // Auto-play logic
  useEffect(() => {
    if (!isAutoPlaying || autoPlayInterval <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(handleNext, autoPlayInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAutoPlaying, autoPlayInterval, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
        pauseAutoPlay();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
        pauseAutoPlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, pauseAutoPlay]);

  return {
    activeIndex,
    setActiveIndex,
    activeFeature: features[activeIndex],
    handleNext,
    handlePrev,
    isAutoPlaying,
    pauseAutoPlay,
    resumeAutoPlay,
  };
};
