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
  BanknotesIcon,
  ArrowUpTrayIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

import Button from '../../components/UI/Button/Button';
import InfoBlock from '../../components/UI/Page/InfoBlock';
import { type Expense, type CreateExpenseRequest } from "../../api/expensesService";
import { type Party } from "../../api/partyService";
import ImagePreviewModal from '../../components/modals/CommonModals/ImagePreviewModal';
import ConfirmationModal from '../../components/modals/CommonModals/ConfirmationModal';
import { ExpenseDetailSkeleton } from './ExpenseDetailSkeleton';
import { formatDisplayDate } from '../../utils/dateUtils';

// --- Types ---
interface ExpenseDetailContentProps {
  data: {
    expense: Expense | undefined;
    categories: string[];
    parties: Party[];
  };
  state: {
    isLoading: boolean;
    error: string | null;
    isSaving: boolean;
    isDeleting: boolean;
    isRemovingReceipt: boolean;
    isUploadingReceipt?: boolean;
    activeModal: 'edit' | 'delete' | null;
  };
  actions: {
    update: (formData: Partial<CreateExpenseRequest>, file: File | null) => Promise<Expense>;
    delete: () => void;
    removeReceipt: () => void;
    uploadReceipt?: (file: File) => void;
    openEditModal: () => void;
    openDeleteModal: () => void;
    closeModal: () => void;
  };
  permissions: {
    canUpdate: boolean;
    canDelete: boolean;
    isAdmin?: boolean;
  };
  onBack: () => void;
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

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span className={`px-3 py-1 text-sm font-black uppercase tracking-widest rounded-full border ${STATUS_STYLES[status.toLowerCase()] || STATUS_STYLES.pending}`}>
    {status}
  </span>
);

// --- Main Component ---
const ExpenseDetailContent: React.FC<ExpenseDetailContentProps> = ({
  data, state, actions, permissions, onBack
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { expense } = data;

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File is too large. Max 5MB.');
        return;
      }
      if (actions.uploadReceipt) {
        actions.uploadReceipt(file);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const modalImages = useMemo(() =>
    expense?.images?.map((url, idx) => ({
      url,
      description: 'Expense Receipt',
      imageNumber: idx + 1 // Use 1-based to avoid falsy 0 check in Modal
    })) || [], [expense]);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsPreviewOpen(true);
  };

  if (state.isLoading && !expense) return <ExpenseDetailSkeleton permissions={permissions} />;

  if (state.error) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-2xl m-4 font-bold border border-red-100">{state.error}</div>;
  if (!expense) return <div className="text-center p-10 text-gray-500 font-black uppercase tracking-widest">Details Not Found</div>;

  return (
    <motion.div className="relative space-y-6" variants={containerVariants} initial="hidden" animate="show">

      {/* Top Header Actions */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-black text-[#202224]">Expense Details</h1>
        </div>
        <div className="flex flex-row gap-3">
          {permissions?.canUpdate && (
            <Button
              variant="secondary"
              onClick={() => {
                if (expense.status !== 'pending') {
                  toast.error('Cannot edit an expense that has been processed.');
                  return;
                }
                actions.openEditModal();
              }}
              className="h-11 px-6 font-bold shadow-sm"
            >
              Edit Expense
            </Button>
          )}
          {permissions?.canDelete && (
            <Button
              variant="danger"
              onClick={() => {
                if (expense.status !== 'pending') {
                  const isRejectedAndAdmin = expense.status === 'rejected' && permissions?.isAdmin;
                  if (!isRejectedAndAdmin) {
                    toast.error('Cannot delete an expense that has been processed.');
                    return;
                  }
                }
                actions.openDeleteModal();
              }}
              className="h-11 px-6 font-bold shadow-sm"
            >
              Delete Expense
            </Button>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Left Card: Info (60% width) */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                <DocumentTextIcon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-black text-black">Expense Information</h3>
            </div>
            <StatusBadge status={expense.status} />
          </div>

          <hr className="border-gray-200 -mx-5 md:-mx-6 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-8">
            <InfoBlock icon={DocumentTextIcon} label="Title" value={expense.title} />
            <InfoBlock icon={UserIcon} label="Submitted By" value={expense.createdBy.name} />
            <InfoBlock icon={CalendarDaysIcon} label="Incurred Date" value={formatDisplayDate(expense.incurredDate)} />
            <InfoBlock icon={BanknotesIcon} label="Amount" value={`RS ${expense.amount.toLocaleString('en-IN')}`} />
            <InfoBlock icon={CheckBadgeIcon} label="Reviewer" value={expense.approvedBy?.name || 'Under Review'} />
            <InfoBlock icon={TagIcon} label="Category" value={expense.category} />
            <InfoBlock icon={CalendarDaysIcon} label="Entry Date" value={formatDisplayDate(expense.entryDate)} />
            <InfoBlock icon={IdentificationIcon} label="Party" value={(() => {
              if (expense.party && typeof expense.party === 'object' && expense.party.companyName) return expense.party.companyName;
              if (typeof expense.party === 'string') { const partyId = expense.party as string; return data.parties.find(opt => opt.id === partyId)?.companyName || 'N/A'; }
              return 'N/A';
            })()} />
          </div>

          <hr className="border-gray-200 -mx-5 md:-mx-6 mt-4" />

          <div className="pt-8">
            <h4 className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 shrink-0">
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
              </div>
              <span className="font-medium text-gray-400 text-xs uppercase tracking-wider">
                Description
              </span>
            </h4>
            <p className="text-black font-bold text-sm leading-relaxed pl-12">
              {expense.description || 'No additional justifications provided for this expense entry.'}
            </p>
          </div>
        </div>

        {/* Right Card: Receipt (40% width) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shrink-0 text-blue-600">
                <PhotoIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 leading-none">
                  Expense Receipt
                </h3>
                <p className="text-xs font-medium text-gray-500 mt-1">
                  ({expense.receipt ? '1' : '0'} / 1 uploaded)
                </p>
              </div>
            </div>

            {/* Upload Button */}
            {permissions?.canUpdate && actions.uploadReceipt && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelected}
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp"
                  aria-label="Upload receipt"
                />
                <Button
                  variant="primary"
                  onClick={() => {
                    if (expense.status !== 'pending') {
                      toast.error('Cannot upload receipt to a processed expense.');
                      return;
                    }
                    handleUploadClick();
                  }}
                  className="h-9 px-3 text-xs"
                  disabled={state.isUploadingReceipt || !!expense.receipt}
                >
                  {state.isUploadingReceipt ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ArrowUpTrayIcon className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  {state.isUploadingReceipt ? 'Uploading...' : !!expense.receipt ? 'Limit Reached' : 'Upload Image'}
                </Button>
              </>
            )}
          </div>

          {/* Content */}
          <div className="px-6 pb-6 flex-1 flex flex-col">
            {expense.receipt ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-square rounded-lg overflow-hidden group">
                  <img
                    src={expense.receipt}
                    alt="Receipt Proof"
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => handleImageClick(0)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all" />
                  <button
                    onClick={() => handleImageClick(0)}
                    className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Preview image"
                  >
                    <PhotoIcon className="w-8 h-8" />
                  </button>

                  {/* Delete Button */}
                  {permissions?.canUpdate && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (expense.status !== 'pending') {
                          toast.error('Cannot delete receipt from a processed expense.');
                          return;
                        }
                        setIsDeleteConfirmOpen(true);
                      }}
                      disabled={state.isRemovingReceipt}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 disabled:opacity-50 z-10"
                      title="Delete Receipt"
                    >
                      {state.isRemovingReceipt ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <TrashIcon className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50 flex-grow">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <PhotoIcon className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900">No receipt attached</p>
                <p className="text-xs text-gray-500 mt-1">Upload via 'Upload Image' button</p>
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
        onDeleteImage={permissions?.canUpdate ? () => {
          if (expense.status !== 'pending') {
            toast.error('Cannot delete receipt from a processed expense.');
            return;
          }
          setIsPreviewOpen(false);
          setIsDeleteConfirmOpen(true);
        } : undefined}
        isDeletingImage={state.isRemovingReceipt}
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        title="Delete Receipt"
        message="Are you sure you want to permanently remove this receipt?"
        onConfirm={() => {
          actions.removeReceipt();
          setIsDeleteConfirmOpen(false);
        }}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        confirmButtonVariant="danger"
        confirmButtonText={state.isRemovingReceipt ? "Deleting..." : "Delete Receipt"}
      />
    </motion.div>
  );
};

export default ExpenseDetailContent;