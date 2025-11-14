// src/components/UI/ToastProvider/ToastProvider.tsx
import React from 'react';
import { Toaster, toast } from 'react-hot-toast';

const ToastProvider: React.FC = () => {
  return (
    // The Toaster component displays all the toast messages globally
    <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
            // Styling options for uniformity
            duration: 3000, // Show for 3 seconds
            style: {
                padding: '16px',
                fontWeight: 500,
                fontSize: '15px',
                borderRadius: '8px',
            },
        }}
    >
        {(t) => (
            <div
                className={`${
                    t.visible ? 'animate-enter' : 'animate-leave'
                } flex items-center gap-3 bg-white shadow-lg rounded-lg pointer-events-auto p-4 font-medium text-[15px]`}
            >
                {/* Toast icon based on type */}
                {t.type === 'success' && (
                    <div className="flex-shrink-0 w-5 h-5 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
                {t.type === 'error' && (
                    <div className="flex-shrink-0 w-5 h-5 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
                {t.type === 'loading' && (
                    <div className="flex-shrink-0 w-5 h-5 text-blue-500">
                        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
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
                    className="flex-shrink-0 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded transition-colors"
                    aria-label="Close"
                >
                    <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        )}
    </Toaster>
  );
};

export default ToastProvider;
