import api from './api';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from './endpoints';
import { handleApiError } from './errors';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

// Import segregated types
import type {
  ApiUserProfile,
  ApiResponse,
  UserProfile,
  UpdateProfileData,
  PasswordUpdateData,
  PasswordUpdateResult,
  LegacyUserProfile,
} from './settingService.types';

import { mapApiToUserProfile, toLegacyProfile } from './settingService.types';

// Re-export types for backward compatibility
export type {
  UserProfile,
  UpdateProfileData,
  PasswordUpdateData,
  PasswordUpdateResult,
  ApiResponse,
  LegacyUserProfile,
};

export { mapApiToUserProfile, toLegacyProfile };

const USER_PROFILE_QUERY_KEY = 'myProfile';

/**
 * Extracts user data from various API response structures.
 * Handles both regular and super-admin response formats.
 */
function extractUserData(responseData: unknown): ApiUserProfile {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- raw API response with varying shapes
  let userData: any = (responseData as { data?: unknown })?.data;

  // Check if data is nested under 'user' property (super-admin structure)
  if (userData && userData.user) {
    userData = userData.user;
  }

  // Fallback to direct responseData if no nested structure
  if (!userData) {
    userData = responseData;
  }

  return userData as ApiUserProfile;
}

/**
 * Get current user details
 * GET /users/me
 */
export const getUserSettings = async (): Promise<LegacyUserProfile> => {
  try {
    const response = await api.get<ApiResponse<unknown>>(API_ENDPOINTS.users.ME);
    const apiData = extractUserData(response.data);
    const profile = mapApiToUserProfile(apiData);

    // Return legacy-compatible profile for backward compatibility
    return toLegacyProfile(profile);
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to fetch user settings');
  }
};

/**
 * Update user profile details
 * PUT /users/me
 */
export const updateUserSettings = async (
  updatedData: UpdateProfileData
): Promise<LegacyUserProfile> => {
  try {
    const cleanedData = Object.fromEntries(
      Object.entries(updatedData).filter(([, v]) => v !== undefined && v !== '')
    );

    const response = await api.put<ApiResponse<unknown>>(
      API_ENDPOINTS.users.ME,
      cleanedData
    );

    const apiData = extractUserData(response.data);
    const profile = mapApiToUserProfile(apiData);

    return toLegacyProfile(profile);
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to update user settings');
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
): Promise<PasswordUpdateResult> => {
  try {
    const response = await api.put<ApiResponse<unknown>>(API_ENDPOINTS.users.ME_PASSWORD, {
      currentPassword,
      newPassword,
      confirmNewPassword,
    });

    return {
      success: true,
      message: response.data.message || 'Password updated successfully',
    };
  } catch (error: unknown) {
    const apiError = handleApiError(error, 'Failed to update password');
    const errorMessage = apiError.message;

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
 * Returns: Just the avatar URL string
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
    const maxSize = 5 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB');
    }

    const formData = new FormData();
    formData.append('profileImage', imageFile);

    const response = await api.put<{
      success: boolean;
      message: string;
      data: { avatar?: string; avatarUrl?: string };
    }>(API_ENDPOINTS.users.ME_PROFILE_IMAGE, formData);

    const avatarUrl = response.data.data.avatarUrl || response.data.data.avatar;

    if (!avatarUrl) {
      throw new Error('Server did not return avatar URL');
    }

    return avatarUrl;
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to update profile image');
  }
};

/**
 * Upload user document
 * POST /users/me/documents
 */
export const uploadUserDocument = async (documentFile: File): Promise<unknown> => {
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

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (documentFile.size > maxSize) {
      throw new Error('File size too large. Maximum size is 10MB');
    }

    const formData = new FormData();
    formData.append('documents', documentFile);

    const response = await api.post<ApiResponse<unknown>>(
      API_ENDPOINTS.users.ME_DOCUMENTS,
      formData
    );

    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to upload document');
  }
};

// =============================================================================
// React Hook
// =============================================================================

/**
 * Return type for useSettings hook
 */
export interface UseSettingsReturn {
  userData: LegacyUserProfile | undefined;
  isLoading: boolean;
  isUpdating: boolean;
  error: Error | null;

  // Actions
  fetchUserData: () => Promise<void>;
  updateProfile: (profileData: UpdateProfileData) => Promise<LegacyUserProfile>;
  changePassword: (data: PasswordUpdateData) => Promise<PasswordUpdateResult>;
  uploadImage: (file: File) => Promise<string>;
  refetch: () => void;
}

/**
 * Custom React hook for managing user settings
 * Provides state management and API interactions for the Settings Module
 */
export const useSettings = (): UseSettingsReturn => {
  const queryClient = useQueryClient();

  // 1. QUERY: Fetch user data
  const {
    data: userData,
    isLoading: isLoadingUser,
    error,
    refetch: tqRefetch,
  } = useQuery({
    queryKey: [USER_PROFILE_QUERY_KEY],
    queryFn: getUserSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // 2. MUTATION: Update profile details
  const updateProfileMutation = useMutation({
    mutationFn: updateUserSettings,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData([USER_PROFILE_QUERY_KEY], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Profile updated successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update profile');
    },
  });

  // 3. MUTATION: Change password
  const changePasswordMutation = useMutation({
    mutationFn: (data: PasswordUpdateData) =>
      updateUserPassword(data.currentPassword, data.newPassword, data.confirmNewPassword),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update password');
    },
  });

  // 4. MUTATION: Upload profile image
  const uploadImageMutation = useMutation({
    mutationFn: updateProfileImage,
    onSuccess: (avatarUrl) => {
      queryClient.setQueryData([USER_PROFILE_QUERY_KEY], (oldData: LegacyUserProfile | undefined) => {
        if (!oldData) return;
        return {
          ...oldData,
          avatar: avatarUrl,
          avatarUrl: avatarUrl,
          photoPreview: avatarUrl,
        };
      });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update profile image');
    },
  });

  // Combine loading states
  const isLoading = isLoadingUser;
  const isUpdating =
    updateProfileMutation.isPending ||
    changePasswordMutation.isPending ||
    uploadImageMutation.isPending;

  const refetch = useCallback(async () => {
    await tqRefetch();
  }, [tqRefetch]);

  return {
    userData,
    isLoading,
    error,
    isUpdating,

    // Actions
    fetchUserData: refetch,
    updateProfile: updateProfileMutation.mutateAsync,
    changePassword: changePasswordMutation.mutateAsync,
    uploadImage: uploadImageMutation.mutateAsync,
    refetch,
  };
};
