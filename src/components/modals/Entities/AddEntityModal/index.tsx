import React, { useEffect, useMemo } from 'react';
import type { AddEntityModalProps, NewEntityData } from './types';
import { defaultPosition } from './types';
import { ModalShell } from './AddEntityModalShell';
import { useAuth } from '../../../../api/authService';
import { useInterestManagement } from './useInterestManagement';
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

const AddEntityModal: React.FC<AddEntityModalProps> = (props) => {
  const { entityType, categoriesData, onSave, onClose, isOpen, title, panVatMode } = props;
  const { user } = useAuth();

  // Use organization location as default, fallback to hardcoded default
  const orgPosition = useMemo(() => {
    const org = user?.organizationId as { latitude?: number; longitude?: number } | string | undefined;
    if (typeof org === 'object' && org?.latitude && org?.longitude) {
      return { lat: org.latitude, lng: org.longitude };
    }
    return defaultPosition;
  }, [user]);

  // 1. Setup Form with Zod Resolver
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
      dateJoined: undefined // Will be required by schema
    },
    mode: 'onChange'
  });

  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  // --- Logic Hooks ---
  const interestLogic = useInterestManagement(entityType, categoriesData || []);

  // --- Reset on Modal Toggle ---
  useEffect(() => {
    if (isOpen) {
      // Reset form to defaults
      reset({
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
        dateJoined: undefined
      });
      // Reset custom logic
      interestLogic.setInterests([]);
    }
  }, [isOpen, reset]); // Removed interestLogic from dependency to avoid loop if object unstable

  const handleClose = () => {
    reset();
    interestLogic.resetInterestForm();
    onClose();
  };

  const onSubmit = async (data: EntityFormData) => {
    // Manual Check: Unsaved Interest Entries
    if (interestLogic.catSelectValue || interestLogic.currentBrands.length > 0) {
      return toast.error("You have unsaved interest details. Click 'Confirm Interest Entry' or clear fields.");
    }

    try {
      const formattedDate = data.dateJoined.toISOString().split('T')[0];

      const payload: NewEntityData = {
        name: data.name,
        ownerName: data.ownerName,
        dateJoined: formattedDate,
        address: data.address || '',
        description: data.description || '',
        latitude: data.latitude,
        longitude: data.longitude,
        email: data.email || undefined,
        phone: data.phone,
        panVat: data.panVat || undefined,
      };

      if (entityType === 'Site') {
        payload.subOrgName = data.subOrgName;
        payload.siteInterest = interestLogic.interests;
      } else if (entityType === 'Prospect') {
        payload.prospectInterest = interestLogic.interests;
      } else if (entityType === 'Party') {
        payload.partyType = data.partyType;
      }

      await onSave(payload);
      handleClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Operation failed";
      toast.error(message);
    }
  };

  const onInvalid = () => {
    toast.error("Validation Failed: Please check the highlighted fields.");
    // Scroll to top logic is handled by browser focus usually, or we can add manual scroll if needed.
    // RHF automatically focuses the first error field if ref is passed correctly.
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      isSaving={isSubmitting} // Use RHF isSubmitting
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      submitLabel={`Create ${entityType}`}
      subtitle={`Enter the details below to create a new ${entityType}`}
    >
      <FormProvider {...methods}>
        <CommonDetails
          labels={{ name: props.nameLabel, owner: props.ownerLabel }}
        // RHF handles state internally now
        />

        <EntitySpecific
          props={props}
        // RHF handles state internally
        />

        <ContactDetails
          isSaving={isSubmitting}
        />

        <LocationSection
        // RHF handles state
        />

        {['Prospect', 'Site'].includes(entityType) && (
          <InterestSection logic={interestLogic} entityType={entityType} />
        )}

        <AdditionalInfoSection
          isSaving={isSubmitting}
        />
      </FormProvider>
    </ModalShell>
  );
};

export default AddEntityModal;