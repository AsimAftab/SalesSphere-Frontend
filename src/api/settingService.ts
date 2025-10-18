// src/services/settingsService.ts
//import { api } from '../api'; // your axios instance (like in analyticsService)

// Mock user data
let mockUser = {
  firstName: 'Admin',
  lastName: 'Manager',
  dob: '1995-10-07',
  email: 'admin@salessphere.com',
  phone: '9800000000',
  position: 'Manager',
  pan: '00000000000000',
  citizenship: '05-02-76-00582',
  gender: 'Male',
  location: 'Shanti Chowk, Biratnagar, Nepal',
  photoPreview: 'https://i.pravatar.cc/300?u=admin',
};

// --- Fetch User Settings ---
export const getUserSettings = async () => {
  // Mock delay
  await new Promise((r) => setTimeout(r, 600));
  return mockUser;
  // For real API:
  // const res = await api.get('/settings/profile');
  // return res.data;
};

// --- Update User Profile ---
export const updateUserSettings = async (updatedData: any) => {
  mockUser = { ...mockUser, ...updatedData };
  await new Promise((r) => setTimeout(r, 600));
  return mockUser;
  // Real API:
  // const res = await api.put('/settings/profile', updatedData);
  // return res.data;
};

// --- Change Password ---
export const updateUserPassword = async (current: string, next: string) => {
  console.log('Mock password change:', { current, next });
  await new Promise((r) => setTimeout(r, 600));
  // Real API:
  // return await api.post('/settings/change-password', { current, new: next });
};
