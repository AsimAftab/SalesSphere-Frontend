import { memo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { FeatureDisplayProps } from '../FeaturesSection.types';

// Consistent brand color for badge and checkmarks
const ACCENT_COLOR = '#3B82F6';

const FeatureDisplay = memo<FeatureDisplayProps>(({ feature, onNext, onPrev }) => {
  return (
    <div className="relative">
      {/* Navigation Arrows - Desktop only */}
      <button
        type="button"
        aria-label="Previous feature"
        onClick={onPrev}
        className="absolute -left-4 lg:-left-14 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200 shadow-md z-10 hidden lg:flex items-center justify-center transition-all hover:shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>
      <button
        type="button"
        aria-label="Next feature"
        onClick={onNext}
        className="absolute -right-4 lg:-right-14 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200 shadow-md z-10 hidden lg:flex items-center justify-center transition-all hover:shadow-lg"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>

      {/* Card Container */}
      <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[280px] sm:min-h-[320px] lg:min-h-[380px]">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-5 sm:p-7 lg:p-10 order-2 lg:order-1 flex flex-col justify-center"
          >
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 sm:mb-4 w-fit"
              style={{ backgroundColor: `${ACCENT_COLOR}15` }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: ACCENT_COLOR }}
              />
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: ACCENT_COLOR }}
              >
                {feature.badge}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base lg:text-lg">
              {feature.description}
            </p>

            {/* Feature Points */}
            <ul className="space-y-2 sm:space-y-2.5">
              {feature.points.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-2.5"
                >
                  <CheckCircle2
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                    style={{ color: ACCENT_COLOR }}
                  />
                  <span className="text-gray-700 font-medium text-sm sm:text-base">{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="order-1 lg:order-2 bg-blue-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center"
          >
            <img
              src={feature.image}
              alt={feature.alt}
              className="w-full h-auto rounded-lg sm:rounded-xl shadow-md sm:shadow-lg"
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
});

FeatureDisplay.displayName = 'FeatureDisplay';

export default FeatureDisplay;
