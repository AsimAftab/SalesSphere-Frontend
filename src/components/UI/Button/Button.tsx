import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'; 
  size?: 'default' | 'icon'; // Added 'size'
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'default', // Add size prop
  className = '',
  ...props
}) => {
  // Base styles that apply to all buttons
  const baseStyles =
    'font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:scale-105 whitespace-nowrap flex items-center justify-center'; // Made this more generic

  // Styles for different sizes
  const sizeStyles = {
    default: 'rounded-full px-6 py-3 text-sm',
    icon: 'rounded-full p-1', // Small padding for icon-only buttons
  };

  // Styles specific to each variant
  const variantStyles = {
    primary: 'bg-primary text-white bg-secondary/90',
    secondary: 'bg-primary text-white bg-secondary/90',
    outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    danger: 'bg-red-50 text-red-700 border border-red-300 hover:bg-red-600 hover:text-white hover:border-red-600',
    // New 'ghost' variant for the calendar arrows
    ghost: 'bg-transparent text-primary hover:bg-gray-100',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;