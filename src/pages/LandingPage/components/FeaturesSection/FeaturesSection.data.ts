import {
  BarChart3,
  MapPin,
  Calendar,
  ClipboardCheck,
  ShoppingCart,
  Users,
} from 'lucide-react';
import liveTrackingList from '@/assets/images/features-section/live-tracking-list.webp';
import liveTrackingMap from '@/assets/images/features-section/live-tracking-map.webp';
import attendanceImage from '@/assets/images/features-section/attendance.webp';
import updateAttendance from '@/assets/images/features-section/update-attendance.webp';
import orderList from '@/assets/images/features-section/order-list.webp';
import orderListDetails from '@/assets/images/features-section/order-list-details.webp';
import partyList from '@/assets/images/features-section/party-list.webp';
import partyListDetails from '@/assets/images/features-section/party-list-details.webp';
import salesAnalytics from '@/assets/images/features-section/sales-analytics.webp';
import prospectsAnalytics from '@/assets/images/features-section/prospects-analytics.webp';
import beatPlanList from '@/assets/images/features-section/beat-plan-list.webp';
import beatPlanForm from '@/assets/images/features-section/beat-plan-form.webp';
import type { Feature } from './FeaturesSection.types';

export const DEFAULT_FEATURES: Feature[] = [
  {
    id: 'live-tracking',
    title: 'Real-Time GPS Tracking',
    tabLabel: 'Live Tracking',
    badge: 'GPS Tracking',
    description:
      'Monitor your field sales team with real-time GPS tracking. View active sessions, track locations on map, and access complete tracking history with session playback.',
    image: [liveTrackingMap, liveTrackingList],
    alt: 'Live GPS tracking dashboard showing field team locations on map',
    points: [
      'Active employee session tracking',
      'Live location on map',
      'Session history with playback',
    ],
    icon: MapPin,
    color: '#3B82F6',
  },
  {
    id: 'attendance',
    title: 'Smart Attendance Management',
    tabLabel: 'Smart Attendance',
    badge: 'Attendance',
    description:
      'Track your team\'s attendance with GPS-based check-in and check-out. View monthly calendar, update status individually or in bulk, and export reports.',
    image: [attendanceImage, updateAttendance],
    alt: 'Attendance management interface with monthly calendar view',
    points: [
      'GPS-based check-in/check-out',
      'Monthly calendar view',
      'Export to PDF',
    ],
    icon: Calendar,
    color: '#10B981',
  },
  {
    id: 'beat-plan',
    title: 'Beat Plan Management',
    tabLabel: 'Beat Planning',
    badge: 'Planning',
    description:
      'Create and assign beat plans for your sales team. Track active beats in progress, manage schedules, and monitor completed visits with detailed records.',
    image: [beatPlanList, beatPlanForm],
    alt: 'Beat plan management showing active and completed beats',
    points: [
      'Create and assign beat plans',
      'Track active visits',
      'Completed beats history',
    ],
    icon: ClipboardCheck,
    color: '#8B5CF6',
  },
  {
    id: 'orders',
    title: 'Order Management System',
    tabLabel: 'Order Management',
    badge: 'Sales',
    description:
      'Handle your complete sales workflow. Create orders and estimates, track order status, manage transactions, and maintain complete order history.',
    image: [orderList, orderListDetails],
    alt: 'Order and estimate management interface',
    points: [
      'Create orders and estimates',
      'Track order status',
      'Complete transaction history',
    ],
    icon: ShoppingCart,
    color: '#F59E0B',
  },
  {
    id: 'parties',
    title: 'Customer Relationship Management',
    tabLabel: 'Customer Management',
    badge: 'CRM',
    description:
      'Keep all your customer data organized. Manage parties with contact details, track prospects through your sales pipeline, and maintain complete customer history.',
    image: [partyList, partyListDetails],
    alt: 'Party and prospect management dashboard',
    points: [
      'Party and prospect management',
      'Contact details and history',
      'Import and export data',
    ],
    icon: Users,
    color: '#EC4899',
  },
  {
    id: 'analytics',
    title: 'Analytics & Performance Dashboard',
    tabLabel: 'Sales Analytics',
    badge: 'Insights',
    description:
      'Make data-driven decisions with comprehensive analytics. View sales dashboards, track team performance, and generate detailed reports.',
    image: [salesAnalytics, prospectsAnalytics],
    alt: 'Analytics dashboard with sales and performance charts',
    points: [
      'Sales overview dashboard',
      'Team performance tracking',
      'Detailed reports',
    ],
    icon: BarChart3,
    color: '#A855F7',
  },
];
