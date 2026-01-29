import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { OrganizationFormModalShell } from './OrganizationFormModalShell';
import { OrganizationFormSchema, type OrganizationFormInputs } from './OrganizationFormSchema';
import type { OrganizationFormModalProps } from './types';

// Sections
import { CommonDetails } from './sections/CommonDetails';
import { ContactDetails } from './sections/ContactDetails';
import { LocationDetails } from './sections/LocationDetails';
import { SubscriptionDetails } from './sections/SubscriptionDetails';

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
        defaultValues: {
            name: '',
            ownerName: '',
            email: '',
            phone: '',
            panVat: '',
            address: '',
            subscriptionType: '',
            subscriptionDuration: '6 Months',
            country: 'India',
            weeklyOff: 'Sunday',
            timezone: 'Asia/Kolkata',
            checkInTime: '09:00',
            checkOutTime: '18:00',
            halfDayCheckOutTime: '14:00',
            geoFencing: false,
            status: 'Active',
            latitude: 28.6139,
            longitude: 77.2090,
            description: ''
        }
    });

    const { handleSubmit, reset, formState: { isSubmitting } } = methods;

    // Reset form when modal opens or initialData changes
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({
                    name: initialData.name,
                    ownerName: initialData.owner,
                    email: initialData.ownerEmail,
                    phone: initialData.phone,
                    panVat: initialData.panVat || '',
                    address: initialData.address,

                    // Subscription & Working Hours
                    subscriptionType: initialData.subscriptionType || '',
                    customPlanId: initialData.customPlanId || '',
                    subscriptionDuration: initialData.subscriptionDuration || '',
                    country: initialData.country || '',
                    weeklyOff: initialData.weeklyOff || '',
                    timezone: initialData.timezone || '',
                    checkInTime: initialData.checkInTime || '',
                    checkOutTime: initialData.checkOutTime || '',
                    halfDayCheckOutTime: initialData.halfDayCheckOutTime || '',
                    geoFencing: initialData.geoFencing || false,

                    status: initialData.status,
                    latitude: initialData.latitude || 28.6139,
                    longitude: initialData.longitude || 77.2090,
                    description: initialData.deactivationReason || ''
                });
            } else {
                reset({
                    name: '',
                    ownerName: '',
                    email: '',
                    phone: '',
                    panVat: '',
                    address: '',

                    // Defaults for new Organization
                    subscriptionType: '',
                    customPlanId: '', // Default
                    subscriptionDuration: '', // Default
                    country: 'Nepal', // Default
                    weeklyOff: 'Saturday', // Default
                    timezone: 'Asia/Kathmandu', // Default
                    checkInTime: '10:00',
                    checkOutTime: '18:00',
                    halfDayCheckOutTime: '14:00',
                    geoFencing: false,

                    latitude: 28.6139,
                    longitude: 77.2090,
                });
            }
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

    return (
        <OrganizationFormModalShell
            isOpen={isOpen}
            onClose={handleClose}
            title={title}
            subtitle={subtitle}
            isSaving={isSubmitting}
            onSubmit={handleSubmit(onSubmit)}
            submitLabel={isEditMode ? 'Save Changes' : 'Create Organization'}
        >
            <FormProvider {...methods}>
                <CommonDetails />
                <ContactDetails isSaving={isSubmitting} />
                <SubscriptionDetails />
                <LocationDetails />
            </FormProvider>
        </OrganizationFormModalShell>
    );
};
