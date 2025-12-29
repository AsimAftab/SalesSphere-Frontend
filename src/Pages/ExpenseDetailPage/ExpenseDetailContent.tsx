import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  Tag,  
  FileText, 
  Clock, 
  CheckCircle2, 
  ArrowLeft,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'; 
import 'react-loading-skeleton/dist/skeleton.css'; 

import Button from '../../components/UI/Button/Button';
import { type Expense } from "../../api/expensesService";
import ImagePreviewModal from '../../components/modals/ImagePreviewModal';

// --- PROPS INTERFACE ---
interface ExpenseDetailContentProps {
  expense: Expense | null;
  loading: boolean;
  error: string | null;
  onDeleteRequest?: () => void;
  onStatusChange?: (status: 'approved' | 'rejected') => void;
}

// Framer Motion Variants
const containerVariants = { hidden: { opacity: 1 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

// --- SKELETON LOADER ---
const ExpenseDetailsSkeleton: React.FC = () => (
  <SkeletonTheme baseColor="#e6e6e6" highlightColor="#f0f0f0">
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between mb-8"><Skeleton width={200} height={40} /><Skeleton width={300} height={40} /></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6"><Skeleton height={120} /><Skeleton height={350} /></div>
        <div className="lg:col-span-1"><Skeleton height={500} /></div>
      </div>
    </div>
  </SkeletonTheme>
);

const InfoItem = ({ icon: Icon, label, value, colorClass = "text-blue-600", bgClass = "bg-blue-50" }: any) => (
  <div className="flex items-start gap-3">
    <div className={`w-10 h-10 ${bgClass} rounded-lg flex items-center justify-center shrink-0`}>
      <Icon className={`w-5 h-5 ${colorClass}`} />
    </div>
    <div>
      <span className="font-medium text-gray-500 text-xs block uppercase tracking-wider">{label}</span>
      <span className="text-gray-900 font-semibold">{value || 'N/A'}</span>
    </div>
  </div>
);

const ExpenseDetailContent: React.FC<ExpenseDetailContentProps> = ({ 
  expense, 
  loading, 
  error, 
  onStatusChange 
}) => {
  const navigate = useNavigate();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const modalImages = useMemo(() => 
    expense?.images?.map((url, idx) => ({
      url,
      description: `Expense Proof ${idx + 1}`,
    })) || [], [expense]);

  if (loading && !expense) return <ExpenseDetailsSkeleton />;
  if (error) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg m-8">{error}</div>;
  if (!expense) return <div className="text-center p-10 text-gray-500">Expense data not found.</div>;

  const statusColors: any = {
    approved: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle, border: "border-green-200" },
    rejected: { bg: "bg-red-100", text: "text-red-700", icon: XCircle, border: "border-red-200" },
    pending: { bg: "bg-amber-100", text: "text-amber-700", icon: AlertCircle, border: "border-amber-200" },
  };

  const currentStatus = statusColors[expense.status.toLowerCase()] || statusColors.pending;

  return (
    <motion.div 
      className="p-4 md:p-8 max-w-7xl mx-auto w-full"
      variants={containerVariants} 
      initial="hidden" 
      animate="show"
    >
      {/* Header Actions */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expense Details</h1>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {expense.status === 'pending' && (
            <>
              <Button variant="secondary" onClick={() => onStatusChange?.('approved')} className="bg-green-600 hover:bg-green-700 text-white border-none">
                <CheckCircle size={18} className="mr-2" /> Approve
              </Button>
              <Button variant="outline" onClick={() => onStatusChange?.('rejected')} className="text-red-600 border-red-200 hover:bg-red-50">
                <XCircle size={18} className="mr-2" /> Reject
              </Button>
            </>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns: Main Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Hero Summary Card */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6 items-center">
            
            <div className="flex-1 text-center md:text-left">
                 <p className="text-lg font-medium text-gray-600">{expense.title}</p>
              <h2 className="text-2xl font-black text-gray-900 mb-1">RS {expense.amount.toLocaleString('en-IN')}</h2>
             
            </div>
            <div className={`px-4 py-2 rounded-xl border ${currentStatus.border} ${currentStatus.bg} ${currentStatus.text} flex items-center gap-2 font-bold uppercase tracking-wider text-xs`}>
              <currentStatus.icon size={16} />
              {expense.status}
            </div>
          </motion.div>

          {/* Details Grid Card */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <FileText size={18} className="text-blue-600" /> Detailed Information
              </h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoItem icon={Tag} label="Category" value={expense.category} colorClass="text-purple-600" bgClass="bg-purple-50" />
              <InfoItem icon={Calendar} label="Date Incurred" value={expense.incurredDate} colorClass="text-orange-600" bgClass="bg-orange-50" />
              <InfoItem icon={User} label="Submitted By" value={expense.createdBy.name} colorClass="text-blue-600" bgClass="bg-blue-50" />
              <InfoItem icon={Clock} label="Submission Date" value={expense.entryDate} colorClass="text-gray-600" bgClass="bg-gray-50" />
              <InfoItem icon={CheckCircle2} label="Reviewed By" value={expense.reviewedBy?.name || 'Pending Review'} colorClass="text-green-600" bgClass="bg-green-50" />
            </div>

            <div className="p-8 pt-0">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <DocumentTextIcon className="w-4 h-4" /> Description / Notes
                </h4>
                <p className="text-gray-700 leading-relaxed italic">
                  "{expense.description || "No specific notes provided for this expense claim."}"
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Attachments */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-full min-h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <ImageIcon size={18} className="text-indigo-600" /> Proof of Expense
              </h3>
              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                {expense.images?.length || 0} Files
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-1">
              {expense.images && expense.images.length > 0 ? (
                expense.images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 shadow-sm cursor-pointer"
                    onClick={() => { setCurrentImageIndex(idx); setIsPreviewOpen(true); }}
                  >
                    <img src={img} alt="Receipt" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/90 p-2 rounded-full shadow-lg">
                        <ImageIcon size={20} className="text-gray-900" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <ImageIcon size={48} className="text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No attachments provided</p>
                  <p className="text-xs text-gray-400 mt-1">Receipts or invoices are missing.</p>
                </div>
              )}
            </div>

          </motion.div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        images={modalImages} 
        initialIndex={currentImageIndex} 
      />
    </motion.div>
  );
};

// Simple utility for Document Icon if not imported
const DocumentTextIcon = ({className}: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

export default ExpenseDetailContent;