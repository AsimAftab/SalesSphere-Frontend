import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon, UserIcon, CalendarDaysIcon, DocumentTextIcon,
  TagIcon, UsersIcon, BuildingOffice2Icon,
} from '@heroicons/react/24/outline';
import Button from '../../components/UI/Button/Button';
import type { Note } from "../../api/notesService";
import NoteImagesCard from './components/NoteImagesCard';
import { NoteDetailSkeleton } from './NoteDetailSkeleton';
import { formatDisplayDate } from '../../utils/dateUtils';

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
 * Icon type for InfoRow component
 */
type HeroIcon = React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & { title?: string; titleId?: string }>;

/**
 * InfoRow - Displays a labeled value with an icon
 */
const InfoRow: React.FC<{ icon: HeroIcon; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 group">
    <div className="p-2.5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 group-hover:border-blue-200 group-hover:from-blue-50 group-hover:to-blue-100 transition-all duration-300">
      <Icon className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
    </div>
    <div className="flex-1 min-w-0">
      <span className="font-semibold text-gray-400 block text-xs uppercase tracking-wider mb-1">{label}</span>
      <span className="text-gray-900 font-bold text-sm truncate block">{value || 'N/A'}</span>
    </div>
  </div>
);

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
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors border border-transparent hover:border-gray-200"
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
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm h-full flex flex-col">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black flex items-center gap-2">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                  Information
                </h3>
                <span className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm font-black uppercase rounded-full border border-blue-100">
                  {entityType}
                </span>
              </div>

              <hr className="-mx-8 mb-6 border-gray-100" />

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                <InfoRow icon={DocumentTextIcon} label="Title" value={note.title} />
                <InfoRow icon={UserIcon} label="Created By" value={note.createdBy.name} />
                <InfoRow icon={CalendarDaysIcon} label="Created Date" value={formatDisplayDate(note.createdAt)} />
                <InfoRow icon={EntityIcon} label={`Linked ${entityType}`} value={entityName} />
              </div>

              {/* Description */}
              <div className="flex-1 pt-6 border-t border-gray-100">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Description</h4>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-gray-900 font-bold text-sm">
                    {note.description}
                  </p>
                </div>
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