import { useFormContext } from 'react-hook-form';
import { AlertCircle, FileText } from 'lucide-react';

export const AdditionalInfoSection = ({ isSaving }: { isSaving: boolean }) => {
  const { register, formState: { errors } } = useFormContext();

  const renderError = (name: string) => {
    const errorMsg = errors[name]?.message as string;
    if (!errorMsg) return null;
    return <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errorMsg}</p>;
  };

  return (
    <div className="col-span-full">
      <div className="border-b pb-2 mb-2 mt-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
          <FileText className="w-5 h-5 text-blue-600" />
          Additional Info
        </h3>
      </div>

      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Description
      </label>

      <textarea
        {...register('description')}
        rows={3}
        className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors resize-none ${errors.description ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-200'
          }`}
        placeholder="Add notes..."
        disabled={isSaving}
      />
      {renderError('description')}
    </div>
  );
};