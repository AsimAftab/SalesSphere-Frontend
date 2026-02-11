import React from 'react';
import { Button, DatePicker, FormModal } from '@/components/ui';

interface ConvertToOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (e?: React.FormEvent) => void;
    estimateNumber?: string;
    deliveryDate: Date | null;
    setDeliveryDate: (date: Date | null) => void;
    isConverting: boolean;
}

const ConvertToOrderModal: React.FC<ConvertToOrderModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    estimateNumber,
    deliveryDate,
    setDeliveryDate,
    isConverting,
}) => {
    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title="Confirm Conversion"
            description={<>Convert <span className="font-semibold">{estimateNumber}</span> into an order</>}
            size="md"
        >
            <form onSubmit={onConfirm} className="flex flex-col">
                <div className="p-6 space-y-6">
                    <div>
                        <span className="block text-sm font-semibold text-gray-700 mb-2">
                            Expected Delivery Date <span className="text-red-500">*</span>
                        </span>
                        <DatePicker
                            value={deliveryDate}
                            onChange={setDeliveryDate}
                            placeholder="Select delivery date"
                            popoverStrategy="relative"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isConverting}
                        className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="secondary"
                        disabled={isConverting}
                    >
                        {isConverting ? "Converting..." : "Confirm & Convert"}
                    </Button>
                </div>
            </form>
        </FormModal>
    );
};

export default ConvertToOrderModal;
