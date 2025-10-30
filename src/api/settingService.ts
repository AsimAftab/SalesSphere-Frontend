import { useState, useEffect, useCallback } from 'react';
import api from './api';
import toast from 'react-hot-toast';

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
    const response = await api.get<ApiResponse<UserProfile>>('/users/me');

    let userData = response.data.data || (response.data as unknown as UserProfile);

    // ⭐ CRITICAL FIX: Map avatarUrl to avatar for consistency
    if (userData.avatarUrl && !userData.avatar) {
      userData.avatar = userData.avatarUrl;
    }

    // Map role to position for UI display
    if (userData.role) {
      userData.position = userData.role;
    }

    return userData;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch user settings'
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

    const response = await api.put<ApiResponse<UserProfile>>(
      '/users/me',
      cleanedData
    );

    let userData = response.data.data || (response.data as unknown as UserProfile);

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
    throw new Error(
      error.response?.data?.message || 'Failed to update user settings'
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
    const errorMessage =
      error.response?.data?.message || 'Failed to update password';

    // Determine which field has the error
    let field: 'current' | 'new' | undefined;
    if (errorMessage.toLowerCase().includes('current password')) {
      field = 'current';
    } else if (
      errorMessage.toLowerCase().includes('new password') ||
      (errorMessage.toLowerCase().includes('password') &&
        errorMessage.toLowerCase().includes('match'))
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
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!validTypes.includes(imageFile.type)) {
      throw new Error(
        'Invalid file type. Please upload a valid image file (JPEG, PNG, GIF, WEBP)'
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imageFile.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB');
    }

    const formData = new FormData();
    formData.append('profileImage', imageFile);

    // Don't set Content-Type - axios handles it automatically
    const response = await api.put<{
      success: boolean;
      message: string;
      data: { avatar?: string; avatarUrl?: string }; // ⭐ Accept both
    }>('/users/me/profile-image', formData);

    // ⭐ CRITICAL FIX: Check both avatar and avatarUrl
    const avatarUrl = response.data.data.avatarUrl || response.data.data.avatar;

    if (!avatarUrl) {
      throw new Error('Server did not return avatar URL');
    }

    return avatarUrl;
  } catch (error: any) {
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
      'image/gif',
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

    const response = await api.post<ApiResponse<any>>(
      '/users/me/documents',
      formData
      // No headers needed - axios handles multipart/form-data automatically
    );

    // Handle both response formats
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error: any) {
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
      const data = await getUserSettings();
      setUserData(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch user data';
      setError(errorMessage);
      toast.error(errorMessage);
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
        if (profileData.dateOfBirth)
          dataToSend.dateOfBirth = profileData.dateOfBirth;
        if (profileData.gender) dataToSend.gender = profileData.gender;
        if (profileData.address) dataToSend.address = profileData.address;
        if (profileData.panNumber) dataToSend.panNumber = profileData.panNumber;
        if (profileData.citizenshipNumber)
          dataToSend.citizenshipNumber = profileData.citizenshipNumber;

        const updatedUser = await updateUserSettings(dataToSend);

        setUserData(updatedUser);
        toast.success('Profile updated successfully');

        return updatedUser;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to update profile';
        setError(errorMessage);
        toast.error(errorMessage);
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
        const result = await updateUserPassword(
          currentPassword,
          newPassword,
          confirmNewPassword
        );

        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }

        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to update password';
        setError(errorMessage);
        toast.error(errorMessage);

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
      const validTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
      ];
      if (!validTypes.includes(file.type)) {
        const errorMessage =
          'Invalid file type. Please upload an image file (JPEG, PNG, GIF, WEBP)';
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
        // ⭐ updateProfileImage now returns avatar URL string
        const avatarUrl = await updateProfileImage(file);

        // ⭐ CRITICAL: Only update avatar fields, preserve ALL other data
        setUserData((prev) => {
          if (!prev) {
            return prev;
          }
          return {
            ...prev, // Keep ALL existing fields
            avatar: avatarUrl, // Update avatar
            avatarUrl: avatarUrl, // Update avatarUrl (for backend compatibility)
            photoPreview: avatarUrl, // Update preview
          };
        });

        toast.success('Profile image updated successfully');
        return avatarUrl;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to update profile image';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [userData] // ⭐ Dependency for setUserData((prev) => ...)
  );

  /**
   * Refetch user data (alias for fetchUserData)
   */
  const refetch = useCallback(async () => {
    await fetchUserData();
  }, [fetchUserData]);

  /**
   * Fetch user data on component mount
   */
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

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