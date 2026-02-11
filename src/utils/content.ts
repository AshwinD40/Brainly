export const getYoutubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const getTwitterId = (url: string): string | null => {
  const regExp = /^https?:\/\/(www\.)?(twitter|x)\.com\/\w+\/status\/(\d+)/;
  const match = url.match(regExp);
  return match ? match[3] : null;
};

export const getInstagramId = (url: string): string | null => {
  const regExp = /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\/([a-zA-Z0-9_-]+)/;
  const match = url.match(regExp);
  return match ? match[3] : null;
}
