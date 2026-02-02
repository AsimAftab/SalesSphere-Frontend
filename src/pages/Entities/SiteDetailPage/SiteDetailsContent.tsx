import React from 'react';
import { Loader2 } from 'lucide-react';
import {
  type ApiSite,
  type ApiSiteImage,
} from '../../../api/siteService';
import SiteDetailsSkeleton from './SiteDetailsSkeleton';
import SiteDetailsLayout from './SiteDetailsLayout';

// --- PROPS INTERFACE ---
interface SiteDetailsContentProps {
  site: ApiSite | null;
  contact: { phone: string; email: string } | null;
  createdBy?: { name: string; email: string } | null;
  location: { address: string; latitude: number; longitude: number } | null;
  loading: boolean;
  error: string | null;
  isMutating: boolean;
  isUploading: boolean;
  isDeletingImage: boolean;
  images: ApiSiteImage[];
  onDataRefresh: () => void;
  onOpenEditModal: () => void;
  onDeleteRequest: () => void;
  onImageUpload: (imageNumber: number, file: File) => void;
  onImageDelete: (imageNumber: number) => void;
  permissions?: {
    canUpdate: boolean;
    canDelete: boolean;
    canManageImages?: boolean;
  };
}

const SiteDetailsContent: React.FC<SiteDetailsContentProps> = ({
  site,
  contact,
  location,
  loading,
  error,
  isMutating,
  isUploading,
  isDeletingImage,
  images,
  onOpenEditModal,
  onDeleteRequest,
  onImageUpload,
  onImageDelete,
  permissions,
}) => {

  // --- Use Skeleton on initial load ---
  if (loading && (!site || !contact || !location)) {
    return (
      <SiteDetailsSkeleton
        canUpdate={permissions?.canUpdate}
        canDelete={permissions?.canDelete}
      />
    );
  }

  // --- Use standard error block ---
  if (error && (!site || !contact || !location)) {
    return (
      <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  // --- Data Guard Clause ---
  if (!site || !contact || !location) {
    return (
      <div className="text-center p-10 text-gray-500">
        Site data not found.
      </div>
    );
  }

  return (
    <>
      {isMutating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[9999]">
          <div className="flex flex-col items-center bg-white px-8 py-6 rounded-lg shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="mt-3 text-gray-800 font-semibold">Saving...</span>
          </div>
        </div>
      )}

      <SiteDetailsLayout
        site={site}
        contact={contact}
        location={location}
        images={images}
        isUploading={isUploading}
        isDeletingImage={isDeletingImage}
        onOpenEditModal={onOpenEditModal}
        onDeleteRequest={onDeleteRequest}
        onImageUpload={onImageUpload}
        onImageDelete={onImageDelete}
        permissions={permissions}
      />
    </>
  );
};

export default SiteDetailsContent;