export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  items: FAQItem[];
}
