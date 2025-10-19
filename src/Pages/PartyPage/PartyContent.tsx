import React, { useState } from 'react';
import PartyCard from '../../components/UI/ProfileCard';
import Button from '../../components/UI/Button/Button';
import { type Party } from '../../api/partyService';

interface PartyContentProps {
  data: Party[] | null;
  loading: boolean;
  error: string | null;
}

const PartyContent: React.FC<PartyContentProps> = ({ data, loading, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
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

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-black">Parties</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currentParty.map(party => (
          <PartyCard
            key={party.email}
            basePath="/parties"
            title={party.name}
            subtitle={party.designation}
            identifier={party.email}
            imageUrl={party.imageUrl}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-8 text-sm text-gray-600">
        <p>
          Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length}
        </p>
        {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 text-sm text-gray-600">
          <div className="flex items-center gap-x-2">
            {/* FIX: "Previous" button only appears when not on the first page */}
            {currentPage > 1 && (
              <Button onClick={goToPreviousPage}>Previous</Button>
            )}
            {/* FIX: "Next" button only appears when not on the last page */}
            {currentPage < totalPages && (
              <Button onClick={goToNextPage}>Next</Button>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default PartyContent;

