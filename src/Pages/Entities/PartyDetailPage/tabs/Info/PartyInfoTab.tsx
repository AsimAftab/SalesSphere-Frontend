import React, { useState } from 'react';
import {
    UserIcon,
    CalendarDaysIcon,
    PhoneIcon,
    EnvelopeIcon,
    BriefcaseIcon,
    IdentificationIcon,
    MapPinIcon,
    GlobeAltIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import { DetailsMainCard } from '../../../../Entities/Shared/components/Details/DetailsMainCard';
import { DetailsInfoGrid } from '../../../../Entities/Shared/components/Details/DetailsInfoGrid';
import { DetailsMapBlock } from '../../../../Entities/Shared/components/Details/DetailsMapBlock';

// Import Header
import { DetailsHeader } from '../../../../Entities/Shared/components/Details/DetailsHeader';

// Import Modals
import ImagePreviewModal from '../../../../../components/modals/CommonModals/ImagePreviewModal';
import ConfirmationModal from '../../../../../components/modals/CommonModals/ConfirmationModal';

interface PartyInfoTabProps {
    party: any;
    isUploading: boolean;
    isDeleting: boolean;
    onImageUpload: (file: File) => Promise<void>;
    onImageDelete: () => Promise<void>;
    // New Actions
    onOpenEdit?: () => void;
    onOpenDelete?: () => void;
}

export const PartyInfoTab: React.FC<PartyInfoTabProps> = ({
    party,
    isUploading,
    isDeleting,
    onImageUpload,
    onImageDelete,
    onOpenEdit,
    onOpenDelete
}) => {
    // State for Image Preview
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // State for Image Delete Confirmation
    const [isDeleteImageOpen, setIsDeleteImageOpen] = useState(false);

    // Handlers
    const handleImagePreview = () => {
        if (party.image) {
            setPreviewImage(party.image);
        }
    };

    const handleImageDeleteClick = () => {
        setIsDeleteImageOpen(true);
    };

    const handleConfirmImageDelete = () => {
        onImageDelete();
        setIsDeleteImageOpen(false);
    };

    const hasCoordinates = !!(party.latitude && party.longitude);
    const googleMapsUrl = hasCoordinates
        ? `https://www.google.com/maps?q=${party.latitude},${party.longitude}`
        : '#';

    const infoItems = [
        { icon: UserIcon, label: 'Owner Name', value: party.ownerName },
        { icon: CalendarDaysIcon, label: 'Date Joined', value: party.dateCreated ? new Date(party.dateCreated).toLocaleDateString() : 'N/A' },
        { icon: PhoneIcon, label: 'Phone', value: party.phone },
        { icon: EnvelopeIcon, label: 'Email', value: party.email || 'N/A' },
        { icon: BriefcaseIcon, label: 'Party Type', value: party.partyType || 'Not Specified' },
        { icon: IdentificationIcon, label: 'PAN/VAT Number', value: party.panVat || 'N/A' },
        { icon: MapPinIcon, label: 'Full Address', value: party.address, className: 'sm:col-span-2' },
        { icon: GlobeAltIcon, label: 'Latitude', value: party.latitude?.toFixed(6) },
        { icon: GlobeAltIcon, label: 'Longitude', value: party.longitude?.toFixed(6) }
    ];

    // Conditional Actions
    const headerActions = [
        ...(onOpenEdit ? [{ label: 'Edit Party', onClick: onOpenEdit, variant: 'primary' as const }] : []),
        ...(onOpenDelete ? [{ label: 'Delete Party', onClick: onOpenDelete, variant: 'outline' as const, className: 'text-red-600 border-red-200 hover:bg-red-50' }] : [])
    ];

    return (
        <div className="space-y-6">
            {/* Header: Title + Actions (Edit/Delete) - Moved inside Tab */}
            <DetailsHeader title="Party Details" backPath="/parties" actions={headerActions} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* Left Column: Identity & Actions */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <DetailsMainCard
                        title={party.companyName}
                        address={party.address}
                        image={party.image}
                        isUploading={isUploading}
                        isDeleting={isDeleting}
                        onUpload={onImageUpload}
                        onDelete={handleImageDeleteClick}
                        onPreview={handleImagePreview}
                        googleMapsUrl={googleMapsUrl}
                        hasCoordinates={hasCoordinates}
                    />

                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                <UserIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            Party Information
                        </h3>
                        <DetailsInfoGrid items={infoItems} />
                        <div className="border-t border-gray-100 pt-4 mt-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                                <DocumentTextIcon className="w-4 h-4 text-gray-400" /> Description
                            </h4>
                            <p className="text-sm text-gray-600 italic">
                                {party.description || 'No description provided.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Map */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="flex-1 min-h-[350px]">
                        <DetailsMapBlock
                            lat={party.latitude !== undefined && party.latitude !== null ? Number(party.latitude) : null}
                            lng={party.longitude !== undefined && party.longitude !== null ? Number(party.longitude) : null}
                        />
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ImagePreviewModal
                isOpen={!!previewImage}
                onClose={() => setPreviewImage(null)}
                images={previewImage ? [{
                    url: previewImage,
                    description: 'Party Image',
                    imageNumber: 1 // Dummy index for single image
                }] : []}
                initialIndex={0}
                onDeleteImage={handleImageDeleteClick}
                isDeletingImage={isDeleting}
            />

            <ConfirmationModal
                isOpen={isDeleteImageOpen}
                title="Delete Image"
                message="Are you sure you want to delete this image? This action cannot be undone."
                confirmButtonText="Delete"
                confirmButtonVariant="danger"
                onConfirm={handleConfirmImageDelete}
                onCancel={() => setIsDeleteImageOpen(false)}
            />
        </div>
    );
};
