import type { OrganizationFormInputs } from './OrganizationFormSchema';
import { DEFAULT_ORGANIZATION_CONFIG } from '../../../../Pages/SuperAdmin/organizations/OrganizationListPage/constants';

const normalizeDuration = (duration?: string): string => {
    if (!duration) return '';
    const clean = duration.toLowerCase().replace(/\s/g, '');
    if (clean === '12months') return '12 Months';
    if (clean === '6months') return '6 Months';
    return duration; // Fallback to original if no match
};

/**
 * Normalizes organization data for the form.
 * Handles both edit mode (mapping existing data) and create mode (setting defaults).
 */
export const normalizeOrganizationData = (initialData: any | null): OrganizationFormInputs => {
    if (initialData) {
        return {
            name: initialData.name,
            ownerName: initialData.owner,
            email: initialData.ownerEmail,
            phone: initialData.phone,
            panVat: initialData.panVat || '',
            address: initialData.address,

            // Subscription & Working Hours
            // Logic adapted for current Service Mapper return values:
            // 1. initialData.subscriptionType holds the Duration (e.g. "12months") from backend
            // 2. initialData.customPlanId holds the populated Plan Object from backend

            subscriptionType: (initialData.customPlanId && typeof initialData.customPlanId === 'object' && initialData.customPlanId.tier !== 'custom')
                ? initialData.customPlanId.name
                : '',

            customPlanId: (initialData.customPlanId && typeof initialData.customPlanId === 'object' && initialData.customPlanId.tier === 'custom')
                ? (initialData.customPlanId._id || initialData.customPlanId.id)
                : '',

            subscriptionDuration: normalizeDuration(initialData.subscriptionType || initialData.subscriptionDuration),

            country: initialData.country || '',
            weeklyOff: initialData.weeklyOff || '',
            timezone: initialData.timezone || '',
            checkInTime: initialData.checkInTime || '',
            checkOutTime: initialData.checkOutTime || '',
            halfDayCheckOutTime: initialData.halfDayCheckOutTime || '',
            geoFencing: initialData.geoFencing || false,

            status: initialData.status,
            latitude: initialData.latitude || DEFAULT_ORGANIZATION_CONFIG.latitude,
            longitude: initialData.longitude || DEFAULT_ORGANIZATION_CONFIG.longitude
        };
    } else {
        return {
            name: '',
            ownerName: '',
            email: '',
            phone: '',
            panVat: '',
            address: DEFAULT_ORGANIZATION_CONFIG.address,

            // Defaults for new Organization
            subscriptionType: '',
            customPlanId: '',
            subscriptionDuration: '',
            country: DEFAULT_ORGANIZATION_CONFIG.country,
            weeklyOff: DEFAULT_ORGANIZATION_CONFIG.weeklyOff,
            timezone: DEFAULT_ORGANIZATION_CONFIG.timezone,
            checkInTime: DEFAULT_ORGANIZATION_CONFIG.checkInTime,
            checkOutTime: DEFAULT_ORGANIZATION_CONFIG.checkOutTime,
            halfDayCheckOutTime: DEFAULT_ORGANIZATION_CONFIG.halfDayCheckOutTime,
            geoFencing: DEFAULT_ORGANIZATION_CONFIG.geoFencing,

            latitude: DEFAULT_ORGANIZATION_CONFIG.latitude,
            longitude: DEFAULT_ORGANIZATION_CONFIG.longitude,
        };
    }
};
