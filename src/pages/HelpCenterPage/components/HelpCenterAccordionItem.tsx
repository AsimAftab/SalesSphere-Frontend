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
    className="group border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all duration-200 data-[state=open]:shadow-md data-[state=open]:border-blue-200 hover:border-blue-200"
  >
    <Accordion.Header>
      <Accordion.Trigger className="flex w-full items-center justify-between px-6 py-5 text-left text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors focus:outline-none tracking-tight">
        <span className="pr-4 leading-snug">{item.question}</span>
        <div className="flex-shrink-0 ml-2 p-1 rounded-full bg-gray-50 group-data-[state=open]:bg-blue-50 transition-colors">
          <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:text-blue-600" />
        </div>
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
      <div className="px-6 pb-6 pt-0">
        <div
          className="prose prose-sm prose-blue max-w-none text-gray-600 bg-gray-50/80 rounded-xl p-5 mt-2 transition-colors"
          dangerouslySetInnerHTML={{ __html: item.answer }}
        />
      </div>
    </Accordion.Content>
  </Accordion.Item>
);

export default HelpCenterAccordionItem;
