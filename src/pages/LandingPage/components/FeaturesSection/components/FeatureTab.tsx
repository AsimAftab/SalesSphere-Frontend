import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/components/ui/SuperadminComponents/utils';
import type { FeatureTabProps } from '../FeaturesSection.types';

const FeatureTab = memo<FeatureTabProps>(({ feature, isActive, onClick }) => {
  const IconComponent = feature.icon;

  return (
    <motion.button
      onClick={onClick}
      type="button"
      aria-pressed={isActive}
      aria-label={`View ${feature.tabLabel} feature`}
      className={cn(
        'relative flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap',
        isActive
          ? 'bg-primary text-white shadow-lg shadow-primary/25'
          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <IconComponent
        className="w-4 h-4"
        strokeWidth={2}
      />
      <span className="text-sm font-medium">{feature.tabLabel}</span>
    </motion.button>
  );
});

FeatureTab.displayName = 'FeatureTab';

export default FeatureTab;
