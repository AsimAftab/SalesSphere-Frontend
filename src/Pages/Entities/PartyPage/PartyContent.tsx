import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PartyCard from '../../../components/UI/ProfileCard/ProfileCard';
import AddEntityModal from '../../../components/modals/Entities/AddEntityModal';
import { BulkUploadPartiesModal } from '../../../components/modals/superadmin/BulkUploadParties/BulkUploadPartiesModal';
import FilterBar from '../../../components/UI/FilterDropDown/FilterBar';
import FilterDropdown from '../../../components/UI/FilterDropDown/FilterDropDown';
import Button from '../../../components/UI/Button/Button';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

// Shared enterprise components - Fixed casing to match "Shared" folder
import { useEntityManager } from '../Shared/useEntityManager';
import { EntityHeader } from '../Shared/components/EntityHeader';
import { EntityGrid } from '../Shared/components/EntityGrid';
import { EntityPagination } from '../Shared/components/EntityPagination';

// Ensure this file exists in the same directory
import PartyContentSkeleton from './PartyContentSkeleton';
import ErrorFallback from '../../../components/UI/ErrorBoundary/ErrorFallback';
import type { Party } from '../../../api/partyService';
import type { NewEntityData } from '../../../components/modals/Entities/AddEntityModal/types';

interface PartyContentProps {
  data: Party[] | null;
  partyTypesList: string[];
  loading: boolean;
  error: string | null;
  onSaveParty: (data: NewEntityData) => void;
  isCreating: boolean;
  onExportPdf: (data: Party[]) => void;
  onExportExcel: (data: Party[]) => void;
  organizationId: string;
  organizationName: string;
  onRefreshData: () => void;
  canCreate: boolean;
  canImport: boolean;
  canExport: boolean;
}

const PartyContent = ({
  data, partyTypesList, loading, error, onSaveParty, isCreating,
  onExportPdf, onExportExcel, organizationId,
  organizationName, onRefreshData,
  canCreate, canImport, canExport
}: PartyContentProps) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Capture filter=today on mount, then strip it from the URL
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = useRef(searchParams.get('filter'));
  const dateFilter = initialFilter.current === 'today' ? 'today' : null;

  // Pre-process data for filtering before passing to Entity Manager
  const processedData = useMemo(() => {
    if (!data) return [];
    if (dateFilter === 'today') {
      const todayStr = new Date().toDateString();
      return data.filter((p: Party) => {
        const d = p.createdAt ? new Date(p.createdAt) : null;
        return d && d.toDateString() === todayStr;
      });
    }
    return data;
  }, [data, dateFilter]);

  // Initialize Manager Hook with processed data
  const {
    searchTerm, setSearchTerm, activeFilters, setActiveFilters,
    currentPage, setCurrentPage, paginatedData, filteredData, resetFilters
  } = useEntityManager(processedData, ['companyName', 'ownerName']);

  useEffect(() => {
    // 1. Handle Type Filter
    const typeParam = searchParams.get('type');
    if (typeParam) {
      setActiveFilters((prev) => ({ ...prev, partyType: [typeParam] }));
      setIsFilterVisible(true);
    }

    // 2. Strip one-time filter param from URL
    if (searchParams.has('filter')) {
      searchParams.delete('filter');
      setSearchParams(searchParams, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading && !data) return (
    <PartyContentSkeleton
      canCreate={canCreate}
      canImport={canImport}
      canExport={canExport}
    />
  );
  if (error && !data) return <ErrorFallback error={error} />;

  return (
    <motion.div className="flex-1 flex flex-col h-full overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>


      <EntityHeader
        title="Parties"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isFilterActive={isFilterVisible}
        onFilterToggle={() => setIsFilterVisible(!isFilterVisible)}
        onExportPdf={canExport ? () => {
          if (filteredData.length === 0) {
            toast.error("No parties available to export");
            return;
          }
          onExportPdf(filteredData);
        } : undefined}
        onExportExcel={canExport ? () => {
          if (filteredData.length === 0) {
            toast.error("No parties available to export");
            return;
          }
          onExportExcel(filteredData);
        } : undefined}
        addButtonLabel="Add New Party"
        onAddClick={canCreate ? () => setIsAddModalOpen(true) : undefined}
      >
        {canImport && (
          <Button
            variant="secondary"
            onClick={() => setIsBulkModalOpen(true)}
            className="whitespace-nowrap flex items-center gap-2"
          >
            <ArrowUpTrayIcon className="w-5 h-5" />
            Upload
          </Button>
        )}
      </EntityHeader>

      {/* Filter Section */}
      <FilterBar isVisible={isFilterVisible} onReset={resetFilters} onClose={() => setIsFilterVisible(false)}>
        <FilterDropdown
          label="Party Type"
          options={partyTypesList}
          selected={activeFilters.partyType || []}
          onChange={(val) => setActiveFilters({ ...activeFilters, partyType: val })}
          showNoneOption={true}
        />
        <FilterDropdown
          label="Created By"
          options={Array.from(new Set(data?.map((p: Party) => p.createdBy?.name).filter(Boolean)))}
          selected={activeFilters.createdBy || []}
          onChange={(val) => setActiveFilters({ ...activeFilters, createdBy: val })}
        />
      </FilterBar>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6">
        <EntityGrid
          items={paginatedData}
          emptyMessage={
            searchTerm || (activeFilters.partyType && activeFilters.partyType.length > 0) ||
              (activeFilters.createdBy && activeFilters.createdBy.length > 0)
              ? "No parties match your current filters. Try adjusting your search criteria."
              : "No parties available. Create your first party to get started."
          }
          renderItem={(party: Party) => (
            <PartyCard
              key={party.id}
              {...party}
              basePath="/parties"
              title={party.companyName}
              address={party.address}
              cardType="party"
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

      {/* Modals & Loaders */}
      {isCreating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[9999]">
          <div className="bg-white px-8 py-6 rounded-lg shadow-lg flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="mt-3 font-semibold">Creating party...</span>
          </div>
        </div>
      )}

      <AddEntityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(modalData: NewEntityData) => onSaveParty(modalData)}
        title="Add New Party"
        entityType="Party"
        partyTypesList={partyTypesList}
        // ✅ Added missing required props
        nameLabel="Party Name"
        ownerLabel="Owner Name"
        panVatMode="required"
      />

      <BulkUploadPartiesModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        organizationId={organizationId}
        organizationName={organizationName}
        onUploadSuccess={onRefreshData}
      />
    </motion.div>
  );
};

export default PartyContent;