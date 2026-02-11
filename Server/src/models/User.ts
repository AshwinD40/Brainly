import {Schema, model} from "mongoose";

const userSchema = new Schema(
  {
    username:{
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password:{
      type: String,
      required: true,
    },
    shareId: {
      type:String,
      unique: true,
      index:true,
    }
  },
  {
    timestamps: true,
  }
)

export const User = model("User", userSchema);
