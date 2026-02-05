import type { Organization } from '@/api/SuperAdmin/organizationService';

export interface OrganizationFormData {
    name: string;
    ownerName: string;
    email: string;
    phone: string;
    address?: string;
    // Subscription
    subscriptionType?: string; // 'basic' | 'standard' | 'premium'
    customPlanId?: string;
    subscriptionDuration?: string;
    country?: string;
    weeklyOff?: string;
    timezone?: string;
    checkInTime?: string;
    checkOutTime?: string;
    halfDayCheckOutTime?: string;
    geoFencing?: boolean;
    status?: 'Active' | 'Inactive';
    latitude?: number;
    longitude?: number;
    description?: string;
}

export interface OrganizationFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: OrganizationFormData) => Promise<void>;
    initialData?: Organization | null; // If present, we are in Edit mode
}
