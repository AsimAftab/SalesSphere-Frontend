import React, { useState, useMemo, useEffect, useRef } from 'react'; 
import { motion } from 'framer-motion'; 
import ProfileCard from '../../components/UI/ProfileCard';
import Button from '../../components/UI/Button/Button'; // Assuming this component supports variant="secondary"
import { type Prospect, type NewProspectData, type ProspectCategoryData } from '../../api/prospectService';
import AddEntityModal, { type NewEntityData } from '../../components/modals/AddEntityModal';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ExportActions from '../../components/UI/ExportActions';

// --- Types & Interfaces ---
interface ProspectContentProps {
    data: Prospect[] | null;
    loading: boolean;
    error: string | null;
    onSaveProspect: (data: NewProspectData) => void;
    isCreating: boolean;
    onExportPdf: () => void;
    onExportExcel: () => void;
    exportingStatus: 'pdf' | 'excel' | null;
    categoriesData?: ProspectCategoryData[]; 
    onAddCategory?: (category: string) => void;
    onAddBrand?: (brand: string) => void;
    existingCategories?: string[];
    existingBrands?: string[];
}

interface MultiSelectProps {
    label: string; // Keep label in interface for potential use or accessibility
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    disabled?: boolean;
    placeholder?: string;
}

// --- Helper Components ---

// Custom Multi-Select Dropdown
const MultiSelectDropdown: React.FC<MultiSelectProps> = ({ 
    options, 
    selected, 
    onChange, 
    disabled = false,
    placeholder = "Select..."
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter(item => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    const displayText = selected.length === 0 
        ? placeholder 
        : selected.length === 1 
            ? selected[0] 
            : `${selected.length} Selected`;

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`flex items-center justify-between w-full h-10 rounded-lg border px-3 text-sm transition-colors ${
                    disabled 
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                        : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
            >
                <span className="truncate mr-2">{displayText}</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && !disabled && (
                <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {options.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-gray-500">No options available</div>
                    ) : (
                        options.map((option) => (
                            <div 
                                key={option}
                                onClick={() => toggleOption(option)}
                                className="flex items-center px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={selected.includes(option)}
                                    readOnly
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 pointer-events-none" 
                                />
                                <span className={`ml-2 block truncate text-sm ${selected.includes(option) ? 'font-medium text-blue-700' : 'text-gray-700'}`}>
                                    {option}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

// Helper function for address formatting
const formatAddress = (fullAddress: string | undefined | null): string => {
    if (!fullAddress) return 'Address not available';
    const parts = fullAddress.split(',').map((part) => part.trim());
    if (parts.length > 2) {
        return parts.slice(1, 3).join(', ');
    } else if (parts.length === 2) {
        return parts[1];
    } else {
        return fullAddress;
    }
};

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 1 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-shrink-0">
                    <h1 className="text-3xl font-bold"><Skeleton width={160} height={36} /></h1>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
                        <Skeleton height={40} width={256} borderRadius={999} />
                        <Skeleton height={40} width={100} borderRadius={8} /> 
                        <Skeleton height={40} width={180} borderRadius={8} /> 
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2 md:px-0">
                        {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                            <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-start min-h-[180px]">
                                <div className="mb-3 pt-2 flex justify-center w-full">
                                    <Skeleton containerClassName="w-full flex justify-center" width={64} height={64} style={{ borderRadius: '50%', display: 'block' }} />
                                </div>
                                <div className="flex flex-col items-center w-full space-y-1 pb-2">
                                    {[...Array(3)].map((_, j) => (
                                        <div key={j} className="w-full flex justify-center">
                                            <Skeleton containerClassName="w-full" height={14} style={{ display: 'block', width: '100%', borderRadius: '6px' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

// --- Main Component ---
const ProspectContent: React.FC<ProspectContentProps> = ({
    data,
    loading,
    error,
    onSaveProspect,
    isCreating,
    onExportPdf,
    onExportExcel,
    exportingStatus,
    categoriesData = [], 
    onAddCategory,
    onAddBrand
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // --- Multi-select Filter States ---
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

    const ITEMS_PER_PAGE = 12;

    // --- UPDATED: Available Brands Logic ---
    // If no category is selected, show ALL brands. 
    // If categories are selected, show only brands belonging to those categories.
    const availableBrands = useMemo(() => {
        let relevantCategories = categoriesData;
        
        if (selectedCategories.length > 0) {
            relevantCategories = categoriesData.filter(c => selectedCategories.includes(c.name));
        }
        
        const allBrands = relevantCategories.flatMap(c => c.brands);
        // Deduplicate and sort
        return Array.from(new Set(allBrands)).sort();
    }, [selectedCategories, categoriesData]);

    // Cleanup: If a selected brand is no longer available (because specific categories were chosen that don't have it), remove it.
    useEffect(() => {
        setSelectedBrands(prev => prev.filter(b => availableBrands.includes(b)));
    }, [selectedCategories, availableBrands]);

    // Reset pagination on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategories, selectedBrands]);

    // --- UPDATED: Independent Filter Logic ---
    const filteredProspect = useMemo(() => {
        if (!data) return [];
        const lowerSearchTerm = searchTerm.toLowerCase();

        return data.filter((prospect) => {
            // 1. Search Text Filter
            const matchesSearch = 
                (prospect.ownerName?.toLowerCase() || '').includes(lowerSearchTerm) ||
                (prospect.name?.toLowerCase() || '').includes(lowerSearchTerm);

            if (!matchesSearch) return false;

            // 2. Category Filter (If any categories selected)
            if (selectedCategories.length > 0) {
                const hasMatchingCategory = prospect.interest?.some(
                    (item) => item.category && selectedCategories.includes(item.category.trim())
                );
                if (!hasMatchingCategory) return false;
            }

            // 3. Brand Filter (If any brands selected) - Now independent of category selection
            if (selectedBrands.length > 0) {
                // Collect all brands this prospect is interested in across all their categories
                const prospectBrands = prospect.interest?.flatMap(item => item.brands || []) || [];
                
                // Check if they have ANY of the selected brands
                const hasMatchingBrand = prospectBrands.some(brand => 
                    selectedBrands.includes(brand.trim())
                );
                
                if (!hasMatchingBrand) return false;
            }

            return true;
        });
    }, [data, searchTerm, selectedCategories, selectedBrands]);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategories([]);
        setSelectedBrands([]);
    };

    if (loading && !data) return <ProspectContentSkeleton />;

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

    const handleAddProspect = async (data: NewEntityData) => {
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
                    brands: item.brands,
                })) 
                : [],
        };
        onSaveProspect(newProspectData);
        setIsAddModalOpen(false);
    };

    return (
        <motion.div
            className="flex-1 flex flex-col h-full overflow-hidden overflow-x-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Overlays */}
            {loading && data && <div className="text-center p-2 text-sm text-blue-500">Refreshing...</div>}
            {error && data && <div className="text-center p-2 text-sm text-red-600 bg-red-50 rounded">{error}</div>}
            
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
                className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-4 flex-shrink-0"
            >
                <h1 className="text-3xl font-bold text-[#202224] text-center xl:text-left">
                    Prospects
                </h1>

                <div className="flex flex-col md:flex-row flex-wrap md:items-center gap-3 w-full xl:w-auto justify-center xl:justify-end z-20 relative">
                    
                    {/* Search */}
                    <div className="relative">
                                <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-gray-500" />
                                <input
                                  type="search"
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  placeholder="Search by Name or Owner"
                                  className="block h-10 w-full md:w-64 border-transparent bg-gray-200 py-0 pl-10 pr-3 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-sm rounded-full"
                                />
                    </div>

                    {/* --- FILTERS SECTION (Multi-Select) --- */}
                    <div className="flex items-center gap-2 w-full md:w-auto z-30">
                        {/* Category Multi-Select */}
                        <div className="relative w-1/2 md:w-44">
                            <MultiSelectDropdown
                                label="Categories"
                                placeholder="All Categories"
                                options={categoriesData.map(c => c.name)}
                                selected={selectedCategories}
                                onChange={setSelectedCategories}
                            />
                        </div>

                        {/* Brand Multi-Select */}
                        <div className="relative w-1/2 md:w-44">
                            <MultiSelectDropdown
                                label="Brands"
                                placeholder="All Brands"
                                options={availableBrands}
                                selected={selectedBrands}
                                onChange={setSelectedBrands}
                                // Disabled prop removed to allow selection anytime
                            />
                        </div>
                    </div>

                    {/* Clear Filter Button (Replaced with Button component) */}
                    {(selectedCategories.length > 0 || selectedBrands.length > 0 || searchTerm) && (
                         <div className="w-full md:w-auto">
                             <Button 
                                onClick={clearFilters} 
                                variant="secondary" 
                                className="w-full md:w-auto flex items-center justify-center gap-2 whitespace-nowrap px-4"
                             >
                                <XMarkIcon className="h-4 w-4" />
                                Clear Filters
                             </Button>
                         </div>
                    )}

                    {/* Export Actions */}
                    <div className="flex-shrink-0">
                        <ExportActions 
                            onExportPdf={onExportPdf}
                            onExportExcel={onExportExcel}
                        />
                    </div>

                    {/* Add Button */}
                    <div className="w-full md:w-auto">
                        <Button onClick={() => setIsAddModalOpen(true)} className="w-full md:w-auto whitespace-nowrap">
                            Add New Prospect
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Content Area */}
            <motion.div
                variants={itemVariants}
                className="flex-1 flex flex-col overflow-hidden z-10"
            >
                {filteredProspect.length === 0 && !loading ? ( 
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300 mx-2">
                        <FunnelIcon className="h-10 w-10 mb-2 text-gray-400" />
                        <p className="text-lg font-medium">No prospects found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                        {(searchTerm || selectedCategories.length > 0 || selectedBrands.length > 0) && (
                             <button 
                                onClick={clearFilters}
                                className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-semibold hover:underline"
                             >
                                Clear all filters
                             </button>
                        )}
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
                                    <Button 
                                        onClick={() => goToPage(currentPage - 1)} 
                                        variant="secondary"
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <span className="font-semibold">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <Button 
                                        onClick={() => goToPage(currentPage + 1)} 
                                        variant="secondary"
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
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
                categoriesData={categoriesData} 
                onAddCategory={onAddCategory}
                onAddBrand={onAddBrand}
            />
        </motion.div>
    );
};

export default ProspectContent;