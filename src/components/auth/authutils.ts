// src/components/auth/authutils.ts
export const clearAuthStorage = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('systemUser');
  localStorage.removeItem('user');
  localStorage.removeItem('loginTime');
};
