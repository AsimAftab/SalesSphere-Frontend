import {
  MapPinIcon,
  ArchiveBoxIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline";
import gpsImage from "../../../assets/Image/gps.png";
import analyticsImage from "../../../assets/Image/analytics.png";
import accessImage from "../../../assets/Image/access.jpeg";
import beatplanImage from "../../../assets/Image/beat-plan.jpeg";

export interface Feature {
  id: string;
  title: string;
  tabLabel: string;
  badge: string;
  description: string;
  image: string;
  alt: string;
  points: string[];
  icon: any;
  color: string;
}

export const FEATURES_DATA: Feature[] = [
  {
    id: "gps",
    title: "Real-Time GPS Tracking for Your Entire Team",
    tabLabel: "GPS tracking",
    badge: "GPS Tracking",
    description:
      "Monitor field staff locations in real-time with accurate GPS tracking. Optimize routes, ensure safety, and improve operational efficiency with live location updates.",
    image: gpsImage,
    alt: "GPS tracking icon",
    points: ["Easy to use", "Real-time updates", "Customizable"],
    icon: MapPinIcon,
    color: "#3B82F6",
  },
  {
    id: "inventory",
    title: "Streamline Your Inventory Management",
    tabLabel: "Inventory management",
    badge: "Inventory management",
    description:
      "Track stock levels, manage orders, and automate reordering. Get real-time visibility into your inventory across all locations with powerful management tools.",
    image: "/assets/features/inventory-mockup.png",
    alt: "Inventory management",
    points: ["Stock Alerts", "Auto-reorder", "Multi-warehouse"],
    icon: ArchiveBoxIcon,
    color: "#10B981",
  },
  {
    id: "analytics",
    title: "Make Informed Decisions with Powerful Analytics",
    tabLabel: "Analytics Dashboard",
    badge: "Analytics Dashboard",
    description:
      "Comprehensive dashboards with real-time insights and detailed reports. Visualize trends, track KPIs, and make data-driven decisions with confidence.",
    image: analyticsImage,
    alt: "Analytics dashboard",
    points: ["Trend Analysis", "Custom Reports", "Export Data"],
    icon: ChartBarIcon,
    color: "#A855F7",
  },
  {
    id: "access",
    title: "Role-Based Access Control",
    tabLabel: "Role-Based Access",
    badge: "Role-Based Access",
    description:
      "Define user roles and permissions to control access to specific features and data. Ensure data security and compliance with granular access controls.",
    image: accessImage,
    alt: "Role-based access",
    points: ["User Roles", "Permission Management", "Data Security"],
    icon: ShieldCheckIcon,
    color: "#F59E0B",
  },
  {
    id: "attendance",
    title: "Smart Attendance Management",
    tabLabel: "Smart Attendance",
    badge: "Smart Attendance",
    description:
      "Automate attendance tracking with smart features like geofencing, time-based alerts, and detailed reporting. Reduce manual effort and improve accuracy.",
    image: "/assets/features/attendance-mockup.png",
    alt: "Smart attendance management",
    points: ["Geofencing", "Time Alerts", "Detailed Reports"],
    icon: ClockIcon,
    color: "#EF4444",
  },
  {
    id: "beat-plan",
    title: "Efficient Beat Plan Management",
    tabLabel: "Beat Plan Management",
    badge: "Beat Plan Management",
    description:
      "Plan and manage sales visits efficiently with customizable beat plans. Optimize routes, track performance, and ensure consistent coverage.",
    image: beatplanImage,
    alt: "Beat plan management",
    points: [
      "Customizable Routes",
      "Performance Tracking",
      "Coverage Optimization",
    ],
    icon: ArrowsRightLeftIcon,
    color: "#8B5CF6",
  },
];
