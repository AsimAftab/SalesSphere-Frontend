import { useState, useEffect } from 'react';
import {
    DocumentTextIcon,
    ShoppingBagIcon,
    BanknotesIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../../api/authService'; // Assuming shared hook location
import type { TabConfigItem } from '../types';

export const usePartyTabSecurity = () => {
    const { hasPermission, isFeatureEnabled } = useAuth();
    const [activeTabId, setActiveTabId] = useState('details');

    const allTabs: TabConfigItem[] = [
        {
            id: 'details',
            label: 'Details',
            icon: <DocumentTextIcon className="w-4 h-4" />,
            path: 'details',
            // No permission required
        },
        {
            id: 'orders',
            label: 'Orders',
            icon: <ShoppingBagIcon className="w-4 h-4" />,
            path: 'orders',
            // Example: Using customCheck if we want to mimic complex logic, or standard module/action
            // Mimicking Employee Orders tab logic: hasPerm('invoices', 'viewList')? 
            // Or sticking to the previously agreed 'parties', 'view_orders'.
            // Let's stick to the direct permission for now as established in previous steps, but using 'action' key.
            permission: { module: 'parties', action: 'view_orders' }
        },
        {
            id: 'collections',
            label: 'Collections',
            icon: <BanknotesIcon className="w-4 h-4" />,
            path: 'collections',
            permission: { module: 'parties', action: 'view_collections' }
        },
    ];

    // Filter tabs based on permissions
    const allowedTabs = allTabs.filter(tab => {
        if (!tab.permission) return true; // Public tab

        if ('customCheck' in tab.permission) {
            return tab.permission.customCheck(hasPermission);
        }

        const { module, action } = tab.permission;
        // Check both Feature Flag and Role Permission (matches Employee logic)
        return isFeatureEnabled(module) && hasPermission(module, action);
    });

    // Ensure active tab is allowed
    useEffect(() => {
        const isAllowed = allowedTabs.find(t => t.id === activeTabId);
        if (!isAllowed && allowedTabs.length > 0) {
            setActiveTabId(allowedTabs[0].id);
        }
    }, [allowedTabs, activeTabId]);

    return {
        allowedTabs,
        activeTabId,
        setActiveTabId,
        hasPermission // Expose for granular checks
    };
};
