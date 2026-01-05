
import React, { useRef, useState, useMemo } from 'react';
import { PhotoIcon, ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import Button from '../../../../components/UI/Button/Button';
import ImagePreviewModal from '../../../../components/modals/ImagePreviewModal';
import ConfirmationModal from '../../../../components/modals/ConfirmationModal'; 
import toast from 'react-hot-toast';

interface ProspectImageGalleryProps {
  images: any[];
  actions: {
    uploadImage: (vars: { num: number; file: File }) => void;
    deleteImage: (num: number) => void;
  };
  loadingStates: {
    isUploading: boolean;
    isDeletingImage: boolean;
  };
}

const ProspectImageGallery: React.FC<ProspectImageGalleryProps> = ({ 
  images = [], 
  actions, 
  loadingStates 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; slotNum: number | null }>({
    isOpen: false,
    slotNum: null
  });

  // --- Logic: Sorting and Available Slots ---
  const sortedImages = useMemo(() => 
    [...(images || [])].sort((a, b) => a.imageNumber - b.imageNumber), 
  [images]);

  const nextSlot = useMemo(() => {
    const existing = new Set(sortedImages.map(img => img.imageNumber));
    for (let i = 1; i <= 5; i++) if (!existing.has(i)) return i;
    return null;
  }, [sortedImages]);

  const modalImages = useMemo(() => sortedImages.map(img => ({
    url: img.imageUrl,
    description: `Prospect Image ${img.imageNumber}`,
    imageNumber: img.imageNumber
  })), [sortedImages]);

  // --- Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Please upload an image file.');
    if (file.size > 5 * 1024 * 1024) return toast.error('File size must be under 5MB.');
    
    if (nextSlot) {
      actions.uploadImage({ num: nextSlot, file });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const initiateDelete = (num: number) => {
    setDeleteConfirm({ isOpen: true, slotNum: num });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirm.slotNum !== null) {
      await actions.deleteImage(deleteConfirm.slotNum);
      setDeleteConfirm({ isOpen: false, slotNum: null });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center border border-orange-100">
            <PhotoIcon className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">Prospect Gallery</h3>
            <p className="text-sm text-gray-500">{sortedImages.length} of 5 slots used</p>
          </div>
        </div>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*" 
        />
        
        {/* Main Upload Button - Only way to upload */}
        <Button 
          variant="secondary" 
          onClick={() => fileInputRef.current?.click()}
          disabled={loadingStates.isUploading || nextSlot === null}
          className="w-full sm:w-auto"
        >
          {loadingStates.isUploading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
          )}
          {loadingStates.isUploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </div>

      {/* Thumbnails Grid - Empty slot placeholders removed */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {sortedImages.map((img, idx) => (
          <div 
            key={img.imageNumber} 
            className="relative aspect-square group rounded-xl overflow-hidden border border-gray-100 bg-gray-50"
          >
            <img 
              src={img.imageUrl} 
              alt={`Slot ${img.imageNumber}`}
              className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-500"
              onClick={() => {
                setCurrentImageIndex(idx);
                setIsPreviewOpen(true);
              }}
            />
            
            <button
              onClick={() => initiateDelete(img.imageNumber)}
              disabled={loadingStates.isDeletingImage}
              className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg text-red-600 opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-red-50 disabled:opacity-50"
            >
              {loadingStates.isDeletingImage && deleteConfirm.slotNum === img.imageNumber ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <TrashIcon className="w-3.5 h-3.5" />
              )}
            </button>

            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase tracking-widest">
              Slot {img.imageNumber}
            </div>
          </div>
        ))}

        {sortedImages.length === 0 && !loadingStates.isUploading && (
          <div className="col-span-full py-10 flex flex-col items-center justify-center text-gray-600 bg-gray-50 rounded-xl border-2 border-dashed border-gray-100">
             <PhotoIcon className="w-8 h-8 opacity-20 mb-2" />
             <p className="text-xs font-medium">No gallery images uploaded</p>
          </div>
        )}
      </div>

      <ImagePreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        images={modalImages} 
        initialIndex={currentImageIndex}
        onDeleteImage={initiateDelete} 
        isDeletingImage={loadingStates.isDeletingImage}
      />

      <ConfirmationModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Gallery Image"
        message={`Are you sure you want to permanently remove the image from Slot ${deleteConfirm.slotNum}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, slotNum: null })}
        confirmButtonVariant="danger"
      />
    </div>
  );
};

export default ProspectImageGallery;