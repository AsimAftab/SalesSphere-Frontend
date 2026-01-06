import { registerOrganization, type RegisterOrganizationRequest } from '../authService';
import api from '../api';

/* -------------------------
    TYPES & INTERFACES
------------------------- */

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
  users: User[];
  createdDate: string;
  emailVerified: boolean;
  subscriptionStatus: "Active" | "Expired";
  subscriptionExpiry: string;
}

/* -------------------------
    MAPPERS (SOLID: SRP)
------------------------- */

/**
 * Isolates data transformation logic from API logic.
 */
class OrganizationMapper {
  static toRegisterRequest(orgData: any): RegisterOrganizationRequest {
    return {
      name: orgData.owner,
      email: orgData.ownerEmail,
      organizationName: orgData.name,
      panVatNumber: orgData.panVat,
      phone: orgData.phone,
      address: orgData.address,
      latitude: orgData.latitude,
      longitude: orgData.longitude,
      googleMapLink: orgData.addressLink,
      subscriptionType: orgData.subscriptionType,
      subscriptionPlanId: orgData.subscriptionPlanId,
      checkInTime: orgData.checkInTime,
      checkOutTime: orgData.checkOutTime,
      halfDayCheckOutTime: orgData.halfDayCheckOutTime,
      weeklyOffDay: orgData.weeklyOffDay,
      timezone: orgData.timezone
    };
  }

  static toFrontendModel(apiOrg: any, apiUser?: any): Organization {
    return {
      id: apiOrg._id || apiOrg.id,
      name: apiOrg.name,
      address: apiOrg.address,
      owner: apiUser?.name || '',
      ownerEmail: apiUser?.email || '',
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
      users: apiUser ? [{
        id: apiUser._id || apiUser.id,
        name: apiUser.name,
        email: apiUser.email,
        role: "Owner",
        emailVerified: true,
        isActive: true,
        lastActive: "Never"
      }] : []
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

    return OrganizationMapper.toFrontendModel(
      response.organization,
      response.user
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
      subscriptionExpiry: 'subscriptionEndDate'
    };

    const apiPayload = Object.entries(updates).reduce((acc, [key, value]) => {
      const apiKey = keyMap[key] || key;
      const apiValue = key === 'status' ? value === 'Active' : value;

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