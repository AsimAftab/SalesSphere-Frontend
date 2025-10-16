import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Header from '../../components/layout/Header/Header';
import Button from '../../components/UI/Button/Button';

// TYPE DEFINITIONS
interface InputFieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  error?: string;
  maxLength?: number;
  placeholder?: string;
}

interface ProfileState {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phone: string;
  position: string;
  pan: string;
  citizenship: string;
  gender: string;
  location: string;
  photoPreview: string | null;
}

// FIX 1: Updated the ProfileErrors type to allow 'position' as a key.
type ProfileErrors = Partial<Record<keyof Omit<ProfileState, 'photoPreview' | 'location'>, string>>;


// --- COMPONENT: InputField ---
const InputField: React.FC<InputFieldProps> = ({ label, id, type = 'text', value, onChange, readOnly = false, error, maxLength, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      maxLength={maxLength}
      placeholder={placeholder}
      className={`w-full bg-gray-200 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 read-only:cursor-not-allowed ${!readOnly ? 'focus:bg-white' : ''} ${error ? 'border-red-500 ring-red-500' : 'border-transparent'}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// --- COMPONENT: ProfileInfoSection ---
const ProfileInfoSection: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [originalState, setOriginalState] = useState<ProfileState | null>(null);

  const [firstName, setFirstName] = useState('Admin');
  const [lastName, setLastName] = useState('Manager');
  const [dob, setDob] = useState('1995-10-07');
  const [email, setEmail] = useState('admin@salessphere.com');
  const [phone, setPhone] = useState('9800000000');
  const [position, setPosition] = useState('Manager');
  const [pan, setPan] = useState('00000000000000');
  const [citizenship, setCitizenship] = useState('05-02-76-00582');
  const [gender, setGender] = useState('Male');
  const [location, setLocation] = useState('Shanti Chowk, Biratnagar, Nepal');
  const [photoPreview, setPhotoPreview] = useState<string | null>("https://i.pravatar.cc/150?u=a042581f4e29026024d");
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState<boolean>(false);

  // ... (All handler functions remain the same)
  useEffect(() => {
    if (isEditing && !originalState) {
      setOriginalState({
        firstName, lastName, dob, email, phone, position, pan, citizenship, gender, location, photoPreview
      });
    }
  }, [isEditing, originalState, firstName, lastName, dob, email, phone, position, pan, citizenship, gender, location, photoPreview]);

  const handleVarcharChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setter(value);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setPhone(value);
    }
  };
  
  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,14}$/.test(value)) {
      setPan(value);
    }
  };

  const handleCitizenshipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9-]/g, '');
    let formatted = value.split('-').join('');
    if (formatted.length > 2) formatted = formatted.slice(0, 2) + '-' + formatted.slice(2);
    if (formatted.length > 5) formatted = formatted.slice(0, 5) + '-' + formatted.slice(5);
    if (formatted.length > 8) formatted = formatted.slice(0, 8) + '-' + formatted.slice(8, 13);
    setCitizenship(formatted);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };
  
  const validate = (): boolean => {
    const newErrors: ProfileErrors = {};
    if (!firstName) newErrors.firstName = 'First name is required.';
    if (!lastName) newErrors.lastName = 'Last name is required.';
    if (!dob) newErrors.dob = 'Date of Birth is required.';
    if (!email) newErrors.email = 'Email is invalid.';
    if (!phone || !/^\d{10}$/.test(phone)) newErrors.phone = 'Must be a 10-digit number.';
    if (!pan || !/^\d{14}$/.test(pan)) newErrors.pan = 'PAN must be a 14-digit number.';
    if (!citizenship || !/^\d{2}-\d{2}-\d{2}-\d{5}$/.test(citizenship)) newErrors.citizenship = 'Invalid citizenship format.';
    if (!gender) newErrors.gender = 'Gender is required.';
    
    // FIX 2: Added validation for the 'position' field.
    if (!position) newErrors.position = 'Position is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = () => {
    if (validate()) {
      console.log('Profile data saved:', { firstName, lastName, dob, email, phone, position, pan, citizenship, gender, location });
      setIsEditing(false);
      setOriginalState(null);
    }
  };

  const handleCancel = () => {
    if (originalState) {
      setFirstName(originalState.firstName);
      setLastName(originalState.lastName);
      setDob(originalState.dob);
      setEmail(originalState.email);
      setPhone(originalState.phone);
      setPosition(originalState.position);
      setPan(originalState.pan);
      setCitizenship(originalState.citizenship);
      setGender(originalState.gender);
      setLocation(originalState.location);
      setPhotoPreview(originalState.photoPreview);
    }
    setIsEditing(false);
    setErrors({});
    setOriginalState(null);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
          <p className="text-sm text-gray-500">Update your personal details and profile photo.</p>
        </div>
        {!isEditing && (
          <Button variant="primary" onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-3 flex flex-col items-start text-left">
          <img
            src={photoPreview || "https://i.pravatar.cc/150?u=a042581f4e29026024d"}
            alt="Avatar"
            className="h-24 w-24 rounded-full object-cover mb-4 cursor-pointer"
            onClick={() => photoPreview && setIsImagePreviewOpen(true)}
          />
          {isEditing && (
            <div className="flex items-center gap-x-3 mb-1">
              <label htmlFor="photo-upload" className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer">
                Upload Photo
              </label>
              <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              {/* Note: Update your Button.tsx to accept 'danger' variant for this to work */}
              <Button variant="danger" onClick={handleRemovePhoto}>Remove</Button>
            </div>
          )}
          <p className="text-xs text-gray-400">JPG, PNG or GIF. Max 2MB.</p>
        </div>

        <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <InputField label="First Name" id="firstName" value={firstName} onChange={handleVarcharChange(setFirstName)} readOnly={!isEditing} error={errors.firstName} placeholder="e.g., Ankita" />
          <InputField label="Last Name" id="lastName" value={lastName} onChange={handleVarcharChange(setLastName)} readOnly={!isEditing} error={errors.lastName} placeholder="e.g., Roy" />
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
            <div className="relative">
              <input ref={dateInputRef} type="date" id="dob" value={dob} onChange={(e) => setDob(e.target.value)} readOnly={!isEditing} className={`w-full bg-gray-200 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 read-only:cursor-not-allowed ${!isEditing ? 'focus:bg-gray-200' : ''} ${errors.dob ? 'border-red-500 ring-red-500' : 'border-transparent'}`} />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"><svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg></div>
            </div>
            {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
          </div>
          <InputField label="Email Address" id="email" value={email} onChange={(e) => setEmail(e.target.value)} readOnly={!isEditing} error={errors.email} />
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
            <div className="flex items-center">
                <span className={`inline-flex items-center px-3 h-[42px] rounded-l-md border border-r-0 border-gray-300 bg-gray-200 text-gray-600 text-sm`}>
                  <img src="https://flagcdn.com/np.svg" alt="Nepal Flag" className="h-4 w-auto mr-2" />
                  +977
                </span>
                <input type="tel" id="phone" value={phone} onChange={handlePhoneChange} readOnly={!isEditing} maxLength={10} placeholder="98********" className={`w-full bg-gray-200 border border-l-0 border-gray-300 rounded-r-md px-4 h-[42px] text-gray-800 focus:ring-2 focus:ring-blue-500 read-only:cursor-not-allowed ${!isEditing ? 'focus:bg-gray-200' : ''} ${errors.phone ? 'border-red-500 ring-red-500' : 'border-transparent'}`} />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-600 mb-1">Position</label>
            <select id="position" value={position} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPosition(e.target.value)} disabled={!isEditing} className={`w-full h-[42px] bg-gray-200 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed ${isEditing ? 'focus:bg-gray-200' : ''} ${errors.position ? 'border-red-500 ring-red-500' : 'border-transparent'}`}><option>Admin</option><option>Manager</option><option>Sales Rep</option></select>
            {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
          </div>
          <InputField label="PAN Number" id="pan" value={pan} onChange={handlePanChange} readOnly={!isEditing} error={errors.pan} maxLength={14} placeholder="14-digit number" />
          <InputField label="Citizenship Number" id="citizenship" value={citizenship} onChange={handleCitizenshipChange} readOnly={!isEditing} error={errors.citizenship} placeholder="05-02-76-00582" />
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
            <select id="gender" value={gender} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGender(e.target.value)} disabled={!isEditing} className={`w-full h-[42px] bg-gray-200 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:bg-white disabled:cursor-not-allowed ${errors.gender ? 'border-red-500 ring-red-500' : 'border-transparent'}`}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>
          <div className="sm:col-span-2 md:col-span-3">
            <InputField label="Location" id="location" value={location} onChange={(e) => setLocation(e.target.value)} readOnly={!isEditing} placeholder="e.g., Shanti Chowk, Biratnagar, Nepal" />
          </div>
        </div>
      </div>

      {isEditing && (<div className="flex justify-end gap-x-4 mt-8 pt-6 border-t border-gray-200"><Button variant="secondary" onClick={handleCancel}>Cancel</Button><Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button></div>)}

      {isImagePreviewOpen && photoPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75" onClick={() => setIsImagePreviewOpen(false)}>
          <div className="relative p-2 bg-white rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <img src={photoPreview} alt="Profile Preview" className="max-w-[90vw] max-h-[90vh] object-contain rounded-md" />
            <button className="absolute top-0 right-0 -mt-3 -mr-3 text-white text-3xl font-bold bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-600 focus:outline-none" onClick={() => setIsImagePreviewOpen(false)}>&times;</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENT: ChangePasswordSection ---
const ChangePasswordSection: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordErrors, setPasswordErrors] = useState<{ [key: string]: string }>({});

    const validatePasswords = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!currentPassword) newErrors.currentPassword = 'Current password is required';
        if (!newPassword) newErrors.newPassword = 'New password is required';
        if (newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
        if (newPassword !== confirmNewPassword) newErrors.confirmNewPassword = 'Passwords do not match';
        setPasswordErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdatePassword = () => {
        if (validatePasswords()) { console.log('Password updated'); }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm mt-8">
            <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
            <p className="text-sm text-gray-500 mb-6">Update your password to keep your account secure.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField label="Current Password" id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} error={passwordErrors.currentPassword} placeholder="••••••••" />
                <InputField label="New Password" id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} error={passwordErrors.newPassword} placeholder="Minimum 8 characters" />
                <InputField label="Confirm New Password" id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} error={passwordErrors.confirmNewPassword} placeholder="••••••••" />
            </div>
            <div className="flex justify-start mt-8 pt-6 border-t border-gray-200">
                <Button variant="primary" onClick={handleUpdatePassword}>Update Password</Button>
            </div>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---
const SettingsPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 lg-p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold text- mb-8">Settings</h1>
          <ProfileInfoSection />
          <ChangePasswordSection />
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;