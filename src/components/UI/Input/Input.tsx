import React, { forwardRef } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, icon, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        {label} {props.required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`w-full ${icon ? 'pl-11' : 'px-4'} pr-4 py-2.5 bg-white border rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-gray-400
              ${error
                                ? 'border-red-500 focus:ring-2 focus:ring-red-100'
                                : 'border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary'
                            }
              ${props.disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'text-gray-900'}
              ${className}
            `}
                        {...props}
                    />
                    {error && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                            <ExclamationCircleIcon className="h-5 w-5" />
                        </div>
                    )}
                </div>
                {error ? (
                    <p className="mt-1 text-xs text-red-500">{error}</p>
                ) : helperText ? (
                    <p className="mt-1 text-xs text-gray-500">{helperText}</p>
                ) : null}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
