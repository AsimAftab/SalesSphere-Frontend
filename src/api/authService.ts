import api, { setCsrfToken } from './api';

const LOGIN_TIME_KEY = 'loginTime'; 


export interface User {
  _id: string;
  id?: string;
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
  dateOfBirth?: string; 
}


type AuthStateListener = (user: User | null) => void;
const authStateListeners = new Set<AuthStateListener>();

const notifyAuthChange = (user: User | null) => {
  authStateListeners.forEach((listener) => listener(user));
};


export const subscribeToAuthChanges = (
  listener: AuthStateListener
): (() => void) => {
  authStateListeners.add(listener);
 
  return () => {
    authStateListeners.delete(listener);
  };
};


export interface LoginResponse {
  status: string;
  data?: {
    user?: User;
  };
}

export interface GetUserResponse {
  success: boolean;
  data: User;
}

export const fetchCsrfToken = async (): Promise<void> => {
  try {
    const { data } = await api.get('/csrf-token');
    if (data.csrfToken) {
      setCsrfToken(data.csrfToken); 
    }
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    });

    if (!response || !response.data || !response.data.data?.user) {
      throw new Error('Invalid response from server.');
    }

    localStorage.setItem(LOGIN_TIME_KEY, Date.now().toString());

    const userProfile: User = response.data.data.user;
    notifyAuthChange(userProfile);

    return response.data;
  } catch (error: any) {
    if (!error.response) {
      console.error('Network error during login');
    }
    localStorage.removeItem('loginTime');
    notifyAuthChange(null);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
  } finally {
    localStorage.removeItem('loginTime');
    notifyAuthChange(null);
    if (!window.location.pathname.includes('/login')) {
      window.location.replace('/'); 
    }
  }
};


export const forgotPassword = async (
  email: string
): Promise<{ status: string; message: string }> => {
  try {
    await api.post('/auth/forgotpassword', { email });
    return {
      status: 'success',
      message: 'If that email is registered, Password Reset Link has been sent.',
    };
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to send reset link' };
  }
};

export const resetPassword = async (
  token: string,
  password: string,
  passwordConfirm: string
) => {
  try {
    const response = await api.patch(`/auth/resetpassword/${token}`, {
      password,
      passwordConfirm,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to reset password' };
  }
};

export const contactAdmin = async (data: {
  fullName: string;
  email: string;
  department?: string;
  requestType: string;
  message: string;
}) => {
  try {
    const response = await api.post('/auth/contact-admin', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to contact admin' };
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<{ data: User }>('/users/me');
    return response.data.data;
  } catch (error: any) {
    // ✅ This only logs errors that are *not* a 401
    if (error.response?.status !== 401) {
      console.error('Failed to fetch current user:', error);
    }
    throw error;
  }
};

export interface RegisterOrganizationRequest {
  name: string;
  email: string;
  organizationName: string;
  panVatNumber?: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  googleMapLink?: string;
  subscriptionType?: string;
  checkInTime?: string;
  checkOutTime?: string;
  weeklyOffDay?: string;
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


export const registerOrganization = async (
  data: RegisterOrganizationRequest
): Promise<RegisterOrganizationResponse> => {
  try {
    const response = await api.post<RegisterOrganizationResponse>(
      '/auth/register',
      data
    );
    if (!response || !response.data) {
      throw new Error('Invalid response from server');
    }
    return response.data;
  } catch (error: any) {
    console.error('Failed to register organization:', error);
    throw error.response?.data || { message: 'Failed to register organization' };
  }
};


export interface RegisterSuperAdminRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  gender: string;
  dateOfBirth: string; 
  citizenshipNumber: string;
}


export const registerSuperAdmin = async (
  data: RegisterSuperAdminRequest
): Promise<void> => {
  try {
    await api.post('/auth/register/superadmin', data);
  } catch (error: any) {
    console.error('Failed to register super admin:', error);
    throw error.response?.data || { message: 'Failed to register super admin' };
  }
};

