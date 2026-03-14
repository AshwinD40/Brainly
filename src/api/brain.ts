import API from "./axios";

export const shareBrain = async () => {
  const response = await API.post("/brain/share");
  return response.data;
};

export const getBrain = async (shareId: string) => {
  const response = await API.get(`/brain/${shareId}`, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
    params: {
      _: Date.now(),
    },
  });
  return response.data;
};
