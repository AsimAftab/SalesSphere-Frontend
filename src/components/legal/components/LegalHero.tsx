import React from 'react';
import { motion } from 'framer-motion';
import { heroVariants } from '../LegalPageLayout.animations';

interface Props {
  title: string;
  subtitle: string;
  lastUpdated: string;
}

const LegalHero: React.FC<Props> = ({ title, subtitle, lastUpdated }) => (
  <motion.div
    variants={heroVariants}
    initial="hidden"
    animate="visible"
    className="mb-8"
  >
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
      {title}
    </h1>
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
      <span>{subtitle}</span>
      <span className="hidden sm:inline text-gray-300">|</span>
      <span>Last Updated: {lastUpdated}</span>
    </div>
  </motion.div>
);

export default LegalHero;
