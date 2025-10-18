import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { type FullSiteDetailsData } from '../../api/siteDetailsService';

interface SiteDetailsContentProps {
    data: FullSiteDetailsData | null;
    loading: boolean;
    error: string | null;
}

const SiteDetailsContent: React.FC<SiteDetailsContentProps> = ({ data, loading, error }) => {
    if (loading) return <div className="text-center p-10 text-gray-500">Loading Site Details...</div>;
    if (error) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    if (!data) return <div className="text-center p-10 text-gray-500">Site data not found.</div>;

    const { site, contact } = data;

    return (
        <>
            <div className="flex items-center gap-4 mb-6">
                <Link to="/sites" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Site Details</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
                        <img src={site.imageUrl} alt={site.name} className="w-24 h-24 rounded-lg object-cover mr-6" />
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-800">{site.name}</h2>
                            <p className="text-sm text-gray-500">{site.location}</p>
                            <p className="text-sm text-gray-500 mt-2">Managed by: <span className="font-medium text-gray-700">{site.manager}</span></p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-2">Description</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{site.description}</p>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4">Contact Information</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center text-gray-600 break-all"><EnvelopeIcon className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />{contact.email}</div>
                            <div className="flex items-center text-gray-600"><PhoneIcon className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />{contact.phone}</div>
                            <div className="flex items-start text-gray-600"><MapPinIcon className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0 mt-0.5" />{contact.fullAddress}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SiteDetailsContent;
