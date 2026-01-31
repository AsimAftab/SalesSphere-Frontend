import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import Input from '../../../components/UI/Input/Input';

interface PasswordInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
}

/**
 * PasswordInput - Reusable password field with visibility toggle.
 * Wraps the shared Input component for consistent styling.
 */
const PasswordInput: React.FC<PasswordInputProps> = ({
    label,
    value,
    onChange,
    placeholder = 'Enter password',
    required = true,
    error,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <Input
                label={label}
                type={showPassword ? 'text' : 'password'}
                required={required}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                error={error}
                className="pr-10"
            />
            <button
                type="button"
                className="absolute right-3 bottom-[10px] text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
            >
                {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                ) : (
                    <EyeIcon className="h-5 w-5" />
                )}
            </button>
        </div>
    );
};

export default PasswordInput;
