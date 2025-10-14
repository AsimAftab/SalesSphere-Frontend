// src/pages/HomePage/Homepage.tsx


// Import only the sections needed for this page's content
import HeroSection from '../../components/sections/HeroSection';
import FeaturesSection from '../../components/sections/FeaturesSection';
import WhyChooseSection from '../../components/sections/About'; // Corrected import path

const Homepage = () => {
  return (
    // This component should only return the <main> content.
    // The Navbar and Footer are already handled in your App.tsx.
    <main>
      <HeroSection />
      <FeaturesSection />
      <WhyChooseSection />
    </main>
  );
};

export default Homepage;