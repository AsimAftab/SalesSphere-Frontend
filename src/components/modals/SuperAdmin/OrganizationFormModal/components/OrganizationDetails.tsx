import { useFormContext, Controller } from 'react-hook-form';
import { AlertCircle, Building2 } from 'lucide-react';
import { COUNTRIES, TIMEZONES, COUNTRY_TIMEZONE_MAP } from '@/pages/SuperAdminPages/Organizations/OrganizationListPage/constants';
import { DropDown } from '@/components/ui';
import { useEffect } from 'react';

interface OrganizationDetailsProps {
    isEditMode?: boolean;
}

export const OrganizationDetails: React.FC<OrganizationDetailsProps> = ({ isEditMode = false }) => {
    const { register, control, setValue, watch, formState: { errors } } = useFormContext();

    // Auto-select timezone when country changes
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'country' && value.country) {
                const mappedTimezone = COUNTRY_TIMEZONE_MAP[value.country];
                if (mappedTimezone) {
                    setValue('timezone', mappedTimezone);
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, setValue]);

    const renderError = (name: string) => {
        const errorMsg = errors[name]?.message as string;
        if (!errorMsg) return null;
        return <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errorMsg}</p>;
    };

    return (
        <>
            <div className="md:col-span-2 pb-2 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" /> Organization Details
                </h3>
            </div>

            {/* Row 1: Organization Name (Full Width) */}
            <div className="md:col-span-2">
                <label htmlFor="org-name-input" className="block text-sm font-semibold text-gray-700 mb-2">
                    Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                    id="org-name-input"
                    type="text"
                    {...register('name')}
                    className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.name ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-200 focus:border-blue-500'}`}
                    placeholder="Enter organization name"
                />
                {renderError('name')}
            </div>

            {/* Row 2: PAN/VAT & Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        PAN/VAT Number {!isEditMode && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        type="text"
                        maxLength={15}
                        {...register('panVat')}
                        readOnly={isEditMode}
                        className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all ${isEditMode ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : errors.panVat ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                        placeholder="Enter PAN/VAT number"
                    />
                    {!isEditMode && renderError('panVat')}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Country <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                            <DropDown
                                value={field.value}
                                onChange={field.onChange}
                                options={COUNTRIES}
                                placeholder="Select Country"
                                error={errors.country?.message as string}
                                isSearchable={true}
                            />
                        )}
                    />
                </div>
            </div>

            {/* Row 3: Timezone (Half Width) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Timezone <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        name="timezone"
                        control={control}
                        render={({ field }) => (
                            <DropDown
                                value={field.value}
                                onChange={field.onChange}
                                options={TIMEZONES}
                                placeholder="Select Timezone"
                                error={errors.timezone?.message as string}
                                isSearchable={true}
                            />
                        )}
                    />
                </div>
                <div /> {/* Empty for alignment */}
            </div>
        </>
    );
};
