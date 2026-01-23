import React, { useRef } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';

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
        if (file) {
            onFileChange(file);
        }
        e.target.value = '';
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                Receipt Image <span className="text-gray-400 font-normal">(Optional)</span>
            </label>

            {!previewUrl ? (
                <div className="relative border-2 border-dashed rounded-xl transition-all duration-200 border-gray-300 bg-white hover:bg-blue-50/30 hover:border-blue-400 cursor-pointer group">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                        onChange={handleFileChange}
                        aria-label="Upload receipt"
                    />

                    <div className="p-5 flex flex-col items-center justify-center text-center">
                        <div className={`mb-2 p-2 rounded-full transition-colors ${error ? 'bg-red-50' : 'bg-blue-50 group-hover:bg-blue-100/50'}`}>
                            <ImagePlus
                                className={`transition-colors ${error ? 'text-red-400' : 'text-blue-500'}`}
                                size={24}
                            />
                        </div>

                        <p className={`text-sm font-semibold mb-0.5 transition-colors ${error ? 'text-red-600' : 'text-gray-700 group-hover:text-blue-700'}`}>
                            Click or drag to upload receipt
                        </p>

                        <p className="text-[10px] transition-colors text-gray-500 group-hover:text-blue-600/70">
                            Supports JPG, PNG (Max 5MB)
                        </p>
                    </div>
                </div>
            ) : (
                <div className="relative flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-blue-50 border border-blue-100 shadow-sm group">
                    {isDeleting && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20 backdrop-blur-[2px]">
                            <Loader2 className="animate-spin text-blue-600" size={20} />
                        </div>
                    )}

                    <img
                        src={previewUrl}
                        alt="Receipt Preview"
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute top-1 left-1 bg-blue-500/90 text-[8px] text-white px-1.5 py-0.5 rounded-full font-bold shadow-sm backdrop-blur-md border border-white/20">
                        RECEIPT
                    </div>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        disabled={isDeleting}
                        className="absolute top-1 right-1 p-1 bg-white text-red-500 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-red-50 hover:scale-110 active:scale-95 disabled:opacity-50 ring-1 ring-gray-100"
                        title="Remove receipt"
                    >
                        <X size={12} strokeWidth={2.5} />
                    </button>
                </div>
            )}

            {error && <p className="text-xs text-red-500 font-medium flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-red-500"></span>
                {error}
            </p>}
        </div>
    );
};

export default ExpenseImageUpload;
