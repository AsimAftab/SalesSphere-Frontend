import React from 'react';
import type { StatusOption } from '../types';

interface BulkOptionCardProps {
    option: StatusOption;
    isSelected: boolean;
    onSelect: (code: string) => void;
}

const BulkOptionCard: React.FC<BulkOptionCardProps> = ({ option, isSelected, onSelect }) => {
    return (
        <div
            onClick={() => onSelect(option.code)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(option.code)}
            role="button"
            tabIndex={0}
            className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none transition-all duration-200 ${isSelected
                ? 'border-yellow-500 ring-1 ring-yellow-500 bg-yellow-50/50'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
        >
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                    <div className="text-sm">
                        <p className={`font-medium ${isSelected ? 'text-yellow-900' : 'text-gray-900'}`}>
                            {option.label}
                        </p>
                        {option.description && (
                            <p className={`inline ${isSelected ? 'text-yellow-700' : 'text-gray-500'}`}>
                                {option.description}
                            </p>
                        )}
                    </div>
                </div>
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-yellow-600' : 'border-gray-300'
                    }`}>
                    {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-yellow-600" />}
                </div>
            </div>
        </div>
    );
};

export default BulkOptionCard;
