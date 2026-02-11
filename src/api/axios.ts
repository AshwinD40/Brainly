import axios from "axios";
import { auth } from "../utils/auth";

const rawBackendUrl =
  (import.meta.env.VITE_BACKEND_URL as string | undefined)?.trim() ||
  "http://localhost:4000";

// Accept either https://host or https://host/api/v1 and normalize to one base.
const normalizedBackendUrl = rawBackendUrl
  .replace(/\/+$/, "")
  .replace(/\/api\/v1$/i, "");

export const API = axios.create({
  baseURL: `${normalizedBackendUrl}/api/v1`,
});

API.interceptors.request.use((config) => {
  const token = auth.token();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
