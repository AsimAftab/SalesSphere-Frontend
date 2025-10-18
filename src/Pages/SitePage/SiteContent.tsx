import React, { useState } from 'react';
import ProfileCard from '../../components/UI/ProfileCard';
import Button from '../../components/UI/Button/Button';
import { type Site } from '../../api/siteService';

interface SiteContentProps {
  data: Site[] | null;
  loading: boolean;
  error: string | null;
}

const SiteContent: React.FC<SiteContentProps> = ({ data, loading, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Handle loading, error, and no data states
  if (loading) return <div className="text-center p-10 text-gray-500">Loading Sites...</div>;
  if (error) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
  if (!data || data.length === 0) return <div className="text-center p-10 text-gray-500">No sites found.</div>;

  // Pagination logic
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSites = data.slice(startIndex, endIndex);

  const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((page) => Math.max(page - 1, 1));

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#202224]">Sites</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currentSites.map(site => (
          <ProfileCard 
            key={site.id}
            basePath="/sites"
            title={site.name}
            subtitle={site.location}
            identifier={site.id} // Use site ID for the link
            imageUrl={site.imageUrl}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-8 text-sm text-gray-600">
        <p>Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length}</p>
        <div className="flex">
          <Button onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</Button>
          <Button onClick={goToNextPage} disabled={currentPage === totalPages} className="ml-2">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default SiteContent;
