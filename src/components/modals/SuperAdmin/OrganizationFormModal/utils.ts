import type { OrganizationFormInputs } from './OrganizationFormSchema';
import type { Organization } from '@/api/SuperAdmin';
import { DEFAULT_ORGANIZATION_CONFIG } from '@/pages/SuperAdminPages/Organizations/OrganizationListPage/constants';

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
export const normalizeOrganizationData = (initialData: Organization | null): OrganizationFormInputs => {
    if (initialData) {
        return {
            name: initialData.name,
            ownerName: initialData.owner,
            email: initialData.ownerEmail,
            phone: initialData.phone,
            panVat: initialData.panVat || '',
            address: initialData.address,

            // Subscription & Working Hours
            // initialData.customPlanId is either:
            //   - A populated object { _id, name, tier } from /organizations/all
            //   - A plain string ID if not populated
            // The form stores the plan _id prefixed with STD: or CUST: via the dropdown

            ...(() => {
                const plan = initialData.customPlanId;
                if (plan && typeof plan === 'object') {
                    const planId = plan._id || (plan as { _id?: string; id?: string }).id || '';
                    if (plan.tier === 'custom') {
                        return { subscriptionType: '', customPlanId: planId };
                    }
                    return { subscriptionType: planId, customPlanId: '' };
                }
                // Plain string ID — assume standard plan (can't determine tier)
                if (typeof plan === 'string' && plan) {
                    return { subscriptionType: plan, customPlanId: '' };
                }
                return { subscriptionType: '', customPlanId: '' };
            })(),

            subscriptionDuration: normalizeDuration(initialData.subscriptionType || initialData.subscriptionDuration),

            country: initialData.country || '',
            weeklyOff: initialData.weeklyOff || '',
            timezone: initialData.timezone || '',
            checkInTime: initialData.checkInTime || '',
            checkOutTime: initialData.checkOutTime || '',
            halfDayCheckOutTime: initialData.halfDayCheckOutTime || '',
            geoFencing: initialData.geoFencing || false,

            status: initialData.status,
            maxEmployeesOverride: initialData.maxEmployeesOverride ?? initialData.maxEmployees?.override ?? null,
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

            maxEmployeesOverride: null,
            latitude: DEFAULT_ORGANIZATION_CONFIG.latitude,
            longitude: DEFAULT_ORGANIZATION_CONFIG.longitude,
        };
    }
};
