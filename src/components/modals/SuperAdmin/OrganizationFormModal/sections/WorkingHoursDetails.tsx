import { useFormContext, Controller } from 'react-hook-form';
import { WEEK_DAYS } from '@/pages/SuperAdmin/Organizations/OrganizationListPage/constants';
import { DropDown, TimePicker12Hour } from '@/components/ui';
import { AlertCircle, Clock } from 'lucide-react';

export const WorkingHoursDetails: React.FC = () => {
    const { register, control, formState: { errors } } = useFormContext();

    const renderError = (name: string) => {
        const errorMsg = errors[name]?.message as string;
        if (!errorMsg) return null;
        return <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errorMsg}</p>;
    };

    return (
        <>
            <div className="md:col-span-2 pb-2 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" /> Working Hours
                </h3>
            </div>

            {/* Row 1: Check-In & Check-Out Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Check-In Time <span className="text-red-500">*</span>
                    </label>
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
                    {renderError('checkInTime')}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Check-Out Time <span className="text-red-500">*</span>
                    </label>
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
                    {renderError('checkOutTime')}
                </div>
            </div>

            {/* Row 2: Half Day Check-Out & Weekly Off */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Half Day Check-Out Time <span className="text-red-500">*</span>
                    </label>
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
                    {renderError('halfDayCheckOutTime')}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Weekly Off Day <span className="text-red-500">*</span>
                    </label>
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

            {/* Feature Settings */}
            <div className="md:col-span-2 pt-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
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
