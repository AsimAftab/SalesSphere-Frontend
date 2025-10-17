// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import Sidebar from '../../components/layout/Sidebar/Sidebar';
// import Button from '../../components/UI/Button/Button';
// import ExportActions from '../../components/UI/ExportActions';
// import { MagnifyingGlassIcon} from '@heroicons/react/24/outline';

// // --- IMPORTS FOR EXPORT ---
// import { pdf } from '@react-pdf/renderer';
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
// import OrderListPDF from './OrderListPDF'; // Import the PDF blueprint

// // --- Helper Component for Status Badges ---
// const StatusBadge = ({ status }: { status: string }) => {
//   const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
//   let colorClasses = "";

//   switch (status.toLowerCase()) {
//     case 'completed':
//       colorClasses = "bg-green-600 text-white";
//       break;
//     case 'rejected':
//       colorClasses = "bg-red-600 text-white";
//       break;
//     case 'in transit':
//       colorClasses = "bg-yellow-600 text-white";
//       break;
//     default:
//       colorClasses = "bg-gray-600 text-white";
//   }

//   return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
// };

// // Mock data to populate the order table
// const ordersData = [
//   { id: '00001', partyName: 'Christine Brooks', address: '089 Kutch Green Apt. 448', dateTime: '04 Sep 2019 & 10:00', status: 'Completed' },
//   { id: '00002', partyName: 'Rosie Pearson', address: '979 Immanuel Ferry Suite 526', dateTime: '28 May 2019 & 11:00', status: 'Completed' },
//   { id: '00003', partyName: 'Darrell Caldwell', address: '8587 Frida Ports', dateTime: '23 Nov 2019 & 01:00', status: 'Rejected' },
//   { id: '00004', partyName: 'Gilbert Johnston', address: '768 Destiny Lake Suite 600', dateTime: '05 Feb 2019 & 09:00', status: 'In Transit' },
//   { id: '00005', partyName: 'Alan Cain', address: '042 Mylene Throughway', dateTime: '29 Jul 2019 & 02:00', status: 'Completed' },
//   { id: '00006', partyName: 'Alfred Murray', address: '543 Weimann Mountain', dateTime: '15 Aug 2019 & 03:00', status: 'Completed' },
//   { id: '00007', partyName: 'Maggie Sullivan', address: 'New Scottieberg', dateTime: '21 Dec 2019 & 04:55', status: 'In Transit' },
//   { id: '00008', partyName: 'Rosie Todd', address: 'New Jon', dateTime: '30 Apr 2019 & 05:11', status: 'Completed' },
//   { id: '00009', partyName: 'Dollie Hines', address: '124 Lyla Forge Suite 975', dateTime: '09 Jan 2019 & 04:45', status: 'Rejected' },
//   // Adding more mock data to reach a total of 78 items to simulate pagination
//   ...Array.from({ length: 69 }, (_, i) => ({ id: `000${i + 10}`, partyName: `Customer ${i + 10}`, address: '123 Fake Street', dateTime: '01 Jan 2020 & 12:00', status: ['Completed', 'Rejected', 'In Transit'][i % 3] })),
// ];

// const OrderList: React.FC = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const ITEMS_PER_PAGE = 10;

//   // --- EXPORT LOGIC MOVED INSIDE THE COMPONENT ---
//   const handleExportPdf = async () => {
//     setIsPrinting(true); // Now has access to setIsPrinting
//     const doc = <OrderListPDF orders={ordersData} />; // Accesses ordersData
//     const blob = await pdf(doc).toBlob();
//     saveAs(blob, 'OrderList.pdf');
//     setIsPrinting(false);
//   };

//   const handleExportExcel = () => {
//     const dataToExport = ordersData.map((order, index) => ({ // Accesses ordersData
//       'S.No.': index + 1,
//       'ID': order.id,
//       'Party Name': order.partyName,
//       'Address': order.address,
//       'Date & Time': order.dateTime,
//       'Status': order.status,
//     }));
    
//     const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
//     XLSX.writeFile(workbook, "OrderList.xlsx");
//   };
//   // --- END OF MOVED LOGIC ---

//   const totalPages = Math.ceil(ordersData.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const endIndex = startIndex + ITEMS_PER_PAGE;
//   const currentOrders = ordersData.slice(startIndex, endIndex);

//   const goToPage = (pageNumber: number) => {
//     const newPage = Math.max(1, Math.min(pageNumber, totalPages));
//     setCurrentPage(newPage);
//   };
  
//   return (
//           <Sidebar>
//             <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//               <h1 className="text-3xl font-bold text-black">Order List</h1>
//               <div className="flex items-center gap-x-4 w-full sm:w-auto">
//                 {/* Search Input */}
//                 <div className="relative flex-1 sm:flex-none">
//                   <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 text-gray-400 -translate-y-1/2" />
//                   <input
//                     type="text"
//                     placeholder="Search product name"
//                     className="w-full rounded-lg border-white bg-white py-2 pl-10 pr-4 text-sm text-white focus:border-secondary focus:ring-secondary"
//                   />
//                 </div>
//                 <ExportActions 
//                   onExportPdf={handleExportPdf}
//                   onExportExcel={handleExportExcel}
//                 />
//               </div>
//             </div>

//             {/* Orders Table - Aligned and Height-Corrected */}
//             <div className="bg-primary rounded-lg shadow-sm overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-secondary text-white text-left text-sm">
//                   <tr>
//                     {/* S.NO. is the first column, it gets the rounded-tl-lg */}
//                     <th className="p-4 font-semibold rounded-tl-lg">S.NO.</th>
//                     {/* ID is the second column, it should NOT have rounded-tl-lg */}
//                     <th className="p-4 font-semibold">ID</th> 
//                     <th className="p-4 font-semibold">Party Name</th>
//                     <th className="p-4 font-semibold">Address</th>
//                     <th className="p-4 font-semibold">Date & Time</th>
//                     <th className="p-4 font-semibold">Details</th>
//                     <th className="p-4 font-semibold rounded-tr-lg">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200 text-sm">
//                   {currentOrders.map((order, index) => (
//                     <tr key={order.id} className="hover:shadow-lg hover:scale-[1.02] hover:bg-primary transition-all duration-200 cursor-pointer">
//                       {/* S.NO. Column */}
//                       <td className="p-4 whitespace-nowrap text-white">{startIndex + index + 1}</td> 
                      
//                       {/* ID Column */}
//                       <td className="py-4 whitespace-nowrap text-white">
//                         <div className="flex items-center px-4">
//                           <div className="h-10 w-0"></div>
//                           <span>{order.id}</span>
//                         </div>
//                       </td>
                      
//                       {/* Rest of the columns */}
//                       <td className="p-4 whitespace-nowrap text-white">{order.partyName}</td>
//                       <td className="p-4 whitespace-nowrap text-white">{order.address}</td>
//                       <td className="p-4 whitespace-nowrap text-white">{order.dateTime}</td>
//                       <td className="p-4 whitespace-nowrap">
//                         <Link to={`/order/${order.id}`} className="text-blue-600 font-semibold hover:underline">
//                           Order Details
//                         </Link>
//                       </td>
//                       <td className="p-4 whitespace-nowrap">
//                         <StatusBadge status={order.status} />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination Controls */}
//             <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
//               <p>
//                 Showing {startIndex + 1} - {Math.min(endIndex, ordersData.length)} of {ordersData.length}
//               </p>
//               <div className="flex items-center gap-x-2">
//                 <Button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} variant="secondary" >Previous</Button>
//                 <span className="font-semibold">{currentPage} / {totalPages}</span>
//                 <Button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} variant="secondary">Next</Button>
//               </div>
//             </div>
//           </Sidebar>
//   );
// };

// export default OrderList;




import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Button from '../../components/UI/Button/Button';
import ExportActions from '../../components/UI/ExportActions';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// --- IMPORTS FOR EXPORT ---
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import OrderListPDF from './OrderListPDF'; // Your PDF blueprint component

// --- Helper Component for Status Badges ---
const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
  let colorClasses = "";
  switch (status.toLowerCase()) {
    case 'completed': colorClasses = "bg-green-600 text-white"; break;
    case 'rejected': colorClasses = "bg-red-600 text-white"; break;
    case 'in transit': colorClasses = "bg-yellow-600 text-white"; break;
    default: colorClasses = "bg-gray-600 text-white";
  }
  return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};

// Mock data to populate the order table
const ordersData = [
    { id: '00001', partyName: 'Christine Brooks', address: '089 Kutch Green Apt. 448', dateTime: '04 Sep 2019 & 10:00', status: 'Completed' },
    { id: '00002', partyName: 'Rosie Pearson', address: '979 Immanuel Ferry Suite 526', dateTime: '28 May 2019 & 11:00', status: 'Completed' },
    { id: '00003', partyName: 'Darrell Caldwell', address: '8587 Frida Ports', dateTime: '23 Nov 2019 & 01:00', status: 'Rejected' },
    { id: '00004', partyName: 'Gilbert Johnston', address: '768 Destiny Lake Suite 600', dateTime: '05 Feb 2019 & 09:00', status: 'In Transit' },
    { id: '00005', partyName: 'Alan Cain', address: '042 Mylene Throughway', dateTime: '29 Jul 2019 & 02:00', status: 'Completed' },
    { id: '00006', partyName: 'Alfred Murray', address: '543 Weimann Mountain', dateTime: '15 Aug 2019 & 03:00', status: 'Completed' },
    { id: '00007', partyName: 'Maggie Sullivan', address: 'New Scottieberg', dateTime: '21 Dec 2019 & 04:55', status: 'In Transit' },
    { id: '00008', partyName: 'Rosie Todd', address: 'New Jon', dateTime: '30 Apr 2019 & 05:11', status: 'Completed' },
    { id: '00009', partyName: 'Dollie Hines', address: '124 Lyla Forge Suite 975', dateTime: '09 Jan 2019 & 04:45', status: 'Rejected' },
    ...Array.from({ length: 69 }, (_, i) => ({ id: `000${i + 10}`, partyName: `Customer ${i + 10}`, address: '123 Fake Street', dateTime: '01 Jan 2020 & 12:00', status: ['Completed', 'Rejected', 'In Transit'][i % 3] })),
];

const OrderList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  // --- STATE CHANGE: Use a string to track 'pdf', 'excel', or 'none' ---
  const [exportingStatus, setExportingStatus] = useState<'pdf' | 'excel' | null>(null);
  const ITEMS_PER_PAGE = 10;

  // --- PDF EXPORT LOGIC (UPDATED) ---
  const handleExportPdf = async () => {
    setExportingStatus('pdf'); // Set status to 'pdf'
    try {
        const doc = <OrderListPDF orders={ordersData} />;
        const pdfPromise = pdf(doc).toBlob();
        const timerPromise = new Promise(resolve => setTimeout(resolve, 1000));
        const [blob] = await Promise.all([pdfPromise, timerPromise]);
        saveAs(blob, `OrderList.pdf`);
    } catch (error) {
        console.error("Failed to generate PDF", error);
    } finally {
        setExportingStatus(null); // Reset status
    }
  };

  interface ExportRow {
    'S.No.': number;
    'ID': string;
    'Party Name': string;
    'Address': string;
    'Date & Time': string;
    'Status': string;
  }
  // --- EXCEL EXPORT LOGIC (UPDATED) ---
  const handleExportExcel = () => {
        setExportingStatus('excel');
        setTimeout(() => {
            try {
                // FIX 2: Explicitly type the dataToExport array
                const dataToExport: ExportRow[] = ordersData.map((order, index) => ({
                    'S.No.': index + 1,
                    'ID': order.id,
                    'Party Name': order.partyName,
                    'Address': order.address,
                    'Date & Time': order.dateTime,
                    'Status': order.status,
                }));

                const worksheet = XLSX.utils.json_to_sheet(dataToExport);

                // FIX 3: Cast the object keys to the correct type to allow indexing
                const columnWidths = (Object.keys(dataToExport[0]) as Array<keyof ExportRow>).map(key => {
                    const maxLength = Math.max(
                        key.length,
                        ...dataToExport.map(row => String(row[key] || "").length)
                    );
                    return { wch: maxLength + 2 };
                });
                worksheet['!cols'] = columnWidths;

                const range = XLSX.utils.decode_range(worksheet['!ref']!);
                for (let R = range.s.r; R <= range.e.r; ++R) {
                    for (let C = range.s.c; C <= range.e.c; ++C) {
                        const cell_address = { c: C, r: R };
                        const cell_ref = XLSX.utils.encode_cell(cell_address);
                        if (worksheet[cell_ref]) {
                            worksheet[cell_ref].s = {
                                alignment: {
                                    horizontal: "center",
                                    vertical: "center",
                                    wrapText: true,
                                }
                            };
                        }
                    }
                }

                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
                XLSX.writeFile(workbook, "OrderList.xlsx");

            } catch (error) {
                console.error("Failed to generate Excel", error);
            } finally {
                setExportingStatus(null);
            }
        }, 100);
    };

  const totalPages = Math.ceil(ordersData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = ordersData.slice(startIndex, endIndex);

  const goToPage = (pageNumber: number) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(newPage);
  };
  
  return (
    <Sidebar>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-black">Order List</h1>
        <div className="flex items-center gap-x-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 text-gray-400 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product name"
              className="w-full rounded-lg border-white bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-secondary focus:ring-secondary"
            />
          </div>
          <ExportActions 
            onExportPdf={handleExportPdf}
            onExportExcel={handleExportExcel}
          />
        </div>
      </div>

      {/* --- CONDITIONAL LOADING INDICATOR --- */}
      {exportingStatus && (
          <div className="w-full p-4 mb-4 text-center bg-blue-100 text-blue-800 rounded-lg">
              {exportingStatus === 'pdf' ? 'Generating PDF... Please wait.' : 'Generating EXCEL... Please wait.'}
          </div>
      )}

      <div className="bg-primary rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary text-white text-left text-sm">
            <tr>
              <th className="p-4 font-semibold rounded-tl-lg">S.NO.</th>
              <th className="p-4 font-semibold">ID</th> 
              <th className="p-4 font-semibold">Party Name</th>
              <th className="p-4 font-semibold">Address</th>
              <th className="p-4 font-semibold">Date & Time</th>
              <th className="p-4 font-semibold">Details</th>
              <th className="p-4 font-semibold rounded-tr-lg">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {currentOrders.map((order, index) => (
              <tr key={order.id} className="hover:shadow-lg hover:scale-[1.02] hover:bg-primary transition-all duration-200 cursor-pointer">
                <td className="p-4 whitespace-nowrap text-white">{startIndex + index + 1}</td> 
                <td className="py-4 whitespace-nowrap text-white">
                  <div className="flex items-center px-4">
                    <div className="h-10 w-0"></div>
                    <span>{order.id}</span>
                  </div>
                </td>
                <td className="p-4 whitespace-nowrap text-white">{order.partyName}</td>
                <td className="p-4 whitespace-nowrap text-white">{order.address}</td>
                <td className="p-4 whitespace-nowrap text-white">{order.dateTime}</td>
                <td className="p-4 whitespace-nowrap">
                  <Link to={`/order/${order.id}`} className="text-blue-600 font-semibold hover:underline">
                    Order Details
                  </Link>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
        <p>
          Showing {startIndex + 1} - {Math.min(endIndex, ordersData.length)} of {ordersData.length}
        </p>
        <div className="flex items-center gap-x-2">
          <Button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} variant="secondary" >Previous</Button>
          <span className="font-semibold">{currentPage} / {totalPages}</span>
          <Button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} variant="secondary">Next</Button>
        </div>
      </div>
    </Sidebar>
  );
};

export default OrderList;