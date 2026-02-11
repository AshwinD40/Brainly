export interface CreateContentDTO {
  title: string;
  link: string;
  type: "youtube" | "twitter" | "instagram" | "article" | "audio" | "video" | "image" | "other";
  tags?: string[];
}