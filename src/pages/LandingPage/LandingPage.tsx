import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import { AboutSection } from './components/AboutSection';
import { AppShowcase } from './components/AppShowcase';

const LandingPage = () => {
  const navigate = useNavigate();

  const scrollToFeatures = useCallback(() => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleScheduleDemo = useCallback(() => {
    navigate('/schedule-demo');
  }, [navigate]);

  return (
    <main>
      <HeroSection
        headline={
          <>
            <span className="text-white">Complete Visibility Into Your </span>
            <span className="text-secondary">Field Sales Operations</span>
          </>
        }
        subheadline="Track your team, manage orders, and monitor performance in real-time. The all-in-one platform for field sales management."
        highlights={[]}
        primaryCta={{
          label: 'Schedule a Demo',
          onClick: handleScheduleDemo,
          ariaLabel: 'Go to demo scheduling page',
        }}
        secondaryCta={{
          label: 'Explore Features',
          onClick: scrollToFeatures,
          ariaLabel: 'Scroll to features section',
        }}
      />

      <FeaturesSection />

      <AboutSection />

      <AppShowcase />
    </main>
  );
};

export default LandingPage;
