import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEditProfileForm } from './hooks/useEditProfileForm';
import EditProfileForm from './components/EditProfileForm';
import ErrorBoundary from '../../ui/ErrorBoundary/ErrorBoundary';
import type { UserProfile } from '../../../api/settingService';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserProfile;
  isSuperAdmin: boolean;
  onSave: (data: Record<string, unknown>) => Promise<void> | void;
  onImageUpload?: (file: File) => Promise<void>;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  userData,
  isSuperAdmin,
  onSave,
  onImageUpload,
}) => {
  const {
    form,
    photoPreview,
    submitHandler,
    handlePhotoChange,
    handleMapSync,
    handleAddressSync,
  } = useEditProfileForm({
    isOpen,
    userData,
    onSave,
    onImageUpload,
    onSuccess: onClose,
  });

  return (
    <ErrorBoundary>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Update your personal details and location</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Form Container - Scrollable */}
              <div className="overflow-y-auto custom-scrollbar flex-grow">
                <EditProfileForm
                  form={form}
                  userData={userData}
                  isSuperAdmin={isSuperAdmin}
                  photoPreview={photoPreview}
                  onPhotoChange={handlePhotoChange}
                  onMapSync={handleMapSync}
                  onAddressSync={handleAddressSync}
                  onSubmit={submitHandler}
                  onCancel={onClose}
                  isSubmitting={form.formState.isSubmitting}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
};

export default EditProfileModal;
