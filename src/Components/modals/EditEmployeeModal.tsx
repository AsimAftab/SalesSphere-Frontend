import React, { useState, useEffect } from 'react';
import { X, UploadCloud, Calendar, File as FileIcon, Trash2 } from 'lucide-react';
import Button from '../UI/Button/Button';

// A type for the employee data structure
export interface EmployeeData {
  id?: string;
  name: string;
  position: string;
  age: number | string;
  gender: string;
  phone: string;
  email: string;
  citizenship: string;
  pan: string;
  address: string;
  dateApplied: string;
  imageUrl?: string;
}

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  // accept partials so pages can pass objects with different shapes (mock data)
  initialData: Partial<EmployeeData> | null; // Data to pre-fill the form
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ isOpen, onClose, initialData }) => {
  // State for all form fields
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [age, setAge] = useState<number | string>('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [citizenship, setCitizenship] = useState('');
  const [pan, setPan] = useState('');
  const [address, setAddress] = useState('');
  const [dateApplied, setDateApplied] = useState('');

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [documents, setDocuments] = useState<File[]>([]);

  // useEffect to populate the form when the modal opens with data
  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name || '');
      setPosition(initialData.position || '');
      setAge(initialData.age || '');
      setGender(initialData.gender || '');
      setPhone(initialData.phone || '');
      setEmail(initialData.email || '');
      setCitizenship(initialData.citizenship || '');
      setPan(initialData.pan || '');
      setAddress(initialData.address || '');
      setDateApplied(initialData.dateApplied || '');
      setPhotoPreview(initialData.imageUrl || null);
      setDocuments([]); // Reset documents on open
    }
  }, [isOpen, initialData]);

  if (!isOpen) {
    return null;
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setDocuments(prevDocs => [...prevDocs, ...Array.from(files)]);
    }
  };
  
  const handleRemoveDocument = (indexToRemove: number) => {
    setDocuments(prevDocs => prevDocs.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { name, position, age, gender, phone, email, citizenship, pan, address, dateApplied, documents };
    console.log('Form saved:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative flex flex-col w-full max-w-2xl max-h-[95vh] rounded-lg bg-white shadow-xl">
        <div className="flex-shrink-0 p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Edit Employee Details</h2>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100"><X size={20} /></button>
          </div>
        </div>

        <form id="edit-employee-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <img src={photoPreview || "https://i.pravatar.cc/150?u=new"} alt="Employee" className="h-16 w-16 rounded-full object-cover" />
              <label htmlFor="photo-upload-edit" className="text-sm font-medium text-blue-600 cursor-pointer">Upload Photo</label>
              <input id="photo-upload-edit" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div className="sm:col-span-2">
                <label htmlFor="name-edit" className="block text-sm font-medium text-gray-600 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input id="name-edit" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border-gray-300 shadow-sm" required />
              </div>

              <div>
                <label htmlFor="position-edit" className="block text-sm font-medium text-gray-600 mb-1">Position <span className="text-red-500">*</span></label>
                <select id="position-edit" value={position} onChange={(e) => setPosition(e.target.value)} className="w-full rounded-lg border-gray-300 shadow-sm" required>
                    <option>Product Manager</option>
                    <option>Software Engineer</option>
                    <option>Designer</option>
                </select>
              </div>

              <div>
                <label htmlFor="email-edit" className="block text-sm font-medium text-gray-600 mb-1">Email Address <span className="text-red-500">*</span></label>
                <input id="email-edit" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border-gray-300 shadow-sm" required />
              </div>
              
              <div>
                <label htmlFor="gender-edit" className="block text-sm font-medium text-gray-600 mb-1">Gender <span className="text-red-500">*</span></label>
                <select id="gender-edit" value={gender} onChange={(e) => setGender(e.target.value)} className="w-full rounded-lg border-gray-300 shadow-sm" required>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="age-edit" className="block text-sm font-medium text-gray-600 mb-1">Age <span className="text-red-500">*</span></label>
                <input id="age-edit" type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-lg border-gray-300 shadow-sm" required />
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="address-edit" className="block text-sm font-medium text-gray-600 mb-1">Address <span className="text-red-500">*</span></label>
                <input id="address-edit" type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-lg border-gray-300 shadow-sm" required />
              </div>
              
              {/* Other fields... */}
            </div>
          </div>
        </form>

        <div className="flex-shrink-0 flex justify-end gap-4 mt-6 p-3 border-t border-gray-200">
          <Button type="button" onClick={onClose} variant="outline" className="rounded-lg px-6 py-2.5">Cancel</Button>
          <Button type="submit" form="edit-employee-form" variant="secondary" className="rounded-lg px-6 py-2.5">Save</Button>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeModal;