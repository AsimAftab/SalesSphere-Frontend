// src/pages/HomePage/Homepage.tsx
import { Suspense, lazy } from 'react';

// Import only critical above-the-fold content immediately
import HeroSection from '@/components/sections/HeroSection';
import LazySection from '@/components/common/LazySection';

// Lazy load below-the-fold sections with React.lazy() for code splitting
// This ensures framer-motion and component code are only loaded when needed
const FeaturesSection = lazy(() => import('../../components/sections/Features/FeaturesSection'));
const WhyChooseSection = lazy(() => import('../../components/sections/About'));

// Lightweight loading fallback
const SectionSkeleton = () => (
  <div className="flex items-center justify-center min-h-[400px] bg-gray-50">
    <div className="animate-pulse text-gray-400">Loading...</div>
  </div>
);

const Homepage = () => {
  return (
    // This component should only return the <main> content.
    // The Navbar and Footer are already handled in your App.tsx.
    <main>
      {/* Hero Section - Always load immediately (above the fold) */}
      <HeroSection />

      {/* Features Section - Lazy load when near viewport with code splitting */}
      <LazySection minHeight="600px" rootMargin="150px">
        <Suspense fallback={<SectionSkeleton />}>
          <FeaturesSection />
        </Suspense>
      </LazySection>

      {/* Why Choose Section - Lazy load when near viewport with code splitting */}
      <LazySection minHeight="700px" rootMargin="150px">
        <Suspense fallback={<SectionSkeleton />}>
          <WhyChooseSection />
        </Suspense>
      </LazySection>
    </main>
  );
};

export default Homepage;
