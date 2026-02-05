import type { FooterNavigation, FooterLink } from './Footer.types';

export const FOOTER_NAVIGATION: FooterNavigation = {
  product: [
    { name: 'Features', href: '/#features' },
    { name: 'How it Works', href: '/#about' },
    { name: 'Mobile App', href: '/#mobile-app' },
  ],
  company: [
    { name: 'About', href: '/#about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', action: 'openContactUsModal' },
  ],
  resources: [
    { name: 'Blog', href: '/blog' },
    { name: 'Help Center', href: '/help' },
    { name: 'FAQs', href: '/faqs' },
  ],
};

export const LEGAL_LINKS: FooterLink[] = [
  { name: 'Terms & Conditions', href: '/terms-and-conditions' },
  { name: 'Privacy Policy', href: '/privacy-policy' },
];

export const APP_STORE_URLS = {
  googlePlay: 'https://play.google.com/store',
  appStore: 'https://www.apple.com/app-store/',
};
