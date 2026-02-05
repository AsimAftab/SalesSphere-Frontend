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
  contentVariants,
} from './FeaturesSection.animations';
import type { FeaturesSectionProps } from './FeaturesSection.types';

const FeaturesSection = memo<FeaturesSectionProps>(
  ({
    features = DEFAULT_FEATURES,
    title = 'Powerful Features',
    subtitle = 'Everything you need to manage your field sales team effectively',
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
        className={cn('relative py-10 sm:py-12 md:py-16 bg-gray-50 overflow-hidden scroll-mt-14 sm:scroll-mt-16', className)}
        aria-labelledby="features-title"
        onMouseEnter={pauseAutoPlay}
        onMouseLeave={resumeAutoPlay}
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Header */}
          <motion.div variants={headerVariants} className="text-center mb-6 md:mb-8 px-2 sm:px-0">
            <h2
              id="features-title"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4"
            >
              {title}
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
              {subtitle}
            </p>
          </motion.div>

          {/* Feature Tabs */}
          <motion.div variants={tabContainerVariants} className="mb-4 sm:mb-6 md:mb-8 -mx-4 sm:mx-0">
            <motion.div
              ref={tabsContainerRef}
              className="flex overflow-x-auto md:flex-wrap md:justify-center gap-2 sm:gap-2.5 md:gap-3 pb-2 px-4 sm:px-1 md:px-0 no-scrollbar"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  ref={(el) => { tabRefs.current[index] = el; }}
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

            {/* Progress Dots */}
            <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 md:mt-8">
              {features.map((feature, index) => (
                <button
                  key={feature.id}
                  type="button"
                  aria-label={`Go to ${feature.tabLabel}`}
                  onClick={() => setActiveIndex(index)}
                  className="p-1 sm:p-1.5 group"
                >
                  <span
                    className={cn(
                      'block h-1 sm:h-1.5 rounded-full transition-all duration-300',
                      activeIndex === index ? 'w-6 sm:w-8 bg-primary' : 'w-1.5 sm:w-2 bg-gray-300 group-hover:bg-gray-400'
                    )}
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
