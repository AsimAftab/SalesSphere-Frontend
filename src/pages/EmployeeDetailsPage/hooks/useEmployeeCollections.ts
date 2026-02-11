import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCollections, type Collection } from '@/api/collectionService';

export const useEmployeeCollections = (employeeId: string | undefined, searchQuery: string = '') => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch all collections - Query key matches CollectionPage for cache sharing
    const { data: allCollections = [], isLoading, error } = useQuery({
        queryKey: ['collections'],
        queryFn: () => getCollections(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Client-side filtering for this employee (by createdBy)
    const employeeCollections = useMemo(() => {
        if (!allCollections || !employeeId) return [];

        let filtered = allCollections.filter((collection: Collection) =>
            collection.createdBy?._id === employeeId
        );

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(collection =>
                collection.partyName.toLowerCase().includes(lowerQuery) ||
                collection.paymentMode.toLowerCase().includes(lowerQuery)
            );
        }

        return filtered.sort((a: Collection, b: Collection) =>
            new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime()
        );
    }, [allCollections, employeeId, searchQuery]);

    // Pagination Logic
    const paginatedCollections = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return employeeCollections.slice(startIndex, startIndex + itemsPerPage);
    }, [employeeCollections, currentPage, itemsPerPage]);

    // Total Amount
    const totalAmount = useMemo(() => {
        return employeeCollections.reduce((sum: number, collection: Collection) => sum + (collection.paidAmount || 0), 0);
    }, [employeeCollections]);

    return {
        collections: paginatedCollections,
        totalCollections: employeeCollections.length,
        totalAmount,
        isLoading,
        error: error ? (error as Error).message : null,
        currentPage,
        itemsPerPage,
        setCurrentPage,
    };
};
