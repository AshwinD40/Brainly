import {Schema, model} from "mongoose";

const tagSchema = new Schema({
  name:{
    type: String,
    unique: true,
  },
})

export const Tag = model("Tag", tagSchema);
