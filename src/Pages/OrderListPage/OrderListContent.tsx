import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/UI/Button/Button';
import ExportActions from '../../components/UI/ExportActions';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import OrderListPDF from './OrderListPDF';
import { type Order, type OrderStatus } from '../../api/orderService';
import OrderStatusModal from '../../components/modals/OrderStatusModal';

interface OrderListContentProps {
  data: Order[] | null;
  loading: boolean;
  error: string | null;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

const StatusBadge = ({ status, onClick }: { status: OrderStatus; onClick: () => void }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-transform hover:scale-105";
  let colorClasses = "";
  switch (status.toLowerCase()) {
    case 'completed': colorClasses = "bg-green-600 text-white"; break;
    case 'rejected': colorClasses = "bg-red-600 text-white"; break;
    case 'in transit': colorClasses = "bg-yellow-600 text-white"; break;
    case 'in progress': colorClasses = "bg-blue-600 text-white"; break;
    default: colorClasses = "bg-gray-600 text-white";
  }
  return <button onClick={onClick} className={`${baseClasses} ${colorClasses}`}>{status}</button>;
};

const OrderListContent: React.FC<OrderListContentProps> = ({ data, loading, error, onUpdateStatus }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [exportingStatus, setExportingStatus] = useState<'pdf' | 'excel' | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const ITEMS_PER_PAGE = 10;

  const filteredOrders = useMemo(() => {
    if (!data) return [];
    setCurrentPage(1);
    return data.filter(order =>
      order.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  if (loading) return <div className="text-center p-10 text-gray-500">Loading Orders...</div>;
  if (error) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
  if (!data) return <div className="text-center p-10 text-gray-500">No Order found.</div>;
  

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const goToPage = (pageNumber: number) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(newPage);
  };
  
  const handleExportPdf = async () => {
    setExportingStatus('pdf');
    try {
        const doc = <OrderListPDF orders={filteredOrders} />;
        const blob = await pdf(doc).toBlob();
        saveAs(blob, 'OrderList.pdf');
    } catch (err) {
        console.error("PDF Export Error: ", err);
    } finally {
        setExportingStatus(null);
    }
  };

  // --- Interface for strong typing of exported data ---
  interface ExportRow {
    'S.No.': number;
    'ID': string;
    'Party Name': string;
    'Address': string;
    'Date & Time': string;
    'Status': string;
  }

  const handleExportExcel = () => {
      setExportingStatus('excel');
      setTimeout(() => {
          try {
              const dataToExport: ExportRow[] = filteredOrders.map((order, index) => ({
                  'S.No.': index + 1,
                  'ID': order.id,
                  'Party Name': order.partyName,
                  'Address': order.address,
                  'Date & Time': order.dateTime,
                  'Status': order.status,
              }));

              if (dataToExport.length === 0) {
                  return; // Avoid creating an empty file
              }

              const worksheet = XLSX.utils.json_to_sheet(dataToExport);

              // --- FIX: Logic to calculate and set column widths ---
              const columnWidths = (Object.keys(dataToExport[0]) as Array<keyof ExportRow>).map(key => {
                  const maxLength = Math.max(
                      key.length, // Include header length
                      ...dataToExport.map(row => String(row[key] || "").length)
                  );
                  return { wch: maxLength + 2 }; // +2 for padding
              });
              worksheet['!cols'] = columnWidths;
              // --- END OF FIX ---

              const workbook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
              XLSX.writeFile(workbook, "OrderList.xlsx");
          } catch (err) {
              console.error("Excel Export Error: ", err);
          } finally {
              setExportingStatus(null);
          }
      }, 100);
  };

  const handleStatusClick = (order: Order) => {
    setEditingOrder(order);
  };

  const handleSaveStatus = (newStatus: OrderStatus) => {
    if (editingOrder) {
        onUpdateStatus(editingOrder.id, newStatus);
    }
    setEditingOrder(null);
  };

  return (
    <>
      <OrderStatusModal
        isOpen={!!editingOrder}
        onClose={() => setEditingOrder(null)}
        onSave={handleSaveStatus}
        currentStatus={editingOrder?.status || 'In Progress'}
        orderId={editingOrder?.id || ''}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
       {/* Show subsequent loading/error messages */}
       {loading && data && <div className="text-center p-2 text-sm text-blue-500">Refreshing...</div>}
       {error && data && <div className="text-center p-2 text-sm text-red-600 bg-red-50 rounded">{error}</div>}
        <div className="flex flex-col md:flex-row md:items-center   justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-[#202224] text-center md:text-left">Order List</h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
              <div className="relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-gray-500" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID or Party Name "
                className="block h-10 w-full md:w-64 border-transparent bg-gray-200 py-0 pl-10 pr-3 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-sm rounded-full"
              /> 
          </div>
            <div className="flex justify-center w-full">
              <ExportActions onExportPdf={handleExportPdf} onExportExcel={handleExportExcel} />
            </div>
          </div>
        </div>
      </div>

      {exportingStatus && (
          <div className="w-full p-4 mb-4 text-center bg-blue-100 text-blue-800 rounded-lg">
              {exportingStatus === 'pdf' ? 'Generating PDF...' : 'Generating EXCEL... Please wait.'}
          </div>
      )}

      {filteredOrders.length === 0 && !loading ? (
            <div className="text-center p-10 text-gray-500">No Order found.</div>
       ) : (
        <>
      <div className="bg-primary rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary text-white text-left text-sm">
            <tr>
              <th className="p-3 font-semibold rounded-tl-lg w-[8%]">S.NO.</th>
              <th className="p-3 font-semibold w-[10%]">ID</th> 
              <th className="p-3 font-semibold w-[20%]">Party Name</th>
              <th className="p-3 font-semibold w-[25%]">Address</th>
              <th className="p-3 font-semibold w-[15%]">Date & Time</th>
              <th className="p-3 font-semibold w-[12%]">Details</th>
              <th className="p-3 font-semibold rounded-tr-lg w-[10%]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white text-sm">
            {currentOrders.map((order, index) => (
              <tr key={order.id} className="hover:bg-primary-dark transition-colors duration-200">
                <td className="p-5 whitespace-nowrap text-white">{startIndex + index + 1}</td> 
                <td className="p-5 whitespace-nowrap text-white">{order.id}</td>
                <td className="p-5 whitespace-nowrap text-white truncate">{order.partyName}</td>
                <td className="p-5 whitespace-nowrap text-white truncate">{order.address}</td>
                <td className="p-5 whitespace-nowrap text-white">{order.dateTime}</td>
                <td className="p-5 whitespace-nowrap">
                  <Link to={`/order/${order.id}`} className="text-blue-400 font-semibold hover:underline">
                    Order Details
                  </Link>
                </td>
                <td className="p-5 whitespace-nowrap">
                  <StatusBadge status={order.status} onClick={() => handleStatusClick(order)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </>
    )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
          <p>
            Showing {startIndex + 1} - {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length}
          </p>
          <div className="flex items-center gap-x-2">
            {currentPage > 1 && (
              <Button onClick={() => goToPage(currentPage - 1)} variant="secondary">Previous</Button>
            )}
            <span className="font-semibold">{currentPage} / {totalPages}</span>
            {currentPage < totalPages && (
              <Button onClick={() => goToPage(currentPage + 1)} variant="secondary">Next</Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default OrderListContent;

