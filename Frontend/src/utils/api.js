/**
 * Thin wrapper around fetch that automatically attaches the JWT
 * Authorization header from localStorage when a token is present.
 *
 * Usage:
 *   import { apiFetch } from '../utils/api';
 *   const res = await apiFetch('/api/donations', { method: 'POST', body: JSON.stringify(data) });
 */

function normalizeApiBase(raw) {
  if (raw === undefined || raw === null) return 'http://localhost:8080';
  const s = String(raw).trim();
  if (s === '') return '';
  return s.replace(/\/$/, '');
}

const BASE_URL = normalizeApiBase(import.meta.env.VITE_API_BASE_URL);

/** Base URL for building endpoints (empty in local dev → same-origin + Vite proxy). */
export const API_BASE = BASE_URL;

/** Backend host for UI copy when {@link API_BASE} is empty (dev proxy). */
export const API_BACKEND_DISPLAY =
  BASE_URL === '' ? 'http://localhost:8080' : BASE_URL;

export function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(`${BASE_URL}${path}`, { ...options, headers }).then((res) => {
    if (res.status === 401 && token) {
      window.dispatchEvent(new Event('auth:session-expired'));
    }
    return res;
  });
}

export default apiFetch;
