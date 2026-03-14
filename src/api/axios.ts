import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const rawBase = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:4000";
const BASE_URL = rawBase.endsWith("/api/v1")
  ? rawBase
  : `${rawBase}/api/v1`;

// Clerk token injector — set this from your React tree
// We use a module-level getter so the axios instance always gets a fresh token
let _getToken: (() => Promise<string | null>) | null = null;

export const setTokenGetter = (fn: () => Promise<string | null>) => {
  _getToken = fn;
};

export const clearTokenGetter = () => {
  _getToken = null;
};

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (!_getToken) {
    return config;
  }

  const token = await _getToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
