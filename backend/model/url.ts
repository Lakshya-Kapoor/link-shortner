import mongoose, { Schema } from "mongoose";

const URLSchema = new Schema({
  shortURL: { type: String, required: true },
  originalURL: { type: String, required: true },
});

const url = mongoose.model("URL", URLSchema);
export default url;
