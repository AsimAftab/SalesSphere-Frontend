export interface FooterLink {
  name: string;
  href?: string;
  action?: string;
}

export interface FooterNavigation {
  product: FooterLink[];
  resources: FooterLink[];
  company: FooterLink[];
}

export interface FooterProps {
  className?: string;
}

export interface FooterLogoProps {
  logoSrc: string;
  brandName: {
    primary: string;
    secondary: string;
  };
}

export interface FooterLinksColumnProps {
  title: string;
  links: FooterLink[];
  onAction?: (action: string) => void;
}

export interface FooterNewsletterProps {
  onSubmit: (email: string) => Promise<void>;
}

export interface FooterAppDownloadProps {
  googlePlayUrl: string;
  appStoreUrl: string;
  googlePlayBadge: string;
  appStoreBadge: string;
}

export interface FooterBottomBarProps {
  copyrightYear: number;
  companyName: string;
  legalLinks: FooterLink[];
}
