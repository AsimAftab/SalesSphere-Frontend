import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Header from '../../components/layout/Header/Header';
import Button from '../../components/UI/Button/Button';
import { FunnelIcon, ChevronDownIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// --- Helper Component for Status Badges ---
const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
  let colorClasses = "";

  switch (status.toLowerCase()) {
    case 'completed':
      colorClasses = "bg-green-600 text-white";
      break;
    case 'rejected':
      colorClasses = "bg-red-600 text-white";
      break;
    case 'in transit':
      colorClasses = "bg-yellow-600 text-white";
      break;
    default:
      colorClasses = "bg-gray-600 text-white";
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
  // Adding more mock data to reach a total of 78 items to simulate pagination
  ...Array.from({ length: 69 }, (_, i) => ({ id: `000${i + 10}`, partyName: `Customer ${i + 10}`, address: '123 Fake Street', dateTime: '01 Jan 2020 & 12:00', status: ['Completed', 'Rejected', 'In Transit'][i % 3] })),
];

const OrderList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const totalPages = Math.ceil(ordersData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = ordersData.slice(startIndex, endIndex);

  const goToPage = (pageNumber: number) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(newPage);
  };
  
  return (
    <div className="flex h-screen bg-gray-300 font-arimo">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-200 p-6">
          
          {/* Page Header and Filter Bar */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-black mb-4">Order Lists</h1>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-primary rounded-lg shadow-sm">
              <div className="flex items-center gap-x-16">
                <span className="flex items-center text-sm font-semibold text-white">
                  <FunnelIcon className="h-5 w-5 mr-2" />
                  Filter By
                </span>
                <button className="flex items-center gap-x-2 text-sm bg-gray-100 px-3 py-1.5 rounded-md ">
                  Party Name <ChevronDownIcon className="h-4 w-4" />
                </button>
                <button className="flex items-center gap-x-2 text-sm bg-gray-100 px-3 py-1.5 rounded-md ">
                  Order Status <ChevronDownIcon className="h-4 w-4" />
                </button>
                <button className="flex items-center gap-x-2 text-sm bg-gray-100 px-3 py-1.5 rounded-md">
                  Date <ChevronDownIcon className="h-4 w-4" />
                </button>
              </div>
              <button className="flex items-center text-sm font-semibold text-white hover:text-red-600">
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Reset Filter
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-primary rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary text-white text-left text-sm">
                <tr>
                  <th className="p-4 font-semibold rounded-tl-lg">ID</th>
                  <th className="p-4 font-semibold">Party Name</th>
                  <th className="p-4 font-semibold">Address</th>
                  <th className="p-4 font-semibold">Date & Time</th>
                  <th className="p-4 font-semibold">Details</th>
                  <th className="p-4 font-semibold rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {currentOrders.map((order) => (
                  <tr key={order.id} className="hover:shadow-lg hover:scale-[1.02] hover:bg-primary transition-all duration-200 cursor-pointer">
                    <td className="p-4 whitespace-nowrap font-medium text-white">{order.id}</td>
                    <td className="p-4 whitespace-nowrap text-white">{order.partyName}</td>
                    <td className="p-4 whitespace-nowrap text-white">{order.address}</td>
                    <td className="p-4 whitespace-nowrap text-white">{order.dateTime}</td>
                    <td className="p-4 whitespace-nowrap">
                      <button className="text-blue-600 font-semibold hover:underline">Invoice</button>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
            <p>
              Showing {startIndex + 1} - {Math.min(endIndex, ordersData.length)} of {ordersData.length}
            </p>
            <div className="flex items-center gap-x-2">
              <Button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} variant="secondary" >Previous</Button>
              <Button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} variant="secondary">Next</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderList;
