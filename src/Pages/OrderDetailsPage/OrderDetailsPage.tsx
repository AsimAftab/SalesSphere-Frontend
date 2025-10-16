// import React, { useRef } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import ExportActions from '../../components/UI/ExportActions';
// import Invoice from './Invoice';
// import { ArrowLeftIcon } from '@heroicons/react/24/outline';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

// const OrderDetailsPage: React.FC = () => {
//     const { orderId } = useParams<{ orderId: string }>(); 
//     const invoiceRef = useRef<HTMLDivElement>(null);

//     const handleExportPdf = () => {
//         const input = invoiceRef.current;
//         if (!input) {
//             return;
//         }

//         // --- THIS IS THE NEW FIX ---
//         // Store original inline styles
//         const originalWidth = input.style.width;
//         const originalMaxWidth = input.style.maxWidth;

//         // Force the element to its full desktop width (max-w-4xl = 80rem = 1280px)
//         // This overrides any mobile-constrained 'w-full' from Tailwind
//         input.style.width = '1280px';
//         input.style.maxWidth = '1280px';
//         // --- END OF NEW FIX ---

//         // We MUST use a setTimeout. This gives the browser a "tick" 
//         // to re-paint the element at its new, full width before we capture it.
//         setTimeout(() => {
//             html2canvas(input, {
//                 scale: 2, // Use a higher scale for better resolution
//                 // We still tell html2canvas the explicit dimensions
//                 width: input.scrollWidth,
//                 height: input.scrollHeight,
//                 // These help with rendering and potential cross-origin issues
//                 useCORS: true, 
//                 windowWidth: input.scrollWidth,
//                 windowHeight: input.scrollHeight
//             })
//             .then((canvas) => {
//                 const imgData = canvas.toDataURL('image/png');
                
//                 // Use a landscape ('l') PDF to fit the wide invoice
//                 const pdf = new jsPDF('l', 'mm', 'a4'); 
//                 const pdfWidth = pdf.internal.pageSize.getWidth();
//                 const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//                 pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//                 pdf.save(`invoice-${orderId}.pdf`);

//                 // --- RESTORE ORIGINAL STYLES ---
//                 input.style.width = originalWidth;
//                 input.style.maxWidth = originalMaxWidth;
//                 // --- END OF RESTORE ---
//             })
//             .catch((err) => {
//                 console.error("PDF generation failed:", err);
//                 // Also restore styles if there's an error
//                 input.style.width = originalWidth;
//                 input.style.maxWidth = originalMaxWidth;
//             });
//         }, 0); // A 0ms timeout is enough to push this to the next event loop
//     };

//     return (
//         <div className="bg-gray-100 min-h-screen p-4 sm:p-8 flex flex-col items-center">
//             {/* Action Bar */}
//             <div className="w-full max-w-4xl mb-6 flex justify-between items-center">
//                 <Link to="/order-lists" className="flex items-center text-sm font-semibold text-gray-600 hover:text-black transition-colors">
//                     <ArrowLeftIcon className="h-4 w-4 mr-2" />
//                     Back to Order List
//                 </Link>
//                 <ExportActions 
//                     onExportPdf={handleExportPdf}
//                 />
//             </div>

//             {/* Invoice Component */}
//             <Invoice ref={invoiceRef} orderId={orderId} />
//         </div>
//     );
// };

// export default OrderDetailsPage;


import React, { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { createRoot } from 'react-dom/client'; // <-- ADD THIS IMPORT
import ExportActions from '../../components/UI/ExportActions';
import Invoice from './Invoice';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- DATA & TYPE DEFINITIONS ---
export interface InvoiceData {
  from: { name: string; address: string; phone: string; email: string; taxId: string; };
  to: { name: string; contact: string; address: string; phone: string; email: string; };
  items: { desc: string; detail: string; qty: number; rate: number; }[];
  issueDate: string;
}

const fullInvoiceData: InvoiceData = {
    from: {
        name: 'Digital Solutions Inc.',
        address: '123 Business Avenue, New York, NY 10001, United States',
        phone: '+1 (555) 123-4567',
        email: 'billing@digitalsolutions.com',
        taxId: '12345678',
    },
    to: {
        name: 'Acme Corporation',
        contact: 'John Smith',
        address: '456 Market Street, Suite 200, San Francisco, CA 94102, United States',
        phone: '+1 (555) 987-6543',
        email: 'accounts@acmecorp.com',
    },
    items: [ // This is the full list
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
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 }, // 10th item
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 11', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 12', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 13', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 }, // 10th item
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 11', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 12', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 13', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 }, // 10th item
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 11', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 12', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 13', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 }, // 10th item
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 11', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 12', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 13', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 }, // 10th item
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 11', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 12', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 13', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 }, // 10th item
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 11', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 12', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 13', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 }, // 10th item
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 11', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 12', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 13', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'Technical support and website updates', qty: 6, rate: 350.00 }, // 10th item
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 11', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 12', qty: 6, rate: 350.00 },
        { desc: 'Monthly Support & Maintenance', detail: 'This is item 13', qty: 6, rate: 350.00 },
    ],
    issueDate: 'October 16, 2025',
};
// --- END OF DATA ---


const OrderDetailsPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>(); 
    // This ref is now only for the on-screen display
    const invoiceRef = useRef<HTMLDivElement>(null); 
    const [isPrinting, setIsPrinting] = useState(false);

    // This function chunks an array into smaller arrays
    const chunk = <T,>(arr: T[], size: number): T[][] =>
        Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        );

    const handleExportPdf = async () => {
        setIsPrinting(true);

        // 1. Chunk the items into pages of 10
        const itemPages = chunk(fullInvoiceData.items, 15);
        const totalPages = itemPages.length;

        // 2. Create the PDF instance
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();

        // 3. Create a temporary, hidden container to render each page
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px'; // Move it off-screen
        container.style.width = '1280px'; // Force desktop width for capture
        document.body.appendChild(container);

        const root = createRoot(container); // Create a React root for this container

        try {
            // 4. Loop through each page of items
            for (let i = 0; i < totalPages; i++) {
                const pageItems = itemPages[i];
                const isLastPage = i === totalPages - 1;

                // 5. Create the data for this specific page
                const pageData: InvoiceData = {
                    ...fullInvoiceData,
                    items: pageItems,
                };

                // 6. Render this page's invoice into the hidden div
                await new Promise<void>((resolve) => {
                    root.render(
                        <Invoice 
                            data={pageData} 
                            orderId={orderId} 
                            showTotal={isLastPage} // Only show total on the last page
                        />
                    );
                    setTimeout(resolve, 250); // Give it time to render
                });

                // 7. Capture the hidden div
                const canvas = await html2canvas(container, {
                    scale: 2,
                    useCORS: true,
                    width: container.scrollWidth,
                    height: container.scrollHeight,
                });

                const imgData = canvas.toDataURL('image/png');
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                
                // 8. Add new page to PDF (if not the first page)
                if (i > 0) pdf.addPage();
                
                // 9. Add the image to the PDF
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            }

            // 10. Save the PDF
            pdf.save(`invoice-${orderId}.pdf`);

        } catch (err) {
            console.error("PDF generation failed:", err);
        } finally {
            // 11. Cleanup
            root.unmount();
            document.body.removeChild(container);
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
            
            {/* Add a loading indicator while printing */}
            {isPrinting && (
                <div className="w-full max-w-4xl p-4 mb-4 text-center bg-blue-100 text-blue-800 rounded-lg">
                    Generating PDF... Please wait.
                </div>
            )}

            {/* This is the on-screen invoice, which always shows the full data and total */}
            <Invoice 
                ref={invoiceRef} 
                orderId={orderId} 
                data={fullInvoiceData} 
                showTotal={true} 
            />
        </div>
    );
};

export default OrderDetailsPage;