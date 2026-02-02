const SYSTEM_ADMIN_ROLES = ['superadmin', 'super admin', 'developer'];

export const getPostLoginPath = (role?: string): string => {
  const normalized = role?.toLowerCase() ?? '';
  return SYSTEM_ADMIN_ROLES.includes(normalized) ? '/system-admin' : '/dashboard';
};
