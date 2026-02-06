import { registerOrganization } from '../authService';
import api from '../api';
import { API_ENDPOINTS } from '../endpoints';
import { handleApiError } from '../errors';

/* -------------------------
    TYPES & INTERFACES
------------------------- */

export type { RegisterOrganizationRequest as AddOrganizationRequest } from '../authService';
export type UpdateOrganizationRequest = Partial<Organization>;

// UserRole is dynamic based on RBAC - roles are fetched from the backend
export type UserRole = string;
export type SubscriptionTier = 'basic' | 'standard' | 'premium' | 'custom';
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
  lastUpdated?: string;
  // Max Employees fields
  maxEmployeesOverride?: number | null;
  maxEmployees?: MaxEmployeesInfo;
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

export interface MaxEmployeesInfo {
  plan: number;
  override: number | null;
  effective: number;
}

export interface MaxEmployeesUpdateResponse {
  success: boolean;
  message: string;
  data: {
    organizationId: string;
    maxEmployeesOverride: number | null;
    planLimit: number;
    effectiveLimit: number;
  };
}

export interface OrgPaymentRecord {
  _id: string;
  amount: number;
  dateReceived: string;
  paymentMode: string;
  createdAt: string;
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
      subscriptionType: apiOrg.subscriptionType,
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
      userCount: apiOrg.userCount,
      lastUpdated: new Date(apiOrg.updatedAt || Date.now()).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }),
      // Max Employees fields (from GET /organizations/:id response)
      maxEmployeesOverride: apiOrg.maxEmployeesOverride ?? null,
      maxEmployees: apiOrg.maxEmployees ? {
        plan: apiOrg.maxEmployees.plan,
        override: apiOrg.maxEmployees.override,
        effective: apiOrg.maxEmployees.effective,
      } : undefined,
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
    throw handleApiError(error, 'Registration failed');
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
      // Note: maxEmployeesOverride is handled via separate PATCH /organizations/:id/max-employees endpoint
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
    throw handleApiError(error, 'Update failed');
  }
};

export const fetchAllOrganizations = async (): Promise<Organization[]> => {
  try {
    const { data } = await api.get(API_ENDPOINTS.organizations.ALL);
    const orgList = data.data || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return orgList.map((apiOrg: Record<string, any>) => OrganizationMapper.toFrontendModel(apiOrg, apiOrg.owner));
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to fetch organizations');
  }
};

export const fetchMyOrganization = async () => {
  try {
    const { data } = await api.get(API_ENDPOINTS.organizations.MY_ORG);
    return data;
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to fetch organization');
  }
};

export const getOrganizationById = async (id: string) => {
  try {
    const { data } = await api.get(API_ENDPOINTS.organizations.DETAIL(id));
    return data;
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to fetch organization');
  }
};

export const toggleOrganizationStatus = async (id: string, activate: boolean) => {
  try {
    const endpoint = activate ? API_ENDPOINTS.organizations.REACTIVATE(id) : API_ENDPOINTS.organizations.DEACTIVATE(id);
    await api.put(endpoint);
  } catch (error: unknown) {
    throw handleApiError(error, `Failed to ${activate ? 'activate' : 'deactivate'} organization`);
  }
};

export const activateOrganization = async (id: string) => {
  try {
    await api.put(API_ENDPOINTS.organizations.REACTIVATE(id));
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to activate organization');
  }
};

export const deactivateOrganization = async (id: string) => {
  try {
    await api.put(API_ENDPOINTS.organizations.DEACTIVATE(id));
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to deactivate organization');
  }
};

export const extendSubscription = async (
  organizationId: string,
  duration: '6months' | '12months'
) => {
  try {
    const { data } = await api.post(API_ENDPOINTS.organizations.EXTEND_SUBSCRIPTION(organizationId), {
      extensionDuration: duration
    });
    return data;
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to extend subscription');
  }
};

export const fetchOrganizationUsers = async (orgId: string): Promise<OrganizationUser[]> => {
  try {
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
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to fetch organization users');
  }
};

export const toggleOrgUserAccess = async (orgId: string, userId: string, activate: boolean) => {
  try {
    const endpoint = activate
      ? API_ENDPOINTS.organizations.REACTIVATE_USER(orgId, userId)
      : API_ENDPOINTS.organizations.DEACTIVATE_USER(orgId, userId);

    if (activate) {
      await api.post(endpoint);
    } else {
      await api.delete(endpoint);
    }
  } catch (error: unknown) {
    throw handleApiError(error, `Failed to ${activate ? 'activate' : 'deactivate'} user`);
  }
};

export const deleteOrganization = async (id: string) => {
  try {
    await api.delete(API_ENDPOINTS.organizations.DETAIL(id));
    return true;
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to delete organization');
  }
};

/**
 * Update max employees override for an organization
 * @param orgId - Organization ID
 * @param maxEmployees - Number to set as override, or null to reset to plan default
 */
export const updateMaxEmployees = async (
  orgId: string,
  maxEmployees: number | null
): Promise<MaxEmployeesUpdateResponse> => {
  try {
    // Backend expects 'maxEmployees' field name
    const { data } = await api.patch(API_ENDPOINTS.organizations.MAX_EMPLOYEES(orgId), {
      maxEmployees,
    });
    return data;
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to update employee limit');
  }
};

/**
 * Fetch payment history for the current user's organization
 * (For org admins to view their own payments)
 */
export const fetchMyOrgPayments = async (): Promise<OrgPaymentRecord[]> => {
  try {
    const { data } = await api.get(API_ENDPOINTS.organizations.MY_ORG_PAYMENTS);
    return data.data || [];
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to fetch payment history');
  }
};