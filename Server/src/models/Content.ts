import mongoose, { Schema, type Document } from "mongoose";

export interface IContent extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  type: "youtube" | "twitter" | "instagram" | "article" | "audio" | "video" | "image" | "other";
  link: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
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

ContentSchema.index({ userId: 1, createdAt: -1 });

export const Content = mongoose.model<IContent>("Content", ContentSchema);
