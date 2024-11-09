import mongoose, { Schema } from "mongoose";

const urlSchema = new Schema({
  shortURL: { type: String, required: true },
  originalURL: { type: String, required: true },
});

const url = mongoose.model("URL", urlSchema);
export default url;
