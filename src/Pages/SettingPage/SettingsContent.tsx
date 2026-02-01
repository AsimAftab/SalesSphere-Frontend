import React, { useEffect, useRef, useState } from 'react';
import Button from '../../components/UI/Button/Button';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import DatePicker from '../../components/UI/DatePicker/DatePicker';
import { LocationPickerModal } from '../../components/modals/superadmin/LocationPickerModal';
import { motion } from 'framer-motion';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { getSafeImageUrl } from '../../utils/security';

/* ----------------- Data Types ----------------- */
interface ProfileFormState {
  firstName: string; lastName: string; dob: string; email: string;
  phone: string; position: string; pan: string; citizenship: string;
  gender: string; location: string; photoPreview: string | null;
  _photoFile?: File;
}

type ProfileFormErrors = Partial<Record<keyof Omit<ProfileFormState, 'photoPreview' | '_photoFile'>, string>>;

interface SettingsContentProps {
  loading: boolean;
  error: string | null;
  userData: Record<string, unknown>;
  onSaveProfile: (data: Record<string, unknown>) => void;
  onChangePassword: (current: string, next: string) => Promise<{ success: boolean; message: string; field?: 'current' | 'new' }>;
  onImageUpload?: (file: File) => Promise<void>;
}

/* ----------------- Reusable Input ----------------- */
const Input: React.FC<{
  label: string,
  value: string,
  onChange: (v: string) => void,
  type?: string,
  readOnly?: boolean,
  error?: string,
  maxLength?: number,
  placeholder?: string,
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

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// --- Skeleton Component ---
const SettingsSkeleton: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div className="space-y-8">
        {/* Header Skeleton */}
        <h1 className="text-3xl font-bold">
          <Skeleton width={200} height={36} />
        </h1>

        {/* Profile Section Skeleton */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold"><Skeleton width={250} /></h2>
            <p className="text-sm"><Skeleton width={300} /></p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Photo Skeleton */}
            <div className="md:col-span-3 flex flex-col items-center md:items-start">
              <Skeleton className="w-full aspect-square" borderRadius={8} />
              <Skeleton width="50%" height={16} className="mt-4" />
              <Skeleton width="70%" height={12} className="mt-2" />
            </div>
            {/* Form Skeleton */}
            <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <Skeleton width="40%" height={16} className="mb-1" />
                  <Skeleton height={44} borderRadius={8} />
                </div>
              ))}
              <div className="sm:col-span-2 md:col-span-3">
                <Skeleton width="40%" height={16} className="mb-1" />
                <Skeleton height={44} borderRadius={8} />
              </div>
            </div>
          </div>
        </div>

        {/* Password Section Skeleton */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold"><Skeleton width={250} /></h2>
          <p className="text-sm mb-6"><Skeleton width={300} /></p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <Skeleton width="50%" height={16} className="mb-1" />
                <Skeleton height={44} borderRadius={8} />
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6">
            <Skeleton height={40} width={150} borderRadius={8} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};


/* ----------------- Optimized SettingsContent Component ----------------- */
const SettingsContent: React.FC<SettingsContentProps> = ({ loading, error, userData, onSaveProfile, onChangePassword, onImageUpload }) => {

  const isSuperAdmin = userData?.role?.toLowerCase() === 'superadmin' || userData?.role?.toLowerCase() === 'super admin';
  const [form, setForm] = useState<ProfileFormState>({} as ProfileFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [originalForm, setOriginalForm] = useState<ProfileFormState | null>(null);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passwordErrors, setPasswordErrors] = useState<{ [k: string]: string }>({});
  const [fieldErrors, setFieldErrors] = useState<ProfileFormErrors>({});
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userData) {
      const formatDateOfBirth = (date: string | undefined): string => {
        if (!date) return '';
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
        try {
          const dateObj = new Date(date);
          const year = dateObj.getUTCFullYear();
          const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getUTCDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        } catch {
          return '';
        }
      };
      const formattedDob = formatDateOfBirth(userData.dateOfBirth || userData.dob);
      const formattedCitizenship = userData.citizenshipNumber || userData.citizenship || '';
      setForm({
        firstName: userData.firstName || (userData.name ? userData.name.split(' ')[0] : ''),
        lastName: userData.lastName || (userData.name ? userData.name.split(' ').slice(1).join(' ') : ''),
        dob: formattedDob,
        email: userData.email || '',
        phone: userData.phone || '',
        position: userData.position || userData.role || '',
        pan: userData.panNumber || userData.pan || '',
        citizenship: formattedCitizenship,
        gender: userData.gender || '',
        location: userData.address || userData.location || '',
        photoPreview: userData.avatar || userData.photoPreview || null,
      });
    }
  }, [userData]);

  const calculateAge = (dob: string): number => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  const handleChange = (key: keyof ProfileFormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (key in fieldErrors) {
      setFieldErrors(prev => ({ ...prev, [key]: '' }));
    }
  };
  const handleVarcharChange = (key: 'firstName' | 'lastName') => (val: string) => { if (/^[a-zA-Z\s]*$/.test(val)) handleChange(key, val); };
  const handlePhoneChange = (val: string) => { if (/^\d{0,10}$/.test(val)) handleChange('phone', val); };
  const handlePanChange = (val: string) => {
    if (/^[a-zA-Z0-9]{0,14}$/.test(val)) handleChange('pan', val);
  };
  const handleCitizenshipChange = (val: string) => {
    if (/^[\d\-/]{0,20}$/.test(val)) {
      handleChange('citizenship', val);
    }
  };
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (form.photoPreview && form.photoPreview.startsWith('blob:')) URL.revokeObjectURL(form.photoPreview);
      const url = URL.createObjectURL(file);
      setForm(prev => ({ ...prev, photoPreview: url, _photoFile: file }));
      if (onImageUpload) {
        try {
          await onImageUpload(file);
        } catch {
          setForm(prev => ({ ...prev, photoPreview: userData?.avatar || userData?.photoPreview || null, _photoFile: undefined }));
        }
      }
    }
  };
  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setForm(prev => ({ ...prev, location: location.address }));
    setIsLocationPickerOpen(false);
  };
  const handleEdit = () => { setOriginalForm(form); setIsEditing(true); };
  const handleCancel = () => {
    if (originalForm) setForm(originalForm);
    setIsEditing(false); setFieldErrors({}); setOriginalForm(null);
    if (photoFileInputRef.current) photoFileInputRef.current.value = '';
  };
  const handleSave = () => {
    if (!validateProfile()) return;
    const payload = {
      name: `${form.firstName} ${form.lastName}`.trim(),
      phone: form.phone,
      ...(form.dob && { dateOfBirth: form.dob }),
      ...(form.gender && { gender: form.gender }),
      ...(form.pan && { panNumber: form.pan }),
      ...(form.citizenship && { citizenshipNumber: form.citizenship }),
      ...(form.location && { address: form.location }),
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
  const validateProfile = (): boolean => {
    const errs: ProfileFormErrors = {};
    if (!form.firstName?.trim()) errs.firstName = 'First name is required.';
    if (!form.lastName?.trim()) errs.lastName = 'Last name is required.';
    const emailError = getEmailError();
    if (emailError) errs.email = emailError;
    if (!form.phone?.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (form.phone.length !== 10) {
      errs.phone = 'Phone number must be exactly 10 digits.';
    }
    if (!form.citizenship?.trim()) {
      errs.citizenship = 'Citizenship number is required.';
    } else if (form.citizenship.length > 14) {
      errs.citizenship = 'Citizenship number must be 14 characters or less.';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handlePasswordUpdate = async () => {
    const errs: { [k: string]: string } = {};
    if (!passwords.current) errs.current = 'Current password required';
    if (!passwords.new) errs.new = 'New password required';
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
        if (!result.success) {
          if (result.field) {
            setPasswordErrors(prev => ({ ...prev, [result.field!]: result.message }));
          } else {
            setPasswordErrors(prev => ({ ...prev, current: result.message }));
          }
        }
      } catch {
        setPasswordErrors(prev => ({ ...prev, current: "An unexpected error occurred." }));
      } finally {
        setIsPasswordUpdating(false);
        setPasswords({ current: '', new: '', confirm: '' });
      }
    }
  };

  // --- Skeleton Loading State ---
  if (loading && !userData) {
    return <SettingsSkeleton />;
  }

  // --- Initial Error State ---
  if (error && !userData) {
    return <div className="text-red-600 p-4 bg-red-100 rounded-lg">{error}</div>;
  }

  if (!form) return null;

  const dropdownArrowSvg = `bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22%236b7280%22%3E%3Cpath%20d%3D%22M4.22%206.22a.75.75%200%200%201%201.06%200L8%208.94l2.72-2.72a.75.75%200%201%201%201.06%201.06l-3.25%203.25a.75.75%200%200%201-1.06%200L4.22%207.28a.75.75%200%200%201%200-1.06Z%22%2F%3E%3C%2Fsvg%3E')]`;

  return (
    // --- Added motion wrapper ---
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* --- Banners for refetch/error --- */}
      {loading && userData && (
        <div className="p-3 text-center text-sm text-blue-500 bg-blue-50 rounded-lg flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 inline animate-spin" />
          Refreshing user data...
        </div>
      )}
      {error && userData && (
        <div className="text-red-600 p-4 bg-red-100 rounded-lg">{error}</div>
      )}

      {/* --- Added motion wrapper --- */}
      <motion.h1
        variants={itemVariants}
        className="text-3xl font-bold text-[#202224] text-center md:text-left"
      >
        Setting
      </motion.h1>

      {/* --- Added motion wrapper --- */}
      <motion.div
        variants={itemVariants}
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
            <p className="text-sm text-gray-500">Update your personal details and profile photo.</p>
          </div>
          {!isEditing && <Button variant="primary" onClick={handleEdit}>Edit Profile</Button>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-3 flex flex-col items-center md:items-start">
            <img src={getSafeImageUrl(form.photoPreview) || 'https://placehold.co/300x300/E2E8F0/4A5568?text=Photo'} alt="Profile" className="rounded-lg w-full h-auto object-cover mb-4" />
            {isEditing && (
              <>
                <input ref={photoFileInputRef} id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} aria-label="Upload profile photo" />
                <div className="flex gap-3 items-center mt-2">
                  <label htmlFor="photo-upload" className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer">Choose Photo</label>
                </div>
                <p className="text-xs text-gray-400 mt-2">JPG, PNG or GIF. Max 2MB.</p>
              </>
            )}
          </div>
          <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Input label="First Name" value={form.firstName} onChange={handleVarcharChange('firstName')} readOnly={!isEditing} error={fieldErrors.firstName} />
            <Input label="Last Name" value={form.lastName} onChange={handleVarcharChange('lastName')} readOnly={!isEditing} error={fieldErrors.lastName} />
            <div className="grid grid-cols-2 gap-3">
              {!isEditing ? (
                <Input
                  label="DOB"
                  type="text"
                  value={form.dob}
                  onChange={() => { }}
                  readOnly={true}
                />
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">DOB</label>
                  <DatePicker
                    value={form.dob ? new Date(form.dob) : null}
                    onChange={(date) => handleChange('dob', date ? date.toLocaleDateString('en-CA') : '')}
                    placeholder="Select Date of Birth"
                  />
                  {fieldErrors.dob && <p className="text-red-500 text-xs mt-1">{fieldErrors.dob}</p>}
                </div>
              )}
              <Input
                label="Age"
                type="text"
                value={form.dob ? `${calculateAge(form.dob)} years` : ''}
                onChange={() => { }}
                readOnly={true}
              />
            </div>
            <Input
              label="Email Address"
              value={form.email}
              onChange={() => { }}
              readOnly={true}
            />
            <Input label="Phone Number" value={form.phone} onChange={handlePhoneChange} readOnly={!isEditing} error={fieldErrors.phone} />
            {!isSuperAdmin && (
              <>
                <Input
                  label="Position"
                  value={form.position}
                  onChange={(v) => handleChange('position', v)}
                  readOnly={true}
                  placeholder="Position from system"
                />
                <Input label="PAN Number" value={form.pan} onChange={handlePanChange} readOnly={!isEditing} error={fieldErrors.pan} maxLength={14} />
              </>
            )}
            <Input
              label="Citizenship Number"
              value={form.citizenship}
              onChange={handleCitizenshipChange}
              readOnly={!isEditing}
              error={fieldErrors.citizenship}
              maxLength={14}
            />
            <div>
              <label htmlFor="gender-select" className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
              <select id="gender-select" value={form.gender} onChange={(e) => handleChange('gender', e.target.value)} disabled={!isEditing}
                className={`block w-full appearance-none rounded-lg border border-gray-300 px-4 pr-10 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${isEditing ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'} bg-no-repeat ${dropdownArrowSvg} bg-[position:right_0.75rem_center] bg-[length:20px_20px]`}>
                <option>Male</option><option>Female</option><option>Other</option>
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
                  className={`block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${!isEditing ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}`}
                  placeholder="Enter location or use map picker"
                />
                {isEditing && (
                  <Button variant="secondary" onClick={() => setIsLocationPickerOpen(true)}>Pick Location</Button>
                )}
              </div>
            </div>
          </div>
        </div>
        {isEditing && (
          <div className="flex justify-end mt-6 gap-4 border-t border-gray-200 pt-6">
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </motion.div>

      {/* --- Added motion wrapper --- */}
      <motion.div
        variants={itemVariants}
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm"
      >
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
                className={`block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 pr-10 text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm focus:bg-white ${passwordErrors.current ? 'border-red-500 ring-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
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
                className={`block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 pr-10 text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm focus:bg-white ${passwordErrors.new ? 'border-red-500 ring-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
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
                className={`block w-full appearance-none rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 pr-10 text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm focus:bg-white ${passwordErrors.confirm ? 'border-red-500 ring-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
      </motion.div>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onLocationSelect={handleLocationSelect}
      />
    </motion.div>
  );
};

export default SettingsContent;