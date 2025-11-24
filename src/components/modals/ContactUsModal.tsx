import React from 'react';
import Button from '../UI/Button/Button';
import { EnvelopeIcon, LockClosedIcon, UserIcon, XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import logo from '../../assets/Image/logo.png';

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactUsModal: React.FC<ContactUsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
    >
      <div
        onClick={handleModalContentClick}
        className="bg-gray-100 rounded-lg shadow-xl w-full max-w-lg m-4 transform transition-all"
      >
        <div className="bg-gradient-to-r from-[#163355] to-[#197ADC] text-white p-6 rounded-t-lg relative">
          <h2 className="text-2xl font-bold">Contact Us</h2>
          <a href="#" className="flex items-center -ml-16">
            <img className="h-16 w-auto" src={logo} alt="SalesSphere Logo" />
            <span className="-ml-20 text-3xl font-bold">
              <span className="text-secondary">Sales</span><span className="text-white">Sphere</span>
            </span>
          </a>
          <p className="text-sm text-blue-100 mt-1">We'd love to hear from you! Send us a message and we'll get back to you shortly.</p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-blue-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-8">
          <form className="space-y-6">
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter name"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="relative">
              <ChatBubbleLeftRightIcon className="absolute left-3 top-5 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <textarea
                placeholder="Enter your message"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                required
              />
            </div>

            <Button
              variant="secondary"
              type="submit"
              className="w-full text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition-opacity"
            >
              SEND MESSAGE
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
            <LockClosedIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span>Your information is secure and will not be shared.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsModal;
