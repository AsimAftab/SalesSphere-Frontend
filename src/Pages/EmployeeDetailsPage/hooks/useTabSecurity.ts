import { useMemo, useState, useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../api/authService';
import { EMPLOYEE_TABS } from '../tabs.config';

export const useTabSecurity = () => {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
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
        // Priority 1: URL Parameter (for persistence on reload)
        const paramTab = searchParams.get('tab');
        if (paramTab && allowedTabs.some(t => t.id === paramTab)) {
            return paramTab;
        }

        // Priority 2: Location State (e.g. from navigation)
        const state = location.state as { activeTab?: string };
        if (state?.activeTab && allowedTabs.some(t => t.id === state.activeTab)) {
            hasProcessedState.current = true;
            return state.activeTab;
        }

        // Priority 3: Default Tab
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

    // 4. Wrapper to sync URL when tab changes
    const handleTabChange = (id: string) => {
        setActiveTabId(id);
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('tab', id);
            return newParams;
        }, { replace: true });
    };

    return {
        allowedTabs,
        activeTabId,
        setActiveTabId: handleTabChange
    };
};
