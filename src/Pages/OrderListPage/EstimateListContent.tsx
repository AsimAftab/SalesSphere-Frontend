import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/UI/Button/Button';
import ExportActions from '../../components/UI/ExportActions'; 
import ConfirmationModal from '../../components/modals/DeleteEntityModal'; 
import { MagnifyingGlassIcon, TrashIcon } from '@heroicons/react/24/outline';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Loader2 } from 'lucide-react';
import { deleteEstimate, bulkDeleteEstimates } from '../../api/estimateService'; 
import { toast } from 'react-hot-toast';
import EstimateListPDF from './EstimateListPDF'; // Added Import

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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selection and Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [selectedEstimateIds, setSelectedEstimateIds] = useState<string[]>([]);
  const [estimateToDelete, setEstimateToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const ITEMS_PER_PAGE = 10;

  const filteredEstimates = useMemo(() => {
    if (!data) return [];
    return data
      .filter(est => {
        const search = searchTerm.toLowerCase();
        return (
          (est.partyName || '').toLowerCase().includes(search) ||
          (est.estimateNumber || '').toLowerCase().includes(search) ||
          (est.createdBy?.name || '').toLowerCase().includes(search)
        );
      })
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredEstimates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentEstimates = filteredEstimates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // ✅ PDF EXPORT LOGIC (Open in New Tab)
  const handleExportPdf = async () => {
    if (filteredEstimates.length === 0) {
      toast.error("No estimates found to export");
      return;
    }

    const toastId = toast.loading("Preparing PDF view...");

    try {
      const { pdf } = await import('@react-pdf/renderer');
      const blob = await pdf(<EstimateListPDF estimates={filteredEstimates} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      toast.success("PDF opened in new tab!", { id: toastId });
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("Failed to open PDF", { id: toastId });
    }
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
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col">
      
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

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-2">
        <div>
          <h1 className="text-3xl font-bold text-[#202224]">Estimates</h1>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="search" 
              value={searchTerm} 
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
              placeholder="Search by Estimate or Party Name" 
              className="h-10 w-full bg-gray-200 border-none pl-10 pr-4 rounded-full text-sm shadow-sm outline-none focus:ring-2 focus:ring-secondary" />
          </div>

          <div className="flex items-center gap-3">
            {selectedEstimateIds.length > 0 && (
              <Button variant="danger" onClick={() => setBulkDeleteModalOpen(true)} className="whitespace-nowrap flex items-center gap-2">
                <TrashIcon className="h-5 w-5" /> Mass Delete ({selectedEstimateIds.length})
              </Button>
            )}

            {/* Attached PDF Handler */}
            <ExportActions onExportPdf={handleExportPdf} />

            <Button className="flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 shadow-md whitespace-nowrap">
              Create Estimate
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative">
        {loading && <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>}
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-secondary text-white text-xs  tracking-wider">
              <tr>
                <th className="px-5 py-3 text-left">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" checked={selectedEstimateIds.length > 0 && selectedEstimateIds.length === currentEstimates.length} onChange={toggleSelectAll} />
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
              {currentEstimates.length > 0 ? (
                currentEstimates.map((est, index) => (
                  <tr key={est._id || est.id} className={`${selectedEstimateIds.includes(est._id || est.id) ? 'bg-blue-50' : 'hover:bg-gray-200'} transition-colors`}>
                    <td className="px-5 py-3">
                      <input type="checkbox" checked={selectedEstimateIds.includes(est._id || est.id)} onChange={() => toggleSelectEstimate(est._id || est.id)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                    </td>
                    <td className="px-5 py-3 text-black text-sm">{startIndex + index + 1}</td>
                    <td className="px-5 py-3 text-black text-sm ">{est.estimateNumber}</td>
                    <td className="px-5 py-3 text-black text-sm">{est.partyName}</td>
                    <td className="px-5 py-3 text-black text-sm">{est.createdBy?.name || '-'}</td>
                    <td className="px-5 py-3 text-black text-sm ">RS {est.totalAmount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm">
                      <Link to={`/estimate/${est._id || est.id}`} className="text-blue-500 hover:underline font-semibold">View Details</Link>
                    </td>
                    <td className="px-5 py-3 ">
                      <button onClick={() => { setEstimateToDelete(est._id || est.id); setIsModalOpen(true); }} className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-all">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={8} className="text-center p-20 text-gray-500 font-medium">No estimates found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredEstimates.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50 bg-gray-50/50 text-sm text-gray-500">
            <p>Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredEstimates.length)} of {filteredEstimates.length}</p>
            <div className="flex gap-2">
              {currentPage > 1 && <Button onClick={() => setCurrentPage(p => p - 1)} variant="secondary">Previous</Button>}
              <span className="flex items-center px-4 font-semibold text-black">{currentPage} / {totalPages}</span>
              {currentPage < totalPages && <Button onClick={() => setCurrentPage(p => p + 1)} variant="secondary">Next</Button>}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const EstimateListSkeleton: React.FC = () => (
  <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
    <div className="p-4"><Skeleton height={40} count={5} className="mb-2" /></div>
  </SkeletonTheme>
);

export default EstimateListContent;