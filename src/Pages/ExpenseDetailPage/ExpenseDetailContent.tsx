import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, User, Tag, FileText, Clock, CheckCircle2, ArrowLeft,
  Image as ImageIcon, Edit2, Trash2, Building2, CheckCircle, XCircle, 
  AlertCircle, type LucideIcon 
} from 'lucide-react';

import Button from '../../components/UI/Button/Button';
import { type Expense } from "../../api/expensesService";
import ImagePreviewModal from '../../components/modals/ImagePreviewModal';

// ISP: Interface only contains props strictly used for rendering
interface ExpenseDetailContentProps {
  expense: Expense | null;
  loading: boolean;
  error: string | null;
  onEdit?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
}

interface DetailTileProps {
  icon: LucideIcon;
  label: string;
  value: string | number | undefined;
  colorClass?: string;
  bgClass?: string;
}

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

/**
 * SRP: Reusable data tile sub-component
 */
const DetailTile: React.FC<DetailTileProps> = ({ 
  icon: Icon, label, value, colorClass = "text-blue-600", bgClass = "bg-blue-50" 
}) => (
  <div className="flex items-center gap-4 p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
    <div className={`w-12 h-12 ${bgClass} rounded-2xl flex items-center justify-center shrink-0`}>
      <Icon className={`w-6 h-6 ${colorClass}`} />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-sm font-bold text-[#202224] truncate">{value || 'Not Specified'}</p>
    </div>
  </div>
);

const ExpenseDetailContent: React.FC<ExpenseDetailContentProps> = ({ 
  expense, 
  loading, 
  error, 
  onEdit, 
  onDelete, 
  onBack 
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const modalImages = useMemo(() => 
    expense?.images?.map((url, idx) => ({
      url,
      description: `Audit Proof ${idx + 1}`,
    })) || [], [expense]);

  if (loading && !expense) return (
    <div className="p-20 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-gray-400 font-black uppercase text-xs">Accessing Audit Records...</p>
    </div>
  );

  if (error) return <div className="text-center p-12 text-red-600 bg-red-50 rounded-3xl m-8 border border-red-100 font-bold shadow-sm">{error}</div>;
  if (!expense) return <div className="text-center p-20 text-gray-400 font-black uppercase tracking-widest">Record Not Found</div>;

  const statusColors: Record<string, any> = {
    approved: { bg: "bg-green-500", text: "text-white", icon: CheckCircle },
    rejected: { bg: "bg-red-500", text: "text-white", icon: XCircle },
    pending: { bg: "bg-amber-500", text: "text-white", icon: AlertCircle },
  };

  const currentStatus = statusColors[expense.status.toLowerCase()] || statusColors.pending;

  return (
    <motion.div className="p-4 md:p-6 max-w-full mx-auto w-full space-y-10" variants={containerVariants} initial="hidden" animate="show">
      
      {/* HEADER SECTION: Standardized Enterprise Header */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
        <div className="flex items-center gap-5">
           <button onClick={onBack} className="p-3 rounded-2xl bg-white shadow-sm border border-gray-100 hover:border-blue-400 transition-all hover:bg-blue-50 group">
             <ArrowLeft size={22} className="text-gray-500 group-hover:text-blue-600" />
           </button>
           <h1 className="text-3xl font-black text-[#202224] tracking-tight uppercase">Audit Record</h1>
        </div>
        
        {/* Actions are always visible; backend handles authorization */}
        <div className="flex flex-row flex-wrap items-center gap-3">
          <Button variant="secondary" onClick={onEdit} className="h-11 px-8 font-bold shadow-lg shadow-blue-100 flex items-center gap-2">
            <Edit2 size={16} /> Edit Record
          </Button>
          <Button variant="danger" onClick={onDelete} className="h-11 px-8 font-bold shadow-lg shadow-red-100 flex items-center gap-2">
            <Trash2 size={16} /> Purge Entry
          </Button>
        </div>
      </motion.div>

      {/* INFORMATION GRID: Full-page layout */}
      <div className="space-y-8">
        <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12 bg-gradient-to-r from-gray-50/30 to-white border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className={`px-4 py-1.5 rounded-full ${currentStatus.bg} ${currentStatus.text} flex items-center gap-2 font-black uppercase text-[10px] tracking-widest shadow-md`}>
                     <currentStatus.icon size={14} strokeWidth={3} /> {expense.status}
                   </div>
                   <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-gray-200">Ref: {expense.id.slice(-8)}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-[#202224] leading-tight">{expense.title}</h2>
             </div>
             <div className="md:text-right bg-[#197ADC] p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-blue-200 min-w-[320px]">
                <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em] mb-1">Settlement Amount</p>
                <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">RS {expense.amount.toLocaleString('en-IN')}</h3>
             </div>
          </div>

          <div className="p-8 md:p-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <DetailTile icon={Calendar} label="Date of Occurrence" value={expense.incurredDate} colorClass="text-orange-500" bgClass="bg-orange-50" />
            <DetailTile icon={Building2} label="Linked Entity" value={expense.party?.companyName || 'NA'} colorClass="text-indigo-500" bgClass="bg-indigo-50" />
            <DetailTile icon={User} label="Requester" value={expense.createdBy.name} colorClass="text-blue-500" bgClass="bg-blue-50" />
            <DetailTile icon={Clock} label="System Entry Date" value={expense.entryDate} colorClass="text-emerald-500" bgClass="bg-emerald-50" />
            <DetailTile icon={CheckCircle2} label="Authorized By" value={expense.approvedBy?.name || 'Under Review'} colorClass="text-purple-500" bgClass="bg-purple-50" />
            <DetailTile icon={Tag} label="Expense Category" value={expense.category} colorClass="text-pink-500" bgClass="bg-pink-50" />
          </div>

          <div className="px-8 md:px-12 pb-12">
             <div className="p-10 rounded-[3rem] bg-gray-50 border border-gray-100 relative group overflow-hidden">
                <FileText size={84} className="absolute -top-4 -right-4 text-gray-200/40 transition-transform duration-700 group-hover:scale-110" />
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Submission Context</h4>
                <p className="text-gray-700 leading-relaxed font-bold italic text-xl relative z-10">
                  "{expense.description || "No additional justifications provided."}"
                </p>
             </div>
          </div>
        </motion.div>

        {/* EVIDENCE LOGS: Documentation proof grid */}
        <motion.div variants={itemVariants} className="space-y-6 pb-10">
          <h3 className="text-2xl font-black text-[#202224] tracking-tight px-4 flex items-center gap-3">
             <ImageIcon size={28} className="text-[#197ADC]" /> Evidence Logs
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-1">
            {expense.images && expense.images.length > 0 ? (
              expense.images.map((img: string, idx: number) => (
                <div 
                  key={idx} 
                  className="group relative aspect-[4/3] rounded-[3rem] overflow-hidden border-4 border-white shadow-lg cursor-pointer transition-all hover:-translate-y-2 hover:shadow-2xl"
                  onClick={() => { setCurrentImageIndex(idx); setIsPreviewOpen(true); }}
                >
                  <img src={img} alt="Evidence" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <span className="bg-white/20 backdrop-blur-xl p-4 rounded-[1.5rem] border border-white/30 text-white text-[10px] font-black uppercase tracking-widest shadow-xl">Verify Proof</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-24 bg-white rounded-[3.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center shadow-inner">
                 <ImageIcon size={48} className="text-gray-300 mb-4" />
                 <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Documentation Missing</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <ImagePreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} images={modalImages} initialIndex={currentImageIndex} />
    </motion.div>
  );
};

export default ExpenseDetailContent;