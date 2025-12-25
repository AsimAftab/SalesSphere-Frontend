import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
// DELETED: import { pdf } from '@react-pdf/renderer';
import InvoicePreview from './InvoicePreview';
// DELETED: import InvoiceDetailPDF from './InvoiceDetailPDF';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getOrderById, type InvoiceData } from '../../api/orderService';
import { Loader2 } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';

const OrderDetailsPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>(); 
    const navigate = useNavigate();
    
    const [isPrinting, setIsPrinting] = useState(false);

    const { 
      data: invoiceData, 
      isLoading, 
      error 
    } = useQuery<InvoiceData | null, Error>({
        queryKey: ['orders', orderId], 
        queryFn: () => getOrderById(orderId!),
        enabled: !!orderId, 
    });

    // MODIFIED: This function now lazy-loads PDF libraries
    const handleExportPdf = async () => {
        if (!invoiceData) return;
        setIsPrinting(true);
        try {
            // --- LAZY LOADING ---
            const { pdf } = await import('@react-pdf/renderer');
            const InvoiceDetailPDF = (await import('./InvoiceDetailPDF')).default;
            // --- END LAZY LOADING ---

            const doc = <InvoiceDetailPDF invoice={invoiceData} />;
            const blob = await pdf(doc).toBlob();
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setTimeout(() => URL.revokeObjectURL(url), 1000);

        } catch (error) {
            console.error("Failed to generate PDF", error);
        } finally {
            setIsPrinting(false);
        }
    }

    const handleGoBack = () => {
        navigate('/order-lists', { state: { activeTab: 'orders' } });
    };
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="ml-2 text-gray-500">Loading Invoice Details...</span>
                </div>
            );
        }
        
        if (error) {
            return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error.message}</div>;
        }

        if (invoiceData) {
            return (
                <InvoicePreview 
                    data={invoiceData}
                    onExportPdf={handleExportPdf}
                    isPrinting={isPrinting}
                />
            );
        }
        
        if (!orderId) {
             return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">No order ID provided.</div>;
        }

        return null;
    };

    return (
        <Sidebar>
            {/* This div handles the mobile padding fix you asked for earlier */}
            <div className="p-0 md:p-6">
                <div className="flex justify-between items-center mb-4 p-4 md:p-0"> {/* Added padding for mobile */}
                    <button 
                        onClick={handleGoBack} 
                        className="flex items-center text-sm font-semibold text-gray-600 hover:text-black transition-colors"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Back to Order List
                    </button>
                </div>
                {renderContent()}
            </div>
        </Sidebar>
    );
};

export default OrderDetailsPage;