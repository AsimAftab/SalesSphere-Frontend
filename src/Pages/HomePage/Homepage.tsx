// src/pages/HomePage/Homepage.tsx

// Import only the sections needed for this page's content
import HeroSection from '../../components/sections/HeroSection';
import FeaturesSection from '../../components/sections/FeaturesSection';
import WhyChooseSection from '../../components/sections/About';
import LazySection from '../../components/common/LazySection';

const Homepage = () => {
  return (
    // This component should only return the <main> content.
    // The Navbar and Footer are already handled in your App.tsx.
    <main>
      {/* Hero Section - Always load immediately (above the fold) */}
      <HeroSection />

      {/* Features Section - Lazy load when near viewport */}
      <LazySection minHeight="600px" rootMargin="150px">
        <FeaturesSection />
      </LazySection>

      {/* Why Choose Section - Lazy load when near viewport */}
      <LazySection minHeight="700px" rootMargin="150px">
        <WhyChooseSection />
      </LazySection>
    </main>
  );
};

export default Homepage;
