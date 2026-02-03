import {
  BarChart3,
  MapPin,
  Calendar,
  ClipboardCheck,
  ShoppingCart,
  Receipt,
  Users,
  Wallet,
  Car,
} from 'lucide-react';
import gpsImage from '@/assets/images/gps.webp';
import analyticsImage from '@/assets/images/analytics.webp';
import beatplanImage from '@/assets/images/beat-plan.webp';
import type { Feature } from './FeaturesSection.types';

export const DEFAULT_FEATURES: Feature[] = [
  {
    id: 'live-tracking',
    title: 'Track Your Field Team in Real-Time',
    tabLabel: 'Live Tracking',
    badge: 'GPS Tracking',
    description:
      'Monitor your field sales team with real-time GPS tracking. View active employee sessions, track entity locations on map, and access complete tracking history with session playback.',
    image: gpsImage,
    alt: 'Live GPS tracking dashboard showing field team locations on map',
    points: [
      'Active employee session tracking',
      'Entity locations on map',
      'Session history with playback',
    ],
    icon: MapPin,
    color: '#3B82F6',
  },
  {
    id: 'attendance',
    title: 'Manage Team Attendance Effortlessly',
    tabLabel: 'Attendance',
    badge: 'Attendance Management',
    description:
      'Track your team\'s attendance with a comprehensive monthly calendar view. Update individual or bulk attendance status, mark holidays, and export attendance reports to PDF.',
    image: gpsImage,
    alt: 'Attendance management interface with monthly calendar view',
    points: [
      'Monthly calendar view',
      'Individual & bulk status updates',
      'Export to PDF',
    ],
    icon: Calendar,
    color: '#10B981',
  },
  {
    id: 'beat-plan',
    title: 'Plan and Track Sales Beats',
    tabLabel: 'Beat Plan',
    badge: 'Beat Planning',
    description:
      'Create and manage beat plans for your sales team. View active beats in progress, manage your beat list, and track completed beats with detailed records.',
    image: beatplanImage,
    alt: 'Beat plan management showing active and completed beats',
    points: [
      'Active beats tracking',
      'Beat list management',
      'Completed beats history',
    ],
    icon: ClipboardCheck,
    color: '#8B5CF6',
  },
  {
    id: 'orders',
    title: 'Manage Orders and Estimates',
    tabLabel: 'Orders',
    badge: 'Sales Management',
    description:
      'Handle your sales workflow with order and estimate management. Create new transactions, view order lists, manage estimates, and track order details with complete history.',
    image: analyticsImage,
    alt: 'Order and estimate management interface',
    points: [
      'Order list management',
      'Estimate creation & tracking',
      'Transaction creation',
    ],
    icon: ShoppingCart,
    color: '#F59E0B',
  },
  {
    id: 'parties',
    title: 'Manage Parties and Prospects',
    tabLabel: 'CRM',
    badge: 'Customer Management',
    description:
      'Keep all your customer data organized. Manage parties with contact details, track prospects through your sales pipeline, and maintain complete customer history.',
    image: analyticsImage,
    alt: 'Party and prospect management dashboard',
    points: [
      'Party management with details',
      'Prospect tracking',
      'Import & export data',
    ],
    icon: Users,
    color: '#EC4899',
  },
  {
    id: 'collections',
    title: 'Track Payment Collections',
    tabLabel: 'Collections',
    badge: 'Collection Tracking',
    description:
      'Record and track payment collections from parties. Filter by payment mode, party, date, and creator. Export collection reports to PDF and Excel.',
    image: analyticsImage,
    alt: 'Collection tracking interface showing payment records',
    points: [
      'Collection recording',
      'Advanced filtering options',
      'PDF & Excel export',
    ],
    icon: Wallet,
    color: '#14B8A6',
  },
  {
    id: 'expenses',
    title: 'Streamline Expense Management',
    tabLabel: 'Expenses',
    badge: 'Expense Tracking',
    description:
      'Let your team submit expenses with receipt uploads. Categorize expenses, link to parties, and export expense reports to PDF and Excel for accounting.',
    image: analyticsImage,
    alt: 'Expense submission and management interface',
    points: [
      'Expense submission with receipts',
      'Category & party linking',
      'PDF & Excel export',
    ],
    icon: Receipt,
    color: '#EF4444',
  },
  {
    id: 'odometer',
    title: 'Track Odometer Records',
    tabLabel: 'Odometer',
    badge: 'Mileage Tracking',
    description:
      'Record and track odometer readings for your field team. View employee-wise records, track individual trips, and export mileage reports for reimbursement.',
    image: gpsImage,
    alt: 'Odometer tracking interface showing trip records',
    points: [
      'Employee-wise records',
      'Trip-wise tracking',
      'Export to PDF',
    ],
    icon: Car,
    color: '#6366F1',
  },
  {
    id: 'analytics',
    title: 'Gain Insights with Analytics',
    tabLabel: 'Analytics',
    badge: 'Reports & Insights',
    description:
      'Make data-driven decisions with comprehensive analytics. View sales overview dashboard, track potential customers in prospect analytics, and visualize performance data.',
    image: analyticsImage,
    alt: 'Analytics dashboard with sales and prospect charts',
    points: [
      'Sales overview dashboard',
      'Prospect pipeline analytics',
      'Performance dashboards',
    ],
    icon: BarChart3,
    color: '#A855F7',
  },
];
