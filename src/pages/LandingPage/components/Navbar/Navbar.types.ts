import type { ReactNode } from 'react';

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  isExternal?: boolean;
}

export interface NavCTA {
  label: string;
  onClick: () => void;
  ariaLabel?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface NavbarProps {
  logo?: ReactNode;
  brandName?: {
    primary: string;
    secondary: string;
  };
  navItems: NavItem[];
  ctaButton?: NavCTA;
  secondaryCta?: NavCTA;
  className?: string;
}

export interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  onClick: (id: string) => void;
  isMobile?: boolean;
}

export interface NavLogoProps {
  logo?: ReactNode;
  brandName?: {
    primary: string;
    secondary: string;
  };
  onClick?: () => void;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  activeSection: string;
  onNavClick: (id: string) => void;
  logo?: ReactNode;
  brandName?: {
    primary: string;
    secondary: string;
  };
  ctaButton?: NavCTA;
  secondaryCta?: NavCTA;
}

export interface UseScrollSpyOptions {
  sectionIds: string[];
  offset?: number;
  rootMargin?: number;
}

export interface UseScrollSpyReturn {
  activeSection: string;
}
