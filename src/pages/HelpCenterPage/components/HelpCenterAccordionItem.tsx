import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import type { FAQItem } from '../HelpCenterPage.types';

interface HelpCenterAccordionItemProps {
  item: FAQItem;
}

const HelpCenterAccordionItem: React.FC<HelpCenterAccordionItemProps> = ({ item }) => (
  <Accordion.Item
    value={item.id}
    className="border border-gray-200 rounded-xl bg-white overflow-hidden data-[state=open]:shadow-sm transition-all"
  >
    <Accordion.Header>
      <Accordion.Trigger className="group flex w-full items-center justify-between px-5 py-4 text-left text-[15px] font-semibold text-gray-800 hover:text-blue-600 transition-colors focus:outline-none tracking-tight">
        <span className="pr-4 leading-snug">{item.question}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
      <div className="mx-5 mb-4 border-t border-gray-100 pt-3">
        <div
          className="text-[13.5px] text-gray-500 leading-[1.7]"
          dangerouslySetInnerHTML={{ __html: item.answer }}
        />
      </div>
    </Accordion.Content>
  </Accordion.Item>
);

export default HelpCenterAccordionItem;
