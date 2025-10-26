import React, { useState } from 'react';
import PartyCard from '../../components/UI/ProfileCard'; 
import Button from '../../components/UI/Button/Button';
import { type Party, addParty } from '../../api/partyService'; 
import AddPartyModal from '../../components/modals/AddPartyModal';

interface PartyContentProps {
  data: Party[] | null;
  loading: boolean;
  error: string | null;
  onDataRefresh: () => void; // Function passed from PartyPage to refresh data
}

const PartyContent: React.FC<PartyContentProps> = ({
  data,
  loading,
  error,
  onDataRefresh
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const ITEMS_PER_PAGE = 12;

  // Show loading only on initial load
  if (loading && !data) {
    return <div className="text-center p-10 text-gray-500">Loading Parties...</div>;
  }

  // Show full error only on initial load error
  if (error && !data) {
    return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
  }

  const parties = data || []; // Use empty array if data is null/undefined

  // Pagination logic
  const totalPages = Math.ceil(parties.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentParty = parties.slice(startIndex, endIndex);

  const goToPage = (pageNumber: number) => {
        const newPage = Math.max(1, Math.min(pageNumber, totalPages || 1));
        setCurrentPage(newPage);
    };

  const handleAddParty = async (newPartyData: Omit<Party, 'id'>) => { // Use specific type if available
    try {
      const addedParty = await addParty(newPartyData);
      console.log('New party added:', addedParty);
      onDataRefresh(); // Refresh the list in the parent component
      setIsAddModalOpen(false); // Close the modal
      // Optional: Show success toast
    } catch (error) {
      console.error('Error adding party:', error);
      alert(`Failed to add party: ${error instanceof Error ? error.message : 'Please try again.'}`); // Replace with toast
    }
  };

  return (
    <div className="flex-1 flex flex-col">
       {/* Show subsequent loading/error messages */}
       {loading && data && <div className="text-center p-2 text-sm text-blue-500">Refreshing...</div>}
       {error && data && <div className="text-center p-2 text-sm text-red-600 bg-red-50 rounded">{error}</div>}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-black">Parties</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          Add New Party
        </Button>
      </div>

       {parties.length === 0 && !loading ? (
            <div className="text-center p-10 text-gray-500">No parties found.</div>
       ) : (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentParty.map(party => (
                    <PartyCard // This should be ProfileCard component
                        key={party.id}
                        id={party.id}
                        basePath="/parties"
                        title={party.companyName}
                        ownerName={party.ownerName}
                        address={party.address}
                        imageUrl={party.imageUrl} // Pass actual URL or null/undefined
                        cardType="party" // Pass the required cardType prop
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
                    <p>Showing {startIndex + 1} - {Math.min(endIndex, parties.length)} of {parties.length}</p>
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

      {/* Add Party Modal */}
      <AddPartyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddParty}
      />
    </div>
  );
};

export default PartyContent;