import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  User,
  Building2,
  Mail,
  Phone,
  Globe,
  Shield,
  MessageSquare,
} from 'lucide-react';
import { Button, DatePicker } from '@/components/ui';
import { demoRequestService } from '@/api/demoRequestService';
import { demoRequestSchema, DEFAULT_FORM_VALUES } from '../ScheduleDemoPage.schema';
import { PAGE_CONTENT } from '../ScheduleDemoPage.data';
import type { DemoRequestFormData, DemoRequestFormProps } from '../ScheduleDemoPage.types';

const INPUT_BASE_CLASSES =
  'block w-full rounded-xl border pl-11 pr-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 sm:text-sm';

const getInputClassName = (hasError: boolean) =>
  `${INPUT_BASE_CLASSES} ${hasError
    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
    : 'border-gray-200 hover:border-gray-300 focus:border-secondary focus:ring-2 focus:ring-secondary'
  }`;

const LABEL_CLASSES = 'block text-sm font-semibold text-gray-700 mb-1.5';
const ERROR_CLASSES = 'mt-1.5 text-xs font-medium text-red-500';
const ICON_CLASSES = 'absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400';

const DemoRequestForm = memo<DemoRequestFormProps>(({ onSuccess }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DemoRequestFormData>({
    resolver: zodResolver(demoRequestSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const onSubmit = useCallback(
    async (data: DemoRequestFormData) => {
      try {
        await demoRequestService.submit({
          ...data,
          preferredDate: data.preferredDate as Date,
        });
        toast.success('Demo request submitted successfully! We will contact you soon.');
        reset();
        onSuccess?.();
        navigate('/');
      } catch (error: unknown) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        const message =
          axiosError.response?.data?.message || 'Failed to submit demo request. Please try again.';
        toast.error(message);
      }
    },
    [navigate, reset, onSuccess]
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {PAGE_CONTENT.formTitle}
          </h2>
          <p className="text-gray-600">{PAGE_CONTENT.formSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Row 1: Full Name & Work Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="demo-name" className={LABEL_CLASSES}>
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className={ICON_CLASSES} />
                <input
                  id="demo-name"
                  type="text"
                  placeholder="Enter your full name"
                  className={getInputClassName(!!errors.name)}
                  {...register('name')}
                />
              </div>
              {errors.name && <p className={ERROR_CLASSES}>{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="demo-email" className={LABEL_CLASSES}>
                Work Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className={ICON_CLASSES} />
                <input
                  id="demo-email"
                  type="email"
                  placeholder="Enter your work email"
                  className={getInputClassName(!!errors.email)}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className={ERROR_CLASSES}>{errors.email.message}</p>}
            </div>
          </div>

          {/* Row 2: Phone Number & Company Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="demo-phone" className={LABEL_CLASSES}>
                Phone Number{' '}
                <span className="text-gray-400 font-normal text-xs">(with country code)</span>{' '}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className={ICON_CLASSES} />
                <input
                  id="demo-phone"
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  className={getInputClassName(!!errors.phoneNumber)}
                  {...register('phoneNumber')}
                />
              </div>
              {errors.phoneNumber && (
                <p className={ERROR_CLASSES}>{errors.phoneNumber.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="demo-company" className={LABEL_CLASSES}>
                Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className={ICON_CLASSES} />
                <input
                  id="demo-company"
                  type="text"
                  placeholder="Enter your company name"
                  className={getInputClassName(!!errors.companyName)}
                  {...register('companyName')}
                />
              </div>
              {errors.companyName && (
                <p className={ERROR_CLASSES}>{errors.companyName.message}</p>
              )}
            </div>
          </div>

          {/* Row 3: Country & Preferred Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="demo-country" className={LABEL_CLASSES}>
                Country <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Globe className={ICON_CLASSES} />
                <input
                  id="demo-country"
                  type="text"
                  placeholder="Enter your country"
                  className={getInputClassName(!!errors.country)}
                  {...register('country')}
                />
              </div>
              {errors.country && <p className={ERROR_CLASSES}>{errors.country.message}</p>}
            </div>

            <div>
              <label className={LABEL_CLASSES}>
                Preferred Date <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="preferredDate"
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    placeholder="Select preferred date"
                    minDate={new Date()}
                    error={!!errors.preferredDate}
                    align="right"
                  />
                )}
              />
              {errors.preferredDate && (
                <p className={ERROR_CLASSES}>{errors.preferredDate.message}</p>
              )}
            </div>
          </div>

          {/* Message (Optional) */}
          <div>
            <label htmlFor="demo-message" className={LABEL_CLASSES}>
              Message <span className="text-gray-400 font-normal text-xs">(optional)</span>
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <textarea
                id="demo-message"
                rows={3}
                placeholder="Tell us about your team size, specific needs, or any questions..."
                className="block w-full rounded-xl border border-gray-200 pl-11 pr-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 sm:text-sm hover:border-gray-300 focus:border-secondary focus:ring-2 focus:ring-secondary resize-none"
                {...register('message')}
              />
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
            <Shield className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span>{PAGE_CONTENT.privacyNote}</span>
          </div>

          {/* Submit Button */}
          <Button
            variant="secondary"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-base font-semibold"
          >
            {isSubmitting ? PAGE_CONTENT.submittingButton : PAGE_CONTENT.submitButton}
          </Button>
        </form>
      </div>
    </motion.div>
  );
});

DemoRequestForm.displayName = 'DemoRequestForm';

export default DemoRequestForm;
