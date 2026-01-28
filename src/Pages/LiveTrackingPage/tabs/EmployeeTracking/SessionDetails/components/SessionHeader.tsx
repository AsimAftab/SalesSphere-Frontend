import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { UserSnippet } from '../../../../../../api/liveTrackingService';
import { StatusBadge } from '../../../../../../components/UI/statusBadge/statusBadge';

interface SessionHeaderProps {
    user: UserSnippet;
    status: string;
}

const SessionHeader: React.FC<SessionHeaderProps> = ({ user, status }) => {

 

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Back Button */}
                    <Link
                        to="/live-tracking"
                        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>

                    {/* Avatar */}
                    <div className="relative">
                        {user.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt={user.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-sm border-2 border-white">
                                <span className="text-sm font-bold tracking-wider">
                                    {user.name ? user.name.substring(0, 2).toUpperCase() : 'NA'}
                                </span>
                            </div>
                        )}
                        {/* Online Indicator if active */}
                        {status === 'active' && (
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                    </div>

                    {/* User Info */}
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">
                            {user.name}
                        </h1>
                        <p className="text-sm font-medium text-gray-500 tracking-wide flex items-center gap-1.5 mt-0.5">
                            {user.customRoleId?.name || 'Employee'}
                        </p>
                    </div>
                </div>

                {/* Status Badge */}
                <div>
                    <StatusBadge status={status} />
                </div>
            </div>
        </header>
    );
};

export default SessionHeader;
