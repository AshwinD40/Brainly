import { API } from "./axios";

export interface CreateContentPayload {
  title: string;  
  type: string;
  link: string;
  tags?: string[];
}

export const createContent = (data: CreateContentPayload)  => 
  API.post('/content/createContent', data);

export const getUserContents = () =>
  API.get(`/content/user`);

export const deleteContent = (contentId: string ) =>
  API.delete(`/content/${contentId}`);