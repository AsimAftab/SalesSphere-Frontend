import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Code } from 'lucide-react';
import { Card } from '../../components/UI/SuperadminComponents/card';
import { Badge } from '../../components/UI/SuperadminComponents/badge';
import CustomButton from '../../components/UI/Button/Button';
import {
  getSystemUserById,
  updateSystemUser,
  updateSystemUserPassword,
} from '../../api/SuperAdmin/systemUserService';
import type {
  SystemUser,
  UpdateSystemUserRequest,
} from '../../api/SuperAdmin/systemUserService';
import SystemUserProfileContent from './SystemUserProfileContent';
import toast from 'react-hot-toast';
import { useAuth } from '../../api/authService';
// ⛔️ REMOVED: import { updateStoredUser } from '../../api/authService';
import {
  getUserSettings,
  updateUserSettings,
  updateUserPassword,
} from '../../api/settingService';

// Helper function to convert ISO date string to YYYY-MM-DD format for date input
const formatDateForInput = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

const SystemUserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  // ✅ 1. Get refreshUser from the useAuth hook
  const {
    user: currentUser,
    isLoading: authLoading,
    refreshUser,
  } = useAuth();
  const [userData, setUserData] = useState<SystemUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isViewingOwnProfile, setIsViewingOwnProfile] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (!userId) {
          setError('User ID is missing');
          return;
        }

        // Check if user is trying to view their own profile
        const isOwnProfile =
          currentUser && (currentUser._id === userId || currentUser.id === userId);
        setIsViewingOwnProfile(!!isOwnProfile);

        if (isOwnProfile) {
          // Use /users/me endpoint for own profile
          console.log('Fetching own profile using /users/me');
          const ownData = await getUserSettings();
          // Transform to SystemUser format with frontend-friendly aliases
          const transformedData: SystemUser = {
            id: ownData._id || '',
            _id: ownData._id,
            name: ownData.name,
            email: ownData.email,
            role: ownData.role || 'superadmin',
            phone: ownData.phone,
            dateOfBirth: ownData.dateOfBirth,
            gender: ownData.gender,
            panNumber: ownData.panNumber,
            citizenshipNumber: ownData.citizenshipNumber,
            address: ownData.address,
            avatarUrl: ownData.avatarUrl || ownData.avatar,
            photoPreview: ownData.avatarUrl || ownData.avatar,
            isActive: ownData.isActive ?? true,
            dateJoined: ownData.dateJoined,
            organizationId: ownData.organizationId,
            createdAt: ownData.createdAt,
            updatedAt: ownData.updatedAt,
            // Frontend-friendly aliases for SystemUserProfileContent
            position: ownData.position || ownData.role,
            dob: formatDateForInput(ownData.dob || ownData.dateOfBirth),
            pan: ownData.pan || ownData.panNumber,
            citizenship: ownData.citizenship || ownData.citizenshipNumber,
            location: ownData.location || ownData.address,
          };
          setUserData(transformedData);
        } else {
          // Use /users/:userId endpoint for other users
          const data = await getSystemUserById(userId);
          if (!data) {
            setError('User not found');
            return;
          }
          setUserData(data);
        }
      } catch (err: any) {
        console.error(err);
        setError('Failed to load user profile.');
      } finally {
        setLoading(false);
      }
    };

    // Run fetchUserData only when auth is no longer loading
    if (!authLoading) {
      fetchUserData();
    }
  }, [userId, currentUser, authLoading]); // Added authLoading dependency

  const handleSaveProfile = async (updatedProfile: Partial<SystemUser>) => {
    try {
      setLoading(true);
      setError(null);

      if (isViewingOwnProfile) {
        // Use /users/me endpoint for own profile
        const updatePayload = {
          name: updatedProfile.name,
          phone: updatedProfile.phone,
          dateOfBirth: updatedProfile.dateOfBirth,
          gender: updatedProfile.gender,
          panNumber: updatedProfile.panNumber,
          citizenshipNumber: updatedProfile.citizenshipNumber,
          address: updatedProfile.address,
        };
        const ownData = await updateUserSettings(updatePayload);

        // Transform back to SystemUser format with frontend-friendly aliases
        const transformedData: SystemUser = {
          id: ownData._id || '',
          _id: ownData._id,
          name: ownData.name,
          email: ownData.email,
          role: ownData.role || 'superadmin',
          phone: ownData.phone,
          dateOfBirth: ownData.dateOfBirth,
          gender: ownData.gender,
          panNumber: ownData.panNumber,
          citizenshipNumber: ownData.citizenshipNumber,
          address: ownData.address,
          avatarUrl: ownData.avatarUrl || ownData.avatar,
          photoPreview: ownData.avatarUrl || ownData.avatar,
          isActive: ownData.isActive ?? true,
          dateJoined: ownData.dateJoined,
          organizationId: ownData.organizationId,
          createdAt: ownData.createdAt,
          updatedAt: ownData.updatedAt,
          // Frontend-friendly aliases for SystemUserProfileContent
          position: ownData.position || ownData.role,
          dob: formatDateForInput(ownData.dob || ownData.dateOfBirth),
          pan: ownData.pan || ownData.panNumber,
          citizenship: ownData.citizenship || ownData.citizenshipNumber,
          location: ownData.location || ownData.address,
        };
        setUserData(transformedData);

        // ✅ 2. THE FIX: Call refreshUser()
        // This tells useAuth to refetch the user data
        await refreshUser();
      } else {
        // Use /users/:userId endpoint for other users
        const updateData: UpdateSystemUserRequest = {
          id: (userData!.id || userData!._id)!,
          ...updatedProfile,
        };
        const savedData = await updateSystemUser(updateData);
        setUserData(savedData);
      }

      toast.success('Profile updated successfully!');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update profile.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (
    current: string,
    next: string
  ): Promise<{ success: boolean; message: string; field?: 'current' | 'new' }> => {
    setError(null);

    try {
      if (isViewingOwnProfile) {
        // Use /users/me/password endpoint for own profile
        const result = await updateUserPassword(current, next, next);
        return result;
      } else {
        // Use /users/:userId/password endpoint for other users
        await updateSystemUserPassword(
          (userData!.id || userData!._id)!,
          current,
          next
        );
        return { success: true, message: 'Password updated successfully!' };
      }
    } catch (err: any) {
      console.error('Password update error:', err);

      let errorMessage = 'Failed to update password. Please try again.';
      let errorField: 'current' | 'new' = 'current';

      if (err.message === 'Current password is incorrect') {
        errorMessage = 'Incorrect current password.';
        errorField = 'current';
      } else if (err.message) {
        errorMessage = err.message;
      }

      return {
        success: false,
        message: errorMessage,
        field: errorField,
      };
    }
  };

  const handleRevokeAccess = async () => {
    try {
      const updatedUser = await updateSystemUser({
        id: (userData!.id || userData!._id)!,
        isActive: false,
      });
      setUserData(updatedUser);
      toast.success(`Access revoked for ${userData!.name}`);
    } catch (err) {
      console.error('Error revoking access:', err);
      toast.error('Failed to revoke access');
    }
  };

  const handleGrantAccess = async () => {
    try {
      const updatedUser = await updateSystemUser({
        id: (userData!.id || userData!._id)!,
        isActive: true,
      });
      setUserData(updatedUser);
      toast.success(`Access granted to ${userData!.name}`);
    } catch (err) {
      console.error('Error granting access:', err);
      toast.error('Failed to grant access');
    }
  };

  // Check if current user has permission to view this profile
  const canViewProfile = () => {
    if (!currentUser) return false;
    // Both Super Admins and Developers can view all profiles
    const role = currentUser.role?.toLowerCase();
    if (
      role === 'superadmin' ||
      role === 'super admin' ||
      role === 'developer'
    )
      return true;
    return false;
  };

  // Show loading while auth is being checked
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
        <Card className="p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-600">Loading profile...</p>
          </div>
        </Card>
      </div>
    );
  }

  // Check permission after auth is loaded
  if (!canViewProfile()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Access Denied
            </h2>
            <p className="text-slate-600 mb-6">
              You don't have permission to view this profile.
            </p>
            <p className="text-xs text-slate-500 mb-4">
              Current role: {currentUser?.role || 'None'}
            </p>
            <CustomButton
              onClick={() => navigate('/system-admin')}
              variant="primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </CustomButton>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <p className="text-red-600 mb-6">{error || 'User not found'}</p>
            <CustomButton
              onClick={() => navigate('/system-admin')}
              variant="primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </CustomButton>
          </Card>
        </div>
      </div>
    );
  }

  const getRoleIcon = () => {
    return userData.role === 'superadmin' ? (
      <Shield className="w-8 h-8 text-blue-600" />
    ) : (
      <Code className="w-8 h-8 text-green-600" />
    );
  };

  const getRoleBadgeColor = () => {
    return userData.role === 'superadmin'
      ? 'bg-blue-600 text-white'
      : 'bg-green-600 text-white';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <CustomButton
          onClick={() => navigate('/system-admin')}
          variant="outline"
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </CustomButton>

        {/* Header Card */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            {getRoleIcon()}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">
                {userData.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-slate-600">{userData.email}</p>
                {!userData.isActive && (
                  <Badge variant="destructive" className="bg-red-600 text-white">
                    Inactive
                  </Badge>
                )}
              </div>
            </div>
            <div
              className={`px-4 py-2 rounded-lg font-semibold ${getRoleBadgeColor()}`}
            >
              {userData.role}
            </div>
          </div>
        </Card>

        {/* Profile Content */}
        <SystemUserProfileContent
          loading={loading}
          error={error}
          userData={userData}
          onSaveProfile={handleSaveProfile}
          onChangePassword={handleChangePassword}
          onRevokeAccess={handleRevokeAccess}
          onGrantAccess={handleGrantAccess}
          isOwnProfile={
            (currentUser?.id || currentUser?._id) === (userData.id || userData._id)
          }
          currentUserRole={currentUser?.role || ''}
        />
      </div>
    </div>
  );
};

export default SystemUserProfilePage;