/**
 * User Profile Types - Following Interface Segregation Principle (ISP)
 *
 * Segregated into:
 * 1. ApiUserProfile - Raw shape from backend API
 * 2. UserProfileCore - Clean frontend model (new code should use this)
 * 3. UserProfile - Full backward-compatible interface (includes legacy aliases)
 * 4. UpdateProfileData - Payload for profile updates
 * 5. PasswordUpdateData - Payload for password changes
 */

// =============================================================================
// API Response Types (What the backend sends)
// =============================================================================

/**
 * Raw user profile shape from the backend API.
 * Used internally by the mapper functions.
 */
export interface ApiUserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  customRoleId?: string | { _id: string; name: string };
  dateOfBirth?: string;
  gender?: string;
  avatar?: string;
  avatarUrl?: string;
  citizenshipNumber?: string;
  panNumber?: string;
  dateJoined?: string;
  address?: string;
  organizationId?: string;
  isActive?: boolean;
  age?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// =============================================================================
// Frontend Model (Clean version for new code)
// =============================================================================

/**
 * Custom role information when populated from backend
 */
export interface UserCustomRole {
  _id: string;
  name: string;
}

/**
 * Core user profile model - clean interface without legacy aliases.
 * New code should prefer this interface.
 */
export interface UserProfileCore {
  // Core identity
  id: string;
  name: string;
  email: string;
  phone: string;

  // Role information
  role?: string;
  customRole?: UserCustomRole;
  position?: string;

  // Personal details
  dateOfBirth?: string;
  gender?: string;
  age?: number;

  // Avatar/Image
  avatarUrl?: string;

  // Documents
  citizenshipNumber?: string;
  panNumber?: string;

  // Location
  address?: string;

  // Organization
  organizationId?: string;
  dateJoined?: string;

  // Status
  isActive?: boolean;

  // Timestamps
  createdAt?: string;
  updatedAt?: string;

  // Computed display helpers
  firstName: string;
  lastName: string;
}

// =============================================================================
// Backward Compatible Interface (What components currently expect)
// =============================================================================

/**
 * Full user profile interface with backward-compatible field aliases.
 * Existing code imports this - maintains all legacy field names.
 */
export interface UserProfile extends UserProfileCore {
  // Legacy ID field
  _id?: string;

  // Legacy avatar fields
  avatar?: string;
  photoPreview?: string;

  // Legacy date alias
  dob?: string;

  // Legacy document aliases
  pan?: string;
  citizenship?: string;

  // Legacy location alias
  location?: string;

  // Legacy customRoleId (can be string or object)
  customRoleId?: string | { _id: string; name: string };
}

// =============================================================================
// Form/Update Payloads (What we send to backend)
// =============================================================================

/**
 * Data structure for updating user profile.
 * Only includes fields that can be updated by the user.
 */
export interface UpdateProfileData {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  panNumber?: string;
  citizenshipNumber?: string;
  address?: string;
}

/**
 * Data structure for password change requests.
 */
export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

/**
 * Response from password update operation.
 */
export interface PasswordUpdateResult {
  success: boolean;
  message: string;
  field?: 'current' | 'new';
}

// =============================================================================
// Mapper Utilities
// =============================================================================

/**
 * Maps API response to frontend UserProfile model.
 * Includes all legacy field aliases for backward compatibility.
 */
export function mapApiToUserProfile(apiData: ApiUserProfile): UserProfile {
  const nameParts = apiData.name?.split(' ') || [''];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Resolve custom role
  let customRole: UserCustomRole | undefined;
  if (typeof apiData.customRoleId === 'object' && apiData.customRoleId !== null) {
    customRole = {
      _id: apiData.customRoleId._id,
      name: apiData.customRoleId.name,
    };
  }

  // Derive position for display
  const position = customRole?.name || apiData.role || undefined;

  // Resolve avatar URL
  const avatarUrl = apiData.avatarUrl || apiData.avatar;

  return {
    // Core fields
    id: apiData._id,
    name: apiData.name,
    email: apiData.email,
    phone: apiData.phone,
    role: apiData.role,
    customRole,
    position,
    dateOfBirth: apiData.dateOfBirth,
    gender: apiData.gender,
    age: apiData.age,
    avatarUrl,
    citizenshipNumber: apiData.citizenshipNumber,
    panNumber: apiData.panNumber,
    address: apiData.address,
    organizationId: apiData.organizationId,
    dateJoined: apiData.dateJoined,
    isActive: apiData.isActive,
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
    firstName,
    lastName,

    // Legacy aliases for backward compatibility
    _id: apiData._id,
    avatar: avatarUrl,
    photoPreview: avatarUrl,
    dob: apiData.dateOfBirth,
    pan: apiData.panNumber,
    citizenship: apiData.citizenshipNumber,
    location: apiData.address,
    customRoleId: apiData.customRoleId,
  };
}

// Type alias for legacy code
export type LegacyUserProfile = UserProfile;

/**
 * Identity function for legacy compatibility.
 * @deprecated No longer needed - UserProfile already includes legacy fields.
 */
export function toLegacyProfile(profile: UserProfile): UserProfile {
  return profile;
}
