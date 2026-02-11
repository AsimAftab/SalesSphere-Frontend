import { Calendar, Clock } from 'lucide-react';
import type { ExtendSubscriptionModalProps } from './types';
import { useExtendSubscription } from './hooks/useExtendSubscription';
import { DURATION_OPTIONS } from './constants';
import { Button, FormModal } from '@/components/ui';

export function ExtendSubscriptionModal({
    isOpen,
    onClose,
    organizationId,
    organizationName,
    currentExpiry,
    onSuccess,
}: ExtendSubscriptionModalProps) {
    const {
        formData,
        errors,
        isSubmitting,
        handleDurationChange,
        handleSubmit,
        handleClose,
    } = useExtendSubscription({
        isOpen,
        organizationId,
        onClose,
        onSuccess,
    });

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Extend Subscription"
            description={organizationName}
            size="md"
            icon={<Calendar className="w-5 h-5 text-secondary" />}
        >
            <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
                <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6">
                    {/* Current Expiry Info */}
                    {currentExpiry && (
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Clock className="w-5 h-5 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Current Expiry Date</p>
                                    <p className="text-sm font-semibold text-gray-900">{formatDate(currentExpiry)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Duration Selection */}
                    <div>
                        <span className="block text-sm font-semibold text-gray-700 mb-3">
                            Select Extension Duration <span className="text-red-500">*</span>
                        </span>
                        <div className="space-y-3">
                            {DURATION_OPTIONS.map((option) => (
                                <label
                                    key={option.value}
                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                        formData.duration === option.value
                                            ? 'border-secondary bg-secondary/5'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="duration"
                                        value={option.value}
                                        checked={formData.duration === option.value}
                                        onChange={(e) => handleDurationChange(e.target.value)}
                                        className="w-4 h-4 text-secondary focus:ring-secondary"
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">{option.label}</p>
                                        <p className="text-sm text-gray-500">{option.description}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                        {errors.duration && (
                            <p className="text-red-500 text-xs mt-2">{errors.duration}</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="secondary"
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                    >
                        {isSubmitting ? 'Extending...' : 'Extend Subscription'}
                    </Button>
                </div>
            </form>
        </FormModal>
    );
}

export default ExtendSubscriptionModal;
