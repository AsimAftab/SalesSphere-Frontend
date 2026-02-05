import { useFormContext } from 'react-hook-form';
import { AlertCircle, User } from 'lucide-react';

interface CommonDetailsProps {
    isEditMode?: boolean;
}

export const CommonDetails: React.FC<CommonDetailsProps> = ({ isEditMode = false }) => {
    const { register, formState: { errors } } = useFormContext();

    const renderError = (name: string) => {
        const errorMsg = errors[name]?.message as string;
        if (!errorMsg) return null;
        return <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errorMsg}</p>;
    };

    return (
        <>
            <div className="md:col-span-2 pb-2 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" /> General Details
                </h3>
            </div>

            <div className="md:col-span-2">
                <label htmlFor="org-name-input" className="block text-sm font-semibold text-gray-700 mb-2">
                    Organization Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        id="org-name-input"
                        type="text"
                        {...register('name')}
                        className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.name ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-200 focus:border-blue-500'}`}
                        placeholder="Enter organization name"
                    />
                </div>
                {renderError('name')}
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Owner Name {!isEditMode && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                    <input
                        type="text"
                        {...register('ownerName')}
                        readOnly={isEditMode}
                        className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all ${isEditMode ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : errors.ownerName ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                        placeholder="Enter owner name"
                    />
                </div>
                {!isEditMode && renderError('ownerName')}
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    PAN/VAT Number {!isEditMode && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                    <input
                        type="text"
                        maxLength={15}
                        {...register('panVat')}
                        readOnly={isEditMode}
                        className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all ${isEditMode ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : errors.panVat ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                        placeholder="Enter PAN/VAT number"
                    />
                </div>
                {!isEditMode && renderError('panVat')}
            </div>
        </>
    );
};
