import React from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import Button from '../../../../../components/UI/Button/Button';
import SearchBar from '../../../../../components/UI/SearchBar/SearchBar';
import ExportActions from '../../../../../components/UI/Export/ExportActions';
import type { BeatPlanPermissions } from '../../../hooks/useBeatPlanPermissions';

interface BeatListHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onCreate: () => void;
    isFilterVisible: boolean;
    setIsFilterVisible: (visible: boolean) => void;
    onExportPdf: () => void;
    permissions: BeatPlanPermissions;
}

const BeatListHeader: React.FC<BeatListHeaderProps> = ({
    searchQuery,
    setSearchQuery,
    onCreate,
    isFilterVisible,
    setIsFilterVisible,
    onExportPdf,
    permissions
}) => {
    return (
        <div className="w-full flex flex-col gap-0 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="text-left shrink-0">
                    <h1 className="text-2xl sm:text-3xl font-black text-[#202224]">
                        Beat Plan List
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Manage your beat plans
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto lg:flex-1 lg:justify-end">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search by Beat Plan Name"
                        className="w-full lg:w-72 xl:w-80"
                    />

                    <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsFilterVisible(!isFilterVisible)}
                                className={`p-2.5 rounded-lg border transition-colors ${isFilterVisible
                                    ? 'bg-secondary text-white border-secondary shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                                title="Toggle Filters"
                            >
                                <FunnelIcon className="h-5 w-5" />
                            </button>

                            <ExportActions
                                onExportPdf={permissions.canExportPdf ? onExportPdf : undefined}
                            />
                        </div>

                        {permissions.canCreateTemplate && (
                            <Button onClick={onCreate} className="whitespace-nowrap">
                                Create Beat Plan
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeatListHeader;
