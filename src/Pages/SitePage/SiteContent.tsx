// src/pages/sites/SiteContent.tsx

import React, { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ProfileCard from '../../components/UI/ProfileCard';
import Button from '../../components/UI/Button/Button';
// 1. Import types and functions from the new, aligned service
import { type Site, addSite, type NewSiteData } from '../../api/siteService';
import AddEntityModal, { type NewEntityData } from '../../components/modals/AddEntityModal';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface SiteContentProps {
    data: Site[] | null;
    loading: boolean;
    error: string | null;
}

const SiteContent: React.FC<SiteContentProps> = ({
    data,
    loading,
    error,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const ITEMS_PER_PAGE = 12;

    const queryClient = useQueryClient();

    // 2. Define the mutation using the new 'addSite' function
    const addSiteMutation = useMutation({
        mutationFn: addSite, // Use the new addSite function
        onSuccess: () => {
            toast.success('Site added successfully!');
            queryClient.invalidateQueries({ queryKey: ['sites'] });
            setIsAddModalOpen(false);
        },
        onError: (err: Error) => {
            toast.error(err.message || 'Failed to add site.');
        },
    });

    // 3. Update filter logic to match the new flat 'Site' type
    const filteredSite = useMemo(() => {
        if (!data) return [];
        setCurrentPage(1);
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        return data.filter(site =>
            (site.ownerName?.toLowerCase() || '').includes(lowerSearchTerm) ||
            (site.name?.toLowerCase() || '').includes(lowerSearchTerm) || // Use 'name'
            (site.address?.toLowerCase() || '').includes(lowerSearchTerm) // Use 'address'
        );
    }, [data, searchTerm]);

    // Handle loading/error states
    if (loading && !data) return <div className="text-center p-10 text-gray-500">Loading Sites...</div>;
    if (error && !data) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;

    const totalPages = Math.ceil(filteredSite.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentSite = filteredSite.slice(startIndex, endIndex);

    const goToPage = (pageNumber: number) => {
        const newPage = Math.max(1, Math.min(pageNumber, totalPages || 1));
        setCurrentPage(newPage);
    };

    // 4. Update the adapter function to map modal data to the new FLAT NewSiteData type
    const handleAddSite = async (data: NewEntityData) => {
        try {
            // Map generic modal data to the specific flat NewSiteData type
            // The service will handle mapping this flat object to the nested API payload
            const newSiteData: NewSiteData = {
                name: data.name, // Modal 'name' -> 'name'
                ownerName: data.ownerName,
                dateJoined: data.dateJoined,
                phone: data.phone ?? '', // No longer nested
                email: data.email ?? '', // No longer nested
                address: data.address, // No longer nested
                latitude: data.latitude ?? 0, // No longer nested
                longitude: data.longitude ?? 0, // No longer nested
                description: data.description ?? '', // ADDED
            };
            
            addSiteMutation.mutate(newSiteData);

        } catch (error) {
            console.error('Error preparing site data:', error);
            toast.error(`Invalid site data: ${error instanceof Error ? error.message : 'Please check fields.'}`);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden overflow-x-hidden">
            {addSiteMutation.isPending && (
                <div className="text-center p-2 text-sm text-blue-500">Adding site...</div>
            )}
            
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-shrink-0">
                <h1 className="text-3xl font-bold text-[#202224] text-center md:text-left">Sites</h1>
                <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
                    <div className="relative">
                        <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-gray-500" />
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Name, Owner, or Address"
                            className="block h-10 w-full md:w-64 border-transparent bg-gray-200 py-0 pl-10 pr-3 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-sm rounded-full"
                        />
                    </div>
                    <div className="flex justify-center w-full md:w-auto">
                        <Button onClick={() => setIsAddModalOpen(true)} className="w-full md:w-auto">
                            Add New Site
                        </Button>
                    </div>
                </div>
            </div>

            {!loading && filteredSite.length === 0 ? (
                <div className="text-center p-10 text-gray-500">No sites found{searchTerm ? ' matching your search' : ''}.</div>
            ) : (
            <>
                <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2 md:px-0">
                        
                        {/* 5. Update ProfileCard props to match the new flat 'Site' type */}
                        {currentSite.map(site => (
                            <ProfileCard
                                key={site.id} // Use 'id'
                                basePath="/sites"
                                id={site.id} // Use 'id'
                                title={site.name} // Use 'name'
                                ownerName={site.ownerName}
                                address={site.address} // Use 'address'
                                cardType="site"
                            />
                        ))}
                    </div>
                </div>

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

            {/* 6. Enable description field in the modal */}
            <AddEntityModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddSite}
                title="Add New Site"
                nameLabel="Site Name"
                ownerLabel="Owner Name"
                panVatMode="hidden"
                namePlaceholder="e.g., Main Warehouse"
                ownerPlaceholder="Enter site owner/manager name"
            />
        </div>
    );
};

export default SiteContent;