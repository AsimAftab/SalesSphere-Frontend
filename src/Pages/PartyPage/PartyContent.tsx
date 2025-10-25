import React, { useState } from 'react';
import PartyCard from '../../components/UI/ProfileCard';
import Button from '../../components/UI/Button/Button';
import { type Party, addParty } from '../../api/partyService';
import AddPartyModal from '../../components/modals/AddPartyModal';
interface PartyContentProps {
  data: Party[] | null;
  loading: boolean;
  error: string | null;
  onDataRefresh: () => void; // 1. Add this new prop
}

const PartyContent: React.FC<PartyContentProps> = ({
  data,
  loading,
  error,
  onDataRefresh // 2. Receive the new prop
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const ITEMS_PER_PAGE = 12;

  // Handle loading state
  if (loading) {
    return <div className="text-center p-10 text-gray-500">Loading Parties...</div>;
  }

  // Handle error state
  if (error) {
    return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
  }

  // Handle no data state
  if (!data || data.length === 0) {
    return <div className="text-center p-10 text-gray-500">No parties found.</div>;
  }

  // Pagination logic
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentParty = data.slice(startIndex, endIndex);

  const goToPage = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
 


  const handleAddParty = async (newParty: any) => {
    try {
      const addedParty = await addParty(newParty);
      console.log('New party added:', addedParty);

      onDataRefresh(); // 3. Call the parent's refresh function
      setIsAddModalOpen(false); // 4. Close the modal

    } catch (error) {
      console.error('Error adding party:', error);
      alert('Failed to add party. Please try again.');
    }
  };

  return (
    <div className="flex-1 flex-col">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-black">Parties</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          Add New Party
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
         {currentParty.map(party => {
          // --- Generate placeholder URL dynamically for each party ---
          const placeholderText = typeof party.companyName === 'string' && party.companyName.length > 0
                                    ? party.companyName.charAt(0).toUpperCase()
                                    : '?';
          // Using the same style as the onError handler in ProfileCard
          const dynamicImageUrl = `https://placehold.co/80x80/3799cc/FFFFFF?text=${placeholderText}`;

          return (
            <PartyCard
              key={party.id}
              id={party.id}
              basePath="/parties"
              title={party.companyName}
              ownerName={party.ownerName}
              address={party.address}
              // --- Pass the dynamically generated placeholder URL ---
              imageUrl={dynamicImageUrl}
            />
          );
        })}
      </div>
      
      {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
                    <p>Showing {startIndex + 1} - {Math.min(endIndex, data.length)} of {data.length}</p>
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


