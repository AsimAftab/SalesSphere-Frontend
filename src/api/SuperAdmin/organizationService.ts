import { registerOrganization } from '../authService';
import api from '../api';

/* -------------------------
    TYPES & INTERFACES
------------------------- */

export type { RegisterOrganizationRequest as AddOrganizationRequest } from '../authService';
export type UpdateOrganizationRequest = Partial<Organization>;

export type UserRole = "Owner" | "Manager" | "Admin" | "Sales Rep";
export type SubscriptionTier = 'basic' | 'standard' | 'premium';
export type OrgStatus = "Active" | "Inactive";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  isActive: boolean;
  lastActive: string;
}

export interface Organization {
  id: string;
  name: string;
  address: string;
  owner: string;
  ownerEmail: string;
  phone: string;
  panVat: string;
  latitude: number;
  longitude: number;
  addressLink: string;
  status: OrgStatus;
  subscriptionType?: string; // e.g. "basic", "standard", "premium"
  customPlanId?: string; // ID of the custom plan if selected
  subscriptionDuration?: string;
  country?: string;
  weeklyOff?: string;
  timezone?: string;
  checkInTime?: string;
  checkOutTime?: string;
  halfDayCheckOutTime?: string;
  geoFencing?: boolean;
  users: User[];
  createdDate: string;
  emailVerified: boolean;
  subscriptionStatus: "Active" | "Expired";
  subscriptionExpiry: string;
  deactivationReason?: string;
  deactivatedDate?: string;
  lastUpdated?: string; // Enhancement: Added for UI parity
}

export interface SubscriptionHistoryEntry {
  _id: string;
  extensionDate: string;
  extensionDuration: string;
  previousEndDate: string;
  newEndDate: string;
  extendedBy: string;
}

/* -------------------------
    MAPPERS (SOLID: SRP)
------------------------- */

/**
 * Isolates data transformation logic from API logic.
 */
export class OrganizationMapper {
  static toRegisterRequest(orgData: any): any {
    // Implementation delegated to authService type via aliasing
    return {
      name: orgData.ownerName || orgData.owner,
      email: orgData.email || orgData.ownerEmail,
      organizationName: orgData.name,
      panVatNumber: orgData.panVat,
      phone: orgData.phone,
      address: orgData.address,
      latitude: orgData.latitude,
      longitude: orgData.longitude,
      googleMapLink: orgData.addressLink,
      // Backend expects duration in 'subscriptionType' (based on error message)
      subscriptionType: orgData.subscriptionDuration ? orgData.subscriptionDuration.toLowerCase().replace(' ', '') : undefined,
      // Backend expects Plan ID or Name in 'subscriptionPlanId'
      subscriptionPlanId: orgData.customPlanId || orgData.subscriptionType,
      subscriptionDuration: orgData.subscriptionDuration ? orgData.subscriptionDuration.toLowerCase().replace(' ', '') : undefined,
      checkInTime: orgData.checkInTime,
      checkOutTime: orgData.checkOutTime,
      halfDayCheckOutTime: orgData.halfDayCheckOutTime,
      weeklyOffDay: orgData.weeklyOff || orgData.weeklyOffDay,
      timezone: orgData.timezone,
      country: orgData.country,
      enableGeoFencingAttendance: orgData.geoFencing ?? false,
      isActive: orgData.status === 'Active' // Map status string to boolean
    };
  }

  static toFrontendModel(apiOrg: any, apiUser?: any): Organization {
    return {
      id: apiOrg._id || apiOrg.id,
      name: apiOrg.name,
      address: apiOrg.address,
      owner: apiUser?.name || apiOrg.ownerName || (typeof apiOrg.owner === 'object' ? apiOrg.owner?.name : apiOrg.owner) || apiOrg.user?.name || '',
      ownerEmail: apiUser?.email || apiOrg.ownerEmail || (typeof apiOrg.owner === 'object' ? apiOrg.owner?.email : undefined) || apiOrg.email || apiOrg.user?.email || '',
      phone: apiOrg.phone,
      panVat: apiOrg.panVatNumber || apiOrg.panOrVatNumber,
      latitude: apiOrg.latitude,
      longitude: apiOrg.longitude,
      addressLink: apiOrg.googleMapLink || '',
      status: apiOrg.isActive ? "Active" : "Inactive",
      createdDate: new Date(apiOrg.createdAt || Date.now()).toISOString().split('T')[0],
      emailVerified: true,
      subscriptionStatus: apiOrg.isSubscriptionActive ? "Active" : "Expired",
      subscriptionExpiry: apiOrg.subscriptionEndDate,
      subscriptionType: apiOrg.subscriptionType, // Map plan type
      customPlanId: apiOrg.subscriptionPlanId,
      subscriptionDuration: apiOrg.subscriptionDuration,
      country: apiOrg.country,
      weeklyOff: apiOrg.weeklyOffDay,
      timezone: apiOrg.timezone,
      checkInTime: apiOrg.checkInTime,
      checkOutTime: apiOrg.checkOutTime,
      halfDayCheckOutTime: apiOrg.halfDayCheckOutTime,
      geoFencing: apiOrg.enableGeoFencingAttendance,
      deactivationReason: apiOrg.deactivationReason,
      deactivatedDate: apiOrg.deactivatedDate,
      users: apiUser ? [{
        id: apiUser._id || apiUser.id,
        name: apiUser.name,
        email: apiUser.email,
        role: "Owner",
        emailVerified: true,
        isActive: true,
        lastActive: "Never"
      }] : (apiOrg.users || []), // Use existing users if apiUser not provided
      lastUpdated: new Date(apiOrg.updatedAt || Date.now()).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })
    };
  }
}

/* -------------------------
    API SERVICES
------------------------- */

export const addOrganization = async (orgData: any): Promise<Organization> => {
  try {
    const payload = OrganizationMapper.toRegisterRequest(orgData);
    const response = await registerOrganization(payload);

    // The backend returns { status: 'success', data: { user: { ... } } }
    // Note: The 'organization' object is NOT in response.data.organization anymore.
    // However, the registration logs the user in (via cookie), so we can fetch the org details immediately.

    const { user } = response.data;

    if (!user) {
      throw new Error('Invalid response from server: Missing user data');
    }

    // Fetch the newly created organization details using the ID from the registered user
    // (fetching 'my-organization' fails for Super Admins creating other orgs)
    const orgResponse = await getOrganizationById(user.organizationId);

    // orgResponse is { status: 'success', data: { ...org... } }
    const organization = orgResponse.data;

    if (!organization) {
      throw new Error('Failed to retrieve organization details after registration');
    }

    return OrganizationMapper.toFrontendModel(
      organization,
      user
    );
  } catch (error: any) {
    throw new Error(error.message || 'Registration failed');
  }
};

/**
 * SOLID: Open/Closed Principle. 
 * Handles updates dynamically without manual if-statements.
 */
export const updateOrganization = async (id: string, updates: Partial<any>): Promise<Organization> => {
  try {
    // Dynamically map frontend keys to backend keys if they differ
    const keyMap: Record<string, string> = {
      panVat: 'panVatNumber',
      status: 'isActive',
      subscriptionExpiry: 'subscriptionEndDate',
      customPlanId: 'subscriptionPlanId',
      geoFencing: 'enableGeoFencingAttendance',
      weeklyOff: 'weeklyOffDay',
      addressLink: 'googleMapLink'
    };

    const apiPayload = Object.entries(updates).reduce((acc, [key, value]) => {
      const apiKey = keyMap[key] || key;
      let apiValue = key === 'status' ? value === 'Active' : value;

      if (key === 'subscriptionDuration' && typeof value === 'string') {
        apiValue = value.toLowerCase().replace(/\s+/g, '');
      }

      if (value !== undefined) acc[apiKey] = apiValue;
      return acc;
    }, {} as Record<string, any>);

    const { data } = await api.put(`/organizations/${id}`, apiPayload);
    return OrganizationMapper.toFrontendModel(data.data);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Update failed');
  }
};

export const fetchMyOrganization = async () => {
  const { data } = await api.get('/organizations/my-organization');
  return data;
};

export const getOrganizationById = async (id: string) => {
  const { data } = await api.get(`/organizations/${id}`);
  return data;
};

export const toggleOrganizationStatus = async (id: string, activate: boolean) => {
  const endpoint = activate ? 'reactivate' : 'deactivate';
  await api.put(`/organizations/${id}/${endpoint}`);
};

export const activateOrganization = async (id: string) => {
  await api.put(`/organizations/${id}/reactivate`);
};

export const deactivateOrganization = async (id: string) => {
  await api.put(`/organizations/${id}/deactivate`);
};

export const extendSubscription = async (
  organizationId: string,
  duration: '6months' | '12months'
) => {
  const { data } = await api.post(`/organizations/${organizationId}/extend-subscription`, {
    extensionDuration: duration
  });
  return data;
};

export const deleteOrganization = async (id: string) => {
  await api.delete(`/organizations/${id}`);
  return true;
};