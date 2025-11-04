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
      console.error('🚫 Cannot connect to backend. Please check if the server is running.');
      alert('🚫 Cannot connect to the server. Please check if the backend is running.');
    }

    // ✅ Clear any partial or stale data
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
