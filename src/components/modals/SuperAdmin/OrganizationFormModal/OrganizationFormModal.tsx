import React, { useEffect, useRef } from 'react';
import { useForm, FormProvider, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { OrganizationFormModalShell } from './OrganizationFormModalShell';
import { OrganizationFormSchema, type OrganizationFormInputs } from './OrganizationFormSchema';
import type { OrganizationFormModalProps } from './types';

// Sections - Reorganized for better UX
import { OrganizationDetails } from './components/OrganizationDetails';
import { OwnerContactDetails } from './components/OwnerContactDetails';
import { SubscriptionPlanDetails } from './components/SubscriptionPlanDetails';
import { WorkingHoursDetails } from './components/WorkingHoursDetails';
import { LocationDetails } from './components/LocationDetails';

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

    // Track if modal was previously open to detect fresh opens
    const wasOpenRef = useRef(false);

    // Reset form only when modal freshly opens (not on every initialData change)
    useEffect(() => {
        if (isOpen && !wasOpenRef.current) {
            // Modal just opened - reset with initial data
            reset(normalizeOrganizationData(initialData ?? null));
        }
        wasOpenRef.current = isOpen;
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
                {/* Section 1: Organization Details (Name, PAN/VAT, Country, Timezone) */}
                <OrganizationDetails isEditMode={isEditMode} />

                {/* Section 2: Owner & Contact Details (Owner Name, Email, Phone) */}
                <OwnerContactDetails isEditMode={isEditMode} isSaving={isSubmitting} />

                {/* Section 3: Subscription Plan (Duration, Plans, Max Employees) */}
                <SubscriptionPlanDetails isEditMode={isEditMode} />

                {/* Section 4: Working Hours (Check-in/out times, Weekly Off, Geo-fencing) */}
                <WorkingHoursDetails />

                {/* Section 5: Location Details (Map, Address, Coordinates) */}
                <LocationDetails />
            </FormProvider>
        </OrganizationFormModalShell>
    );
};
