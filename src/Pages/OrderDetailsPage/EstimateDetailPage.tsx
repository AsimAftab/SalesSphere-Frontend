import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { getEstimateById, convertEstimateToOrder } from '../../api/estimateService';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import EstimatePreview from './EstimatePreview';
import toast from 'react-hot-toast';
import Button from '../../components/UI/Button/Button';
import DatePicker from "../../components/UI/DatePicker/DatePicker";

const EstimateDetailsPage: React.FC = () => {
    const { estimateId } = useParams<{ estimateId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const [showConvertModal, setShowConvertModal] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
    const [isPrinting, setIsPrinting] = useState(false);

    const { data: estimateData, isLoading, error } = useQuery({
        queryKey: ['estimates', estimateId],
        queryFn: () => getEstimateById(estimateId!),
        enabled: !!estimateId,
    });

    const convertMutation = useMutation({
        mutationFn: ({ id, date }: { id: string, date: string }) => convertEstimateToOrder(id, date),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['estimates'] }); 
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success("Converted to Order successfully!");
            setShowConvertModal(false);
            navigate('/order-lists?tab=orders');
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to convert estimate");
        }
    });

    const handleConfirmConversion = (e: React.FormEvent) => {
        e.preventDefault();
        if (!deliveryDate) {
            toast.error("Please select an expected delivery date");
            return;
        }
        const dateString = deliveryDate.toISOString().split('T')[0];
        convertMutation.mutate({ id: estimateId!, date: dateString });
    };

    const handleExportPdf = async () => {
        if (!estimateData) return;
        setIsPrinting(true);
        try {
            const { pdf } = await import('@react-pdf/renderer');
            const EstimatePDF = (await import('./EstimatePDF')).default;
            const doc = <EstimatePDF data={estimateData} />;
            const blob = await pdf(doc).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank'; 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 100); 
        } catch (err) {
            console.error("PDF Export failed", err);
        } finally {
            setIsPrinting(false);
        }
    };

    const handleGoBack = () => {
        navigate('/order-lists?tab=estimates'); 
    };

    return (
        <Sidebar>
            <div className="p-0 md:p-6 relative h-fit"> {/* Changed from min-h-screen to h-fit to fix scroll issue */}
                <div className="flex justify-between items-center mb-4 p-4 md:p-0">
                    <button 
                        onClick={handleGoBack} 
                        className="flex items-center text-sm font-semibold text-gray-600 hover:text-black transition-colors"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Back to Estimates
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                ) : error ? (
                    <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">Error loading data</div>
                ) : (
                    <EstimatePreview 
                        data={estimateData} 
                        onExportPdf={handleExportPdf}
                        onConvertToOrder={() => setShowConvertModal(true)}
                        isConverting={convertMutation.isPending}
                        isPrinting={isPrinting}
                    />
                )}

                {/* --- CONVERSION MODAL --- */}
                {showConvertModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        {/* REMOVED overflow-hidden to allow Calendar to pop out */}
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900">Confirm Conversion</h3>
                                <button onClick={() => setShowConvertModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleConfirmConversion} className="p-6">
                                <p className="text-gray-600 mb-4 text-sm">
                                    Convert <span className="font-bold">{estimateData?.estimateNumber}</span> into an order.
                                </p>

                                <div className="space-y-2 mb-32"> {/* Added large bottom margin to container for calendar space */}
                                    <label className="block text-sm font-bold text-gray-700">
                                        Expected Delivery Date
                                    </label>
                                    {/* Removed label and required props to fix TS errors */}
                                    <DatePicker 
                                        value={deliveryDate} 
                                        onChange={(date: Date | null) => setDeliveryDate(date)}
                                        placeholder="Select delivery date"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <Button type="button" variant="secondary" onClick={() => setShowConvertModal(false)} className="flex-1 !py-3">
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={convertMutation.isPending}
                                        className="flex-1 !py-3 bg-green-600 hover:bg-green-700 border-none"
                                    >
                                        {convertMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Confirm & Convert"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Sidebar>
    );
};

export default EstimateDetailsPage;