import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react'; 
import RequestDemoModal from './RequestDemoModal';

// Define the shape of the context data
interface ModalContextType {
  openDemoModal: () => void;
}

// Create the context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Create a custom hook for easy access to the context
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

// Create the Provider component
export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const openDemoModal = () => setIsDemoModalOpen(true);
  const closeDemoModal = () => setIsDemoModalOpen(false);

  return (
    <ModalContext.Provider value={{ openDemoModal }}>
      {children}
      {/* The modal itself lives here and is controlled by this provider */}
      <RequestDemoModal isOpen={isDemoModalOpen} onClose={closeDemoModal} />
    </ModalContext.Provider>
  );
};