// Central API base URL — reads from .env, falls back to localhost for development
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
