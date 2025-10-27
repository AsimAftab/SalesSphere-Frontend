import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import AnalyticsContent from './AnalyticsContent';
import { getFullAnalyticsData, type FullAnalyticsData } from '../../api/services/dashboard/analyticsService';

const AnalyticsPage: React.FC = () => {
    const [analyticsData, setAnalyticsData] = useState<FullAnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get current month and year for the initial state
    const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear().toString();
    
    // State for the filters
    const [selectedMonth, setSelectedMonth] = useState(currentMonthName);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    // This effect runs on mount and whenever the filters change
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                // Pass the selected month and year to the API function
                const data = await getFullAnalyticsData(selectedMonth, selectedYear);
                setAnalyticsData(data);
            } catch (err) {
                setError('Failed to load analytics data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [selectedMonth, selectedYear]); // Dependency array ensures re-fetch on change

    return (
          <Sidebar >
            <div className="flex flex-col flex-1 overflow-y-auto">
                    <AnalyticsContent
                        data={analyticsData}
                        loading={loading}
                        error={error}
                        // Pass down the filter state and setters
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