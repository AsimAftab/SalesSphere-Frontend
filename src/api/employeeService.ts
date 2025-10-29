import api from './api';

// --- TYPE DEFINITION ---
export interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
  organizationId?: string;
  isActive?: boolean;
  avatarUrl?: string;
  phone?: string;
  address?: string;
  gender?: string;
  // FIX: Re-added 'age' as it's a virtual property sent by the backend.
  age?: number; 
  dateOfBirth?: string; // Correct property for the date field
  panNumber?: string;
  citizenshipNumber?: string;
  dateJoined?: string;
  documents?: {
      _id?: string;
      name: string;
      url: string;
      uploadedAt?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export type UpdateEmployeeData = {
  phone?: string;
  address?: string;
  role?: string;
  name?: string;
  email?: string;
  gender?: string;
  dateOfBirth?: string; // Use dateOfBirth for updating
  panNumber?: string;
  citizenshipNumber?: string;
  dateJoined?: string;
};

// --- RESPONSE TYPE INTERFACES (from backend) ---
interface GetEmployeesResponse {
  success: boolean;
  data: Employee[];
}

interface EmployeeResponse {
  success: boolean;
  data: Employee;
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

interface DocumentUploadResponse {
    success: boolean;
    message: string;
    data: {
        filename: string;
        fileUrl: string;
    }[];
}

// --- API FUNCTIONS ---

export const getEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await api.get<GetEmployeesResponse>('/users');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getEmployeeById = async (userId: string): Promise<Employee> => {
    try {
        const response = await api.get<EmployeeResponse>(`/users/${userId}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const addEmployee = async (formData: FormData): Promise<Employee> => {
  try {
    const response = await api.post<EmployeeResponse>(
      '/users',
      formData,
      {
        timeout: 0, // ⏱ disable timeout for this request
        headers: {
          'Content-Type': 'multipart/form-data', // ✅ required for file uploads
        },
      }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};


export const uploadEmployeeDocuments = async (userId: string, documents: File[]): Promise<DocumentUploadResponse> => {
  try {
    const formData = new FormData();
    documents.forEach((file) => {
      formData.append('documents', file); // ✅ field name matches backend
    });

    const response = await api.post<DocumentUploadResponse>(
      `/users/${userId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // ✅ important
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};


// FIX: Update function signature to accept FormData or UpdateEmployeeData
export const updateEmployee = async (userId: string, updateData: UpdateEmployeeData | FormData): Promise<Employee> => {
  try {
    const response = await api.put<EmployeeResponse>(`/users/${userId}`, updateData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const deleteEmployee = async (userId: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.delete<DeleteResponse>(`/users/${userId}`);
    return { success: response.data.success };
  } catch (error) {
    throw error;
  }
};

export const getMyProfile = async (): Promise<Employee> => {
  try {
    const response = await api.get<EmployeeResponse>('/users/me');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};