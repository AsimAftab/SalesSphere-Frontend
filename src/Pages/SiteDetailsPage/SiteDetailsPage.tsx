import React, { useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import SiteDetailsContent from './SiteDetailsContent';
import {
    getFullSiteDetails,
    updateSite,
    deleteSite,
    type FullSiteDetailsData,
    type Site, // <-- FIX 1: Import the flat 'Site' type, not 'NewSiteData'
} from '../../api/siteService';
import toast from 'react-hot-toast';

// Import Modals
import ConfirmationModal from '../../components/modals/DeleteEntityModal';
import EditEntityModal, { type EditEntityData } from '../../components/modals/EditEntityModal';

// Define a unique key for this query
const SITE_QUERY_KEY = 'siteDetails';

const SiteDetailsPage: React.FC = () => {
    const { siteId } = useParams<{ siteId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // State for controlling the modals
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    // 1. FETCH QUERY (GET)
    const siteQuery = useQuery<FullSiteDetailsData, Error>({
        queryKey: [SITE_QUERY_KEY, siteId],
        queryFn: () => getFullSiteDetails(siteId!),
        enabled: !!siteId,
    });

    // 2. UPDATE MUTATION (PUT)
    const updateMutation = useMutation({
        // <-- FIX 2: The mutation function now accepts the flat 'Partial<Site>'
        mutationFn: (payload: Partial<Site>) => updateSite(siteId!, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SITE_QUERY_KEY, siteId] });
            toast.success('Site updated successfully!');
            setIsEditOpen(false);
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update site.');
        },
    });

    // 3. DELETE MUTATION (DELETE)
    const deleteMutation = useMutation({
        mutationFn: () => deleteSite(siteId!),
        onSuccess: () => {
            toast.success('Site deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['sites'] });
            navigate('/sites');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete site.');
        },
    });

    // --- Handlers for Modals and Content ---

    // <-- FIX 3: This function now creates a FLAT payload
    const handleModalSave = async (updatedData: EditEntityData) => {
        // Map the flat EditEntityData to the flat Partial<Site> type
        // The 'updateSite' service will handle mapping this to the API's nested structure
        const siteUpdatePayload: Partial<Site> = {
            name: updatedData.name,
            ownerName: updatedData.ownerName,
            dateJoined: updatedData.dateJoined,
            address: updatedData.address,
            latitude: updatedData.latitude,
            longitude: updatedData.longitude,
            email: updatedData.email,
            phone: updatedData.phone,
            description: updatedData.description, // <-- ADDED
        };
        updateMutation.mutate(siteUpdatePayload);
    };

    const handleDeleteConfirmed = () => {
        deleteMutation.mutate();
        setIsDeleteConfirmOpen(false);
    };

    // Combine all loading states for the UI
    const isLoading =
        siteQuery.isPending ||
        updateMutation.isPending ||
        deleteMutation.isPending;
    
    const errorMsg = siteQuery.isError ? siteQuery.error.message : null;
    const siteData = siteQuery.data;

    return (
        <Sidebar>
            <SiteDetailsContent
                data={siteData || null}
                loading={isLoading}
                error={errorMsg}
                onDataRefresh={() => queryClient.invalidateQueries({ queryKey: [SITE_QUERY_KEY, siteId] })}
                onOpenEditModal={() => setIsEditOpen(true)}
                onDeleteRequest={() => setIsDeleteConfirmOpen(true)}
            />

            {/* Modals are now rendered here, in the parent */}
            {siteData && siteData.site && (
                <>
                    <ConfirmationModal
                        isOpen={isDeleteConfirmOpen}
                        title="Confirm Deletion"
                        message={`Are you sure you want to delete "${siteData.site.siteName}"? This action cannot be undone.`}
                        onConfirm={handleDeleteConfirmed}
                        onCancel={() => setIsDeleteConfirmOpen(false)}
                        confirmButtonText="Delete"
                        confirmButtonVariant="danger"
                        
                    />

                    <EditEntityModal
                        isOpen={isEditOpen}
                        onClose={() => setIsEditOpen(false)}
                        onSave={handleModalSave}
                        title="Edit Site"
                        nameLabel="Site Name"
                        ownerLabel="Owner Name"
                        panVatMode="hidden"
                        descriptionMode="optional" // <-- FIX 5: Enable description
                        
                        initialData={{
                            name: siteData.site.siteName,
                            ownerName: siteData.site.ownerName,
                            dateJoined: siteData.site.dateJoined,
                            address: siteData.location.address ?? '',
                            description: siteData.site.description ?? '', // <-- FIX 7: Add description
                            latitude: siteData.location.latitude ?? 0,
                            longitude: siteData.location.longitude ?? 0,
                            email: siteData.contact.email ?? '',
                            phone: (siteData.contact.phone ?? '').replace(/[^0-9]/g, ''),
                            panVat: '', // Not used for sites
                        }}
                    />
                </>
            )}
        </Sidebar>
    );
};

export default SiteDetailsPage;