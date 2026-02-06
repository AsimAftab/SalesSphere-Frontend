import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/components/ui/utils';
import type { FeatureTabProps } from '../FeaturesSection.types';

const FeatureTab = memo<FeatureTabProps>(({ feature, isActive, onClick }) => {
  const IconComponent = feature.icon;
  const activeColor = feature.color || '#3B82F6';

  return (
    <motion.button
      onClick={onClick}
      type="button"
      aria-pressed={isActive}
      aria-label={`View ${feature.tabLabel} feature`}
      className={cn(
        'relative flex flex-col items-center justify-center gap-2 px-2 py-3 rounded-[1.25rem] transition-all duration-300 w-[130px] h-[120px]',
        isActive
          ? 'bg-white shadow-xl border border-gray-300 scale-105 z-10'
          : 'hover:bg-gray-50/50 hover:scale-105 border border-transparent'
      )}
      whileTap={{ scale: 0.98 }}
    >
      {/* Icon Container - Card Style */}
      <div
        className={cn(
          'p-3 rounded-2xl transition-colors duration-300 mb-1',
          isActive ? 'bg-opacity-20' : 'bg-gray-200'
        )}
        style={{
          backgroundColor: isActive ? `${activeColor}20` : undefined,
        }}
      >
        <IconComponent
          className={cn(
            "w-6 h-6 transition-colors duration-300",
            isActive ? "" : "text-gray-400"
          )}
          style={{ color: isActive ? activeColor : undefined }}
          strokeWidth={2}
        />
      </div>

      {/* Label */}
      <div className="flex flex-col items-center gap-0.5">
        {feature.tabLabel.split(' ').map((word, i) => (
          <span
            key={i}
            className={cn(
              "text-xs tracking-widest uppercase transition-colors duration-300",
              isActive ? "font-bold text-gray-900" : "font-medium text-gray-400"
            )}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Active Indicator Dot */}
      {isActive && (
        <motion.div
          layoutId="active-dot"
          className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: activeColor }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
});

FeatureTab.displayName = 'FeatureTab';

export default FeatureTab;
