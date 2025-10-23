import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, BuildingStorefrontIcon, PencilIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, TrashIcon } from '@heroicons/react/24/outline';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { type FullPartyDetailsData, deletePartyDetails } from '../../api/partyDetailsService';
import EditPartyModal from '../../components/modals/EditPartyModal';

// Fix Leaflet default marker icon issue with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// --- Reusable Status Badge Component ---
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
}

const PartyDetailsContent: React.FC<PartyDetailsContentProps> = ({ data, loading, error }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const navigate = useNavigate();

    if (loading) return <div className="text-center p-10 text-gray-500">Loading Party Details...</div>;
    if (error) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    if (!data) return <div className="text-center p-10 text-gray-500">Party data not found.</div>;

    const { party, orders } = data;
    const totalOrders = orders.length;

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const formatJoinDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const handleDeleteParty = async () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${party.companyName}? This action cannot be undone.`);

        if (confirmDelete) {
            try {
                await deletePartyDetails(party.id);
                alert(`${party.companyName} has been successfully deleted!`);
                // Navigate back to parties list after deletion
                navigate('/parties');
            } catch (error) {
                console.error('Error deleting party:', error);
                alert('Failed to delete party. Please try again.');
            }
        }
    };

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
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                        <PencilIcon className="h-5 w-5" />
                        Edit Party
                    </button>
                    <button
                        onClick={handleDeleteParty}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
                    >
                        <TrashIcon className="h-5 w-5" />
                        Delete Party
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Main Party Card */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
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

                    {/* Owner Information & Location Details */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <BuildingStorefrontIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            Owner Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Owner Name</p>
                                <p className="text-sm font-medium text-gray-900">{party.ownerName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                                <p className="text-sm font-medium text-gray-900">{party.phone}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Email Address</p>
                                <p className="text-sm font-medium text-gray-900">{party.email}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">PAN/VAT Number</p>
                                <p className="text-sm font-medium text-gray-900">{party.panVat}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-gray-500 mb-1">Full Address</p>
                                <p className="text-sm font-medium text-gray-900">{party.address}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-gray-500 mb-1">Date Joined</p>
                                <p className="text-sm font-medium text-gray-900">{formatJoinDate(party.dateCreated)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Latitude</p>
                                <p className="text-sm font-medium text-gray-900">{party.latitude || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Longitude</p>
                                <p className="text-sm font-medium text-gray-900">{party.longitude || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Orders Section */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                    <BuildingStorefrontIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Total Orders</h3>
                                    <p className="text-white/80 text-sm">{totalOrders} orders</p>
                                </div>
                            </div>
                            <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg shadow-lg font-bold">
                                <span className="text-2xl">{totalOrders}</span>
                            </div>
                        </div>

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
                                            <tr key={order.id} className="hover:bg-blue-50 transition-colors">
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
                </div>

                {/* Right Column - Contact Info & Map */}
                <div className="space-y-6">
                    {/* Contact Information */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <PhoneIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            Contact Information
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 mb-1">Email</p>
                                    <p className="text-sm font-medium text-gray-900 truncate">{party.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <PhoneIcon className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                                    <p className="text-sm font-medium text-gray-900">{party.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MapPinIcon className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 mb-1">Address</p>
                                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{party.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Map */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden relative z-0">
                        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <MapPinIcon className="w-4 h-4 text-blue-600" />
                                </div>
                                Location Map
                            </h3>
                        </div>
                        <div className="h-64 relative z-0">
                            {party.latitude && party.longitude ? (
                                <MapContainer
                                    center={[party.latitude, party.longitude]}
                                    zoom={13}
                                    style={{ height: '100%', width: '100%', position: 'relative', zIndex: 0 }}
                                    scrollWheelZoom={false}
                                    zoomControl={true}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
                                    <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md flex items-center justify-center gap-2">
                                        <MapPinIcon className="w-4 h-4" />
                                        View on Google Maps
                                    </button>
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Total Orders Card */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-gray-800">Total Orders</h3>
                            <p className="text-xs text-gray-500">For this party</p>
                        </div>
                        <div className="flex items-center">
                            <span className="text-3xl font-bold text-yellow-500 mr-3">{totalOrders}</span>
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <BuildingStorefrontIcon className="h-6 w-6 text-yellow-500"/>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Edit Party Modal */}
            <EditPartyModal
                party={party}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={(updatedParty) => {
                    console.log('Party updated:', updatedParty);
                    // TODO: Implement actual save functionality (API call)
                    alert('Party details updated! (This is a demo - changes are not persisted)');
                }}
            />
        </div>
    );
};

export default PartyDetailsContent;
