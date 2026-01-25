import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ProfileCard from '../../../components/UI/ProfileCard/ProfileCard';
import AddEntityModal from '../../../components/modals/Entities/AddEntityModal';
import FilterBar from '../../../components/UI/FilterDropDown/FilterBar';
import FilterDropdown from '../../../components/UI/FilterDropDown/FilterDropDown';
import { type Site } from '../../../api/siteService';

// Shared enterprise components
import { EntityHeader } from '../Shared/components/EntityHeader';
import { EntityGrid } from '../Shared/components/EntityGrid';
import { EntityPagination } from '../Shared/components/EntityPagination';

// Local components & hooks
import SiteContentSkeleton from './SiteContentSkeleton';
import { useSiteContent } from './useSiteContent';
import ErrorFallback from '../../../components/UI/ErrorBoundary/ErrorFallback';

interface SiteContentProps {
    data: Site[] | null;
    loading: boolean;
    error: string | null;
    subOrgsList?: string[];
    onAddSubOrg?: (newOrg: string) => void;
    categoriesData?: any[];
}

const SiteContent: React.FC<SiteContentProps> = ({
    data,
    loading,
    error,
    subOrgsList = [],
    onAddSubOrg,
    categoriesData = [],
}) => {
    const {
        // State
        searchTerm, setSearchTerm,
        isFilterVisible, setIsFilterVisible,
        filters, setFilters,
        currentPage, setCurrentPage,
        isAddModalOpen, setIsAddModalOpen,

        // Data
        paginatedData,
        filteredDataCount,

        // Options
        availableCreators,
        availableBrands,
        availableTechnicians,

        // Actions
        resetAllFilters,
        handleAddSite,
        handleExport,
        isCreating,
        itemsPerPage,
        permissions
    } = useSiteContent(data, categoriesData, onAddSubOrg);

    if (loading && !data) return (
        <SiteContentSkeleton
            canCreate={permissions.canCreate}
            canExportPdf={permissions.canExportPdf}
            canExportExcel={permissions.canExportExcel}
        />
    );
    if (error && !data) return <ErrorFallback error={new Error(error)} />;

    return (
        <motion.div className="flex-1 flex flex-col h-full overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* Enterprise Header */}
            <EntityHeader
                title="Sites"
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                isFilterActive={isFilterVisible}
                onFilterToggle={() => setIsFilterVisible(!isFilterVisible)}
                onExportPdf={permissions.canExportPdf ? () => {
                    if (filteredDataCount === 0) { // Using Count or paginatedData check
                        toast.error("No sites available to export");
                        return;
                    }
                    handleExport('pdf');
                } : undefined}
                onExportExcel={permissions.canExportExcel ? () => {
                    if (filteredDataCount === 0) {
                        toast.error("No sites available to export");
                        return;
                    }
                    handleExport('excel');
                } : undefined}
                addButtonLabel={permissions.canCreate ? "Add New Site" : ""}
                onAddClick={() => permissions.canCreate && setIsAddModalOpen(true)}
            />

            {/* Filter Section */}
            <FilterBar isVisible={isFilterVisible} onReset={resetAllFilters} onClose={() => setIsFilterVisible(false)}>
                <FilterDropdown
                    label="Created By"
                    options={availableCreators}
                    selected={filters.creators}
                    onChange={(val) => setFilters({ ...filters, creators: val })}
                />
                <FilterDropdown
                    label="Sub Organization"
                    options={subOrgsList}
                    selected={filters.subOrgs}
                    onChange={(val) => setFilters({ ...filters, subOrgs: val })}
                />
                <FilterDropdown
                    label="Category"
                    options={categoriesData.map((c: any) => c.name)}
                    selected={filters.categories}
                    onChange={(val) => setFilters({ ...filters, categories: val })}
                    showNoneOption
                />
                <FilterDropdown
                    label="Brand"
                    options={availableBrands}
                    selected={filters.brands}
                    onChange={(val) => setFilters({ ...filters, brands: val })}
                    showNoneOption
                />
                <FilterDropdown
                    label="Site Contact"
                    options={availableTechnicians}
                    selected={filters.technicians}
                    onChange={(val) => setFilters({ ...filters, technicians: val })}
                    showNoneOption
                />
            </FilterBar>

            {/* Scrollable Grid */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6">
                <EntityGrid
                    items={paginatedData}
                    emptyMessage={
                        searchTerm || Object.values(filters).some((arr) => arr.length > 0)
                            ? 'No sites match your current filters. Try adjusting your search criteria.'
                            : 'No sites available. Create your first site to get started.'
                    }
                    renderItem={(site: Site) => (
                        <ProfileCard
                            key={site.id}
                            id={site.id}
                            basePath="/sites"
                            title={site.name}
                            ownerName={site.ownerName}
                            address={site.address}
                            cardType="site"
                        />
                    )}
                />
            </div>

            {/* Pagination */}
            <EntityPagination
                current={currentPage}
                totalItems={filteredDataCount}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />

            {/* Creating Loader */}
            {isCreating && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[9999]">
                    <div className="bg-white px-8 py-6 rounded-lg shadow-lg flex flex-col items-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <span className="mt-3 font-semibold">Creating site...</span>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            <AddEntityModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddSite}
                title="Add New Site"
                nameLabel="Site Name"
                ownerLabel="Owner Name"
                panVatMode="hidden"
                entityType="Site"
                subOrgsList={subOrgsList}
                onAddSubOrg={onAddSubOrg}
                categoriesData={categoriesData}
            />
        </motion.div>
    );
};

export default SiteContent;
