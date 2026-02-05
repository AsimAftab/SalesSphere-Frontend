import { memo } from 'react';
import { motion } from 'framer-motion';
import BenefitItem from './BenefitItem';
import { PAGE_CONTENT } from '../ScheduleDemoPage.data';
import type { DemoContentSectionProps } from '../ScheduleDemoPage.types';

const DemoContentSection = memo<DemoContentSectionProps>(
  ({ benefits }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
        {PAGE_CONTENT.title}{' '}
        <span className="text-primary">{PAGE_CONTENT.titleHighlight}</span>{' '}
        {PAGE_CONTENT.titleEnd}
      </h1>

      <p className="text-lg text-gray-600 mb-8 leading-relaxed">{PAGE_CONTENT.subtitle}</p>

      <div className="space-y-5">
        {benefits.map((benefit, index) => (
          <BenefitItem key={benefit.title} benefit={benefit} index={index} />
        ))}
      </div>
    </motion.div>
  )
);

DemoContentSection.displayName = 'DemoContentSection';

export default DemoContentSection;
