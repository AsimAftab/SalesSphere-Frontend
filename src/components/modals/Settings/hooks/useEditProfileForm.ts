import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useCallback, useState } from 'react';
import {
  editProfileSchema,
  type EditProfileFormData,
} from '../common/EditProfileSchema';
import type { UserProfile } from '../../../../api/settingService';

interface UseEditProfileFormProps {
  isOpen: boolean;
  userData: UserProfile;
  onSave: (data: Record<string, unknown>) => Promise<void> | void;
  onImageUpload?: (file: File) => Promise<void>;
  onSuccess: () => void;
}

const parseDob = (dob: string | undefined): Date | undefined => {
  if (!dob) return undefined;
  const d = new Date(dob);
  return isNaN(d.getTime()) ? undefined : d;
};

export const useEditProfileForm = ({
  isOpen,
  userData,
  onSave,
  onImageUpload,
  onSuccess,
}: UseEditProfileFormProps) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [hasMapInteracted, setHasMapInteracted] = useState(false);

  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      dob: undefined as unknown as Date,
      phone: '',
      gender: '',
      citizenship: '',
      address: '',
      latitude: 27.7172,
      longitude: 85.324,
    },
  });

  const { reset, handleSubmit, setValue } = form;

  const resetForm = useCallback(() => {
    if (!userData) return;
    const firstName = userData.firstName || (userData.name ? userData.name.split(' ')[0] : '');
    const lastName = userData.lastName || (userData.name ? userData.name.split(' ').slice(1).join(' ') : '');
    reset({
      firstName,
      lastName,
      dob: parseDob(userData.dateOfBirth || userData.dob) as unknown as Date,
      phone: userData.phone || '',
      gender: userData.gender || '',
      citizenship: userData.citizenshipNumber || userData.citizenship || '',
      address: userData.address || userData.location || '',
      latitude: 27.7172,
      longitude: 85.324,
    });
    setPhotoPreview(userData.avatar || userData.photoPreview || null);
    setPendingFile(null);
    setHasMapInteracted(false);
  }, [userData, reset]);

  // Sync form when modal opens
  useEffect(() => {
    if (isOpen) resetForm();
  }, [isOpen, resetForm]);


  // Photo handling — only preview locally, defer upload to save
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoPreview?.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
    setPendingFile(file);
  };

  // Map sync
  const handleMapSync = (location: { lat: number; lng: number }) => {
    setHasMapInteracted(true);
    setValue('latitude', location.lat, { shouldDirty: true });
    setValue('longitude', location.lng, { shouldDirty: true });
  };

  // Only update address from map if user has interacted with the map
  const handleAddressSync = (addr: string) => {
    if (hasMapInteracted) {
      setValue('address', addr, { shouldDirty: true });
    }
  };

  // Submit
  const onSubmit = async (data: EditProfileFormData) => {
    // Upload image on save if a new file was selected
    if (pendingFile && onImageUpload) {
      try {
        await onImageUpload(pendingFile);
      } catch {
        // Image upload failed but still save other fields
      }
    }

    const payload: Record<string, unknown> = {
      name: `${data.firstName} ${data.lastName}`.trim(),
      phone: data.phone,
      ...(data.dob && { dateOfBirth: data.dob.toLocaleDateString('en-CA') }),
      ...(data.gender && { gender: data.gender }),
      ...(data.citizenship && { citizenshipNumber: data.citizenship }),
      ...(data.address && { address: data.address }),
    };
    await onSave(payload);
    onSuccess();
  };

  return {
    form,
    photoPreview,
    submitHandler: handleSubmit(onSubmit),
    resetForm,
    handlePhotoChange,
    handleMapSync,
    handleAddressSync,
  };
};
