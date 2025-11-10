import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  MapPinIcon,
  UserIcon,
  BuildingStorefrontIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarDaysIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline';

import { LocationMap } from '../../components/maps/LocationMap';
import { type Party, type PartyStatsSummary } from '../../api/partyService'; 
import Button from '../../components/UI/Button/Button';

export interface Order {
  id: string;
  invoiceNumber: string;
  expectedDeliveryDate: string;
  totalAmount: number;
  status: 'Completed' | 'Rejected' | 'In Transit' | 'Pending' | 'In Progress' | string;
  statusColor: 'green' | 'red' | 'orange' | 'blue' | 'violet' | 'gray';
}

export interface FullPartyDetailsData {
  party: Party;
  orders: Order[];
  stats: PartyStatsSummary | null; 
}


const StatusBadge = ({ status, color }: { status: string; color: string }) => {

  const colorClasses: { [key: string]: string } = {
    green: 'bg-green-100 text-green-800 border border-green-300',
    red: 'bg-red-100 text-red-800 border border-red-300',
    orange: 'bg-orange-100 text-orange-800 border border-orange-300',
    blue: 'bg-blue-100 text-blue-800 border border-blue-300', 
    violet: 'bg-violet-100 text-violet-800 border border-violet-300', 
    gray: 'bg-gray-100 text-gray-800 border border-gray-300', 
  };
  return (
    <span
      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
        colorClasses[color] || 'bg-gray-100 text-gray-800 border border-gray-300'
      }`}
    >
      {status}
    </span>
  );
};

interface PartyDetailsContentProps {
  data: FullPartyDetailsData | null;
  loading: boolean;
  error: string | null;
  onDataRefresh: () => void;
  onDeleteRequest: () => void;
  onOpenEditModal: () => void;
}


interface StaticMapViewerProps {
  latitude: number;
  longitude: number;
}

const StaticMapViewer: React.FC<StaticMapViewerProps> = ({ latitude, longitude }) => {
  const dummyHandler = () => {
  };

  return (
    <LocationMap
      isViewerMode={true}
      position={{ lat: latitude, lng: longitude }}
      onLocationChange={dummyHandler}
      onAddressGeocoded={dummyHandler}
    />
  );
};

const PartyDetailsContent: React.FC<PartyDetailsContentProps> = ({
  data,
  loading,
  error,
  onOpenEditModal,
  onDeleteRequest,
}) => {
 
  if (loading) return <div className="text-center p-10 text-gray-500">Loading Party Details...</div>;
  if (error) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
  if (!data || !data.party)
    return <div className="text-center p-10 text-gray-500">Party data not found.</div>;

  const { party, orders, stats } = data; 
  const totalOrders = stats?.totalOrders ?? orders.length; 

  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';

   
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      timeZone: 'UTC', 
    };

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; 
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      return dateString; 
    }
  };

  const initialPosition = {
    lat: party.latitude || 27.7172, 
    lng: party.longitude || 85.3240,
  };

  const googleMapsUrl =
    party.latitude && party.longitude
      ? `http://googleusercontent.com/maps/google.com/0{party.latitude},${party.longitude}`
      : '#';

  
  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Link to="/parties" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 text-center md:text-left">
            Party Details
          </h1>
        </div>
        <div className="flex flex-col md:flex-row w-full md:w-auto gap-4 md:space-x-4">
          <Button variant="primary" onClick={onOpenEditModal} className="w-full">
            Edit Party Details
          </Button>
          <Button
            variant="outline"
            onClick={onDeleteRequest}
            className="w-full text-red-600 border-red-300 hover:bg-red-50 focus:ring-red-500"
          >
            Delete Party
          </Button>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 p-4">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <BuildingStorefrontIcon className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{party.companyName}</h2>
              {party.latitude && party.longitude ? (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
                >
                  <MapPinIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm hover:underline">{party.address}</span>
                </a>
              ) : (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPinIcon className="w-4 h-4" />
                  <span className="text-sm">{party.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex justify-between items-center h-full">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Total Orders</h3>
            <p className="text-md text-gray-500">For this party</p>
          </div>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-yellow-500 mr-3">{totalOrders}</span>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BuildingStorefrontIcon className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-blue-600" />
            </div>
            Party Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
            <div className="flex items-start gap-2">
              <UserIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-500 block">Owner Name</span>
                <span className="text-gray-800">{party.ownerName || 'N/A'}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CalendarDaysIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-500 block">Date Joined</span>
                <span className="text-gray-800">{formatDate(party.dateCreated)}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-500 block">Phone</span>
                <span className="text-gray-800">{party.phone || 'N/A'}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-500 block">Email</span>
                <span className="text-gray-800 break-all">{party.email || 'N/A'}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <IdentificationIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-500 block">PAN/VAT Number</p>
                <p className=" text-gray-800">{party.panVat || 'N/A'}</p>
             </div>
            </div>
            <div className=" flex items-start gap-2">
              <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-500 block">Full Address</span>
                <span className="text-gray-800">{party.address}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <GlobeAltIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-500 block">Latitude</span>
                <span className="text-gray-800">{party.latitude?.toFixed(6) ?? 'N/A'}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <GlobeAltIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-500 block">Longitude</span>
                <span className="text-gray-800">{party.longitude?.toFixed(6) ?? 'N/A'}</span>
              </div>
            </div>
          </div>
          {/* --- END OF MISSING CODE (this </div> closes the grid) --- */}

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
              <DocumentTextIcon className="w-4 h-4 text-gray-500" />
              Description
            </h4>
            <p className="text-sm text-gray-600">{party.description || 'No description provided.'}</p>
          </div>
        </div>

        {/* Row 2: Location Map Card (GOOGLE MAPS INTEGRATION) */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden relative h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPinIcon className="w-4 h-4 text-blue-600" />
              </div>
              Location Map
            </h3>
          </div>

          {/* MAP DISPLAY AREA */}
          <div className="flex-1 relative z-20" style={{ minHeight: '250px' }}>
            <StaticMapViewer
              latitude={initialPosition.lat}
              longitude={initialPosition.lng}
            />
          </div>

          {/* FOOTER BUTTON */}
          {party.latitude && party.longitude && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button variant="secondary" className="w-full justify-center">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  View on Google Maps
                </Button>
              </a>
            </div>
          )}
        </div>

        {/* Row 4: Orders Section (was Row 3) */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-secondary text-white text-sm">
                <tr>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">S.NO.</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Invoice Number</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Expected Delivery Date</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Total Amount</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">View Details</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr key={order.id} className="hover:bg-gray-200">
                    <td className="px-5 py-3 whitespace-nowrap text-black">{index + 1}</td>
                    
                      <td className="px-5 py-3 whitespace-nowrap text-black">{order.invoiceNumber}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-black">{formatDate(order.expectedDeliveryDate)}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-black">{order.totalAmount}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-black">
                        <Link
                         to={`/order/${order.id}`} 
                          className="text-secondary hover:text-secondary font-semibold hover:underline"
                        >
                         Order Details
                        </Link>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-black">
                       <StatusBadge status={order.status} color={order.statusColor} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                     No orders found for this party.
                 </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* End Main Grid */}
    </div>
  );
};

export default PartyDetailsContent;