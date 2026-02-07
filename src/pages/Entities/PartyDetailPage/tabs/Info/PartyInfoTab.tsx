import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DetailsMainCard } from '../../../../Entities/Shared/components/Details/DetailsMainCard';
import { DetailsMapBlock } from '../../../../Entities/Shared/components/Details/DetailsMapBlock';
import { formatDisplayDate } from '@/utils/dateUtils';
import type { Party } from '../../types';

// Import Modals
import ImagePreviewModal from '@/components/modals/CommonModals/ImagePreviewModal';
import ConfirmationModal from '@/components/modals/CommonModals/ConfirmationModal';
import { InfoBlock, Button } from '@/components/ui';
import {
    ArrowLeft,
    Briefcase,
    CalendarDays,
    FileText,
    Globe,
    IdCard,
    Mail,
    MapPin,
    Phone,
    User,
} from 'lucide-react';

interface PartyInfoTabProps {
    party: Party;
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
        { icon: User, label: 'Owner Name', value: party.ownerName },
        { icon: CalendarDays, label: 'Date Joined', value: party.dateCreated ? formatDisplayDate(party.dateCreated) : 'N/A' },
        { icon: Phone, label: 'Phone', value: party.phone },
        { icon: Mail, label: 'Email', value: party.email || 'N/A' },
        { icon: Briefcase, label: 'Party Type', value: party.partyType || 'Not Specified' },
        { icon: IdCard, label: 'PAN/VAT Number', value: party.panVat || 'N/A' },
        { icon: MapPin, label: 'Full Address', value: party.address, className: 'sm:col-span-2' },
        { icon: Globe, label: 'Latitude', value: party.latitude?.toFixed(6) },
        { icon: Globe, label: 'Longitude', value: party.longitude?.toFixed(6) }
    ];

    return (
        <div className="space-y-6">
            {/* Header: Back button + Title + Actions (matching Employee pattern) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-1">
                <div className="flex items-center gap-4">
                    <Link to="/parties" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Party Details</h1>
                </div>

                <div className="flex flex-col md:flex-row w-full md:w-auto gap-4 md:space-x-4">
                    {onOpenEdit && (
                        <Button
                            variant="primary"
                            onClick={onOpenEdit}
                            className="w-full"
                        >
                            Edit Party
                        </Button>
                    )}
                    {onOpenDelete && (
                        <Button
                            variant="outline"
                            onClick={onOpenDelete}
                            className="w-full text-red-600 border-red-300 hover:bg-red-50 focus:ring-red-500"
                        >
                            Delete Party
                        </Button>
                    )}
                </div>
            </div>

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
                                <User className="w-4 h-4 text-blue-600" />
                            </div>
                            Party Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            {infoItems.map((item, idx) => (
                                <InfoBlock key={idx} icon={item.icon} label={item.label} value={item.value} className={item.className} />
                            ))}
                        </div>
                        <div className="border-t border-gray-200 pt-4 mt-6">
                            <InfoBlock
                                icon={FileText}
                                label="Description"
                                value={
                                    <span className={party.description ? 'text-[#202224]' : 'text-slate-400 italic'}>
                                        {party.description || 'No description provided.'}
                                    </span>
                                }
                                className="sm:col-span-2"
                            />
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
