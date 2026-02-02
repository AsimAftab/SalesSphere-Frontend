import React from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  IdentificationIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  MapPinIcon,
  BuildingStorefrontIcon // Added for the Main Card icon
} from '@heroicons/react/24/outline';

// Shared enterprise components
import { DetailsHeader } from '../Shared/components/Details/DetailsHeader';
import { DetailsMainCard } from '../Shared/components/Details/DetailsMainCard';
import InfoBlock from '../../../components/ui/Page/InfoBlock';
import { DetailsMapBlock } from '../Shared/components/Details/DetailsMapBlock';

import ProspectImageGallery from './sections/ProspectImageGallery';
import ProspectInterestGrid from './sections/ProspectInterestGrid'; // Removed .tsx extension
import { formatDisplayDate } from '../../../utils/dateUtils';
import type { FullProspectDetailsData } from '../../../api/prospectService';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
};

interface ProspectDetailContentProps {
  data: FullProspectDetailsData;
  actions: {
    uploadImage: (vars: { num: number; file: File }) => void;
    deleteImage: (num: number) => void;
  };
  loadingStates: {
    isUploading: boolean;
    isDeletingImage: boolean;
    isMutating: boolean;
  };
  onEdit: () => void;
  onTransfer: () => void;
  onDelete: () => void;
  permissions?: {
    canUpdate: boolean;
    canDelete: boolean;
    canTransfer: boolean;
    canManageImages: boolean;
  };
}

const ProspectDetailContent: React.FC<ProspectDetailContentProps> = ({
  data,
  actions,
  loadingStates,
  onEdit,
  onTransfer,
  onDelete,
  permissions
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
    { icon: CalendarDaysIcon, label: "Date Joined", value: prospect.dateJoined ? formatDisplayDate(prospect.dateJoined) : 'N/A' },
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
          permissions?.canTransfer ? { label: "Transfer to Party", onClick: onTransfer, variant: "secondary" as const } : null,
          permissions?.canUpdate ? { label: "Edit Prospect", onClick: onEdit, variant: "primary" as const } : null,
          permissions?.canDelete ? {
            label: "Delete Prospect",
            onClick: onDelete,
            variant: "outline" as const,
            className: 'text-red-600 border-red-200 hover:bg-red-50'
          } : null,
        ].filter((item): item is NonNullable<typeof item> => Boolean(item))}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {infoItems.map((item, idx) => (
                <InfoBlock key={idx} icon={item.icon} label={item.label} value={item.value} className={item.className} />
              ))}
            </div>

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
              address={location.address}
            />
          </div>

        </div>
      </div>

      {/* Domain-specific sections */}
      <motion.div variants={containerVariants} className="space-y-6">
        <ProspectInterestGrid interests={prospect.interest} />
        {permissions?.canManageImages && (
          <ProspectImageGallery
            images={prospect.images}
            actions={actions}
            loadingStates={loadingStates}
            canManageImages={permissions?.canManageImages}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProspectDetailContent;