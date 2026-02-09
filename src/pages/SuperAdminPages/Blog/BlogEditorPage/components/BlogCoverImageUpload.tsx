import React, { useRef, useState } from 'react';
import { Upload, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSafeImageUrl } from '@/utils/security';
import ImagePreviewModal from '@/components/modals/CommonModals/ImagePreviewModal';

interface BlogCoverImageUploadProps {
  currentImageUrl?: string;
  selectedFile?: File;
  onFileSelect: (file: File | undefined) => void;
  onRemove?: () => void;
  error?: boolean;
}

const BlogCoverImageUpload: React.FC<BlogCoverImageUploadProps> = ({
  currentImageUrl,
  selectedFile,
  onFileSelect,
  onRemove,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is too large. Max 5MB.');
      return;
    }

    onFileSelect(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const previewUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : getSafeImageUrl(currentImageUrl ?? null);

  const handleRemove = () => {
    if (selectedFile) {
      onFileSelect(undefined);
    } else if (currentImageUrl && onRemove) {
      onRemove();
    }
  };

  return (
    <div>
      <span className="block text-sm font-semibold text-gray-700 mb-1.5">
        Cover Image
      </span>

      {previewUrl ? (
        <>
          <div className="relative rounded-lg overflow-hidden border border-gray-200 group">
            <img
              src={previewUrl}
              alt="Cover preview"
              className="w-full h-56 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 transition-colors"
                title="Preview image"
              >
                <Eye className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 transition-colors"
                title="Change image"
              >
                <Upload className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors"
                title="Remove image"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <ImagePreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            images={[{ url: previewUrl, description: 'Cover Image Preview' }]}
          />
        </>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`w-full h-48 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors ${error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
            }`}
        >
          <Upload className="h-8 w-8 text-gray-400" />
          <span className="text-sm text-gray-500">Click to upload cover image</span>
          <span className="text-xs text-gray-400">PNG, JPG up to 5MB</span>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelected}
        className="hidden"
      />
    </div>
  );
};

export default BlogCoverImageUpload;
