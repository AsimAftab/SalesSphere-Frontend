import type { ComponentType, SVGProps } from 'react';

export interface AboutFeature {
  id: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

export interface AboutSectionProps {
  title?: string;
  subtitle?: string;
  features?: AboutFeature[];
  className?: string;
}

export interface AboutFeatureCardProps {
  feature: AboutFeature;
  index: number;
}
