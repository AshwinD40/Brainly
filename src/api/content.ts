import API from "./axios";
import type { Content } from "../types/content";

export interface CreateContentPayload {
  title: string;
  type: string;
  link: string;
  tags?: string[];
}

export interface CreateContentResponse {
  content: Content;
}

export const createContent = (data: CreateContentPayload) =>
  API.post<CreateContentResponse>("/content/createContent", data);

export const getUserContents = () => API.get("/content/user");

export const deleteContent = (contentId: string) =>
  API.delete(`/content/${contentId}`);
