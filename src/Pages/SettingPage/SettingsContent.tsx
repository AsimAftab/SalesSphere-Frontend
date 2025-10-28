import React, { useEffect, useRef, useState } from 'react';
import Button from '../../components/UI/Button/Button';
import { Eye, EyeOff, MapPin } from 'lucide-react';
import DatePicker from '../../components/UI/DatePicker/DatePicker';
import { LocationPickerModal } from '../../components/modals/superadmin/LocationPickerModal';

/* ----------------- Data Types ----------------- */
interface ProfileFormState {
  firstName: string; lastName: string; dob: string; email: string;
  phone: string; position: string; pan: string; citizenship: string;
  gender: string; location: string; photoPreview: string | null;
  _photoFile?: File; // Internal state for the uploaded file
}

type ProfileFormErrors = Partial<Record<keyof Omit<ProfileFormState, 'photoPreview' | '_photoFile'>, string>>;

// --- UPDATED Prop Type ---
interface SettingsContentProps {
  loading: boolean;
  error: string | null;
  userData: any;
  onSaveProfile: (data: any) => void;
  // This function now returns a Promise with a structured response
  onChangePassword: (current: string, next: string) => Promise<{ success: boolean; message: string; field?: 'current' | 'new' }>;
  onImageUpload?: (file: File) => Promise<void>;
}

/* ----------------- Reusable Input (For Profile Section ONLY) ----------------- */
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

/* ----------------- Optimized SettingsContent Component ----------------- */
const SettingsContent: React.FC<SettingsContentProps> = ({ loading, error, userData, onSaveProfile, onChangePassword, onImageUpload }) => {

  const [form, setForm] = useState<ProfileFormState>({} as ProfileFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [originalForm, setOriginalForm] = useState<ProfileFormState | null>(null);

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passwordErrors, setPasswordErrors] = useState<{ [k: string]: string }>({});
  const [fieldErrors, setFieldErrors] = useState<ProfileFormErrors>({});

  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

  // --- ADDED: State for password visibility ---
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // --- END ADDITIONS ---

  // Location Picker Modal state
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

  const photoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userData) {
      // Map API response to form state - use correct field names from documentation
      // Format dateOfBirth to YYYY-MM-DD if it's an ISO string
      const formatDateOfBirth = (date: string | undefined): string => {
        if (!date) return '';
        // If it's already in YYYY-MM-DD format, return as is
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
        // If it's an ISO string, convert to YYYY-MM-DD
        try {
          return new Date(date).toLocaleDateString('en-CA');
        } catch {
          return date;
        }
      };

      setForm({
        firstName: userData.firstName || (userData.name ? userData.name.split(' ')[0] : ''),
        lastName: userData.lastName || (userData.name ? userData.name.split(' ').slice(1).join(' ') : ''),
        dob: formatDateOfBirth(userData.dateOfBirth || userData.dob), // Format ISO dates
        email: userData.email || '',
        phone: userData.phone || '',
        position: userData.position || userData.role || '',
        pan: userData.panNumber || userData.pan || '', // API uses panNumber
        citizenship: userData.citizenshipNumber || userData.citizenship || '', // API uses citizenshipNumber
        gender: userData.gender || '',
        location: userData.address || userData.location || '', // API uses address
        photoPreview: userData.avatar || userData.photoPreview || null,
      });
    }
  }, [userData]);

  // Calculate age from date of birth
  const calculateAge = (dob: string): number => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred yet this year
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

  /* ---------- Specialized Input Handlers (keep specific formatting logic) ---------- */
  const handleVarcharChange = (key: 'firstName' | 'lastName') => (val: string) => { if (/^[a-zA-Z\s]*$/.test(val)) handleChange(key, val); };
  const handlePhoneChange = (val: string) => { if (/^\d{0,10}$/.test(val)) handleChange('phone', val); };

  // PAN Number: Alphanumeric (letters and numbers), max 14 characters
  const handlePanChange = (val: string) => {
    if (/^[a-zA-Z0-9]{0,14}$/.test(val)) handleChange('pan', val);
  };

  // Citizenship: Digits, forward slash (/), and hyphen (-), max 14 characters
  const handleCitizenshipChange = (val: string) => {
    if (/^[\d\-\/]{0,14}$/.test(val)) {
      handleChange('citizenship', val);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      if (form.photoPreview && form.photoPreview.startsWith('blob:')) URL.revokeObjectURL(form.photoPreview);
      const url = URL.createObjectURL(file);
      setForm(prev => ({ ...prev, photoPreview: url, _photoFile: file }));

      // Upload image if onImageUpload is provided
      if (onImageUpload) {
        try {
          await onImageUpload(file);
        } catch (error) {
          console.error('Image upload failed:', error);
          // Revert preview on error
          setForm(prev => ({ ...prev, photoPreview: userData?.avatar || userData?.photoPreview || null, _photoFile: undefined }));
        }
      }
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

  const handleEdit = () => { setOriginalForm(form); setIsEditing(true); };
  const handleCancel = () => {
    if (originalForm) setForm(originalForm);
    setIsEditing(false); setFieldErrors({}); setOriginalForm(null);
    if (photoFileInputRef.current) photoFileInputRef.current.value = '';
  };
  const handleSave = () => {
    if (!validateProfile()) return;

    // CRITICAL: Send ALL fields to prevent data loss
    // Even if PUT /users/me doesn't update some fields, we send them anyway
    // to prevent the backend from clearing them
    const payload = {
      name: `${form.firstName} ${form.lastName}`.trim(),
      phone: form.phone,
      // Include all other fields even if they might not be updated
      // This prevents data loss on the backend
      ...(form.dob && { dateOfBirth: form.dob }),
      ...(form.gender && { gender: form.gender }),
      ...(form.pan && { panNumber: form.pan }),
      ...(form.citizenship && { citizenshipNumber: form.citizenship }),
      ...(form.location && { address: form.location }),
      // ⭐ REMOVED: position field - it's read-only from backend, shouldn't be sent
      // Position is set by system/admin and cannot be changed by user
    };

    console.log('📤 Sending to PUT /users/me (all fields):', payload);
    onSaveProfile(payload);
    setIsEditing(false);
    setOriginalForm(null);
  };

  /* ---------------- Validation & Password Handlers (UPDATED) ---------------- */

  const getEmailError = (): string => {
    if (!form.email?.trim()) {
      return 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      return 'Email address is invalid.';
    }
    return ''; // No error
  };

  const handleEmailBlur = () => {
    const emailError = getEmailError();
    if (emailError) {
      setFieldErrors(prev => ({ ...prev, email: emailError }));
    }
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
    } else if (form.citizenship.length !== 14) {
       errs.citizenship = 'Citizenship number must be exactly 14 characters.';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // --- UPDATED Password Handler ---
  const handlePasswordUpdate = async () => {
    const errs: { [k: string]: string } = {};
    if (!passwords.current) errs.current = 'Current password required';
    if (!passwords.new) errs.new = 'New password required';
    // --- UPDATED: More specific password validation ---
    else if (passwords.new.length < 8) errs.new = 'Must be at least 8 characters.';
    else if (!/[A-Z]/.test(passwords.new)) errs.new = 'Must contain an uppercase letter.';
    else if (!/[a-z]/.test(passwords.new)) errs.new = 'Must contain a lowercase letter.';
    else if (!/[0-9]/.test(passwords.new)) errs.new = 'Must contain a number.';
    else if (!/[^A-Za-z0-9]/.test(passwords.new)) errs.new = 'Must contain a special character.';

    if (passwords.new !== passwords.confirm) errs.confirm = 'Passwords do not match';


    setPasswordErrors(errs); // Set frontend errors first

    // Only proceed if frontend validation passes
    if (Object.keys(errs).length === 0) {
      setIsPasswordUpdating(true);
      try {
        // Call the parent function to make the API call
        const result = await onChangePassword(passwords.current, passwords.new);

        if (result.success) {
          setPasswords({ current: '', new: '', confirm: '' });
          // Optionally: show a success toast here
        } else {
          // Display the error from the server (e.g., "Incorrect current password")
          if (result.field) {
            setPasswordErrors(prev => ({ ...prev, [result.field!]: result.message }));
          } else {
            // Put generic errors on the first field
            setPasswordErrors(prev => ({ ...prev, current: result.message }));
          }
        }
      } catch (error) {
        console.error("Password update failed:", error);
        setPasswordErrors(prev => ({ ...prev, current: "An unexpected error occurred." }));
      } finally {
        setIsPasswordUpdating(false);
      }
    }
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600 p-4 bg-red-100 rounded-lg">{error}</div>;
  if (!form) return null;

  // --- Store the SVG string in a variable to ensure it's identical ---
  const dropdownArrowSvg = `bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22%236b7280%22%3E%3Cpath%20d%3D%22M4.22%206.22a.75.75%200%200%201%201.06%200L8%208.94l2.72-2.72a.75.75%200%201%201%201.06%201.06l-3.25%203.25a.75.75%200%200%201-1.06%200L4.22%207.28a.75.75%200%200%201%200-1.06Z%22%2F%3E%3C%2Fsvg%3E')]`;

  return (
    <div className="space-y-8">
      {/* PROFILE SECTION */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
            <p className="text-sm text-gray-500">Update your personal details and profile photo.</p>
          </div>
          {!isEditing && <Button variant="primary" onClick={handleEdit}>Edit Profile</Button>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-3 flex flex-col items-center md:items-start">
            <img src={form.photoPreview || 'https://placehold.co/300x300/E2E8F0/4A5568?text=Photo'} alt="Profile" className="rounded-lg w-full h-auto object-cover mb-4" />
            {isEditing && (
              <>
                <input ref={photoFileInputRef} id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} aria-label="Upload profile photo" />
                <div className="flex gap-3 items-center mt-2">
                  <label htmlFor="photo-upload" className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer">Choose Photo</label>
                  <button type="button" onClick={handleRemovePhoto} className="text-sm font-semibold text-red-600 hover:underline">Remove</button>
                </div>
                <p className="text-xs text-gray-400 mt-2">JPG, PNG or GIF. Max 2MB.</p>
              </>
            )}
          </div>
          <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Input label="First Name" value={form.firstName} onChange={handleVarcharChange('firstName')} readOnly={!isEditing} error={fieldErrors.firstName} />
            <Input label="Last Name" value={form.lastName} onChange={handleVarcharChange('lastName')} readOnly={!isEditing} error={fieldErrors.lastName} />

            {/* --- DATE OF BIRTH AND AGE FIELDS (SIDE BY SIDE) --- */}
            <div className="grid grid-cols-2 gap-3">
              {/* Date of Birth */}
              {!isEditing ? (
                <Input
                  label="Date of Birth"
                  type="text"
                  value={form.dob}
                  onChange={() => {}} // No-op when read-only
                  readOnly={true}
                />
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

              {/* Age (Auto-calculated) */}
              <Input
                label="Age"
                type="text"
                value={form.dob ? `${calculateAge(form.dob)} years` : ''}
                onChange={() => {}} // No-op, always read-only
                readOnly={true}
              />
            </div>
            {/* --- END OF UPDATE --- */}

            {/* --- UPDATED Email Input --- */}
            <Input
              label="Email Address"
              value={form.email}
              onChange={(v) => handleChange('email', v)}
              readOnly={!isEditing}
              onBlur={handleEmailBlur} // <-- Added onBlur
              error={fieldErrors.email}
            />
            <Input label="Phone Number" value={form.phone} onChange={handlePhoneChange} readOnly={!isEditing} error={fieldErrors.phone} />
            <Input
              label="Position"
              value={form.position}
              onChange={(v) => handleChange('position', v)}
              readOnly={true}  // ⭐ Always read-only - comes from backend
              placeholder="Position from system"
            />
            <Input label="PAN Number" value={form.pan} onChange={handlePanChange} readOnly={!isEditing} error={fieldErrors.pan} maxLength={14} />

            {/* --- UPDATED Citizenship Input --- */}
            <Input
              label="Citizenship Number"
              value={form.citizenship}
              onChange={handleCitizenshipChange}
              readOnly={!isEditing}
              error={fieldErrors.citizenship}
              maxLength={14} // Max 14 digits
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
                  <button
                    type="button"
                    onClick={() => setIsLocationPickerOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <MapPin className="w-4 h-4" />
                    Pick Location
                  </button>
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
      </div>

      {/* --- PASSWORD SECTION (UPDATED) --- */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Change Password</h2>
        <p className="text-sm text-gray-500 mb-6">Update your password to keep your account secure.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* --- Current Password --- */}
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

          {/* --- New Password --- */}
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

          {/* --- Confirm New Password --- */}
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
      </div>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
};

export default SettingsContent;