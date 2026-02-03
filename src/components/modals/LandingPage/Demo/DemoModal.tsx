import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoForm } from './hooks/useDemoForm';
import { Button } from '@/components/ui';
import { X } from 'lucide-react';
import logo from '@/assets/images/logo-c.svg';

// ... (inside component)



interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const { form, isSubmitting, submitHandler } = useDemoForm({ onClose });
  const { register, formState: { errors }, reset } = form;

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  // Base input classes matching EmployeeForm
  const inputClasses = "block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-colors sm:text-sm";
  const getInputClass = (hasError: boolean) => {
    return `${inputClasses} ${hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-0'
      : 'border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary'}`;
  };
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-1.5";
  const errorClasses = "mt-1.5 text-xs font-medium text-red-500";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="relative pt-6 px-6 pb-4 text-center border-b border-gray-50/50">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <img src={logo} alt="SalesSphere Logo" className="h-8 w-8" />
                  <span className="text-2xl font-bold tracking-tight text-gray-900">
                    <span className="text-secondary">Sales</span>
                    <span className="text-gray-900">Sphere</span>
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Request a Demo
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 max-w-xs mx-auto">
                    Fill out the form below to get started.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={submitHandler} className="flex flex-col">
              <div className="p-6 space-y-6">
                {/* Name */}
                <div>
                  <label className={labelClasses}>Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    className={getInputClass(!!errors.name)}
                    {...register('name')}
                  />
                  {errors.name && <p className={errorClasses}>{errors.name.message}</p>}
                </div>

                {/* Company Name */}
                <div>
                  <label className={labelClasses}>Company Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. SalesSphere Inc."
                    className={getInputClass(!!errors.companyName)}
                    {...register('companyName')}
                  />
                  {errors.companyName && <p className={errorClasses}>{errors.companyName.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className={labelClasses}>Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    placeholder="e.g. john@example.com"
                    className={getInputClass(!!errors.email)}
                    {...register('email')}
                  />
                  {errors.email && <p className={errorClasses}>{errors.email.message}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label className={labelClasses}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +1 234 567 8900"
                    className={getInputClass(!!errors.phoneNumber)}
                    {...register('phoneNumber')}
                  />
                  {errors.phoneNumber && <p className={errorClasses}>{errors.phoneNumber.message}</p>}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  type="button"
                  className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DemoModal;
