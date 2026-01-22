import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import ExportActions from '../../../../components/UI/Export/ExportActions';
import Button from '../../../../components/UI/Button/Button';

interface TripDetailsHeaderProps {
    status?: 'In Progress' | 'Completed';
    onDelete?: () => void;
    onPdfExport?: () => void;
}

const TripDetailsHeader: React.FC<TripDetailsHeaderProps> = ({ status, onDelete, onPdfExport }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6 px-1">
            <div className="flex items-center gap-4 text-left">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 hover:bg-gray-200 rounded-full transition-colors"
                    title="Go Back"
                >
                    <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-[#202224]">Odometer Trip Details</h1>
                        {status === 'In Progress' && (
                            <span className="px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-100 rounded-full border border-amber-200 shadow-sm">
                                In Progress
                            </span>
                        )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500">Track and manage employee odometer readings</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <ExportActions
                    onExportPdf={onPdfExport}
                />
                <Button
                    variant="danger"
                    onClick={onDelete}
                    className="flex items-center"
                >
                    Delete Trip
                </Button>
            </div>
        </div>
    );
};

export default TripDetailsHeader;
