import React from 'react';
import SearchBar from '../../../../components/UI/SearchBar/SearchBar';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { Filter } from 'lucide-react';
import ExportActions from '../../../../components/UI/Export/ExportActions';

interface OdometerDetailsHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onExportPdf?: () => void;
    onExportExcel?: () => void;
}

const OdometerDetailsHeader: React.FC<OdometerDetailsHeaderProps> = ({
    searchQuery, setSearchQuery, onExportPdf, onExportExcel
}) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 px-1">
            <div className="flex items-center gap-4 text-left">
                <button
                    onClick={() => navigate('/odometer')}
                    className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors group"
                    title="Go Back"
                >
                    <ArrowLeftIcon className="h-6 w-6 text-gray-500 group-hover:text-[#202224]" />
                </button>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#202224]">Odometer List</h1>
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
                    <button className="p-2.5 rounded-lg border bg-white text-gray-600 hover:bg-gray-50">
                        <Filter size={20} />
                    </button>

                    <ExportActions
                        onExportPdf={onExportPdf}
                        onExportExcel={onExportExcel}
                    />
                </div>
            </div>
        </div>
    );
};

export default OdometerDetailsHeader;
