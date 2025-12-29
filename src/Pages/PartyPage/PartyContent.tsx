import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom'; 
import PartyCard from '../../components/UI/ProfileCard';
import Button from '../../components/UI/Button/Button';
import { type Party, type NewPartyData } from '../../api/partyService';
import AddEntityModal, { type NewEntityData } from '../../components/modals/AddEntityModal';
import { BulkUploadPartiesModal } from '../../components/modals/superadmin/BulkUploadPartiesModal'; 
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'; 
// ✅ FIX: Imported Upload from lucide-react as requested
import { Loader2, Upload } from 'lucide-react'; 
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ExportActions from '../../components/UI/ExportActions';

// --- New Reusable Components ---
import FilterBar from '../../components/UI/FilterDropDown/FilterBar';
import FilterDropdown from '../../components/UI/FilterDropDown/FilterDropDown';

interface PartyContentProps {
  data: Party[] | null;
  partyTypesList: string[]; 
  loading: boolean;
  error: string | null;
  onSaveParty: (data: NewPartyData) => void;
  isCreating: boolean;
  onExportPdf: (filteredData: Party[]) => void;
  onExportExcel: (filteredData: Party[]) => void;
  exportingStatus: 'pdf' | 'excel' | null;
  organizationId?: string;
  organizationName?: string;
  onRefreshData?: () => void;
}

const formatAddress = (fullAddress: string | undefined | null): string => {
  if (!fullAddress) return 'Address not available';
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

const isToday = (dateStr: string) => {
  if (!dateStr) return false;
  try {
    const date = new Date(dateStr);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  } catch (e) { return false; }
};

const containerVariants = { hidden: { opacity: 1 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const PartyContentSkeleton: React.FC = () => {
   const ITEMS_PER_PAGE = 12;
   return (
     <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
       <div className="flex-1 flex flex-col h-full overflow-hidden px-1 md:px-0">
         <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6 flex-shrink-0 px-1">
           <div className="flex-shrink-0"><Skeleton width={160} height={36} /></div>
           <div className="flex flex-row flex-wrap items-center justify-start lg:justify-end gap-6 w-full lg:w-auto">
             <Skeleton height={40} width={280} borderRadius={999} />
             <div className="flex flex-row items-center gap-6">
               <Skeleton width={42} height={42} borderRadius={8} />
               <Skeleton width={85} height={42} borderRadius={8} />
             </div>
             <Skeleton height={40} width={160} borderRadius={8} />
           </div>
         </div>
         <div className="flex-1 overflow-hidden">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-1 md:px-0">
             {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
               <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-lg flex flex-col items-center text-center h-full">
                 <div className="mb-4 flex-shrink-0"><Skeleton circle width={80} height={80} /></div>
                 <div className="w-full mb-1 flex justify-center"><Skeleton width="75%" height={24} containerClassName="w-full" /></div>
                 <div className="w-full mt-2 mb-2 flex justify-center"><Skeleton width="55%" height={18} containerClassName="w-full" /></div>
                 <div className="w-full flex flex-col items-center gap-1.5 px-2 mt-2">
                   <div className="w-full flex justify-center"><Skeleton width="90%" height={12} containerClassName="w-full" /></div>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </div>
     </SkeletonTheme>
   );
 };

const PartyContent: React.FC<PartyContentProps> = ({
  data,
  partyTypesList,
  loading,
  error,
  onSaveParty,
  isCreating,
  onExportPdf,
  onExportExcel,
  exportingStatus,
  organizationId,
  organizationName,
  onRefreshData
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false); 
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- Filter States ---
  const [isFilterVisible, setIsFilterVisible] = useState(false); 
  const [selectedPartyTypes, setSelectedPartyTypes] = useState<string[]>([]);
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);

  const ITEMS_PER_PAGE = 12;
  const location = useLocation();

  const filterParam = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('filter');
  }, [location.search]);

  const uniqueCreators = useMemo(() => {
    if (!data) return [];
    const creators = data
      .map((p: any) => p.createdBy?.name)
      .filter((name): name is string => Boolean(name));
    return Array.from(new Set(creators)).sort();
  }, [data]);

  const filteredParty = useMemo(() => {
    if (!data) return [];
    let filteredData = [...data];

    if (filterParam === 'today') {
      filteredData = filteredData.filter((party) => isToday(party.dateCreated));
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredData = filteredData.filter(
        (party) =>
          (party.ownerName?.toLowerCase() || '').includes(lowerSearchTerm) ||
          (party.companyName?.toLowerCase() || '').includes(lowerSearchTerm),
      );
    }

    if (selectedPartyTypes.length > 0) {
      filteredData = filteredData.filter((party: any) => 
        selectedPartyTypes.includes(party.partyType)
      );
    }

    if (selectedCreators.length > 0) {
      filteredData = filteredData.filter((party: any) => 
        selectedCreators.includes(party.createdBy?.name)
      );
    }

    return filteredData;
  }, [data, searchTerm, filterParam, selectedPartyTypes, selectedCreators]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterParam, selectedPartyTypes, selectedCreators]);

  if (loading && !data) return <PartyContentSkeleton />;
  if (error && !data) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;

  const totalPages = Math.ceil(filteredParty.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentParty = filteredParty.slice(startIndex, endIndex);

  const goToPage = (pageNumber: number) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPages || 1));
    setCurrentPage(newPage);
  };

  // ✅ FIX (image_3900e8): Changed onClearAll to onReset to match FilterBarProps
  const handleResetFilters = () => {
    setSelectedPartyTypes([]);
    setSelectedCreators([]);
    setSearchTerm('');
  };

  const handleAddParty = async (modalData: NewEntityData) => {
    const newPartyData: NewPartyData = {
      companyName: modalData.name,
      ownerName: modalData.ownerName,
      dateJoined: modalData.dateJoined || new Date().toISOString(),
      partyType: modalData.partyType, 
      address: modalData.address,
      email: modalData.email ?? '',
      phone: modalData.phone ?? '',
      panVat: modalData.panVat ?? '',
      latitude: modalData.latitude ?? null,
      longitude: modalData.longitude ?? null,
      description: modalData.description ?? '',
    };
    onSaveParty(newPartyData);
    setIsAddModalOpen(false);
  };

  return (
    <motion.div className="flex-1 flex flex-col h-full overflow-hidden overflow-x-hidden" variants={containerVariants} initial="hidden" animate="show">
      
      {loading && data && <div className="text-center p-2 text-sm text-blue-500">Refreshing...</div>}
      {error && data && <div className="text-center p-2 text-sm text-red-600 bg-red-50 rounded">{error}</div>}
      
      {/* ✅ FIX (image_4ad9c4): exportingStatus is now read and displayed correctly */}
      {exportingStatus && (
         <div className="w-full p-2 mb-2 text-center bg-blue-100 text-blue-800 rounded-lg text-sm">
           Generating {exportingStatus === 'pdf' ? 'PDF' : 'Excel'}... Please wait.
         </div>
      )}

      {isCreating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[9999]">
          <div className="flex flex-col items-center bg-white px-8 py-6 rounded-lg shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="mt-3 text-gray-800 font-semibold">Creating party...</span>
          </div>
        </div>
      )}

      {/* --- Action Header --- */}
      <motion.div variants={itemVariants} className="flex flex-col xl:flex-row xl:items-center justify-between mb-6 gap-4 flex-shrink-0">
        <h1 className="text-3xl font-bold text-[#202224] text-center xl:text-left">Parties</h1>
        
        <div className="flex flex-col md:flex-row md:items-center gap-3 w-full xl:w-auto justify-center xl:justify-end">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Name or Owner"
              className="h-10 w-full bg-gray-100 border border-gray-200 pl-10 pr-4 rounded-full text-sm shadow-sm outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-center">
            <button 
              type="button"
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className={`p-2.5 rounded-lg border transition-all ${isFilterVisible ? 'bg-secondary text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              <FunnelIcon className="h-5 w-5" />
            </button>

            <ExportActions 
              onExportPdf={() => onExportPdf(filteredParty)} 
              onExportExcel={() => onExportExcel(filteredParty)} 
            />

            <Button variant="primary" onClick={() =>setIsBulkUploadModalOpen(true)} className="whitespace-nowrap flex items-center gap-2">
              <Upload className="h-5 w-5" /> Bulk Upload
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)} className="whitespace-nowrap">
              Add New Party
            </Button>
          </div>
        </div>
      </motion.div>

      {/* --- Filter Section --- */}
      {/* ✅ FIX (image_3900e8): Corrected props isVisible, onClose, onReset */}
      <FilterBar 
        isVisible={isFilterVisible} 
        onClose={() => setIsFilterVisible(false)} 
        onReset={handleResetFilters}
      >
        {/* ✅ FIX (image_3900e8): Corrected props selected and onChange */}
        <FilterDropdown
          label="Party Type"
          options={partyTypesList}
          selected={selectedPartyTypes}
          onChange={setSelectedPartyTypes}
        />
        <FilterDropdown
          label="Created By"
          options={uniqueCreators}
          selected={selectedCreators}
          onChange={setSelectedCreators}
        />
      </FilterBar>

      {/* --- Grid View --- */}
      <motion.div variants={itemVariants} className="flex-1 flex flex-col overflow-hidden">
        {filteredParty.length === 0 && !loading ? (
          <div className="text-center p-10 text-gray-500">
            No parties found matching your current selection.
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2 md:px-0">
                {currentParty.map((party) => (
                  <PartyCard
                    key={party.id}
                    id={party.id}
                    basePath="/parties"
                    title={party.companyName}
                    ownerName={party.ownerName}
                    address={formatAddress(party.address)}
                    cardType="party"
                    imageUrl={party.image || `https://placehold.co/150x150/197ADC/ffffff?text=${party.companyName.charAt(0)}`}
                  />
                ))}
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex-shrink-0 flex items-center justify-between mt-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
                <p>Showing {startIndex + 1} - {Math.min(endIndex, filteredParty.length)} of {filteredParty.length}</p>
                <div className="flex items-center gap-x-2">
                  {currentPage > 1 && <Button onClick={() => goToPage(currentPage - 1)} variant="secondary">Previous</Button>}
                  <span className="font-semibold">{currentPage} / {totalPages}</span>
                  {currentPage < totalPages && <Button onClick={() => goToPage(currentPage + 1)} variant="secondary">Next</Button>}
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      <AddEntityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddParty}
        title="Add New Party"
        nameLabel="Party Name"
        ownerLabel="Owner Name"
        panVatMode="required"
        entityType='Party'
        partyTypesList={partyTypesList}
      />

      <BulkUploadPartiesModal 
        isOpen={isBulkUploadModalOpen}
        onClose={() => setIsBulkUploadModalOpen(false)}
        organizationId={organizationId} 
        organizationName={organizationName} 
        onUploadSuccess={() => onRefreshData?.()}
      />
    </motion.div>
  );
};

export default PartyContent;