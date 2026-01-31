import React from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import SettingsContent from './SettingsContent';
// 1. Import the types we need
import {
  useSettings,
  type UpdateProfileData,
  type PasswordUpdateData, // This will now be used
} from '../../api/settingService';

const SettingsPage: React.FC = () => {
  // 2. Destructure 'isLoading' (not 'loading') and 'error'
  const {
    userData,
    isLoading,
    error,
    updateProfile,
    changePassword,
    uploadImage,
  } = useSettings();

  /**
   * Handle profile update
   */
  // 3. Type the 'updatedProfile' to match the function it's passed to
  const handleSaveProfile = (updatedProfile: UpdateProfileData) => {
    try {
      // 'updateProfile' is a void function (it's a mutation), no need to await
      updateProfile(updatedProfile);
    } catch {
      // Error is already handled by the hook's toast
    }
  };

  /**
   * Handle password change
   */
  const handleChangePassword = async (
    current: string,
    next: string
  ): Promise<{ success: boolean; message: string; field?: 'current' | 'new' }> => {
    try {
      // 4. FIX: Pass arguments as a single object
      const passwordData: PasswordUpdateData = {
        currentPassword: current,
        newPassword: next,
        confirmNewPassword: next,
      };
      const result = await changePassword(passwordData);
      return result;
    } catch {
      return {
        success: false,
        message: 'An unexpected error occurred',
        field: 'current',
      };
    }
  };

  /**
   * Handle profile image upload
   */
  const handleImageUpload = async (file: File): Promise<void> => {
    uploadImage(file);
  };

  return (
    <Sidebar>
      <div className="flex-1 flex flex-col w-full min-w-0 overflow-hidden">
        <SettingsContent
          loading={isLoading} // 5. Pass 'isLoading'
          error={error ? error.message : null} // 6. Pass the error message string
          userData={userData}
          onSaveProfile={handleSaveProfile}
          onChangePassword={handleChangePassword}
          onImageUpload={handleImageUpload}
        />
      </div>
    </Sidebar>
  );
};

export default SettingsPage;