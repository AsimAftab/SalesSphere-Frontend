// src/components/modals/NoteFormModal.tsx
import React from 'react';

interface NoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => Promise<void>;
  isSaving: boolean;
}

const NoteFormModal: React.FC<NoteFormModalProps> = ({ isOpen, onClose, onSave, isSaving }) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-xl font-bold mb-4">New Note</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
             className="w-full border p-2 rounded" 
             placeholder="Title" 
             value={title} 
             onChange={e => setTitle(e.target.value)} 
             required
          />
          <textarea 
             className="w-full border p-2 rounded" 
             placeholder="Description" 
             value={description} 
             onChange={e => setDescription(e.target.value)} 
             required
          />
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 p-2 rounded">Cancel</button>
            <button type="submit" disabled={isSaving} className="flex-1 bg-blue-600 text-white p-2 rounded">
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteFormModal;