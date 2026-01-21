import React from 'react';
import { UploadCloud, Trash2 } from 'lucide-react';

export interface ExistingImage {
    imageUrl?: string;
    url?: string;
    publicId?: string;
    _id?: string;
}

// Simple Upload Trigger Component (Matches the "NoteForm" style but adapted if needed)
// However, the user liked the specific design in CollectionFormModal (the grid with "Upload 1", "Upload 2").
// The NoteFormModal has a different design (Multi-select box).
// USER REQUEST: "make the file distribution... in the same way. But don't change anything, any design or any logic."
// THIS IS CRITICAL. The design MUST match CollectionFormModal, NOT NoteFormModal.
// So I should implement `ImageUploadSection` to look like the grid in CollectionFormModal, 
// NOT the drag-and-drop box in NoteFormModal.
// Refactoring to SOLID means moving the *code* to a component, but keeping the *UI* identical.

export const ImageUploadSection: React.FC<{
    allPreviews: string[]; // Combined list of existing URLs and new file previews
    onFilesAdded: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: (index: number) => void; // Parent handles logic of which type to remove based on index
    maxFiles?: number;
    error?: string;
    totalCount?: number;
}> = ({ allPreviews, onFilesAdded, onRemove, maxFiles = 2, error, totalCount = 0 }) => {

    // We recreate the exact UI from CollectionFormModal
    return (
        <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-400 mb-3 ml-1 tracking-wider uppercase">
                Attachments (Max {maxFiles})
            </label>
            <div className="grid grid-cols-2 gap-4">
                {[0, 1].map((slot) => (
                    <div key={slot}>
                        {allPreviews[slot] ? (
                            <div className="relative w-full h-32 rounded-xl border border-gray-200 overflow-hidden group">
                                <img
                                    src={allPreviews[slot]}
                                    alt={`Preview ${slot + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => onRemove(slot)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                {/* Hidden Input */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={onFilesAdded}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    disabled={totalCount >= maxFiles}
                                />
                                <div
                                    className={`w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all gap-2
                                        ${error
                                            ? 'border-red-300 ring-1 ring-red-100 bg-red-50/10'
                                            : 'border-gray-300 hover:border-secondary hover:bg-secondary/5'
                                        }`}
                                >
                                    <UploadCloud size={24} className="text-gray-400" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                                        {slot === 0 ? 'Upload 1' : 'Upload 2'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
