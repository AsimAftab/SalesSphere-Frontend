import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '@/components/modals/LandingPage/Demo/DemoModalContext';
import Navbar from './Navbar';
import type { NavItem } from './Navbar.types';

const NAV_ITEMS: NavItem[] = [
  { id: 'hero', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'About', label: 'About Us' },
  { id: 'footer', label: 'Contact Us' },
];

/**
 * LandingNavbar - Pre-configured Navbar for the landing page
 * Provides default nav items with Login and Schedule Demo CTAs
 */
const LandingNavbar = memo(() => {
  const navigate = useNavigate();
  const { openDemoModal } = useModal();

  return (
    <Navbar
      brandName={{ primary: 'Sales', secondary: 'Sphere' }}
      navItems={NAV_ITEMS}
      secondaryCta={{
        label: 'Login',
        onClick: () => navigate('/login'),
        ariaLabel: 'Go to login page',
        variant: 'outline',
      }}
      ctaButton={{
        label: 'Schedule a Demo',
        onClick: openDemoModal,
        ariaLabel: 'Open demo scheduling form',
        variant: 'primary',
      }}
    />
  );
});

LandingNavbar.displayName = 'LandingNavbar';

export default LandingNavbar;
