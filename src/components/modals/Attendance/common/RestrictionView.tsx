import React from 'react';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import Button from '../../../ui/Button/Button';

interface RestrictionViewProps {
    weekday: string;
    reason?: string;
    onClose?: () => void;
}

const RestrictionView: React.FC<RestrictionViewProps> = ({ weekday, reason, onClose }) => {
    return (
        <div className="flex flex-col items-center justify-center p-6 text-center bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="bg-yellow-100 p-3 rounded-full mb-4">
                <ShieldExclamationIcon className="w-8 h-8 text-yellow-600" />
            </div>
            <h4 className="text-lg font-bold text-yellow-900 mb-2">Action Restricted</h4>
            <p className="text-sm text-yellow-800 max-w-xs mb-6">
                {reason || (
                    <>
                        This day is marked as a <span className="font-semibold">Weekly Off ({weekday})</span>. Attendance updates are restricted.
                    </>
                )}
            </p>
            {onClose && (
                <Button onClick={onClose} variant="secondary" className="w-full sm:w-auto">
                    Understood
                </Button>
            )}
        </div>
    );
};

export default RestrictionView;
