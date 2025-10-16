// src/Components/UI/Button/Button.tsx
import React from 'react';

// Define the properties (props) the button can accept
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary', // Changed default to primary
  className = '',
  ...props
}) => {
  // Base styles that apply to all buttons
  const baseStyles =
    'rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:scale-105';

  // Styles specific to each variant
  const variantStyles = {
    // Both variants now use your theme's primary color for a consistent look
    primary: 'bg-primary text-white bg-secondary/90',
    secondary: 'bg-primary text-white bg-secondary/90',
    outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    danger:'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;