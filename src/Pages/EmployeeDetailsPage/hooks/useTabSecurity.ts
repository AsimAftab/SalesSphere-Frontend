import { useMemo, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../api/authService';
import { EMPLOYEE_TABS } from '../tabs.config';

export const useTabSecurity = () => {
    const location = useLocation();
    const { hasPermission, isFeatureEnabled } = useAuth();
    const hasProcessedState = useRef(false);

    // 1. Filter Tabs based on Permissions
    const allowedTabs = useMemo(() => {
        return EMPLOYEE_TABS.filter(tab => {
            if (!tab.permission) return true; // Public tab

            if ('customCheck' in tab.permission) {
                return tab.permission.customCheck(hasPermission);
            }

            const { module, action } = tab.permission;
            return isFeatureEnabled(module) && hasPermission(module, action);
        });
    }, [hasPermission, isFeatureEnabled]);

    // 2. Determine Initial Active Tab
    const [activeTabId, setActiveTabId] = useState(() => {
        const state = location.state as { activeTab?: string };
        if (state?.activeTab && allowedTabs.some(t => t.id === state.activeTab)) {
            hasProcessedState.current = true;
            return state.activeTab;
        }
        const defaultTab = allowedTabs.find(t => t.id === 'details') || allowedTabs[0];
        return defaultTab?.id || 'details';
    });

    // 3. Handle External Navigation (e.g. Back button with state)
    useEffect(() => {
        const state = location.state as { activeTab?: string };
        if (!hasProcessedState.current && state?.activeTab && allowedTabs.some(t => t.id === state.activeTab)) {
            setActiveTabId(state.activeTab);
            hasProcessedState.current = true;
        }
    }, [location.state, allowedTabs]);

    return {
        allowedTabs,
        activeTabId,
        setActiveTabId
    };
};
