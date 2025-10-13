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

// Add 'string' type to the parameters
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Login failed:", error.message);
    } else {
      console.error("Login failed:", String(error));
    }
    throw error;
  }
};