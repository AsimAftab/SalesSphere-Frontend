import React from 'react';
import { useEditProfileForm } from './hooks/useEditProfileForm';
import EditProfileForm from './components/EditProfileForm';
import type { UserProfile } from '@/api/settingService';
import { Button, FormModal } from '@/components/ui';

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

  const isSubmitting = form.formState.isSubmitting;
  const footer = (
    <div className="flex justify-end gap-3 w-full">
      <Button
        variant="outline"
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
      >
        Cancel
      </Button>
      <Button type="submit" form="edit-profile-form" variant="secondary" isLoading={isSubmitting}>
        Save Changes
      </Button>
    </div>
  );

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      description="Update your personal details and location"
      size="xl"
      footer={footer}
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
      />
    </FormModal>
  );
};

export default EditProfileModal;
