import React, { useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface ExpenseImageUploadProps {
    previewUrl: string | null;
    onFileChange: (file: File | null) => void;
    onRemove: () => void;
    isDeleting?: boolean;
    error?: string;
}

const ExpenseImageUpload: React.FC<ExpenseImageUploadProps> = ({
    previewUrl,
    onFileChange,
    onRemove,
    isDeleting = false,
    error
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onFileChange(file);
    };

    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                Evidence Log Attachment
            </label>

            {!previewUrl ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        relative border-2 border-dashed rounded-2xl p-8 transition-all text-center cursor-pointer group bg-gray-50
                        ${error ? 'border-red-300 bg-red-50/10' : 'border-gray-200 hover:border-secondary hover:bg-blue-50/20'}
                    `}
                >
                    <div className="bg-white p-3 rounded-full shadow-sm w-fit mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <Upload className={`h-6 w-6 ${error ? 'text-red-400' : 'text-gray-400 group-hover:text-secondary'}`} />
                    </div>
                    <p className={`text-sm font-bold tracking-tight ${error ? 'text-red-500' : 'text-gray-600 group-hover:text-secondary'}`}>
                        Attach receipt documentation
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
            ) : (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 group aspect-video bg-gray-100 shadow-inner ring-4 ring-gray-50">
                    {isDeleting && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 backdrop-blur-[2px]">
                            <Loader2 className="animate-spin text-secondary" size={32} />
                        </div>
                    )}
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        disabled={isDeleting}
                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 active:scale-95 disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default ExpenseImageUpload;
