import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, BuildingStorefrontIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// Assuming updatePartyDetails is also in partyDetailsService
import { type FullPartyDetailsData, deletePartyDetails, updatePartyDetails } from '../../api/partyDetailsService';
import EditPartyModal from '../../components/modals/EditPartyModal';
import Button from '../../components/UI/Button/Button';
import ConfirmationModal from '../../components/modals/ConfirmationModal';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// --- Status Badge ---
const StatusBadge = ({ status, color }: { status: string, color: string }) => {
    const colorClasses: { [key: string]: string } = {
        green: 'bg-green-100 text-green-800 border border-green-300',
        red: 'bg-red-100 text-red-800 border border-red-300',
        yellow: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    };
    return (
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[color] || 'bg-gray-100 text-gray-800 border border-gray-300'}`}>
            {status}
        </span>
    );
};

// --- Component Props Interface ---
interface PartyDetailsContentProps {
    data: FullPartyDetailsData | null;
    loading: boolean;
    error: string | null;
    onDataRefresh: () => void; // Prop to signal parent to refresh
}

const PartyDetailsContent: React.FC<PartyDetailsContentProps> = ({
    data,
    loading,
    error,
    onDataRefresh // Receive the refresh function
}) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [partyIdToDelete, setPartyIdToDelete] = useState<string | null>(null);
    const navigate = useNavigate();

    // Loading/Error/NoData checks
    if (loading) return <div className="text-center p-10 text-gray-500">Loading Party Details...</div>;
    if (error) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    // Check specifically for data.party because FullPartyDetailsData might exist but party could be null
    if (!data || !data.party) return <div className="text-center p-10 text-gray-500">Party data not found.</div>;


    // Now we can safely destructure party
    const { party, orders } = data;
    const totalOrders = orders.length;

    // Formatting functions
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };
    const formatJoinDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // --- Delete Logic ---
    const handleDeleteClick = (partyId: string) => {
        setPartyIdToDelete(partyId);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (partyIdToDelete) {
            try {
                await deletePartyDetails(partyIdToDelete);
                navigate('/parties'); // Redirect after successful deletion
            } catch (error) {
                console.error('Error deleting party:', error);
                alert('Failed to delete party. Please try again.');
            } finally {
                setDeleteModalOpen(false);
                setPartyIdToDelete(null);
            }
        }
    };

    const cancelDelete = () => {
        setDeleteModalOpen(false);
        setPartyIdToDelete(null);
    }

    // --- Edit Logic ---
    const handleSaveEditedParty = async (updatedPartyData: Partial<FullPartyDetailsData['party']>) => {
        try {
            await updatePartyDetails(party.id, updatedPartyData);
            setIsEditModalOpen(false);
            onDataRefresh(); // Call parent's refresh function
        } catch (error) {
            console.error('Error updating party:', error);
            alert('Failed to update party details. Please try again.');
        }
    };

    // --- JSX Return ---
    return (
        <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-4">
                    <Link to="/parties" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Party Details</h1>
                </div>
                <div className="flex space-x-4">
                    <Button
                        variant="outline"
                        onClick={() => handleDeleteClick(party.id)}
                        className="text-red-600 border-red-300 hover:bg-red-50 focus:ring-red-500"
                    >
                        Delete Party
                    </Button>
                    <Button variant="primary" onClick={() => setIsEditModalOpen(true)}>
                        Edit Party Details
                    </Button>
                </div>
            </div>

            {/* Main Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Row 1: Main Party Card */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 p-4">
                    <div className="flex items-start gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                            <BuildingStorefrontIcon className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{party.companyName}</h2>
                            {party.latitude && party.longitude ? (
                                <a
                                    href={`https://maps.google.com/?q=${party.latitude},${party.longitude}`}
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

                {/* Row 1: Total Orders Card */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex justify-between items-center h-full">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Total Orders</h3>
                        <p className="text-md text-gray-500">For this party</p>
                    </div>
                    <div className="flex items-center">
                        <span className="text-3xl font-bold text-yellow-500 mr-3">{totalOrders}</span>
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <BuildingStorefrontIcon className="h-6 w-6 text-yellow-500"/>
                        </div>
                    </div>
                </div>

                {/* Row 2: Owner Information Card */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 p-6 h-full">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BuildingStorefrontIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        Party Information
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Owner Name</p>
                            <p className="text-md font-medium text-gray-900">{party.ownerName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                            <p className="text-md font-medium text-gray-900">{party.phone || 'N/A'}</p> {/* Handle potentially missing phone */}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">PAN/VAT Number</p>
                            <p className="text-md font-medium text-gray-900">{party.panVat || 'N/A'}</p> {/* Handle potentially missing panVat */}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Email Address</p>
                            <p className="text-md font-medium text-gray-900">{party.email || 'N/A'}</p> {/* Handle potentially missing email */}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Full Address</p>
                            <p className="text-md font-medium text-gray-900">{party.address}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Date Joined</p>
                            <p className="text-md font-medium text-gray-900">{formatJoinDate(party.dateCreated)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Latitude</p>
                            <p className="text-md font-medium text-gray-900">{party.latitude || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Longitude</p>
                            <p className="text-md font-medium text-gray-900">{party.longitude || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Row 2: Location Map Card */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden relative z-0 h-full flex flex-col">
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <MapPinIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            Location Map
                        </h3>
                    </div>
                    {/* Map container */}
                    <div className="flex-1 relative z-0" style={{minHeight: '250px'}}>
                        {party.latitude && party.longitude ? (
                            <MapContainer
                                center={[party.latitude, party.longitude]}
                                zoom={13}
                                style={{ height: '100%', width: '100%', position: 'relative', zIndex: 0 }}
                                scrollWheelZoom={false}
                                zoomControl={true}
                            >
                                <TileLayer
                                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[party.latitude, party.longitude]}>
                                    <Popup>
                                        {party.companyName}
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-gray-100">
                                <p className="text-gray-500 text-sm">Location data not provided</p>
                            </div>
                        )}
                    </div>
                    {party.latitude && party.longitude && (
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                            <a
                                href={`https://maps.google.com/?q=${party.latitude},${party.longitude}`}
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

                {/* Row 3: Orders Section */}
                  <div className="lg:col-span-3 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                      {/* Orders Table */}
                      <div className="overflow-x-auto">
                          <table className="min-w-full">
                              <thead className="bg-blue-600 text-white">
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
                                          <tr key={order.id} className="hover:bg-blue-100 transition-colors">
                                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.partyName}</td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.address}</td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(order.date)}</td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                  <Link to={`/order/${order.id}`} className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
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
              </div> {/* End Main Grid */}

            {/* Edit Party Modal */}
            <EditPartyModal
                party={party}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveEditedParty}
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                message={`Are you sure you want to delete "${party?.companyName || 'this party'}"?`} // Use optional chaining just in case
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div> // End Relative div
    );
// Correctly close the component function before exporting
};

export default PartyDetailsContent;

