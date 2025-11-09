import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; // 1. IMPORT useQuery
import { pdf } from '@react-pdf/renderer';
import InvoicePreview from './InvoicePreview';
import InvoiceDetailPDF from './InvoiceDetailPDF';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getOrderById, type InvoiceData } from '../../api/orderService';
import { Loader2 } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';

const OrderDetailsPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>(); 
    const navigate = useNavigate();
    
    // This is local UI state, so it stays as useState
    const [isPrinting, setIsPrinting] = useState(false);

    // 2. REMOVED the useState hooks for data, loading, and error
    
    // 3. ADDED the useQuery hook to manage fetching
    const { 
      data: invoiceData, 
      isLoading, 
      error 
    } = useQuery<InvoiceData | null, Error>({
        // Create a unique query key for this specific order
        queryKey: ['orders', orderId], 
        // The query function
        queryFn: () => getOrderById(orderId!), // The '!' is safe because of 'enabled'
        // Only run this query if the orderId exists
        enabled: !!orderId, 
    });

    // 4. REMOVED the entire useEffect hook for fetchOrderDetails

    const handleExportPdf = async () => {
        if (!invoiceData) return;
        setIsPrinting(true);
        try {
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
        navigate(-1);
    };
    
    // 5. MODIFIED renderContent to use isLoading and the new error object
    const renderContent = () => {
        if (isLoading) { // Use isLoading from useQuery
            return (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="ml-2 text-gray-500">Loading Invoice Details...</span>
                </div>
            );
        }
        
        if (error) { // Use the error object from useQuery
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
        
        // This handles the case where orderId is missing or data is null
        if (!orderId) {
             return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">No order ID provided.</div>;
        }

        return null;
    };

    return (
        <Sidebar>
            <div className="p-0 md:p-6">
                <div className="flex justify-between items-center mb-4">
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