import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const rawBase = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:4000";
const BASE_URL = rawBase.endsWith("/api/v1")
  ? rawBase
  : `${rawBase}/api/v1`;

export const TOKEN_KEY = "brainly_token";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
