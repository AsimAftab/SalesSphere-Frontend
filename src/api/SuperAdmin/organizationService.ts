import { registerOrganization, type RegisterOrganizationRequest } from '../authService';
import api from '../api';

// Type Definitions
export interface User {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Manager" | "Admin" | "Sales Rep";
  emailVerified: boolean;
  isActive: boolean;
  lastActive: string;
  dob?: string;
  gender?: "Male" | "Female" | "Other";
  citizenshipNumber?: string;
  panNumber?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
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
  status: "Active" | "Inactive";
  users: User[];
  createdDate: string;
  emailVerified: boolean;
  subscriptionStatus: "Active" | "Expired";
  subscriptionExpiry: string;
  deactivationReason?: string;
  deactivatedDate?: string;
}

export interface OrganizationStats {
  total: number;
  active: number;
  inactive: number;
  expired: number;
}

export interface AddOrganizationRequest {
  name: string;
  address: string;
  owner: string;
  ownerEmail: string;
  phone: string;
  panVat: string;
  latitude: number;
  longitude: number;
  addressLink: string;
  status: "Active" | "Inactive";
  emailVerified: boolean;
  subscriptionStatus: "Active" | "Expired";
  subscriptionExpiry: string;
  subscriptionType: string;
  checkInTime: string;
  checkOutTime: string;
  weeklyOffDay: string;
}

export interface UpdateOrganizationRequest {
  id: string;
  name?: string;
  address?: string;
  owner?: string;
  ownerEmail?: string;
  phone?: string;
  panVat?: string;
  latitude?: number;
  longitude?: number;
  addressLink?: string;
  status?: "Active" | "Inactive";
  emailVerified?: boolean;
  subscriptionStatus?: "Active" | "Expired";
  subscriptionExpiry?: string;
  deactivationReason?: string;
  deactivatedDate?: string;
  users?: User[];
  checkInTime?: string;
  checkOutTime?: string;
  halfDayCheckOutTime?: string;
  weeklyOffDay?: string;
  timezone?: string;
  subscriptionType?: string;
}

// API Functions

export const addOrganization = async (orgData: AddOrganizationRequest): Promise<Organization> => {
  try {
    // Map frontend AddOrganizationRequest to backend RegisterOrganizationRequest
    const registrationData: RegisterOrganizationRequest = {
      name: orgData.owner, // Admin user name
      email: orgData.ownerEmail, // Admin user email
      organizationName: orgData.name, // Organization name
      panVatNumber: orgData.panVat,
      phone: orgData.phone,
      address: orgData.address,
      latitude: orgData.latitude,
      longitude: orgData.longitude,
      googleMapLink: orgData.addressLink,
      subscriptionType: orgData.subscriptionType,
      checkInTime: orgData.checkInTime,
      checkOutTime: orgData.checkOutTime,
      weeklyOffDay: orgData.weeklyOffDay
    };

    // Call backend registration endpoint
    const response = await registerOrganization(registrationData);

    // Transform backend response to frontend Organization format
    const newOrg: Organization = {
      id: response.organization?._id || '',
      name: response.organization?.name || orgData.name,
      address: response.organization?.address || orgData.address,
      owner: orgData.owner,
      ownerEmail: orgData.ownerEmail,
      phone: response.organization?.phone || orgData.phone,
      panVat: response.organization?.panOrVatNumber || orgData.panVat,
      latitude: response.organization?.latitude || orgData.latitude,
      longitude: response.organization?.longitude || orgData.longitude,
      addressLink: orgData.addressLink,
      status: response.organization?.isActive ? "Active" : "Inactive",
      createdDate: new Date().toISOString().split('T')[0],
      emailVerified: orgData.emailVerified,
      subscriptionStatus: orgData.subscriptionStatus,
      subscriptionExpiry: orgData.subscriptionExpiry,
      users: [
        {
          id: response.user?._id || `u-${Date.now()}`,
          name: orgData.owner,
          email: orgData.ownerEmail,
          role: "Owner",
          emailVerified: orgData.emailVerified,
          isActive: true,
          lastActive: "Never"
        }
      ]
    };

    return newOrg;
  } catch (error: any) {
    console.error('Failed to register organization:', error);
    throw new Error(error.message || 'Failed to create organization');
  }
};

export const updateOrganization = async (orgData: UpdateOrganizationRequest): Promise<Organization> => {
  try {
    // Prepare update payload for backend
    const updatePayload: any = {};

    if (orgData.name) updatePayload.name = orgData.name;
    if (orgData.address) updatePayload.address = orgData.address;
    if (orgData.phone) updatePayload.phone = orgData.phone;
    if (orgData.panVat) updatePayload.panVatNumber = orgData.panVat;
    if (orgData.latitude !== undefined) updatePayload.latitude = orgData.latitude;
    if (orgData.longitude !== undefined) updatePayload.longitude = orgData.longitude;

    // Update organization status
    if (orgData.status !== undefined) {
      updatePayload.isActive = orgData.status === "Active";
    }

    // Update subscription if provided
    if (orgData.subscriptionExpiry) updatePayload.subscriptionEndDate = orgData.subscriptionExpiry;
    if (orgData.deactivationReason) updatePayload.deactivationReason = orgData.deactivationReason;

    // Update new fields
    if (orgData.checkInTime) updatePayload.checkInTime = orgData.checkInTime;
    if (orgData.checkOutTime) updatePayload.checkOutTime = orgData.checkOutTime;
    if (orgData.halfDayCheckOutTime) updatePayload.halfDayCheckOutTime = orgData.halfDayCheckOutTime;
    if (orgData.weeklyOffDay) updatePayload.weeklyOffDay = orgData.weeklyOffDay;
    if (orgData.timezone) updatePayload.timezone = orgData.timezone;
    if (orgData.subscriptionType) updatePayload.subscriptionType = orgData.subscriptionType;

    // Call backend API to update organization
    const response = await api.put(`/organizations/${orgData.id}`, updatePayload);

    // Transform backend response to frontend Organization format
    const updatedOrg: Organization = {
      id: response.data.data._id || orgData.id,
      name: response.data.data.name || orgData.name || '',
      address: response.data.data.address || orgData.address || '',
      owner: orgData.owner || '',
      ownerEmail: orgData.ownerEmail || '',
      phone: response.data.data.phone || orgData.phone || '',
      panVat: response.data.data.panOrVatNumber || orgData.panVat || '',
      latitude: response.data.data.latitude || orgData.latitude || 0,
      longitude: response.data.data.longitude || orgData.longitude || 0,
      addressLink: orgData.addressLink || '',
      status: response.data.data.isActive ? "Active" : "Inactive",
      users: orgData.users || [],
      createdDate: new Date().toISOString().split('T')[0],
      emailVerified: orgData.emailVerified || false,
      subscriptionStatus: orgData.subscriptionStatus || "Active",
      subscriptionExpiry: response.data.data.subscriptionEndDate || orgData.subscriptionExpiry || '',
      deactivationReason: orgData.deactivationReason,
      deactivatedDate: orgData.deactivatedDate
    };

    return updatedOrg;
  } catch (error: any) {
    console.error('Failed to update organization:', error);
    throw new Error(error.response?.data?.message || 'Failed to update organization');
  }
};

export const deleteOrganization = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/organizations/${id}`);
    return true;
  } catch (error: any) {
    console.error('Failed to delete organization:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete organization');
  }
};


interface MyOrgApiResponse {
  success: boolean;
  data: {
    _id: string;
    name: string;
    subscriptionEndDate: string; // This matches your updateOrganization function
    subscriptionStatus: "Active" | "Expired";

  };
}


export const fetchMyOrganization = async (): Promise<MyOrgApiResponse> => {
  try {
    const { data } = await api.get<MyOrgApiResponse>('/organizations/my-organization');
    return data;
  } catch (error: any) {
    console.error('Error fetching organization details:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch organization');
  }
};

// Response interface for getOrganizationById
export interface OrganizationDetailResponse {
  success: boolean;
  data: {
    _id: string;
    name: string;
    panVatNumber: string;
    phone: string;
    address: string;
    latitude: number;
    longitude: number;
    googleMapLink: string;
    checkInTime: string;
    checkOutTime: string;
    halfDayCheckOutTime: string;
    weeklyOffDay: string;
    timezone: string;
    subscriptionType: string;
    isActive: boolean;
    subscriptionStartDate: string;
    createdAt: string;
    updatedAt: string;
    subscriptionEndDate: string;
    owner: {
      _id: string;
      name: string;
      email: string;
      role: string;
      id: string;
    };
    subscriptionHistory?: SubscriptionHistoryEntry[];
    isSubscriptionActive: boolean;
    id: string;
  };
}

export const getOrganizationById = async (id: string): Promise<OrganizationDetailResponse> => {
  try {
    const { data } = await api.get<OrganizationDetailResponse>(`/organizations/${id}`);
    return data;
  } catch (error: any) {
    console.error('Error fetching organization details:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch organization details');
  }
};

// Deactivate organization
export const deactivateOrganization = async (id: string): Promise<void> => {
  try {
    await api.put(`/organizations/${id}/deactivate`);
  } catch (error: any) {
    console.error('Error deactivating organization:', error);
    throw new Error(error.response?.data?.message || 'Failed to deactivate organization');
  }
};

// Activate organization
export const activateOrganization = async (id: string): Promise<void> => {
  try {
    await api.put(`/organizations/${id}/reactivate`);
  } catch (error: any) {
    console.error('Error activating organization:', error);
    throw new Error(error.response?.data?.message || 'Failed to activate organization');
  }
};

// Extend subscription interfaces
export interface ExtendSubscriptionRequest {
  extensionDuration: '6months' | '12months';
}

export interface SubscriptionHistoryEntry {
  _id: string;
  extendedBy: string; // This is just the user ID string
  extensionDate: string;
  previousEndDate: string;
  newEndDate: string;
  extensionDuration: string;
  id: string;
}

export interface ExtendSubscriptionResponse {
  success: boolean;
  message: string;
  data: {
    organization: {
      _id: string;
      name: string;
      panVatNumber: string;
      phone: string;
      address: string;
      latitude: number;
      longitude: number;
      googleMapLink: string;
      checkInTime: string;
      checkOutTime: string;
      halfDayCheckOutTime: string;
      weeklyOffDay: string;
      timezone: string;
      subscriptionType: string;
      isActive: boolean;
      subscriptionStartDate: string;
      createdAt: string;
      updatedAt: string;
      subscriptionEndDate: string;
      __v: number;
      owner: string;
      subscriptionHistory: SubscriptionHistoryEntry[];
      isSubscriptionActive: boolean;
      id: string;
    };
    extensionDetails: {
      previousEndDate: string;
      newEndDate: string;
      extensionDuration: string;
      extendedBy: {
        _id: string;
        name: string;
        email: string;
        role: string;
      };
      extensionDate: string;
    };
  };
}

// Extend organization subscription
export const extendSubscription = async (
  organizationId: string,
  extensionDuration: '6months' | '12months'
): Promise<ExtendSubscriptionResponse> => {
  try {
    const payload: ExtendSubscriptionRequest = {
      extensionDuration
    };

    const { data } = await api.post<ExtendSubscriptionResponse>(
      `/organizations/${organizationId}/extend-subscription`,
      payload
    );

    return data;
  } catch (error: any) {
    console.error('Error extending subscription:', error);
    throw new Error(error.response?.data?.message || 'Failed to extend subscription');
  }
};