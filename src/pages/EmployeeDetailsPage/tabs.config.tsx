import React from 'react';
import { type Employee } from '@/api/employeeService';
import { type AttendanceSummaryData } from '@/api/employeeService';
import employeesIcon from '@/assets/images/icons/employees-icon.svg';
import ordersIcon from '@/assets/images/icons/orders-icon.svg';
import collectionIcon from '@/assets/images/icons/collection.svg';
import partiesIcon from '@/assets/images/icons/parties-icon.svg';
import prospectsIcon from '@/assets/images/icons/prospects-icon.svg';
import sitesIcon from '@/assets/images/icons/sites-icon.svg';

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
        icon: <img src={employeesIcon} className="w-5 h-5" alt="" />,
        component: DetailsTab,
    },
    {
        id: 'orders',
        label: 'Orders',
        icon: <img src={ordersIcon} className="w-5 h-5" alt="" />,
        permission: {
            customCheck: (hasPerm) => hasPerm('invoices', 'viewList')
        },
        component: OrdersTab,
    },
    {
        id: 'collections',
        label: 'Collections',
        icon: <img src={collectionIcon} className="w-5 h-5" alt="" />,
        permission: { module: 'collections', action: 'view' },
        component: CollectionsTab,
    },
    {
        id: 'party-mapping',
        label: 'Party Mapping',
        icon: <img src={partiesIcon} className="w-5 h-5" alt="" />,
        permission: { module: 'parties', action: 'viewList' },
        component: PartyMapping,
    },
    {
        id: 'prospect-mapping',
        label: 'Prospect Mapping',
        icon: <img src={prospectsIcon} className="w-5 h-5" alt="" />,
        permission: { module: 'prospects', action: 'viewList' },
        component: ProspectMapping,
    },
    {
        id: 'site-mapping',
        label: 'Site Mapping',
        icon: <img src={sitesIcon} className="w-5 h-5" alt="" />,
        permission: { module: 'sites', action: 'viewList' },
        component: SiteMapping,
    },
];
