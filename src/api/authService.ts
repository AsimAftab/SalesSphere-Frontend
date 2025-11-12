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
  

  avatarUrl?: string;
  avatar?: string;
  position?: string;
}


type AuthStateListener = (user: User | null) => void;
const authStateListeners = new Set<AuthStateListener>();


let cachedUser: User | null = null;
let userFetchPromise: Promise<User> | null = null;

const notifyAuthChange = (user: User | null) => {
  cachedUser = user; 
  if (user === null) {
    userFetchPromise = null; 
  }
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

export const fetchCsrfToken = async (): Promise<void> => {
  try {
    const { data } = await api.get('/csrf-token');
    if (data.csrfToken) {
      setCsrfToken(data.csrfToken);
    }
  } catch (error) {
  }
};


export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    await api.get('/auth/check-status');
    return true;
  } catch (error) {
    return false;
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
    localStorage.removeItem(LOGIN_TIME_KEY);
    notifyAuthChange(null);
    if (!window.location.pathname.includes('/login')) {
      window.location.replace('/');
    }
  }
};

/**
 * 3. MODIFIED getCurrentUser (with caching and mapping)
 */
export const getCurrentUser = async (): Promise<User> => {
  if (cachedUser) {
    return cachedUser;
  }
  if (userFetchPromise) {
    return userFetchPromise;
  }
  userFetchPromise = (async () => {
    try {
      const response = await api.get<{ data: User }>('/users/me');
      
      let userData = response.data.data;

      if (userData.avatarUrl && !userData.avatar) {
        userData.avatar = userData.avatarUrl;
      }
      if (userData.role) {
        userData.position = userData.role;
      }

      notifyAuthChange(userData);
      return userData;

    } catch (error: any) {
      userFetchPromise = null;
      notifyAuthChange(null);
      if (error.response?.status !== 401) {
      }
      throw error;
    }
  })();
  return userFetchPromise;
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
      throw new Error('Invalid response from server.');
    }
    return response.data;
  } catch (error: any) {
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
    throw error.response?.data || { message: 'Failed to register super admin' };
  }
};