import React from 'react';
import { toast, type Toast } from 'react-hot-toast';
import {
  CheckCircle2,
  Loader2,
  X,
  XCircle,
} from 'lucide-react';

interface ToastItemProps {
    t: Toast;
}

export const ToastItem: React.FC<ToastItemProps> = ({ t }) => {
    return (
        <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
                } flex items-center gap-3 bg-white shadow-lg rounded-lg pointer-events-auto p-4 font-medium text-[15px]`}
        >
            {/* Toast icon based on type */}
            {t.type === 'success' && (
                <div className="flex-shrink-0 text-green-500">
                    <CheckCircle2 className="w-5 h-5" />
                </div>
            )}
            {t.type === 'error' && (
                <div className="flex-shrink-0 text-red-500">
                    <XCircle className="w-5 h-5" />
                </div>
            )}
            {t.type === 'loading' && (
                <div className="flex-shrink-0 text-blue-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                </div>
            )}
            {t.type === 'blank' && t.icon && (
                <div className="flex-shrink-0">{t.icon}</div>
            )}

            {/* Toast message */}
            <div className="flex-1">
                {typeof t.message === 'string' ? t.message : <>{t.message}</>}
            </div>

            {/* Close button */}
            <button
                type="button"
                onClick={() => toast.dismiss(t.id)}
                className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none"
                aria-label="Close"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};
