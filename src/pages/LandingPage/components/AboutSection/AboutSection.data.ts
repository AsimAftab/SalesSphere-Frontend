import {
  MapPin,
  BarChart3,
  Users,
  Shield,
  Zap,
  HeadphonesIcon,
} from 'lucide-react';
import type { AboutFeature } from './AboutSection.types';

export const DEFAULT_ABOUT_FEATURES: AboutFeature[] = [
  {
    id: 'real-time',
    icon: MapPin,
    title: 'Real-Time Visibility',
    description:
      'Track your field team with live GPS, monitor attendance, and view beat plan progress in real-time. Know exactly where your team is and what they are doing.',
  },
  {
    id: 'all-in-one',
    icon: Zap,
    title: 'All-In-One Platform',
    description:
      'Orders, estimates, collections, expenses, and customer management - everything in one place. No more switching between multiple apps or spreadsheets.',
  },
  {
    id: 'analytics',
    icon: BarChart3,
    title: 'Actionable Insights',
    description:
      'Make data-driven decisions with comprehensive analytics. Track sales performance, monitor team productivity, and identify growth opportunities.',
  },
  {
    id: 'team',
    icon: Users,
    title: 'Built for Teams',
    description:
      'From field executives to managers and admins - role-based access ensures everyone has the tools they need. Seamless collaboration across your organization.',
  },
  {
    id: 'secure',
    icon: Shield,
    title: 'Secure & Reliable',
    description:
      'Enterprise-grade security with role-based permissions. Your data is protected with industry-standard encryption and secure cloud infrastructure.',
  },
  {
    id: 'support',
    icon: HeadphonesIcon,
    title: 'Dedicated Support',
    description:
      'Get started quickly with easy onboarding and dedicated support. Our team is here to help you succeed every step of the way.',
  },
];
