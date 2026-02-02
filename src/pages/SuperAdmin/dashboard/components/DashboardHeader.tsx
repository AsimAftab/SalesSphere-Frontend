import React, { useMemo } from 'react';

interface DashboardHeaderProps {
    userName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
    // Current date formatted: "Saturday, January 31, 2026"
    const currentDate = useMemo(() => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }, []);

    // Greeting based on time of day
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    }, []);

    return (
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
                {greeting}, {userName}!
            </h1>
            <p className="mt-1 text-sm text-gray-500 font-medium">
                {currentDate}
            </p>
        </div>
    );
};

export default DashboardHeader;
