// src/Pages/PartyPage/PartyContent.tsx

import React, { useState, useMemo } from 'react';
import PartyCard from '../../components/UI/ProfileCard';
import Button from '../../components/UI/Button/Button';
import { type Party, addParty, type NewPartyData } from '../../api/partyService';
import AddEntityModal, { type NewEntityData } from '../../components/modals/AddEntityModal';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface PartyContentProps {
  data: Party[] | null;
  loading: boolean;
  error: string | null;
  onDataRefresh: () => void;
}

const PartyContent: React.FC<PartyContentProps> = ({
  data,
  loading,
  error,
  onDataRefresh
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ITEMS_PER_PAGE = 12;

  const filteredParty = useMemo(() => {
    if (!data) return [];
    setCurrentPage(1);
    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter(party =>
      (party.ownerName?.toLowerCase() || '').includes(lowerSearchTerm) ||
      (party.companyName?.toLowerCase() || '').includes(lowerSearchTerm)
    );
  }, [data, searchTerm]);

  // Show initial loading state
  if (loading && !data) return <div className="text-center p-10 text-gray-500">Loading Parties...</div>;
  // Show error only if data failed to load
  if (error && !data) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;

  const totalPages = Math.ceil(filteredParty.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentParty = filteredParty.slice(startIndex, endIndex);

  const goToPage = (pageNumber: number) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPages || 1));
    setCurrentPage(newPage);
  };

  const handleAddParty = async (data: NewEntityData) => {
    const newPartyData: NewPartyData = {
        companyName: data.name,
        ownerName: data.ownerName,
        dateJoined: data.dateJoined,
        address: data.address,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        email: data.email,
        phone: data.phone,
        panVat: data.panVat,
    };

    try {
        await addParty(newPartyData);
        onDataRefresh();
        setIsAddModalOpen(false);
    } catch (error) {
        console.error('Error adding party:', error);
        alert(`Failed to add party: ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  return (
     <div className="flex-1 flex flex-col h-full overflow-hidden overflow-x-hidden">
        {/* Show REFRESHING message */}
        {loading && data && <div className="text-center p-2 text-sm text-blue-500">Refreshing...</div>}
        {/* Show error during refresh */}
        {error && data && <div className="text-center p-2 text-sm text-red-600 bg-red-50 rounded">{error}</div>}
        
        {/* Header (flex-shrink-0) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-shrink-0">
          <h1 className="text-3xl font-bold text-[#202224] text-center md:text-left">Parties</h1>
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
           <div className="text-center p-10 text-gray-500">No parties found{searchTerm ? ' matching your search' : ''}.</div>
       ) : (
        <>
            {/* --- FIX: ADDED SCROLLING WRAPPER --- */}
            {/* This div scrolls, the pagination div below does not */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2 md:px-0">

                  {currentParty.map(party => (
                      <PartyCard 
                          key={party.id}
                          id={party.id}
                          basePath="/parties"
                          title={party.companyName}
                          ownerName={party.ownerName}
                          address={party.address}
                          cardType="party"
                      />
                  ))}
                </div>
            </div>
            {/* --- END FIX --- */}


            {/* --- FIX: PAGINATION MOVED OUTSIDE SCROLLING WRAPPER --- */}
            {totalPages > 1 && (
                <div className="flex-shrink-0 flex items-center justify-between mt-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
                    <p>
                        Showing {startIndex + 1} - {Math.min(endIndex, filteredParty.length)} of {filteredParty.length}
                    </p>
                    <div className="flex items-center gap-x-2">
                        {currentPage > 1 && (
                            <Button onClick={() => goToPage(currentPage - 1)} variant="secondary">Previous</Button>
                        )}
                        <span className="font-semibold">{currentPage} / {totalPages}</span>
                        {currentPage < totalPages && (
                            <Button onClick={() => goToPage(currentPage + 1)} variant="secondary">Next</Button>
                        )}
                    </div>
                </div>
            )}
        </>
        )}
        {/* --- END FIX --- */}


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