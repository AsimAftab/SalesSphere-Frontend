import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOdometerPermissions } from '../../hooks/useOdometerPermissions';
import { SearchBar, ExportActions } from '@/components/ui';
import { ArrowLeft } from 'lucide-react';

interface OdometerDetailsHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onExportPdf?: () => void;
}

const OdometerDetailsHeader: React.FC<OdometerDetailsHeaderProps> = ({
    searchQuery, setSearchQuery, onExportPdf
}) => {
    const navigate = useNavigate();
    const { canExport } = useOdometerPermissions();

    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 px-1">
            <div className="flex items-center gap-4 text-left">
                <button
                    onClick={() => navigate('/odometer')}
                    className="p-2 -ml-2 hover:bg-gray-200 rounded-full transition-colors"
                    title="Go Back"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-[#202224]">Odometer List</h1>
                    <p className="text-xs sm:text-sm text-gray-500">Track and manage per employee odometer readings</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search By Date"
                    className="w-full sm:w-80"
                />

                <div className="flex items-center gap-3 w-full sm:w-auto justify-start sm:justify-end">
                    {canExport && <ExportActions onExportPdf={onExportPdf} />}
                </div>
            </div>
        </div>
    );
};

export default OdometerDetailsHeader;
