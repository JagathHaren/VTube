import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  banner: { type: String }, // optional, like a cover image
  logo: { type: String }, // optional, like a cover image
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

export default mongoose.model("Channel", channelSchema);
