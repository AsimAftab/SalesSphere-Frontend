// src/pages/sites/SiteContent.tsx

import React, { useState, useMemo } from 'react';
import ProfileCard from '../../components/UI/ProfileCard';
import Button from '../../components/UI/Button/Button';
// --- 1. Import correct Site types ---
import { type Site, addSite, type NewSiteData } from '../../api/siteService';
// --- 2. Import the new reusable modal and its data type ---
import AddEntityModal, { type NewEntityData } from '../../components/modals/AddEntityModal';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ITEMS_PER_PAGE = 12;

  const filteredSite = useMemo(() => {
    if (!data) return [];
    setCurrentPage(1);
    const lowerSearchTerm = searchTerm.toLowerCase();
    // --- 3. Fix filter logic ---
    return data.filter(site =>
      (site.ownerName?.toLowerCase() || '').includes(lowerSearchTerm) || // Use ownerName (or manager if type changed)
      (site.name?.toLowerCase() || '').includes(lowerSearchTerm) ||
      (site.address?.toLowerCase() || '').includes(lowerSearchTerm) // Use address (or location if type changed)
    );
  }, [data, searchTerm]);

  // Handle loading/error states
  if (loading && !data) return <div className="text-center p-10 text-gray-500">Loading Sites...</div>;
  if (error && !data) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
  // Don't show "No Site found" during a refresh

  const totalPages = Math.ceil(filteredSite.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSite = filteredSite.slice(startIndex, endIndex);

  const goToPage = (pageNumber: number) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPages || 1));
    setCurrentPage(newPage);
  };

  // --- 4. Update handleAddSite to be an "Adapter" ---
  // It receives generic 'data' from the modal and maps it to 'NewSiteData'
  const handleAddSite = async (data: NewEntityData) => {
    try {
        // Map generic modal data to the specific NewSiteData type
        const newSiteData: NewSiteData = {
            name: data.name, // Modal uses 'companyName', Site API uses 'name'
            ownerName: data.ownerName,
            dateJoined: data.dateJoined,
            address: data.address,
            description: data.description,
            latitude: data.latitude,
            longitude: data.longitude,
            email: data.email ?? '', // <-- FIX: Provide fallback
            phone: data.phone ?? '', // <-- FIX: Provide fallback
            // panVat is omitted as it's not in NewSiteData
        };

        await addSite(newSiteData);
        onDataRefresh();
        setIsAddModalOpen(false);
    } catch (error) {
        console.error('Error adding site:', error);
        alert(`Failed to add site: ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  return (
     <div className="flex-1 flex flex-col h-full overflow-hidden overflow-x-hidden">
        {/* Show subsequent loading/error messages */}
        {loading && data && <div className="text-center p-2 text-sm text-blue-500">Refreshing...</div>}
        {error && data && <div className="text-center p-2 text-sm text-red-600 bg-red-50 rounded">{error}</div>}
        
        {/* Header (already responsive) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-shrink-0">
          <h1 className="text-3xl font-bold text-[#202224] text-center md:text-left">Sites</h1>
            <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
              <div className="relative">
                <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-gray-500" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by Name or Owner" // Updated placeholder
                   className="block h-10 w-full md:w-64 border-transparent bg-gray-200 py-0 pl-10 pr-3 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-sm rounded-full"
                />
              </div>
              {/* Added responsive wrapper for button */}
              <div className="flex justify-center w-full md:w-auto">
                  <Button onClick={() => setIsAddModalOpen(true)} className="w-full md:w-auto">
                      Add New Site
                  </Button>
              </div>
            </div>
        </div>

        {/* Show "No site found" only if not loading AND filtered list is empty */}
        {!loading && filteredSite.length === 0 ? (
           <div className="text-center p-10 text-gray-500">No sites found{searchTerm ? ' matching your search' : ''}.</div>
       ) : (
        <>
            {/* --- 5. Added scrolling wrapper for grid --- */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6">

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2 md:px-0">
                  {currentSite.map(site => (
                    <ProfileCard
                      key={site.id}
                      basePath="/sites"
                      id={site.id}
                      title={site.name}
                      ownerName={site.ownerName} // Or site.manager?
                      address={site.address}   // Or site.location?
                      cardType="site"
                    />
                  ))}
                </div>
            </div>

            {/* --- 6. Made pagination responsive --- */}
            {totalPages > 1 && (
                <div className="flex-shrink-0 flex items-center justify-between mt-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
                    <p>
                        Showing {startIndex + 1} - {Math.min(endIndex, filteredSite.length)} of {filteredSite.length}
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


        {/* --- 7. Replaced AddSiteModal with AddEntityModal --- */}
        <AddEntityModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleAddSite}
            title="Add New Site"
            nameLabel="Site Name"
            ownerLabel="Owner Name" // Or "Manager Name"
            panVatMode="hidden" // Hides the PAN/VAT field
            namePlaceholder="e.g., Main Warehouse"
            ownerPlaceholder="Enter site owner/manager name"
        />
     </div>
  );
};

export default SiteContent;