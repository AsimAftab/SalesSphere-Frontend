import React from 'react';
import SearchBar from '../../../../components/UI/SearchBar/SearchBar';
import ExportActions from '../../../../components/UI/Export/ExportActions';
import { useOdometerPermissions } from '../../hooks/useOdometerPermissions';

interface OdometerHeaderProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    onExportPdf: () => void;
}

const OdometerHeader: React.FC<OdometerHeaderProps> = ({
    searchQuery, setSearchQuery,
    onExportPdf
}) => {
    const { canExport } = useOdometerPermissions();

    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 px-1">
            <div className="text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#202224]">Odometer Records</h1>
                <p className="text-xs sm:text-sm text-gray-500">Overview of all employee odometer readings and travel statistics</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search By Employee"
                    className="w-full sm:w-80"
                />

                <div className="flex items-center gap-3 w-full sm:w-auto justify-start sm:justify-end">
                    {canExport && (
                        <ExportActions
                            onExportPdf={onExportPdf}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default OdometerHeader;
