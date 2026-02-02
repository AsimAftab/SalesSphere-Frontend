import { registerOrganization } from '../authService';
import api from '../api';
import { API_ENDPOINTS } from '../endpoints';

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
  customPlanId?: string | { _id: string; name: string; tier: string }; // ID or populated object
  subscriptionDuration?: string;
  country?: string;
  weeklyOff?: string;
  timezone?: string;
  checkInTime?: string;
  checkOutTime?: string;
  halfDayCheckOutTime?: string;
  geoFencing?: boolean;
  users: User[];
  userCount?: number;
  createdDate: string;
  emailVerified: boolean;
  subscriptionStatus: "Active" | "Expired";
  subscriptionExpiry: string;
  deactivationReason?: string;
  deactivatedDate?: string;
  lastUpdated?: string; // Enhancement: Added for UI parity
}

export interface OrganizationUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  lastActiveAt?: string;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toRegisterRequest(orgData: Record<string, any>): Record<string, any> {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toFrontendModel(apiOrg: Record<string, any>, apiUser?: Record<string, any>): Organization {
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
      }] : (apiOrg.users || []),
      userCount: apiOrg.userCount, // From /organizations/all endpoint
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addOrganization = async (orgData: any): Promise<Organization> => {
  try {
    const payload = OrganizationMapper.toRegisterRequest(orgData) as import('../authService').RegisterOrganizationRequest;
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
  } catch (error: unknown) {
    throw new Error((error instanceof Error ? error.message : null) || 'Registration failed');
  }
};

/**
 * SOLID: Open/Closed Principle. 
 * Handles updates dynamically without manual if-statements.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateOrganization = async (id: string, updates: Partial<any>): Promise<Organization> => {
  try {
    // Map frontend form keys to backend-accepted keys
    // Backend whitelist: name, phone, address, latitude, longitude, googleMapLink,
    // checkInTime, checkOutTime, halfDayCheckOutTime, weeklyOffDay,
    // enableGeoFencingAttendance, timezone
    const fieldMap: Record<string, string> = {
      name: 'name',
      phone: 'phone',
      address: 'address',
      latitude: 'latitude',
      longitude: 'longitude',
      addressLink: 'googleMapLink',
      checkInTime: 'checkInTime',
      checkOutTime: 'checkOutTime',
      halfDayCheckOutTime: 'halfDayCheckOutTime',
      weeklyOff: 'weeklyOffDay',
      geoFencing: 'enableGeoFencingAttendance',
      country: 'country',
      timezone: 'timezone',
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const apiPayload: Record<string, any> = {};
    for (const [frontendKey, backendKey] of Object.entries(fieldMap)) {
      if (updates[frontendKey] !== undefined) {
        apiPayload[backendKey] = updates[frontendKey];
      }
    }

    // Subscription plan: send whichever plan ID is set (custom or standard)
    const planId = updates.customPlanId || updates.subscriptionType;
    if (planId) {
      apiPayload.subscriptionPlanId = planId;
    }

    if (Object.keys(apiPayload).length === 0) {
      throw new Error('No updatable fields provided');
    }

    const { data } = await api.put(API_ENDPOINTS.organizations.DETAIL(id), apiPayload);
    return OrganizationMapper.toFrontendModel(data.data);
  } catch (error: unknown) {
    const msg = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
    throw new Error(msg || 'Update failed');
  }
};

export const fetchAllOrganizations = async (): Promise<Organization[]> => {
  const { data } = await api.get(API_ENDPOINTS.organizations.ALL);
  const orgList = data.data || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return orgList.map((apiOrg: Record<string, any>) => OrganizationMapper.toFrontendModel(apiOrg, apiOrg.owner));
};

export const fetchMyOrganization = async () => {
  const { data } = await api.get(API_ENDPOINTS.organizations.MY_ORG);
  return data;
};

export const getOrganizationById = async (id: string) => {
  const { data } = await api.get(API_ENDPOINTS.organizations.DETAIL(id));
  return data;
};

export const toggleOrganizationStatus = async (id: string, activate: boolean) => {
  const endpoint = activate ? API_ENDPOINTS.organizations.REACTIVATE(id) : API_ENDPOINTS.organizations.DEACTIVATE(id);
  await api.put(endpoint);
};

export const activateOrganization = async (id: string) => {
  await api.put(API_ENDPOINTS.organizations.REACTIVATE(id));
};

export const deactivateOrganization = async (id: string) => {
  await api.put(API_ENDPOINTS.organizations.DEACTIVATE(id));
};

export const extendSubscription = async (
  organizationId: string,
  duration: '6months' | '12months'
) => {
  const { data } = await api.post(API_ENDPOINTS.organizations.EXTEND_SUBSCRIPTION(organizationId), {
    extensionDuration: duration
  });
  return data;
};

export const fetchOrganizationUsers = async (orgId: string): Promise<OrganizationUser[]> => {
  const { data } = await api.get(API_ENDPOINTS.organizations.USERS(orgId));
  const users = data.data || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return users.map((u: Record<string, any>) => ({
    id: u._id || u.id,
    name: u.name,
    email: u.email,
    phone: u.phone || '',
    role: u.role || 'User',
    isActive: u.isActive ?? true,
    avatarUrl: u.avatarUrl,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
    createdBy: u.createdBy || undefined,
    updatedBy: u.updatedBy || undefined,
    lastActiveAt: u.lastActiveAt,
  }));
};

export const toggleOrgUserAccess = async (orgId: string, userId: string, activate: boolean) => {
  const endpoint = activate
    ? API_ENDPOINTS.organizations.REACTIVATE_USER(orgId, userId)
    : API_ENDPOINTS.organizations.DEACTIVATE_USER(orgId, userId);

  if (activate) {
    await api.post(endpoint);
  } else {
    await api.delete(endpoint);
  }
};

export const deleteOrganization = async (id: string) => {
  await api.delete(API_ENDPOINTS.organizations.DETAIL(id));
  return true;
};