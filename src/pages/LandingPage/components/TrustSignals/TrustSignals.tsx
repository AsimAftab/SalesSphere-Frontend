import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/components/ui/utils';
import type { TrustSignalsProps } from './TrustSignals.types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

/**
 * TrustSignals - Displays trust indicators and social proof
 * Shows statistics to build credibility with visitors
 */
const TrustSignals = memo<TrustSignalsProps>(({ title, stats, className }) => {
  return (
    <section className={cn('py-12 bg-white', className)}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-8"
          >
            {title}
          </motion.p>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              variants={itemVariants}
              className="text-center"
            >
              <motion.div
                className="text-3xl sm:text-4xl font-bold text-primary"
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: 'spring' as const,
                  stiffness: 100,
                  damping: 10,
                  delay: 0.2
                }}
              >
                {stat.value}
              </motion.div>
              <p className="mt-2 text-sm text-gray-600 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

TrustSignals.displayName = 'TrustSignals';

export default TrustSignals;
