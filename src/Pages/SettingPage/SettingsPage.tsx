import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import { getUserSettings, updateUserSettings, updateUserPassword } from '../../api/settingService';
import SettingsContent from './SettingsContent';

const SettingsPage: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await getUserSettings();
        setUserData(data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load user settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveProfile = async (updatedProfile: any) => {
    try {
      setLoading(true);
      const savedData = await updateUserSettings(updatedProfile);
      setUserData(savedData);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (current: string, next: string) => {
    try {
      setLoading(true);
      await updateUserPassword(current, next);
    } catch (err) {
      setError('Failed to update password.');
    } finally {
      setLoading(false);
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
        />
      </div>
    </Sidebar>
  );
};

export default SettingsPage;
