import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import Invoice from './Invoice';
import InvoicePDF from './InvoicePDF';
import ExportActions from '../../components/UI/ExportActions';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// --- DATA & TYPE DEFINITIONS ---
export interface InvoiceData {
  from: { name: string; address: string; phone: string; email: string; taxId: string; };
  to: { name: string; contact: string; address: string; phone: string; email: string; };
  items: { desc: string; detail: string; qty: number; rate: number; }[];
  issueDate: string;
}

const fullInvoiceData: InvoiceData = {
    // ... your full invoice data ...
    from: { name: 'Digital Solutions Inc.', address: 'Lahan, Siraha 56502, Province No. 2, Nepal', phone: '+977-9800000000', email: 'billing@digitalsolutions.com', taxId: '12345678', },
    to: { name: 'Acme Corporation', contact: 'John Smith', address: 'Biratnagar, Morang 56613, Koshi Province, Nepal', phone: '+977-9800000000', email: 'accounts@acmecorp.com', },
    items: [
        { desc: 'Premium Website Development', detail: 'Custom responsive website with CMS integration', qty: 1, rate: 5500.00 },
        { desc: 'UI/UX Design Services', detail: 'Complete design system with interface mockups', qty: 1, rate: 2800.00 },
        { desc: 'SEO Optimization Package', detail: '3-month SEO strategy and implementation', qty: 3, rate: 450.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 }, // 10th item
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 11', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 12', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 13', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 }, // 10th item
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 11', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 12', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 13', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 }, // 10th item
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 11', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 12', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 13', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 }, // 10th item
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 11', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 12', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 13', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 }, // 10th item
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 11', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 12', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 13', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 }, // 10th item
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 11', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 12', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 13', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 }, // 10th item
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 11', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 12', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 13', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 }, // 10th item
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 11', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 12', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 13', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 }, // 10th item
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 11', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 12', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 13', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 }, // 10th item
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 11', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 12', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 13', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 }, // 10th item
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 11', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 12', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 13', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 }, // 10th item
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 11', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 12', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 13', qty: 6, rate: 350.00 },
    ],
    issueDate: 'October 16, 2025',
  };
  //END OF DATA 

const OrderDetailsPage: React.FC = () => {
    const { orderId = "00001" } = useParams<{ orderId: string }>(); 
    const [isPrinting, setIsPrinting] = useState(false);

    const handleExportPdf = async () => {
        setIsPrinting(true);
        try {
            // 1. Create the PDF document instance
            const doc = <InvoicePDF data={fullInvoiceData} orderId={orderId} />;
            
            // 2. Start two tasks at the same time:
            //    - Task A: Generate the PDF blob
            //    - Task B: Wait for 1 seconds (1000 milliseconds)
            const pdfPromise = pdf(doc).toBlob();
            const timerPromise = new Promise(resolve => setTimeout(resolve, 1000));
            
            // 3. Wait for BOTH tasks to complete using Promise.all
            const [blob] = await Promise.all([pdfPromise, timerPromise]);
            
            // 4. Trigger the download using file-saver
            saveAs(blob, `invoice-${orderId}.pdf`);

        } catch (error) {
            console.error("Failed to generate PDF", error);
        } finally {
            // 5. Hide the loading indicator ONLY after everything is done
            setIsPrinting(false);
        }
    };
    
    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8 flex flex-col items-center">
            {/* Action Bar */}
            <div className="w-full max-w-4xl mb-6 flex justify-between items-center">
                <Link to="/order-lists" className="flex items-center text-sm font-semibold text-gray-600 hover:text-black transition-colors">
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Order List
                </Link>

                <ExportActions 
                    onExportPdf={handleExportPdf}
                />
            </div>
            
            {/* Loading indicator */}
            {isPrinting && (
                <div className="w-full max-w-4xl p-4 mb-4 text-center bg-blue-100 text-blue-800 rounded-lg">
                    Generating PDF... Please wait.
                </div>
            )}
            
            {/* On-screen invoice */}
            <Invoice 
                orderId={orderId} 
                data={fullInvoiceData} 
                showTotal={true} 
                isFirstPage={true} 
            />
        </div>
    );
};

export default OrderDetailsPage;