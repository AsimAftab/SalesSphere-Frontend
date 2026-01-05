import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  CalendarDaysIcon, 
  IdentificationIcon,
  MapPinIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  BuildingStorefrontIcon // Added for the Main Card icon
} from '@heroicons/react/24/outline';

// Shared enterprise components
import { DetailsHeader } from '../Shared/components/Details/DetailsHeader';
import { DetailsMainCard } from '../Shared/components/Details/DetailsMainCard';
import { DetailsInfoGrid } from '../Shared/components/Details/DetailsInfoGrid';
import { DetailsMapBlock } from '../Shared/components/Details/DetailsMapBlock';

import ProspectImageGallery from './sections/ProspectImageGallery.tsx';
import ProspectInterestGrid from './sections/ProspectInterestGrid.tsx';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
};

interface ProspectDetailContentProps {
  data: any;
  actions: any;
  loadingStates: {
    isUploading: boolean;
    isDeletingImage: boolean;
    isMutating: boolean;
  };
  onEdit: () => void;
  onTransfer: () => void;
  onDelete: () => void;
}

const ProspectDetailContent: React.FC<ProspectDetailContentProps> = ({ 
  data, 
  actions, 
  loadingStates,
  onEdit,
  onTransfer,
  onDelete
}) => {
  const { prospect, contact, location } = data;

  // Coordinate and Map Logic
  const hasCoordinates = !!(location?.latitude && location?.longitude);
  const googleMapsUrl = hasCoordinates 
    ? `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}` 
    : '#';

  const infoItems = [
    { icon: UserIcon, label: "Owner Name", value: prospect.ownerName },
    { icon: PhoneIcon, label: "Phone", value: contact.phone },
    { icon: EnvelopeIcon, label: "Email", value: contact.email || 'N/A' },
    { icon: CalendarDaysIcon, label: "Date Joined", value: prospect.dateJoined ? new Date(prospect.dateJoined).toLocaleDateString() : 'N/A' },
    { icon: IdentificationIcon, label: "PAN/VAT Number", value: prospect.panVat || 'N/A' },
    { icon: MapPinIcon, label: "Full Address", value: location.address, className: 'sm:col-span-2' },
    { icon: GlobeAltIcon, label: "Latitude", value: location.latitude?.toFixed(6) || 'N/A' },
    { icon: GlobeAltIcon, label: "Longitude", value: location.longitude?.toFixed(6) || 'N/A' }
  ];

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* 1. Header Section (Now part of Content) */}
      <DetailsHeader 
        title="Prospect Details"
        backPath="/prospects"
        actions={[
          { label: "Transfer to Party", onClick: onTransfer, variant: "secondary" },
          { label: "Edit Prospect", onClick: onEdit, variant: "primary" },
          { 
            label: "Delete Prospect", 
            onClick: onDelete, 
            variant: "outline", 
            className: 'text-red-600 border-red-200 hover:bg-red-50' 
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left Column: Identity & Information */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* 2. Updated Main Branding Card */}
          <DetailsMainCard 
            title={prospect.name}
            address={location.address}
            googleMapsUrl={googleMapsUrl}
            hasCoordinates={hasCoordinates}
            icon={<BuildingStorefrontIcon className="w-10 h-10 text-white" />}
          />

          {/* 3. Information Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-blue-600" />
                </div>
                Prospect Information
            </h3>
            
            <DetailsInfoGrid items={infoItems} />

            {/* Description Section */}
            <div className="border-t border-gray-100 pt-4 mt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                <DocumentTextIcon className="w-4 h-4 text-gray-400" /> Description
              </h4>
              <p className="text-sm text-gray-600 italic leading-relaxed">
                {prospect.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Map Block */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
            <div className="flex-1 min-h-[350px]">
              <DetailsMapBlock 
                lat={Number(location.latitude) || null}
                lng={Number(location.longitude) || null}
              />
            </div>
    
        </div>
      </div>

      {/* Domain-specific sections */}
      <motion.div variants={containerVariants} className="space-y-6">
        <ProspectInterestGrid interests={prospect.interest} />
        <ProspectImageGallery 
          images={prospect.images} 
          actions={actions} 
          loadingStates={loadingStates} 
        />
      </motion.div>
    </motion.div>
  );
};

export default ProspectDetailContent;