import React from 'react';

interface DashboardHeaderProps {
    userName: string;
}

/**
 * DashboardHeader displays a personalized greeting with the user's first name
 * and the current date. Uses custom styling with text-secondary on the name.
 *
 * Note: WelcomeHeader from @/components/ui could be used, but this component
 * has specific styling requirements (text-secondary on name, different font weights)
 * that differ from the generic component.
 */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'Good Morning';
        if (hour >= 12 && hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const firstName = userName ? userName.split(' ')[0] : '';

    return (
        <div>
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
