import type { ReactNode } from 'react';

export interface HeroHighlight {
  id: string;
  label: string;
}

export interface HeroCTA {
  label: string;
  onClick: () => void;
  ariaLabel?: string;
}

export interface HeroSectionProps {
  badge?: string;
  headline: ReactNode;
  subheadline: string;
  highlights: HeroHighlight[];
  primaryCta: HeroCTA;
  secondaryCta?: HeroCTA;
  className?: string;
}

export interface HeroSectionContentProps {
  badge?: string;
  headline: ReactNode;
  subheadline: string;
}

export interface HeroHighlightsProps {
  highlights: HeroHighlight[];
}

export interface HeroCTAGroupProps {
  primaryCta: HeroCTA;
  secondaryCta?: HeroCTA;
}
