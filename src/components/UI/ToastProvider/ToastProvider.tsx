// src/components/UI/ToastProvider/ToastProvider.tsx
import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider: React.FC = () => {
  return (
    // The Toaster component displays all the toast messages globally
    <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
            // Styling options for uniformity
            duration: 3000, // Show for 3 seconds
            style: {
                padding: '16px',
                fontWeight: 500,
                fontSize: '15px',
                borderRadius: '8px',
            },
        }}
    />
  );
};

export default ToastProvider;
