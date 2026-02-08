export interface ContactInfo {
  type: 'email' | 'phone' | 'address';
  label: string;
  value: string;
  href?: string;
}

export type LegalContentBlock =
  | { type: 'paragraph'; text: string; bold?: boolean; italic?: boolean }
  | { type: 'list'; items: (string | { bold: string; text: string })[] }
  | { type: 'subheading'; text: string }
  | {
      type: 'contact';
      title: string;
      contacts: ContactInfo[];
      note?: string;
      responseTime?: string;
    }
  | { type: 'highlight'; text: string };

export interface LegalSection {
  id: string;
  number: number;
  title: string;
  navTitle: string;
  content: LegalContentBlock[];
}

export interface LegalFooterNoteData {
  title?: string;
  text: string;
  copyright?: boolean;
}

export interface LegalPageData {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: LegalSection[];
  footerNote: LegalFooterNoteData;
}
