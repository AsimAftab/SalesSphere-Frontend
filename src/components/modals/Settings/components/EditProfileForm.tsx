import React, { useRef } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { UploadCloud } from 'lucide-react';
import {
  MapPinIcon,
  GlobeAltIcon,
  UserIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { LocationMap } from '../../../maps/LocationMap';
import { getSafeImageUrl } from '@/utils/security';
import type { EditProfileFormData } from '../common/EditProfileSchema';
import type { UserProfile } from '@/api/settingService';
import { Input, Button, DatePicker, DropDown } from '@/components/ui';

interface EditProfileFormProps {
  form: UseFormReturn<EditProfileFormData>;
  userData: UserProfile;
  isSuperAdmin: boolean;
  photoPreview: string | null;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMapSync: (location: { lat: number; lng: number }) => void;
  onAddressSync: (addr: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const readOnlyFieldClass = 'w-full px-4 py-2.5 border rounded-xl bg-gray-50 text-gray-900 border-gray-300';

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  form,
  userData,
  isSuperAdmin,
  photoPreview,
  onPhotoChange,
  onMapSync,
  onAddressSync,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const photoInputRef = useRef<HTMLInputElement>(null);
  const latitude = watch('latitude');
  const longitude = watch('longitude');
  const address = watch('address');

  const safeAvatarUrl =
    getSafeImageUrl(photoPreview) ||
    `https://placehold.co/150x150/197ADC/ffffff?text=${(userData.name || 'U').charAt(0)}`;

  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      <div className="p-6 space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
          <div className="relative group">
            <img
              src={safeAvatarUrl}
              alt="Avatar"
              className="h-20 w-20 rounded-full object-cover ring-2 ring-offset-2 ring-blue-500 transition-all"
            />
            <div className="absolute inset-0 rounded-full ring-1 ring-black/5" />
          </div>
          <div>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPhotoChange}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => photoInputRef.current?.click()}
              className="flex items-center gap-2 py-2 h-9 text-xs"
            >
              <UploadCloud size={14} className="text-indigo-600" />
              {photoPreview ? 'Change Photo' : 'Upload Photo'}
            </Button>
            <p className="text-xs text-gray-400 mt-1">Recommended: 250 × 250 pixels</p>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {/* Section: Personal Details */}
          <div className="md:col-span-2 pb-2 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-secondary" /> Personal Details
            </h3>
          </div>

          <div>
            <Input
              label="First Name"
              {...register('firstName')}
              error={errors.firstName?.message}
              required
              className="!bg-white !border-gray-200"
            />
          </div>
          <div>
            <Input
              label="Last Name"
              {...register('lastName')}
              error={errors.lastName?.message}
              required
              className="!bg-white !border-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date of Birth <span className="text-red-500">*</span></label>
            <Controller
              name="dob"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select date of birth"
                  className="border-gray-200"
                  error={!!errors.dob}
                />
              )}
            />
            {errors.dob && <p className="mt-1 text-xs text-red-500">{errors.dob.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender <span className="text-red-500">*</span></label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <DropDown
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={genderOptions}
                  placeholder="Select gender"
                  triggerClassName="!border-gray-200"
                  error={errors.gender?.message}
                  usePortal
                />
              )}
            />
          </div>

          {/* Section: Contact & ID */}
          <div className="md:col-span-2 pb-2 border-b border-gray-200 mt-2">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <PhoneIcon className="w-5 h-5 text-secondary" /> Contact & Identification
            </h3>
          </div>

          {/* Editable fields */}
          <div>
            <Input
              label="Phone Number"
              {...register('phone')}
              error={errors.phone?.message}
              maxLength={10}
              required
              className="!bg-white !border-gray-200"
            />
          </div>

          <div>
            <Input
              label="Citizenship Number"
              {...register('citizenship')}
              error={errors.citizenship?.message}
              maxLength={14}
              required
              className="!bg-white !border-gray-200"
            />
          </div>

          {/* Read-only fields */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <p className={`${readOnlyFieldClass} min-h-[42px] flex items-center text-gray-500 cursor-not-allowed`}>
              {userData.email || 'N/A'}
            </p>
          </div>

          {!isSuperAdmin && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
                <p className={`${readOnlyFieldClass} min-h-[42px] flex items-center text-gray-500 cursor-not-allowed`}>
                  {typeof userData.customRoleId === 'object' && userData.customRoleId?.name
                    ? userData.customRoleId.name
                    : userData.position || userData.role || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">PAN/VAT Number</label>
                <p className={`${readOnlyFieldClass} min-h-[42px] flex items-center text-gray-500 cursor-not-allowed`}>
                  {userData.panNumber || userData.pan || 'N/A'}
                </p>
              </div>
            </>
          )}

          {/* Section: Location */}
          <div className="md:col-span-2 mt-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-blue-600" /> Location Details
            </h3>
            <div className="h-72 rounded-xl overflow-hidden shadow-sm">
              <LocationMap
                position={{ lat: latitude || 27.7172, lng: longitude || 85.324 }}
                initialAddress={userData.address || userData.location}
                onLocationChange={onMapSync}
                onAddressGeocoded={onAddressSync}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <p className={`${readOnlyFieldClass} min-h-[42px]`}>{address || 'Auto-filled from map'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold flex items-center gap-1 text-gray-700 mb-1">
                  <GlobeAltIcon className="w-4 h-4" /> Latitude
                </label>
                <p className={readOnlyFieldClass}>{latitude}</p>
              </div>
              <div>
                <label className="text-sm font-semibold flex items-center gap-1 text-gray-700 mb-1">
                  <GlobeAltIcon className="w-4 h-4" /> Longitude
                </label>
                <p className={readOnlyFieldClass}>{longitude}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
        <Button
          variant="outline"
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
        >
          Cancel
        </Button>
        <Button type="submit" variant="secondary" isLoading={isSubmitting}>
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default EditProfileForm;
