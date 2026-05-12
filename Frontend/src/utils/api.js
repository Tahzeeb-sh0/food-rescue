/**
 * Thin wrapper around fetch that automatically attaches the JWT
 * Authorization header from localStorage when a token is present.
 *
 * Usage:
 *   import { apiFetch } from '../utils/api';
 *   const res = await apiFetch('/api/donations', { method: 'POST', body: JSON.stringify(data) });
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/** Base URL for building endpoints (same as env default used by {@link apiFetch}). */
export const API_BASE = BASE_URL;

export function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(`${BASE_URL}${path}`, { ...options, headers });
}

export default apiFetch;
