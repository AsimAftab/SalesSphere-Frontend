import React, { useRef } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { getSafeImageUrl } from '@/utils/security';
import { Button } from '@/components/ui';

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

    const hasImage = !!getSafeImageUrl(previewUrl);

    return (
        <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">
                    Receipt Image <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                </label>

                {!hasImage ? (
                    <>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 py-2 h-9 text-xs"
                        >
                            <UploadCloud size={14} className="text-indigo-600" />
                            Upload
                        </Button>
                    </>
                ) : (
                    <div className="px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-blue-700 font-medium">Receipt added</span>
                    </div>
                )}
            </div>

            {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}

            {hasImage && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <div className="group relative aspect-square w-24 h-24">
                        {isDeleting && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20 backdrop-blur-[2px] rounded-2xl">
                                <Loader2 className="animate-spin text-blue-600" size={20} />
                            </div>
                        )}

                        <div className="w-full h-full rounded-2xl border-2 border-blue-200 shadow-sm overflow-hidden">
                            <img
                                src={getSafeImageUrl(previewUrl) || ''}
                                alt="Receipt Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="absolute -top-2 -left-2 bg-blue-500/90 backdrop-blur-sm text-[10px] text-white px-2 py-0.5 rounded-full font-bold shadow-sm ring-2 ring-white">
                            RECEIPT
                        </div>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove();
                            }}
                            disabled={isDeleting}
                            className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1.5 shadow-lg border border-red-50 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
                        >
                            <X size={14} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenseImageUpload;
