import React from 'react';

export interface CheckboxProps {
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
    indeterminate?: boolean;
    className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
    checked,
    onChange,
    disabled = false,
    indeterminate = false,
    className = '',
}) => (
    <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            disabled
                ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
                : checked || indeterminate
                    ? 'border-secondary bg-secondary'
                    : 'border-gray-300 bg-white hover:border-secondary'
        } ${className}`}
    >
        {checked && (
            <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        )}
        {indeterminate && !checked && (
            <div className="w-2.5 h-0.5 bg-white rounded" />
        )}
    </button>
);

export default Checkbox;
