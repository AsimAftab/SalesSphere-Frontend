import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui';

interface PasswordInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
    icon?: React.ReactNode;
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
    icon,
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
                icon={icon}
                className="pr-12 min-h-[48px] text-base"
            />
            <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 bottom-[12px] text-gray-500 hover:text-gray-700 focus:text-secondary focus:outline-none transition-colors"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? (
                    <Eye className="h-5 w-5" />
                ) : (
                    <EyeOff className="h-5 w-5" />
                )}
            </button>
        </div>
    );
};

export default PasswordInput;
