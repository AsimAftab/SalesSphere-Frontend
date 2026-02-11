import React from 'react';
import { SystemUserCard, EmptyState, Button } from '@/components/ui';
import type { SystemUser } from '@/api/SuperAdmin';
import { Users } from 'lucide-react';
import employeesIcon from '@/assets/images/icons/employees-icon.svg';
import SystemUserListSkeleton from './SystemUserSkeleton';

interface SystemUserListProps {
    users: SystemUser[];
    isLoading: boolean;
    error: Error | null;
    onUserClick: (user: SystemUser) => void;
    onRetry?: () => void;
}

const SystemUserList: React.FC<SystemUserListProps> = ({ users, isLoading, error, onUserClick, onRetry }) => {

    if (isLoading) {
        return <SystemUserListSkeleton />;
    }

    if (error) {
        return (
            <div className="mt-8">
                <EmptyState
                    title="Failed to load users"
                    description={error.message || "An unexpected error occurred while fetching system users."}
                    icon={<Users className="w-16 h-16 text-red-400" />}
                    action={
                        onRetry ? (
                            <Button
                                onClick={onRetry}
                                variant="primary"
                            >
                                Try Again
                            </Button>
                        ) : undefined
                    }
                />
            </div>
        );
    }

    if (!users.length) {
        return (
            <div className="mt-8">
                <EmptyState
                    title="No System Users Found"
                    description="Get started by adding super admins or developers to the system. They will have elevated access privileges."
                    icon={<img src={employeesIcon} alt="System Users" className="w-16 h-16 opacity-50" />}
                />
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {users.map((user) => (
                <SystemUserCard
                    key={user._id}
                    user={user}
                    onClick={onUserClick}
                />
            ))}
        </div>
    );
};

export default SystemUserList;
