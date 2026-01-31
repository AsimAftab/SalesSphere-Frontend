import { useState, useEffect, useCallback } from 'react';
import { getSystemStats } from '../../../../api/SuperAdmin/systemOverviewService';
import type { DashboardState } from '../types';

export const useDashboard = () => {
    const [state, setState] = useState<DashboardState>({
        data: null,
        isLoading: true,
        error: null
    });

    const fetchDashboardData = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const data = await getSystemStats();
            setState({
                data,
                isLoading: false,
                error: null
            });
        } catch (err: any) {
            console.error('Error loading dashboard:', err);
            setState({
                data: null,
                isLoading: false,
                error: err.message || 'Failed to load dashboard data. Please try again.'
            });
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return {
        ...state,
        refetch: fetchDashboardData
    };
};
