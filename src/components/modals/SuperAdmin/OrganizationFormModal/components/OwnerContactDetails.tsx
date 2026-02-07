import { useFormContext } from 'react-hook-form';
import { AlertCircle, Mail, UserCircle } from 'lucide-react';

interface OwnerContactDetailsProps {
    isEditMode?: boolean;
    isSaving?: boolean;
}

export const OwnerContactDetails: React.FC<OwnerContactDetailsProps> = ({ isEditMode = false, isSaving = false }) => {
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
                    <UserCircle className="w-5 h-5 text-blue-600" /> Owner & Contact Details
                </h3>
            </div>

            {/* Row 1: Owner Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Owner Name {!isEditMode && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        type="text"
                        {...register('ownerName')}
                        readOnly={isEditMode}
                        disabled={isSaving}
                        className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all ${isEditMode ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : errors.ownerName ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                        placeholder="Enter owner name"
                    />
                    {!isEditMode && renderError('ownerName')}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address {!isEditMode && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            {...register('email')}
                            readOnly={isEditMode}
                            disabled={isSaving}
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none transition-all ${isEditMode ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : errors.email ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                            placeholder="Enter email address"
                        />
                    </div>
                    {!isEditMode && renderError('email')}
                </div>
            </div>

            {/* Row 2: Phone (Half Width) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                <div>
                    <label htmlFor="contact-phone-input" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="contact-phone-input"
                        type="tel"
                        {...register('phone')}
                        disabled={isSaving}
                        maxLength={10}
                        className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.phone ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-200 focus:border-blue-500'}`}
                        placeholder="Enter 10-digit phone"
                    />
                    {renderError('phone')}
                </div>
                <div /> {/* Empty for alignment */}
            </div>
        </>
    );
};
