// src/api/settingService.ts
import api from './api';

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