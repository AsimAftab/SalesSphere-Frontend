// src/pages/HomePage/Homepage.tsx


// Import only the sections needed for this page's content
import HeroSection from '../../Components/sections/HeroSection';
import FeaturesSection from '../../Components/sections/FeaturesSection';
import WhyChooseSection from '../../Components/sections/About'; // Corrected import path

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
