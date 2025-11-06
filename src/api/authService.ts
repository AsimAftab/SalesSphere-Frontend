import api from './api';
import { clearAuthStorage } from '../components/auth/authutils';

const TOKEN_KEY = 'authToken';
const LOGIN_TIME_KEY = 'loginTime';
const USER_KEY = 'user';

export interface LoginResponse {
  status: string;
  token: string;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
    };
  };
}

// ✅ Function to handle user login
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });

    // ✅ Validate response properly
    if (!response || !response.data || !response.data.token) {
      throw new Error('Invalid response from server.');
    }

    // ✅ Save token and user data only on successful login
    localStorage.setItem(TOKEN_KEY, response.data.token);
    localStorage.setItem(LOGIN_TIME_KEY, Date.now().toString());
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.data.user));

    return response.data;
  } catch (error: any) {
    // ✅ Handle network / backend down errors
    if (!error.response) {
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
