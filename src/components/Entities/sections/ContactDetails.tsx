import React from 'react';
import { PhoneIcon} from '@heroicons/react/24/outline';

interface ContactDetailsProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
  isSaving?: boolean;
}

export const ContactDetails: React.FC<ContactDetailsProps> = ({ formData, onChange, errors, isSaving }) => {
  const inputClass = (name: string) => 
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
      errors[name] ? 'border-red-500' : 'border-gray-300'
    }`;

  return (
    <>
      {/* Section Header */}
      <div className="md:col-span-2 pt-4 pb-2 mt-4 border-t border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <PhoneIcon className="w-5 h-5 text-blue-600" /> Contact Details
        </h3>
      </div>

      {/* Phone Number Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            maxLength={10}
            className={inputClass('phone')}
            placeholder="Enter 10-digit phone"
            disabled={isSaving}
          />
        </div>
        {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
      </div>

      {/* Email Address Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className={inputClass('email')}
            placeholder="Enter email"
            disabled={isSaving}
          />
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>
    </>
  );
};