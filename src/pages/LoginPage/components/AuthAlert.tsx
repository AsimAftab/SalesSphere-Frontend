import React from 'react';

interface AuthAlertProps {
    message: string | null;
    variant: 'error' | 'success' | 'info';
}

const variantStyles: Record<AuthAlertProps['variant'], string> = {
    error: 'text-red-700 bg-red-50',
    success: 'text-green-700 bg-green-100',
    info: 'text-blue-700 bg-blue-50',
};

/**
 * AuthAlert - Consistent alert/message display for auth pages.
 * Renders nothing when message is null.
 */
const AuthAlert: React.FC<AuthAlertProps> = ({ message, variant }) => {
    if (!message) return null;

    return (
        <div className={`text-sm p-3 rounded-lg ${variantStyles[variant]}`}>
            {message}
        </div>
    );
};

export default AuthAlert;
