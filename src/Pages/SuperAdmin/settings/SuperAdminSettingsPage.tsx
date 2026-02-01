import { Loader2 } from 'lucide-react';
import SettingsContent from '../../SettingPage/SettingsContent';
import {
  useSettings,
  type UpdateProfileData,
  type PasswordUpdateData,
} from '../../../api/settingService';

export default function SuperAdminSettingsPage() {
  const {
    userData,
    isLoading: loadingProfile,
    error: profileError,
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

  if (loadingProfile) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <SettingsContent
      error={profileError ? profileError.message : null}
      userData={userData}
      onSaveProfile={handleSaveProfile}
      onChangePassword={handleChangePassword}
      onImageUpload={handleImageUpload}
    />
  );
}
