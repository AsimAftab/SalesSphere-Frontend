import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { type FullPartyDetailsData } from '../../api/partyDetailsService';

// --- Reusable Status Badge Component ---
const StatusBadge = ({ status, color }: { status: string, color: string }) => {
    const colorClasses: { [key: string]: string } = {
        green: 'bg-green-100 text-green-800',
        red: 'bg-red-100 text-red-800',
        yellow: 'bg-yellow-100 text-yellow-800',
    };
    return (
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[color] || 'bg-gray-100 text-gray-800'}`}>
          {status}
        </span>
    );
};

// --- Component Props Interface ---
interface PartyDetailsContentProps {
    data: FullPartyDetailsData | null;
    loading: boolean;
    error: string | null;
}

const PartyDetailsContent: React.FC<PartyDetailsContentProps> = ({ data, loading, error }) => {
    if (loading) return <div className="text-center p-10 text-gray-500">Loading Party Details...</div>;
    if (error) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    if (!data) return <div className="text-center p-10 text-gray-500">Party data not found.</div>;

    const { party, orders } = data;
    const totalOrders = orders.length;

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <>
            <div className="flex items-center gap-4 mb-6">
                <Link to="/parties" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Party Details</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* --- Main Party Card (Profile) --- */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                    {/* --- Centered Header --- */}
                    <div className="flex flex-col items-center mb-6">
                        <img 
                            src={party.imageUrl} 
                            alt={party.name} 
                            className="w-24 h-24 rounded-full object-cover mb-4 shadow-md" 
                     />
                        <h2 className="text-xl font-bold text-gray-800">{party.name}</h2>
                        <p className="text-sm text-gray-500">{party.location}</p>
                    </div>

                    {/* --- Details Grid --- */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                        <div>
                            <p className="text-sm text-gray-500">Owner Name</p>
                            <p className="font-medium text-gray-800">{party.ownerName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <p className="font-medium text-gray-800">{party.phone}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">PAN/VAT Number</p>
                            <p className="font-medium text-gray-800">{party.panVat}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email Address</p>
                            <p className="font-medium text-gray-800">{party.contact.email}</p>
                        </div>
                    </div>
                </div>

                {/* --- Sidebar Cards --- */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* --- Contact Info Card --- */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4">Contact Information</h3>
                        <div className="space-y-4">
                            <div>
                           <p className="text-sm text-gray-500">Email Address</p>
                                <p className="font-medium text-gray-800">{party.contact.email}</p>
                       </div>
                            <div>
                                <p className="text-sm text-gray-500">Phone Number</p>
                                <p className="font-medium text-gray-800">{party.contact.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                       <p className="font-medium text-gray-800">{party.contact.address}</p>
                          </div>
                        </div>
                    </div>

                    {/* --- Total Orders Card --- */}
               <div className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center">
                        <div><h3 className="font-bold text-gray-800">Total Orders</h3><p className="text-xs text-gray-500">For this party</p></div>
                        <div className="flex items-center">
                            <span className="text-3xl font-bold text-yellow-500 mr-3">{totalOrders}</span>
                            <div className="p-2 bg-yellow-100 rounded-lg">
                             <BuildingStorefrontIcon className="h-6 w-6 text-yellow-500"/>
                            </div>
                        </div>
                    </div>
                </div>

            </div> {/* This is the closing tag for the grid wrapper */}

         <div className="mt-6 bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-secondary text-white">
                            <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">S.No.</th>
                                <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                                <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">Party Name</th>
                                <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">Address</th>
                           <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">Date & Time</th>
                                <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">Details</th>
                                <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                           {orders.length > 0 ? (
                                orders.map((order, index) => (
                                    <tr key={order.id}>
                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.partyName}</td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.address}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <Link to={`/order/${order.id}`} className="text-blue-600 hover:underline font-semibold">
                                           Order Details
                                        </Link>
                                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm">
                                       <StatusBadge status={order.status} color={order.statusColor} />
                           </td>
                               </tr>
                   ))
                            ) : (
                                <tr>
                           <td colSpan={7} className="text-center py-10 text-gray-500">
                                 No orders found for this party.
                                    </td>
                   </tr>
                            )}
                        </tbody>
                   </table>
                </div>
            </div>
        </>
    );
};

export default PartyDetailsContent;