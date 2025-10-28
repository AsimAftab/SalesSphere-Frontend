// src/api/settingService.ts
import { useState, useEffect, useCallback } from 'react';
import api from './api';
import toast from 'react-hot-toast';

/**
 * Settings Service
 * Handles user profile and settings-related API calls
 * Based on SalesSphere API Documentation - Settings Module
 */

// Types - Based on API Documentation
export interface UserProfile {
  _id?: string;
  name: string; // Full name from API
  email: string;
  phone: string;
  role?: string;
  dateOfBirth?: string; // YYYY-MM-DD format
  gender?: string;
  avatar?: string; // Frontend uses this
  avatarUrl?: string; // ⭐ Backend might send this
  citizenshipNumber?: string;
  panNumber?: string;
  dateJoined?: string;
  address?: string;
  organizationId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  age?: number; // ⭐ Backend might send this

  // Frontend-only fields for form handling
  firstName?: string;
  lastName?: string;
  dob?: string; // Alias for dateOfBirth
  pan?: string; // Alias for panNumber
  citizenship?: string; // Alias for citizenshipNumber
  location?: string; // Alias for address
  photoPreview?: string; // For image preview
  position?: string; // Might be derived from role
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  // ⭐ REMOVED: role field - position is read-only from backend
  // Users cannot update their own role/position
  dateOfBirth?: string;
  gender?: string;
  panNumber?: string;
  citizenshipNumber?: string;
  address?: string;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Get current user details
 * GET /users/me
 */
export const getUserSettings = async (): Promise<UserProfile> => {
  try {
    console.log('📤 Fetching user settings...');

    const response = await api.get<ApiResponse<UserProfile>>('/users/me');

    let userData = response.data.data || response.data as unknown as UserProfile;

    // ⭐ CRITICAL FIX: Map avatarUrl to avatar for consistency
    if (userData.avatarUrl && !userData.avatar) {
      userData.avatar = userData.avatarUrl;
    }

    // Map role to position for UI display
    if (userData.role) {
      userData.position = userData.role;
    }

    console.log('✅ User settings fetched successfully');
    console.log('👤 User:', {
      id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      avatar: userData.avatar
    });

    return userData;

  } catch (error: any) {
    console.error('❌ Error fetching user settings:', error);
    throw new Error(
      error.response?.data?.message ||
      'Failed to fetch user settings'
    );
  }
};
/**
 * Update user profile details
 * PUT /users/me
 */
export const updateUserSettings = async (
  updatedData: UpdateProfileData
): Promise<UserProfile> => {
  try {
    const cleanedData = Object.fromEntries(
      Object.entries(updatedData).filter(([_, v]) => v !== undefined && v !== '')
    );

    console.log('📤 Sending profile update:', cleanedData);

    const response = await api.put<ApiResponse<UserProfile>>(
      '/users/me',
      cleanedData
    );

    console.log('✅ Profile updated successfully');

    let userData = response.data.data || response.data as unknown as UserProfile;

    // ⭐ CRITICAL FIX: Map avatarUrl to avatar
    if (userData.avatarUrl && !userData.avatar) {
      userData.avatar = userData.avatarUrl;
    }

    // Map role to position for UI display
    if (userData.role) {
      userData.position = userData.role;
    }

    return userData;

  } catch (error: any) {
    console.error('❌ Error updating user settings:', error);
    throw new Error(
      error.response?.data?.message ||
      'Failed to update user settings'
    );
  }
};


/**
 * Update user password
 * PUT /users/me/password
 */
export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
): Promise<{ success: boolean; message: string; field?: 'current' | 'new' }> => {
  try {
    const response = await api.put<ApiResponse<any>>('/users/me/password', {
      currentPassword,
      newPassword,
      confirmNewPassword,
    });

    return {
      success: true,
      message: response.data.message || 'Password updated successfully',
    };
  } catch (error: any) {
    console.error('Error updating password:', error);

    const errorMessage = error.response?.data?.message || 'Failed to update password';

    // Determine which field has the error
    let field: 'current' | 'new' | undefined;
    if (errorMessage.toLowerCase().includes('current password')) {
      field = 'current';
    } else if (
      errorMessage.toLowerCase().includes('new password') ||
      errorMessage.toLowerCase().includes('password') && errorMessage.toLowerCase().includes('match')
    ) {
      field = 'new';
    }

    return {
      success: false,
      message: errorMessage,
      field,
    };
  }
};

/**
 * Update user profile image
 * PUT /users/me/profile-image
 * ⭐ RETURNS: Just the avatar URL string, not full UserProfile
 */
export const updateProfileImage = async (imageFile: File): Promise<string> => {
  try {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(imageFile.type)) {
      throw new Error('Invalid file type. Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imageFile.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB');
    }

    const formData = new FormData();
    formData.append('profileImage', imageFile);

    console.log('📤 Uploading profile image:', {
      name: imageFile.name,
      size: `${(imageFile.size / 1024).toFixed(2)} KB`,
      type: imageFile.type
    });

    // Don't set Content-Type - axios handles it automatically
    const response = await api.put<{
      success: boolean;
      message: string;
      data: { avatar?: string; avatarUrl?: string }  // ⭐ Accept both
    }>(
      '/users/me/profile-image',
      formData
    );

    console.log('✅ Profile image uploaded successfully');
    console.log('📦 Full response:', response.data);

    // ⭐ CRITICAL FIX: Check both avatar and avatarUrl
    const avatarUrl = response.data.data.avatarUrl || response.data.data.avatar;

    if (!avatarUrl) {
      console.error('❌ No avatar URL in response:', response.data);
      throw new Error('Server did not return avatar URL');
    }

    console.log('🖼️ New avatar URL:', avatarUrl);
    return avatarUrl;

  } catch (error: any) {
    console.error('❌ Error updating profile image:', error);
    console.error('Error response:', error.response?.data);

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to update profile image'
    );
  }
};

/**
 * Upload user document
 * POST /users/me/documents
 * FIXED: Removed Content-Type header and changed 'document' to 'documents'
 */
export const uploadUserDocument = async (documentFile: File): Promise<any> => {
  try {
    // Validate file type (PDFs and images)
    const validTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif'
    ];

    if (!validTypes.includes(documentFile.type)) {
      throw new Error('Invalid file type. Please upload a PDF or image file');
    }

    // Validate file size (e.g., max 10MB for documents)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (documentFile.size > maxSize) {
      throw new Error('File size too large. Maximum size is 10MB');
    }

    const formData = new FormData();
    formData.append('documents', documentFile);

    console.log('📤 Uploading document:', {
      name: documentFile.name,
      size: documentFile.size,
      type: documentFile.type
    });


    const response = await api.post<ApiResponse<any>>(
      '/users/me/documents',
      formData
      // No headers needed - axios handles multipart/form-data automatically
    );

    console.log('✅ Document uploaded successfully');

    // Handle both response formats
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error: any) {
    console.error('❌ Error uploading document:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to upload document'
    );
  }
};

/**
 * Custom React hook for managing user settings
 * Provides state management and API interactions for the Settings Module
 */
export interface UseSettingsReturn {
  // State
  userData: UserProfile | null;
  loading: boolean;
  error: string | null;
  isUpdating: boolean;

  // Actions
  fetchUserData: () => Promise<void>;
  updateProfile: (profileData: any) => Promise<UserProfile | undefined>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ) => Promise<{ success: boolean; message: string; field?: 'current' | 'new' }>;
  uploadImage: (file: File) => Promise<string | undefined>;
  refetch: () => Promise<void>;
}

export const useSettings = (): UseSettingsReturn => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  /**
   * Fetch user data from API
   */
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Fetching user data...');
      const data = await getUserSettings();

      console.log('✅ User data fetched:', {
        id: data._id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        avatarUrl: data.avatarUrl,
        role: data.role,
        position: data.position
      });

      setUserData(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch user data';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('❌ Error fetching user settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update user profile
   * Handles mapping of frontend fields to API fields
   */
  const updateProfile = useCallback(
    async (profileData: any): Promise<UserProfile | undefined> => {
      setIsUpdating(true);
      setError(null);

      try {
        // Prepare data for API - map frontend fields to API fields
        const dataToSend: UpdateProfileData = {};

        // Standard fields
        if (profileData.name) dataToSend.name = profileData.name;
        if (profileData.phone) dataToSend.phone = profileData.phone;
        if (profileData.dateOfBirth) dataToSend.dateOfBirth = profileData.dateOfBirth;
        if (profileData.gender) dataToSend.gender = profileData.gender;
        if (profileData.address) dataToSend.address = profileData.address;
        if (profileData.panNumber) dataToSend.panNumber = profileData.panNumber;
        if (profileData.citizenshipNumber) dataToSend.citizenshipNumber = profileData.citizenshipNumber;

        console.log('📤 Updating profile with data:', dataToSend);

        const updatedUser = await updateUserSettings(dataToSend);

        console.log('✅ Profile updated successfully:', {
          id: updatedUser._id,
          name: updatedUser.name,
          role: updatedUser.role,
          position: updatedUser.position
        });

        setUserData(updatedUser);
        toast.success('Profile updated successfully');

        return updatedUser;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to update profile';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('❌ Error updating profile:', err);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  /**
   * Change user password
   */
  const changePassword = useCallback(
    async (
      currentPassword: string,
      newPassword: string,
      confirmNewPassword: string
    ): Promise<{ success: boolean; message: string; field?: 'current' | 'new' }> => {
      setIsUpdating(true);
      setError(null);

      try {
        console.log('🔐 Attempting password change...');

        const result = await updateUserPassword(
          currentPassword,
          newPassword,
          confirmNewPassword
        );

        if (result.success) {
          console.log('✅ Password changed successfully');
          toast.success(result.message);
        } else {
          console.log('❌ Password change failed:', result.message);
          toast.error(result.message);
        }

        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to update password';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('❌ Error updating password:', err);

        return {
          success: false,
          message: errorMessage,
        };
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  /**
   * Upload profile image
   * ⭐ CRITICAL: Returns avatar URL string and only updates avatar field
   */
  const uploadImage = useCallback(
    async (file: File): Promise<string | undefined> => {
      // Client-side validation
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        const errorMessage = 'Invalid file type. Please upload an image file (JPEG, PNG, GIF, WEBP)';
        setError(errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        const errorMessage = 'Image size must be less than 5MB';
        setError(errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      setIsUpdating(true);
      setError(null);

      try {
        console.log('📤 useSettings: Starting image upload...');
        console.log('📊 useSettings: Current userData before upload:', {
          id: userData?._id,
          name: userData?.name,
          currentAvatar: userData?.avatar,
          currentAvatarUrl: userData?.avatarUrl
        });

        // ⭐ updateProfileImage now returns avatar URL string
        const avatarUrl = await updateProfileImage(file);

        console.log('✅ useSettings: Image uploaded successfully');
        console.log('🖼️ useSettings: New avatar URL:', avatarUrl);

        // ⭐ CRITICAL: Only update avatar fields, preserve ALL other data
        setUserData(prev => {
          if (!prev) {
            console.warn('⚠️ useSettings: No previous userData to update!');
            return prev;
          }

          const updated = {
            ...prev,              // Keep ALL existing fields
            avatar: avatarUrl,    // Update avatar
            avatarUrl: avatarUrl, // Update avatarUrl (for backend compatibility)
            photoPreview: avatarUrl // Update preview
          };

          console.log('📊 useSettings: Updated userData:', {
            id: updated._id,
            name: updated.name,
            avatar: updated.avatar,
            avatarUrl: updated.avatarUrl
          });

          return updated;
        });

        toast.success('Profile image updated successfully');
        return avatarUrl;

      } catch (err: any) {
        const errorMessage = err.message || 'Failed to update profile image';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('❌ useSettings: Image upload failed:', err);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [userData] // ⭐ Add userData as dependency for logging
  );

  /**
   * Refetch user data (alias for fetchUserData)
   */
  const refetch = useCallback(async () => {
    console.log('🔄 Refetching user data...');
    await fetchUserData();
  }, [fetchUserData]);

  /**
   * Fetch user data on component mount
   */
  useEffect(() => {
    console.log('🚀 useSettings: Mounting, fetching initial user data...');
    fetchUserData();
  }, [fetchUserData]);

  // ⭐ Debug effect to track userData changes
  useEffect(() => {
    if (userData) {
      console.log('📊 useSettings: userData state changed:', {
        id: userData._id,
        name: userData.name,
        avatar: userData.avatar,
        avatarUrl: userData.avatarUrl,
        role: userData.role,
        position: userData.position
      });
    }
  }, [userData]);

  return {
    // State
    userData,
    loading,
    error,
    isUpdating,

    // Actions
    fetchUserData,
    updateProfile,
    changePassword,
    uploadImage,
    refetch,
  };
};