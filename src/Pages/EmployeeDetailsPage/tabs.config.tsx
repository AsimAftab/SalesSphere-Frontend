import React from 'react';
import { UserCircle, ShoppingCart, DollarSign, Map, Users, UserPlus } from 'lucide-react';
import { type Employee } from '../../api/employeeService';
import { type AttendanceSummaryData } from '../../api/employeeService';

// Lazy load components for performance
const DetailsTab = React.lazy(() => import('./DetailsTab/DetailsTab'));
const OrdersTab = React.lazy(() => import('./OrdersTab/OrdersTab'));
const CollectionsTab = React.lazy(() => import('./CollectionsTab/CollectionsTab'));
const PartyMapping = React.lazy(() => import('./PartyMapping'));
const ProspectMapping = React.lazy(() => import('./ProspectMapping'));
const SiteMapping = React.lazy(() => import('./SiteMapping'));

// Define the common props that ALL tabs might receive
// Some tabs (like Orders) might ignore these and fetch their own data
export interface TabCommonProps {
    employee: Employee | null;
    attendanceSummary: AttendanceSummaryData | null;
    loading: boolean;
    error: string | null;
}

export interface TabConfigItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    // Granular permission check
    permission?: {
        module: string;
        action: string;
    } | {
        // Fallback for complex OR conditions
        customCheck: (hasPermission: (mod: string, feat: string) => boolean) => boolean;
    };
    component: React.LazyExoticComponent<React.FC<TabCommonProps>>;
}

export const EMPLOYEE_TABS: TabConfigItem[] = [
    {
        id: 'details',
        label: 'Details',
        icon: <UserCircle className="w-5 h-5" />,
        component: DetailsTab,
    },
    {
        id: 'orders',
        label: 'Orders',
        icon: <ShoppingCart className="w-5 h-5" />,
        permission: {
            customCheck: (hasPerm) => hasPerm('invoices', 'viewList')
        },
        component: OrdersTab,
    },
    {
        id: 'collections',
        label: 'Collections',
        icon: <DollarSign className="w-5 h-5" />,
        permission: { module: 'collections', action: 'view' },
        component: CollectionsTab,
    },
    {
        id: 'party-mapping',
        label: 'Party Mapping',
        icon: <Users className="w-5 h-5" />,
        permission: { module: 'parties', action: 'viewList' },
        component: PartyMapping,
    },
    {
        id: 'prospect-mapping',
        label: 'Prospect Mapping',
        icon: <UserPlus className="w-5 h-5" />,
        permission: { module: 'prospects', action: 'viewList' },
        component: ProspectMapping,
    },
    {
        id: 'site-mapping',
        label: 'Site Mapping',
        icon: <Map className="w-5 h-5" />,
        permission: { module: 'sites', action: 'viewList' },
        component: SiteMapping,
    },
];
