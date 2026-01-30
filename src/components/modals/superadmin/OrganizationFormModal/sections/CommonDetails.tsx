import { useFormContext } from 'react-hook-form';
import { UserIcon } from '@heroicons/react/24/outline';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export const CommonDetails = () => {
    const { register, formState: { errors } } = useFormContext();

    const renderError = (name: string) => {
        const errorMsg = errors[name]?.message as string;
        if (!errorMsg) return null;
        return <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><ExclamationCircleIcon className="w-3 h-3" /> {errorMsg}</p>;
    };

    return (
        <>
            <div className="md:col-span-2 pb-2 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-blue-600" /> General Details
                </h3>
            </div>

            <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Organization Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
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
                    Owner Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        type="text"
                        {...register('ownerName')}
                        className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.ownerName ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-200 focus:border-blue-500'}`}
                        placeholder="Enter owner name"
                    />
                </div>
                {renderError('ownerName')}
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    PAN/VAT Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        type="text"
                        maxLength={15}
                        {...register('panVat')}
                        className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.panVat ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-200 focus:border-blue-500'}`}
                        placeholder="Enter PAN/VAT number"
                    />
                </div>
                {renderError('panVat')}
            </div>
        </>
    );
};
