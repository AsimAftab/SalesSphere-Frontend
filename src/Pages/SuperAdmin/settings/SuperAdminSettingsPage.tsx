import SettingsContent from '../../SettingPage/SettingsContent';
import {
    useSettings,
    type UpdateProfileData,
    type PasswordUpdateData,
} from '../../../api/settingService';

export default function SuperAdminSettingsPage() {
    const {
        userData,
        isLoading,
        error,
        updateProfile,
        changePassword,
        uploadImage,
    } = useSettings();

    const handleSaveProfile = (updatedProfile: UpdateProfileData) => {
        try {
            updateProfile(updatedProfile);
        } catch (err) {
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
        } catch (err: any) {
            return {
                success: false,
                message: 'An unexpected error occurred',
                field: 'current',
            };
        }
    };

    const handleImageUpload = async (file: File): Promise<void> => {
        try {
            uploadImage(file);
        } catch (err) {
            throw err;
        }
    };

    return (
        <div className="flex-1 flex flex-col w-full min-w-0 overflow-hidden">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">System Settings</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Manage your profile and system preferences.
                </p>
            </div>
            <SettingsContent
                loading={isLoading}
                error={error ? error.message : null}
                userData={userData}
                onSaveProfile={handleSaveProfile}
                onChangePassword={handleChangePassword}
                onImageUpload={handleImageUpload}
            />
        </div>
    );
}
