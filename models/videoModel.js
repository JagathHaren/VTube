import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  thumbnail: { type: String },
  channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
  category: { type: String, default: "General" },   // new field
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  duration: { type: String, default: "10:00" }
}, { timestamps: true });


export default mongoose.model("Video", videoSchema);
