import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps extends React.ComponentPropsWithoutRef<typeof Loader2> {
    size?: 'sm' | 'default' | 'lg' | 'xl';
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'default', className, ...props }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        default: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    };

    return (
        <Loader2
            className={cn("animate-spin text-blue-600", sizeClasses[size], className)}
            {...props}
        />
    );
};

export default LoadingSpinner;
