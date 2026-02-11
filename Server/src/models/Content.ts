import { Schema, model } from "mongoose";

const contentType = ["youtube", "twitter", "instagram", "article", "audio", "video", "image", "other"];

const contentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: contentType,
  },
  link: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: String,
      ref: "Tag",
    }
  ],
  userId: {
    type: String,
    ref: "User",
    required: true,
  }
},
  {
    timestamps: true,
  }
)

export const Content = model("Content", contentSchema);
