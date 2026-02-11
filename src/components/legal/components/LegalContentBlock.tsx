import React from 'react';
import { Info } from 'lucide-react';
import type { LegalContentBlock as ContentBlockType } from '../LegalPageLayout.types';

interface Props {
  block: ContentBlockType;
}

const LegalContentBlock: React.FC<Props> = ({ block }) => {
  switch (block.type) {
    case 'paragraph': {
      const classes = [
        'text-[15px] text-gray-600 leading-[1.8]',
        block.bold && 'font-semibold text-gray-700',
        block.italic && 'italic text-gray-500',
      ]
        .filter(Boolean)
        .join(' ');
      return <p className={classes} dangerouslySetInnerHTML={{ __html: block.text }} />;
    }

    case 'list':
      return (
        <ul className="space-y-2.5 text-[15px] text-gray-600 leading-[1.75] bg-gray-50/60 rounded-lg px-5 py-4 border border-gray-100">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-[10px] w-1.5 h-1.5 rounded-full bg-secondary/50 flex-shrink-0" />
              <span>
                {typeof item === 'string' ? (
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                ) : (
                  <>
                    <strong className="text-gray-800">{item.bold}</strong>{' '}
                    <span className="text-gray-600">{item.text}</span>
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      );

    case 'subheading':
      return (
        <h3 className="text-[15px] font-bold text-gray-800 pt-3 pb-0.5 flex items-center gap-2">
          <span className="w-1 h-4 bg-secondary/40 rounded-full" />
          {block.text}
        </h3>
      );

    case 'highlight':
      return (
        <div className="flex gap-3 bg-secondary/[0.04] border border-secondary/15 rounded-xl px-5 py-4 my-1">
          <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
          <p
            className="text-[15px] text-gray-700 leading-[1.75]"
            dangerouslySetInnerHTML={{ __html: block.text }}
          />
        </div>
      );

    case 'contact':
      return null;

    default:
      return null;
  }
};

export default LegalContentBlock;
