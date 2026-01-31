import api from '../api';

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
  createdAt: string;
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
  } catch (error: unknown) {
    console.error('Failed to fetch system overview:', error);
    throw new Error((error instanceof Error ? error.message : undefined) || 'Failed to fetch system overview');
  }
};

/**
 * Get all organizations from system overview
 */
export const getAllOrganizationsFromOverview = async (): Promise<OrganizationFromAPI[]> => {
  try {
    const overview = await getSystemOverview();
    return overview.organizations.list;
  } catch (error: unknown) {
    console.error('Failed to fetch organizations:', error);
    throw new Error((error instanceof Error ? error.message : undefined) || 'Failed to fetch organizations');
  }
};

/**
 * Get all system users from system overview
 */
export const getAllSystemUsersFromOverview = async (): Promise<SystemUserFromAPI[]> => {
  try {
    const overview = await getSystemOverview();
    return overview.systemUsers.list;
  } catch (error: unknown) {
    console.error('Failed to fetch system users:', error);
    throw new Error((error instanceof Error ? error.message : undefined) || 'Failed to fetch system users');
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
/**
 * Organization Stats Interface (from API)
 */
export interface OrganizationStats {
  total: number;
  active: number;
  recent: number;
}

/**
 * User Stats Interface (from API)
 */
export interface UserStats {
  total: number;
  active: number;
  admins: number;
  systemUsers: number;
  roleDistribution: {
    admin: number;
    user: number;
    superadmin: number;
  };
}

/**
 * System Stats Response Interface
 */
export interface SystemStatsResponse {
  success: boolean;
  data: {
    organizations: OrganizationStats;
    users: UserStats;
  };
}

/**
 * Get unified system statistics
 * GET /api/v1/organizations/stats
 */
export const getSystemStats = async (): Promise<SystemStatsResponse['data']> => {
  try {
    const response = await api.get<SystemStatsResponse>('/organizations/stats');
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response from server');
    }
    return response.data.data;
  } catch (error: unknown) {
    console.error('Failed to fetch system stats:', error);
    throw new Error((error instanceof Error ? error.message : undefined) || 'Failed to fetch system stats');
  }
};
