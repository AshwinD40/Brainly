import mongoose, { Schema, type Document } from "mongoose";

export interface IContent extends Document {
  userId: string;
  clerkUserId?: string;
  title: string;
  type: "youtube" | "twitter" | "instagram" | "article" | "audio" | "video" | "image" | "other";
  link: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    userId: { type: String, required: true, index: true },
    clerkUserId: { type: String, index: true },
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["youtube", "twitter", "instagram", "article", "audio", "video", "image", "other"],
      required: true,
    },
    link: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

ContentSchema.pre("validate", function () {
  const userId = this.get("userId") as string | undefined;
  const clerkUserId = this.get("clerkUserId") as string | undefined;

  if (!userId && clerkUserId) {
    this.set("userId", clerkUserId);
  }

  if (!clerkUserId && userId) {
    this.set("clerkUserId", userId);
  }
});

export const Content = mongoose.model<IContent>("Content", ContentSchema);
