// src/pages/AnalyticsPage.tsx

import React, { useState } from 'react';
// Remove unused 'UseQueryResult' import to clear the warning
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'; 
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import AnalyticsContent from './AnalyticsContent';
import { fetchFullAnalyticsData, type FullAnalyticsData } from '../../api/analyticsService'; 

// Define the exact type for the query function's result
type AnalyticsData = FullAnalyticsData;
type AnalyticsError = Error;

// Define the type for the options object explicitly
type AnalyticsQueryOptions = UseQueryOptions<
    AnalyticsData, 
    AnalyticsError, 
    AnalyticsData,
    ['fullAnalytics', string, string] 
>;

const AnalyticsPage: React.FC = () => {
    
    const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear().toString();
    
    const [selectedMonth, setSelectedMonth] = useState(currentMonthName);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    // --- TanStack Query Integration ---
    
    // Define the options object using the explicit type
    const queryOptions: AnalyticsQueryOptions = {
        queryKey: ['fullAnalytics', selectedMonth, selectedYear],
        queryFn: () => fetchFullAnalyticsData(selectedMonth, selectedYear),
        
        // **FIX:** Replaced 'keepPreviousData: true' with the standard v5 equivalent:
        // placeholderData: true (keeps the old data rendered until the new data arrives)
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
                    // Ensures data is FullAnalyticsData | null
                    data={analyticsData ?? null} 
                    loading={loading}
                    error={errorMessage}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                />
            </div>
        </Sidebar>
    );
};

export type { FullAnalyticsData };
export default AnalyticsPage;