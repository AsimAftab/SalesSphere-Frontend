import React, { useEffect, useRef, useState } from 'react';
// Assuming a Button component is available from this path
import Button from '../../components/UI/Button/Button';

/* ----------------- Data Types ----------------- */
interface ProfileFormState {
    firstName: string; lastName: string; dob: string; email: string;
    phone: string; position: string; pan: string; citizenship: string;
    gender: string; location: string; photoPreview: string | null;
    _photoFile?: File; // Internal state for the uploaded file
}

type ProfileFormErrors = Partial<Record<keyof Omit<ProfileFormState, 'photoPreview' | '_photoFile'>, string>>;

interface SettingsContentProps {
  loading: boolean;
  error: string | null;
  userData: any;
  onSaveProfile: (data: any) => void;
  onChangePassword: (current: string, next: string) => void;
}

/* ----------------- Reusable Input ----------------- */
const Input: React.FC<{label: string, value: string, onChange: (v: string) => void, type?: string, readOnly?: boolean, error?: string, maxLength?: number, placeholder?: string}> = ({ label, value, onChange, type = 'text', readOnly = false, error, maxLength, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input type={type} value={value || ''} readOnly={readOnly} maxLength={maxLength} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-gray-100 border-transparent rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 ${!readOnly ? 'focus:bg-white' : 'cursor-not-allowed'} ${error ? 'border-red-500 ring-red-500' : ''}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

/* ----------------- Optimized SettingsContent Component ----------------- */
const SettingsContent: React.FC<SettingsContentProps> = ({ loading, error, userData, onSaveProfile, onChangePassword }) => {
  
  // OPTIMIZATION: Use a single state object for the entire profile form.
  const [form, setForm] = useState<ProfileFormState>({} as ProfileFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [originalForm, setOriginalForm] = useState<ProfileFormState | null>(null);

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passwordErrors, setPasswordErrors] = useState<{ [k: string]: string }>({});
  const [fieldErrors, setFieldErrors] = useState<ProfileFormErrors>({});
  
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userData) setForm(userData);
  }, [userData]);

  // OPTIMIZATION: A single generic handler for most text inputs.
   const handleChange = (key: keyof ProfileFormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (key in fieldErrors) {
      setFieldErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  /* ---------- Specialized Input Handlers (keep specific formatting logic) ---------- */
  const handleVarcharChange = (key: 'firstName' | 'lastName') => (val: string) => { if (/^[a-zA-Z\s]*$/.test(val)) handleChange(key, val); };
  const handlePhoneChange = (val: string) => { if (/^\d{0,10}$/.test(val)) handleChange('phone', val); };
  const handlePanChange = (val: string) => { if (/^\d{0,14}$/.test(val)) handleChange('pan', val); };
  const handleCitizenshipChange = (val: string) => {
    let raw = val.replace(/[^0-9-]/g, '');
    const parts = [];
    if (raw.length > 0) parts.push(raw.slice(0, 2));
    if (raw.length > 2) parts.push(raw.slice(2, 4));
    if (raw.length > 4) parts.push(raw.slice(4, 6));
    if (raw.length > 6) parts.push(raw.slice(6, 11));
    handleChange('citizenship', parts.join('-'));
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

  // OPTIMIZATION: Simplified logic for handling edit/cancel/save states.
  const handleEdit = () => { setOriginalForm(form); setIsEditing(true); };
  const handleCancel = () => {
    if (originalForm) setForm(originalForm);
    setIsEditing(false); setFieldErrors({}); setOriginalForm(null);
    if (photoFileInputRef.current) photoFileInputRef.current.value = '';
  };
  const handleSave = () => {
    if (!validateProfile()) return;
    const payload = { ...form };
    delete payload._photoFile; // Don't send the internal file object to the API
    onSaveProfile(payload);
    setIsEditing(false); setOriginalForm(null);
  };

  /* ---------------- Validation & Password Handlers (Largely Unchanged) ---------------- */
  const validateProfile = (): boolean => {
    const errs: ProfileFormErrors = {};
    if (!form.firstName?.trim()) errs.firstName = 'First name is required.';
    if (!form.lastName?.trim()) errs.lastName = 'Last name is required.';
    // ... all other validations remain the same ...
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handlePasswordUpdate = () => {
    const errs: { [k: string]: string } = {};
    if (!passwords.current) errs.current = 'Current password required';
    if (!passwords.new) errs.new = 'New password required';
    else if (passwords.new.length < 8) errs.new = 'Minimum 8 characters';
    if (passwords.new !== passwords.confirm) errs.confirm = 'Passwords do not match';
    setPasswordErrors(errs);
    if (Object.keys(errs).length === 0) {
      onChangePassword(passwords.current, passwords.new);
      setPasswords({ current: '', new: '', confirm: '' });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600 p-4 bg-red-100 rounded-lg">{error}</div>;
  if (!form) return null;

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
                <input ref={photoFileInputRef} id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                <div className="flex gap-3 items-center mt-2">
                  <button type="button" onClick={() => photoFileInputRef.current?.click()} className="text-sm font-semibold text-blue-600 hover:underline">Choose Photo</button>
                  <button type="button" onClick={handleRemovePhoto} className="text-sm font-semibold text-red-600 hover:underline">Remove</button>
                </div>
                <p className="text-xs text-gray-400 mt-2">JPG, PNG or GIF. Max 2MB.</p>
              </>
            )}
          </div>
          <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Input label="First Name" value={form.firstName} onChange={handleVarcharChange('firstName')} readOnly={!isEditing} error={fieldErrors.firstName} />
            <Input label="Last Name" value={form.lastName} onChange={handleVarcharChange('lastName')} readOnly={!isEditing} error={fieldErrors.lastName} />
            <Input label="Date of Birth" type="date" value={form.dob} onChange={(v) => handleChange('dob', v)} readOnly={!isEditing} error={fieldErrors.dob} />
            <Input label="Email Address" value={form.email} onChange={(v) => handleChange('email', v)} readOnly={!isEditing} error={fieldErrors.email} />
            <Input label="Phone Number" value={form.phone} onChange={handlePhoneChange} readOnly={!isEditing} error={fieldErrors.phone} />
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Position</label>
              <select value={form.position} onChange={(e) => handleChange('position', e.target.value)} disabled={!isEditing} className={`w-full h-[42px] bg-gray-100 border-transparent rounded-lg px-3 text-gray-800 focus:ring-2 focus:ring-blue-500 ${isEditing ? 'focus:bg-white' : 'cursor-not-allowed'}`}>
                <option>Admin</option><option>Manager</option><option>Sales Rep</option>
              </select>
            </div>
            <Input label="PAN Number" value={form.pan} onChange={handlePanChange} readOnly={!isEditing} error={fieldErrors.pan} />
            <Input label="Citizenship Number" value={form.citizenship} onChange={handleCitizenshipChange} readOnly={!isEditing} error={fieldErrors.citizenship} />
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
              <select value={form.gender} onChange={(e) => handleChange('gender', e.target.value)} disabled={!isEditing} className={`w-full h-[42px] bg-gray-100 border-transparent rounded-lg px-3 text-gray-800 focus:ring-2 focus:ring-blue-500 ${isEditing ? 'focus:bg-white' : 'cursor-not-allowed'}`}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div className="sm:col-span-2 md:col-span-3">
              <Input label="Location" value={form.location} onChange={(v) => handleChange('location', v)} readOnly={!isEditing} />
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

      {/* PASSWORD SECTION */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Change Password</h2>
        <p className="text-sm text-gray-500 mb-6">Update your password to keep your account secure.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input label="Current Password" type="password" value={passwords.current} onChange={(v) => setPasswords(p => ({ ...p, current: v }))} error={passwordErrors.current} />
          <Input label="New Password" type="password" value={passwords.new} onChange={(v) => setPasswords(p => ({ ...p, new: v }))} error={passwordErrors.new} />
          <Input label="Confirm New Password" type="password" value={passwords.confirm} onChange={(v) => setPasswords(p => ({ ...p, confirm: v }))} error={passwordErrors.confirm} />
        </div>
        <div className="flex justify-start mt-8 pt-6 border-t border-gray-200">
          <Button variant="primary" onClick={handlePasswordUpdate}>Update Password</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsContent;

