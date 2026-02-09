import React from 'react';
import { motion } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import { ArrowLeft } from 'lucide-react';
import {
  Rocket,
  ShieldCheck,
  MapPinCheck,
  UserCog,
  AlertTriangle,
  Headphones,
} from 'lucide-react';
import type { FAQCategory, FAQItem } from '../HelpCenterPage.types';
import { accordionSectionVariants } from '../HelpCenterPage.animations';
import HelpCenterAccordionItem from './HelpCenterAccordionItem';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Rocket,
  ShieldCheck,
  MapPinCheck,
  UserCog,
  AlertTriangle,
  Headphones,
};

const colorMap: Record<string, { bg: string; icon: string }> = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600' },
  rose: { bg: 'bg-rose-50', icon: 'text-rose-600' },
  cyan: { bg: 'bg-cyan-50', icon: 'text-cyan-600' },
};

interface HelpCenterAccordionSectionProps {
  category: FAQCategory;
  items: FAQItem[];
  onBack: () => void;
}

const HelpCenterAccordionSection: React.FC<HelpCenterAccordionSectionProps> = ({
  category,
  items,
  onBack,
}) => {
  const Icon = iconMap[category.icon];
  const colors = colorMap[category.color] ?? colorMap.blue;

  return (
    <motion.div
      variants={accordionSectionVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto"
    >
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors focus:outline-none"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to categories
      </button>

      <div className="flex items-center gap-5 mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${colors.bg} shadow-sm`}>
          {Icon && <Icon className={`h-8 w-8 ${colors.icon}`} />}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">{category.title}</h2>
          <p className="text-sm font-medium text-gray-500">{items.length} {items.length === 1 ? 'article' : 'articles'} in this collection</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">No matching questions found in this category.</p>
        </div>
      ) : (
        <Accordion.Root type="single" collapsible className="space-y-2.5">
          {items.map((item) => (
            <HelpCenterAccordionItem key={item.id} item={item} />
          ))}
        </Accordion.Root>
      )}
    </motion.div>
  );
};

export default HelpCenterAccordionSection;
