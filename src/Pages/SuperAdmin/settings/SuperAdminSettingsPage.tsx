
import { Loader2 } from 'lucide-react';

// Components
import SettingsContent from '../../SettingPage/SettingsContent';

// Services & Hooks
import {
    useSettings,
    type UpdateProfileData,
    type PasswordUpdateData,
} from '../../../api/settingService';

export default function SuperAdminSettingsPage() {
    // Profile Settings Hook
    const {
        userData,
        isLoading: loadingProfile,
        error: profileError,
        updateProfile,
        changePassword,
        uploadImage,
    } = useSettings();

    const handleSaveProfile = (updatedProfile: UpdateProfileData) => {
        try {
            updateProfile(updatedProfile);
        } catch {
            // Error handling managed by hook
        }
    };

    const handleChangePassword = async (
        current: string,
        next: string
    ): Promise<{ success: boolean; message: string; field?: 'current' | 'new' }> => {
        try {
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

    const handleImageUpload = async (file: File): Promise<void> => {
        uploadImage(file);
    };

    if (loadingProfile) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Profile</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Manage your personal account details and password.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto">
                <SettingsContent
                    loading={loadingProfile}
                    error={profileError ? profileError.message : null}
                    userData={userData}
                    onSaveProfile={handleSaveProfile}
                    onChangePassword={handleChangePassword}
                    onImageUpload={handleImageUpload}
                />
            </div>
        </div>
    );
}
