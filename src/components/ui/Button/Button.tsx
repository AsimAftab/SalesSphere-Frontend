import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
  size?: 'default' | 'sm' | 'xs' | 'icon';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'default',
  className = '',
  isLoading = false,
  disabled, // Explicitly destructure disabled here
  ...props
}) => {
  const baseStyles =
    'font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:scale-105 whitespace-nowrap flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100';

  const sizeStyles = {
    default: 'rounded-xl px-5 py-2.5 text-sm',
    sm: 'rounded-lg px-4 py-2 text-xs',
    xs: 'rounded-md px-3 py-1.5 text-[10px]',
    icon: 'rounded-full p-2',
  };

  const variantStyles = {
    primary: 'bg-secondary/90 text-white hover:bg-secondary',
    secondary: 'bg-secondary/90 text-white hover:bg-secondary',
    outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    danger: 'bg-white text-red-600 border border-red-300 hover:bg-red-600 hover:text-white hover:border-red-600',
    success: 'bg-white text-green-600 border border-green-300 hover:bg-green-600 hover:text-white hover:border-green-600',
    ghost: 'bg-transparent text-primary hover:bg-gray-100',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={isLoading || disabled} // Now 'disabled' is defined
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;