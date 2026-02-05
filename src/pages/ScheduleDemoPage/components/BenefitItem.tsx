import { memo } from 'react';
import { motion } from 'framer-motion';
import type { BenefitItemProps } from '../ScheduleDemoPage.types';

const BenefitItem = memo<BenefitItemProps>(({ benefit, index }) => {
  const IconComponent = benefit.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 * index }}
      className="flex items-start gap-4"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <IconComponent className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
        <p className="text-sm text-gray-600">{benefit.description}</p>
      </div>
    </motion.div>
  );
});

BenefitItem.displayName = 'BenefitItem';

export default BenefitItem;
