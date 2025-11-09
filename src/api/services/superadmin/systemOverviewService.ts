import api from '../../api';

// Type Definitions for System Overview

// Organization Owner Interface
export interface OrganizationOwner {
  _id: string;
  name: string;
  email: string;
  phone: string;
  id: string;
}

// Organization Interface (from API)
export interface OrganizationFromAPI {
  _id: string;
  name: string;
  panVatNumber: string;
  phone: string;
  address: string;
  subscriptionType: string;
  isActive: boolean;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  owner: OrganizationOwner;
  isSubscriptionActive: boolean;
  id: string;
}

// System User Interface (from API)
export interface SystemUserFromAPI {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  phone: string;
  address: string;
  createdAt: string;
  id: string;
}

// System Overview Response Interface
export interface SystemOverviewData {
  organizations: {
    count: number;
    list: OrganizationFromAPI[];
  };
  systemUsers: {
    count: number;
    list: SystemUserFromAPI[];
  };
}

export interface SystemOverviewResponse {
  success: boolean;
  data: SystemOverviewData;
}

/**
 * Get system overview including organizations and system users
 * GET /api/v1/users/system-overview
 */
export const getSystemOverview = async (): Promise<SystemOverviewData> => {
  try {
    const response = await api.get<SystemOverviewResponse>('/users/system-overview');

    if (!response.data || !response.data.data) {
      throw new Error('Invalid response from server');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch system overview:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch system overview');
  }
};

/**
 * Get all organizations from system overview
 */
export const getAllOrganizationsFromOverview = async (): Promise<OrganizationFromAPI[]> => {
  try {
    const overview = await getSystemOverview();
    return overview.organizations.list;
  } catch (error: any) {
    console.error('Failed to fetch organizations:', error);
    throw new Error(error.message || 'Failed to fetch organizations');
  }
};

/**
 * Get all system users from system overview
 */
export const getAllSystemUsersFromOverview = async (): Promise<SystemUserFromAPI[]> => {
  try {
    const overview = await getSystemOverview();
    return overview.systemUsers.list;
  } catch (error: any) {
    console.error('Failed to fetch system users:', error);
    throw new Error(error.message || 'Failed to fetch system users');
  }
};

/**
 * Get organization statistics from system overview
 */
export const getOrganizationStatsFromOverview = async () => {
  try {
    const overview = await getSystemOverview();
    const organizations = overview.organizations.list;

    return {
      total: overview.organizations.count,
      active: organizations.filter(org => org.isActive).length,
      inactive: organizations.filter(org => !org.isActive).length,
      subscriptionActive: organizations.filter(org => org.isSubscriptionActive).length,
      subscriptionExpired: organizations.filter(org => !org.isSubscriptionActive).length,
    };
  } catch (error) {
    console.error('Failed to get organization stats:', error);
    return {
      total: 0,
      active: 0,
      inactive: 0,
      subscriptionActive: 0,
      subscriptionExpired: 0,
    };
  }
};

/**
 * Get system user statistics from system overview
 */
export const getSystemUserStatsFromOverview = async () => {
  try {
    const overview = await getSystemOverview();
    const users = overview.systemUsers.list;

    return {
      total: overview.systemUsers.count,
      active: users.filter(user => user.isActive).length,
      inactive: users.filter(user => !user.isActive).length,
      superadmins: users.filter(user => user.role.toLowerCase() === 'superadmin').length,
      developers: users.filter(user => user.role.toLowerCase() === 'developer').length,
    };
  } catch (error) {
    console.error('Failed to get system user stats:', error);
    return {
      total: 0,
      active: 0,
      inactive: 0,
      superadmins: 0,
      developers: 0,
    };
  }
};
