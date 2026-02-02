import React, { useState } from 'react';
import PartyCollectionsTable from './PartyCollectionsTable';
import { PartyCollectionsMobileList } from './PartyCollectionsMobileList';
import collectionIcon from '@/assets/images/icons/collection.svg';
import type { Collection } from '@/api/collectionService';
import { Pagination, EmptyState } from '@/components/ui';

interface PartyCollectionsTabProps {
    collections: Collection[];
    partyName: string;
    partyId: string;
}

export const PartyCollectionsTab: React.FC<PartyCollectionsTabProps> = ({ collections, partyName, partyId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalCollections = collections.length;

    // Empty State Check
    if (totalCollections === 0) {
        return (
            <EmptyState
                title="No Collections Found"
                description={`No collections have been recorded for ${partyName} yet.`}
                icon={
                    <img
                        src={collectionIcon}
                        alt="No Collections"
                        className="w-16 h-16"
                    />
                }
            />
        );
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCollections = collections.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="flex flex-col h-full space-y-4">
            <h2 className="text-xl font-bold text-gray-800 px-1">{partyName}</h2>
            <div className="relative w-full space-y-4">
                {/* Collections Table - Desktop */}
                <PartyCollectionsTable collections={currentCollections} startIndex={startIndex} partyId={partyId} />

                {/* Mobile List View */}
                <PartyCollectionsMobileList collections={currentCollections} partyId={partyId} />

                {totalCollections > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalCollections}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        className="w-full"
                    />
                )}
            </div>
        </div>
    );
};
