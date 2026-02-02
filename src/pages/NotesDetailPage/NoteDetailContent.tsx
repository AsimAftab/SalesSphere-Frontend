import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon, UserIcon, CalendarDaysIcon, DocumentTextIcon,
  TagIcon, UsersIcon, BuildingOffice2Icon,
} from '@heroicons/react/24/outline';
import type { Note } from "@/api/notesService";
import NoteImagesCard from './components/NoteImagesCard';
import { NoteDetailSkeleton } from './NoteDetailSkeleton';
import { formatDisplayDate } from '@/utils/dateUtils';
import { Button, InfoBlock } from '@/components/ui';

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
  if (error) return <div className="text-center p-10 text-red-600 font-bold">{error}</div>;
  if (!note) return <div className="text-center p-10 text-gray-500 font-bold">Note Not Found</div>;

  const entityType = note.partyName ? "Party" : note.prospectName ? "Prospect" : note.siteName ? "Site" : "General";
  const EntityIcon = note.partyName ? BuildingOffice2Icon : note.prospectName ? UsersIcon : note.siteName ? BuildingOffice2Icon : TagIcon;
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
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Note Details</h1>
              <p className="text-sm text-gray-500 font-medium mt-0.5">View and manage your note information</p>
            </div>
          </div>
          <div className="flex gap-3">
            {canEdit && (
              <Button variant="secondary" onClick={onEdit} className="font-bold">
                Edit Note
              </Button>
            )}
            {canDelete && (
              <Button variant="danger" onClick={onDelete} className="font-bold">
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
                  <DocumentTextIcon className="h-5 w-5 text-blue-600" />
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
                <InfoBlock icon={DocumentTextIcon} label="Title" value={note.title} />
                <InfoBlock icon={UserIcon} label="Created By" value={note.createdBy.name} />
                <InfoBlock icon={CalendarDaysIcon} label="Created Date" value={formatDisplayDate(note.createdAt)} />
                <InfoBlock icon={EntityIcon} label={`Linked ${entityType}`} value={entityName} />
              </div>

              {/* Description */}
              <div className="pt-6 border-t border-gray-100">
                <h4 className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 shrink-0">
                    <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <span className="font-medium text-gray-400 text-xs uppercase tracking-wider">
                    Description
                  </span>
                </h4>
                <p className="text-gray-900 font-bold text-sm pl-12">
                  {note.description}
                </p>
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