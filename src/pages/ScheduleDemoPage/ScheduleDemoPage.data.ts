import { CheckCircle2, Clock, Headphones, BarChart3 } from 'lucide-react';
import type { Benefit } from './ScheduleDemoPage.types';

export const DEMO_BENEFITS: Benefit[] = [
  {
    icon: CheckCircle2,
    title: 'Real-Time Field Visibility',
    description:
      'See how GPS attendance, live tracking, and beat planning keep you connected with your team.',
  },
  {
    icon: Clock,
    title: 'Streamlined Operations',
    description:
      'Learn how order management, collections, and expense tracking simplify daily workflows.',
  },
  {
    icon: Headphones,
    title: 'Complete Sales Management',
    description:
      'Explore party management, catalogs, estimates, and analytics all in one platform.',
  },
  {
    icon: BarChart3,
    title: 'Actionable Insights',
    description:
      'Discover powerful reports and dashboards to make data-driven decisions for your team.',
  },
];

export const PAGE_CONTENT = {
  title: 'Transform Your',
  titleHighlight: 'Field Sales',
  titleEnd: 'Operations',
  subtitle:
    'Book a free, no-obligation demo and discover how SalesSphere can streamline your field operations, boost productivity, and help your team succeed.',
  formTitle: 'Request Your Demo',
  formSubtitle: "Fill in your details and we'll get back to you within 24 hours.",
  privacyNote: 'Your information is secure and will never be shared with third parties.',
  submitButton: 'Schedule My Demo',
  submittingButton: 'Submitting...',
};
