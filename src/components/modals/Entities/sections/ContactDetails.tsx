import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { useFormContext } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';

export const ContactDetails = ({ isSaving }: any) => {
  const { register, formState: { errors } } = useFormContext();

  const renderError = (name: string) => {
    const errorMsg = errors[name]?.message as string;
    if (!errorMsg) return null;
    return <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errorMsg}</p>;
  };

  return (
    <div className="md:col-span-2 pt-4 border-t border-dashed border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <PhoneIcon className="w-5 h-5 text-blue-600" /> Contact Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              {...register('phone')}
              className={`w-full pl-4 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-secondary transition-all ${errors.phone ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-200 focus:border-secondary'
                }`}
              placeholder="Enter 10-digit phone"
              disabled={isSaving}
            />
          </div>
          {renderError('phone')}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              {...register('email')}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
              placeholder="Enter email"
              disabled={isSaving}
            />
          </div>
          {renderError('email')}
        </div>
      </div>
    </div>
  );
};