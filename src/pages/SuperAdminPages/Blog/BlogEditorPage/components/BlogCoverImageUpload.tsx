import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSafeImageUrl } from '@/utils/security';

interface BlogCoverImageUploadProps {
  currentImageUrl?: string;
  selectedFile?: File;
  onFileSelect: (file: File | undefined) => void;
  error?: boolean;
}

const BlogCoverImageUpload: React.FC<BlogCoverImageUploadProps> = ({
  currentImageUrl,
  selectedFile,
  onFileSelect,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    onFileSelect(undefined);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        Cover Image
      </label>

      {previewUrl ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          <img
            src={previewUrl}
            alt="Cover preview"
            className="w-full h-48 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-600 transition-colors shadow-sm"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`w-full h-48 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors ${
            error
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
