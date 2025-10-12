// src/Components/ui/Button/Button.tsx
import React from 'react';

// Define the properties (props) the button can accept
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary', // Changed default to primary
  className = '',
  ...props
}) => {
  // Base styles that apply to all buttons
  const baseStyles =
    'rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

  // Styles specific to each variant
  const variantStyles = {
    // Both variants now use your theme's primary color for a consistent look
    primary: 'bg-primary text-white bg-secondary/90',
    secondary: 'bg-primary text-white bg-secondary/90',
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