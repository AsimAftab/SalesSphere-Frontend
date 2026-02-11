import React from 'react';
import { useEditProfileForm } from './hooks/useEditProfileForm';
import EditProfileForm from './components/EditProfileForm';
import type { UserProfile } from '@/api/settingService';
import { FormModal } from '@/components/ui';

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
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      description="Update your personal details and location"
      size="xl"
    >
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
    </FormModal>
  );
};

export default EditProfileModal;
