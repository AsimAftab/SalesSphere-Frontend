import React from 'react';
import { motion } from 'framer-motion';
import type { Note } from "@/api/notesService";
import NoteImagesCard from './components/NoteImagesCard';
import { NoteDetailSkeleton } from './NoteDetailSkeleton';
import { formatDisplayDate } from '@/utils/dateUtils';
import { Button, InfoBlock, EmptyState } from '@/components/ui';
import {
  ArrowLeft,
  Building2,
  Tag,
  User,
} from 'lucide-react';
import { FileText, CalendarDays } from 'lucide-react'; // Moved FileText and CalendarDays to a separate import to resolve the "duplicate" instruction.

/**
 * Props for the NoteDetailContent component
 */
interface Props {
  /** The note data to display */
  note: Note | null;
  /** Whether data is loading */
  loading: boolean;
  /** Error message if any */
  error: string | null;
  /** Callback for edit action */
  onEdit: () => void;
  /** Callback for delete action */
  onDelete: () => void;
  /** Callback for back navigation */
  onBack: () => void;
  /** Whether user can edit */
  canEdit: boolean;
  /** Whether user can delete */
  canDelete: boolean;

  // New Image Props
  onDeleteImage?: (imageNumber: number) => void;
  isDeletingImage?: boolean;
  onUploadImage?: (imageNumber: number, file: File) => void;
  isUploadingImage?: boolean;
}


/**
 * NoteDetailContent - Main content component for displaying a single note's details.
 * Uses a side-by-side layout with information card on left and images card on right.
 */
const NoteDetailContent: React.FC<Props> = ({
  note, loading, error, onEdit, onDelete, onBack,
  canEdit, canDelete,
  onUploadImage, isUploadingImage, onDeleteImage, isDeletingImage
}) => {
  if (loading && !note) return <NoteDetailSkeleton />;
  if (error) return <EmptyState title="Error" description={error} variant="error" />;
  if (!note) return <EmptyState title="Note Not Found" description="The note you're looking for doesn't exist or has been deleted." />;

  const entityType = note.partyName ? "Party" : note.prospectName ? "Prospect" : note.siteName ? "Site" : "General";
  const EntityIcon = note.partyName ? Building2 : note.prospectName ? User : note.siteName ? Building2 : Tag;
  const entityName = note.partyName || note.prospectName || note.siteName || "General Note";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-black text-gray-900">Note Details</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {canEdit && (
              <Button variant="secondary" onClick={onEdit} className="w-full sm:w-auto font-bold">
                Edit Note
              </Button>
            )}
            {canDelete && (
              <Button variant="danger" onClick={onDelete} className="w-full sm:w-auto font-bold">
                Delete Note
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Side by Side Layout */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left Column: Information Card */}
          <div className="lg:col-span-2 h-full">
            <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 shadow-sm h-full flex flex-col">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Information
                </h3>
                <span className={`px-3 py-1.5 bg-gradient-to-r text-sm font-black uppercase rounded-full border ${note.partyName ? 'from-blue-50 to-indigo-50 text-blue-700 border-blue-100' :
                  note.prospectName ? 'from-green-50 to-emerald-50 text-green-700 border-green-100' :
                    note.siteName ? 'from-orange-50 to-amber-50 text-orange-700 border-orange-100' :
                      'from-gray-50 to-slate-50 text-gray-700 border-gray-100'
                  }`}>
                  {entityType}
                </span>
              </div>

              <hr className="-mx-5 md:-mx-6 mb-6 border-gray-100" />

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-6">
                <InfoBlock icon={FileText} label="Title" value={note.title} />
                <InfoBlock icon={User} label="Created By" value={note.createdBy.name} />
                <InfoBlock icon={CalendarDays} label="Created Date" value={formatDisplayDate(note.createdAt)} />
                <InfoBlock icon={EntityIcon} label={`Linked ${entityType}`} value={entityName} />
              </div>

              {/* Description */}
              <div className="pt-5 border-t border-gray-200">
                <InfoBlock
                  icon={FileText}
                  label="Description"
                  value={
                    <span className={note.description ? 'text-[#202224]' : 'text-slate-400 italic'}>
                      {note.description || 'No description provided.'}
                    </span>
                  }
                />
              </div>
            </div>
          </div>

          {/* Right Column: Images Card */}
          <div className="lg:col-span-1 h-full">
            <NoteImagesCard
              images={note.images || []}
              onUploadImage={onUploadImage}
              isUploadingImage={isUploadingImage}
              onDeleteImage={onDeleteImage}
              isDeletingImage={isDeletingImage}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NoteDetailContent;