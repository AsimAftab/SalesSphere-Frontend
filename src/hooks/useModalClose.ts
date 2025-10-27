import { useEffect } from 'react';

/**
 * Custom hook to handle modal close functionality
 * - Handles ESC key press
 * - Returns a function to handle backdrop clicks
 *
 * @param isOpen - Whether the modal is open
 * @param onClose - Function to call when closing the modal
 */
export function useModalClose(isOpen: boolean, onClose: () => void) {
  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Handle click outside (backdrop click)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return { handleBackdropClick };
}
