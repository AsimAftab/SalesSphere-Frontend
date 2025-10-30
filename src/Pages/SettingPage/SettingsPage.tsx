import React from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import SettingsContent from './SettingsContent';
import { useSettings } from '../../api/settingService';

const SettingsPage: React.FC = () => {
  const { userData, loading, error, updateProfile, changePassword, uploadImage } = useSettings();

  /**
   * Handle profile update
   */
  const handleSaveProfile = async (updatedProfile: any) => {
    try {
      await updateProfile(updatedProfile);
    } catch (err) {
     
    }
  };

 
  const handleChangePassword = async (
    current: string,
    next: string
  ): Promise<{ success: boolean; message: string; field?: 'current' | 'new' }> => {
    try {
      const result = await changePassword(current, next, next);
      return result;
    } catch (err: any) {
      // The 'changePassword' hook already shows a toast on error.
      return {
        success: false,
        message: 'An unexpected error occurred',
        field: 'current',
      };
    }
  };

  /**
   * Handle profile image upload
   * ⭐ UPDATED: Now returns avatar URL string
   */
  const handleImageUpload = async (file: File): Promise<string | undefined> => {
    try {
      const avatarUrl = await uploadImage(file);
      return avatarUrl;
    } catch (err) {
      // The 'uploadImage' hook already shows a toast on error.
      throw err;
    }
  };

  return (
    <Sidebar>
      <div className="flex-1 flex flex-col w-full min-w-0 overflow-hidden">
        <SettingsContent
          loading={loading}
          error={error}
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