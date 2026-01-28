import React from 'react';
import { Loader2 } from 'lucide-react';
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../../../components/UI/Button/Button';
import DatePicker from "../../../components/UI/DatePicker/DatePicker";
import EstimatePreview from './components/EstimatePreview';
import { type Estimate } from '../../../api/estimateService';
import EstimateDetailsSkeleton from './components/EstimateDetailsSkeleton';

interface EstimateDetailsContentProps {
    state: {
        estimateData: Estimate | undefined;
        isLoading: boolean;
        error: Error | null;
        isPrinting: boolean;
        showConvertModal: boolean;
        deliveryDate: Date | null;
        isConverting: boolean;
        permissions: {
            canConvertToOrder: boolean;
            canExportPdf: boolean;
        };
    };
    actions: {
        onExportPdf: () => void;
        onGoBack: () => void;
        onOpenConvertModal: () => void;
        onCloseConvertModal: () => void;
        onConfirmConversion: (e?: React.FormEvent) => void;
        setDeliveryDate: (date: Date | null) => void;
    };
}

const EstimateDetailsContent: React.FC<EstimateDetailsContentProps> = ({ state, actions }) => {
    const {
        estimateData, isLoading, error, isPrinting,
        showConvertModal, deliveryDate, isConverting,
        permissions
    } = state;

    const {
        onExportPdf, onGoBack, onOpenConvertModal,
        onCloseConvertModal, onConfirmConversion, setDeliveryDate
    } = actions;

    return (
        <div className="p-0 md:p-6 relative h-fit">
            <div className="flex justify-between items-center mb-4 p-4 md:p-0">
                <div className="flex items-center gap-2">
                    <button
                        onClick={onGoBack}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                        onClick={onGoBack}
                        className="text-sm font-semibold text-gray-600"
                    >
                        Back to Estimates
                    </button>
                </div>
            </div>

            {isLoading ? (
                <EstimateDetailsSkeleton />
            ) : error ? (
                <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">Error loading data</div>
            ) : (
                <EstimatePreview
                    data={estimateData}
                    onExportPdf={onExportPdf}
                    onConvertToOrder={onOpenConvertModal}
                    isConverting={isConverting}
                    isPrinting={isPrinting}
                    permissions={permissions}
                />
            )}

            {/* --- CONVERSION MODAL --- */}
            {showConvertModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">Confirm Conversion</h3>
                            <button onClick={onCloseConvertModal} className="p-1 text-gray-400 hover:text-gray-600">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={onConfirmConversion} className="p-6">
                            <p className="text-gray-600 mb-4 text-sm">
                                Convert <span className="font-bold">{estimateData?.estimateNumber}</span> into an order.
                            </p>

                            <div className="space-y-2 mb-32">
                                <label className="block text-sm font-bold text-gray-700">
                                    Expected Delivery Date
                                </label>
                                <DatePicker
                                    value={deliveryDate}
                                    onChange={setDeliveryDate}
                                    placeholder="Select delivery date"
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button type="button" variant="secondary" onClick={onCloseConvertModal} className="flex-1 !py-3">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isConverting}
                                    className="flex-1 !py-3 bg-green-600 hover:bg-green-700 border-none"
                                >
                                    {isConverting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Confirm & Convert"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EstimateDetailsContent;
