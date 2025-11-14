import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom'; // Make sure this is imported
import PartyCard from '../../components/UI/ProfileCard';
import Button from '../../components/UI/Button/Button';
import { type Party, type NewPartyData } from '../../api/partyService';
import AddEntityModal, { type NewEntityData } from '../../components/modals/AddEntityModal';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface PartyContentProps {
  data: Party[] | null;
  loading: boolean;
  error: string | null;
  onSaveParty: (data: NewPartyData) => void;
  isCreating: boolean;
}

// --- 1. RE-ADDED THIS FUNCTION ---
const formatAddress = (fullAddress: string | undefined | null): string => {
  if (!fullAddress) {
    return 'Address not available';
  }
  const parts = fullAddress.split(',').map((part) => part.trim());
  if (parts.length > 2) {
    const desiredParts = parts.slice(1, 3);
    return desiredParts.join(', ');
  } else if (parts.length === 2) {
    return parts[1];
  } else {
    return fullAddress;
  }
};

const isToday = (dateStr: string) => {
  if (!dateStr) return false;
  try {
    const date = new Date(dateStr);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  } catch (e) {
    return false;
  }
};

// Animation Variants
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
const PartyContentSkeleton: React.FC = () => {
  const ITEMS_PER_PAGE = 12;

  return (
    <SkeletonTheme baseColor="#e6e6e6" highlightColor="#f0f0f0">
      <div className="flex-1 flex flex-col h-full overflow-hidden overflow-x-hidden">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-shrink-0">
          <h1 className="text-3xl font-bold">
            <Skeleton width={120} height={36} />
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
            <Skeleton height={40} width={256} borderRadius={999} />
            <Skeleton height={40} width={160} borderRadius={8} />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2 md:px-0">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-start min-h-[180px]"
              >
                {/* Avatar */}
                <div className="mb-3 pt-2 flex justify-center w-full">
                  <Skeleton
                    containerClassName="w-full flex justify-center"
                    width={64}
                    height={64}
                    style={{ borderRadius: '50%', display: 'block' }}
                  />
                </div>

                {/* Text Details */}
                <div className="flex flex-col items-center w-full space-y-1 pb-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="w-full flex justify-center">
                      <Skeleton
                        containerClassName="w-full"
                        height={14}
                        style={{
                          display: 'block',
                          width: '100%', // same width for all
                          borderRadius: '6px',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex-shrink-0 flex items-center justify-between mt-6 text-sm pt-4 border-t border-gray-200">
          <Skeleton width={150} height={18} />
          <div className="flex items-center gap-x-2">
            <Skeleton width={80} height={36} borderRadius={8} />
            <Skeleton width={80} height={36} borderRadius={8} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

const PartyContent: React.FC<PartyContentProps> = ({
  data,
  loading,
  error,
  onSaveParty,
  isCreating,
}) => {
  // All state and logic
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ITEMS_PER_PAGE = 12;
  const location = useLocation();

  const filterParam = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('filter');
  }, [location.search]);

  // This filter logic is NOW CORRECT because mapApiToFrontend maps
  // 'dateJoined' to 'dateCreated'. So we filter on 'dateCreated'.
  const filteredParty = useMemo(() => {
    if (!data) return [];

    let filteredData = [...data]; // Start with all data

    // 1. Apply URL filter (e.g., ?filter=today)
    if (filterParam === 'today') {
      filteredData = filteredData.filter((party) =>
        isToday(party.dateCreated), // This is correct
      );
    }

    // 2. Apply search term filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredData = filteredData.filter(
        (party) =>
          (party.ownerName?.toLowerCase() || '').includes(lowerSearchTerm) ||
          (party.companyName?.toLowerCase() || '').includes(lowerSearchTerm),
      );
    }

    return filteredData;
  }, [data, searchTerm, filterParam]);
  // --- END OF CORRECTION ---

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterParam]);

  if (loading && !data) {
    return <PartyContentSkeleton />;
  }

  if (error && !data)
    return (
      <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    );

  const totalPages = Math.ceil(filteredParty.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentParty = filteredParty.slice(startIndex, endIndex);

  const goToPage = (pageNumber: number) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPages || 1));
    setCurrentPage(newPage);
  };

  const handleAddParty = async (data: NewEntityData) => {
    // Assumes NewEntityData from modal might have 'dateJoined'
    const newPartyData: NewPartyData = {
      companyName: data.name,
      ownerName: data.ownerName,
      dateJoined: data.dateJoined || new Date().toISOString(), // <-- FIX: Changed from dateCreated
      address: data.address,
      email: data.email ?? '',
      phone: data.phone ?? '',
      panVat: data.panVat ?? '',
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      description: data.description ?? '',
    };
    onSaveParty(newPartyData);
    setIsAddModalOpen(false);
  };

  return (
    <motion.div
      className="flex-1 flex flex-col h-full overflow-hidden overflow-x-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Overlays */}
      {loading && data && (
        <div className="text-center p-2 text-sm text-blue-500">
          Refreshing...
        </div>
      )}
      {error && data && (
        <div className="text-center p-2 text-sm text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}
      {isCreating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[9999]">
          <div className="flex flex-col items-center bg-white px-8 py-6 rounded-lg shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="mt-3 text-gray-800 font-semibold">
              Creating party...
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-shrink-0"

      >
        <h1 className="text-3xl font-bold text-[#202224] text-center md:text-left">
          Parties
        </h1>
        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-gray-500" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Name or Owner "
              className="block h-10 w-full md:w-64 border-transparent bg-gray-200 py-0 pl-10 pr-3 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-sm rounded-full"
            />
          </div>
          <div className="flex justify-center w-full md:w-auto">
             <Button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full md:w-auto"
            >
              Add New Party

            </Button>
          </div>
        </div>
      </motion.div>

      {/* Content Area */}
      <motion.div
        variants={itemVariants}
        className="flex-1 flex flex-col overflow-hidden"

      >
        {filteredParty.length === 0 && !loading ? (
          <div className="text-center p-10 text-gray-500">
            No parties found
            {filterParam === 'today'
              ? ' created today'
              : searchTerm
              ? ' matching your search'

              : ''}
            .
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6">

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2 md:px-0">
                {currentParty.map((party) => (
                  <PartyCard
                    key={party.id}
                    id={party.id}
                    basePath="/parties"
                    title={party.companyName}
                     ownerName={party.ownerName}
                    address={formatAddress(party.address)}
                    cardType="party"
                  />
                ))}

              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex-shrink-0 flex items-center justify-between mt-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
                <p>
                  Showing {startIndex + 1} -{' '}
                   {Math.min(endIndex, filteredParty.length)} of{' '}
                  {filteredParty.length}
                </p>
                <div className="flex items-center gap-x-2">
                  {currentPage > 1 && (
                    <Button
                       onClick={() => goToPage(currentPage - 1)}
                      variant="secondary"
                    >
                      Previous

                    </Button>
                  )}
                  <span className="font-semibold">
                    {currentPage} / {totalPages}
                  </span>
                  {currentPage < totalPages && (
                    <Button
                    onClick={() => goToPage(currentPage + 1)}
                      variant="secondary"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Add Party Modal */}
      <AddEntityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddParty}
        title="Add New Party"
        nameLabel="Party Name"
        ownerLabel="Owner Name"
        panVatMode="required"
  
      namePlaceholder="Enter party name"
        ownerPlaceholder="Enter owner name"
      />
    </motion.div>
  );
};

export default PartyContent;