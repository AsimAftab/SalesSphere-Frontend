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
    const footer = (
        <div className="flex justify-end gap-3 w-full">
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
                form="convert-to-order-form"
                variant="secondary"
                disabled={isConverting}
            >
                {isConverting ? "Converting..." : "Confirm & Convert"}
            </Button>
        </div>
    );

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title="Confirm Conversion"
            description={<>Convert <span className="font-semibold">{estimateNumber}</span> into an order</>}
            size="md"
            footer={footer}
        >
            <form id="convert-to-order-form" onSubmit={onConfirm} className="flex flex-col">
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
            </form>
        </FormModal>
    );
};

export default ConvertToOrderModal;
