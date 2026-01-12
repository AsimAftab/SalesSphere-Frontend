import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import ProfileCard from '../../../components/UI/ProfileCard';
import AddEntityModal from '../../../components/Entities/AddEntityModal';
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

interface SiteContentProps {
    data: Site[] | null;
    loading: boolean;
    error: string | null;
    subOrgsList?: string[];
    onAddSubOrg?: (newOrg: string) => void;
    categoriesData?: any[];
}

const formatAddress = (fullAddress: string | undefined | null): string => {
    if (!fullAddress) return 'Address not available';
    const parts = fullAddress.split(',').map((part) => part.trim());
    if (parts.length > 2) {
        return parts.slice(1, 3).join(', ');
    } else if (parts.length === 2) {
        return parts[1];
    }
    return fullAddress;
};

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
        exportingStatus,

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
    if (error && !data) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;

    return (
        <motion.div className="flex-1 flex flex-col h-full overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Export Banner */}
            {exportingStatus && (
                <div className="w-full p-2 mb-2 text-center bg-blue-100 text-blue-800 rounded-lg text-sm animate-pulse">
                    Generating {exportingStatus.toUpperCase()}... Please wait.
                </div>
            )}

            {/* Enterprise Header */}
            <EntityHeader
                title="Sites"
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                isFilterActive={isFilterVisible}
                onFilterToggle={() => setIsFilterVisible(!isFilterVisible)}
                onExportPdf={permissions.canExportPdf ? () => handleExport('pdf') : undefined}
                onExportExcel={permissions.canExportExcel ? () => handleExport('excel') : undefined}
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
                    label="Technician"
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
                            address={formatAddress(site.address)}
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
