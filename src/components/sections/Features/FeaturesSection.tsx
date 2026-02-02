import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFeatureNavigator } from "./components/useFeatureNavigator";
import { FEATURES_DATA } from "./featuresData";
import { FeatureTab } from "./components/FeatureTab";
import { FeatureDisplay } from "./components/FeatureDisplay";
import underlineStroke from "@/assets/images/stroke.webp";

const FeaturesSection: React.FC = () => {
  const { activeIndex, setActiveIndex, activeFeature, handleNext, handlePrev } =
    useFeatureNavigator();

  return (
    <section className="py-20 bg-white overflow-hidden" id="features">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Area */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            Features
          </h2>

          <div className="flex justify-center mb-4">
            <img src={underlineStroke} alt="" className="w-48" width={192} height={24} />
          </div>

          <h3 className="text-lg font-bold text-gray-900">
            All You Need to Grow in One Place
          </h3>
          <p className="mt-4 text-gray-500 max-w-3xl mx-auto text-sm md:text-base">
            Powerful tools and intelligent features designed to streamline your
            field operations, boost productivity, and drive business growth -
            all in one integrated platform.
          </p>
        </div>

        {/* Navigation Tabs (Scrollable on Mobile) */}
        <div className="flex overflow-x-auto md:justify-center gap-4 md:gap-8 pb-6 mb-10 no-scrollbar">
          {FEATURES_DATA.map((feature, index) => (
            <FeatureTab
              key={feature.id}
              feature={feature}
              isActive={activeIndex === index}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>

        {/* Content Area with Animation */}
        <div className="relative group">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <FeatureDisplay
                feature={activeFeature}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            </motion.div>
          </AnimatePresence>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-1 mt-12">
            {FEATURES_DATA.map((_, index) => (
              <button
                type="button"
                aria-label={`Go to feature ${index + 1}`}
                key={index}
                onClick={() => setActiveIndex(index)}
                className="p-3 flex items-center justify-center"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === index ? "w-8" : "w-2 bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      activeIndex === index ? activeFeature.color : undefined,
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
