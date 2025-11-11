import express from "express";
import {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
  getChannelVideos,
  searchVideos,
  increaseView
} from "../controllers/videoController.js";
import { protect } from "../middlewares/authMiddleware.js";
import {isChannelOwner} from "../middlewares/ownerShipMiddlerWare.js"
import upload from "../middlewares/multer.js"

const router = express.Router();

// ✅ Specific routes first
router.get("/search", searchVideos);                // Search & filter
router.get("/channel/:channelId", getChannelVideos); // Channel video library

// ✅ General video routes
router.get("/", getVideos);                         // Get all videos
router.get("/:id", getVideoById);                   // Get single video

// ✅ Protected routes
router.post("/:channelId", protect, isChannelOwner,upload.fields([{ name: "video" }, { name: "thumbnail" }]), createVideo);             // Upload video
router.put("/:id", protect,  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
 updateVideo);           // Update video
router.delete("/:id", protect, deleteVideo);        // Delete video

// ✅ Engagement routes
router.post("/:id/like", protect, likeVideo);       // Like video
router.post("/:id/dislike", protect, dislikeVideo); // Dislike video

router.patch("/:id/view", increaseView);




export default router;
