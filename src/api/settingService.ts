import api from './api';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import  { useCallback } from 'react';
const USER_PROFILE_QUERY_KEY = 'myProfile';


export interface UserProfile {
  _id?: string;
  name: string; // Full name from API
  email: string;
  phone: string;
  role?: string;
  customRoleId?: string | { _id: string; name: string };
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

    // Handle different response structures:
    // 1. { success: true, data: { user: {...} } } - Super Admin login response
    // 2. { success: true, data: {...} } - Regular user response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- raw API response with varying shapes
    let userData: any = response.data.data;

    // Check if data is nested under 'user' property (super-admin structure)
    if (userData && userData.user) {
      userData = userData.user;
    }

    // Fallback to direct response.data if no nested structure
    if (!userData) {
      userData = response.data;
    }

    // Map backend fields to frontend fields
    const mappedData: UserProfile = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      customRoleId: userData.customRoleId,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
      avatarUrl: userData.avatarUrl,
      avatar: userData.avatarUrl || userData.avatar, // Map avatarUrl to avatar for consistency
      citizenshipNumber: userData.citizenshipNumber,
      panNumber: userData.panNumber,
      dateJoined: userData.dateJoined,
      address: userData.address,
      organizationId: userData.organizationId,
      isActive: userData.isActive,
      age: userData.age,
      position: userData.role, // Map role to position for UI display
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,

      // Frontend-only fields for form handling
      firstName: userData.firstName || (userData.name ? userData.name.split(' ')[0] : ''),
      lastName: userData.lastName || (userData.name ? userData.name.split(' ').slice(1).join(' ') : ''),
      dob: userData.dateOfBirth || userData.dob,
      pan: userData.panNumber || userData.pan,
      citizenship: userData.citizenshipNumber || userData.citizenship,
      location: userData.address || userData.location,
      photoPreview: userData.avatarUrl || userData.avatar || userData.photoPreview,
    };

    return mappedData;
  } catch (error: unknown) {
    throw new Error(
      (error instanceof Error ? error.message : undefined) || 'Failed to fetch user settings'
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
      Object.entries(updatedData).filter(([, v]) => v !== undefined && v !== '')
    );

    const response = await api.put<ApiResponse<UserProfile>>(
      '/users/me',
      cleanedData
    );

    // Handle different response structures (same as getUserSettings)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- raw API response with varying shapes
    let userData: any = response.data.data;

    // Check if data is nested under 'user' property (super-admin structure)
    if (userData && userData.user) {
      userData = userData.user;
    }

    // Fallback to direct response.data if no nested structure
    if (!userData) {
      userData = response.data;
    }

    // Map backend fields to frontend fields (same as getUserSettings)
    const mappedData: UserProfile = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
      avatarUrl: userData.avatarUrl,
      avatar: userData.avatarUrl || userData.avatar,
      citizenshipNumber: userData.citizenshipNumber,
      panNumber: userData.panNumber,
      dateJoined: userData.dateJoined,
      address: userData.address,
      organizationId: userData.organizationId,
      isActive: userData.isActive,
      age: userData.age,
      position: userData.role,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,

      // Frontend-only fields for form handling
      firstName: userData.firstName || (userData.name ? userData.name.split(' ')[0] : ''),
      lastName: userData.lastName || (userData.name ? userData.name.split(' ').slice(1).join(' ') : ''),
      dob: userData.dateOfBirth || userData.dob,
      pan: userData.panNumber || userData.pan,
      citizenship: userData.citizenshipNumber || userData.citizenship,
      location: userData.address || userData.location,
      photoPreview: userData.avatarUrl || userData.avatar || userData.photoPreview,
    };

    return mappedData;
  } catch (error: unknown) {
    throw new Error(
      (error instanceof Error ? error.message : undefined) || 'Failed to update user settings'
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
    const response = await api.put<ApiResponse<unknown>>('/users/me/password', {
      currentPassword,
      newPassword,
      confirmNewPassword,
    });

    return {
      success: true,
      message: response.data.message || 'Password updated successfully',
    };
  } catch (error: unknown) {
    const errorMessage =
      (error instanceof Error ? error.message : undefined) || 'Failed to update password';

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
  } catch (error: unknown) {
    throw new Error(
      (error instanceof Error ? error.message : undefined) ||
        'Failed to update profile image'
    );
  }
};

/**
 * Upload user document
 * POST /users/me/documents
 * FIXED: Removed Content-Type header and changed 'document' to 'documents'
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

    // Validate file size (e.g., max 10MB for documents)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (documentFile.size > maxSize) {
      throw new Error('File size too large. Maximum size is 10MB');
    }

    const formData = new FormData();
    formData.append('documents', documentFile);

    const response = await api.post<ApiResponse<unknown>>(
      '/users/me/documents',
      formData
      // No headers needed - axios handles multipart/form-data automatically
    );

    // Handle both response formats
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error: unknown) {
    throw new Error(
      (error instanceof Error ? error.message : undefined) ||
        'Failed to upload document'
    );
  }
};

/**
 * Custom React hook for managing user settings
 * Provides state management and API interactions for the Settings Module
 */
export interface UseSettingsReturn {
  userData: UserProfile | undefined; // Now comes from useQuery
  isLoading: boolean; // From useQuery
  isUpdating: boolean; // From mutations
  error: Error | null; // From useQuery

  // Actions
  fetchUserData: () => Promise<void>;
  updateProfile: (profileData: UpdateProfileData) => Promise<UserProfile>;
  changePassword: (
    data: PasswordUpdateData
  ) => Promise<{ success: boolean; message: string; field?: 'current' | 'new' }>;
  uploadImage: (file: File) => Promise<string>;
  refetch: () => void;
}

export const useSettings = (): UseSettingsReturn => {
  const queryClient = useQueryClient();

  // 1. QUERY: Fetch user data
  const {
    data: userData,
    isLoading: isLoadingUser,
    error,
    refetch: tqRefetch,
  } = useQuery({
    queryKey: [USER_PROFILE_QUERY_KEY], // Shares the same key as Sidebar
    queryFn: getUserSettings, // API function
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // 2. MUTATION: Update profile details
  const updateProfileMutation = useMutation({
    mutationFn: updateUserSettings,
    onSuccess: (updatedUser) => {
      // Update the cache directly with the new user data
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
      // Update the cache: Merge new avatarUrl into existing user data
      queryClient.setQueryData([USER_PROFILE_QUERY_KEY], (oldData: UserProfile | undefined) => {
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
    // State
    userData,
    isLoading: isLoading,
    error,
    isUpdating,

    // Actions
    fetchUserData: refetch, // fetchUserData is now just an alias for refetch
    updateProfile: updateProfileMutation.mutateAsync,
    changePassword: changePasswordMutation.mutateAsync,
    uploadImage: uploadImageMutation.mutateAsync,
    refetch,
  };
};