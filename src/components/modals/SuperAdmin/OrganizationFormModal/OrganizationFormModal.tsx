import React, { useEffect } from 'react';
import { useForm, FormProvider, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { OrganizationFormModalShell } from './OrganizationFormModalShell';
import { OrganizationFormSchema, type OrganizationFormInputs } from './OrganizationFormSchema';
import type { OrganizationFormModalProps } from './types';

// Sections
import { CommonDetails } from './sections/CommonDetails';
import { ContactDetails } from './sections/ContactDetails';
import { LocationDetails } from './sections/LocationDetails';
import { SubscriptionDetails } from './sections/SubscriptionDetails';

import { normalizeOrganizationData } from './utils';

export const OrganizationFormModal: React.FC<OrganizationFormModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData
}) => {
    const isEditMode = !!initialData;
    const title = isEditMode ? 'Edit Organization' : 'Add Organization';
    const subtitle = isEditMode
        ? 'Update organization details, subscription, or status.'
        : 'Create a new organization and assign a subscription plan.';

    const methods = useForm<OrganizationFormInputs>({
        resolver: zodResolver(OrganizationFormSchema),
        defaultValues: normalizeOrganizationData(null)
    });

    const { handleSubmit, reset, formState: { isSubmitting } } = methods;

    // Reset form when modal opens or initialData changes
    useEffect(() => {
        if (isOpen) {
            reset(normalizeOrganizationData(initialData ?? null));
        }
    }, [isOpen, initialData, reset]);

    const onSubmit = async (data: OrganizationFormInputs) => {
        try {
            await onSave(data);
            onClose();
            reset();
        } catch (error) {
            console.error('Form submission failed', error);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const onError = (errors: FieldErrors<OrganizationFormInputs>) => {
        console.error("Form Validation Errors:", errors);
    };

    return (
        <OrganizationFormModalShell
            isOpen={isOpen}
            onClose={handleClose}
            title={title}
            subtitle={subtitle}
            isSaving={isSubmitting}
            onSubmit={handleSubmit(onSubmit, onError)}
            submitLabel={isEditMode ? 'Save Changes' : 'Create Organization'}
        >
            <FormProvider {...methods}>
                <CommonDetails isEditMode={isEditMode} />
                <ContactDetails isSaving={isSubmitting} isEditMode={isEditMode} />
                <SubscriptionDetails isEditMode={isEditMode} />
                <LocationDetails />
            </FormProvider>
        </OrganizationFormModalShell>
    );
};
