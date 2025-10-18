import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { type FullProspectDetailsData } from '../../api/prospectDetailsService';

// --- Component Props Interface ---
interface ProspectDetailsContentProps {
    data: FullProspectDetailsData | null;
    loading: boolean;
    error: string | null;
}

const ProspectDetailsContent: React.FC<ProspectDetailsContentProps> = ({ data, loading, error }) => {
    // Handle loading state
    if (loading) {
        return <div className="text-center p-10 text-gray-500">Loading Prospect Details...</div>;
    }

    // Handle error state
    if (error) {
        return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    }

    // Handle no data state
    if (!data) {
        return <div className="text-center p-10 text-gray-500">Prospect data not found.</div>;
    }

    const { prospect, contact } = data;

    return (
        <>
            {/* --- Page Header --- */}
            <div className="flex items-center gap-4 mb-6">
                <Link to="/prospects" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Prospect Details</h1>
            </div>

            {/* --- Main Two-Column Layout --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* --- Left Column: Prospect Info & Description --- */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
                        <img 
                            src={prospect.imageUrl} 
                            alt={prospect.name}
                            className="w-24 h-24 rounded-lg object-cover mr-6"
                        />
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-800">{prospect.name}</h2>
                            <p className="text-sm text-gray-500">{prospect.designation}</p>
                            <p className="text-sm text-gray-500 mt-1">{prospect.location}</p>
                        </div>
                    </div>

                    {/* --- New Description Card --- */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-2">Description</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{prospect.description}</p>
                    </div>
                </div>

                {/* --- Right Column: Contact Info --- */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4">Contact Information</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center text-gray-600 break-all"><EnvelopeIcon className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />{contact.email}</div>
                            <div className="flex items-center text-gray-600"><PhoneIcon className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />{contact.phone}</div>
                            <div className="flex items-start text-gray-600"><MapPinIcon className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0 mt-0.5" />{contact.address}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProspectDetailsContent;
