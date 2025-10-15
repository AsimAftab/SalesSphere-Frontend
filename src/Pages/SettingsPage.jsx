import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar/Sidebar';
import Header from '../components/layout/Header/Header';
import Button from '../components/UI/Button/Button';

const InputField = ({ label, id, type = 'text', value, onChange, readOnly = false, error, maxLength, placeholder }) => (
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
      className={`w-full bg-gray-100 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:bg-white read-only:bg-gray-200/50 read-only:text-gray-500 ${error ? 'border-red-500 ring-red-500' : 'border-transparent'}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const ProfileInfoSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const dateInputRef = useRef(null);

  const [originalState, setOriginalState] = useState(null);

  const [firstName, setFirstName] = useState('Admin');
  const [lastName, setLastName] = useState('Manager');
  const [dob, setDob] = useState('1995-10-07');
  const [email, setEmail] = useState('admin@salessphere.com');
  const [phone, setPhone] = useState('9800000000');
  const [position, setPosition] = useState('Manager');
  const [pan, setPan] = useState('00000000000000');
  const [citizenship, setCitizenship] = useState('05-02-76-00582');
  const [location, setLocation] = useState('Shanti Chowk, Biratnagar, Nepal');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && !originalState) {
      setOriginalState({
        firstName, lastName, dob, email, phone, position, pan, citizenship, location, photoPreview
      });
    }
  }, [isEditing, originalState]);

  const handleVarcharChange = (setter) => (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setter(value);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setPhone(value);
    }
  };
  
  const handlePanChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,14}$/.test(value)) {
      setPan(value);
    }
  };

  const handleCitizenshipChange = (e) => {
    let value = e.target.value.replace(/[^0-9-]/g, '');
    let formatted = value.split('-').join('');
    if (formatted.length > 2) formatted = formatted.slice(0, 2) + '-' + formatted.slice(2);
    if (formatted.length > 5) formatted = formatted.slice(0, 5) + '-' + formatted.slice(5);
    if (formatted.length > 8) formatted = formatted.slice(0, 8) + '-' + formatted.slice(8, 13);
    setCitizenship(formatted);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
        setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
  };
  
  const validate = () => {
    const newErrors = {};
    if (!firstName) newErrors.firstName = 'First name is required.';
    if (!lastName) newErrors.lastName = 'Last name is required.';
    if (!dob) newErrors.dob = 'Date of Birth is required.';
    if (!email) newErrors.email = 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid.';
    if (!phone || !/^\d{10}$/.test(phone)) newErrors.phone = 'Must be a 10-digit number.';
    if (!pan || !/^\d{14}$/.test(pan)) newErrors.pan = 'PAN must be a 14-digit number.';
    if (!citizenship || !/^\d{2}-\d{2}-\d{2}-\d{5}$/.test(citizenship)) newErrors.citizenship = 'Invalid citizenship format.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = () => {
    if (validate()) {
      console.log('Profile data saved:', { firstName, lastName, dob, email, phone, position, pan, citizenship, location });
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
        <div className="md:col-span-3 flex flex-col items-center text-center">
            <img src={photoPreview || "https://i.pravatar.cc/150?u=a042581f4e29026024d"} alt="Avatar" className="h-24 w-24 rounded-full object-cover mb-4" />
            {isEditing && (<div className="flex items-center gap-x-3">
                <label htmlFor="photo-upload" className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer">
                    Upload Photo
                </label>
                <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                <Button variant="danger" onClick={handleRemovePhoto}>Remove</Button>
            </div>)}
            <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF. Max 2MB.</p>
        </div>
        <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <InputField label="First Name" id="firstName" value={firstName} onChange={handleVarcharChange(setFirstName)} readOnly={!isEditing} error={errors.firstName} placeholder="e.g., Ankita" />
          <InputField label="Last Name" id="lastName" value={lastName} onChange={handleVarcharChange(setLastName)} readOnly={!isEditing} error={errors.lastName} placeholder="e.g., Roy" />
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
            <div className="relative">
              <input ref={dateInputRef} type="date" id="dob" value={dob} onChange={(e) => setDob(e.target.value)} readOnly={!isEditing} className={`w-full bg-gray-100 border-gray-300 rounded-lg pl-4 pr-10 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:bg-white read-only:bg-gray-200/50 read-only:text-gray-500 ${errors.dob ? 'border-red-500 ring-red-500' : 'border-transparent'}`} />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"><svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg></div>
            </div>
            {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
          </div>
          <InputField label="Email Address" id="email" value={email} onChange={(e) => setEmail(e.target.value)} readOnly={!isEditing} error={errors.email} />
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
            <div className="flex items-center">
                <span className="inline-flex items-center px-3 h-[42px] rounded-l-md border border-r-0 border-gray-300 bg-gray-200 text-gray-600 text-sm">+977</span>
                <input type="tel" id="phone" value={phone} onChange={handlePhoneChange} readOnly={!isEditing} maxLength={10} placeholder="98********" className={`w-full bg-gray-100 border-gray-300 rounded-r-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:bg-white read-only:bg-gray-200/50 read-only:text-gray-500 ${errors.phone ? 'border-red-500 ring-red-500' : 'border-transparent'}`} />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-600 mb-1">Position</label>
            <select id="position" value={position} onChange={(e) => setPosition(e.target.value)} disabled={!isEditing} className="w-full h-[42px] bg-gray-100 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:bg-white disabled:bg-gray-200/50 disabled:text-gray-500"><option>Admin</option><option>Manager</option><option>Sales Rep</option></select>
          </div>
          <InputField label="PAN Number" id="pan" value={pan} onChange={handlePanChange} readOnly={!isEditing} error={errors.pan} maxLength={14} placeholder="14-digit number" />
          <InputField label="Citizenship Number" id="citizenship" value={citizenship} onChange={handleCitizenshipChange} readOnly={!isEditing} error={errors.citizenship} placeholder="05-02-76-00582" />
          <div className="sm:col-span-2 md:col-span-3">
            <InputField label="Location" id="location" value={location} onChange={(e) => setLocation(e.target.value)} readOnly={!isEditing} placeholder="e.g., Shanti Chowk, Biratnagar, Nepal" />
          </div>
        </div>
      </div>
      {isEditing && (<div className="flex justify-end gap-x-4 mt-8 pt-6 border-t border-gray-200"><Button variant="secondary" onClick={handleCancel}>Cancel</Button><Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button></div>)}
    </div>
  );
};

const ChangePasswordSection = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordErrors, setPasswordErrors] = useState({});

    const validatePasswords = () => {
        const newErrors = {};
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

const SettingsPage = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>
          <ProfileInfoSection />
          <ChangePasswordSection />
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;