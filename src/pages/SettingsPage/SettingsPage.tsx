import React from 'react';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import SettingsContent from './SettingsContent';
import {
  useSettings,
  type UpdateProfileData,
  type PasswordUpdateData,
} from '../../api/settingService';

const SettingsPage: React.FC = () => {
  const {
    userData,
    error,
    updateProfile,
    changePassword,
    uploadImage,
  } = useSettings();

  const handleSaveProfile = async (updatedProfile: UpdateProfileData) => {
    await updateProfile(updatedProfile);
  };

  const handleChangePassword = async (
    current: string,
    next: string,
  ): Promise<{ success: boolean; message: string; field?: 'current' | 'new' }> => {
    try {
      const passwordData: PasswordUpdateData = {
        currentPassword: current,
        newPassword: next,
        confirmNewPassword: next,
      };
      return await changePassword(passwordData);
    } catch {
      return { success: false, message: 'An unexpected error occurred', field: 'current' };
    }
  };

  const handleImageUpload = async (file: File): Promise<void> => {
    await uploadImage(file);
  };

  return (
    <Sidebar>
      <SettingsContent
        error={error ? error.message : null}
        userData={userData}
        onSaveProfile={handleSaveProfile}
        onChangePassword={handleChangePassword}
        onImageUpload={handleImageUpload}
      />
    </Sidebar>
  );
};

export default SettingsPage;
