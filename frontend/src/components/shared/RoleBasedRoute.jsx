import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  // Get user role from localStorage or your auth context
  const userRole = localStorage.getItem('userRole');
  
  console.log('RoleBasedRoute check:', {
    userRole,
    allowedRoles,
    hasRole: userRole && allowedRoles.includes(userRole)
  });

  if (!userRole) {
    console.log('No user role found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    console.log(`User role "${userRole}" not in allowed roles:`, allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleBasedRoute; 