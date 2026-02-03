import { useCallback } from 'react';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import { AboutSection } from './components/AboutSection';
import { useModal } from '@/components/modals/LandingPage/Demo/DemoModalContext';
import type { HeroHighlight } from './components/HeroSection';

const HERO_HIGHLIGHTS: HeroHighlight[] = [
  { id: 'gps', label: 'Real-time GPS tracking' },
  { id: 'attendance', label: 'Smart attendance' },
  { id: 'beat', label: 'Beat plan management' },
  { id: 'order', label: 'Order management' },
  { id: 'inventory', label: 'Inventory management' },
  { id: 'analytics', label: 'Analytics & reports' },
];

const LandingPage = () => {
  const { openDemoModal } = useModal();

  const scrollToFeatures = useCallback(() => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <main>
      <HeroSection
        headline={
          <>
            <span className="text-white">Empower Your </span>
            <span className="text-secondary">Field Sales Team</span>
            <span className="text-white"> Like Never Before</span>
          </>
        }
        subheadline="The all-in-one platform to track, manage, and grow your field operations. Everything your sales team needs in one place."
        highlights={HERO_HIGHLIGHTS}
        primaryCta={{
          label: 'Schedule a Demo',
          onClick: openDemoModal,
          ariaLabel: 'Open demo scheduling form',
        }}
        secondaryCta={{
          label: 'Explore Features',
          onClick: scrollToFeatures,
          ariaLabel: 'Scroll to features section',
        }}
      />

      <FeaturesSection />

      <AboutSection />
    </main>
  );
};

export default LandingPage;
