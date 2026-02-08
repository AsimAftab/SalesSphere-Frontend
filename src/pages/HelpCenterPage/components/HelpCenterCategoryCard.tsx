import React from 'react';
import { motion } from 'framer-motion';
import {
  Rocket,
  ShieldCheck,
  MapPinCheck,
  UserCog,
  AlertTriangle,
  Headphones,
  ChevronRight,
} from 'lucide-react';
import type { FAQCategory } from '../HelpCenterPage.types';
import { cardVariants } from '../HelpCenterPage.animations';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Rocket,
  ShieldCheck,
  MapPinCheck,
  UserCog,
  AlertTriangle,
  Headphones,
};

const colorMap: Record<string, { bg: string; icon: string; badge: string }> = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', badge: 'bg-blue-50 text-blue-600' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', badge: 'bg-purple-50 text-purple-600' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-600' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', badge: 'bg-orange-50 text-orange-600' },
  rose: { bg: 'bg-rose-50', icon: 'text-rose-600', badge: 'bg-rose-50 text-rose-600' },
  cyan: { bg: 'bg-cyan-50', icon: 'text-cyan-600', badge: 'bg-cyan-50 text-cyan-600' },
};

interface HelpCenterCategoryCardProps {
  category: FAQCategory;
  matchCount: number | null;
  onClick: () => void;
}

const HelpCenterCategoryCard: React.FC<HelpCenterCategoryCardProps> = ({
  category,
  matchCount,
  onClick,
}) => {
  const Icon = iconMap[category.icon];
  const colors = colorMap[category.color] ?? colorMap.blue;

  return (
    <motion.button
      variants={cardVariants}
      onClick={onClick}
      className="group relative w-full text-left rounded-xl bg-white border border-gray-200 shadow-sm p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
    >
      <div className="flex items-start justify-between mb-5">
        <div className={`inline-flex items-center justify-center w-11 h-11 rounded-lg ${colors.bg}`}>
          {Icon && <Icon className={`h-5 w-5 ${colors.icon}`} />}
        </div>
        {matchCount !== null && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors.badge}`}>
            {matchCount} {matchCount === 1 ? 'match' : 'matches'}
          </span>
        )}
      </div>

      <h3 className="text-base font-semibold text-gray-900 mb-1.5 tracking-tight group-hover:text-blue-600 transition-colors">
        {category.title}
      </h3>
      <p className="text-[13px] text-gray-500 leading-relaxed mb-5">
        {category.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-xs font-medium text-gray-400">{category.items.length} articles</span>
        <ChevronRight className="h-4 w-4 text-gray-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-blue-500" />
      </div>
    </motion.button>
  );
};

export default HelpCenterCategoryCard;
