import { memo } from 'react';
import { motion } from 'framer-motion';
import { cardVariants } from '../AboutSection.animations';
import type { AboutFeatureCardProps } from '../AboutSection.types';

const CARD_COLORS = [
  { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600' },
  { bg: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-600' },
  { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600' },
  { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-600' },
  { bg: 'bg-rose-500', light: 'bg-rose-50', text: 'text-rose-600' },
  { bg: 'bg-cyan-500', light: 'bg-cyan-50', text: 'text-cyan-600' },
];

const AboutFeatureCard = memo<AboutFeatureCardProps>(({ feature, index }) => {
  const IconComponent = feature.icon;
  const color = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <motion.div
      className="group relative"
      variants={cardVariants}
    >
      <div className="relative h-full p-6 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:border-gray-200 group-hover:-translate-y-1">
        {/* Gradient accent on hover */}
        <div className={`absolute inset-0 ${color.light} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />

        {/* Content */}
        <div className="relative z-10">
          {/* Icon with colored background */}
          <motion.div
            className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${color.bg} shadow-lg`}
            initial={{ scale: 0, rotate: -10 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + index * 0.05, duration: 0.4, type: 'spring', stiffness: 200 }}
          >
            <IconComponent className="w-6 h-6 text-white" strokeWidth={2} />
          </motion.div>

          {/* Title */}
          <motion.h3
            className="mt-4 text-lg font-bold text-gray-900"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + index * 0.05, duration: 0.3 }}
          >
            {feature.title}
          </motion.h3>

          {/* Description */}
          <motion.p
            className="mt-2 text-sm leading-relaxed text-gray-600"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
          >
            {feature.description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
});

AboutFeatureCard.displayName = 'AboutFeatureCard';

export default AboutFeatureCard;
