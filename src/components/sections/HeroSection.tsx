// src/Components/sections/HeroSection.tsx

// --- Imports for all images ---
import heroIllustration from '../../assets/Image/cover.svg'; 
import underlineStroke from '../../assets/Image/stroke.svg'; 
import backgroundPattern from '../../assets/Image/Background.svg'; // Your background pattern (fixed case)

const HeroSection = () => {
  return (
    <div className="relative bg-primary overflow-hidden">
      
      {/* Main content container sits on top */}
      <div className="relative z-10 pt-40 sm:pt-48 lg:pt-24 pb-8">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          
          {/* --- MODIFIED: Changed vertical positioning from center to top --- */}
          <img
            src={backgroundPattern}
            alt=""
            aria-hidden="true"
            className="absolute left-[-10rem] top-0 w-[40rem] max-w-none opacity-20"
          />

          <div className="relative lg:grid lg:grid-cols-2 lg:gap-8">
            
            {/* Text Column */}
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:text-left flex flex-col justify-center">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                  <span className="block text-secondary">One Platform</span>
                  <span className="block">Infinite Sales</span>
                  <span className="block">Possibilities</span>
                </h1>
                
                <div className="mt-4">
                  <img 
                    src={underlineStroke} 
                    alt="Underline" 
                    className="w-68 h-auto mx-auto lg:mx-0" 
                    aria-hidden="true" 
                  />
                </div>
              </div>
            </div>

            {/* Illustration column */}
            <div className="mt-12 sm:mt-16 lg:mt-0 flex items-center justify-center">
              <img
                className="w-full max-w-xs rounded-md" 
                src={heroIllustration}
                alt="Sales management platform illustration"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;