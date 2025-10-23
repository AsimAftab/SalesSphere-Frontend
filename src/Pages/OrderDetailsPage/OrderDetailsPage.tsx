import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import Invoice from './Invoice';
import InvoicePDF from './InvoicePDF';
import ExportActions from '../../components/UI/ExportActions';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getOrderById, type InvoiceData } from '../../api/orderService'; // Import from service

const OrderDetailsPage: React.FC = () => {
    const { orderId = "00001" } = useParams<{ orderId: string }>(); 
    const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPrinting, setIsPrinting] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const data = await getOrderById(orderId);
                if (data) {
                    setInvoiceData(data);
                } else {
                    setError(`No details found for order ID: ${orderId}`);
                }
            } catch (err) {
                setError('Failed to load order details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    const handleExportPdf = async () => {
        if (!invoiceData) return;
        setIsPrinting(true);
        try {
            const doc = <InvoicePDF data={invoiceData} orderId={orderId} />;
            const pdfPromise = pdf(doc).toBlob();
            const timerPromise = new Promise(resolve => setTimeout(resolve, 1000));
            const [blob] = await Promise.all([pdfPromise, timerPromise]);
            saveAs(blob, `invoice-${orderId}.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF", error);
        } finally {
            setIsPrinting(false);
        }
    }
   

    const handleGoBack = () => {
        navigate(-1);
    
    };
    
    return (
        <div className="bg-gray-100 min-h-screen px-4 sm:px-8 pb-8 flex flex-col items-center">
            <div className="sticky top-0 z-10 w-full max-w-4xl py-2 bg-gray-100 mb-4 flex justify-between items-center border-b border-gray-200">
                <button 
                    onClick={handleGoBack} 
                    className="flex items-center text-sm font-semibold text-gray-600 hover:text-black transition-colors"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back 
                </button>
                <ExportActions onExportPdf={handleExportPdf} />
            </div>
            
            {loading && <div className="text-center p-10 text-gray-500">Loading Order Details...</div>}
            {error && <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>}
            {isPrinting && (
                <div className="w-full max-w-4xl p-4 mb-4 text-center bg-blue-100 text-blue-800 rounded-lg">
                    Generating PDF... Please wait.
                </div>
            )}
            
            {invoiceData && (
                <Invoice 
                    orderId={orderId} 
                    data={invoiceData} 
                    showTotal={true} 
                    isFirstPage={true} 
                />
            )}
        </div>
    );
};

export default OrderDetailsPage;
