import { API } from "./axios";

export const shareBrain = async () => {
  // /brain/share matches the route structure implementation
  const response = await API.post("/brain/share");
  return response.data;
};

export const getBrain = async (shareId: string) => {
  const response = await API.get(`/brain/${shareId}`);
  return response.data;
};
