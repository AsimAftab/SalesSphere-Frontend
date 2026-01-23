import React, { useEffect, useRef, useState } from 'react';
import Button from '../../components/UI/Button/Button';
import DatePicker from '../../components/UI/DatePicker/DatePicker';
import { Eye, EyeOff, MapPin, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { SystemUser } from '../../api/SuperAdmin/systemUserService';
import { LocationPickerModal } from '../../components/modals/superadmin/LocationPickerModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/UI/SuperadminComponents/alert-dialog';
import { Alert, AlertDescription } from '../../components/UI/SuperadminComponents/alert';
import toast from 'react-hot-toast';
import { getSafeImageUrl } from '../../utils/security';

/* ----------------- Data Types ----------------- */
interface ProfileFormState {
  name: string;
  email: string;
  phone: string;
  position: string;
  dob: string;
  pan: string;
  citizenship: string;
  gender: string;
  location: string;
  photoPreview: string | null;
  _photoFile?: File;
}

type ProfileFormErrors = Partial<Record<keyof Omit<ProfileFormState, 'photoPreview' | '_photoFile'>, string>>;

interface SystemUserProfileContentProps {
  loading: boolean;
  error: string | null;
  userData: SystemUser;
  onSaveProfile: (data: Partial<SystemUser>) => void;
  onChangePassword: (current: string, next: string) => Promise<{ success: boolean; message: string; field?: 'current' | 'new' }>;
  onRevokeAccess: () => void;
  onGrantAccess: () => void;
  isOwnProfile: boolean;
  currentUserRole: string;
}

/* ----------------- Reusable Input ----------------- */
const Input: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  readOnly?: boolean;
  error?: string;
  maxLength?: number;
  placeholder?: string;
  onBlur?: () => void;
}> = ({ label, value, onChange, type = 'text', readOnly = false, error, maxLength, placeholder, onBlur }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      value={value || ''}
      readOnly={readOnly}
      maxLength={maxLength}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      className={`block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${!readOnly ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'} ${error ? 'border-red-500 ring-red-500' : ''}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const SystemUserProfileContent: React.FC<SystemUserProfileContentProps> = ({
  loading,
  error,
  userData,
  onSaveProfile,
  onChangePassword,
  onRevokeAccess,
  onGrantAccess,
  isOwnProfile,
  currentUserRole
}) => {
  const [form, setForm] = useState<ProfileFormState>({
    name: userData.name,
    email: userData.email,
    phone: userData.phone || '',
    position: userData.position || '',
    dob: userData.dob || '',
    pan: userData.pan || '',
    citizenship: userData.citizenship || '',
    gender: userData.gender || 'Male',
    location: userData.location || '',
    photoPreview: userData.photoPreview || null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [originalForm, setOriginalForm] = useState<ProfileFormState | null>(null);

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passwordErrors, setPasswordErrors] = useState<{ [k: string]: string }>({});
  const [fieldErrors, setFieldErrors] = useState<ProfileFormErrors>({});
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

  // Password visibility state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Location Picker Modal state
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

  // Access Control Dialog state
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [showGrantDialog, setShowGrantDialog] = useState(false);

  const photoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userData) {
      setForm({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        position: userData.position || '',
        dob: userData.dob || '',
        pan: userData.pan || '',
        citizenship: userData.citizenship || '',
        gender: userData.gender || 'Male',
        location: userData.location || '',
        photoPreview: userData.photoPreview || null
      });
    }
  }, [userData]);

  const handleChange = (key: keyof ProfileFormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (key in fieldErrors) {
      setFieldErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleVarcharChange = (key: 'name') => (val: string) => {
    if (/^[a-zA-Z\s]*$/.test(val)) handleChange(key, val);
  };

  const handlePhoneChange = (val: string) => {
    if (/^\d{0,10}$/.test(val)) handleChange('phone', val);
  };

  const handleCitizenshipChange = (val: string) => {
    if (/^\d{0,14}$/.test(val)) handleChange('citizenship', val);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (form.photoPreview && form.photoPreview.startsWith('blob:')) URL.revokeObjectURL(form.photoPreview);
      const url = URL.createObjectURL(file);
      setForm(prev => ({ ...prev, photoPreview: url, _photoFile: file }));
    }
  };

  const handleRemovePhoto = () => {
    setForm(prev => ({ ...prev, photoPreview: null, _photoFile: undefined }));
    if (photoFileInputRef.current) photoFileInputRef.current.value = '';
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setForm(prev => ({ ...prev, location: location.address }));
    setIsLocationPickerOpen(false);
  };

  const handleEdit = () => {
    setOriginalForm(form);
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (originalForm) setForm(originalForm);
    setIsEditing(false);
    setFieldErrors({});
    setOriginalForm(null);
    if (photoFileInputRef.current) photoFileInputRef.current.value = '';
  };

  const handleSave = () => {
    if (!validateProfile()) return;
    // Map frontend field names to backend field names
    const payload: Partial<SystemUser> = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      // position is not supported by the backend update endpoint
      dateOfBirth: form.dob,
      panNumber: form.pan,
      citizenshipNumber: form.citizenship,
      gender: form.gender,
      address: form.location,
    };
    onSaveProfile(payload);
    setIsEditing(false);
    setOriginalForm(null);
  };

  const getEmailError = (): string => {
    if (!form.email?.trim()) {
      return 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      return 'Email address is invalid.';
    }
    return '';
  };

  const handleEmailBlur = () => {
    const emailError = getEmailError();
    if (emailError) {
      setFieldErrors(prev => ({ ...prev, email: emailError }));
    }
  };

  const validateProfile = (): boolean => {
    const errs: ProfileFormErrors = {};
    if (!form.name?.trim()) errs.name = 'Name is required.';

    const emailError = getEmailError();
    if (emailError) errs.email = emailError;

    if (!form.phone?.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (form.phone.length < 10) {
      errs.phone = 'Phone number must be 10 digits.';
    }

    if (!form.citizenship?.trim()) {
      errs.citizenship = 'Citizenship number is required.';
    } else if (form.citizenship.length < 14) {
      errs.citizenship = 'Citizenship number must be 14 digits.';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePasswordUpdate = async () => {
    const errs: { [k: string]: string } = {};
    if (!passwords.current) errs.current = 'Current password required';
    if (!passwords.new) errs.new = 'New password required';
    // Enhanced password validation
    else if (passwords.new.length < 8) errs.new = 'Must be at least 8 characters.';
    else if (!/[A-Z]/.test(passwords.new)) errs.new = 'Must contain an uppercase letter.';
    else if (!/[a-z]/.test(passwords.new)) errs.new = 'Must contain a lowercase letter.';
    else if (!/[0-9]/.test(passwords.new)) errs.new = 'Must contain a number.';
    else if (!/[^A-Za-z0-9]/.test(passwords.new)) errs.new = 'Must contain a special character.';

    if (passwords.new !== passwords.confirm) errs.confirm = 'Passwords do not match';

    setPasswordErrors(errs);

    if (Object.keys(errs).length === 0) {
      setIsPasswordUpdating(true);
      try {
        const result = await onChangePassword(passwords.current, passwords.new);

        if (result.success) {
          setPasswords({ current: '', new: '', confirm: '' });
          toast.success('Password updated successfully!');
        } else {
          if (result.field) {
            setPasswordErrors(prev => ({ ...prev, [result.field!]: result.message }));
          } else {
            setPasswordErrors(prev => ({ ...prev, current: result.message }));
          }
        }
      } catch (error) {
        console.error("Password update failed:", error);
        setPasswordErrors(prev => ({ ...prev, current: "An unexpected error occurred." }));
        toast.error('Failed to update password. Please try again.');
      } finally {
        setIsPasswordUpdating(false);
      }
    }
  };

  // Check if user can edit this profile
  const canEdit = () => {
    const normalizedRole = currentUserRole?.toLowerCase();
    // Super admins can edit all profiles
    if (normalizedRole === "superadmin" || normalizedRole === "super admin") return true;
    // Developers can only edit their own profile
    if (normalizedRole === "developer" && isOwnProfile) return true;
    return false;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600 p-4 bg-red-100 rounded-lg">{error}</div>;

  const dropdownArrowSvg = `bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22%236b7280%22%3E%3Cpath%20d%3D%22M4.22%206.22a.75.75%200%200%201%201.06%200L8%208.94l2.72-2.72a.75.75%200%201%201%201.06%201.06l-3.25%203.25a.75.75%200%200%201-1.06%200L4.22%207.28a.75.75%200%200%201%200-1.06Z%22%2F%3E%3C%2Fsvg%3E')]`;

  return (
    <div className="space-y-8">
      {/* PROFILE SECTION */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
            <p className="text-sm text-gray-500">Update personal details and profile photo.</p>
          </div>
          <div className="flex gap-3">
            {/* Access Control Button - Only show for Super Admins viewing Developer profiles */}
            {(currentUserRole?.toLowerCase() === "superadmin" || currentUserRole?.toLowerCase() === "super admin") &&
              userData.role?.toLowerCase() === "developer" && !isOwnProfile && (
                <>
                  {userData.isActive ? (
                    <Button
                      variant="danger"
                      onClick={() => setShowRevokeDialog(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Revoke Access
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => setShowGrantDialog(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Grant Access
                    </Button>
                  )}
                </>
              )}
            {!isEditing && canEdit() && (
              <Button variant="primary" onClick={handleEdit}>
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Access Status Alert - Only show for Super Admins viewing Developer profiles */}
        {(currentUserRole?.toLowerCase() === "superadmin" || currentUserRole?.toLowerCase() === "super admin") &&
          userData.role?.toLowerCase() === "developer" && !isOwnProfile && (
            <>
              {userData.isActive ? (
                <Alert className="border-amber-200 bg-amber-50 mb-6">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800 text-sm">
                    <p className="font-medium">Active Developer Access</p>
                    <p className="text-xs mt-1">
                      This developer currently has full access to the system. Revoking access will
                      immediately prevent them from logging in or performing any actions.
                    </p>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-red-200 bg-red-50 mb-6">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 text-sm">
                    <p className="font-medium">Access Revoked</p>
                    <p className="text-xs mt-1">
                      This developer's access has been revoked. They cannot log in or access the system.
                      You can restore their access by granting access above.
                    </p>
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-3 flex flex-col items-center md:items-start">
            <img
              src={getSafeImageUrl(form.photoPreview) || 'https://placehold.co/300x300/E2E8F0/4A5568?text=Photo'}
              alt="Profile"
              className="rounded-lg w-full h-auto object-cover mb-4"
            />
            {isEditing && (
              <>
                <input
                  ref={photoFileInputRef}
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                  aria-label="Upload profile photo"
                  title="Choose a profile photo to upload"
                />
                <div className="flex gap-3 items-center mt-2">
                  <button
                    type="button"
                    onClick={() => photoFileInputRef.current?.click()}
                    className="text-sm font-semibold text-blue-600 hover:underline"
                    aria-label="Choose profile photo"
                  >
                    Choose Photo
                  </button>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-sm font-semibold text-red-600 hover:underline"
                    aria-label="Remove profile photo"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">JPG, PNG or GIF. Max 2MB.</p>
              </>
            )}
          </div>
          <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Input
              label="Full Name"
              value={form.name}
              onChange={handleVarcharChange('name')}
              readOnly={!isEditing}
              error={fieldErrors.name}
            />
            <Input
              label="Email Address"
              value={form.email}
              onChange={(v) => handleChange('email', v)}
              readOnly={!isEditing}
              onBlur={handleEmailBlur}
              error={fieldErrors.email}
            />
            <Input
              label="Phone Number"
              value={form.phone}
              onChange={handlePhoneChange}
              readOnly={!isEditing}
              error={fieldErrors.phone}
            />

            {!isEditing ? (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                <input
                  type="text"
                  value={form.dob ? (() => {
                    try {
                      const date = new Date(form.dob);
                      const day = String(date.getDate()).padStart(2, '0');
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const year = date.getFullYear();
                      return `${day}/${month}/${year}`;
                    } catch {
                      return form.dob;
                    }
                  })() : ''}
                  readOnly
                  aria-label="Date of Birth"
                  title="Date of Birth (read-only)"
                  className="block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-gray-200 cursor-not-allowed"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                <DatePicker
                  value={form.dob ? new Date(form.dob) : null}
                  onChange={(date) => handleChange('dob', date ? date.toLocaleDateString('en-CA') : '')}
                  placeholder="Select Date of Birth"
                />
                {fieldErrors.dob && <p className="text-red-500 text-xs mt-1">{fieldErrors.dob}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Position</label>
              <input
                type="text"
                value={form.position}
                readOnly
                aria-label="Position"
                title="Position (read-only)"
                className="block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-gray-200 cursor-not-allowed"
              />
            </div>

            <Input
              label="Citizenship Number"
              value={form.citizenship}
              onChange={handleCitizenshipChange}
              readOnly={!isEditing}
              error={fieldErrors.citizenship}
              maxLength={14}
            />

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                disabled={!isEditing}
                aria-label="Gender"
                title={isEditing ? "Select gender" : "Gender (read-only)"}
                className={`block w-full appearance-none rounded-lg border border-gray-300 px-4 pr-10 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${isEditing ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'} bg-no-repeat ${dropdownArrowSvg} bg-[position:right_0.75rem_center] bg-[length:20px_20px]`}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.location || ''}
                  readOnly={!isEditing}
                  onChange={(e) => handleChange('location', e.target.value)}
                  aria-label="Location"
                  title={isEditing ? "Enter location or use map picker" : "Location (read-only)"}
                  className={`block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${!isEditing ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}`}
                  placeholder="Enter location or use map picker"
                />
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsLocationPickerOpen(true)}
                    aria-label="Open map to pick location"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <MapPin className="w-4 h-4" />
                    Pick Location
                  </button>
                )}
              </div>
            </div>

            {/* Account Information - Read Only */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Account Created</label>
              <p className="text-gray-900 text-sm mt-2">
                {(userData.createdAt || userData.dateJoined) ? (() => {
                  try {
                    const date = new Date(userData.createdAt || userData.dateJoined || '');
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    return `${day}/${month}/${year} ${hours}:${minutes}`;
                  } catch {
                    return 'N/A';
                  }
                })() : 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Last Updated</label>
              <p className="text-gray-900 text-sm mt-2">
                {userData.updatedAt ? (() => {
                  try {
                    const date = new Date(userData.updatedAt);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    return `${day}/${month}/${year} ${hours}:${minutes}`;
                  } catch {
                    return 'N/A';
                  }
                })() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end mt-6 gap-4 border-t border-gray-200 pt-6">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* PASSWORD SECTION - Only show for own profile */}
      {isOwnProfile && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Change Password</h2>
          <p className="text-sm text-gray-500 mb-6">Update your password to keep your account secure.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Current Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwords.current}
                  onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
                  placeholder="Enter your current password"
                  aria-label="Current Password"
                  title="Enter your current password"
                  className={`block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 pr-10 text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm focus:bg-white ${passwordErrors.current ? 'border-red-500 ring-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.current && <p className="text-red-500 text-xs mt-1">{passwordErrors.current}</p>}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">New Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwords.new}
                  onChange={(e) => setPasswords(p => ({ ...p, new: e.target.value }))}
                  placeholder="Enter your new password"
                  aria-label="New Password"
                  title="Enter your new password"
                  className={`block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 pr-10 text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm focus:bg-white ${passwordErrors.new ? 'border-red-500 ring-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.new && <p className="text-red-500 text-xs mt-1">{passwordErrors.new}</p>}
              {!passwordErrors.new && (
                <p className="text-xs text-gray-500 mt-1">
                  Min. 8 characters with upper & lower case, number, and special character.
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Confirm New Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  placeholder="Confirm your new password"
                  aria-label="Confirm New Password"
                  title="Confirm your new password"
                  className={`block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 pr-10 text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm focus:bg-white ${passwordErrors.confirm ? 'border-red-500 ring-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.confirm && <p className="text-red-500 text-xs mt-1">{passwordErrors.confirm}</p>}
            </div>
          </div>
          <div className="flex justify-start mt-8 pt-6">
            <Button variant="primary" onClick={handlePasswordUpdate} disabled={isPasswordUpdating}>
              {isPasswordUpdating ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </div>
      )}

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onLocationSelect={handleLocationSelect}
      />

      {/* Revoke Access Confirmation Dialog */}
      <AlertDialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Developer Access?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark <strong>{userData.name}</strong> as inactive and immediately revoke their
              access to the system. They will not be able to log in or perform any actions until
              access is granted again.
              <br /><br />
              This action can be reversed by granting access later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onRevokeAccess();
                setShowRevokeDialog(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Revoke Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Grant Access Confirmation Dialog */}
      <AlertDialog open={showGrantDialog} onOpenChange={setShowGrantDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Grant Developer Access?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reactivate <strong>{userData.name}</strong> and restore their access to the
              system. They will be able to log in and perform their role as a Developer with all
              their previous permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onGrantAccess();
                setShowGrantDialog(false);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Grant Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SystemUserProfileContent;
