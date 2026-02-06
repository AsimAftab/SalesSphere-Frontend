import { useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { SUBSCRIPTION_DURATIONS } from '@/pages/SuperAdmin/Organizations/OrganizationListPage/constants';
import { useSubscriptionPlans } from '../hooks/useSubscriptionPlans';
import { DropDown } from '@/components/ui';
import { AlertCircle, CreditCard } from 'lucide-react';

interface SubscriptionPlanDetailsProps {
    isEditMode?: boolean;
}

export const SubscriptionPlanDetails: React.FC<SubscriptionPlanDetailsProps> = ({ isEditMode = false }) => {
    const { control, setValue, watch, formState: { errors } } = useFormContext();

    const { standardPlanOptions, customPlanOptions, loading, getPlanMaxEmployees } = useSubscriptionPlans();

    const subscriptionType = watch('subscriptionType');
    const customPlanId = watch('customPlanId');
    const maxEmployeesOverride = watch('maxEmployeesOverride');

    // Get the current plan's max employees
    const currentPlanId = subscriptionType || customPlanId;
    const planMaxEmployees = useMemo(() => {
        if (!currentPlanId) return null;
        return getPlanMaxEmployees(currentPlanId);
    }, [currentPlanId, getPlanMaxEmployees]);

    const handleStandardPlanChange = (value: string) => {
        setValue('subscriptionType', value);
        if (value) {
            setValue('customPlanId', '');
        }
    };

    const handleCustomPlanChange = (value: string) => {
        setValue('customPlanId', value);
        if (value) {
            setValue('subscriptionType', '');
        }
    };

    const noPlanSelected = !subscriptionType && !customPlanId;

    return (
        <>
            <div className="md:col-span-2 pb-2 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" /> Subscription Plan
                </h3>
            </div>

            {/* Row 1: Subscription Duration (Half Width) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Subscription Duration {!isEditMode && <span className="text-red-500">*</span>}
                    </label>
                    <Controller
                        name="subscriptionDuration"
                        control={control}
                        render={({ field }) => (
                            <DropDown
                                value={field.value}
                                onChange={field.onChange}
                                options={SUBSCRIPTION_DURATIONS}
                                placeholder="Select Duration"
                                error={!isEditMode ? errors.subscriptionDuration?.message as string : undefined}
                                disabled={isEditMode}
                            />
                        )}
                    />
                </div>
                <div /> {/* Empty for alignment */}
            </div>

            {/* Row 2: Standard Plan & Custom Plan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Standard Plan {noPlanSelected && <span className="text-red-500">*</span>}
                    </label>
                    <DropDown
                        value={subscriptionType || ''}
                        onChange={handleStandardPlanChange}
                        options={standardPlanOptions}
                        placeholder={loading ? "Loading Plans..." : "Select Standard Plan"}
                        error={noPlanSelected ? (errors.subscriptionType?.message as string) : undefined}
                        isSearchable={false}
                        disabled={loading || (!isEditMode && !!customPlanId)}
                    />
                    {!isEditMode && customPlanId && (
                        <span className="text-xs text-gray-500 mt-1">Disabled when custom plan is selected</span>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Custom Plan {noPlanSelected && <span className="text-red-500">*</span>}
                    </label>
                    <DropDown
                        value={customPlanId || ''}
                        onChange={handleCustomPlanChange}
                        options={customPlanOptions}
                        placeholder={loading ? "Loading Plans..." : (customPlanOptions.length === 0 ? "No custom plans available" : "Select Custom Plan")}
                        error={noPlanSelected ? (errors.customPlanId?.message as string) : undefined}
                        isSearchable={false}
                        disabled={loading || (!isEditMode && !!subscriptionType) || customPlanOptions.length === 0}
                    />
                    {!isEditMode && subscriptionType && (
                        <span className="text-xs text-gray-500 mt-1">Disabled when standard plan is selected</span>
                    )}
                </div>
            </div>

            {/* Validation message */}
            {noPlanSelected && (errors.subscriptionType || errors.customPlanId) && (
                <div className="md:col-span-2">
                    <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Please select either a Standard Plan or a Custom Plan
                    </p>
                </div>
            )}

            {/* Row 3: Max Employees (Only in Edit Mode) */}
            {isEditMode && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Plan Max Employees
                        </label>
                        <input
                            type="text"
                            value={planMaxEmployees !== null ? planMaxEmployees : 'N/A'}
                            readOnly
                            disabled
                            className="w-full px-4 py-2.5 border rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
                        />
                        <p className="text-xs text-gray-500 mt-1">Default limit from subscription plan</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Override Max Employees
                        </label>
                        <Controller
                            name="maxEmployeesOverride"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    placeholder={`Leave empty to use plan default (${planMaxEmployees || 'N/A'})`}
                                    value={field.value ?? ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        // Only allow numeric input
                                        if (val === '' || /^\d+$/.test(val)) {
                                            field.onChange(val === '' ? null : parseInt(val, 10));
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        // Allow: backspace, delete, tab, escape, enter, arrows
                                        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
                                        if (allowedKeys.includes(e.key)) return;
                                        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                                        if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) return;
                                        // Block non-numeric keys
                                        if (!/^\d$/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all border-gray-200 focus:border-blue-500"
                                />
                            )}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {maxEmployeesOverride
                                ? `Custom limit: ${maxEmployeesOverride} employees`
                                : 'Leave empty to use plan default'}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};
