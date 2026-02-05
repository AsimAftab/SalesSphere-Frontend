import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoForm } from './hooks/useDemoForm';
import { Button } from '@/components/ui';
import { X, User, Building2, Mail, Phone, Globe, Shield } from 'lucide-react';
import logo from '@/assets/images/logo-c.svg';

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

  // Input with icon classes
  const inputClasses = "block w-full rounded-xl border pl-11 pr-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 sm:text-sm";
  const getInputClass = (hasError: boolean) => {
    return `${inputClasses} ${hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-0'
      : 'border-gray-200 hover:border-gray-300 focus:border-secondary focus:ring-2 focus:ring-secondary/20'}`;
  };
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-1.5";
  const errorClasses = "mt-1.5 text-xs font-medium text-red-500";
  const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400";

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
            <div className="relative bg-primary px-6 py-6 text-center">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <img src={logo} alt="SalesSphere Logo" className="h-10 w-10" />
                  <span className="text-2xl font-bold tracking-tight">
                    <span className="text-secondary">Sales</span>
                    <span className="text-white">Sphere</span>
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Request a Demo
                  </h3>
                  <p className="text-sm text-white/80 mt-1 max-w-sm mx-auto">
                    See how SalesSphere can transform your sales operations with a personalized demo.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={submitHandler} className="flex flex-col">
              <div className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="demo-name" className={labelClasses}>Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className={iconClasses} />
                    <input
                      id="demo-name"
                      type="text"
                      placeholder="Enter your full name"
                      className={getInputClass(!!errors.name)}
                      {...register('name')}
                    />
                  </div>
                  {errors.name && <p className={errorClasses}>{errors.name.message}</p>}
                </div>

                {/* Company Name */}
                <div>
                  <label htmlFor="demo-company" className={labelClasses}>Company Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Building2 className={iconClasses} />
                    <input
                      id="demo-company"
                      type="text"
                      placeholder="Enter your company name"
                      className={getInputClass(!!errors.companyName)}
                      {...register('companyName')}
                    />
                  </div>
                  {errors.companyName && <p className={errorClasses}>{errors.companyName.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="demo-email" className={labelClasses}>Work Email <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className={iconClasses} />
                    <input
                      id="demo-email"
                      type="email"
                      placeholder="Enter your work email"
                      className={getInputClass(!!errors.email)}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && <p className={errorClasses}>{errors.email.message}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="demo-phone" className={labelClasses}>Phone Number <span className="text-gray-400 font-normal text-xs">(with country code)</span> <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Phone className={iconClasses} />
                    <input
                      id="demo-phone"
                      type="tel"
                      placeholder="e.g. +1 234 567 8900"
                      className={getInputClass(!!errors.phoneNumber)}
                      {...register('phoneNumber')}
                    />
                  </div>
                  {errors.phoneNumber && <p className={errorClasses}>{errors.phoneNumber.message}</p>}
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="demo-country" className={labelClasses}>Country <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Globe className={iconClasses} />
                    <input
                      id="demo-country"
                      type="text"
                      placeholder="Enter your country"
                      className={getInputClass(!!errors.country)}
                      {...register('country')}
                    />
                  </div>
                  {errors.country && <p className={errorClasses}>{errors.country.message}</p>}
                </div>
              </div>

              {/* Privacy Note */}
              <div className="px-6 pb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Your information is secure and will never be shared with third parties.</span>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  type="button"
                  className="text-gray-600 bg-white border-gray-300 hover:bg-gray-100 font-medium px-5"
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6"
                >
                  {isSubmitting ? 'Submitting...' : 'Request Demo'}
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
