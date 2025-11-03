import api from './api';
// --- REMOVED: systemUserService import ---

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

// Function to handle user login
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    // --- REMOVED: The entire 'if (systemUser) { ... }' block ---

    // Proceed with regular API login for ALL users
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    });

    if (response.data && response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(LOGIN_TIME_KEY, Date.now().toString());
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.data.user));
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to handle user logout
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('systemUser'); // Keep this to clear out old data
  localStorage.removeItem(LOGIN_TIME_KEY); 
  localStorage.removeItem(USER_KEY); 

  window.location.href = '/';
};