import React, { useState, useMemo } from 'react';
import ProfileCard from '../../components/UI/ProfileCard';
import Button from '../../components/UI/Button/Button';
// Import types only
import { type Prospect, type NewProspectData } from '../../api/prospectService'; 
import AddEntityModal, { type NewEntityData } from '../../components/modals/AddEntityModal';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react'; // <-- Import Loader
// Removed toast import

interface ProspectContentProps {
  data: Prospect[] | null;
  loading: boolean;
  error: string | null;
  // --- NEW PROPS from parent ---
  onSaveProspect: (data: NewProspectData) => void;
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
// --- END OF HELPER FUNCTION ---

const ProspectContent: React.FC<ProspectContentProps> = ({
  data,
  loading,
  error,
  onSaveProspect, // Get mutation function from props
  isCreating, // Get mutation loading state from props
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ITEMS_PER_PAGE = 12;

  const filteredProspect = useMemo(() => {
    if (!data) return [];
    setCurrentPage(1);
    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter(
      (prospect) =>
        (prospect.ownerName?.toLowerCase() || '').includes(lowerSearchTerm) ||
        (prospect.name?.toLowerCase() || '').includes(lowerSearchTerm)
    );
  }, [data, searchTerm]);

  // Handle loading/error states (unchanged)
  if (loading && !data)
    return <div className="text-center p-10 text-gray-500">Loading Prospects...</div>;
  if (error && !data)
    return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;

  const totalPages = Math.ceil(filteredProspect.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProspect = filteredProspect.slice(startIndex, endIndex);

  const goToPage = (pageNumber: number) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPages || 1));
    setCurrentPage(newPage);
  };

  // --- SIMPLIFIED 'handleAddProspect' FUNCTION ---
  // Made async to match the modal's 'onSave' prop type
  const handleAddProspect = async (data: NewEntityData) => {
    const newProspectData: NewProspectData = {
      name: data.name,
      ownerName: data.ownerName,
      dateJoined: data.dateJoined,
      address: data.address,
      description: data.description ?? undefined,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      email: data.email ?? '',
      phone: data.phone ?? '',
      panVat: data.panVat ?? undefined,
    };

    // Call the mutation function from the parent
    // The parent handles success/error toasts and data refreshing
    onSaveProspect(newProspectData);
    
    // We can close the modal immediately
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden overflow-x-hidden">
      {/* Show subsequent loading/error messages */}
      {loading && data && (
        <div className="text-center p-2 text-sm text-blue-500">Refreshing...</div>
      )}
      {error && data && (
        <div className="text-center p-2 text-sm text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}
      
      {/* --- ADDED SPINNER OVERLAY --- */}
      {isCreating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[9999]">
          <div className="flex flex-col items-center bg-white px-8 py-6 rounded-lg shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="mt-3 text-gray-800 font-semibold">Creating prospect...</span>
          </div>
        </div>
      )}

      {/* Header (flex-shrink-0 to prevent shrinking) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-shrink-0">
        <h1 className="text-3xl font-bold text-[#202224] text-center md:text-left">
          Prospects
        </h1>
        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-gray-500" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder=" Search by Name or Owner "
              className="block h-10 w-full md:w-64 border-transparent bg-gray-200 py-0 pl-10 pr-3 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-sm rounded-full"
            />
          </div>
          <div className="flex justify-center w-full md:w-auto">
            <Button onClick={() => setIsAddModalOpen(true)} className="w-full md:w-auto">
              Add New Prospect
            </Button>
          </div>
        </div>
      </div>

      {/* Show "No prospect found" only if not loading and filtered list is empty */}
      {!loading && filteredProspect.length === 0 ? (
        <div className="text-center p-10 text-gray-500">
          No prospects found{searchTerm ? ' matching your search' : ''}.
        </div>
      ) : (
        <>
          {/* This div will scroll, leaving header and pagination fixed */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2 md:px-0">
              {currentProspect.map((prospect) => (
                <ProfileCard
                  key={prospect.id}
                  id={prospect.id}
                  basePath="/prospects"
                  title={prospect.name}
                  ownerName={prospect.ownerName}
                  address={formatAddress(prospect.address)}
                  cardType="prospect"
                />
              ))}
            </div>
          </div>

          {/* PAGINATION MOVED OUTSIDE SCROLLING WRAPPER */}
          {totalPages > 1 && (
            <div className="flex-shrink-0 flex items-center justify-between mt-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
              <p>
                Showing {startIndex + 1} - {Math.min(endIndex, filteredProspect.length)} of{' '}
                {filteredProspect.length}
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

      {/* Add Prospect Modal */}
      <AddEntityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddProspect}
        title="Add New Prospect"
        nameLabel="Prospect Name"
        ownerLabel="Owner Name"
        panVatMode="optional" // Set to 'optional'
        namePlaceholder="Enter prospect name"
        ownerPlaceholder="Enter owner name"
      />
    </div>
  );
};

export default ProspectContent;