import API from "./axios";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const signupApi = (data: { username: string; email: string; password?: string }) =>
  API.post<AuthResponse>("/user/signup", data);

export const signinApi = (data: { email: string; password?: string }) =>
  API.post<AuthResponse>("/user/signin", data);

export const googleAuthApi = (credential: string) =>
  API.post<AuthResponse>("/user/google", { credential });

export const getMeApi = () =>
  API.get<{ user: AuthUser }>("/user/me");
