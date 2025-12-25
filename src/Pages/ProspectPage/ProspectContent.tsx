import React, { useState, useMemo, useEffect, useRef } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import ProfileCard from '../../components/UI/ProfileCard';
import Button from '../../components/UI/Button/Button';
import { type Prospect, type NewProspectData, type ProspectCategoryData } from '../../api/prospectService';
import AddEntityModal, { type NewEntityData } from '../../components/modals/AddEntityModal';
import { MagnifyingGlassIcon, FunnelIcon, ChevronDownIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ExportActions from '../../components/UI/ExportActions';
import toast from 'react-hot-toast';

// --- Types & Interfaces ---
interface ProspectContentProps {
    data: Prospect[] | null;
    loading: boolean;
    error: string | null;
    onSaveProspect: (data: NewProspectData) => void;
    isCreating: boolean;
    // ✅ Updated: Now expects the IDs of the filtered data
    onExportPdf: (filteredIds: string[]) => void;
    onExportExcel: (filteredIds: string[]) => void;
    exportingStatus: 'pdf' | 'excel' | null;
    categoriesData?: ProspectCategoryData[]; 
    onAddCategory?: (category: string) => void;
    onAddBrand?: (brand: string) => void;
}

interface FilterDropdownProps {
    label: string;
    options: string[];
    selected: string[];
    onChange: (values: string[]) => void;
}

// Site-Style Filter Dropdown
const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options, selected, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggleOption = (option: string) => {
        const newSelected = selected.includes(option)
            ? selected.filter((item) => item !== option)
            : [...selected, option];
        onChange(newSelected);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 font-semibold text-sm text-white/90 hover:text-white transition-colors group"
            >
                <span>{label}</span>
                {selected.length > 0 && (
                    <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        {selected.length}
                    </span>
                )}
                <ChevronDownIcon className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-3 w-56 bg-white rounded-lg shadow-2xl py-2 z-[100] border border-gray-100 overflow-hidden"
                    >
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            {options.length === 0 ? (
                                <div className="px-4 py-2 text-xs text-gray-400 italic">No options available</div>
                            ) : (
                                options.map((opt) => (
                                    <label
                                        key={opt}
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors group"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(opt)}
                                            onChange={() => handleToggleOption(opt)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span className="text-sm text-gray-700 group-hover:text-blue-700 truncate">{opt}</span>
                                    </label>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const formatAddress = (fullAddress: string | undefined | null): string => {
    if (!fullAddress) return 'Address not available';
    const parts = fullAddress.split(',').map((part) => part.trim());
    if (parts.length > 2) return parts.slice(1, 3).join(', ');
    return parts.length === 2 ? parts[1] : fullAddress;
};

const containerVariants = { hidden: { opacity: 1 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

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
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // --- Filter States ---
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedCreators, setSelectedCreators] = useState<string[]>([]);

    const ITEMS_PER_PAGE = 12;

    const availableCreators = useMemo(() => {
        if (!data) return [];
        const names = data
            .map((prospect) => (prospect as any).createdBy?.name)
            .filter(Boolean);
        return Array.from(new Set(names)).sort() as string[];
    }, [data]);

    const availableBrands = useMemo(() => {
        let relevantCategories = categoriesData;
        if (selectedCategories.length > 0) {
            relevantCategories = categoriesData.filter(c => selectedCategories.includes(c.name));
        }
        const allBrands = relevantCategories.flatMap(c => c.brands);
        return Array.from(new Set(allBrands)).sort();
    }, [selectedCategories, categoriesData]);

    useEffect(() => {
        setSelectedBrands(prev => prev.filter(b => availableBrands.includes(b)));
    }, [selectedCategories, availableBrands]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategories, selectedBrands, selectedCreators]);

    const filteredProspect = useMemo(() => {
        if (!data) return [];
        const lowerSearchTerm = searchTerm.toLowerCase();

        return data.filter((prospect) => {
            const matchesSearch = 
                (prospect.ownerName?.toLowerCase() || '').includes(lowerSearchTerm) ||
                (prospect.name?.toLowerCase() || '').includes(lowerSearchTerm);

            if (!matchesSearch) return false;

            if (selectedCreators.length > 0) {
                const creatorName = (prospect as any).createdBy?.name;
                if (!creatorName || !selectedCreators.includes(creatorName)) return false;
            }

            if (selectedCategories.length > 0) {
                const hasMatchingCategory = prospect.interest?.some(
                    (item) => item.category && selectedCategories.includes(item.category.trim())
                );
                if (!hasMatchingCategory) return false;
            }

            if (selectedBrands.length > 0) {
                const prospectBrands = prospect.interest?.flatMap(item => item.brands || []) || [];
                const hasMatchingBrand = prospectBrands.some(brand => selectedBrands.includes(brand.trim()));
                if (!hasMatchingBrand) return false;
            }

            return true;
        });
    }, [data, searchTerm, selectedCategories, selectedBrands, selectedCreators]);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategories([]);
        setSelectedBrands([]);
        setSelectedCreators([]);
        toast.success('Filters cleared');
    };

    if (loading && !data) return <ProspectContentSkeleton />;
    if (error && !data) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;

    const totalPages = Math.ceil(filteredProspect.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentProspect = filteredProspect.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
        <motion.div className="flex-1 flex flex-col h-full overflow-hidden" variants={containerVariants} initial="hidden" animate="show">
            
            {exportingStatus && (
                <div className="w-full p-2 mb-2 text-center bg-blue-100 text-blue-800 rounded-lg text-sm z-50 font-bold animate-pulse">
                    Generating {exportingStatus.toUpperCase()} report... Please wait.
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
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-shrink-0">
                <h1 className="text-3xl font-bold text-[#202224]">Prospects</h1>

                <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Name or Owner"
                            className="h-10 w-full bg-gray-200 border-none pl-10 pr-4 rounded-full text-sm shadow-sm outline-none focus:ring-2 focus:ring-secondary"
                        />
                    </div>
                    
                    <button 
                        type="button"
                        onClick={() => setIsFilterVisible(!isFilterVisible)}
                        className={`p-2.5 rounded-lg border transition-all ${isFilterVisible ? 'bg-secondary text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                    >
                        <FunnelIcon className="h-5 w-5" />
                    </button>

                    {/* ✅ FIXED: Passing current filteredProspect IDs to Parent Handlers */}
                    <ExportActions 
                        onExportPdf={() => onExportPdf(filteredProspect.map(p => p.id))} 
                        onExportExcel={() => onExportExcel(filteredProspect.map(p => p.id))} 
                    />

                    <Button onClick={() => setIsAddModalOpen(true)} className="whitespace-nowrap bg-blue-600 text-white">
                        Add New Prospect
                    </Button>
                </div>
            </motion.div>

            {/* Expandable Filter Bar */}
            <AnimatePresence>
                {isFilterVisible && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-visible mb-6">
                        <div className="bg-primary rounded-xl p-5 text-white flex flex-wrap items-center gap-12 shadow-xl relative z-[60]">
                            <div className="flex items-center gap-3 text-sm font-semibold border-r border-white/20 pr-6">
                                <FunnelIcon className="h-4 w-4 text-white/70" />
                                <span>Filter By</span>
                            </div>

                            <FilterDropdown label="Created By" options={availableCreators} selected={selectedCreators} onChange={setSelectedCreators} />
                            <FilterDropdown label="Category" options={categoriesData.map(c => c.name)} selected={selectedCategories} onChange={setSelectedCategories} />
                            <FilterDropdown label="Brand" options={availableBrands} selected={selectedBrands} onChange={setSelectedBrands} />

                            <button 
                                type="button"
                                onClick={clearFilters}
                                className="ml-auto flex items-center gap-2 text-[#FF9E66] hover:text-[#ffb285] transition-colors text-sm font-bold uppercase tracking-wider"
                            >
                                <ArrowPathIcon className="h-4 w-4" /> Reset Filter
                            </button>
                            <button onClick={() => setIsFilterVisible(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors ml-2">
                                 <XMarkIcon className="h-4 w-4 text-white/40 hover:text-white" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Grid Content */}
            <motion.div variants={itemVariants} className="flex-1 flex flex-col overflow-hidden">
                {filteredProspect.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed mx-2">
                        <FunnelIcon className="h-10 w-10 mb-2 opacity-20" />
                        <p className="text-lg font-medium">No prospects found matching your criteria</p>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6 custom-scrollbar px-2 md:px-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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

                        {/* ✅ FIXED PAGINATION: Showing Previous/Next only when valid */}
                        {totalPages > 1 && (
                            <div className="flex-shrink-0 flex items-center justify-between mt-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
                                <p>Showing {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredProspect.length)} of {filteredProspect.length}</p>
                                <div className="flex items-center gap-x-2">
                                    {currentPage > 1 && (
                                        <Button onClick={() => setCurrentPage(prev => prev - 1)} variant="secondary">Previous</Button>
                                    )}
                                    <span className="font-bold bg-gray-100 px-4 py-1.5 rounded-md text-black">{currentPage} / {totalPages}</span>
                                    {currentPage < totalPages && (
                                        <Button onClick={() => setCurrentPage(prev => prev + 1)} variant="secondary">Next</Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </motion.div>

            <AddEntityModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddProspect}
                title="Add New Prospect"
                nameLabel="Prospect Name"
                ownerLabel="Owner Name"
                panVatMode="optional"
                entityType="Prospect"
                categoriesData={categoriesData} 
                onAddCategory={onAddCategory}
                onAddBrand={onAddBrand}
            />
        </motion.div>
    );
};

const ProspectContentSkeleton: React.FC = () => {
    const ITEMS_PER_PAGE = 12;
    return (
        <SkeletonTheme baseColor="#e6e6e6" highlightColor="#f0f0f0">
            <div className="flex-1 flex flex-col h-full overflow-hidden p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <Skeleton width={150} height={40} />
                    <div className="flex gap-4">
                        <Skeleton width={250} height={40} borderRadius={20} />
                        <Skeleton width={40} height={40} />
                        <Skeleton width={120} height={40} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                        <div key={i} className="bg-white p-4 rounded-lg border border-gray-200">
                            <Skeleton circle width={64} height={64} className="mx-auto mb-4" />
                            <Skeleton count={3} />
                        </div>
                    ))}
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default ProspectContent;