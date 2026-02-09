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
      className="group relative w-full text-left rounded-2xl bg-white border border-gray-200 shadow-sm p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 h-full flex flex-col"
    >
      <div className="flex items-start justify-between mb-6">
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${colors.bg} transition-colors duration-300 group-hover:scale-105`}>
          {Icon && <Icon className={`h-7 w-7 ${colors.icon}`} />}
        </div>
        {matchCount !== null && (
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${colors.badge}`}>
            {matchCount} {matchCount === 1 ? 'match' : 'matches'}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight group-hover:text-blue-600 transition-colors">
        {category.title}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">
        {category.description}
      </p>

      <div className="flex items-center justify-between pt-5 border-t border-gray-100 w-full mt-auto">
        <span className="text-sm font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
          {category.items.length} articles
        </span>
        <div className={`p-2 rounded-full ${colors.bg} opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0`}>
          <ChevronRight className={`h-4 w-4 ${colors.icon}`} />
        </div>
      </div>
    </motion.button>
  );
};

export default HelpCenterCategoryCard;
