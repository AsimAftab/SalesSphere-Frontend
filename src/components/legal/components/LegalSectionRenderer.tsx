import React from 'react';
import { motion } from 'framer-motion';
import type { LegalSection } from '../LegalPageLayout.types';
import { sectionVariants } from '../LegalPageLayout.animations';
import LegalContentBlock from './LegalContentBlock';
import LegalContactCard from './LegalContactCard';

interface Props {
  section: LegalSection;
  isLast: boolean;
}

const LegalSectionRenderer: React.FC<Props> = ({ section, isLast }) => (
  <>
    <motion.section
      id={section.id}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="scroll-mt-[100px]"
    >
      <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
        <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary text-white text-sm font-bold flex items-center justify-center">
          {section.number}
        </span>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          {section.title}
        </h2>
      </div>

      <div className="space-y-4">
        {section.content.map((block, i) =>
          block.type === 'contact' ? (
            <LegalContactCard
              key={i}
              title={block.title}
              contacts={block.contacts}
              note={block.note}
              responseTime={block.responseTime}
            />
          ) : (
            <LegalContentBlock key={i} block={block} />
          ),
        )}
      </div>
    </motion.section>

    {!isLast && (
      <div className="my-2">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>
    )}
  </>
);

export default LegalSectionRenderer;
