import type { LucideIcon } from 'lucide-react';


export interface DemoRequestFormData {
  name: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  country: string;
  preferredDate?: Date; // Optional as it is undefined initially
  message?: string;
}

export interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface DemoContentSectionProps {
  benefits: Benefit[];
}

export interface DemoRequestFormProps {
  onSuccess?: () => void;
}

export interface BenefitItemProps {
  benefit: Benefit;
  index: number;
}
