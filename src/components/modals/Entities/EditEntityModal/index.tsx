import React, { useEffect, useMemo } from 'react';
import type { EditEntityModalProps, EditEntityData } from './types';
import { ModalShell } from '../AddEntityModal/AddEntityModalShell';
import { useAuth } from '../../../../api/authService';
import { defaultPosition } from '../AddEntityModal/types';
import { useEditInterestManagement } from './useEditInterestManagement';
import { CommonDetails } from '../sections/CommonDetails';
import { EntitySpecific } from '../sections/EntitySpecific';
import { ContactDetails } from '../sections/ContactDetails';
import { LocationSection } from '../sections/LocationSection';
import { InterestSection } from '../sections/InterestSection';
import { AdditionalInfoSection } from '../sections/AdditionalInfoSection';
import toast from 'react-hot-toast';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEntitySchema, type EntityFormData } from '../EntityFormSchema';

const EditEntityModal: React.FC<EditEntityModalProps> = (props) => {
  const { isOpen, onClose, initialData, entityType, onSave, panVatMode } = props;
  const { user } = useAuth();

  // Use organization location as default, fallback to hardcoded default
  const orgPosition = useMemo(() => {
    const org = user?.organizationId as { latitude?: number; longitude?: number } | string | undefined;
    if (typeof org === 'object' && org?.latitude && org?.longitude) {
      return { lat: org.latitude, lng: org.longitude };
    }
    return defaultPosition;
  }, [user]);

  // 2. Setup Form with RHF
  const methods = useForm<EntityFormData>({
    resolver: zodResolver(createEntitySchema(entityType, panVatMode)),
    defaultValues: {
      name: '',
      ownerName: '',
      subOrgName: '',
      partyType: '',
      address: '',
      latitude: orgPosition.lat,
      longitude: orgPosition.lng,
      email: '',
      phone: '',
      panVat: '',
      description: '',
      dateJoined: undefined // Will be set in useEffect
    },
    mode: 'onChange'
  });

  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  // Initialize updated logic hook
  const interestLogic = useEditInterestManagement(entityType, props.categoriesData || []);

  // 3. Sync state on Modal Open
  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        name: initialData.name || '',
        ownerName: initialData.ownerName || '',
        subOrgName: initialData.subOrgName || '',
        partyType: initialData.partyType || '',
        address: initialData.address || '',
        latitude: initialData.latitude || orgPosition.lat,
        longitude: initialData.longitude || orgPosition.lng,
        email: initialData.email || '',
        phone: initialData.phone || '',
        panVat: initialData.panVat || '',
        description: initialData.description || '',
        // Ensure dateJoined helps validation, even if read-only display uses prop
        dateJoined: initialData.dateJoined ? new Date(initialData.dateJoined) : new Date(),
      });

      const loadedInterests = entityType === 'Site'
        ? initialData.siteInterest || []
        : initialData.prospectInterest || initialData.interest || [];
      interestLogic.setInterests(loadedInterests);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData, entityType, reset]); // interestLogic, orgPosition excluded to avoid infinite loop

  // Guard clause — must be after all hooks
  if (!isOpen) return null;

  const onSubmit = async (data: EntityFormData) => {
    try {
      // Build Payload: Pull dateJoined from initialData to avoid TS error on EditFormData
      // (Actually data.dateJoined IS available now via RHF, but for edit we might want to keep original string or use the date obj)
      const payload: EditEntityData = {
        name: data.name,
        ownerName: data.ownerName,
        address: data.address || '',
        dateJoined: initialData.dateJoined, // Keeping original joined date string as per original logic
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        email: data.email || '',
        phone: data.phone,
        panVat: data.panVat || undefined, // EditEntityData allows optional here? Let's check type.ts. 
        // type.ts says panVat?: string. So undefined is fine.
        description: data.description || undefined, // type.ts says description?: string.

        partyType: entityType === 'Party' ? data.partyType : undefined,
        subOrgName: entityType === 'Site' ? data.subOrgName : undefined,
        prospectInterest: entityType === 'Prospect' ? interestLogic.interests : undefined,
        siteInterest: entityType === 'Site' ? interestLogic.interests : undefined,
      };

      await onSave(payload);
      toast.success("Updated successfully");
      onClose();
    } catch {
      toast.error("Update failed. Please try again.");
    }
  };

  const onInvalid = () => {
    toast.error("Validation Failed. Please check the fields.");
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={props.title}
      isSaving={isSubmitting}
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      submitLabel="Save Changes"
      subtitle={`Update the ${entityType} information`}
    >
      <FormProvider {...methods}>
        <CommonDetails
          labels={{ name: props.nameLabel, owner: props.ownerLabel }}
          dateJoined={initialData.dateJoined} // Passing specifically for ReadOnly logic
          isReadOnlyDate={true}
        />

        <EntitySpecific
          props={props}
        />

        <ContactDetails isSaving={isSubmitting} />

        <LocationSection />

        {['Prospect', 'Site'].includes(entityType) && (
          <InterestSection
            logic={interestLogic}
            entityType={entityType}
            categoriesData={props.categoriesData}
          />
        )}

        <AdditionalInfoSection isSaving={isSubmitting} />
      </FormProvider>
    </ModalShell>
  );
};

export default EditEntityModal;