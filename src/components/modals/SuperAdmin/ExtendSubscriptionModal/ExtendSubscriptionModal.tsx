import { X, Calendar, Clock } from 'lucide-react';
import type { ExtendSubscriptionModalProps } from './types';
import { useExtendSubscription } from './hooks/useExtendSubscription';
import { DURATION_OPTIONS } from './constants';
import { Button, ErrorBoundary } from '@/components/ui';

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

    if (!isOpen) return null;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
            onClick={handleClose}
            onKeyDown={(e) => e.key === 'Escape' && handleClose()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="extend-subscription-modal-title"
        >
            <div
                className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-hidden z-[10000] shadow-2xl flex flex-col border border-gray-100"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                role="document"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
                    <div>
                        <h2
                            id="extend-subscription-modal-title"
                            className="text-xl font-semibold text-gray-900 flex items-center gap-2"
                        >
                            <Calendar className="w-5 h-5 text-secondary" />
                            Extend Subscription
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {organizationName}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <ErrorBoundary>
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
                </ErrorBoundary>
            </div>
        </div>
    );
}

export default ExtendSubscriptionModal;
