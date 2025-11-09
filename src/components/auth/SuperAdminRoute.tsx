import React from 'react';
import RoleBasedRoute from './RoleBasedRoute';

/**
 * Route guard specifically for Super Admin and Developer access
 * Shorthand for RoleBasedRoute with superadmin and developer roles
 */
const SuperAdminRoute: React.FC = () => {
  return <RoleBasedRoute allowedRoles={['superadmin', 'super admin', 'developer']} redirectTo="/dashboard" />;
};

export default SuperAdminRoute;
