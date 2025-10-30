import React, { useState, useMemo } from 'react';
import PartyCard from '../../components/UI/ProfileCard';
import Button from '../../components/UI/Button/Button';
import { type Party, type NewPartyData } from '../../api/partyService'; // Keep types
import AddEntityModal, { type NewEntityData } from '../../components/modals/AddEntityModal';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
// We no longer need toast here

interface PartyContentProps {
  data: Party[] | null;
  loading: boolean;
  error: string | null;
  // onDataRefresh: () => void; // <-- 1. REMOVED UNUSED PROP
  // --- NEW PROPS from parent ---
  onSaveParty: (data: NewPartyData) => void;
  isCreating: boolean;
}

// Helper function (unchanged)
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

const PartyContent: React.FC<PartyContentProps> = ({
  data,
  loading,
  error,
  // onDataRefresh, // <-- 2. REMOVED UNUSED PROP
  onSaveParty,
  isCreating,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ITEMS_PER_PAGE = 12;

  const filteredParty = useMemo(() => {
    if (!data) return [];
    setCurrentPage(1);
    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter(
      (party) =>
        (party.ownerName?.toLowerCase() || '').includes(lowerSearchTerm) ||
        (party.companyName?.toLowerCase() || '').includes(lowerSearchTerm)
    );
  }, [data, searchTerm]);

  // (Loading/Error/Data checks are unchanged)
  if (loading && !data)
    return <div className="text-center p-10 text-gray-500">Loading Parties...</div>;
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

  // --- 3. MADE FUNCTION ASYNC TO MATCH MODAL'S EXPECTED TYPE ---
  const handleAddParty = async (data: NewEntityData) => {
    const newPartyData: NewPartyData = {
      companyName: data.name,
      ownerName: data.ownerName,
      dateJoined: data.dateJoined,
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
    // This function now implicitly returns Promise<void>
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden overflow-x-hidden">
      {/* Show REFRESHING message (now uses useQuery's loading state) */}
      {loading && data && (
        <div className="text-center p-2 text-sm text-blue-500">Refreshing...</div>
      )}
      {/* Show error during refresh */}
      {error && data && (
        <div className="text-center p-2 text-sm text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}

      {/* Show "Creating" overlay (now uses useMutation's loading state) */}
      {isCreating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[9999]">
          <div className="flex flex-col items-center bg-white px-8 py-6 rounded-lg shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="mt-3 text-gray-800 font-semibold">Creating party...</span>
          </div>
        </div>
      )}

      {/* Header (flex-shrink-0) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-shrink-0">
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
            <Button onClick={() => setIsAddModalOpen(true)} className="w-full md:w-auto">
              Add New Party
            </Button>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      {filteredParty.length === 0 && !loading ? (
        <div className="text-center p-10 text-gray-500">
          No parties found{searchTerm ? ' matching your search' : ''}.
        </div>
      ) : (
        <>
          {/* This div scrolls, the pagination div below does not */}
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

          {/* --- PAGINATION MOVED OUTSIDE SCROLLING WRAPPER --- */}
          {totalPages > 1 && (
            <div className="flex-shrink-0 flex items-center justify-between mt-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
              <p>
                Showing {startIndex + 1} - {Math.min(endIndex, filteredParty.length)} of{' '}
                {filteredParty.length}
              </p>
              <div className="flex items-center gap-x-2">
                {currentPage > 1 && (
                  <Button onClick={() => goToPage(currentPage - 1)} variant="secondary">
                    Previous
                  </Button>
                )}
                <span className="font-semibold">
                  {currentPage} / {totalPages}
                </span>
                {currentPage < totalPages && (
                  <Button onClick={() => goToPage(currentPage + 1)} variant="secondary">
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}

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
    </div>
  );
};

export default PartyContent;