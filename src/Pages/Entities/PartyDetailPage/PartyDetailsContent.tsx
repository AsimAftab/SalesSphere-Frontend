import { motion } from 'framer-motion';
import {
  UserIcon,
  CalendarDaysIcon,
  PhoneIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  IdentificationIcon,
  MapPinIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

import { DetailsHeader } from '../Shared/components/Details/DetailsHeader';
import { DetailsMainCard } from '../Shared/components/Details/DetailsMainCard';
import { DetailsInfoGrid } from '../Shared/components/Details/DetailsInfoGrid';
import { DetailsMapBlock } from '../Shared/components/Details/DetailsMapBlock';
import { DetailsStatCard } from '../Shared/components/Details/DetailsStatCard';

import PartyOrdersTable from './components/PartyOrdersTable';
import PartyDetailsSkeleton from './PartyDetailsSkeleton';

export interface Order {
  _id: string;
  id: string;
  invoiceNumber: string;
  expectedDeliveryDate: string;
  totalAmount: number;
  status: string;
  statusColor: string;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
};

const PartyDetailsContent = ({
  data, loading, onOpenEdit, onOpenDelete, onImageUpload, onImageDelete, isUploading, isDeletingImage
}: any) => {

  if (loading || !data) return <PartyDetailsSkeleton />;

  const { party, statsData } = data;
  const totalOrders = statsData?.summary?.totalOrders ?? 0;

  // ✅ FIX 1: Corrected Template Literal Syntax (Removed '0' prefix)
  const hasCoordinates = !!(party.latitude && party.longitude);
  const googleMapsUrl = hasCoordinates
    ? `https://www.google.com/maps?q=${party.latitude},${party.longitude}`
    : '#';

  const infoItems = [
    { icon: UserIcon, label: 'Owner Name', value: party.ownerName },
    { icon: CalendarDaysIcon, label: 'Date Joined', value: party.dateCreated ? new Date(party.dateCreated).toLocaleDateString() : 'N/A' },
    { icon: PhoneIcon, label: 'Phone', value: party.phone },
    { icon: EnvelopeIcon, label: 'Email', value: party.email || 'N/A' },
    { icon: BriefcaseIcon, label: 'Party Type', value: party.partyType || 'Not Specified' },
    { icon: IdentificationIcon, label: 'PAN/VAT Number', value: party.panVat || 'N/A' },
    { icon: MapPinIcon, label: 'Full Address', value: party.address, className: 'sm:col-span-2' },
    { icon: GlobeAltIcon, label: 'Latitude', value: party.latitude?.toFixed(6) },
    { icon: GlobeAltIcon, label: 'Longitude', value: party.longitude?.toFixed(6) }
  ];

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
      <DetailsHeader title="Party Details" backPath="/parties" actions={[
        { label: 'Edit Party', onClick: onOpenEdit, variant: 'primary' },
        { label: 'Delete Party', onClick: onOpenDelete, variant: 'outline', className: 'text-red-600 border-red-200 hover:bg-red-50' }
      ]} />

      {/* ✅ Added items-stretch to align column heights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

        {/* Left Column: Identity & Information */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <DetailsMainCard
            title={party.companyName}
            address={party.address}
            image={party.image}
            isUploading={isUploading}
            isDeleting={isDeletingImage}
            onUpload={onImageUpload}
            onDelete={onImageDelete}
            onPreview={() => { }}
            googleMapsUrl={googleMapsUrl}
            hasCoordinates={hasCoordinates}
          />

          {/* ✅ flex-1 allows this card to expand to fill space */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-blue-600" />
              </div>
              Party Information
            </h3>
            <DetailsInfoGrid items={infoItems} />
            <div className="border-t border-gray-100 pt-4 mt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                <DocumentTextIcon className="w-4 h-4 text-gray-400" /> Description
              </h4>
              <p className="text-sm text-gray-600 italic">
                {party.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Map */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <DetailsStatCard
            label="Total Orders"
            value={totalOrders}
            subtitle="For this party"
            color="yellow"
            icon={BuildingStorefrontIcon}
          />

          {/* ✅ Map Block now fills the remaining vertical space */}
          <DetailsMapBlock
            lat={Number(party.latitude) || null}
            lng={Number(party.longitude) || null}
          />
        </div>

        {/* Bottom Section: Orders Table */}
        <div className="lg:col-span-3">
          <PartyOrdersTable orders={statsData?.allOrders || []} />
        </div>
      </div>
    </motion.div>
  );
};

export default PartyDetailsContent;