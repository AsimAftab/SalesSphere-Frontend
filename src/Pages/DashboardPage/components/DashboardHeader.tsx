import React from 'react';

interface DashboardHeaderProps {
    userName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'Good Morning';
        if (hour >= 12 && hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const firstName = userName ? userName.split(' ')[0] : '';

    return (
        <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {getGreeting()}, <span className="text-secondary">{firstName}!</span>
            </h1>
            <p className="text-sm md:text-md text-gray-500 mt-1">
                {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}
            </p>
        </div>
    );
};

export default DashboardHeader;
