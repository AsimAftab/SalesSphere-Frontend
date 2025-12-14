import React, { useState, useMemo, useEffect } from 'react'; 
import { motion } from 'framer-motion'; 
import ProfileCard from '../../components/UI/ProfileCard';
import Button from '../../components/UI/Button/Button';
import { type Prospect, type NewProspectData } from '../../api/prospectService';
import AddEntityModal, { type NewEntityData } from '../../components/modals/AddEntityModal';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ExportActions from '../../components/UI/ExportActions';

interface ProspectContentProps {
    data: Prospect[] | null;
    loading: boolean;
    error: string | null;
    onSaveProspect: (data: NewProspectData) => void;
    isCreating: boolean;
    // New Props for Export
    onExportPdf: () => void;
    onExportExcel: () => void;
    exportingStatus: 'pdf' | 'excel' | null;

    existingCategories?: string[];
    existingBrands?: string[];
    onAddCategory?: (category: string) => void;
    onAddBrand?: (brand: string) => void;
}

// Helper function 
const formatAddress = (fullAddress: string | undefined | null): string => {
    if (!fullAddress) {
        return 'Address not available';
    }
    const parts = fullAddress.split(',').map((part) => part.trim());
    if (parts.length > 2) {
        const desiredParts = parts.slice(1, 3);
        return desiredParts.join(', ');
    } else if (parts.length === 2) {
        return parts[1];
    } else {
        return fullAddress;
    }
};

// --- Animation Variants ---
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

// --- Skeleton Component ---
const ProspectContentSkeleton: React.FC = () => {
    const ITEMS_PER_PAGE = 12;

    return (
        <SkeletonTheme baseColor="#e6e6e6" highlightColor="#f0f0f0">
            <div className="flex-1 flex flex-col h-full overflow-hidden overflow-x-hidden">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-shrink-0">
                    <h1 className="text-3xl font-bold">
                        <Skeleton width={160} height={36} /> 
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
                        <Skeleton height={40} width={256} borderRadius={999} />
                        <Skeleton height={40} width={100} borderRadius={8} /> {/* Export Buttons Placeholder */}
                        <Skeleton height={40} width={180} borderRadius={8} /> 
                    </div>
                </div>

                {/* Grid Skeleton */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2 md:px-0">
                        {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-start min-h-[180px]"
                            >
                                {/* Avatar */}
                                <div className="mb-3 pt-2 flex justify-center w-full">
                                    <Skeleton
                                        containerClassName="w-full flex justify-center"
                                        width={64}
                                        height={64}
                                        style={{ borderRadius: '50%', display: 'block' }}
                                    />
                                </div>

                                {/* Text Details */}
                                <div className="flex flex-col items-center w-full space-y-1 pb-2">
                                    {[...Array(3)].map((_, j) => (
                                        <div key={j} className="w-full flex justify-center">
                                            <Skeleton
                                                containerClassName="w-full"
                                                height={14}
                                                style={{
                                                    display: 'block',
                                                    width: '100%', 
                                                    borderRadius: '6px',
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination Skeleton */}
                <div className="flex-shrink-0 flex items-center justify-between mt-6 text-sm pt-4 border-t border-gray-200">
                    <Skeleton width={150} height={18} />
                    <div className="flex items-center gap-x-2">
                        <Skeleton width={80} height={36} borderRadius={8} />
                        <Skeleton width={80} height={36} borderRadius={8} />
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

const ProspectContent: React.FC<ProspectContentProps> = ({
    data,
    loading,
    error,
    onSaveProspect,
    isCreating,
    onExportPdf,
    onExportExcel,
    exportingStatus,
    existingCategories = [],
    existingBrands = [],
    onAddCategory,
    onAddBrand
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const ITEMS_PER_PAGE = 12;

    const filteredProspect = useMemo(() => {
        if (!data) return [];
        const lowerSearchTerm = searchTerm.toLowerCase();
        return data.filter(
            (prospect) =>
                (prospect.ownerName?.toLowerCase() || '').includes(lowerSearchTerm) ||
                (prospect.name?.toLowerCase() || '').includes(lowerSearchTerm)
        );
    }, [data, searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // --- Use Skeleton on initial load ---
    if (loading && !data) {
        return <ProspectContentSkeleton />;
    }

    if (error && !data)
        return (
            <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">
                {error}
            </div>
        );

    const totalPages = Math.ceil(filteredProspect.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentProspect = filteredProspect.slice(startIndex, endIndex);

    const goToPage = (pageNumber: number) => {
        const newPage = Math.max(1, Math.min(pageNumber, totalPages || 1));
        setCurrentPage(newPage);
    };

    // src/pages/Prospect/ProspectContent.tsx

const handleAddProspect = async (data: NewEntityData) => {
    // 🔍 DEBUG: Check if data is coming correctly from the Modal
    console.log("1. Data received from Modal:", (data as any).prospectInterest);

    const newProspectData: NewProspectData = {
        name: data.name,
        ownerName: data.ownerName,
        dateJoined: data.dateJoined,
        address: data.address,
        description: data.description ?? undefined,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        email: data.email ?? undefined,
        phone: data.phone ?? '',
        panVat: data.panVat ?? undefined,
        interest: (data as any).prospectInterest 
            ? (data as any).prospectInterest.map((item: any) => ({
                category: item.category,
                brands: item.brands, // Maps correctly: ['BrandA', 'BrandB']
            })) 
            : [],
    };
    console.log("2. Payload sending to Service:", newProspectData);

    onSaveProspect(newProspectData);
    setIsAddModalOpen(false);
};

    return (
        // --- Added motion wrapper ---
        <motion.div
            className="flex-1 flex flex-col h-full overflow-hidden overflow-x-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Overlays */}
            {loading && data && (
                <div className="text-center p-2 text-sm text-blue-500">Refreshing...</div>
            )}
            {error && data && (
                <div className="text-center p-2 text-sm text-red-600 bg-red-50 rounded">
                    {error}
                </div>
            )}

            {/* Export Loading Overlay */}
            {exportingStatus && (
                <div className="w-full p-2 mb-2 text-center bg-blue-100 text-blue-800 rounded-lg text-sm">
                    Generating {exportingStatus === 'pdf' ? 'PDF' : 'Excel'}... Please wait.
                </div>
            )}

            {isCreating && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[9999]">
                    <div className="flex flex-col items-center bg-white px-8 py-6 rounded-lg shadow-lg">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <span className="mt-3 text-gray-800 font-semibold">Creating prospect...</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <motion.div
                variants={itemVariants}
                className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-shrink-0"
            >
                <h1 className="text-3xl font-bold text-[#202224] text-center md:text-left">
                    Prospects
                </h1>
                <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative">
                        <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-gray-500" />
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder=" Search by Name or Owner "
                            className="block h-10 w-full md:w-64 border-transparent bg-gray-200 py-0 pl-10 pr-3 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-sm rounded-full"
                        />
                    </div>

                    {/* Export Actions */}
                    <div className="flex justify-center w-full md:w-auto">
                        <ExportActions 
                            onExportPdf={onExportPdf}
                            onExportExcel={onExportExcel}
                        />
                    </div>

                    {/* Add Button */}
                    <div className="flex justify-center w-full md:w-auto">
                        <Button onClick={() => setIsAddModalOpen(true)} className="w-full md:w-auto">
                            Add New Prospect
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Content Area */}
            <motion.div
                variants={itemVariants}
                className="flex-1 flex flex-col overflow-hidden"
            >
                {filteredProspect.length === 0 && !loading ? ( 
                    <div className="text-center p-10 text-gray-500">
                        No prospects found{searchTerm ? ' matching your search' : ''}.
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2 md:px-0">
                                {currentProspect.map((prospect) => (
                                    <ProfileCard
                                        key={prospect.id}
                                        id={prospect.id}
                                        basePath="/prospects"
                                        title={prospect.name}
                                        ownerName={prospect.ownerName}
                                        address={formatAddress(prospect.address)}
                                        cardType="prospect"
                                    />
                                ))}
                            </div>
                        </div>

                        {totalPages > 1 && (
                            <div className="flex-shrink-0 flex items-center justify-between mt-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
                                <p>
                                    Showing {startIndex + 1} - {Math.min(endIndex, filteredProspect.length)} of{' '}
                                    {filteredProspect.length}
                                </p>
                                <div className="flex items-center gap-x-2">
                                    {currentPage > 1 && (
                                        <Button onClick={() => goToPage(currentPage - 1)} variant="secondary">
                                            Previous
                                        </Button>
                                    )}
                                    <span className="font-semibold">
                                        {currentPage} / {totalPages}
                                    </span>
                                    {currentPage < totalPages && (
                                        <Button onClick={() => goToPage(currentPage + 1)} variant="secondary">
                                            Next
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </motion.div>

            {/* Add Prospect Modal */}
            <AddEntityModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddProspect}
                title="Add New Prospect"
                nameLabel="Prospect Name"
                ownerLabel="Owner Name"
                panVatMode="optional"
                entityType="Prospect"
                namePlaceholder="Enter prospect name"
                ownerPlaceholder="Enter owner name"
                existingCategories={existingCategories}
                existingBrands={existingBrands}
                onAddCategory={onAddCategory}
                onAddBrand={onAddBrand}
            />
        </motion.div>
    );
};

export default ProspectContent;