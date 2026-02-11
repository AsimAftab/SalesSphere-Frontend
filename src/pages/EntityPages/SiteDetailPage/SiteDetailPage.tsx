// src/pages/EntityPages/SiteDetailPage/SiteDetailPage.tsx
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import SiteDetailsContent from './SiteDetailsContent';
import ConfirmationModal from '@/components/modals/CommonModals/ConfirmationModal';
import EditEntityModal from '@/components/modals/Entities/EditEntityModal';
import { useSiteDetails } from './useSiteDetails';
import type { EditEntityData } from '@/components/modals/Entities/EditEntityModal/types';
import { type Site, SiteMapper } from '@/api/siteService';
import { ErrorBoundary } from '@/components/ui';


const SiteDetailPage: React.FC = () => {
    const { data, subOrgs, categories, isLoading, error, mutations, permissions } = useSiteDetails();

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    /**
     * Coordinates between the Modal's submitted data and the API mutation.
     */
    const handleModalSave = async (updated: EditEntityData) => {
        const payload: Partial<Site> = {
            name: updated.name,
            ownerName: updated.ownerName,
            dateJoined: updated.dateJoined,
            subOrgName: updated.subOrgName,
            address: updated.address,
            latitude: updated.latitude ?? 0,
            longitude: updated.longitude ?? 0,
            email: updated.email,
            phone: updated.phone,
            description: updated.description,
            siteInterest: updated.siteInterest,
        };

        try {
            await mutations.update(payload);
            setIsEditOpen(false);
        } catch {
            // Error handled in hook via toast
        }
    };

    const siteData = data;

    return (
        <Sidebar>
            <ErrorBoundary>
                <SiteDetailsContent
                    site={siteData?.site ? SiteMapper.toFrontend(siteData.site) : null}
                    contact={siteData?.contact || null}
                    createdBy={siteData?.site?.createdBy || null}
                    location={siteData?.location || null}
                    loading={isLoading}
                    error={error}
                    isMutating={mutations.isUpdating}
                    isUploading={mutations.isUploading}
                    isDeletingImage={mutations.isDeletingImage}
                    images={siteData?.site?.images || []}
                    onDataRefresh={() => {/* handled by hook invalidation */ }}
                    onOpenEditModal={() => setIsEditOpen(true)}
                    onDeleteRequest={() => setIsDeleteConfirmOpen(true)}
                    onImageUpload={mutations.uploadImage}
                    onImageDelete={mutations.deleteImage}
                    permissions={permissions}
                />
            </ErrorBoundary>

            {siteData && (
                <>
                    <ConfirmationModal
                        isOpen={isDeleteConfirmOpen}
                        title="Confirm Deletion"
                        message={`Are you sure you want to delete "${siteData.site.siteName}"?`}
                        onConfirm={mutations.delete}
                        onCancel={() => setIsDeleteConfirmOpen(false)}
                        confirmButtonText="Delete"
                        confirmButtonVariant="danger"
                    />

                    {isEditOpen && (
                        <EditEntityModal
                            isOpen={isEditOpen}
                            onClose={() => setIsEditOpen(false)}
                            onSave={handleModalSave}
                            title="Edit Site"
                            nameLabel="Site Name"
                            ownerLabel="Owner Name"
                            panVatMode="hidden"
                            descriptionMode="optional"
                            initialData={{
                                name: siteData.site.siteName,
                                ownerName: siteData.site.ownerName,
                                dateJoined: siteData.site.dateJoined,
                                address: siteData.location.address ?? '',
                                description: siteData.site.description ?? '',
                                latitude: siteData.location.latitude ?? 0,
                                longitude: siteData.location.longitude ?? 0,
                                email: siteData.contact.email ?? '',
                                phone: (siteData.contact.phone ?? '').replace(/[^0-9]/g, ''),
                                panVat: '',
                                subOrgName: siteData.site.subOrganization,
                                siteInterest: siteData.site.siteInterest || [],
                            }}
                            entityType="Site"
                            categoriesData={categories}
                            subOrgsList={subOrgs}
                            onAddSubOrg={mutations.addSubOrg}
                        />
                    )}
                </>
            )}
        </Sidebar>
    );
};

export default SiteDetailPage;
