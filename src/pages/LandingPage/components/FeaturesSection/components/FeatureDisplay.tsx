import { memo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { FeatureDisplayProps } from '../FeaturesSection.types';

const FeatureDisplay = memo<FeatureDisplayProps>(({ feature, onNext, onPrev }) => {
  const activeColor = feature.color || '#3B82F6';

  return (
    <div className="relative px-4 sm:px-12 md:px-16">
      {/* Navigation Arrows - Desktop only */}
      <button
        type="button"
        aria-label="Previous feature"
        onClick={onPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white text-gray-400 hover:text-gray-900 shadow-lg hover:bg-gray-50 z-10 hidden md:flex items-center justify-center transition-all duration-300"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        type="button"
        aria-label="Next feature"
        onClick={onNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white text-gray-400 hover:text-gray-900 shadow-lg hover:bg-gray-50 z-10 hidden md:flex items-center justify-center transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Card Container */}
      <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-200 grid grid-cols-1 lg:grid-cols-2 min-h-[350px] lg:min-h-[450px]">
        {/* Image Side (Left) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="order-1 p-6 lg:p-8 flex items-center justify-center relative overflow-hidden min-h-[400px]"
        >
          {Array.isArray(feature.image) ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Back Image (List View) */}
              <motion.img
                key={`${feature.id}-back`}
                src={feature.image[0]}
                alt={`${feature.alt} - view 1`}
                initial={{ opacity: 0, x: -20, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute left-0 top-4 w-[75%] h-auto object-contain z-10 rounded-xl shadow-lg border border-gray-100 transform -rotate-3"
              />
              {/* Front Image (Map/Details View) */}
              <motion.img
                key={`${feature.id}-front`}
                src={feature.image[1]}
                alt={`${feature.alt} - view 2`}
                initial={{ opacity: 0, x: 20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute right-0 bottom-4 w-[75%] h-auto object-contain z-20 rounded-xl shadow-2xl border border-gray-100 transform rotate-3"
              />
            </div>
          ) : (
            <motion.img
              key={feature.id}
              src={feature.image}
              alt={feature.alt}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full h-auto max-h-[550px] object-contain relative z-10 drop-shadow-2xl rounded-lg transform transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          )}
        </motion.div>

        {/* Content Side (Right) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="order-2 p-6 lg:p-8 flex flex-col justify-center"
        >
          {/* Badge */}
          <div
            className="inline-flex items-center px-4 py-1.5 rounded-full mb-6 w-fit font-semibold text-xs uppercase tracking-wider"
            style={{
              backgroundColor: `${activeColor}15`,
              color: activeColor
            }}
          >
            {feature.badge}
          </div>

          {/* Title */}
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-gray-500 mb-8 leading-relaxed text-base lg:text-lg">
            {feature.description}
          </p>

          {/* Feature Points */}
          <ul className="space-y-4">
            {feature.points.map((point, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <div
                  className="mt-0.5 rounded-full p-0.5"
                  style={{ backgroundColor: `${activeColor}20` }}
                >
                  <CheckCircle2
                    className="w-4 h-4"
                    style={{ color: activeColor }}
                  />
                </div>
                <span className="text-gray-700 font-medium text-base">{point}</span>
              </motion.li>
            ))}
          </ul>

          {/* CTA Button (Optional based on design, but good for conversion) */}
        </motion.div>
      </div>
    </div>
  );
});

FeatureDisplay.displayName = 'FeatureDisplay';

export default FeatureDisplay;
