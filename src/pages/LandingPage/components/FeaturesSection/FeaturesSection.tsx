import { memo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/components/ui/utils';
import { FeatureTab, FeatureDisplay } from './components';
import { useFeatureNavigator } from './hooks';
import { DEFAULT_FEATURES } from './FeaturesSection.data';
import {
  containerVariants,
  headerVariants,
  tabContainerVariants,
  tabVariants,
  contentVariants,
} from './FeaturesSection.animations';
import type { FeaturesSectionProps } from './FeaturesSection.types';

const FeaturesSection = memo<FeaturesSectionProps>(
  ({
    features = DEFAULT_FEATURES,
    autoPlayInterval = 6000,
    className,
  }) => {
    const {
      activeIndex,
      setActiveIndex,
      activeFeature,
      handleNext,
      handlePrev,
      pauseAutoPlay,
      resumeAutoPlay,
    } = useFeatureNavigator({ features, autoPlayInterval });

    const tabsContainerRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Scroll active tab to center
    const scrollToActiveTab = useCallback((index: number) => {
      const container = tabsContainerRef.current;
      const activeTab = tabRefs.current[index];

      if (!container || !activeTab) return;

      // Only scroll on mobile/tablet (when not wrapping)
      if (window.innerWidth >= 768) return;

      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();

      // Calculate scroll position to center the tab
      const scrollLeft =
        activeTab.offsetLeft - containerRect.width / 2 + tabRect.width / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }, []);

    // Scroll to active tab when it changes
    useEffect(() => {
      scrollToActiveTab(activeIndex);
    }, [activeIndex, scrollToActiveTab]);

    return (
      <section
        id="features"
        className={cn('relative py-10 bg-white overflow-hidden scroll-mt-14 sm:scroll-mt-20', className)}
        aria-labelledby="features-title"
        onMouseEnter={pauseAutoPlay}
        onMouseLeave={resumeAutoPlay}
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] opacity-50" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] opacity-50" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Header */}
          <motion.div variants={headerVariants} className="text-center mb-4 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Powerful Features
            </h2>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium">
              Streamline operations and boost productivity with our comprehensive field sales management suite.
            </p>
          </motion.div>

          {/* Feature Tabs */}
          <motion.div variants={tabContainerVariants} className="mb-2">
            <motion.div
              ref={tabsContainerRef}
              className="flex overflow-x-auto md:flex-wrap md:justify-center gap-4 p-4 no-scrollbar"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  ref={(el) => { tabRefs.current[index] = el; }}
                  variants={tabVariants}
                  className="flex-shrink-0"
                >
                  <FeatureTab
                    feature={feature}
                    isActive={activeIndex === index}
                    onClick={() => setActiveIndex(index)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Feature Content */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.id}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <FeatureDisplay
                  feature={activeFeature}
                  onNext={handleNext}
                  onPrev={handlePrev}
                />
              </motion.div>
            </AnimatePresence>

            {/* Progress Dots - Moved to bottom */}
            <div className="flex justify-center items-center gap-2 mt-12">
              {features.map((feature, index) => (
                <button
                  key={feature.id}
                  type="button"
                  aria-label={`Go to ${feature.tabLabel}`}
                  onClick={() => setActiveIndex(index)}
                  className="p-2 group"
                >
                  <span
                    className={cn(
                      'block h-1.5 rounded-full transition-all duration-300',
                      activeIndex === index
                        ? 'w-8'
                        : 'w-2 bg-gray-200 group-hover:bg-gray-300'
                    )}
                    style={{
                      backgroundColor: activeIndex === index ? (feature.color || '#3B82F6') : undefined
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    );
  }
);

FeaturesSection.displayName = 'FeaturesSection';

export default FeaturesSection;
