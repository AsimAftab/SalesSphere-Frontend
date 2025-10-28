import api from './api';
import { authenticateSystemUser } from './services/superadmin/systemUserService';

// Define the shape of the response you expect from the backend
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
    // First, check if this is a system user (super-admin or developer)
    const systemUser = await authenticateSystemUser(email, password);

    if (systemUser) {
      // Store system user info in localStorage
      localStorage.setItem('systemUser', JSON.stringify(systemUser));

      // Return mock login response for system users
      return {
        status: 'success',
        token: 'mock-system-user-token-' + systemUser.id,
        data: {
          user: {
            _id: systemUser.id,
            name: systemUser.name,
            email: systemUser.email,
            role: systemUser.role
          }
        }
      };
    }

    // If not a system user, proceed with regular API login
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    // Log the error for debugging and re-throw it for the component to handle
    if (error instanceof Error) {
      console.error("Login failed:", error.message);
    } else {
      console.error("Login failed:", String(error));
    }
    throw error;
  }
};

// Function to handle user logout
export const logout = () => {
    // 1. Remove the token and system user from localStorage
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('systemUser');

    // 2. Redirect the user to the login page to clear state
    window.location.href = '/login';
};