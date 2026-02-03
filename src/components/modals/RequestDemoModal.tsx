import React from 'react';
import logo from '@/assets/images/logo.webp';
import { Button } from '@/components/ui';
import {
  Building2,
  Lock,
  Mail,
  Smartphone,
  User,
  X,
} from 'lucide-react';

interface RequestDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequestDemoModal: React.FC<RequestDemoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Stop click propagation to prevent closing the modal when clicking inside
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    // Modal Backdrop
    <div 
      onClick={onClose} 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
    >
      {/* Modal Content */}
      <div 
        onClick={handleModalContentClick}
        className="bg-gray-100 rounded-lg shadow-xl w-full max-w-lg m-4 transform transition-all"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#163355] to-[#197ADC] text-white p-6 rounded-t-lg relative">
        <h2 className="text-2xl font-bold">Request a Demo for </h2>
        <a href="/" className="flex items-center -ml-16">
                <img className="h-16 w-auto" src={logo} alt="SalesSphere Logo" />
                <span className="-ml-20 text-3xl font-bold">
                  <span className="text-secondary">Sales</span><span className="text-white">Sphere</span>
                </span>
        </a>
        <p className="text-sm text-blue-100 mt-1">One of our representative will GET IN TOUCH with you 👍</p>
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white hover:text-blue-200"
        >
            <X className="h-6 w-6" />
        </button>
        </div>
        
        {/* Form */}
        <div className="p-8">
          <form className="space-y-6">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Enter name" 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Company Name */}
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Enter company name" 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="email" 
                placeholder="Enter email address" 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Phone Number */}
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="tel" 
                placeholder="Enter phone number (Including Country Code)" 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Country
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option>Select Country</option>
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Australia</option>
              </select>
            </div> */}
            
            {/* Submit Button */}
            <Button 
                variant="secondary" 
                type="submit" 
                className="w-full text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition-opacity"
                >
                SUBMIT
            </Button>
          </form>

          {/* Security Note */}
          <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
            <Lock className="h-4 w-4 mr-2 text-gray-400" />
            <span>Your information is secure and will only be used to contact you for the demo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDemoModal;
