// src/Components/sections/HeroSection.tsx
import React from 'react';

// --- CHANGE 1: Import both of your images ---
import heroIllustration from '../../assets/Image/cover.png'; // Main illustration
import underlineStroke from '../../assets/Image/stroke.png'; // The underline image

const HeroSection = () => {
  return (
    <div className="relative bg-primary overflow-hidden">
      <div className="pt-16 sm:pt-24 lg:pt-40 pb-20">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:text-left flex flex-col justify-center">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                  <span className="block text-secondary">One Platform</span>
                  <span className="block">Infinite Sales</span>
                  <span className="block">Possibilities</span>
                </h1>
                
                {/* --- CHANGE 2: Replaced the SVG with your stroke.png image --- */}
                <div className="mt-4">
                  <img 
                    src={underlineStroke} 
                    alt="Underline" 
                    className="w-65 h-auto mx-auto lg:mx-0" 
                    aria-hidden="true" 
                  />
                </div>
              </div>
            </div>

            {/* Illustration column */}
            <div className="mt-12 sm:mt-16 lg:mt-0 flex items-center justify-center">
              {/* --- CHANGE 3: The image size is now controlled here --- */}
              <img
                className="w-full max-w-xs rounded-md" // <-- ADJUST THE SIZE HERE
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