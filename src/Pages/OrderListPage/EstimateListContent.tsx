import React, { useState, useMemo} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/UI/Button/Button';
import ExportActions from '../../components/UI/ExportActions'; 
import ConfirmationModal from '../../components/modals/DeleteEntityModal'; 
import { MagnifyingGlassIcon, TrashIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Loader2 } from 'lucide-react';
import { deleteEstimate, bulkDeleteEstimates } from '../../api/estimateService'; 
import { toast } from 'react-hot-toast';
import EstimateListPDF from './EstimateListPDF';

// --- Reusable Filter Components ---
import FilterBar from '../../components/UI/FilterDropDown/FilterBar';
import FilterDropdown from '../../components/UI/FilterDropDown/FilterDropDown';

interface Estimate {
  id: string;
  _id: string;
  estimateNumber: string;
  partyName: string;
  totalAmount: number;
  dateTime: string;
  createdBy: { name: string };
}

interface EstimateListContentProps {
  data: Estimate[] | null;
  loading: boolean;
  error: string | null;
  onRefresh?: () => void; 
}

const containerVariants = { hidden: { opacity: 1 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const EstimateListContent: React.FC<EstimateListContentProps> = ({
  data, loading, error, onRefresh
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [selectedEstimateIds, setSelectedEstimateIds] = useState<string[]>([]);
  const [estimateToDelete, setEstimateToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Filter State ---
  const [filters, setFilters] = useState({
    parties: [] as string[],
    creators: [] as string[],
  });

  const ITEMS_PER_PAGE = 10;

  // --- Derived Options for Filters ---
  const availableParties = useMemo(() => {
    if (!data) return [];
    const names = data.map(est => est.partyName).filter(Boolean);
    return Array.from(new Set(names)).sort();
  }, [data]);

  const availableCreators = useMemo(() => {
    if (!data) return [];
    const names = data.map(est => est.createdBy?.name).filter(Boolean);
    return Array.from(new Set(names)).sort();
  }, [data]);

  const resetFilters = () => { 
    setFilters({ parties: [], creators: [] }); 
    setSearchTerm(''); 
    setCurrentPage(1);
    toast.success('Filters cleared'); 
  };

  const filteredEstimates = useMemo(() => {
    if (!data) return [];
    return data
      .filter(est => {
        const search = searchTerm.toLowerCase();
        const matchesSearch = (
          (est.partyName || '').toLowerCase().includes(search) ||
          (est.estimateNumber || '').toLowerCase().includes(search) ||
          (est.createdBy?.name || '').toLowerCase().includes(search)
        );

        const matchesParty = filters.parties.length === 0 || filters.parties.includes(est.partyName);
        const matchesCreator = filters.creators.length === 0 || (est.createdBy?.name && filters.creators.includes(est.createdBy.name));

        return matchesSearch && matchesParty && matchesCreator;
      })
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }, [data, searchTerm, filters]);

  const totalPages = Math.ceil(filteredEstimates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentEstimates = filteredEstimates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // ... (handleExportPdf, toggleSelectEstimate, toggleSelectAll, confirmSingleDelete, handleBulkDeleteConfirm logic remain the same) ...
  const handleExportPdf = async () => {
    if (filteredEstimates.length === 0) { toast.error("No estimates found to export"); return; }
    const toastId = toast.loading("Preparing PDF view...");
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const blob = await pdf(<EstimateListPDF estimates={filteredEstimates} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      toast.success("PDF opened in new tab!", { id: toastId });
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) { toast.error("Failed to open PDF", { id: toastId }); }
  };

  const toggleSelectEstimate = (id: string) => {
    setSelectedEstimateIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedEstimateIds.length > 0) {
      setSelectedEstimateIds([]);
    } else {
      setSelectedEstimateIds(currentEstimates.map(e => e._id || e.id));
    }
  };

  const confirmSingleDelete = async () => {
    if (!estimateToDelete) return;
    setIsDeleting(true);
    const loadingToast = toast.loading('Deleting estimate...');
    try {
      await deleteEstimate(estimateToDelete);
      toast.success('Estimate removed successfully', { id: loadingToast });
      setIsModalOpen(false);
      setEstimateToDelete(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('Could not delete estimate.', { id: loadingToast });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedEstimateIds.length === 0) return;
    setIsDeleting(true);
    const loadingToast = toast.loading(`Deleting ${selectedEstimateIds.length} estimates...`);
    try {
      await bulkDeleteEstimates(selectedEstimateIds);
      toast.success(`${selectedEstimateIds.length} estimates deleted`, { id: loadingToast });
      setSelectedEstimateIds([]);
      setBulkDeleteModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('Bulk deletion failed.', { id: loadingToast });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && !data) return <EstimateListSkeleton />;
  if (error && !data) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col overflow-x-hidden">
      
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Delete Estimate"
        message="Are you sure you want to delete this estimate?"
        confirmButtonText={isDeleting ? "Deleting..." : "Delete"}
        confirmButtonVariant="danger"
        onConfirm={confirmSingleDelete}
        onCancel={() => { setIsModalOpen(false); setEstimateToDelete(null); }}
      />

      <ConfirmationModal
        isOpen={isBulkDeleteModalOpen}
        title="Mass Delete Estimates"
        message={`Confirm deletion of ${selectedEstimateIds.length} selected items.`}
        confirmButtonText={isDeleting ? "Deleting..." : "Mass Delete"}
        confirmButtonVariant="danger"
        onConfirm={handleBulkDeleteConfirm}
        onCancel={() => setBulkDeleteModalOpen(false)}
      />

      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center gap-6 mb-8 px-1">
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-bold text-[#202224] whitespace-nowrap">Estimates</h1>
        </div>

        <div className="flex flex-row flex-wrap items-center justify-start lg:justify-end gap-6 w-full">
          <div className="relative w-full sm:w-64 lg:w-80">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="search" 
              value={searchTerm} 
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
              placeholder="Search Invoice/Party" 
              className="h-10 w-full bg-gray-200 border-none pl-10 pr-4 rounded-full text-sm shadow-sm outline-none focus:ring-2 focus:ring-secondary transition-all" 
            />
          </div>

          <div className="flex items-center gap-6">
            {selectedEstimateIds.length > 0 && (
              <Button variant="danger" onClick={() => setBulkDeleteModalOpen(true)} className="whitespace-nowrap flex items-center gap-2 h-10 px-3 text-sm">
                <TrashIcon className="h-5 w-5" /> 
                <span>Delete ({selectedEstimateIds.length})</span>
              </Button>
            )}

            <button 
              onClick={() => setIsFilterVisible(!isFilterVisible)} 
              className={`p-2.5 rounded-lg border transition-all ${isFilterVisible ? 'bg-secondary text-white shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              <FunnelIcon className="h-5 w-5" />
            </button>

            <ExportActions onExportPdf={handleExportPdf} />

            <Button 
              className="whitespace-nowrap text-sm px-4 h-10"
              onClick={() => navigate('/sales/create?type=estimate')}
            >
              Create Estimate
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <FilterBar 
        isVisible={isFilterVisible} 
        onClose={() => setIsFilterVisible(false)} 
        onReset={resetFilters}
      >
        <FilterDropdown 
          label="Party" 
          selected={filters.parties} 
          options={availableParties} 
          onChange={(val) => setFilters({...filters, parties: val})} 
          align="left" 
        />
        <FilterDropdown 
          label="Created By" 
          selected={filters.creators} 
          options={availableCreators} 
          onChange={(val) => setFilters({...filters, creators: val})} 
          align="left" 
        />
      </FilterBar>

      {/* Table Content */}
      <motion.div variants={itemVariants} className="relative">
        {loading && <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>}
        
        {filteredEstimates.length > 0 ? (
          <>
            <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-secondary text-white text-xs tracking-wider">
                    <tr>
                      <th className="px-5 py-3 text-left">
                        <input type="checkbox" className="rounded border-gray-300" checked={selectedEstimateIds.length > 0 && selectedEstimateIds.length === currentEstimates.length} onChange={toggleSelectAll} />
                      </th>
                      <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">S.NO.</th>
                      <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Estimate Number</th>
                      <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Party Name</th>
                      <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Created By</th>
                      <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Total Amount</th>
                      <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Details</th>
                      <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {currentEstimates.map((est, index) => (
                      <tr key={est._id || est.id} className={`${selectedEstimateIds.includes(est._id || est.id) ? 'bg-blue-50' : 'hover:bg-gray-200'} transition-colors`}>
                        <td className="px-5 py-3">
                          <input type="checkbox" checked={selectedEstimateIds.includes(est._id || est.id)} onChange={() => toggleSelectEstimate(est._id || est.id)} className="rounded" />
                        </td>
                        <td className="px-5 py-3 text-black text-sm">{startIndex + index + 1}</td>
                        <td className="px-5 py-3 text-black text-sm">{est.estimateNumber}</td>
                        <td className="px-5 py-3 text-black text-sm">{est.partyName}</td>
                        <td className="px-5 py-3 text-black text-sm">{est.createdBy?.name || '-'}</td>
                        <td className="px-5 py-3 text-black text-sm">RS {est.totalAmount.toLocaleString()}</td>
                        <td className="px-5 py-4 text-sm">
                          <Link to={`/estimate/${est._id || est.id}`} className="text-blue-500 hover:underline font-semibold">View Details</Link>
                        </td>
                        <td className="px-5 py-3">
                          <button onClick={() => { setEstimateToDelete(est._id || est.id); setIsModalOpen(true); }} className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4 px-1">
              {currentEstimates.map((est) => (
                <div key={est._id || est.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                       <input type="checkbox" checked={selectedEstimateIds.includes(est._id || est.id)} onChange={() => toggleSelectEstimate(est._id || est.id)} className="rounded mt-1" />
                       <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Estimate Number</span>
                          <span className="text-sm font-bold text-gray-900">{est.estimateNumber}</span>
                       </div>
                    </div>
                    <button onClick={() => { setEstimateToDelete(est._id || est.id); setIsModalOpen(true); }} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                        <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3">
                    <div className="col-span-2">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Party Name</span>
                      <span className="text-sm text-gray-800 font-medium">{est.partyName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Created By</span>
                      <span className="text-xs text-gray-600">{est.createdBy?.name || '-'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Amount</span>
                      <span className="text-sm font-bold text-secondary">RS {est.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="col-span-2 flex justify-end pt-2">
                      <Link to={`/estimate/${est._id || est.id}`} className="text-blue-500 text-xs font-bold hover:underline">View Details →</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center p-20 text-gray-500 font-medium bg-white rounded-lg border">No estimates found.</div>
        )}

        {/* Pagination */}
        {filteredEstimates.length > 0 && totalPages > 1 && (
          <div className="flex flex-row items-center justify-between p-4 sm:p-6 gap-2 text-sm text-gray-500">
            <p className="whitespace-nowrap text-xs sm:text-sm">
              Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredEstimates.length)} of {filteredEstimates.length}
            </p>
            <div className="flex items-center gap-1 sm:gap-2">
              {currentPage > 1 && <Button onClick={() => setCurrentPage(p => p - 1)} variant="secondary" className="px-2 py-1 text-xs">Prev</Button>}
              <span className="flex items-center px-2 font-semibold text-black whitespace-nowrap text-xs sm:text-sm">{currentPage} / {totalPages}</span>
              {currentPage < totalPages && <Button onClick={() => setCurrentPage(p => p + 1)} variant="secondary" className="px-2 py-1 text-xs">Next</Button>}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ... (EstimateListSkeleton remains the same) ...
const EstimateListSkeleton: React.FC = () => (
  <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
    <div className="flex-1 flex flex-col p-4 w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 px-1">
        <div className="flex-shrink-0">
          <Skeleton width={150} height={36} />
        </div>
        <div className="flex flex-row flex-wrap items-center justify-start gap-6 w-full lg:w-auto">
          <Skeleton height={40} width={280} borderRadius={999} />
          <div className="flex items-center gap-6">
            <Skeleton height={40} width={40} borderRadius={8} />
            <Skeleton height={40} width={130} borderRadius={8} />
          </div>
        </div>
      </div>
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 bg-gray-50">
          <Skeleton height={20} width="100%" />
        </div>
        <div className="divide-y divide-gray-100 p-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="px-5 py-4">
              <Skeleton height={30} borderRadius={4} />
            </div>
          ))}
        </div>
      </div>
      <div className="md:hidden space-y-4 px-1">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <Skeleton width={18} height={18} borderRadius={4} />
                <div>
                  <Skeleton width={80} height={10} className="mb-1" />
                  <Skeleton width={120} height={16} />
                </div>
              </div>
              <Skeleton width={24} height={24} borderRadius={999} />
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-3">
              <div>
                <Skeleton width={60} height={10} className="mb-1" />
                <Skeleton width={100} height={14} />
              </div>
              <div>
                <Skeleton width={60} height={10} className="mb-1" />
                <Skeleton width={80} height={14} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </SkeletonTheme>
);

export default EstimateListContent;