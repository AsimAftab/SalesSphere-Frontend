import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import ContactUsModal from './ContactUsModal';

interface ContactUsModalContextType {
  openContactUsModal: () => void;
}

const ContactUsModalContext = createContext<ContactUsModalContextType | undefined>(undefined);

export const useContactUsModal = () => {
  const context = useContext(ContactUsModalContext);
  if (!context) {
    throw new Error('useContactUsModal must be used within a ContactUsModalProvider');
  }
  return context;
};

export const ContactUsModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isContactUsModalOpen, setIsContactUsModalOpen] = useState(false);

  const openContactUsModal = () => setIsContactUsModalOpen(true);
  const closeContactUsModal = () => setIsContactUsModalOpen(false);

  return (
    <ContactUsModalContext.Provider value={{ openContactUsModal }}>
      {children}
      <ContactUsModal isOpen={isContactUsModalOpen} onClose={closeContactUsModal} />
    </ContactUsModalContext.Provider>
  );
};
