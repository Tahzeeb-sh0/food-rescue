import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Listens for auth:session-expired (from apiFetch on 401) and sends the user to the correct login.
 */
export default function SessionExpiredRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const onExpired = () => {
      const role = sessionStorage.getItem('activeRole');
      sessionStorage.removeItem('activeRole');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const path = role === 'NGO' ? '/ngo/login' : '/donor/login';
      navigate(path, { replace: true, state: { sessionExpired: true } });
    };
    window.addEventListener('auth:session-expired', onExpired);
    return () => window.removeEventListener('auth:session-expired', onExpired);
  }, [navigate]);

  return null;
}
