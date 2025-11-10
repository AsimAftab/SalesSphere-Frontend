import { registerOrganization, type RegisterOrganizationRequest } from '../../authService';
import api from '../../api';

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
    if (orgData.panVat) updatePayload.panOrVatNumber = orgData.panVat;
    if (orgData.latitude !== undefined) updatePayload.latitude = orgData.latitude;
    if (orgData.longitude !== undefined) updatePayload.longitude = orgData.longitude;

    // Update organization status
    if (orgData.status !== undefined) {
      updatePayload.isActive = orgData.status === "Active";
    }

    // Update subscription if provided
    if (orgData.subscriptionExpiry) updatePayload.subscriptionEndDate = orgData.subscriptionExpiry;
    if (orgData.deactivationReason) updatePayload.deactivationReason = orgData.deactivationReason;

    // Call backend API to update organization
    const response = await api.patch(`/organizations/${orgData.id}`, updatePayload);

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
