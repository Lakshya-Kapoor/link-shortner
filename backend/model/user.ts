import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  myURLs: [{ type: mongoose.Schema.Types.ObjectId, ref: "URL" }],
});

const user = mongoose.model("User", userSchema);
export default user;
