import { useFormContext, Controller } from 'react-hook-form';
import {
  AlertCircle,
  CalendarDays,
  User,
} from 'lucide-react';
import { DatePicker } from '@/components/ui';

interface CommonDetailsProps {
  labels: { name: string; owner: string };
  dateJoined?: string;
  isReadOnlyDate?: boolean;
}

export const CommonDetails = ({
  labels,
  isReadOnlyDate // Prop passed from the EditEntityModal index
}: CommonDetailsProps) => {
  const { register, control, formState: { errors } } = useFormContext();

  // Formatter for the read-only display
  const formatDateForDisplay = (date: string | Date | null | undefined) => {
    if (!date) return 'N/A';
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return date; // Return original string if conversion fails
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const inputClass = (name: string) =>
    `w-full px-4 py-2.5 border rounded-xl outline-none transition-all ${errors[name] ? 'border-red-500 ring-1 ring-red-100 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary'
    }`;

  const renderError = (name: string) => {
    const errorMsg = errors[name]?.message as string;
    if (!errorMsg) return null;
    return <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errorMsg}</p>;
  };

  return (
    <>
      <div className="md:col-span-2 pb-2 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-secondary" /> General Details
        </h3>
      </div>

      {/* Entity Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {labels.name} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('name')}
          className={inputClass('name')}
          placeholder={`Enter ${labels.name.toLowerCase()}`}
        />
        {renderError('name')}
      </div>

      {/* Owner Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {labels.owner} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('ownerName')}
          className={inputClass('ownerName')}
          placeholder="Enter owner name"
        />
        {renderError('ownerName')}
      </div>

      {/* Date Joined - Conditional Logic */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-gray-500" /> Date Joined
          {!isReadOnlyDate && <span className="text-red-500">*</span>}
        </label>

        {isReadOnlyDate ? (
          /* READ-ONLY VIEW (Edit Modal) - Accessing specific value via Controller logic or simpler approach? 
             Since it's read-only, we might need to watch the value or just rely on the prop passed if it's strictly initial.
             However, RHF holds the truth. Let's use Controller to get the value for display if we wanted, 
             but `isReadOnlyDate` implies we just show the static/initial value. 
             Actually, better to use the form value so it's consistent.
          */
          <Controller
            name="dateJoined"
            control={control}
            render={({ field }) => (
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed min-h-[42px] flex items-center">
                {String(formatDateForDisplay(field.value))}
              </div>
            )}
          />
        ) : (
          /* EDITABLE PICKER (Add Modal) */
          <Controller
            name="dateJoined"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="YYYY-MM-DD"
                minDate={new Date()}
                error={!!errors.dateJoined}
              />
            )}
          />
        )}
        {renderError('dateJoined')}
      </div>
    </>
  );
};