import React, { useState } from 'react';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'; 
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import AnalyticsContent from './AnalyticsContent';
import { fetchFullAnalyticsData, type FullAnalyticsData } from '../../api/analyticsService'; 

type AnalyticsData = FullAnalyticsData;
type AnalyticsError = Error;

type AnalyticsQueryOptions = UseQueryOptions<
    AnalyticsData, 
    AnalyticsError, 
    AnalyticsData,
    ['fullAnalytics', string, string] 
>;

const getCurrentDateDetails = () => {
    const today = new Date();
    const currentMonthName = today.toLocaleString('default', { month: 'long' });
    const currentYear = today.getFullYear().toString();
    return { currentMonthName, currentYear };
}

const AnalyticsPage: React.FC = () => {
    
    const { currentMonthName, currentYear } = getCurrentDateDetails();
    const [selectedMonth, setSelectedMonth] = useState(currentMonthName);
    const [selectedYear] = useState(currentYear); 
    const queryOptions: AnalyticsQueryOptions = {
        queryKey: ['fullAnalytics', selectedMonth, selectedYear],
        queryFn: () => fetchFullAnalyticsData(selectedMonth, selectedYear),
        placeholderData: (previousData) => previousData,
        
        staleTime: 0,
    };
    
    const { 
        data: analyticsData, 
        isLoading, 
        isError, 
        error 
    } = useQuery(queryOptions);

    const loading = isLoading;
    const errorMessage = isError ? error?.message || 'Failed to load analytics data. Please try again later.' : null;

    return (
        <Sidebar>
            <div className="flex flex-col flex-1 h-full overflow-hidden">
                <AnalyticsContent
                    data={analyticsData ?? null} 
                    loading={loading}
                    error={errorMessage}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    selectedYear={selectedYear}
                   
                     
                />
            </div>
        </Sidebar>
    );
};

export type { FullAnalyticsData };
export default AnalyticsPage;