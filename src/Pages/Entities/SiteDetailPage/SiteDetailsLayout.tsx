import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    UserIcon,
    CalendarDaysIcon,
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    GlobeAltIcon,
    BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

// Shared Components
import { DetailsHeader } from '../Shared/components/Details/DetailsHeader';
import { DetailsInfoGrid } from '../Shared/components/Details/DetailsInfoGrid';
import { DetailsMainCard } from '../Shared/components/Details/DetailsMainCard';
import { DetailsMapBlock } from '../Shared/components/Details/DetailsMapBlock';

// Local Components
import SiteInterestCard from './components/SiteInterestCard';
import SiteImageGallery from './components/SiteImageGallery';

// Types
import { type ApiSite, type ApiSiteImage } from '../../../api/siteService';

interface SiteDetailsLayoutProps {
    site: ApiSite;
    contact: { phone: string; email: string };
    location: { address: string; latitude: number; longitude: number };
    images: ApiSiteImage[];
    isUploading: boolean;
    isDeletingImage: boolean;
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

const containerVariants = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

const SiteDetailsLayout: React.FC<SiteDetailsLayoutProps> = ({
    site,
    contact,
    location,
    images,
    isUploading,
    isDeletingImage,
    onOpenEditModal,
    onDeleteRequest,
    onImageUpload,
    onImageDelete,
    permissions,
}) => {

    // Helper for date
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    // Prepare Info Items
    const infoItems = useMemo(() => [
        { icon: UserIcon, label: 'Owner Name', value: site.ownerName },
        { icon: CalendarDaysIcon, label: 'Date Joined', value: formatDate(site.dateJoined) },
        { icon: PhoneIcon, label: 'Phone', value: contact.phone },
        { icon: EnvelopeIcon, label: 'Email', value: contact.email },
        { icon: EnvelopeIcon, label: 'Created By', value: site.createdBy?.name },
        { icon: EnvelopeIcon, label: 'Sub-Organization', value: site.subOrgName },
        { icon: MapPinIcon, label: 'Full Address', value: location.address, className: 'sm:col-span-2' },
        { icon: GlobeAltIcon, label: 'Latitude', value: location.latitude?.toFixed(6) },
        { icon: GlobeAltIcon, label: 'Longitude', value: location.longitude?.toFixed(6) },
    ], [site, contact, location]);

    // Prepare Actions
    const actions = useMemo(() => {
        const acts = [];
        if (permissions?.canUpdate) {
            acts.push({
                label: 'Edit Site',
                onClick: onOpenEditModal,
                variant: 'primary' as const
            });
        }
        if (permissions?.canDelete) {
            acts.push({
                label: 'Delete Site',
                onClick: onDeleteRequest,
                variant: 'outline' as const,
                className: 'text-red-600 border-red-300 hover:bg-red-50'
            });
        }
        return acts;
    }, [permissions, onOpenEditModal, onDeleteRequest]);

    return (
        <motion.div
            className="relative"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Header */}
            <motion.div variants={itemVariants}>
                <DetailsHeader
                    title="Site Details"
                    backPath="/sites"
                    actions={actions}
                />
            </motion.div>

            {/* Main Grid - MATCHING PartyDetailsContent structure with items-stretch */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* Left Column - MATCHING PartyDetailsContent with flex col */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Main Card */}
                    <DetailsMainCard
                        title={site.name}
                        address={location.address}
                        googleMapsUrl={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                        hasCoordinates={!!(location.latitude && location.longitude)}
                        icon={<BuildingStorefrontIcon className="w-10 h-10 text-white" />}
                    />

                    {/* Info Card - MATCHING PartyDetailsContent with flex-1 */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <UserIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            Site Information
                        </h3>
                        <DetailsInfoGrid items={infoItems} />
                    </div>
                </div>

                {/* Right Column: Map */}
                <div className="lg:col-span-1 flex flex-col items-stretch h-full">
                    <DetailsMapBlock lat={location.latitude} lng={location.longitude} />
                </div>
            </motion.div>

            {/* Interest Card */}
            <SiteInterestCard siteInterest={site.siteInterest} />

            {/* Image Gallery */}
            <SiteImageGallery
                images={images}
                isUploading={isUploading}
                isDeletingImage={isDeletingImage}
                onImageUpload={onImageUpload}
                onImageDelete={onImageDelete}
                canManageImages={permissions?.canManageImages}
            />
        </motion.div>
    );
};

export default SiteDetailsLayout;
