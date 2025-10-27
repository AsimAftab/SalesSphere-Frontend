import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Code } from 'lucide-react';
import { Card, CardDescription } from '../../components/uix/card';
import { Badge } from '../../components/uix/badge';
import CustomButton from '../../components/UI/Button/Button';
import { getSystemUserById, updateSystemUser, updateSystemUserPassword } from '../../api/services/superadmin/systemUserService';
import type { SystemUser, UpdateSystemUserRequest } from '../../api/services/superadmin/systemUserService';
import SystemUserProfileContent from './SystemUserProfileContent';
import toast from 'react-hot-toast';

const SystemUserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<SystemUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get current logged-in system user
  const currentUser = JSON.parse(localStorage.getItem('systemUser') || '{}');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (!userId) {
          setError('User ID is missing');
          return;
        }
        const data = await getSystemUserById(userId);
        if (!data) {
          setError('User not found');
          return;
        }
        setUserData(data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load user profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleSaveProfile = async (updatedProfile: Partial<SystemUser>) => {
    try {
      setLoading(true);
      const updateData: UpdateSystemUserRequest = {
        id: userData!.id,
        ...updatedProfile
      };
      const savedData = await updateSystemUser(updateData);
      setUserData(savedData);

      // Update localStorage if editing own profile
      if (currentUser.id === userData?.id) {
        localStorage.setItem('systemUser', JSON.stringify(savedData));
      }
    } catch (err) {
      setError('Failed to update profile.');
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
      await updateSystemUserPassword(userData!.id, current, next);
      return { success: true, message: 'Password updated successfully!' };
    } catch (err: any) {
      console.error("Password update error:", err);

      let errorMessage = 'Failed to update password. Please try again.';
      let errorField: 'current' | 'new' = 'current';

      if (err.message === "Current password is incorrect") {
        errorMessage = "Incorrect current password.";
        errorField = 'current';
      } else if (err.message) {
        errorMessage = err.message;
      }

      return {
        success: false,
        message: errorMessage,
        field: errorField
      };
    }
  };

  const handleRevokeAccess = async () => {
    try {
      const updatedUser = await updateSystemUser({
        id: userData!.id,
        isActive: false
      });
      setUserData(updatedUser);
      toast.success(`Access revoked for ${userData!.name}`, {
        description: "User has been marked as inactive and cannot access the system"
      });
    } catch (err) {
      console.error("Error revoking access:", err);
      toast.error("Failed to revoke access");
    }
  };

  const handleGrantAccess = async () => {
    try {
      const updatedUser = await updateSystemUser({
        id: userData!.id,
        isActive: true
      });
      setUserData(updatedUser);
      toast.success(`Access granted to ${userData!.name}`, {
        description: "User has been reactivated and can now access the system"
      });
    } catch (err) {
      console.error("Error granting access:", err);
      toast.error("Failed to grant access");
    }
  };

  // Check if current user has permission to view this profile
  const canViewProfile = () => {
    // Both Super Admins and Developers can view all profiles
    if (currentUser.role === "Super Admin" || currentUser.role === "Developer") return true;
    return false;
  };

  if (!canViewProfile()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
            <p className="text-slate-600 mb-6">You don't have permission to view this profile.</p>
            <CustomButton onClick={() => navigate('/super-admin')} variant="primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </CustomButton>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
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

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <p className="text-red-600 mb-6">{error || 'User not found'}</p>
            <CustomButton onClick={() => navigate('/super-admin')} variant="primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </CustomButton>
          </Card>
        </div>
      </div>
    );
  }

  const getRoleIcon = () => {
    return userData.role === "Super Admin" ? (
      <Shield className="w-8 h-8 text-blue-600" />
    ) : (
      <Code className="w-8 h-8 text-green-600" />
    );
  };

  const getRoleBadgeColor = () => {
    return userData.role === "Super Admin"
      ? "bg-blue-600 text-white"
      : "bg-green-600 text-white";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <CustomButton
          onClick={() => navigate('/super-admin')}
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
              <h1 className="text-2xl font-bold text-slate-900">{userData.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-slate-600">{userData.email}</p>
                {!userData.isActive && (
                  <Badge variant="destructive" className="bg-red-600 text-white">
                    Inactive
                  </Badge>
                )}
              </div>
            </div>
            <div className={`px-4 py-2 rounded-lg font-semibold ${getRoleBadgeColor()}`}>
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
          isOwnProfile={currentUser.id === userData.id}
          currentUserRole={currentUser.role}
        />
      </div>
    </div>
  );
};

export default SystemUserProfilePage;
