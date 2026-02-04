import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/components/ui/utils';
import { AboutFeatureCard } from './components';
import { containerVariants } from './AboutSection.animations';
import { DEFAULT_ABOUT_FEATURES } from './AboutSection.data';
import type { AboutSectionProps } from './AboutSection.types';

const AboutSection = memo<AboutSectionProps>(
  ({
    title = 'Why Choose SalesSphere?',
    subtitle = 'Everything your field sales team needs to succeed - from real-time tracking to comprehensive analytics, all in one powerful platform.',
    features = DEFAULT_ABOUT_FEATURES,
    className,
  }) => {

    return (
      <section
        id="About"
        className={cn('relative py-16 md:py-24 scroll-mt-16 overflow-hidden', className)}
        aria-labelledby="about-title"
      >
        {/* Clean white background */}
        <div className="absolute inset-0 bg-white" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="mx-auto max-w-3xl text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2
              id="about-title"
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl"
            >
              {title}
            </h2>

            <motion.p
              className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {subtitle}
            </motion.p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {features.map((feature, index) => (
              <AboutFeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </motion.div>
        </div>
      </section>
    );
  }
);

AboutSection.displayName = 'AboutSection';

export default AboutSection;
