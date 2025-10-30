import api from './api';
import { authenticateSystemUser } from './services/superadmin/systemUserService';

// Use constants for the keys to avoid typos
const TOKEN_KEY = 'authToken';
const LOGIN_TIME_KEY = 'loginTime'; 

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

// Function to handle user login
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    // 1. Check for system user
    const systemUser = await authenticateSystemUser(email, password);

    if (systemUser) {
      const mockToken = 'mock-system-user-token-' + systemUser.id;
      
      localStorage.setItem(TOKEN_KEY, mockToken);
      localStorage.setItem('systemUser', JSON.stringify(systemUser));
      localStorage.setItem(LOGIN_TIME_KEY, Date.now().toString()); 
      
      return {
        status: 'success',
        token: mockToken,
        data: {
          user: {
            _id: systemUser.id,
            name: systemUser.name,
            email: systemUser.email,
            role: systemUser.role,
          },
        },
      };
    }

    // 2. If not system user, proceed with regular API login
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    });

    if (response.data && response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(LOGIN_TIME_KEY, Date.now().toString());
    }

    return response.data;
  } catch (error) {
    // --- Console logs removed ---
    // The component that calls loginUser (e.g., LoginForm)
    // will handle catching this error and showing a message to the user.
    throw error;
  }
};

// Function to handle user logout
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('systemUser');
  localStorage.removeItem(LOGIN_TIME_KEY); 

  window.location.href = '/';
};