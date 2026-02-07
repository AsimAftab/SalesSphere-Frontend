import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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

    // Header Component
    const TabHeader = () => (
        <div className="flex items-center gap-4 mb-6">
            <Link to="/parties" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
                {partyName || 'Party'} - Collections List
            </h1>
        </div>
    );

    // Empty State Check
    if (totalCollections === 0) {
        return (
            <div className="flex flex-col h-full py-4 md:py-6 space-y-4">
                <TabHeader />
                <EmptyState
                    title="No Collections Found"
                    description={`No collections have been recorded for ${partyName} yet.`}
                    icon={
                        <img
                            src={collectionIcon}
                            alt="No Collections"
                            className="w-12 h-12"
                        />
                    }
                />
            </div>
        );
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCollections = collections.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="flex flex-col h-full py-4 md:py-6 space-y-4 overflow-y-auto">
            <TabHeader />
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
