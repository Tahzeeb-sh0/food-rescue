import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();

  let user = null;
  try {
    const raw = localStorage.getItem('user');
    if (raw) user = JSON.parse(raw);
  } catch {
    // Corrupted localStorage — treat as logged out
    localStorage.removeItem('user');
  }

  if (!user) {
    const loginPath = location.pathname.includes('/donor') ? '/donor/login' : '/ngo/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    const loginPath = user.role === 'NGO' ? '/ngo/login' : '/donor/login';
    return <Navigate to={loginPath} state={{ from: location, reason: 'no-token' }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    const redirectPath = user.role === 'NGO' ? '/ngo/dashboard' : '/donor/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
