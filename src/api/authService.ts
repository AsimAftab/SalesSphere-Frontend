import api from './api';

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
    // 1. Remove the token from localStorage
    localStorage.removeItem('jwtToken');

    // 2. Redirect the user to the login page to clear state
    window.location.href = '/login'; 
};