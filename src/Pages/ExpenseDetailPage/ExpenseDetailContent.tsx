import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  UserIcon, 
  CalendarDaysIcon, 
  TagIcon, 
  DocumentTextIcon, 
  CheckBadgeIcon,
  IdentificationIcon,
  PhotoIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

import Button from '../../components/UI/Button/Button';
import { type Expense } from "../../api/expensesService";
import ImagePreviewModal from '../../components/modals/ImagePreviewModal';
import { ExpenseDetailSkeleton } from './ExpenseDetailSkeleton'; 

// --- Types ---
interface ExpenseDetailContentProps {
  expense: Expense | null;
  loading: boolean;
  error: string | null;
  onEdit?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
  onDeleteReceipt?: () => Promise<void> | void;
}

// --- Constants & Styles ---
const STATUS_STYLES: Record<string, string> = {
  approved: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

// --- Sub-Components ---
const InfoRow: React.FC<{ 
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; 
  label: string; 
  value: string | number; 
}> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 bg-gray-50 rounded-lg shrink-0 border border-gray-100">
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <div>
      <span className="font-medium text-gray-400 block text-sm leading-tight mb-0.5">{label}</span>
      <span className="text-[#202224] font-bold text-sm">{value || 'N/A'}</span>
    </div>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${STATUS_STYLES[status.toLowerCase()] || STATUS_STYLES.pending}`}>
    {status}
  </span>
);

// --- Main Component ---
const ExpenseDetailContent: React.FC<ExpenseDetailContentProps> = ({ 
  expense, loading, error, onEdit, onDelete, onBack 
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const modalImages = useMemo(() => 
    expense?.images?.map((url, idx) => ({
      url,
      description: `Audit Proof ${idx + 1}`,
    })) || [], [expense]);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsPreviewOpen(true);
  };

  /**
   * REFACTORED LOADING STATE:
   * Replaced the simple spinner with the layout-matched skeleton loader.
   */
  if (loading && !expense) return <ExpenseDetailSkeleton />;
  
  if (error) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-2xl m-4 font-bold border border-red-100">{error}</div>;
  if (!expense) return <div className="text-center p-10 text-gray-500 font-black uppercase tracking-widest">Details Not Found</div>;

  return (
    <motion.div className="relative space-y-6" variants={containerVariants} initial="hidden" animate="show">
      
      {/* Top Header Actions */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="hover:text-blue-600 transition-colors">
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-black text-[#202224]">Expense Details</h1>
        </div>
        <div className="flex flex-row gap-3">
          <Button variant="secondary" onClick={onEdit} className="h-11 px-6 font-bold shadow-sm">Edit Expense</Button>
           {/* <Button variant="danger" onClick={onDelete} className="h-11 px-6 font-bold shadow-sm">Delete Expense</Button>*/}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Card: Info (60% width) */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                <DocumentTextIcon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-black text-black">Expense Information</h3>
            </div>
            <StatusBadge status={expense.status} />
          </div>

          <hr className="border-gray-200 -mx-8 mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 mb-10">
            <InfoRow icon={DocumentTextIcon} label="Title" value={expense.title} />
            <InfoRow icon={UserIcon} label="Submitted By" value={expense.createdBy.name} />
            <InfoRow icon={CalendarDaysIcon} label="Incurred Date" value={expense.incurredDate} />
            <InfoRow icon={BanknotesIcon} label="Amount" value={`RS ${expense.amount.toLocaleString('en-IN')}`} />
            <InfoRow icon={CheckBadgeIcon} label="Reviewer" value={expense.approvedBy?.name || 'Under Review'} />
            <InfoRow icon={TagIcon} label="Category" value={expense.category} />
            <InfoRow icon={CalendarDaysIcon} label="Entry Date" value={expense.entryDate} />
            <InfoRow icon={IdentificationIcon} label="Party" value={expense.party?.companyName || 'N/A'} />
          </div>
          
          <hr className="border-gray-200 -mx-8 mt-4" />

          <div className="pt-8">
            <h4 className="text-sm font-black text-gray-400 mb-4 flex items-center gap-2">
              <DocumentTextIcon className="w-4 h-4" /> Description
            </h4>
            <p className="text-black font-bold text-sm leading-relaxed">
              "{expense.description || 'No additional justifications provided for this audit entry.'}"
            </p>
          </div>
        </div>

        {/* Right Card: Receipt (40% width) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full group">
          <div className="p-5 border-b border-gray-200 bg-white flex items-center justify-between">
            <h3 className="text-sm font-black text-[#202224] flex items-center gap-2 leading-none">
              <PhotoIcon className="w-4 h-4 text-blue-600" /> Receipt Image
            </h3>
          </div>
          
          <div className="flex-1 bg-white relative min-h-[400px] overflow-hidden">
            {expense.receipt ? (
              <div className="absolute inset-0 p-4">
                <img 
                  src={expense.receipt} 
                  alt="Receipt Proof" 
                  className="w-full h-full object-cover rounded-xl cursor-pointer hover:opacity-95 transition-all shadow-sm ring-1 ring-black/5"
                  onClick={() => handleImageClick(0)}
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 space-y-2">
                <PhotoIcon className="w-12 h-12 opacity-20" />
                <p className="text-sm font-bold text-gray-500">No Receipt Attached</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Supporting Evidence */}
      {expense.images && expense.images.length > 1 && (
        <motion.div variants={itemVariants} className="pt-4 px-1">
          <h3 className="text-xl font-black text-[#202224] uppercase tracking-tight mb-6 flex items-center gap-3">
            <DocumentTextIcon className="h-6 w-6 text-blue-600" /> Supporting Evidence
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {expense.images.map((img, idx) => (
              <div key={idx} className="aspect-square rounded-[1.5rem] overflow-hidden border-4 border-white shadow-sm hover:shadow-xl cursor-pointer group relative transition-all">
                <img 
                  src={img} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  onClick={() => handleImageClick(idx)}
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <ImagePreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        images={modalImages} 
        initialIndex={currentImageIndex} 
      />
    </motion.div>
  );
};

export default ExpenseDetailContent;