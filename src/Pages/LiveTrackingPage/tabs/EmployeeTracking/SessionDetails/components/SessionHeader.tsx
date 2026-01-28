import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface SessionHeaderProps {
    user: {
        name: string;
        avatarUrl?: string;
    };
    status: string;
}

const SessionHeader: React.FC<SessionHeaderProps> = ({ user, status }) => {
    return (
        <header className="bg-white shadow-sm z-10 px-4 flex-shrink-0">
            <div className="flex items-center h-16">
                <Link to="/live-tracking" className="mr-4 text-gray-500 hover:text-gray-700">
                    <ArrowLeft size={20} />
                </Link>

                <span className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mr-3">
                    {user.name.substring(0, 2).toUpperCase()}
                </span>

                <div>
                    <h1 className="text-lg font-bold">{user.name}</h1>
                    <p className={`text-xs font-semibold ${status === "active" ? "text-green-500" : "text-yellow-500"}`}>
                        {status}
                    </p>
                </div>
            </div>
        </header>
    );
};

export default SessionHeader;
