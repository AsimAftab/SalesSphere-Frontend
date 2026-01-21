import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/UI/Button/Button';

interface TripDetailsHeaderProps {
    onDelete?: () => void;
}

const TripDetailsHeader: React.FC<TripDetailsHeaderProps> = ({ onDelete }) => {
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
                    <h1 className="text-2xl font-bold text-[#202224]">Odometer Trip Details</h1>
                    <p className="text-xs sm:text-sm text-gray-500">Track and manage employee odometer readings</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
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
