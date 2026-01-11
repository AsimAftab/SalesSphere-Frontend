import { useState, useEffect, useCallback } from "react";
import { FEATURES_DATA } from "../featuresData";

export const useFeatureNavigator = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % FEATURES_DATA.length);
  }, []);

  const handlePrev = useCallback(() => {  
    setActiveIndex((prev) => (prev - 1 + FEATURES_DATA.length) % FEATURES_DATA.length);
  }, []);

  // Auto-play logic 
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, handleNext]);

  return {
    activeIndex,
    setActiveIndex: (index: number) => {
      setActiveIndex(index);
      setIsAutoPlaying(false); 
    },
    activeFeature: FEATURES_DATA[activeIndex],
    handleNext,
    handlePrev,
    isAutoPlaying,
    setIsAutoPlaying
  };
};