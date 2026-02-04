import type { ComponentType, SVGProps } from 'react';

export interface Feature {
  id: string;
  title: string;
  tabLabel: string;
  badge: string;
  description: string;
  image: string;
  alt: string;
  points: string[];
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  color: string;
}

export interface FeaturesSectionProps {
  features?: Feature[];
  title?: string;
  subtitle?: string;
  description?: string;
  autoPlayInterval?: number;
  className?: string;
}

export interface FeatureTabProps {
  feature: Feature;
  isActive: boolean;
  onClick: () => void;
}

export interface FeatureDisplayProps {
  feature: Feature;
  onNext: () => void;
  onPrev: () => void;
}

export interface UseFeatureNavigatorOptions {
  features: Feature[];
  autoPlayInterval?: number;
}

export interface UseFeatureNavigatorReturn {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  activeFeature: Feature;
  handleNext: () => void;
  handlePrev: () => void;
  isAutoPlaying: boolean;
  pauseAutoPlay: () => void;
  resumeAutoPlay: () => void;
}
