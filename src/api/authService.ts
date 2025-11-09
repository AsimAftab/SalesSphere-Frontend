import api from './api';
import { clearAuthStorage } from '../components/auth/authutils';

const TOKEN_KEY = 'authToken';
const LOGIN_TIME_KEY = 'loginTime';
const USER_KEY = 'user';

// User interface matching backend response
export interface User {
  _id: string;
  id?: string; // For compatibility with frontend code
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  organizationId?: string;
  phone?: string;
  dateJoined?: string;
  documents?: any[];
  createdAt?: string;
  updatedAt?: string;
}

// Login response structure from backend API
export interface LoginResponse {
  status: string;
  token: string;
  data?: {
    user?: User;
  };
}

// Get user response structure
export interface GetUserResponse {
  success: boolean;
  data: User;
}

// ✅ Function to handle user login
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });

    // ✅ Validate response properly
    if (!response || !response.data || !response.data.token) {
      throw new Error('Invalid response from server.');
    }

    // ✅ Save token first
    localStorage.setItem(TOKEN_KEY, response.data.token);
    localStorage.setItem(LOGIN_TIME_KEY, Date.now().toString());

    // ✅ Fetch user profile after login to get complete user data with role
    try {
      const userProfile = await getCurrentUser();
      localStorage.setItem(USER_KEY, JSON.stringify(userProfile));
    } catch (profileError) {
      console.warn('Could not fetch user profile after login:', profileError);
      // If user data was in login response, use it as fallback
      if (response.data.data?.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.data.user));
      }
    }

    return response.data;
  } catch (error: any) {
    // ✅ Handle network / backend down errors
    if (!error.response) {
      console.error('Network error during login');
    }

    clearAuthStorage();

    throw error;
  }
};

// ✅ Function to handle user logout
export const logout = () => {
  clearAuthStorage();
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
};

// ✅ Function to send forgot password request
export const forgotPassword = async (email: string) => {
  try {
       await api.post('/auth/forgotpassword', { email });

    // ✅ Always replace backend message with your preferred text
    return {
      status: 'success',
      message: 'If that email is registered, Password Reset Link has been sent.',
    };
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to send reset link' };
  }
};


// ✅ Function to reset password
export const resetPassword = async (token: string, password: string, passwordConfirm: string) => {
  try {
    const response = await api.patch(`/auth/resetpassword/${token}`, {
      password,
      passwordConfirm
    });

    return response.data; // Backend already sends status, message, and data
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to reset password' };
  }
};


// ✅ Function to contact admin
export const contactAdmin = async (data: {
  fullName: string;
  email: string;
  department?: string;
  requestType: string;
  message: string;
}) => {
  try {
    const response = await api.post('/auth/contact-admin', data);
    return response.data; // { status: "success", message: "Your message has been sent" }
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to contact admin' };
  }
};

// ✅ Function to get current logged-in user profile
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<GetUserResponse>('/users/me');
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch current user:', error);
    throw error.response?.data || { message: 'Failed to fetch user profile' };
  }
};

// ✅ Helper function to get user from localStorage
export const getStoredUser = (): User | null => {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Failed to parse stored user:', error);
    return null;
  }
};

// ✅ Helper function to check if user has specific role
export const hasRole = (requiredRoles: string[]): boolean => {
  const user = getStoredUser();
  if (!user || !user.role) return false;
  return requiredRoles.includes(user.role.toLowerCase());
};

// ✅ Helper function to check authentication status
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(TOKEN_KEY);
};

// ✅ Function to register organization (creates organization + admin user)
export interface RegisterOrganizationRequest {
  name: string;
  email: string;
  password: string;
  organizationName: string;
  panOrVatNumber?: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface RegisterOrganizationResponse {
  status: string;
  token: string;
  user?: User;
  organization?: {
    _id: string;
    name: string;
    email: string;
    panOrVatNumber?: string;
    phone?: string;
    address?: string;
    isActive: boolean;
    alternativeNumber?: string;
    latitude?: number;
    longitude?: number;
  };
}

export const registerOrganization = async (data: RegisterOrganizationRequest): Promise<RegisterOrganizationResponse> => {
  try {
    const response = await api.post<RegisterOrganizationResponse>('/auth/register', data);

    if (!response || !response.data) {
      throw new Error('Invalid response from server');
    }

    return response.data;
  } catch (error: any) {
    console.error('Failed to register organization:', error);
    throw error.response?.data || { message: 'Failed to register organization' };
  }
};

// ✅ Function to register super admin
export interface RegisterSuperAdminRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  gender: string;
  dateOfBirth: string; // Format: YYYY-MM-DD
  citizenshipNumber: string;
}

export const registerSuperAdmin = async (data: RegisterSuperAdminRequest): Promise<void> => {
  try {
    await api.post('/auth/register/superadmin', data);
    // No response body returned from this endpoint
  } catch (error: any) {
    console.error('Failed to register super admin:', error);
    throw error.response?.data || { message: 'Failed to register super admin' };
  }
};
