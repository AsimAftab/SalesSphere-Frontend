import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon, UserIcon, CalendarDaysIcon, DocumentTextIcon,
  TagIcon, UsersIcon, BuildingOffice2Icon,
} from '@heroicons/react/24/outline';
import Button from '../../components/UI/Button/Button';
import { type Note } from "../../api/notesService";
import ImagePreviewModal from '../../components/modals/ImagePreviewModal';
import { NoteDetailSkeleton } from './NoteDetailSkeleton';

interface Props {
  note: Note | null;
  loading: boolean;
  error: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
  canEdit: boolean;
  canDelete: boolean;
}

const InfoRow: React.FC<{ icon: any; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 bg-gray-50 rounded-lg border border-gray-100"><Icon className="h-5 w-5 text-gray-400" /></div>
    <div>
      <span className="font-medium text-gray-400 block text-xs uppercase tracking-wider mb-0.5">{label}</span>
      <span className="text-[#202224] font-bold text-sm">{value || 'N/A'}</span>
    </div>
  </div>
);

const NoteDetailContent: React.FC<Props> = ({
  note, loading, error, onEdit, onDelete, onBack,
  canEdit, canDelete
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const gallery = useMemo(() => note?.images?.map((img, i) => ({
    url: img.imageUrl,
    description: `Attachment ${i + 1}`
  })) || [], [note]);

  if (loading && !note) return <NoteDetailSkeleton />;
  if (error) return <div className="text-center p-10 text-red-600 font-bold">{error}</div>;
  if (!note) return <div className="text-center p-10 text-gray-500 font-bold">Note Not Found</div>;

  const entityType = note.partyName ? "Party" : note.prospectName ? "Prospect" : note.siteName ? "Site" : "General";
  const EntityIcon = note.partyName ? BuildingOffice2Icon : note.prospectName ? UsersIcon : note.siteName ? BuildingOffice2Icon : TagIcon;
  const entityName = note.partyName || note.prospectName || note.siteName || "General Note";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeftIcon className="h-5 w-5" /></button>
          <h1 className="text-2xl font-black text-[#202224]">Note Details</h1>
        </div>
        <div className="flex gap-3">
          {canEdit && (
            <Button variant="secondary" onClick={onEdit} className="font-bold">Edit Note</Button>
          )}
          {canDelete && (
            <Button variant="danger" onClick={onDelete} className="font-bold">Delete</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black flex items-center gap-2"><DocumentTextIcon className="h-5 w-5 text-blue-600" /> Information</h3>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-full border border-blue-100">{entityType}</span>
          </div>
          <hr className="-mx-8 mb-8 border-gray-100" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 mb-10">
            <InfoRow icon={DocumentTextIcon} label="Title" value={note.title} />
            <InfoRow icon={UserIcon} label="Created By" value={note.createdBy.name} />
            <InfoRow icon={CalendarDaysIcon} label="Created Date" value={new Date(note.createdAt).toLocaleDateString()} />
            <InfoRow icon={EntityIcon} label={`Linked ${entityType}`} value={entityName} />
          </div>
          <div className="pt-8 border-t border-gray-100">
            <h4 className="text-xs font-black text-gray-400 uppercase mb-3">Description</h4>
            <p className="text-gray-700 leading-relaxed font-medium">{note.description}</p>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      {note.images && note.images.length > 0 && (
        <div className="pt-6">
          <h3 className="text-sm font-black text-gray-400 uppercase mb-4 tracking-widest">Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {note.images.map((img, idx) => (
              <div key={idx} className="aspect-square rounded-xl overflow-hidden border-2 border-secondary shadow-sm hover:shadow-md cursor-pointer group">
                <img
                  src={img.imageUrl}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onClick={() => {
                    setImgIndex(idx);
                    setIsPreviewOpen(true);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        images={gallery[imgIndex] ? [gallery[imgIndex]] : []}
        initialIndex={0}
      />
    </motion.div>
  );
};

export default NoteDetailContent;