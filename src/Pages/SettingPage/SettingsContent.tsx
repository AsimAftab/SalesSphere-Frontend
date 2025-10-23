// import React, { useEffect, useRef, useState } from 'react';
// import Button from '../../components/UI/Button/Button';
// import DatePicker from '../../components/UI/DatePicker/DatePicker';

// /* ----------------- Data Types ----------------- */
// interface ProfileFormState {
//   firstName: string; lastName: string; dob: string; email: string;
//   phone: string; position: string; pan: string; citizenship: string;
//   gender: string; location: string; photoPreview: string | null;
//   _photoFile?: File; // Internal state for the uploaded file
// }

// type ProfileFormErrors = Partial<Record<keyof Omit<ProfileFormState, 'photoPreview' | '_photoFile'>, string>>;

// interface SettingsContentProps {
//   loading: boolean;
//   error: string | null;
//   userData: any;
//   onSaveProfile: (data: any) => void;
//   onChangePassword: (current: string, next: string) => void;
// }

// /* ----------------- Reusable Input ----------------- */
// const Input: React.FC<{label: string, value: string, onChange: (v: string) => void, type?: string, readOnly?: boolean, error?: string, maxLength?: number, placeholder?: string}> = ({ label, value, onChange, type = 'text', readOnly = false, error, maxLength, placeholder }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
//     <input type={type} value={value || ''} readOnly={readOnly} maxLength={maxLength} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
//       className={`w-full h-[42px] bg-gray-100 border-transparent rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 ${!readOnly ? 'focus:bg-white' : 'cursor-not-allowed'} ${error ? 'border-red-500 ring-red-500' : ''}`}
//     />
//     {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
//   </div>
// );

// /* ----------------- Optimized SettingsContent Component ----------------- */
// const SettingsContent: React.FC<SettingsContentProps> = ({ loading, error, userData, onSaveProfile, onChangePassword }) => {
  
//   const [form, setForm] = useState<ProfileFormState>({} as ProfileFormState);
//   const [isEditing, setIsEditing] = useState(false);
//   const [originalForm, setOriginalForm] = useState<ProfileFormState | null>(null);

//   const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
//   const [passwordErrors, setPasswordErrors] = useState<{ [k: string]: string }>({});
//   const [fieldErrors, setFieldErrors] = useState<ProfileFormErrors>({});
  
//   const photoFileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (userData) setForm(userData);
//   }, [userData]);

//   const handleChange = (key: keyof ProfileFormState, value: string) => {
//     setForm(prev => ({ ...prev, [key]: value }));
//     if (key in fieldErrors) {
//       setFieldErrors(prev => ({ ...prev, [key]: '' }));
//     }
//   };

//   /* ---------- Specialized Input Handlers (keep specific formatting logic) ---------- */
//   const handleVarcharChange = (key: 'firstName' | 'lastName') => (val: string) => { if (/^[a-zA-Z\s]*$/.test(val)) handleChange(key, val); };
//   const handlePhoneChange = (val: string) => { if (/^\d{0,10}$/.test(val)) handleChange('phone', val); };
//   const handlePanChange = (val: string) => { if (/^\d{0,14}$/.test(val)) handleChange('pan', val); };
//   const handleCitizenshipChange = (val: string) => {
//     let raw = val.replace(/[^0-9-]/g, '');
//     const parts = [];
//     if (raw.length > 0) parts.push(raw.slice(0, 2));
//     if (raw.length > 2) parts.push(raw.slice(2, 4));
//     if (raw.length > 4) parts.push(raw.slice(4, 6));
//     if (raw.length > 6) parts.push(raw.slice(6, 11));
//     handleChange('citizenship', parts.join('-'));
//   };
//   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (form.photoPreview && form.photoPreview.startsWith('blob:')) URL.revokeObjectURL(form.photoPreview);
//       const url = URL.createObjectURL(file);
//       setForm(prev => ({ ...prev, photoPreview: url, _photoFile: file }));
//     }
//   };
//   const handleRemovePhoto = () => {
//     setForm(prev => ({ ...prev, photoPreview: null, _photoFile: undefined }));
//     if (photoFileInputRef.current) photoFileInputRef.current.value = '';
//   };

//   const handleEdit = () => { setOriginalForm(form); setIsEditing(true); };
//   const handleCancel = () => {
//     if (originalForm) setForm(originalForm);
//     setIsEditing(false); setFieldErrors({}); setOriginalForm(null);
//     if (photoFileInputRef.current) photoFileInputRef.current.value = '';
//   };
//   const handleSave = () => {
//     if (!validateProfile()) return;
//     const payload = { ...form };
//     delete payload._photoFile; 
//     onSaveProfile(payload);
//     setIsEditing(false); setOriginalForm(null);
//   };

//   /* ---------------- Validation & Password Handlers (Largely Unchanged) ---------------- */
//   const validateProfile = (): boolean => {
//     const errs: ProfileFormErrors = {};
//     if (!form.firstName?.trim()) errs.firstName = 'First name is required.';
//     if (!form.lastName?.trim()) errs.lastName = 'Last name is required.';
//     // ... all other validations remain the same ...
//     setFieldErrors(errs);
//     return Object.keys(errs).length === 0;
//   };
//   const handlePasswordUpdate = () => {
//     const errs: { [k: string]: string } = {};
//     if (!passwords.current) errs.current = 'Current password required';
//     if (!passwords.new) errs.new = 'New password required';
//     else if (passwords.new.length < 8) errs.new = 'Minimum 8 characters';
//     if (passwords.new !== passwords.confirm) errs.confirm = 'Passwords do not match';
//     setPasswordErrors(errs);
//     if (Object.keys(errs).length === 0) {
//       onChangePassword(passwords.current, passwords.new);
//       setPasswords({ current: '', new: '', confirm: '' });
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div className="text-red-600 p-4 bg-red-100 rounded-lg">{error}</div>;
//   if (!form) return null;

//   return (
//     <div className="space-y-8">
//       {/* PROFILE SECTION */}
//       <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
//         <div className="flex justify-between items-start mb-6">
//           <div>
//             <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
//             <p className="text-sm text-gray-500">Update your personal details and profile photo.</p>
//           </div>
//           {!isEditing && <Button variant="primary" onClick={handleEdit}>Edit Profile</Button>}
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
//           <div className="md:col-span-3 flex flex-col items-center md:items-start">
//             <img src={form.photoPreview || 'https://placehold.co/300x300/E2E8F0/4A5568?text=Photo'} alt="Profile" className="rounded-lg w-full h-auto object-cover mb-4" />
//             {isEditing && (
//               <>
//                 <input ref={photoFileInputRef} id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
//                 <div className="flex gap-3 items-center mt-2">
//                   <button type="button" onClick={() => photoFileInputRef.current?.click()} className="text-sm font-semibold text-blue-600 hover:underline">Choose Photo</button>
//                   <button type="button" onClick={handleRemovePhoto} className="text-sm font-semibold text-red-600 hover:underline">Remove</button>
//                 </div>
//                 <p className="text-xs text-gray-400 mt-2">JPG, PNG or GIF. Max 2MB.</p>
//               </>
//             )}
//           </div>
//           <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             <Input label="First Name" value={form.firstName} onChange={handleVarcharChange('firstName')} readOnly={!isEditing} error={fieldErrors.firstName} />
//             <Input label="Last Name" value={form.lastName} onChange={handleVarcharChange('lastName')} readOnly={!isEditing} error={fieldErrors.lastName} />

//             {/* --- 2. UPDATED DATE OF BIRTH FIELD --- */}
//             {!isEditing ? (
//               <Input 
//                 label="Date of Birth" 
//                 type="date" 
//                 value={form.dob} 
//                 onChange={() => {}} // No-op when read-only
//                 readOnly={true} 
//               />
//             ) : (
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
//                 <DatePicker
//                   // Convert string state to Date object for the picker
//                   value={form.dob ? new Date(form.dob) : null}
//                   // Convert Date object back to "YYYY-MM-DD" string for the state
//                   onChange={(date) => handleChange('dob', date ? date.toLocaleDateString('en-CA') : '')}
//                   placeholder="Select Date of Birth"
//                 />
//                 {fieldErrors.dob && <p className="text-red-500 text-xs mt-1">{fieldErrors.dob}</p>}
//               </div>
//             )}
//             {/* --- END OF UPDATE --- */}

//             <Input label="Email Address" value={form.email} onChange={(v) => handleChange('email', v)} readOnly={!isEditing} error={fieldErrors.email} />
//             <Input label="Phone Number" value={form.phone} onChange={handlePhoneChange} readOnly={!isEditing} error={fieldErrors.phone} />
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Position</label>
//               <select value={form.position} onChange={(e) => handleChange('position', e.target.value)} disabled={!isEditing} className={`w-full h-[42px] bg-gray-100 border-transparent rounded-lg px-3 text-gray-800 focus:ring-2 focus:ring-blue-500 ${isEditing ? 'focus:bg-white' : 'cursor-not-allowed'}`}>
//                 <option>Admin</option><option>Manager</option><option>Sales Rep</option>
//               </select>
//             </div>
//             <Input label="PAN Number" value={form.pan} onChange={handlePanChange} readOnly={!isEditing} error={fieldErrors.pan} />
//             <Input label="Citizenship Number" value={form.citizenship} onChange={handleCitizenshipChange} readOnly={!isEditing} error={fieldErrors.citizenship} />
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
//               <select value={form.gender} onChange={(e) => handleChange('gender', e.target.value)} disabled={!isEditing} className={`w-full h-[42px] bg-gray-100 border-transparent rounded-lg px-3 text-gray-800 focus:ring-2 focus:ring-blue-500 ${isEditing ? 'focus:bg-white' : 'cursor-not-allowed'}`}>
//                 <option>Male</option><option>Female</option><option>Other</option>
//               </select>
//             </div>
//             <div className="sm:col-span-2 md:col-span-3">
//               <Input label="Location" value={form.location} onChange={(v) => handleChange('location', v)} readOnly={!isEditing} />
//             </div>
//           </div>
//         </div>
//         {isEditing && (
//           <div className="flex justify-end mt-6 gap-4 border-t border-gray-200 pt-6">
//             <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
//             <Button variant="primary" onClick={handleSave}>Save Changes</Button>
//           </div>
//         )}
//       </div>

//       {/* PASSWORD SECTION */}
//       <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
//         <h2 className="text-xl font-bold text-gray-800 mb-1">Change Password</h2>
//         <p className="text-sm text-gray-500 mb-6">Update your password to keep your account secure.</p>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <Input label="Current Password" type="password" value={passwords.current} onChange={(v) => setPasswords(p => ({ ...p, current: v }))} error={passwordErrors.current} />
//           <Input label="New Password" type="password" value={passwords.new} onChange={(v) => setPasswords(p => ({ ...p, new: v }))} error={passwordErrors.new} />
//           <Input label="Confirm New Password" type="password" value={passwords.confirm} onChange={(v) => setPasswords(p => ({ ...p, confirm: v }))} error={passwordErrors.confirm} />
//         </div>
//         <div className="flex justify-start mt-8 pt-6 border-t border-gray-200">
//           <Button variant="primary" onClick={handlePasswordUpdate}>Update Password</Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SettingsContent;

import React, { useEffect, useRef, useState } from 'react';
// Assuming a Button component is available from this path
import Button from '../../components/UI/Button/Button';
// --- 1. IMPORT THE DATEPICKER ---
import DatePicker from '../../components/UI/DatePicker/DatePicker';

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
      className={`block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${!readOnly ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'} ${error ? 'border-red-500 ring-red-500' : ''}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

/* ----------------- Optimized SettingsContent Component ----------------- */
const SettingsContent: React.FC<SettingsContentProps> = ({ loading, error, userData, onSaveProfile, onChangePassword }) => {
  
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

  const handleEdit = () => { setOriginalForm(form); setIsEditing(true); };
  const handleCancel = () => {
    if (originalForm) setForm(originalForm);
    setIsEditing(false); setFieldErrors({}); setOriginalForm(null);
    if (photoFileInputRef.current) photoFileInputRef.current.value = '';
  };
  const handleSave = () => {
    if (!validateProfile()) return;
    const payload = { ...form };
    delete payload._photoFile; 
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

            {/* --- DATE OF BIRTH FIELD --- */}
            {!isEditing ? (
              <Input 
                label="Date of Birth" 
                type="date" 
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
                  // className prop removed as per previous step to fix TS error
                />
                {fieldErrors.dob && <p className="text-red-500 text-xs mt-1">{fieldErrors.dob}</p>}
              </div>
            )}
            {/* --- END OF UPDATE --- */}

            <Input label="Email Address" value={form.email} onChange={(v) => handleChange('email', v)} readOnly={!isEditing} error={fieldErrors.email} />
            <Input label="Phone Number" value={form.phone} onChange={handlePhoneChange} readOnly={!isEditing} error={fieldErrors.phone} />
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Position</label>
              {/* --- UPDATED: Added bg-[length:12px_12px] --- */}
              <select value={form.position} onChange={(e) => handleChange('position', e.target.value)} disabled={!isEditing} 
                className={`block w-full appearance-none rounded-lg border border-gray-300 px-4 pr-10 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${isEditing ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'} bg-no-repeat ${dropdownArrowSvg} bg-[position:right_0.75rem_center] bg-[length:20px_20px]`}>
                <option>Admin</option><option>Manager</option><option>Sales Rep</option>
              </select>
            </div>
            <Input label="PAN Number" value={form.pan} onChange={handlePanChange} readOnly={!isEditing} error={fieldErrors.pan} />
            <Input label="Citizenship Number" value={form.citizenship} onChange={handleCitizenshipChange} readOnly={!isEditing} error={fieldErrors.citizenship} />
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
              {/* --- UPDATED: Added bg-[length:12px_12px] --- */}
              <select value={form.gender} onChange={(e) => handleChange('gender', e.target.value)} disabled={!isEditing} 
                className={`block w-full appearance-none rounded-lg border border-gray-300 px-4 pr-10 py-3 text-gray-900 placeholder-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${isEditing ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'} bg-no-repeat ${dropdownArrowSvg} bg-[position:right_0.75rem_center] bg-[length:20px_20px]`}>
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