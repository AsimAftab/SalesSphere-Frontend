import React, { useState } from 'react';
import ProfileCard from '../../components/UI/ProfileCard';
import Button from '../../components/UI/Button/Button';
import { type Site, addSite, type NewSiteData } from '../../api/siteService';
import AddSiteModal from '../../components/modals/AddSiteModal'; 

interface SiteContentProps {
  data: Site[] | null;
  loading: boolean;
  error: string | null;
  onDataRefresh: () => void;
}

const SiteContent: React.FC<SiteContentProps> = ({
    data,
    loading,
    error,
    onDataRefresh
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (loading && !data) return <div className="text-center p-10 text-gray-500">Loading Sites...</div>;
  if (error && !data) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;

  const sites = data || [];
  const totalPages = Math.ceil(sites.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSites = sites.slice(startIndex, endIndex);

  const goToPage = (pageNumber: number) => {
        const newPage = Math.max(1, Math.min(pageNumber, totalPages || 1));
        setCurrentPage(newPage);
    };

  const handleAddSite = async (newSiteData: NewSiteData) => {
    try {
      const addedSite = await addSite(newSiteData);
      console.log('New site added:', addedSite);
      onDataRefresh();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding site:', error);
      alert(`Failed to add site: ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
        {loading && data && <div className="text-center p-2 text-sm text-blue-500">Refreshing...</div>}
        {error && data && <div className="text-center p-2 text-sm text-red-600 bg-red-50 rounded">{error}</div>}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#202224]">Sites</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
            Add New Site
        </Button>
      </div>

      {sites.length === 0 && !loading ? (
           <div className="text-center p-10 text-gray-500">No sites found.</div>
      ) : (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentSites.map(site => (
                <ProfileCard
                  key={site.id}
                  basePath="/sites"
                  id={site.id}
                  // --- MODIFIED: Pass Party-like props ---
                  title={site.name}
                  ownerName={site.ownerName}
                  address={site.address}
                  // ---
                  imageUrl={site.imageUrl}
                  cardType="site"
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
                    <p>Showing {startIndex + 1}-{Math.min(endIndex, sites.length)} of {sites.length}</p>
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

      {/* Add Site Modal */}
      <AddSiteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSite}
      />
    </div>
  );
};

export default SiteContent;
