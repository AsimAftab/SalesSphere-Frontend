import { useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { BanknotesIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { SUBSCRIPTION_DURATIONS, WEEK_DAYS, TIMEZONES, COUNTRIES, COUNTRY_TIMEZONE_MAP } from '../../../../../Pages/SuperAdmin/organizations/OrganizationListPage/constants';
import DropDown from '../../../../../components/UI/DropDown/DropDown';
import TimePicker12Hour from '../../../../../components/UI/TimePicker12Hour/TimePicker12Hour';
import { useSubscriptionPlans } from '../hooks/useSubscriptionPlans';

export const SubscriptionDetails = () => {
    const { register, control, setValue, watch, formState: { errors } } = useFormContext();

    // Use the custom hook for data fetching
    const { planOptions, loading } = useSubscriptionPlans();

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

    // Watch values to derive the single dropdown value
    const subscriptionType = watch('subscriptionType');
    const customPlanId = watch('customPlanId');

    const currentPlanValue = subscriptionType
        ? `STD:${subscriptionType}`
        : (customPlanId ? `CUST:${customPlanId}` : '');

    const handlePlanChange = (value: string) => {
        if (!value) {
            setValue('subscriptionType', '');
            setValue('customPlanId', '');
            return;
        }

        // Split only on the first colon to handle plan names containing colons
        const separatorIndex = value.indexOf(':');
        if (separatorIndex === -1) return;

        const type = value.substring(0, separatorIndex);
        const actualValue = value.substring(separatorIndex + 1);

        if (type === 'STD') {
            setValue('subscriptionType', actualValue);
            setValue('customPlanId', '');
        } else if (type === 'CUST') {
            setValue('customPlanId', actualValue);
            setValue('subscriptionType', '');
        }
    };

    const renderError = (name: string) => {
        const errorMsg = errors[name]?.message as string;
        if (!errorMsg) return null;
        return <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><ExclamationCircleIcon className="w-3 h-3" /> {errorMsg}</p>;
    };

    return (
        <>
            <div className="md:col-span-2 pb-2 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <BanknotesIcon className="w-5 h-5 text-blue-600" /> Subscription & Working Hours
                </h3>
            </div>

            {/* Row 1: Country & Timezone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">Country <span className="text-red-500">*</span></label>
                    <div className="relative">
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

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">Timezone <span className="text-red-500">*</span></label>
                    <div className="relative">
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
                </div>
            </div>

            {/* Row 2: Duration & Plan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">Subscription Duration <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Controller
                            name="subscriptionDuration"
                            control={control}
                            render={({ field }) => (
                                <DropDown
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={SUBSCRIPTION_DURATIONS}
                                    placeholder="Select Duration"
                                    error={errors.subscriptionDuration?.message as string}
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">Subscription Plan <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <DropDown
                            value={currentPlanValue}
                            onChange={handlePlanChange}
                            options={planOptions}
                            placeholder={loading ? "Loading Plans..." : "Select Subscription Plan"}
                            error={(errors.subscriptionType?.message || errors.customPlanId?.message) as string}
                            isSearchable={true}
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>

            {/* Row 2: Check-In & Check-Out Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">Check-In Time <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Controller
                            name="checkInTime"
                            control={control}
                            render={({ field }) => (
                                <TimePicker12Hour
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={!!errors.checkInTime}
                                />
                            )}
                        />
                    </div>
                    {renderError('checkInTime')}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">Check-Out Time <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Controller
                            name="checkOutTime"
                            control={control}
                            render={({ field }) => (
                                <TimePicker12Hour
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={!!errors.checkOutTime}
                                />
                            )}
                        />
                    </div>
                    {renderError('checkOutTime')}
                </div>
            </div>

            {/* Row 3: Half Day Check-Out & Weekly Off Day */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">Half Day Check-Out Time <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Controller
                            name="halfDayCheckOutTime"
                            control={control}
                            render={({ field }) => (
                                <TimePicker12Hour
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={!!errors.halfDayCheckOutTime}
                                />
                            )}
                        />
                    </div>
                    {renderError('halfDayCheckOutTime')}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">Weekly Off Day <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Controller
                            name="weeklyOff"
                            control={control}
                            render={({ field }) => (
                                <DropDown
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={WEEK_DAYS}
                                    placeholder="Select Day"
                                    error={errors.weeklyOff?.message as string}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>



            {/* Row 5: Feature Settings */}
            <div className="md:col-span-2 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 tracking-wide mb-3 flex items-center gap-2">
                    Feature Settings
                </h4>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-300">
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">Geo-Fencing Attendance</span>
                        <span className="text-xs text-gray-500 mt-0.5">Allow employees to mark attendance only within office premises</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            {...register('geoFencing')}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all duration-300 ease-in-out peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>
        </>
    );
};
