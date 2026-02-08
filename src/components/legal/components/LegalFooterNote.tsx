import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import type { LegalFooterNoteData } from '../LegalPageLayout.types';
import { fadeInVariants } from '../LegalPageLayout.animations';

interface Props {
  data: LegalFooterNoteData;
}

const LegalFooterNote: React.FC<Props> = ({ data }) => (
  <motion.div
    variants={fadeInVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.5 }}
    className="relative mt-10 pt-8 border-t border-gray-100"
  >
    <div className="bg-gray-50/80 border border-gray-200 rounded-xl px-6 py-6 text-center">
      <ShieldCheck className="w-6 h-6 text-secondary/50 mx-auto mb-3" />
      {data.title && (
        <p className="text-sm font-bold text-gray-800 mb-1.5">
          {data.title}
        </p>
      )}
      <p className="text-[13px] text-gray-500 leading-relaxed max-w-2xl mx-auto">
        {data.text}
      </p>
      {data.copyright && (
        <p className="text-xs text-gray-400 mt-4">
          &copy; {new Date().getFullYear()} SalesSphere Technologies Pvt. Ltd. All rights reserved.
        </p>
      )}
    </div>
  </motion.div>
);

export default LegalFooterNote;
