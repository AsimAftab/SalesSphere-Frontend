import { memo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { FeatureDisplayProps } from '../FeaturesSection.types';

const FeatureDisplay = memo<FeatureDisplayProps>(({ feature, onNext, onPrev }) => {
  return (
    <div className="relative grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 items-center">
      {/* Navigation Arrows - Desktop only */}
      <button
        type="button"
        aria-label="Previous feature"
        onClick={onPrev}
        className="absolute -left-4 lg:-left-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white hover:bg-gray-100 border border-gray-200 shadow-sm z-10 hidden lg:flex items-center justify-center transition-all"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>
      <button
        type="button"
        aria-label="Next feature"
        onClick={onNext}
        className="absolute -right-4 lg:-right-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white hover:bg-gray-100 border border-gray-200 shadow-sm z-10 hidden lg:flex items-center justify-center transition-all"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>

      {/* Content Side - Shows FIRST on mobile for better UX */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="order-1 lg:order-1"
      >
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 sm:mb-6"
          style={{ backgroundColor: `${feature.color}15` }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: feature.color }}
          />
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: feature.color }}
          >
            {feature.badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-5 sm:mb-8 leading-relaxed text-sm sm:text-base lg:text-lg">
          {feature.description}
        </p>

        {/* Feature Points */}
        <ul className="space-y-2.5 sm:space-y-4">
          {feature.points.map((point, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-start sm:items-center gap-2.5 sm:gap-3"
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <CheckCircle2
                  className="w-3.5 h-3.5"
                  style={{ color: feature.color }}
                />
              </div>
              <span className="text-gray-700 font-medium text-sm sm:text-base">{point}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Image Side - Shows SECOND on mobile */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="order-2 lg:order-2"
      >
        <div className="relative">
          {/* Glow effect behind image */}
          <div
            className="absolute -inset-2 sm:-inset-4 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-20"
            style={{ backgroundColor: feature.color }}
          />

          {/* Image container */}
          <div className="relative bg-white rounded-xl sm:rounded-2xl p-1.5 sm:p-2 border border-gray-200 shadow-lg">
            <img
              src={feature.image}
              alt={feature.alt}
              width={600}
              height={400}
              className="w-full h-auto rounded-lg sm:rounded-xl"
              loading="lazy"
            />
          </div>
        </div>
      </motion.div>

    </div>
  );
});

FeatureDisplay.displayName = 'FeatureDisplay';

export default FeatureDisplay;
