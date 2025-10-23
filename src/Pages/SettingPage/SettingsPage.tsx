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

  // --- THIS FUNCTION IS UPDATED FOR BETTER ERROR HANDLING ---
  const handleChangePassword = async (current: string, next: string): Promise<{ success: boolean; message: string; field?: 'current' | 'new' }> => {
    setError(null); // Clear any old generic errors

    try {
      // 1. Call your API
      await updateUserPassword(current, next);

      // 2. If successful, return a success object
      return { success: true, message: 'Password updated successfully!' };

    } catch (err: any) {
      // --- This is the new, more robust error handling ---

      // 1. Log the entire error object to your browser console.
      // This will show you the exact structure of the error.
      console.error("Password update API error:", err); 

      let errorMessage = 'Failed to update password. Please try again.';
      let errorField = 'current'; // Default to showing error on 'current' field

      // 2. Check if the error object has a 'response' from the server
      if (err.response && err.response.data) {
        // Try to get the message from your API's response data
        // Common paths are: err.response.data.message, err.response.data.error, or just err.response.data
        errorMessage = err.response.data.message || err.response.data.error || err.response.data.toString() || 'An error occurred.';
        
        // 3. Specifically check for auth-related status codes
        if (err.response.status === 401 || err.response.status === 400) {
          errorField = 'current'; // API says "Incorrect current password"
          errorMessage = err.response.data?.message || 'Incorrect current password.';
        }
      } else if (err.message) {
        // Handle network errors (e.g., "Network Error")
        errorMessage = err.message;
      }

      // 4. Return the detailed error to SettingsContent
      return {
        success: false,
        message: errorMessage,
        field: errorField as 'current' | 'new'
      };
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
          onChangePassword={handleChangePassword} // Pass the updated function
        />
      </div>
    </Sidebar>
  );
};

export default SettingsPage;