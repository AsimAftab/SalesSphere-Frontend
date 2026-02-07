import { memo } from 'react';
import { motion } from 'framer-motion';
import { cardVariants } from '../AboutSection.animations';
import type { AboutFeatureCardProps } from '../AboutSection.types';

const CARD_COLORS = [
  { iconBg: 'bg-blue-500', hoverBorder: 'group-hover:border-blue-400' },
  { iconBg: 'bg-orange-500', hoverBorder: 'group-hover:border-orange-400' },
  { iconBg: 'bg-emerald-500', hoverBorder: 'group-hover:border-emerald-400' },
  { iconBg: 'bg-purple-500', hoverBorder: 'group-hover:border-purple-400' },
  { iconBg: 'bg-rose-500', hoverBorder: 'group-hover:border-rose-400' },
  { iconBg: 'bg-cyan-500', hoverBorder: 'group-hover:border-cyan-400' },
];

const AboutFeatureCard = memo<AboutFeatureCardProps>(({ feature, index }) => {
  const IconComponent = feature.icon;
  const color = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <motion.div
      className="group relative"
      variants={cardVariants}
    >
      <div className={`relative h-full p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 ${color.hoverBorder} shadow-lg shadow-gray-200/50 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1`}>
        {/* Content */}
        <div className="relative z-10 text-left">
          {/* Icon with colored background */}
          <div
            className={`inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl ${color.iconBg} shadow-md`}
          >
            <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={1.5} />
          </div>

          {/* Title */}
          <h3 className="mt-4 sm:mt-5 text-lg sm:text-xl font-bold text-gray-900">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="mt-2 sm:mt-3 text-sm sm:text-base leading-relaxed text-gray-600">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

AboutFeatureCard.displayName = 'AboutFeatureCard';

export default AboutFeatureCard;
