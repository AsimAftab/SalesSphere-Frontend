import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ProspectCard from '../../../components/UI/ProfileCard/ProfileCard';
import AddEntityModal from '../../../components/modals/Entities/AddEntityModal';
import FilterBar from '../../../components/UI/FilterDropDown/FilterBar';
import FilterDropdown from '../../../components/UI/FilterDropDown/FilterDropDown';

// Shared enterprise components
import { EntityHeader } from '../Shared/components/EntityHeader';
import { EntityGrid } from '../Shared/components/EntityGrid';
import { EntityPagination } from '../Shared/components/EntityPagination';
import ProspectContentSkeleton from './ProspectContentSkeleton';
import ErrorFallback from '../../../components/UI/ErrorBoundary/ErrorFallback';
import type { Prospect, ProspectCategoryData } from '../../../api/prospectService';
import type { NewEntityData } from '../../../components/modals/Entities/AddEntityModal/types';

interface ProspectPermissions {
    canCreate: boolean;
    canExportPdf: boolean;
    canExportExcel: boolean;
}

interface ProspectEntityManager {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    activeFilters: Record<string, string[]>;
    setActiveFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
    currentPage: number;
    setCurrentPage: (val: number) => void;
    paginatedData: Prospect[];
    filteredData: Prospect[];
    resetFilters: () => void;
}

interface ProspectContentProps {
    data: Prospect[] | null;
    categoriesData: ProspectCategoryData[];
    availableBrands: string[];
    loading: boolean;
    error: string | null;
    onSaveProspect: (data: NewEntityData) => Promise<void>;
    isCreating: boolean;
    onExportPdf: (data: Prospect[]) => void;
    onExportExcel: (data: Prospect[]) => void;
    exportingStatus?: any;
    permissions: ProspectPermissions;
    entityManager: ProspectEntityManager;
}

const ProspectContent = ({
    data,
    categoriesData,
    availableBrands,
    loading,
    error,
    onSaveProspect,
    isCreating,
    onExportPdf,
    onExportExcel,
    permissions,
    entityManager
}: ProspectContentProps) => {
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchParams] = useSearchParams();

    // ✅ Use the entityManager from props instead of local initialization.
    // This allows the 'Category' selection here to update 'availableBrands' in the parent.
    const {
        searchTerm,
        setSearchTerm,
        activeFilters,
        setActiveFilters,
        currentPage,
        setCurrentPage,
        paginatedData,
        filteredData,
        resetFilters
    } = entityManager;

    // ✅ Sync Filters from URL (e.g. ?brand=Hettich)
    useEffect(() => {
        const brandParam = searchParams.get('brand');
        if (brandParam) {
            setActiveFilters((prev) => ({ ...prev, brands: [brandParam] }));
            setIsFilterVisible(true);
        }
    }, [searchParams, setActiveFilters]);

    // Standard safety checks
    if (loading && !data) return <ProspectContentSkeleton />;
    if (error && !data) return <ErrorFallback error={error as any} />;

    return (
        <motion.div
            className="flex-1 flex flex-col h-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >

            {/* Enterprise Header */}
            <EntityHeader
                title="Prospects"
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                isFilterActive={isFilterVisible}
                onFilterToggle={() => setIsFilterVisible(!isFilterVisible)}
                onExportPdf={permissions?.canExportPdf ? () => {
                    if (filteredData.length === 0) {
                        toast.error("No prospects available to export");
                        return;
                    }
                    onExportPdf(filteredData);
                } : undefined}
                onExportExcel={permissions?.canExportExcel ? () => {
                    if (filteredData.length === 0) {
                        toast.error("No prospects available to export");
                        return;
                    }
                    onExportExcel(filteredData);
                } : undefined}
                addButtonLabel={permissions?.canCreate ? "Add New Prospect" : ""}
                onAddClick={() => setIsAddModalOpen(true)}
            />

            {/* Filter Section */}
            <FilterBar
                isVisible={isFilterVisible}
                onReset={resetFilters}
                onClose={() => setIsFilterVisible(false)}
            >
                <FilterDropdown
                    label="Created By"
                    options={Array.from(new Set(data?.map((p: Prospect) => p.createdBy?.name).filter(Boolean))) as string[] || []}
                    selected={activeFilters.createdBy || []}
                    onChange={(val) => setActiveFilters({ ...activeFilters, createdBy: val })}
                />

                <FilterDropdown
                    label="Category"
                    options={categoriesData?.map((c: ProspectCategoryData) => c.name) || []}
                    selected={activeFilters.category || []}
                    onChange={(val) => setActiveFilters({ ...activeFilters, category: val })}
                    showNoneOption={true}
                />

                <FilterDropdown
                    label="Brand"
                    options={availableBrands || []}
                    selected={activeFilters.brands || []}
                    onChange={(val) => setActiveFilters({ ...activeFilters, brands: val })}
                    showNoneOption={true}
                />

            </FilterBar>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6">
                <EntityGrid
                    items={paginatedData}
                    emptyMessage={
                        searchTerm || (activeFilters.category && activeFilters.category.length > 0) ||
                            (activeFilters.brands && activeFilters.brands.length > 0) ||
                            (activeFilters.createdBy && activeFilters.createdBy.length > 0)
                            ? "No prospects match your current filters. Try adjusting your search criteria."
                            : "No prospects available. Create your first prospect to get started."
                    }
                    renderItem={(prospect: Prospect) => (
                        <ProspectCard
                            key={prospect.id}
                            {...prospect}
                            basePath="/prospects"
                            title={prospect.name}
                            address={prospect.address}
                            cardType="prospect"
                        />
                    )}
                />
            </div>

            {/* Standardized Pagination */}
            <EntityPagination
                current={currentPage}
                totalItems={filteredData.length}
                itemsPerPage={12}
                onPageChange={setCurrentPage}
            />

            {/* Loading Overlay */}
            {isCreating && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[9999]">
                    <div className="bg-white px-8 py-6 rounded-lg shadow-lg flex flex-col items-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <span className="mt-3 font-semibold">Creating prospect...</span>
                    </div>
                </div>
            )}

            <AddEntityModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={onSaveProspect}
                title="Add New Prospect"
                entityType="Prospect"
                categoriesData={categoriesData || []}
                nameLabel="Prospect Name"
                ownerLabel="Owner Name"
                panVatMode="optional"
            />
        </motion.div>
    );
};

export default ProspectContent;