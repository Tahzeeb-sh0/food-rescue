import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute component to secure sensitive routes.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The component to render if authenticated.
 * @param {string} [props.requiredRole] - Optional role requirement ('NGO' or 'Donor').
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    // Redirect to the appropriate login page based on the attempted path
    const loginPath = location.pathname.includes('/donor') ? '/donor/login' : '/ngo/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // If roles don't match, redirect to their own dashboard or home
    const redirectPath = user.role === 'NGO' ? '/ngo/dashboard' : '/donor/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
