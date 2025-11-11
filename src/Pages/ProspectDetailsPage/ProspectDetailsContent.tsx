import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  MapPinIcon,
  UserIcon,
  ArrowPathRoundedSquareIcon,
  BuildingStorefrontIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarDaysIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion'; 
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'; 
import 'react-loading-skeleton/dist/skeleton.css'; 
import { LocationMap } from '../../components/maps/LocationMap';
import { type Prospect } from '../../api/prospectService';

import Button from '../../components/UI/Button/Button';

// --- PROPS INTERFACE ---
interface ProspectDetailsContentProps {
  data: Prospect | null;
  loading: boolean;
  error: string | null;
  onDataRefresh: () => void;
  onOpenEditModal: () => void;
  onDeleteRequest: () => void;
  onTransferRequest: () => void;
}

// --- STATIC MAP VIEWER WRAPPER ---
interface StaticMapViewerProps {
  latitude: number;
  longitude: number;
}

const StaticMapViewer: React.FC<StaticMapViewerProps> = ({ latitude, longitude }) => {
  const dummyHandler = () => {};
  return (
    <LocationMap
      isViewerMode={true}
      position={{ lat: latitude, lng: longitude }}
      onLocationChange={dummyHandler}
      onAddressGeocoded={dummyHandler}
    />
  );
};

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// --- Skeleton Component ---
const ProspectDetailsSkeleton: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#e6e6e6" highlightColor="#f0f0f0">
      <div className="relative">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Skeleton circle width={40} height={40} />
            <Skeleton width={200} height={32} />
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <Skeleton width={180} height={40} borderRadius={8} />
            <Skeleton width={140} height={40} borderRadius={8} />
            <Skeleton width={160} height={40} borderRadius={8} />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-6">
            {/* Main Card Skeleton */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
              <div className="flex items-start gap-6">
                <Skeleton width={80} height={80} borderRadius={12} />
                <div className="flex-1 pt-2">
                  <Skeleton width="60%" height={28} />
                  <Skeleton width="90%" height={20} className="mt-2" />
                </div>
              </div>
            </div>

            {/* Info Card Skeleton */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Skeleton circle width={32} height={32} />
                <Skeleton width={200} height={24} />
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <Skeleton width="40%" height={16} />
                    <Skeleton width="70%" height={20} className="mt-1" />
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Skeleton width={100} height={20} className="mb-2" />
                <Skeleton count={3} height={16} />
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Skeleton circle width={32} height={32} />
                <Skeleton width={150} height={24} />
              </h3>
            </div>
            <div className="flex-1 relative z-0" style={{ minHeight: '400px' }}>
              <Skeleton height={400} />
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <Skeleton height={40} borderRadius={8} />
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

const ProspectDetailsContent: React.FC<ProspectDetailsContentProps> = ({
  data: prospect,
  loading,
  error,
  onOpenEditModal,
  onDeleteRequest,
  onTransferRequest,
}) => {

  // --- Use Skeleton on initial load ---
  if (loading && !prospect) {
    return <ProspectDetailsSkeleton />;
  }

  // (Error/NoData checks)
  if (error && !prospect)
    return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
  if (!prospect)
    return <div className="text-center p-10 text-gray-500">Prospect data not found.</div>;

  // (formatDate function)
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', };
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', options);
    } catch {
      return dateString;
    }
  };

  const googleMapsUrl =
    prospect.latitude && prospect.longitude
      ? `https://www.google.com/maps?q=${prospect.latitude},${prospect.longitude}`
      : '#';

  return (
    // --- Added motion wrapper ---
    <motion.div
      className="relative"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* --- Overlays (Refresh, Error) --- */}
      {loading && prospect && (
        <div className="text-center p-2 text-sm text-blue-500">Refreshing...</div>
      )}
      {error && prospect && (
        <div className="text-center p-2 text-sm text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}

      {/* --- Added motion wrapper to Header --- */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
      >
        <div className="flex items-center gap-4">
          <Link
            to="/prospects"
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Back to Prospects"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 text-center md:text-left">
              Prospect Details
            </h1>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
          <Button
            variant="secondary"
            onClick={onTransferRequest}
            className="bg-secondary hover:bg-secondary text-white w-full"
          >
            <ArrowPathRoundedSquareIcon className="h-4 w-4 mr-2" />
            Transfer to Party
          </Button>
          <Button variant="primary" onClick={onOpenEditModal} className="w-full">
            Edit Prospect
          </Button>
          <Button
            variant="outline"
            onClick={onDeleteRequest}
            className="text-red-600 border-red-300 hover:bg-red-50 focus:ring-red-500 w-full"
          >
            Delete Prospect
          </Button>
        </div>
      </motion.div>

      {/* --- Added motion wrapper to Content Grid --- */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left Column: Prospect Details */}
        <div className="lg:col-span-2 grid grid-cols-1 gap-6">
          {/* Row 1: Main Prospect Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <BuildingStorefrontIcon className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {prospect.name}
                </h2>
                {prospect.latitude && prospect.longitude ? (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
                  >
                    <MapPinIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm hover:underline">{prospect.address}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="text-sm">{prospect.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Prospect Information Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-blue-600" />
              </div>
              Prospect Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
              <div className="flex items-start gap-2">
                <UserIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500 block">Owner Name</span>
                  <span className="text-gray-800">{prospect.ownerName || 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CalendarDaysIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500 block">Date Joined</span>
                  <span className="text-gray-800">{formatDate(prospect.dateJoined)}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500 block">Phone</span>
                  <span className="text-gray-800">{prospect.phone || 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500 block">Email</span>
                  <span className="text-gray-800 break-all">
                    {prospect.email || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <IdentificationIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">PAN/VAT Number</p>
                  <p className=" text-gray-800">
                    {prospect.panVat || 'N/A'}
                  </p>
                </div>
              </div>
              <div className=" flex items-start gap-2">
                <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500 block">Full Address</span>
                  <span className="text-gray-800">{prospect.address}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <GlobeAltIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500 block">Latitude</span>
                  <span className="text-gray-800">
                    {prospect.latitude?.toFixed(6) ?? 'N/A'}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <GlobeAltIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500 block">Longitude</span>
                  <span className="text-gray-800">
                    {prospect.longitude?.toFixed(6) ?? 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                <DocumentTextIcon className="w-4 h-4 text-gray-500" />
                Description
              </h4>
              <p className="text-sm text-gray-600">
                {prospect.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Location Map Card */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPinIcon className="w-4 h-4 text-blue-600" />
              </div>
              Location Map
            </h3>
          </div>

          <div className="flex-1 relative z-0" style={{ minHeight: '400px' }}>
            {prospect.latitude && prospect.longitude ? (
              <StaticMapViewer
                latitude={prospect.latitude}
                longitude={prospect.longitude}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-500 text-sm">Location data not provided</p>
              </div>
            )}
          </div>

          {prospect.latitude && prospect.longitude && (
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
      </motion.div>
    </motion.div>
  );
};

export default ProspectDetailsContent;