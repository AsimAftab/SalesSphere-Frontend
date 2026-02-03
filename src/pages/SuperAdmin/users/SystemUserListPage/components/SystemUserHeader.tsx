import React from 'react';
import { Button, SearchBar } from '@/components/ui';

interface SystemUserHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onAddUser: () => void;
}

const SystemUserHeader: React.FC<SystemUserHeaderProps> = ({ searchQuery, setSearchQuery, onAddUser }) => {
    return (
        <div className="w-full flex flex-col gap-0 mb-8 px-1">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="text-left shrink-0">
                    <h1 className="text-2xl sm:text-3xl font-black text-[#202224]">
                        System Users
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500">Manage Super Admins and Developers</p>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto lg:flex-1 lg:justify-end">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search system users"
                        className="w-full lg:w-72 xl:w-80"
                    />

                    <Button
                        onClick={onAddUser}
                        className="w-full sm:w-auto whitespace-nowrap text-sm px-4 h-10 flex-shrink-0"
                    >
                        Add User
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SystemUserHeader;
