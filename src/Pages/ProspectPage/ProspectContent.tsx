import React, { useState } from 'react';
import ProfileCard from '../../components/UI/ProfileCard';
import Button from '../../components/UI/Button/Button';
import { type Prospect, addProspect, type NewProspectData } from '../../api/services/prospect/prospectService';
import AddProspectModal from '../../components/modals/AddProspectModal';

interface ProspectContentProps {
  data: Prospect[] | null;
  loading: boolean;
  error: string | null;
  onDataRefresh: () => void;
}

const ProspectContent: React.FC<ProspectContentProps> = ({
    data,
    loading,
    error,
    onDataRefresh
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (loading && !data) {
    return <div className="text-center p-10 text-gray-500">Loading Prospects...</div>;
  }
  if (error && !data) {
    return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
  }

  const prospects = data || [];
  const totalPages = Math.ceil(prospects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProspects = prospects.slice(startIndex, endIndex);

   const goToPage = (pageNumber: number) => {
        const newPage = Math.max(1, Math.min(pageNumber, totalPages || 1));
        setCurrentPage(newPage);
    };

  const handleAddProspect = async (newProspectData: NewProspectData) => {
    try {
      const addedProspect = await addProspect(newProspectData);
      console.log('New prospect added:', addedProspect);
      onDataRefresh();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding prospect:', error);
      alert(`Failed to add prospect: ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {loading && data && <div className="text-center p-2 text-sm text-blue-500">Refreshing...</div>}
      {error && data && <div className="text-center p-2 text-sm text-red-600 bg-red-50 rounded">{error}</div>}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-black">Prospects</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
            Add New Prospect
        </Button>
      </div>

      {prospects.length === 0 && !loading ? (
           <div className="text-center p-10 text-gray-500">No prospects found.</div>
      ) : (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentProspects.map(prospect => (
                    <ProfileCard
                        key={prospect.id} // Use new stable ID
                        id={prospect.id}
                        basePath="/prospects"
                        // --- MODIFIED: Pass Party-like props ---
                        title={prospect.name} // "Prospect Name" / "Company Name"
                        ownerName={prospect.ownerName}
                        address={prospect.address}
                        // ---
                        imageUrl={prospect.imageUrl} // Pass URL (ProfileCard will show initial)
                        cardType="prospect"
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
                    <p>Showing {startIndex + 1}-{Math.min(endIndex, prospects.length)} of {prospects.length}</p>
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

      {/* Add Prospect Modal */}
      <AddProspectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddProspect}
      />
    </div>
  );
};

export default ProspectContent;
