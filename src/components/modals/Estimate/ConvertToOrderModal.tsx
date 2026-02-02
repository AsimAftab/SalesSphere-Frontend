import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../../ui/Button/Button';
import DatePicker from '../../ui/DatePicker/DatePicker';

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
    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl z-10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Confirm Conversion</h3>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Convert <span className="font-semibold">{estimateNumber}</span> into an order
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={onConfirm} className="flex flex-col">
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Expected Delivery Date <span className="text-red-500">*</span>
                                    </label>
                                    <DatePicker
                                        value={deliveryDate}
                                        onChange={setDeliveryDate}
                                        placeholder="Select delivery date"
                                        popoverStrategy="relative"
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl">
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
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ConvertToOrderModal;
