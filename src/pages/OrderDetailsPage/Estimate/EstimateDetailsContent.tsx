import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import EstimatePreview from './components/EstimatePreview';
import { type Estimate } from '@/api/estimateService';
import EstimateDetailsSkeleton from './components/EstimateDetailsSkeleton';
import ConvertToOrderModal from '@/components/modals/Estimate/ConvertToOrderModal';

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
        <div className="space-y-6 relative h-fit">
            <div className="flex justify-between items-center">
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
                    data={estimateData!}
                    onExportPdf={onExportPdf}
                    onConvertToOrder={onOpenConvertModal}
                    isConverting={isConverting}
                    isPrinting={isPrinting}
                    permissions={permissions}
                />
            )}

            <ConvertToOrderModal
                isOpen={showConvertModal}
                onClose={onCloseConvertModal}
                onConfirm={onConfirmConversion}
                estimateNumber={estimateData?.estimateNumber}
                deliveryDate={deliveryDate}
                setDeliveryDate={setDeliveryDate}
                isConverting={isConverting}
            />
        </div>
    );
};

export default EstimateDetailsContent;
