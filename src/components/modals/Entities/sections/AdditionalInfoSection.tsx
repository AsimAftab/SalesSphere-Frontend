import React from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface AdditionalInfoProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  errors: Record<string, string>;
  isSaving?: boolean;
}

export const AdditionalInfoSection: React.FC<AdditionalInfoProps> = ({ formData, onChange, errors, isSaving }) => {
  return (
    <div className="col-span-full">
      <div className="border-b pb-2 mb-2 mt-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
          <DocumentTextIcon className="w-5 h-5 text-blue-600" />
          Additional Info
        </h3>
      </div>

      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Description
      </label>

      <textarea
        name="description"
        rows={3}
        value={formData.description}
        onChange={onChange}
        className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors resize-none ${errors.description ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-200'
          }`}
        placeholder="Add notes..."
        disabled={isSaving}
      />

      {errors.description && (
        <p className="text-red-500 text-xs mt-1">{errors.description}</p>
      )}
    </div>
  );
};