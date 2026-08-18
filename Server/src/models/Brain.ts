import mongoose, { Schema, type Document } from "mongoose";
import { nanoid } from "nanoid";

export interface IBrain extends Document {
  userId: mongoose.Types.ObjectId;
  shareId: string;
  isShared: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BrainSchema = new Schema<IBrain>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    shareId: { type: String, default: () => nanoid(12), unique: true },
    isShared: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Brain = mongoose.model<IBrain>("Brain", BrainSchema);
