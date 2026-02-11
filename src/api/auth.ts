import { auth } from "../utils/auth";
import API  from "./axios";

export interface SignupPayload {
  username: string;
  password: string;
};

export interface SigninPayload {
  username: string;
  password: string;
};

export const signup = async (data: SignupPayload) => {
  const res = await API.post("/auth/signup", data);
  return res.data;
}

export const signin = async (data: SigninPayload) => {
  const res = await API.post ("/auth/signin", data);

  const { token, userId, username } = res.data;

  auth.set({
    token,
    id: userId,
    username
  })

  return res.data;
};

export const logout = () => {
  auth.clear();
}


